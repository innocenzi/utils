import { clamp } from './math'
import type { Arrayable, Nullable } from './types'

/**
 * Converts an `Arrayable<T>` to an `Array<T>`.
 *
 * @category Array
 */
export function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T> {
	array = array ?? []
	return Array.isArray(array) ? array : [array]
}

/**
 * Converts an `Arrayable<T>` to `Array<T>` and flattens it.
 *
 * @category Array
 */
export function flattenArrayable<T>(array?: Nullable<Arrayable<T | Array<T>>>): Array<T> {
	return toArray(array).flat(1) as Array<T>
}

/**
 * Merges multiple `Arrayable<T>`.
 *
 * @category Array
 */
export function mergeArrayable<T>(...args: Nullable<Arrayable<T>>[]): Array<T> {
	return args.flatMap((i) => toArray(i))
}

export type PartitionFilter<T> = (i: T, idx: number, arr: readonly T[]) => any

/**
 * Divides an array into two parts by a filter function.
 *
 * @category Array
 * @example const [odd, even] = partition([1, 2, 3, 4], (i) => i % 2 != 0)
 */
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>): [T[], T[]]
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>, f2: PartitionFilter<T>): [T[], T[], T[]]
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>, f2: PartitionFilter<T>, f3: PartitionFilter<T>): [T[], T[], T[], T[]]
export function partition<T>(
	array: readonly T[],
	f1: PartitionFilter<T>,
	f2: PartitionFilter<T>,
	f3: PartitionFilter<T>,
	f4: PartitionFilter<T>,
): [T[], T[], T[], T[], T[]]
export function partition<T>(
	array: readonly T[],
	f1: PartitionFilter<T>,
	f2: PartitionFilter<T>,
	f3: PartitionFilter<T>,
	f4: PartitionFilter<T>,
	f5: PartitionFilter<T>,
): [T[], T[], T[], T[], T[], T[]]
export function partition<T>(
	array: readonly T[],
	f1: PartitionFilter<T>,
	f2: PartitionFilter<T>,
	f3: PartitionFilter<T>,
	f4: PartitionFilter<T>,
	f5: PartitionFilter<T>,
	f6: PartitionFilter<T>,
): [T[], T[], T[], T[], T[], T[], T[]]
export function partition<T>(array: readonly T[], ...filters: PartitionFilter<T>[]): any {
	const result: T[][] = Array.from({ length: filters.length + 1 }).fill(null).map(() => [])

	array.forEach((e, idx, arr) => {
		let i = 0
		for (const filter of filters) {
			if (filter(e, idx, arr)) {
				result[i].push(e)
				return
			}
			i += 1
		}
		result[i].push(e)
	})
	return result
}

/**
 * Returns a copy of an array without duplicates.
 *
 * @category Array
 */
export function uniq<T>(array: readonly T[]): T[] {
	return Array.from(new Set(array))
}

/**
 * Returns a copy of an array without duplicates using the given equality function.
 *
 * @category Array
 */
export function uniqueBy<T>(array: readonly T[], equalFn: (a: any, b: any) => boolean): T[] {
	return array.reduce((acc: T[], cur: any) => {
		const index = acc.findIndex((item: any) => equalFn(cur, item))
		if (index === -1) {
			acc.push(cur)
		}

		return acc
	}, [])
}

/**
 * Gets the last item of an array.
 *
 * @category Array
 */
export function last(array: readonly []): undefined
export function last<T>(array: readonly T[]): T
export function last<T>(array: readonly T[]): T | undefined {
	return at(array, -1)
}

/**
 * Removes an item from an array.
 *
 * @category Array
 */
export function remove<T>(array: T[], value: T) {
	if (!array) {
		return false
	}
	const index = array.indexOf(value)
	if (index >= 0) {
		array.splice(index, 1)
		return true
	}

	return false
}

/**
 * Gets the nth item of an array.
 *
 * @category Array
 */
