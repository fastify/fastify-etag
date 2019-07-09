'use strict'

const { test } = require('tap')
const { createHash } = require('crypto')
const { xxHash32 } = require('js-xxhash')
const generic = require('./generic')
const fnv1a = require('../fnv1a')

test('strong md5', async (t) => {
  generic(t, {
    algorithm: 'md5'
  }, (body) => {
    return '"' + createHash('md5').update(body).digest().toString('base64') + '"'
  })
})

test('strong sha1', async (t) => {
  generic(t, {
    algorithm: 'sha1'
  }, (body) => {
    return '"' + createHash('sha1').update(body).digest().toString('base64') + '"'
  })
})

test('weak fnv1a', async (t) => {
  generic(t, {
    algorithm: 'fnv1a'
  }, (body) => {
    return '"' + fnv1a(body).toString(36) + '"'
  })
})

test('xxhash', async (t) => {
  generic(t, {
    algorithm: 'xxhash'
  }, (body) => {
    return '"' + xxHash32(Buffer.from(body)).toString(16) + '"'
  })
})

test('default -> fnv1a', async (t) => {
  generic(t, {}, (body) => {
    return '"' + fnv1a(body).toString(36) + '"'
  })
})
