/**
 * @since 2019-02-27 10:20
 * @author vivaxy
 */

/**
 * Checks if stream contains WebP image
 *
 * @param {Uint8Array} view
 * @returns {boolean}
 */
export function isWebp (view) {
  const decoder = new TextDecoder()
  return (
    decoder.decode(view.subarray(0, 4)) === 'RIFF' &&
    decoder.decode(view.subarray(8, 12)) === 'WEBP'
  )
}

/**
 * Checks if stream contains animated WebP image
 *
 * @param {Uint8Array} view
 * @returns {boolean}
 */
export function isAnimated (view) {
  if (!isWebp(view)) {
    return false
  }

  const decoder = new TextDecoder()

  if (!['VP8 ', 'VP8X'].includes(decoder.decode(view.subarray(12, 16)))) {
    return false
  }

  return decoder.decode(view.subarray(30, 34)) === 'ANIM'
}
