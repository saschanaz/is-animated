import { getFileHandle } from '../file_handle.js'

/**
 * @param {import('../file_handle').ReadFileHandle} handle
 * @param {number} position
 */
async function readOne (handle, position) {
  return (await handle.read(position, 1))[0]
}

/**
 * Returns total length of data blocks sequence
 *
 * @param {import('../file_handle').ReadFileHandle} handle
 * @param {number} offset
 * @returns {number}
 */
async function getDataBlocksLength (handle, offset) {
  var length = 0

  while (true) {
    const blockLength = await readOne(handle, offset + length)
    if (!blockLength) {
      break
    }
    length += blockLength + 1
  }

  return length + 1
}

/**
 * Checks if buffer contains GIF image
 *
 * @param {import('../file_handle').FileSource} source
 * @returns {boolean}
 */
export async function isGIF (source) {
  const handle = getFileHandle(source)
  const decoder = new TextDecoder()
  var header = decoder.decode(await handle.read(0, 3))
  return (header === 'GIF')
}

/**
 * Checks if buffer contains animated GIF image
 *
 * @param {import('../file_handle').FileSource} source
 * @returns {boolean}
 */
export async function isAnimated (source) {
  var flags, hasColorTable, colorTableSize
  var offset = 0
  var imagesCount = 0

  // Check if this is this image has valid GIF header.
  // If not return false. Chrome, FF and IE doesn't handle GIFs with invalid version.
  if (!await isGIF(source)) {
    return false
  }

  const handle = getFileHandle(source)
  const size = await handle.size()

  // Skip header, logical screen descriptor and global color table
  flags = await readOne(handle, 10)

  hasColorTable = flags & 0x80 // 0b10000000
  colorTableSize = flags & 0x07 // 0b00000111

  offset += 6 // skip header
  offset += 7 // skip logical screen descriptor
  offset += hasColorTable ? 3 * Math.pow(2, colorTableSize + 1) : 0 // skip global color table

  // Find if there is more than one image descriptor

  while (imagesCount < 2 && offset < size) {
    switch (await readOne(handle, offset)) {
      // Image descriptor block. According to specification there could be any
      // number of these blocks (even zero). When there is more than one image
      // descriptor browsers will display animation (they shouldn't when there
      // is no delays defined, but they do it anyway).
      case 0x2C:
        imagesCount += 1

        flags = await readOne(handle, offset + 9)

        hasColorTable = flags & 0x80 // 0b10000000
        colorTableSize = flags & 0x07 // 0b00000111

        offset += 10 // skip image descriptor
        offset += hasColorTable ? 3 * Math.pow(2, colorTableSize + 1) : 0 // skip local color table
        offset += await getDataBlocksLength(handle, offset + 1) + 1 // skip image data

        break

      // Skip all extension blocks. In theory this "plain text extension" blocks
      // could be frames of animation, but no browser renders them.
      case 0x21:
        offset += 2 // skip introducer and label
        offset += await getDataBlocksLength(handle, offset) // skip this block and following data blocks

        break

      // Stop processing on trailer block,
      // all data after this point will is ignored by decoders
      case 0x3B:
        offset = size // fast forward to end of buffer
        break

      // Oops! This GIF seems to be invalid
      default:
        offset = size // fast forward to end of buffer
        break
    }
  }

  return (imagesCount > 1)
}