export function at(array: readonly [], index: number): undefined
export function at<T>(array: readonly T[], index: number): T
export function at<T>(array: readonly T[] | [], index: number): T | undefined {
	const len = array.length
	if (!len) {
		return undefined
	}

	if (index < 0) {
		index += len
	}

	return array[index]
}

/**
 * Generates a range array of numbers. `stop` is exclusive.
 *
 * @category Array
 */
export function range(stop: number): number[]
export function range(start: number, stop: number, step?: number): number[]
export function range(...args: any): number[] {
	let start: number, stop: number, step: number

	if (args.length === 1) {
		start = 0
		step = 1
		;[stop] = args
	} else {
		;[start, stop, step = 1] = args
	}

	const arr: number[] = []
	let current = start
	while (step > 0 ? (current < stop) : (current > stop)) {
		arr.push(current)
		current += step || 1
	}

	return arr
}

/**
 * Moves an element in an array.
 *
 * @category Array
 * @param arr
 * @param from
 * @param to
 */
export function move<T>(arr: T[], from: number, to: number) {
	arr.splice(to, 0, arr.splice(from, 1)[0])
	return arr
}

/**
 * Clamps a number to the index range of an array.
 *
 * @category Array
 */
export function clampArrayRange(n: number, arr: readonly unknown[]) {
	return clamp(n, 0, arr.length - 1)
}

/**
 * Gets random item(s) from an array.
 *
 * @param arr
 * @param quantity - quantity of random items which will be returned
 */
export function sample<T>(arr: T[], quantity: number) {
	return Array.from({ length: quantity }, (_) => arr[Math.round(Math.random() * (arr.length - 1))])
}

/**
 * Shuffles an array. This function mutates the array.
 *
 * @category Array
 */
export function shuffle<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}

	return array
}

// TODO: types, see @clickbar/dot-diver

/**
 * Expands a single-dimensional object that uses "dot" notation into a multi-dimensional object.
 */
export function undot<T extends object>(input: T): any {
	const result: Record<string, any> = {}

	for (const key in input) {
		const value = input[key]

		if (key.includes('.')) {
			const nestedKeys = key.split('.')
			let currentLevel = result

			for (let i = 0; i < nestedKeys.length; i++) {
				const nestedKey = nestedKeys[i]

				if (!currentLevel[nestedKey]) {
					currentLevel[nestedKey] = i === nestedKeys.length - 1 ? value : {}
				}

				currentLevel = currentLevel[nestedKey]
			}
		} else {
			result[key] = value
		}
	}

	return result as any
}

/**
 * Flattens a multi-dimensional object into a single-level object that uses "dot" notation to indicate depth:.
 */
export function dot<T extends Record<string, any>>(input?: T): Record<string, any> {
	const result: Record<string, any> = {}

	function flatten(obj?: Record<string, any>, path: string[] = []) {
		for (const key in obj) {
			const value = obj[key]

			if (Array.isArray(value)) {
				result[[...path, key].join('.')] = value as string[]
			} else if (typeof value === 'object' && value !== null) {
				flatten(value, [...path, key])
			} else {
				result[[...path, key].join('.')] = value
			}
		}
	}

	flatten(input)

	return result
}

/**
 * Joins an array of strings with a separator, using a different separator for the last item.
 */
export function join<T>(
	array: T[],
	options: { separator?: string; lastSeparator?: string } = {},
): string {
	options = {
		separator: ', ',
		lastSeparator: ' and ',
		...options,
	}

	if (array.length === 0) {
		return ''
	}

	if (array.length === 1) {
		return String(array[0])
	}

	if (array.length === 2) {
		return `${array[0]}${options.lastSeparator}${array[1]}`
	}

	// For arrays with 3+ items
	const allButLast = array.slice(0, -1)
	const lastItem = array[array.length - 1]

	return `${allButLast.join(options.separator)}${options.lastSeparator}${lastItem}`
}
