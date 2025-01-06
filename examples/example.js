'use strict'

const Fastify = require('fastify')
const Etag = require('..')

const app = Fastify()
app.register(Etag, {
  algorithm: 'fnv1a'
})

app.get('/', async () => {
  return { hello: 'world' }
})

app.listen({ port: 3000 })
