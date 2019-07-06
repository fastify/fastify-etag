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

app.listen(3000)
```

## Plugin Options

* `algorithm`: all hashing algorithm that Node.js support, and
  `'fnv1a'`. Default: `'fnv1a'`.

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
