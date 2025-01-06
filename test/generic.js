'use strict'

const Fastify = require('fastify')
const Etag = require('..')
const { createReadStream } = require('node:fs')

module.exports = function ({ test }, etagOpts, hashFn) {
  function build (opts = {}) {
    const app = Fastify()
    app.register(Etag, Object.assign({}, opts, etagOpts))

    app.get('/', async () => {
      return { hello: 'world' }
    })

    app.get('/etag', async (_req, reply) => {
      reply.header('etag', '"foobar"')
      return 'world'
    })

    app.get('/stream', async () => {
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
      etag: hash
    })
  })

  test('returns a 304 if etag matches', async (t) => {
    const res = await build().inject({
      url: '/',
      headers: {
        'If-None-Match': hash
      }
    })

    t.equal(res.statusCode, 304)
    t.equal(res.body, '')
    t.match(res.headers, {
      'content-length': '0',
      etag: hash
    })
  })

  test('does not return a 304 when behaviour is disabled', async (t) => {
    const res = await build({ replyWith304: false }).inject({
      url: '/',
      headers: {
        'If-None-Match': hash
      }
    })

    t.same(JSON.parse(res.body), { hello: 'world' })
    t.equal(res.statusCode, 200)
    t.match(res.headers, {
      etag: hash
    })
  })

  test('returns an already existing etag', async (t) => {
    const res = await build().inject({
      url: '/etag'
    })

    t.equal(res.statusCode, 200)
    t.match(res.headers, {
      etag: '"foobar"'
    })
  })

  test('does not generate etags for streams', async (t) => {
    const res = await build().inject({
      url: '/stream'
    })

    t.equal(res.statusCode, 200)
    t.equal(res.headers.etag, undefined)
  })

  test('returns a 304 if etag matches and it is provided by the route', async (t) => {
    const res = await build().inject({
      url: '/etag',
      headers: {
        'If-None-Match': '"foobar"'
      }
    })

    t.equal(res.statusCode, 304)
    t.equal(res.body, '')
    t.match(res.headers, {
      'content-length': '0',
      etag: '"foobar"'
    })
  })

  test('returns a weak etag for each request when weak is in opts', async (t) => {
    const res = await build({ weak: true }).inject({
      url: '/'
    })

    t.same(JSON.parse(res.body), { hello: 'world' })
    t.match(res.headers, {
      etag: 'W/' + hash
    })
  })

  test('returns a 304 if weak etag matches', async (t) => {
    const res = await build({ weak: true }).inject({
      url: '/',
      headers: {
        'If-None-Match': 'W/' + hash
      }
    })

    t.equal(res.statusCode, 304)
    t.equal(res.body, '')
    t.match(res.headers, {
      'content-length': '0',
      etag: 'W/' + hash
    })
  })

  test('returns a 304 if etag is strong and If-None-Match is weak', async (t) => {
    const res = await build().inject({
      url: '/',
      headers: {
        'If-None-Match': 'W/' + hash
      }
    })

    t.equal(res.statusCode, 304)
    t.equal(res.body, '')
    t.match(res.headers, {
      'content-length': '0',
      etag: hash
    })
  })

  test('returns a 304 if etag is weak and If-None-Match is strong', async (t) => {
    const res = await build({ weak: true }).inject({
      url: '/',
      headers: {
        'If-None-Match': hash
      }
    })

    t.equal(res.statusCode, 304)
    t.equal(res.body, '')
    t.match(res.headers, {
      'content-length': '0',
      etag: 'W/' + hash
    })
  })
}
