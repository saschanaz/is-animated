import { getFileHandle } from '../file_handle.js'

/**
 * Checks if stream contains PNG image
 *
 * @param {import('../file_handle').FileSource} source
 * @returns {Promise<boolean>}
 */
export async function isPNG (source) {
  const handle = getFileHandle(source)

  var header = [...await handle.read(0, 8)]
    .map(i => i.toString(16).padStart(2, '0'))
    .join('')
  return (header === '89504e470d0a1a0a') // \211 P N G \r \n \032 'n
}

/**
 * @param {Uint8Array} view
 */
function asDataView (view) {
  return new DataView(view.buffer, view.byteOffset, view.byteLength)
}

/**
 * Checks if stream contains animated PNG image
 *
 * @param {import('../file_handle').FileSource} source
 * @returns {Promise<boolean>}
 */
export async function isAnimated (source) {
  if (!await isPNG(source)) {
    return false
  }

  var hasACTL = false
  var hasIDAT = false
  var hasFDAT = false

  var previousChunkType = null

  var offset = 8

  const handle = getFileHandle(source)
  const size = await handle.size()
  const decoder = new TextDecoder()

  while (offset < size && (!hasACTL || !hasIDAT || !hasFDAT)) {
    var chunkLength = asDataView(await handle.read(offset, 4)).getUint32(0)
    var chunkType = decoder.decode(await handle.read(offset + 4, 4))

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
