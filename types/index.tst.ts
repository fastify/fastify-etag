import fastify from 'fastify'
import { expect } from 'tstyche'
import fastifyEtag, { type FastifyEtagOptions, fnv1a } from '..'

const app = fastify()

app.register(fastifyEtag)

app.register(fastifyEtag, {})
app.register(fastifyEtag, { weak: true })
app.register(fastifyEtag, { weak: false })
app.register(fastifyEtag, { algorithm: 'sha256' })
app.register(fastifyEtag, { algorithm: 'fnv1a' })
app.register(fastifyEtag, { hashFn: () => '' })
app.register(fastifyEtag, { hashFn: fnv1a })
app.register(fastifyEtag, { trailer: true })
app.register(fastifyEtag, { trailer: false })

expect<FastifyEtagOptions>().type.not.toBeAssignableFrom({ weak: 1 })
expect<FastifyEtagOptions>().type.not.toBeAssignableFrom({ trailer: 1 })
