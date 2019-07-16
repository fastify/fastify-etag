'use strict'

const kb = (val) => val * 1024
const mb = (val) => val * 1024 * 1024

const testCases = [
  // no e-tag
  { name: 'No etag', group: '32 bytes', subgroup: 'string', options: { CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'No etag', group: '32 bytes', subgroup: 'buffer', options: { CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'No etag', group: '2 kb', subgroup: 'string', options: { CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(2) } },
  { name: 'No etag', group: '2 kb', subgroup: 'buffer', options: { CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(2) } },
  { name: 'No etag', group: '2 Mb', subgroup: 'string', options: { CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(2) } },
  { name: 'No etag', group: '2 Mb', subgroup: 'buffer', options: { CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(2) } },

  // fnv1a
  { name: 'fnv1a', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'fnv1a', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'fnv1a', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'fnv1a', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'fnv1a', group: '2 kb', subgroup: 'string', options: { ALGORITHM: 'fnv1a', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(2) } },
  { name: 'fnv1a', group: '2 kb', subgroup: 'buffer', options: { ALGORITHM: 'fnv1a', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(2) } },
  { name: 'fnv1a', group: '2 Mb', subgroup: 'string', options: { ALGORITHM: 'fnv1a', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(2) } },
  { name: 'fnv1a', group: '2 Mb', subgroup: 'buffer', options: { ALGORITHM: 'fnv1a', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(2) } },

  // xxhash
  { name: 'xxhash', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'xxhash', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'xxhash', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'xxhash', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'xxhash', group: '2 kb', subgroup: 'string', options: { ALGORITHM: 'xxhash', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(2) } },
  { name: 'xxhash', group: '2 kb', subgroup: 'buffer', options: { ALGORITHM: 'xxhash', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(2) } },
  { name: 'xxhash', group: '2 Mb', subgroup: 'string', options: { ALGORITHM: 'xxhash', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(2) } },
  { name: 'xxhash', group: '2 Mb', subgroup: 'buffer', options: { ALGORITHM: 'xxhash', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(2) } },

  // md4
  { name: 'md4', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'md4', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'md4', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'md4', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'md4', group: '2 kb', subgroup: 'string', options: { ALGORITHM: 'md4', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(2) } },
  { name: 'md4', group: '2 kb', subgroup: 'buffer', options: { ALGORITHM: 'md4', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(2) } },
  { name: 'md4', group: '2 Mb', subgroup: 'string', options: { ALGORITHM: 'md4', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(2) } },
  { name: 'md4', group: '2 Mb', subgroup: 'buffer', options: { ALGORITHM: 'md4', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(2) } },

  // md5
  { name: 'md5', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'md5', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'md5', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'md5', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'md5', group: '2 kb', subgroup: 'string', options: { ALGORITHM: 'md5', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(2) } },
  { name: 'md5', group: '2 kb', subgroup: 'buffer', options: { ALGORITHM: 'md5', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(2) } },
  { name: 'md5', group: '2 Mb', subgroup: 'string', options: { ALGORITHM: 'md5', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(2) } },
  { name: 'md5', group: '2 Mb', subgroup: 'buffer', options: { ALGORITHM: 'md5', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(2) } },

  // sha1
  { name: 'sha1', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'sha1', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'sha1', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'sha1', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'sha1', group: '2 kb', subgroup: 'string', options: { ALGORITHM: 'sha1', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(2) } },
  { name: 'sha1', group: '2 kb', subgroup: 'buffer', options: { ALGORITHM: 'sha1', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(2) } },
  { name: 'sha1', group: '2 Mb', subgroup: 'string', options: { ALGORITHM: 'sha1', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(2) } },
  { name: 'sha1', group: '2 Mb', subgroup: 'buffer', options: { ALGORITHM: 'sha1', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(2) } },

  // sha224
  { name: 'sha224', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'sha224', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'sha224', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'sha224', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'sha224', group: '2 kb', subgroup: 'string', options: { ALGORITHM: 'sha224', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(2) } },
  { name: 'sha224', group: '2 kb', subgroup: 'buffer', options: { ALGORITHM: 'sha224', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(2) } },
  { name: 'sha224', group: '2 Mb', subgroup: 'string', options: { ALGORITHM: 'sha224', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(2) } },
  { name: 'sha224', group: '2 Mb', subgroup: 'buffer', options: { ALGORITHM: 'sha224', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(2) } },

  // sha256
  { name: 'sha256', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'sha256', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'sha256', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'sha256', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'sha256', group: '2 kb', subgroup: 'string', options: { ALGORITHM: 'sha256', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(2) } },
  { name: 'sha256', group: '2 kb', subgroup: 'buffer', options: { ALGORITHM: 'sha256', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(2) } },
  { name: 'sha256', group: '2 Mb', subgroup: 'string', options: { ALGORITHM: 'sha256', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(2) } },
  { name: 'sha256', group: '2 Mb', subgroup: 'buffer', options: { ALGORITHM: 'sha256', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(2) } },

  // sha384
  { name: 'sha384', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'sha384', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'sha384', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'sha384', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'sha384', group: '2 kb', subgroup: 'string', options: { ALGORITHM: 'sha384', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(2) } },
  { name: 'sha384', group: '2 kb', subgroup: 'buffer', options: { ALGORITHM: 'sha384', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(2) } },
  { name: 'sha384', group: '2 Mb', subgroup: 'string', options: { ALGORITHM: 'sha384', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(2) } },
  { name: 'sha384', group: '2 Mb', subgroup: 'buffer', options: { ALGORITHM: 'sha384', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(2) } },

  // sha512
  { name: 'sha512', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'sha512', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'sha512', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'sha512', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'sha512', group: '2 kb', subgroup: 'string', options: { ALGORITHM: 'sha512', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(2) } },
  { name: 'sha512', group: '2 kb', subgroup: 'buffer', options: { ALGORITHM: 'sha512', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(2) } },
  { name: 'sha512', group: '2 Mb', subgroup: 'string', options: { ALGORITHM: 'sha512', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(2) } },
  { name: 'sha512', group: '2 Mb', subgroup: 'buffer', options: { ALGORITHM: 'sha512', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(2) } }
]

module.exports = testCases
