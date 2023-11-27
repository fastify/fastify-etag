# @fastify/etag

![CI](https://github.com/fastify/fastify-etag/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@fastify/etag.svg?style=flat)](https://www.npmjs.com/package/@fastify/etag)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

A plugin for [Fastify](https://www.fastify.io) that automatically generates HTTP ETags according to [RFC2616-sec13](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html).

The plugin can optionally send a 304 status code when an ETag matches the if-none-match header.


## Install

```sh
npm i @fastify/etag
```

## Example

```js
'use strict'

const Fastify = require('fastify')
const Etag = require('@fastify/etag')

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

* `algorithm`: all hashing algorithms the Node.js [`crypto`](https://nodejs.org/api/crypto.html) module supports, and `'fnv1a'`. Default: `'sha1'`.

* `weak`: generates weak ETags by default. Default: `false`.

### Automatic 304 status codes

By default, the plugin sends a 304 status code when the ETag is equal to the Etag specified by the if-none-match request header.

This is often the desired behaviour, but can be disabled by setting `replyWith304: false`.

## Acknowledgements

The fnv1a logic was forked from https://github.com/sindresorhus/fnv1a and adapted to support buffers.

## Benchmarks

Generating an etag will always be slower than not generating an etag. The generation speed also depends on the payload size and type (buffer or string):

* For very small payloads (< 2 kb), use `'fnv1a'`
* For buffers above 2 mb, use `'md5'`
* In all other scenarios, use `'sha1'` (default)
* YMMV, see [this issue](https://github.com/fastify/fastify-etag/issues/91) where other algorithms such as crc32 for small payloads and murmurhash3-wasm for big buffers have performed better than the mentioned recommendations
* Any etag generation results in at least 10% less op/s (up to 50% less op/s for huge payloads)


## License

MIT
