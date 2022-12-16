import { readdirSync, readFileSync } from 'fs'
import { extname } from 'path'
import test from 'tape'
import isAnimated from '../lib/index.js'

var types = ['gif', 'png', 'webp']

/**
 * @param {string} type
 * @param {string} subdir
 * @param {boolean} animated
 */
function testImpl (type, subdir, animated) {
  return (t) => {
    const images = readdirSync(`./test/${subdir}`).filter(function (name) {
      return extname(name).slice(1) === type
    })

    t.plan(images.length)

    images.forEach(function (imgName) {
      var buffer = readFileSync(`./test/${subdir}/${imgName}`)
      t.equal(isAnimated(buffer), animated, imgName)
    })
  }
}

types.forEach(function (type) {
  test('Test animated ' + type.toUpperCase() + ' images', testImpl(type, 'animated', true))

  test('Test static ' + type.toUpperCase() + ' images', testImpl(type, 'static', false))

  test('Test invalid ' + type.toUpperCase() + ' images', testImpl(type, 'invalid', false))
})
