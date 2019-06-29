'use strict'

const fp = require('fastify-plugin')
const { createHash } = require('crypto')

module.exports = fp(async function etag (app, opts) {
  const algorithm = opts.algorithm || 'md5'

  app.addHook('onSend', async function (req, reply, payload) {
    let etag = reply.getHeader('etag')

    // we do not generate with an already existing etag
    if (!etag) {
      // we do not generate etags for anything but strings and buffers
      if (!(typeof payload === 'string' || payload instanceof Buffer)) {
        return
      }

      etag = createHash(algorithm)
        .update(payload).digest().toString('base64')
      reply.header('etag', etag)
    }

    if (req.headers['if-none-match'] === etag) {
      reply.code(304)
      return ''
    }
  })
}, {
  fastify: '2.x',
  name: 'fastify-etag'
})
