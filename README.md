# @fastify/etag

[![CI](https://github.com/fastify/fastify-etag/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/fastify/fastify-etag/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/@fastify/etag.svg?style=flat)](https://www.npmjs.com/package/@fastify/etag)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)

A plugin for [Fastify](https://fastify.dev) that automatically generates HTTP ETags according to [RFC2616-sec13](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html).

The plugin can optionally send a 304 status code when an ETag matches the if-none-match header.


## Install

```sh
npm i @fastify/etag
```

### Compatibility
| Plugin version | Fastify version |
| ---------------|-----------------|
| `>=6.x`        | `^5.x`          |
| `>=4.x <6.x`   | `^4.x`          |
| `^3.x`         | `^3.x`          |
| `>=1.x <3.x`   | `^2.x`          |


Please note that if a Fastify version is out of support, then so are the corresponding versions of this plugin
in the table above.
See [Fastify's LTS policy](https://github.com/fastify/fastify/blob/main/docs/Reference/LTS.md) for more details.

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

This is often the desired behavior, but can be disabled by setting `replyWith304: false`.

## Acknowledgments

The fnv1a logic was forked from https://github.com/sindresorhus/fnv1a and adapted to support buffers.

## Benchmarks

Generating an etag will always be slower than not generating an etag. The generation speed also depends on the payload size and type (buffer or string):

* For very small payloads (< 2 kb), use `'fnv1a'`
* For buffers above 2 mb, use `'md5'`
* In all other scenarios, use `'sha1'` (default)
* YMMV, see [this issue](https://github.com/fastify/fastify-etag/issues/91) where other algorithms such as crc32 for small payloads and murmurhash3-wasm for big buffers have performed better than the mentioned recommendations
* Any etag generation results in at least 10% less op/s (up to 50% less op/s for huge payloads)


## License

Licensed under [MIT](./LICENSE).
