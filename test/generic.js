'use strict'

const Fastify = require('fastify')
const Etag = require('..')
const { createReadStream, readFileSync } = require('node:fs')

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

    app.get('/etag-trailer', async (_req, reply) => {
      reply.trailer('etag', (_reply, _payload, done) => done(null, '"custom-trailer"'))
      return 'world'
    })

    app.get('/empty', async (_req, reply) => {
      reply.code(204).send()
    })

    app.get('/stream', async () => {
      return createReadStream(__filename)
    })

    return app
  }

  const hash = hashFn(JSON.stringify({ hello: 'world' }))
  const streamHash = hashFn(readFileSync(__filename))

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

  await t.test('returns an etag trailer for each request when trailer is in opts', async (t) => {
    const res = await build({ trailer: true }).inject({
      url: '/'
    })

    t.assert.deepStrictEqual(JSON.parse(res.body), { hello: 'world' })
    t.assert.deepStrictEqual(res.headers.etag, undefined)
    t.assert.deepStrictEqual(res.headers.trailer, 'etag')
    t.assert.deepStrictEqual(res.trailers.etag, hash)
  })

  await t.test('generates etag trailers for streams when trailer is in opts', async (t) => {
    const res = await build({ trailer: true }).inject({
      url: '/stream'
    })

    t.assert.deepStrictEqual(res.statusCode, 200)
    t.assert.deepStrictEqual(res.headers.etag, undefined)
    t.assert.deepStrictEqual(res.headers.trailer, 'etag')
    t.assert.deepStrictEqual(res.trailers.etag, streamHash)
  })

  await t.test('returns a 304 if etag matches when trailer is in opts', async (t) => {
    const res = await build({ trailer: true }).inject({
      url: '/',
      headers: {
        'If-None-Match': hash
      }
    })

    t.assert.deepStrictEqual(res.statusCode, 304)
    t.assert.deepStrictEqual(res.body, '')
    t.assert.deepStrictEqual(res.headers.etag, hash)
    t.assert.deepStrictEqual(res.headers.trailer, undefined)
    t.assert.deepStrictEqual(res.headers['content-length'], undefined)
  })

  await t.test('returns an already existing etag trailer', async (t) => {
    const res = await build({ trailer: true }).inject({
      url: '/etag-trailer'
    })

    t.assert.deepStrictEqual(res.statusCode, 200)
    t.assert.deepStrictEqual(res.headers.trailer, 'etag')
    t.assert.deepStrictEqual(res.trailers.etag, '"custom-trailer"')
  })

  await t.test('does not generate etag trailer for empty payloads', async (t) => {
    const res = await build({ trailer: true }).inject({
      url: '/empty'
    })

    t.assert.deepStrictEqual(res.statusCode, 204)
    t.assert.deepStrictEqual(res.headers.etag, undefined)
    t.assert.deepStrictEqual(res.headers.trailer, undefined)
  })
}
