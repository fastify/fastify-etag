#!/usr/bin/env node

'use strict'

const Fastify = require('fastify')
const Etag = require('../')

const contentBase = 'Fastify 😎 is ✌️ GREAT 👾 and 🧙‍♀️ it 🗣 rocks 🤘 '

const port = Number(process.env.PORT) || 3000
const algorithm = process.env.ALGORITHM
const contentFormat = process.env.CONTENT_FORMAT || 'buffer'
const contentSize = Number(process.env.CONTENT_SIZE) || contentBase.length

let content = contentBase
  .repeat(Math.ceil(contentSize / contentBase.length))
  .substr(0, contentSize)

if (contentFormat === 'buffer') {
  content = Buffer.from(content)
}

async function run () {
  const app = Fastify({ logger: true })

  if (algorithm) {
    app.register(Etag, { algorithm })
  }

  app.get('/', async (req, reply) => {
    return content
  })

  try {
    await app.listen(port)
    app.log.info(`Server started on port ${port}`, { algorithm, contentFormat, contentSize })
  } catch (err) {
    app.log.error(`Cannot start server: ${err}`)
    process.exit(1)
  }
}

run()
