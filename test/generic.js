'use strict'

const Fastify = require('fastify')
const Etag = require('..')
const { createReadStream } = require('node:fs')

module.exports = async function (t, etagOpts, hashFn) {
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

    app.post('/', async () => {
      return { hello: 'world' }
    })

    app.get('/missing', async (_req, reply) => {
      reply.code(404)
      return { hello: 'world' }
    })

    return app
  }

  const hash = hashFn(JSON.stringify({ hello: 'world' }))

  await t.test('returns an etag for each request', async (t) => {
    const res = await build().inject({
      url: '/'
    })

    t.assert.deepStrictEqual(JSON.parse(res.body), { hello: 'world' })
    t.assert.deepStrictEqual(res.headers.etag, hash)
  })

  await t.test('returns a 304 if etag matches', async (t) => {
    const res = await build().inject({
      url: '/',
      headers: {
        'If-None-Match': hash
      }
    })

    t.assert.deepStrictEqual(res.statusCode, 304)
    t.assert.deepStrictEqual(res.body, '')
    t.assert.deepStrictEqual(res.headers.etag, hash)
    t.assert.deepStrictEqual(res.headers['content-length'], undefined)
  })

  await t.test('does not return a 304 when behaviour is disabled', async (t) => {
    const res = await build({ replyWith304: false }).inject({
      url: '/',
      headers: {
        'If-None-Match': hash
      }
    })

    t.assert.deepStrictEqual(JSON.parse(res.body), { hello: 'world' })
    t.assert.deepStrictEqual(res.statusCode, 200)
    t.assert.deepStrictEqual(res.headers.etag, hash)
  })

  await t.test('returns an already existing etag', async (t) => {
    const res = await build().inject({
      url: '/etag'
    })

    t.assert.deepStrictEqual(res.statusCode, 200)
    t.assert.deepStrictEqual(res.headers.etag, '"foobar"')
  })

  await t.test('does not generate etags for streams', async (t) => {
    const res = await build().inject({
      url: '/stream'
    })

    t.assert.deepStrictEqual(res.statusCode, 200)
    t.assert.deepStrictEqual(res.headers.etag, undefined)
  })

  await t.test('returns a 304 if etag matches and it is provided by the route', async (t) => {
    const res = await build().inject({
      url: '/etag',
      headers: {
        'If-None-Match': '"foobar"'
      }
    })

    t.assert.deepStrictEqual(res.statusCode, 304)
    t.assert.deepStrictEqual(res.body, '')
    t.assert.deepStrictEqual(res.headers.etag, '"foobar"')
    t.assert.deepStrictEqual(res.headers['content-length'], undefined)
  })

  await t.test('returns a weak etag for each request when weak is in opts', async (t) => {
    const res = await build({ weak: true }).inject({
      url: '/'
    })

    t.assert.deepStrictEqual(JSON.parse(res.body), { hello: 'world' })
    t.assert.deepStrictEqual(res.headers.etag, 'W/' + hash)
  })

  await t.test('returns a 304 if weak etag matches', async (t) => {
    const res = await build({ weak: true }).inject({
      url: '/',
      headers: {
        'If-None-Match': 'W/' + hash
      }
    })

    t.assert.deepStrictEqual(res.statusCode, 304)
    t.assert.deepStrictEqual(res.body, '')
    t.assert.deepStrictEqual(res.headers['content-length'], undefined)
    t.assert.deepStrictEqual(res.headers.etag, 'W/' + hash)
  })

  await t.test('returns a 304 if etag is strong and If-None-Match is weak', async (t) => {
    const res = await build().inject({
      url: '/',
      headers: {
        'If-None-Match': 'W/' + hash
      }
    })

    t.assert.deepStrictEqual(res.statusCode, 304)
    t.assert.deepStrictEqual(res.body, '')
    t.assert.deepStrictEqual(res.headers['content-length'], undefined)
    t.assert.deepStrictEqual(res.headers.etag, hash)
  })

  await t.test('returns a 304 if etag is weak and If-None-Match is strong', async (t) => {
    const res = await build({ weak: true }).inject({
      url: '/',
      headers: {
        'If-None-Match': hash
      }
    })

    t.assert.deepStrictEqual(res.statusCode, 304)
    t.assert.deepStrictEqual(res.body, '')
    t.assert.deepStrictEqual(res.headers['content-length'], undefined)
    t.assert.deepStrictEqual(res.headers.etag, 'W/' + hash)
  })

  await t.test('returns a 304 if etag is in an If-None-Match list', async (t) => {
    const res = await build().inject({
      url: '/',
      headers: {
        'If-None-Match': '"foo", ' + hash + ', "bar"'
      }
    })

    t.assert.deepStrictEqual(res.statusCode, 304)
    t.assert.deepStrictEqual(res.body, '')
  })

  await t.test('returns a 200 if no etag in an If-None-Match list matches', async (t) => {
    const res = await build().inject({
      url: '/',
      headers: {
        'If-None-Match': '"foo", "bar"'
      }
    })

    t.assert.deepStrictEqual(res.statusCode, 200)
    t.assert.deepStrictEqual(JSON.parse(res.body), { hello: 'world' })
  })

  await t.test('returns a 304 if If-None-Match is *', async (t) => {
    const res = await build().inject({
      url: '/',
      headers: {
        'If-None-Match': '*'
      }
    })

    t.assert.deepStrictEqual(res.statusCode, 304)
    t.assert.deepStrictEqual(res.body, '')
  })

  await t.test('does not return a 304 for methods other than GET and HEAD', async (t) => {
    const res = await build().inject({
      method: 'POST',
      url: '/',
      headers: {
        'If-None-Match': hash
      }
    })

    t.assert.deepStrictEqual(res.statusCode, 200)
    t.assert.deepStrictEqual(JSON.parse(res.body), { hello: 'world' })
  })

  await t.test('does not turn a non-2xx response into a 304', async (t) => {
    const res = await build().inject({
      url: '/missing',
      headers: {
        'If-None-Match': hash
      }
    })

    t.assert.deepStrictEqual(res.statusCode, 404)
    t.assert.deepStrictEqual(JSON.parse(res.body), { hello: 'world' })
  })
}
