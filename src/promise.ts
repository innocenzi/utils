import { remove } from './array'
import type { Fn } from './types'

export interface SingletonPromiseReturn<T> {
	(): Promise<T>
	/**
   * Resets the current staled promise.
   * Await it to have proper shutdown.
   */
	reset: () => Promise<void>
}

/**
 * Creates a singleton promise function.
 *
 * @category Promise
 * @example
 * ```
 * const fn = createSingletonPromise(async () => {
 *  await doSomething()
 * })
 *
 * await fn
 * fn.reset()
 * ```
 */
export function createSingletonPromise<T>(fn: () => Promise<T>): SingletonPromiseReturn<T> {
	let _promise: Promise<T> | undefined

	function wrapper() {
		if (!_promise) {
			_promise = fn()
		}

		return _promise
	}

	wrapper.reset = async() => {
		const _prev = _promise
		_promise = undefined
		if (_prev) {
			await _prev
		}
	}

	return wrapper
}

/**
 * Waits for the given amount of milliseconds.
 *
 * @category Promise
 */
export function sleep(ms: number, callback?: Fn<any>) {
	return new Promise<void>((resolve) =>

		setTimeout(async() => {
			await callback?.()
			resolve()
		}, ms),
	)
}

/**
 * Creates a deferred promise.
 *
 * @category Promise
 * @example
 * ```
 * const lock = createPromiseLock()
 *
 * lock.run(async () => {
 *   await doSomething()
 * })
 *
 * // in anther context:
 * await lock.wait() // it will wait all tasking finished
 * ```
 */
export function createDefferedPromise() {
	const locks: Promise<any>[] = []

	return {
		async run<T = void>(fn: () => Promise<T>): Promise<T> {
			const p = fn()
			locks.push(p)
			try {
				return await p
			} finally {
				remove(locks, p)
			}
		},
		async wait(): Promise<void> {
			await Promise.allSettled(locks)
		},
		isWaiting() {
			return Boolean(locks.length)
		},
		clear() {
			locks.length = 0
		},
	}
}

/**
 * Promise with `resolve` and `reject` methods of itself
 */
export interface ControlledPromise<T = void> extends Promise<T> {
	resolve(value: T | PromiseLike<T>): void
	reject(reason?: any): void
}

/**
 * Returns a Promise with `resolve` and `reject` methods.
 *
 * @category Promise
 * @example
 * ```
 * const promise = createControlledPromise()
 *
 * await promise
 *
 * // in anther context:
 * promise.resolve(data)
 * ```
 */
export function createControlledPromise<T>(): ControlledPromise<T> {
	let resolve: any, reject: any
	const promise = new Promise<T>((_resolve, _reject) => {
		resolve = _resolve
		reject = _reject
	}) as ControlledPromise<T>
	promise.resolve = resolve
	promise.reject = reject
	return promise
}
