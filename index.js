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

    if (replyWith304 && isFresh(req, reply, etag)) {
      reply.code(304)
      newPayload = null
    }
    done(null, newPayload)
  })
}

// Same conditions as Express' `req.fresh`: only GET and HEAD requests with a
// 2xx (or 304) response are answered with a 304, and If-None-Match is a list
// of entity tags compared with the weak comparison function (RFC 9110 13.1.2)
function isFresh (req, reply, etag) {
  const ifNoneMatch = req.headers['if-none-match']
  if (!ifNoneMatch || (req.method !== 'GET' && req.method !== 'HEAD')) {
    return false
  }

  const status = reply.statusCode
  if ((status < 200 || status >= 300) && status !== 304) {
    return false
  }

  if (ifNoneMatch.trim() === '*') {
    return true
  }

  const opaqueTag = stripWeak(etag)
  for (const tag of ifNoneMatch.split(',')) {
    if (stripWeak(tag.trim()) === opaqueTag) {
      return true
    }
  }
  return false
}

function stripWeak (tag) {
  return tag.startsWith('W/') ? tag.slice(2) : tag
}

module.exports = fp(fastifyEtag, {
  fastify: '5.x',
  name: '@fastify/etag'
})
module.exports.default = fastifyEtag
module.exports.fastifyEtag = fastifyEtag
module.exports.fnv1a = fnv1a
