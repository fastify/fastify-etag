'use strict'

const xxHash32Buffer = require('./xxhash32buffer')
const xxHash32String = require('./xxhash32string')

/**
 * Calculates the xxHash32 hash value of an input parameter (string and buffer
 * supported)
 * @param  {String|Buffer} input    A string or a buffer
 * @param  {Number} [seed=0]        The hash seed
 * @return {Number}                 The hash value
 */
function xxHash32 (input, seed = 0) {
  if (Buffer.isBuffer(input)) {
    return xxHash32Buffer(input, seed)
  } else if (typeof input === 'string') {
    return xxHash32String(input, seed)
  } else {
    throw new Error('input must be a string or a Buffer')
  }
}

module.exports = { xxHash32 }
