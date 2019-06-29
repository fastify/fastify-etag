'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const Etag = require('.')
const { createHash } = require('crypto')
const { createReadStream } = require('fs')

const hash = createHash('md5').update(JSON.stringify({
  hello: 'world'
})).digest().toString('base64')

const hashSha1 = createHash('sha1').update(JSON.stringify({
  hello: 'world'
})).digest().toString('base64')

function build (opts) {
  const app = Fastify()
  app.register(Etag, opts)

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

test('configure the hashing algorithm', async (t) => {
  const res = await build({
    algorithm: 'sha1'
  }).inject({
    url: '/'
  })

  t.same(JSON.parse(res.body), { hello: 'world' })
  t.match(res.headers, {
    'etag': hashSha1
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
