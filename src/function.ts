import { isFunction } from './is'
import type { AwaitableFn, Fn, Nullable } from './types'

/**
 * Call every function in an array.
 *
 * @category Functions
 */
export function batchInvoke(functions: Nullable<Fn>[]) {
	functions.forEach((fn) => fn && fn())
}

/**
 * Calls the given function.
 *
 * @category Functions
 */
export function invoke(fn: undefined): undefined
export function invoke<T>(fn: Fn<T>): T
export function invoke<T>(fn?: Fn<T>): T {
	return fn?.() as T
}

/**
 * Calls the given function.
 *
 * @category Functions
 */
export async function asyncInvoke<T>(fn: AwaitableFn<T>): Promise<T> {
	return await fn?.() as T
}

/**
 * Returns the given value, or the result of the callback if the value is a function.
 *
 * @category Functions
 */
export function value(value: undefined): undefined
export function value<T>(value: T | Fn<T>): T
export function value<T>(value?: T | Fn<T>): T {
	if (isFunction(value)) {
		return value()
	}

	return value as T
}

/**
 * Passes the value through the callback, and returns the value.
 *
 * @category Functions
 * @example
 * ```
 * function createUser(name: string): User {
 *   return tap(new User, user => {
 *     user.name = name
 *   })
 * }
 * ```
 */
export function tap(value: undefined, callback: (value: undefined) => void): undefined
export function tap<T>(value: T, callback: (value: T) => void): T
export function tap<T>(value: T, callback: (value: T) => void): T {
	callback(value)
	return value as T
}

type MaybeCallable<T> = T | ((...args: any[]) => T)
interface DefaultLookup<TReturnValue> {
	default: MaybeCallable<TReturnValue>
}

type Lookup<TValue extends string | number | undefined, TReturnValue> = {
	[K in NonNullable<TValue>]: MaybeCallable<TReturnValue>
}

/**
 * Matches a value against a lookup table.
 *
 * @category Functions
 * @example
 * ```
 * match('foo', {
 *  foo: 'bar',
 *  baz: 'qux',
 *  default: 'default', // optional
 * })
 */
export function match<
	TValue extends string | number | undefined,
	TLookup extends(Lookup<TValue, TReturnValue> | (Partial<Lookup<TValue, TReturnValue>> & DefaultLookup<TReturnValue>)),
	TReturnValue,
>(
	value: TValue,
	lookup: TLookup,
	...args: any[]
): TLookup extends Lookup<TValue, infer U>
		? U
		: TLookup extends (Partial<Lookup<TValue, infer V>> & DefaultLookup<infer V>)
			? V
			: never {
	if (value! in lookup) {
		const returnValue = lookup[value!] as TLookup[NonNullable<TValue>]
		return isFunction(returnValue) ? returnValue(...args) : returnValue
	}

	if ('default' in lookup) {
		const returnValue = lookup.default as TLookup[NonNullable<TValue>]
		return isFunction(returnValue) ? returnValue(...args) : returnValue
	}

	const handlers = Object.keys(lookup)
		.map((key) => `"${key}"`)
		.join(', ')

	const error = new Error(`No handler defined for "${value}". Only defined handlers are: ${handlers}.`)

	if (Error.captureStackTrace) {
		Error.captureStackTrace(error, match)
	}

	throw error
}

/**
 * Asynchronously tries the specified promise.
 * 
 * @example
 * ```
 * const [result, error] = await tryAsync(fetch(url))
 */
export async function tryAsync<T>(fn: AwaitableFn<T>): Promise<[T, null] | [null, Error]> {
	try {
		const data = await fn?.()
		return [data, null]
	} catch (throwable) {
		if (throwable instanceof Error) {
			return [null, throwable]
		}
		throw throwable
	}
}
