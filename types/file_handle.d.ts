/// <reference types="node" />
/**
 * @typedef {NodeFileHandle | BlobHandle} ReadFileHandle
 * @typedef {Blob | import("node:fs/promises").FileHandle} FileSource
 *
 * @param {FileSource} source
 */
export function getFileHandle(source: FileSource): NodeFileHandle | BlobHandle;
export class NodeFileHandle {
    /** @param {import("node:fs/promises").FileHandle} fileHandle */
    constructor(fileHandle: import("node:fs/promises").FileHandle);
    source: import("fs/promises").FileHandle;
    size(): Promise<number>;
    read(position: any, length: any): Promise<Uint8Array>;
}
export class BlobHandle {
    /** @param {Blob} blob */
    constructor(blob: Blob);
    source: Blob;
    size(): Promise<number>;
    read(position: any, length: any): Promise<Uint8Array>;
}
export type ReadFileHandle = NodeFileHandle | BlobHandle;
export type FileSource = Blob | import("node:fs/promises").FileHandle;
