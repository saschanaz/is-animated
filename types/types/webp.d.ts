/**
 * Checks if stream contains WebP image
 *
 * @param {import('../file_handle').FileSource} source
 * @returns {Promise<boolean>}
 */
export function isWebp(source: import('../file_handle').FileSource): Promise<boolean>;
/**
 * Checks if stream contains animated WebP image
 *
 * @param {import('../file_handle').FileSource} source
 * @returns {Promise<boolean>}
 */
export function isAnimated(source: import('../file_handle').FileSource): Promise<boolean>;
