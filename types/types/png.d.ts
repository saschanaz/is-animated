/**
 * Checks if stream contains PNG image
 *
 * @param {import('../file_handle').FileSource} source
 * @returns {Promise<boolean>}
 */
export function isPNG(source: import('../file_handle').FileSource): Promise<boolean>;
/**
 * Checks if stream contains animated PNG image
 *
 * @param {import('../file_handle').FileSource} source
 * @returns {Promise<boolean>}
 */
export function isAnimated(source: import('../file_handle').FileSource): Promise<boolean>;
