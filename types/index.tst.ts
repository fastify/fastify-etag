import { expect } from 'tstyche'
import fastify from 'fastify'
import fastifyEtag, { type FastifyEtagOptions } from '..'

const app = fastify()

app.register(fastifyEtag)

app.register(fastifyEtag, {})
app.register(fastifyEtag, { weak: true })
app.register(fastifyEtag, { weak: false })
app.register(fastifyEtag, { algorithm: 'fnv1a' })
app.register(fastifyEtag, { algorithm: 'sha256' })

expect({ weak: 1 }).type.not.toBeAssignableTo<FastifyEtagOptions>()
