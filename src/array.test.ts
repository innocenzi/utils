import { describe, expect, expectTypeOf, it, test } from 'vitest'
import { dot, flattenArrayable, partition, range, toArray, undot } from './array'

describe('toArray', () => {
	it.each([
		[undefined, []],
		[null, []],
		[false, [false]],
		[0, [0]],
		['', ['']],
		[[], []],
		['foo', ['foo']],
		[['foo'], ['foo']],
	])('%s => %s', (input, expected) => {
		expect(toArray(input)).toEqual(expected)
	})
})

test('flattenArrayable', () => {
	expect(flattenArrayable()).toEqual([])
	expect(flattenArrayable([])).toEqual([])
	expect(flattenArrayable(1)).toEqual([1])
	expect(flattenArrayable([1, '2', 3])).toEqual([1, '2', 3])
	expect(flattenArrayable([1, [1, 2]])).toEqual([1, 1, 2])
	expect(flattenArrayable([1, [1, [2]]])).toEqual([1, 1, [2]])
})

test('range', () => {
	expect(range(0)).toEqual([])
	expect(range(2)).toEqual([0, 1])
	expect(range(2, 5)).toEqual([2, 3, 4])
	expect(range(2, 10, 2)).toEqual([2, 4, 6, 8])
	expect(range(3, 0, -1)).toEqual([3, 2, 1])
})

test('partition', () => {
	const data = range(10)

	expect(
		partition(data, (i) => i % 2),
	).toEqual([
		[1, 3, 5, 7, 9],
		[0, 2, 4, 6, 8],
	])

	expect(
		partition(
			data,
			(i) => i % 3 === 0,
			(i) => i % 2 === 0,
		),
	).toEqual([
		[0, 3, 6, 9],
		[2, 4, 8],
		[1, 5, 7],
	])

	expect(
		partition(
			data,
			(i) => i,
		),
	).toHaveLength(2)

	expect(
		partition(
			data,
			(i) => i,
			(i) => i,
			(i) => i,
			(i) => i,
			(i) => i,
		),
	).toHaveLength(6)
})

describe('undot', () => {
	it('should undot keyed collection', () => {
		expect(undot({
			'name': 'Taylor',
			'meta.foo': 'bar',
			'meta.baz': ['boom', 'boom', 'boom'],
			'meta.bam.boom': 'bip',
		})).to.eql({
			name: 'Taylor',
			meta: {
				foo: 'bar',
				baz: ['boom', 'boom', 'boom'],
				bam: {
					boom: 'bip',
				},
			},
		})
	})

	it('should undot indexed collection', () => {
		expect(undot({
			'foo.0': 'bar',
			'foo.1': 'baz',
			'foo.baz': 'boom',
		})).to.eql({
			foo: {
				0: 'bar',
				1: 'baz',
				baz: 'boom',
			},
		})
	})

	it('should undot documentation example', () => {
		expect(undot({
			'name.first_name': 'Marie',
			'name.last_name': 'Valentine',
			'address.line_1': '2992 Eagle Drive',
			'address.line_2': '',
			'address.suburb': 'Detroit',
			'address.state': 'MI',
			'address.postcode': '48219',
		})).to.eql({
			name: {
				first_name: 'Marie',
				last_name: 'Valentine',
			},
			address: {
				line_1: '2992 Eagle Drive',
				line_2: '',
				suburb: 'Detroit',
				state: 'MI',
				postcode: '48219',
			},
		})
	})

	it('is typed', () => {
		expectTypeOf(undot({ 'foo.bar': 'baz' })).toMatchTypeOf<{ foo: { bar: string } }>()
	})
})

describe('dot', () => {
	it('should dot to keyed collection', () => {
		expect(dot({
			name: 'Taylor',
			meta: {
				foo: 'bar',
				baz: ['boom', 'boom', 'boom'],
				bam: {
					boom: 'bip',
				},
			},
		})).to.eql({
			'name': 'Taylor',
			'meta.foo': 'bar',
			'meta.baz': ['boom', 'boom', 'boom'],
			'meta.bam.boom': 'bip',
		})
	})

	it('should dot to indexed collection', () => {
		expect(dot({
			foo: {
				0: 'bar',
				1: 'baz',
				baz: 'boom',
			},
		})).to.eql({
			'foo.0': 'bar',
			'foo.1': 'baz',
			'foo.baz': 'boom',
		})
	})

	it('should dot documentation example', () => {
		expect(dot({
			name: {
				first_name: 'Marie',
				last_name: 'Valentine',
			},
			address: {
				line_1: '2992 Eagle Drive',
				line_2: '',
				suburb: 'Detroit',
				state: 'MI',
				postcode: '48219',
			},
		})).to.eql({
			'name.first_name': 'Marie',
			'name.last_name': 'Valentine',
			'address.line_1': '2992 Eagle Drive',
			'address.line_2': '',
			'address.suburb': 'Detroit',
			'address.state': 'MI',
			'address.postcode': '48219',
		})
	})
})
