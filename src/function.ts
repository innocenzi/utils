import { isFunction } from './is'
import type { AwaitableFn, Fn, Nullable } from './types'
export { switchCase as match } from 'ts-switch-case'

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

/**
 * Memoizes a value.
 *
 * @example
 * ```
 * const result = memoize(() => expensiveFn())
 * result.value // computed
 * result.value // memoized
 */
export function memoize<T>(getter: () => T): { value: T } {
	return {
		get value() {
			const value = getter()
			Object.defineProperty(this, 'value', { value })
			return value
		},
	}
}
