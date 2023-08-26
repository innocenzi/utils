import { expect, it } from 'vitest'
import { isDeepEqual } from './equal'

it('equal', () => {
	expect(isDeepEqual(
		[1, 2, [3, 4], 'foo', { bar: 'baz', qux: [1, 2, 3] }],
		[1, 2, [3, 4], 'foo', { bar: 'baz', qux: [1, 2, 3] }],
	)).toBe(true)

	expect(isDeepEqual(
		[1, 2, [3, 4]],
		[1, 2, [3, 5]],
	)).toBe(false)

	expect(isDeepEqual(
		[{ bar: 'baz' }],
		[{ bar: 'oow' }],
	)).toBe(false)
})
