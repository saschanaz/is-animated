/**
 * Checks if stream contains PNG image
 *
 * @param {Uint8Array} view
 * @returns {boolean}
 */
export function isPNG (view) {
  var header = [...view.subarray(0, 8)]
    .map(i => i.toString(16).padStart(2, '0'))
    .join('')
  return (header === '89504e470d0a1a0a') // \211 P N G \r \n \032 'n
}

/**
 * Checks if stream contains animated PNG image
 *
 * @param {Uint8Array} view
 * @returns {boolean}
 */
export function isAnimated (view) {
  var hasACTL = false
  var hasIDAT = false
  var hasFDAT = false

  var previousChunkType = null

  var offset = 8

  const dataView = new DataView(view.buffer, view.byteOffset)
  const decoder = new TextDecoder()

  while (offset < view.length) {
    var chunkLength = dataView.getUint32(offset)
    var chunkType = decoder.decode(view.subarray(offset + 4, offset + 8))

    switch (chunkType) {
      case 'acTL':
        hasACTL = true
        break
      case 'IDAT':
        if (!hasACTL) {
          return false
        }

        if (previousChunkType !== 'fcTL' && previousChunkType !== 'IDAT') {
          return false
        }

        hasIDAT = true
        break
      case 'fdAT':
        if (!hasIDAT) {
          return false
        }

        if (previousChunkType !== 'fcTL' && previousChunkType !== 'fdAT') {
          return false
        }

        hasFDAT = true
        break
    }

    previousChunkType = chunkType
    offset += 4 + 4 + chunkLength + 4
  }

  return (hasACTL && hasIDAT && hasFDAT)
}
