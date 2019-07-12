'use strict'

const { test } = require('tap')
const { xxHash32 } = require('../xxhash')

test('string', async t => {
  t.is(xxHash32(''), 46947589)
  t.is(xxHash32('🦄🌈'), 2588818835)

  t.is(xxHash32('h'), 2156850971)
  t.is(xxHash32('he'), 222769295)
  t.is(xxHash32('hel'), 1783521547)
  t.is(xxHash32('hell'), 3597482228)
  t.is(xxHash32('hello'), 4211111929)
  t.is(xxHash32('hello '), 2410501050)
  t.is(xxHash32('hello w'), 4108394367)
  t.is(xxHash32('hello wo'), 27420251)
  t.is(xxHash32('hello wor'), 4193036009)
  t.is(xxHash32('hello worl'), 2880872332)
  t.is(xxHash32('hello world'), 3468387874)

  t.is(xxHash32('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.'), 3067898155)

  // multiple of 16 bytes
  t.is(xxHash32('01234567890123450123456789012345'), 3098223380)

  // contains chars between 0x80 && 0x800
  t.is(xxHash32('Hello \x81 World'), 3966458549)

  // contains chars between 0x800 && 0xd800
  t.is(xxHash32('Hello ޙࠁࠂ World'), 3362406810)

  // contains chars higher than 0xe000
  t.is(xxHash32('Hello   World'), 3256931765)

  // use custom seed
  t.is(xxHash32('🦄🌈', 17), 920431531)
})

test('buffer', async t => {
  t.is(xxHash32(Buffer.from('')), 46947589)
  t.is(xxHash32(Buffer.from('🦄🌈')), 2588818835)

  t.is(xxHash32(Buffer.from('h')), 2156850971)
  t.is(xxHash32(Buffer.from('he')), 222769295)
  t.is(xxHash32(Buffer.from('hel')), 1783521547)
  t.is(xxHash32(Buffer.from('hell')), 3597482228)
  t.is(xxHash32(Buffer.from('hello')), 4211111929)
  t.is(xxHash32(Buffer.from('hello ')), 2410501050)
  t.is(xxHash32(Buffer.from('hello w')), 4108394367)
  t.is(xxHash32(Buffer.from('hello wo')), 27420251)
  t.is(xxHash32(Buffer.from('hello wor')), 4193036009)
  t.is(xxHash32(Buffer.from('hello worl')), 2880872332)
  t.is(xxHash32(Buffer.from('hello world')), 3468387874)

  t.is(xxHash32(Buffer.from('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.')), 3067898155)

  // multiple of 16 bytes
  t.is(xxHash32(Buffer.from('01234567890123450123456789012345')), 3098223380)

  // contains chars between 0x80 && 0x800
  t.is(xxHash32(Buffer.from('Hello \x81 World')), 3966458549)

  // contains chars between 0x800 && 0xd800
  t.is(xxHash32(Buffer.from('Hello ޙࠁࠂ World')), 3362406810)

  // contains chars higher than 0xe000
  t.is(xxHash32(Buffer.from('Hello   World')), 3256931765)

  // use custom seed
  t.is(xxHash32(Buffer.from('🦄🌈'), 17), 920431531)
})

test('can\'t hash objects', async t => {
  t.throw(() => {
    xxHash32({})
  })
})
