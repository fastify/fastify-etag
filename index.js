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
  const prefix = weak ? 'W/"' : '"'
  let streamHash

  if (typeof hash !== 'function') {
    if (algorithm === 'fnv1a') {
      // TODO: remove in next major
      emitDeprecationWarning()
      hash = fnv1a
    } else {
      lazyLoadCreateHash()
      validateAlgorithm(algorithm)
      hash = (payload) => createHash(algorithm).update(payload).digest('base64')
      streamHash = (stream) => {
        const hashStream = createHash(algorithm)
        stream.on('data', (chunk) => {
          hashStream.update(chunk)
        })
        return (_reply, _payload, done) => {
          done(null, prefix + hashStream.digest('base64') + '"')
        }
      }
    }
  }

  const syncHash = (payload) => prefix + hash(payload) + '"'
  if (!streamHash) {
    streamHash = (stream) => {
      const chunks = []
      stream.on('data', (chunk) => {
        chunks.push(Buffer.from(chunk))
      })
      return (_reply, _payload, done) => {
        done(null, syncHash(Buffer.concat(chunks)))
      }
    }
  }

  return { hash: syncHash, streamHash }
}

async function fastifyEtag (app, { algorithm, hashFn, weak, replyWith304 = true, trailer = false }) {
  const { hash, streamHash } = buildHashFn(algorithm, weak, hashFn)

  app.addHook('onSend', function (req, reply, payload, done) {
    if (reply.hasTrailer('etag')) {
      done(null, payload)
      return
    }

    let etag = reply.getHeader('etag')
    let newPayload

    // we do not generate with an already existing etag
    if (!etag) {
      if (trailer && typeof payload?.pipe === 'function') {
        reply.trailer('etag', streamHash(payload))
        done(null, newPayload)
        return
      }

      // we do not generate etags for anything but strings and buffers
      if (!(typeof payload === 'string' || payload instanceof Buffer)) {
        done(null, newPayload)
        return
      }

      etag = hash(payload)
      if (trailer) {
        reply.trailer('etag', function (_reply, _payload, cb) {
          cb(null, etag)
        })
      } else {
        reply.header('etag', etag)
      }
    }

    if (replyWith304 && (req.headers['if-none-match'] === etag || req.headers['if-none-match'] === 'W/' + etag || 'W/' + req.headers['if-none-match'] === etag)) {
      if (trailer) {
        reply.removeTrailer('etag')
        reply.header('etag', etag)
      }
      reply.code(304)
      newPayload = null
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
