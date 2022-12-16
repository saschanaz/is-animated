/**
 * @since 2019-02-27 10:20
 * @author vivaxy
 */

import { getFileHandle } from '../file_handle.js'

/**
 * Checks if stream contains WebP image
 *
 * @param {import('../file_handle').FileSource} source
 * @returns {Promise<boolean>}
 */
export async function isWebp (source) {
  const handle = getFileHandle(source)
  const decoder = new TextDecoder()
  return (
    decoder.decode(await handle.read(0, 4)) === 'RIFF' &&
    decoder.decode(await handle.read(8, 4)) === 'WEBP'
  )
}

/**
 * Checks if stream contains animated WebP image
 *
 * @param {import('../file_handle').FileSource} source
 * @returns {Promise<boolean>}
 */
export async function isAnimated (source) {
  if (!await isWebp(source)) {
    return false
  }

  const handle = getFileHandle(source)
  const decoder = new TextDecoder()

  if (!['VP8 ', 'VP8X'].includes(decoder.decode(await handle.read(12, 4)))) {
    return false
  }

  return decoder.decode(await handle.read(30, 4)) === 'ANIM'
}
