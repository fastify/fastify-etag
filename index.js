'use strict'

const fp = require('fastify-plugin')
const { createHash } = require('crypto')
const fnv1a = require('./fnv1a')

function buildHashFn (algorithm = 'fnv1a') {
  if (algorithm === 'fnv1a') {
    return (payload) => '"' + fnv1a(payload).toString(36) + '"'
  }

  return (payload) => '"' + createHash(algorithm)
    .update(payload).digest().toString('base64') + '"'
}

module.exports = fp(async function etag (app, opts) {
  const hash = buildHashFn(opts.algorithm)

  app.addHook('onSend', async function (req, reply, payload) {
    let etag = reply.getHeader('etag')

    // we do not generate with an already existing etag
    if (!etag) {
      // we do not generate etags for anything but strings and buffers
      if (!(typeof payload === 'string' || payload instanceof Buffer)) {
        return
      }

      etag = hash(payload)
      reply.header('etag', etag)
    }

    if (req.headers['if-none-match'] === etag) {
      reply.code(304)
      return null;
    }
  })
}, {
  fastify: '2.x',
  name: 'fastify-etag'
})
