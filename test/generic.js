'use strict'

const Fastify = require('fastify')
const Etag = require('..')
const { createReadStream } = require('fs')

module.exports = function ({ test }, etagOpts, hashFn) {
  function build (opts = {}) {
    const app = Fastify()
    app.register(Etag, Object.assign({}, opts, etagOpts))

    app.get('/', async (req, reply) => {
      return { hello: 'world' }
    })

    app.get('/etag', async (req, reply) => {
      reply.header('etag', 'foobar')
      return 'world'
    })

    app.get('/stream', async (req, reply) => {
      return createReadStream(__filename)
    })

    return app
  }

  const hash = hashFn(JSON.stringify({ hello: 'world' }))

  test('returns an etag for each request', async (t) => {
    const res = await build().inject({
      url: '/'
    })

    t.same(JSON.parse(res.body), { hello: 'world' })
    t.match(res.headers, {
      'etag': hash
    })
  })

  test('returns a 304 if etag matches', async (t) => {
    const res = await build().inject({
      url: '/',
      headers: {
        'If-None-Match': hash
      }
    })

    t.is(res.statusCode, 304)
    t.is(res.body, '')
    t.match(res.headers, {
      'content-length': '0',
      'etag': hash
    })
  })

  test('returns an already existing etag', async (t) => {
    const res = await build().inject({
      url: '/etag'
    })

    t.is(res.statusCode, 200)
    t.match(res.headers, {
      'etag': 'foobar'
    })
  })

  test('does not generate etags for streams', async (t) => {
    const res = await build().inject({
      url: '/stream'
    })

    t.is(res.statusCode, 200)
    t.is(res.headers.etag, undefined)
  })

  test('returns a 304 if etag matches and it is provided by the route', async (t) => {
    const res = await build().inject({
      url: '/etag',
      headers: {
        'If-None-Match': 'foobar'
      }
    })

    t.is(res.statusCode, 304)
    t.is(res.body, '')
    t.match(res.headers, {
      'content-length': '0',
      'etag': 'foobar'
    })
  })
}
