import * as gif from './types/gif.js'
import * as png from './types/png.js'
import * as webp from './types/webp.js'

/**
 * Checks if buffer contains animated image
 *
 * @param {Uint8Array} view
 * @returns {boolean}
 */
function isAnimated (view) {
  if (gif.isGIF(view)) {
    return gif.isAnimated(view)
  }

  if (png.isPNG(view)) {
    return png.isAnimated(view)
  }

  if (webp.isWebp(view)) {
    return webp.isAnimated(view)
  }

  return false
}

export default isAnimated
