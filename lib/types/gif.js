/**
 * Returns total length of data blocks sequence
 *
 * @param {Uint8Array} view
 * @param {number} offset
 * @returns {number}
 */
function getDataBlocksLength (view, offset) {
  var length = 0

  while (view[offset + length]) {
    length += view[offset + length] + 1
  }

  return length + 1
}

/**
 * Checks if buffer contains GIF image
 *
 * @param {Uint8Array} view
 * @returns {boolean}
 */
export function isGIF (view) {
  const decoder = new TextDecoder()
  var header = decoder.decode(view.subarray(0, 3))
  return (header === 'GIF')
}

/**
 * Checks if buffer contains animated GIF image
 *
 * @param {Uint8Array} view
 * @returns {boolean}
 */
export function isAnimated (view) {
  var hasColorTable, colorTableSize
  var offset = 0
  var imagesCount = 0

  // Check if this is this image has valid GIF header.
  // If not return false. Chrome, FF and IE doesn't handle GIFs with invalid version.
  if (!isGIF(view)) {
    return false
  }

  // Skip header, logical screen descriptor and global color table

  hasColorTable = view[10] & 0x80 // 0b10000000
  colorTableSize = view[10] & 0x07 // 0b00000111

  offset += 6 // skip header
  offset += 7 // skip logical screen descriptor
  offset += hasColorTable ? 3 * Math.pow(2, colorTableSize + 1) : 0 // skip global color table

  // Find if there is more than one image descriptor

  while (imagesCount < 2 && offset < view.length) {
    switch (view[offset]) {
      // Image descriptor block. According to specification there could be any
      // number of these blocks (even zero). When there is more than one image
      // descriptor browsers will display animation (they shouldn't when there
      // is no delays defined, but they do it anyway).
      case 0x2C:
        imagesCount += 1

        hasColorTable = view[offset + 9] & 0x80 // 0b10000000
        colorTableSize = view[offset + 9] & 0x07 // 0b00000111

        offset += 10 // skip image descriptor
        offset += hasColorTable ? 3 * Math.pow(2, colorTableSize + 1) : 0 // skip local color table
        offset += getDataBlocksLength(view, offset + 1) + 1 // skip image data

        break

      // Skip all extension blocks. In theory this "plain text extension" blocks
      // could be frames of animation, but no browser renders them.
      case 0x21:
        offset += 2 // skip introducer and label
        offset += getDataBlocksLength(view, offset) // skip this block and following data blocks

        break

      // Stop processing on trailer block,
      // all data after this point will is ignored by decoders
      case 0x3B:
        offset = view.length // fast forward to end of buffer
        break

      // Oops! This GIF seems to be invalid
      default:
        offset = view.length // fast forward to end of buffer
        break
    }
  }

  return (imagesCount > 1)
}
