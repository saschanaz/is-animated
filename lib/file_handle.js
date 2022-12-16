/* global Blob */

export class NodeFileHandle {
  /** @param {import("node:fs/promises").FileHandle} fileHandle */
  constructor (fileHandle) {
    this.source = fileHandle
  }

  async size () {
    return (await this.source.stat()).size
  }

  async read (position, length) {
    const buffer = new Uint8Array(length)
    // It's okay to ignore incomplete results
    await this.source.read({
      buffer,
      position,
      length
    })
    return buffer
  }
}

export class BlobHandle {
  /** @param {Blob} blob */
  constructor (blob) {
    this.source = blob
  }

  async size () {
    return this.source.size
  }

  async read (position, length) {
    // It's okay to ignore incomplete results
    return new Uint8Array(
      await this.source.slice(position, position + length).arrayBuffer()
    )
  }
}

/**
 * @typedef {NodeFileHandle | BlobHandle} ReadFileHandle
 * @typedef {Blob | import("node:fs/promises").FileHandle} FileSource
 *
 * @param {FileSource} source
 */
export function getFileHandle (source) {
  if (source instanceof Blob) {
    return new BlobHandle(source)
  }
  if (!source || source.constructor.name !== 'FileHandle') {
    throw new Error(`Unknown source type: ${source.constructor.name}. Please pass an instance of Blob or FileHandle if in Node.js.`)
  }
  return new NodeFileHandle(source)
}
