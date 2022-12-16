import * as gif from './types/gif.js'
import * as png from './types/png.js'
import * as webp from './types/webp.js'

/**
 * Checks if buffer contains animated image
 *
 * @param {import('./file_handle').FileSource} source
 * @returns {Promise<boolean>}
 */
export default async function isAnimated (view) {
  if (await gif.isGIF(view)) {
    return await gif.isAnimated(view)
  }

  if (await png.isPNG(view)) {
    return await png.isAnimated(view)
  }

  if (await webp.isWebp(view)) {
    return await webp.isAnimated(view)
  }

  return false
}
