import { readdir, open } from 'fs/promises'
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
  return async (t) => {
    const images = (await readdir(`./test/${subdir}`)).filter(function (name) {
      return extname(name).slice(1) === type
    })

    t.plan(images.length)

    for (const imgName of images) {
      const handle = await open(`./test/${subdir}/${imgName}`)
      try {
        t.equal(await isAnimated(handle), animated, imgName)
      } finally {
        await handle.close()
      }
    }
  }
}

types.forEach(function (type) {
  test('Test animated ' + type.toUpperCase() + ' images', testImpl(type, 'animated', true))

  test('Test static ' + type.toUpperCase() + ' images', testImpl(type, 'static', false))

  test('Test invalid ' + type.toUpperCase() + ' images', testImpl(type, 'invalid', false))
})
