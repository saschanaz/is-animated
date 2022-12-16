# is-file-animated

[![npm][npm-image]][npm-url]
[![ci][ci-image]][ci-url]
[![standard][standard-image]][standard-url]
[![standard version][standard-version-image]][standard-version-url]

**is-file-animated** is a simple library for detecting animated GIF/PNG/WebP images from Blob/File or fs.FileHandle.

## Install

```
npm install is-file-animated
```

## Example

On browsers and similar environments:

```js
import isAnimated from 'https://cdn.jsdelivr.net/npm/is-file-animated/+esm'

const response = await fetch(url)

const blob = await response.blob()
const answer = await isAnimated(blob) ? 'Yes' : 'No'
console.log(`Is "${url}" animated? ${answer}.`)
```

On Node.js:

```js
import { open } from 'fs/promises'
import isAnimated from 'is-file-animated'

const filename = process.argv[2]

const handle = await open(filename)
const answer = await isAnimated(handle) ? 'Yes' : 'No'
console.log(`Is "${filename}" animated? ${answer}.`)
```

## License

[MIT](LICENSE.md)


[npm-image]: https://img.shields.io/npm/v/is-file-animated.svg
[npm-url]: https://www.npmjs.com/package/is-file-animated
[ci-image]: https://github.com/saschanaz/is-file-animated/actions/workflows/ci.yml/badge.svg?branch=main
[ci-url]: https://github.com/saschanaz/is-file-animated/actions/workflows/ci.yml
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://npm.im/standard
[standard-version-image]: https://img.shields.io/badge/release-standard%20version-brightgreen.svg
[standard-version-url]: https://github.com/conventional-changelog/standard-version


