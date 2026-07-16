'use strict'

const fp = require('fastify-plugin')

let fnv1aHash
function lazyLoadFnv1a () {
  if (typeof fnv1aHash === 'function') return
  fnv1aHash = require('./fnv1a')
}
let createHash
function lazyLoadCreateHash () {
  if (typeof createHash === 'function') return
  createHash = require('node:crypto').createHash
}

// TODO: remove in next major
function emitDeprecationWarning () {
  if (!emitDeprecationWarning.warned) {
    emitDeprecationWarning.warned = true
    const { emitWarning } = require('node:process')
    emitWarning('Support for passing "fnv1a" in `algorithm` is deprecated and will be removed in the next major version. Please use `hashFn` to provide a custom hash function.', 'DeprecationWarning', 'FSTETAGDEP001')
  }
}

function fnv1a (payload) {
  lazyLoadFnv1a()
  return fnv1aHash(payload).toString(36)
}

function validateAlgorithm (algorithm) {
  // validate that the algorithm is supported by the node runtime
  try {
    createHash(algorithm)
  } catch {
    throw new TypeError(`Algorithm ${algorithm} not supported.`)
  }
}

function buildHashFn (algorithm = 'sha1', weak = false, hash) {
  if (typeof hash !== 'function') {
    if (algorithm === 'fnv1a') {
      // TODO: remove in next major
      emitDeprecationWarning()
      hash = fnv1a
    } else {
      lazyLoadCreateHash()
      validateAlgorithm(algorithm)
      hash = (payload) => createHash(algorithm).update(payload).digest('base64')
    }
  }

  const prefix = weak ? 'W/"' : '"'

  return (payload) => prefix + hash(payload) + '"'
}

async function fastifyEtag (app, { algorithm, hashFn, weak, replyWith304 = true }) {
  const hash = buildHashFn(algorithm, weak, hashFn)

  app.addHook('onSend', function (req, reply, payload, done) {
    let etag = reply.getHeader('etag')
    let newPayload

    // we do not generate with an already existing etag
    if (!etag) {
      // we do not generate etags for anything but strings and buffers
      if (!(typeof payload === 'string' || payload instanceof Buffer)) {
        done(null, newPayload)
        return
      }

      etag = hash(payload)
      reply.header('etag', etag)
    }

    if (replyWith304 && (req.headers['if-none-match'] === etag || req.headers['if-none-match'] === 'W/' + etag || 'W/' + req.headers['if-none-match'] === etag)) {
      reply.code(304)
      newPayload = ''
    }
    done(null, newPayload)
  })
}

module.exports = fp(fastifyEtag, {
  fastify: '5.x',
  name: '@fastify/etag'
})
module.exports.default = fastifyEtag
module.exports.fastifyEtag = fastifyEtag
module.exports.fnv1a = fnv1a
