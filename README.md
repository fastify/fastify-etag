# fastify-etag

![CI](https://github.com/fastify/fastify-etag/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/fastify-etag.svg?style=flat)](https://www.npmjs.com/package/fastify-etag)
[![Known Vulnerabilities](https://snyk.io/test/github/fastify/fastify-etag/badge.svg)](https://snyk.io/test/github/fastify/fastify-etag)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

Automatically generate HTTP etags and return 304 when needed,
according to [RFC2616-sec13](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html).
A plugin for [Fastify](https://www.fastify.io).

## Install

```sh
npm i fastify-etag
```

## Example

```js
'use strict'

const Fastify = require('fastify')
const Etag = require('fastify-etag')

const app = Fastify()
app.register(Etag)

app.get('/', async (req, reply) => {
  return { hello: 'world' }
})

app.get('/manual-etag', async (req, reply) => {
  // This will disable automatic ETag generation
  // It will still return a 304 if the ETag matches
  reply.header('etag', '"foobar"')
  return 'world'
})

app.listen(3000)
```

## Plugin Options

* `algorithm`: all hashing algorithm that Node.js support, and
  `'fnv1a'`. Default: `'fnv1a'`.

* `weak`: generates weak ETags by default. Default: `false`.

## Acknowledgements

The fnv1a logic was forked from https://github.com/sindresorhus/fnv1a
and adapted to support buffers.

## Benchmarks

* `md5` algorithm: 29679 req/s (median)
* `sha1` algorithm: 25935 req/s (median)
* *`fnv1a` algorithm: 42943 req/s (median)*

No etag generation: 45471 req/s (median)

## License

MIT
