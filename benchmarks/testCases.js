'use strict'

const kb = (val) => val * 1024
const mb = (val) => val * 1024 * 1024

const testCases = [
  // no e-tag
  { name: 'No etag', group: '32 bytes', subgroup: 'string', options: { CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'No etag', group: '32 bytes', subgroup: 'buffer', options: { CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'No etag', group: '4 kb', subgroup: 'string', options: { CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(4) } },
  { name: 'No etag', group: '4 kb', subgroup: 'buffer', options: { CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(4) } },
  { name: 'No etag', group: '4 Mb', subgroup: 'string', options: { CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(4) } },
  { name: 'No etag', group: '4 Mb', subgroup: 'buffer', options: { CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(4) } },

  // fnv1a
  { name: 'fnv1a', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'fnv1a', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'fnv1a', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'fnv1a', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'fnv1a', group: '4 kb', subgroup: 'string', options: { ALGORITHM: 'fnv1a', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(4) } },
  { name: 'fnv1a', group: '4 kb', subgroup: 'buffer', options: { ALGORITHM: 'fnv1a', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(4) } },
  { name: 'fnv1a', group: '4 Mb', subgroup: 'string', options: { ALGORITHM: 'fnv1a', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(4) } },
  { name: 'fnv1a', group: '4 Mb', subgroup: 'buffer', options: { ALGORITHM: 'fnv1a', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(4) } },

  // xxhash
  { name: 'xxhash', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'xxhash', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'xxhash', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'xxhash', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'xxhash', group: '4 kb', subgroup: 'string', options: { ALGORITHM: 'xxhash', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(4) } },
  { name: 'xxhash', group: '4 kb', subgroup: 'buffer', options: { ALGORITHM: 'xxhash', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(4) } },
  { name: 'xxhash', group: '4 Mb', subgroup: 'string', options: { ALGORITHM: 'xxhash', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(4) } },
  { name: 'xxhash', group: '4 Mb', subgroup: 'buffer', options: { ALGORITHM: 'xxhash', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(4) } },

  // md4
  { name: 'md4', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'md4', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'md4', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'md4', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'md4', group: '4 kb', subgroup: 'string', options: { ALGORITHM: 'md4', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(4) } },
  { name: 'md4', group: '4 kb', subgroup: 'buffer', options: { ALGORITHM: 'md4', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(4) } },
  { name: 'md4', group: '4 Mb', subgroup: 'string', options: { ALGORITHM: 'md4', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(4) } },
  { name: 'md4', group: '4 Mb', subgroup: 'buffer', options: { ALGORITHM: 'md4', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(4) } },

  // md5
  { name: 'md5', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'md5', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'md5', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'md5', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'md5', group: '4 kb', subgroup: 'string', options: { ALGORITHM: 'md5', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(4) } },
  { name: 'md5', group: '4 kb', subgroup: 'buffer', options: { ALGORITHM: 'md5', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(4) } },
  { name: 'md5', group: '4 Mb', subgroup: 'string', options: { ALGORITHM: 'md5', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(4) } },
  { name: 'md5', group: '4 Mb', subgroup: 'buffer', options: { ALGORITHM: 'md5', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(4) } },

  // sha1
  { name: 'sha1', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'sha1', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'sha1', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'sha1', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'sha1', group: '4 kb', subgroup: 'string', options: { ALGORITHM: 'sha1', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(4) } },
  { name: 'sha1', group: '4 kb', subgroup: 'buffer', options: { ALGORITHM: 'sha1', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(4) } },
  { name: 'sha1', group: '4 Mb', subgroup: 'string', options: { ALGORITHM: 'sha1', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(4) } },
  { name: 'sha1', group: '4 Mb', subgroup: 'buffer', options: { ALGORITHM: 'sha1', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(4) } },

  // sha224
  { name: 'sha224', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'sha224', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'sha224', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'sha224', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'sha224', group: '4 kb', subgroup: 'string', options: { ALGORITHM: 'sha224', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(4) } },
  { name: 'sha224', group: '4 kb', subgroup: 'buffer', options: { ALGORITHM: 'sha224', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(4) } },
  { name: 'sha224', group: '4 Mb', subgroup: 'string', options: { ALGORITHM: 'sha224', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(4) } },
  { name: 'sha224', group: '4 Mb', subgroup: 'buffer', options: { ALGORITHM: 'sha224', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(4) } },

  // sha256
  { name: 'sha256', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'sha256', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'sha256', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'sha256', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'sha256', group: '4 kb', subgroup: 'string', options: { ALGORITHM: 'sha256', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(4) } },
  { name: 'sha256', group: '4 kb', subgroup: 'buffer', options: { ALGORITHM: 'sha256', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(4) } },
  { name: 'sha256', group: '4 Mb', subgroup: 'string', options: { ALGORITHM: 'sha256', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(4) } },
  { name: 'sha256', group: '4 Mb', subgroup: 'buffer', options: { ALGORITHM: 'sha256', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(4) } },

  // sha384
  { name: 'sha384', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'sha384', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'sha384', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'sha384', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'sha384', group: '4 kb', subgroup: 'string', options: { ALGORITHM: 'sha384', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(4) } },
  { name: 'sha384', group: '4 kb', subgroup: 'buffer', options: { ALGORITHM: 'sha384', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(4) } },
  { name: 'sha384', group: '4 Mb', subgroup: 'string', options: { ALGORITHM: 'sha384', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(4) } },
  { name: 'sha384', group: '4 Mb', subgroup: 'buffer', options: { ALGORITHM: 'sha384', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(4) } },

  // sha512
  { name: 'sha512', group: '32 bytes', subgroup: 'string', options: { ALGORITHM: 'sha512', CONTENT_FORMAT: 'string', CONTENT_SIZE: 32 } },
  { name: 'sha512', group: '32 bytes', subgroup: 'buffer', options: { ALGORITHM: 'sha512', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: 32 } },
  { name: 'sha512', group: '4 kb', subgroup: 'string', options: { ALGORITHM: 'sha512', CONTENT_FORMAT: 'string', CONTENT_SIZE: kb(4) } },
  { name: 'sha512', group: '4 kb', subgroup: 'buffer', options: { ALGORITHM: 'sha512', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: kb(4) } },
  { name: 'sha512', group: '4 Mb', subgroup: 'string', options: { ALGORITHM: 'sha512', CONTENT_FORMAT: 'string', CONTENT_SIZE: mb(4) } },
  { name: 'sha512', group: '4 Mb', subgroup: 'buffer', options: { ALGORITHM: 'sha512', CONTENT_FORMAT: 'buffer', CONTENT_SIZE: mb(4) } }
]

module.exports = testCases
