'use strict'

const fp = require('fastify-plugin')
const { createHash } = require('node:crypto')
const fnv1a = require('./fnv1a')

function validateAlgorithm (algorithm) {
  if (algorithm === 'fnv1a') {
    return true
  }

  // validate that the algorithm is supported by the node runtime
  try {
    createHash(algorithm)
  } catch (e) {
    throw new TypeError(`Algorithm ${algorithm} not supported.`)
  }
}

function buildHashFn (algorithm = 'sha1', weak = false) {
  validateAlgorithm(algorithm)

  const prefix = weak ? 'W/"' : '"'
  if (algorithm === 'fnv1a') {
    return (payload) => prefix + fnv1a(payload).toString(36) + '"'
  }

  return (payload) => prefix + createHash(algorithm)
    .update(payload).digest('base64') + '"'
}

async function fastifyEtag (app, { algorithm, weak, replyWith304 = true }) {
  const hash = buildHashFn(algorithm, weak)

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

    if (req.headers['if-none-match'] === etag && replyWith304) {
      reply.code(304)
      newPayload = ''
    }
    done(null, newPayload)
  })
}

module.exports = fp(fastifyEtag, {
  fastify: '4.x',
  name: '@fastify/etag'
})
module.exports.default = fastifyEtag
module.exports.fastifyEtag = fastifyEtag
