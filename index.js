'use strict'

const fp = require('fastify-plugin')
const { createHash } = require('crypto')
const fnv1a = require('./fnv1a')

function buildHashFn (algorithm = 'fnv1a', weak = false) {
  const prefix = weak ? 'W/"' : '"'
  if (algorithm === 'fnv1a') {
    return (payload) => prefix + fnv1a(payload).toString(36) + '"'
  }

  return (payload) => prefix + createHash(algorithm)
    .update(payload).digest().toString('base64') + '"'
}

module.exports = fp(async function etag (app, opts) {
  const hash = buildHashFn(opts.algorithm, opts.weak)

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

    if (req.headers['if-none-match'] === etag) {
      reply.code(304)
      newPayload = ''
    }
    done(null, newPayload)
  })
}, {
  fastify: '3.x',
  name: 'fastify-etag'
})
