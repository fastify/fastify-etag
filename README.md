# fastify-etag

Automatically generate HTTP etags and return 304 when needed,
according to [RFC2616-sec13](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html).
A plugin for
[Fastify](https://www.fastify.io).

## Install

```sh
npm i fastify-etag
```

## Exmaple

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

* `algorithm`: all hashing algorithm that Node.js support, with the addition of
  `'fnv1a'` and `'xxhash'`. Default: `'fnv1a'`.

## Acknowledgements

The fnv1a logic was forked from [sindresorhus/fnv1a](https://github.com/sindresorhus/fnv1a)
and adapted to support buffers.

The xxHash32 algorithm is implemented in pure JavaScript and it's coming through a module written by Jason3S: [Jason3S/xxhash](https://github.com/Jason3S/xxhash).

## Benchmarks

* `md5` algorithm: 29679 req/s (median)
* `sha1` algorithm: 25935 req/s (median)
* *`fnv1a` algorithm: 42943 req/s (median)*
* `xxhash` algorithm: TBD

No etag generation: 45471 req/s (median)

## License

MIT
