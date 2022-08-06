'use strict'

const { test } = require('tap')
const { createHash } = require('crypto')
const generic = require('./generic')
const fnv1a = require('../fnv1a')
const Fastify = require('fastify')
const Etag = require('..')

test('should throw an Error if used non valid algorithm', async t => {
  const app = Fastify()
  t.rejects(() => Etag(app, { algorithm: 'invalid' }), 'Algorithm invalid not supported.')
})

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

test('default -> fnv1a', async (t) => {
  generic(t, {}, (body) => {
    return '"' + fnv1a(body).toString(36) + '"'
  })
})
