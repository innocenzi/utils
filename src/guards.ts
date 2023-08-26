/**
 * Filters out nullish values.
 *
 * @category Guards
 * @example array.filter(notNullish)
 */
export function notNullish<T>(v: T | null | undefined): v is NonNullable<T> {
	return v != null
}

/**
 * Filters our `null` values.
 *
 * @category Guards
 * @example array.filter(noNull)
 */
export function noNull<T>(v: T | null): v is Exclude<T, null> {
	return v !== null
}

/**
 * Filters out `undefined` values.
 *
 * @category Guards
 * @example array.filter(notUndefined)
 */
export function notUndefined<T>(v: T): v is Exclude<T, undefined> {
	return v !== undefined
}

/**
 * Filters out truthy values.
 *
 * @category Guards
 * @example array.filter(isTruthy)
 */
export function isTruthy<T>(v: T): v is NonNullable<T> {
	return Boolean(v)
}
