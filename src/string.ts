import { isObject } from './is'

/**
 * Replaces backslashes with forward slashes.
 *
 * @category String
 */
export function toForwardSlashes(str: string) {
	return str.replace(/\\/g, '/')
}

/**
 * Replaces forward slashes with backslashes.
 *
 * @category String
 */
export function toBackSlashes(str: string) {
	return str.replace(/\//g, '\\')
}

/**
 * Ensures the given string starts with the given prefix.
 *
 * @category String
 */
export function ensureStartsWith(prefix: string, str: string) {
	if (!str.startsWith(prefix)) {
		return prefix + str
	}

	return str
}

/**
 * Returns everything before the given value.
 *
 * @category String
 */
export function before(str: string, separator: string | number) {
	if (separator.toString() === '') {
		return str
	}

	const index = str.indexOf(separator.toString())
	if (index === -1) {
		return str
	}

	return str.slice(0, index)
}

/**
 * Replaces the first occurrence of a given value in a string.
 *
 * @category String
 */
export function replaceFirst(search: string | number, replace: string | number, str: string) {
	if (search.toString() === '') {
		return str
	}

	return str.replace(search.toString(), replace.toString())
}

/**
 * Replaces the last occurrence of a given value in a string.
 *
 * @category String
 */
export function replaceLast(search: string | number, replace: string | number, str: string) {
	if (search.toString() === '') {
		return str
	}

	const index = str.lastIndexOf(search.toString())
	if (index === -1) {
		return str
	}

	return str.slice(0, index) + replace.toString() + str.slice(index + search.toString().length)
}

/**
 * Ensures the given string ends with the given suffix.
 *
 * @category String
 */
export function ensureEndsWith(suffix: string, str: string) {
	if (!str.endsWith(suffix)) {
		return str + suffix
	}

	return str
}

/**
 * Dead simple template engine, just like Python's `.format()`
 * Support passing variables as either in index based or object/name based approach
 * While using object/name based approach, you can pass a fallback value as the third argument
 *
 * @category String
 * @example
 * ```
 * const result = template(
 *   'Hello {0}! My name is {1}.',
 *   'Inès',
 *   'Anthony'
 * ) // Hello Inès! My name is Anthony.
 * ```
 *
* ```
 * const result = namedTemplate(
 *   '{greet}! My name is {name}.',
 *   { greet: 'Hello', name: 'Anthony' }
 * ) // Hello! My name is Anthony.
 * ```
 *
 * * const result = namedTemplate(
 *   '{greet}! My name is {name}.',
 *   { greet: 'Hello' }, // name isn't passed hence fallback will be used for name
 *   'placeholder'
 * ) // Hello! My name is placeholder.
 * ```
 */
export function template(str: string, object: Record<string | number, any>, fallback?: string | ((key: string) => string)): string
export function template(str: string, ...args: (string | number | bigint | undefined | null)[]): string
export function template(str: string, ...args: any[]): string {
	const [firstArg, fallback] = args

	if (isObject(firstArg)) {
		const vars = firstArg as Record<string, any>
		return str.replace(/{([\w\d]+)}/g, (_, key) => vars[key] || ((typeof fallback === 'function' ? fallback(key) : fallback) ?? key))
	} else {
		return str.replace(/{(\d+)}/g, (_, key) => {
			const index = Number(key)
			if (Number.isNaN(index)) {
				return key
			}

			return args[index]
		})
	}
}

// port from nanoid
// https://github.com/ai/nanoid
const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
/**
 * Generate a random string
 * @category String
 */
export function randomStr(size = 16, dict = urlAlphabet) {
	let id = ''
	let i = size
	const len = dict.length
	while (i--) {
		id += dict[(Math.random() * len) | 0]
	}

	return id
}

/**
 * First letter uppercase, other lowercase
 * @category string
 * @example
 * ```
 * capitalize('hello') => 'Hello'
 * ```
 */
export function capitalize(str: string): string {
	return str[0].toUpperCase() + str.slice(1).toLowerCase()
}
