import { describe, expect, expectTypeOf, it, test } from 'vitest'
import { asyncInvoke, invoke, match, memoize, tap, tryAsync, value } from './function'

test('invoke', async () => {
	expect(invoke(undefined)).toBeUndefined()
	expect(invoke(() => 'foo')).toBe('foo')
})

test('asyncInvoke', async () => {
	expect(
		await Promise.all([
			asyncInvoke(async () => 'foo'),
			asyncInvoke(async () => 'bar'),
		]),
	).toStrictEqual(['foo', 'bar'])
})

test('value', () => {
	expect(value(undefined)).toBeUndefined()
	expect(value('foo')).toBe('foo')
	expect(value(() => 'foo')).toBe('foo')
})

test('tap', () => {
	expect(tap(1, (value) => value++)).toEqual(1)
	expect(tap(undefined, (value) => value)).toBeUndefined()
	expect(tap({ a: 1 }, (obj) => obj.a++)).toEqual({ a: 2 })
})

test('match', () => {
	expect(match('foo', {
		foo: '1',
	})).toEqual('1')

	expect(match('foo' as 'foo' | 'bar', {
		foo: '1',
		bar: '2',
	})).toEqual('1')

	expect(match('foo' as 'foo' | 'bar', {
		foo: '1',
		bar: '2',
	}, () => 'nope')).toEqual('1')

	expect(match('owo' as 'foo' | 'bar', {
		foo: '1',
		bar: '2',
	}, () => 'uwu')).toEqual('uwu')

	// @ts-expect-error missing 'default' or 'bar'
	expect(match('foo' as 'foo' | 'bar', {
		foo: () => '1',
	})).toBe('1')

	expect(match('foo' as 'foo' | 'bar', {
		foo: () => '1',
		bar: () => '2',
	})).toBe('1')

	expectTypeOf(match('foo', { foo: () => 1 })).toBeNumber()
	expectTypeOf(match('foo', { foo: () => 'a' })).toBeString()
	expectTypeOf(match('foo', { foo: 1 })).toBeNumber()
	expectTypeOf(match(123, { 123: 'foo' })).toBeString()
	expectTypeOf(match('bar' as string | number, { foo: 'a' }, () => 'baz')).toExtend<string | number>()
})

describe('tryAsync', () => {
	it('returns the specified value', async () => {
		const [data, error] = await tryAsync(async () => ({
			foo: 'bar',
		}))

		expect(data).toStrictEqual({ foo: 'bar' })
		expect(error).toBeNull()
	})

	it('returns the error', async () => {
		const [data, error] = await tryAsync(async () => {
			throw new Error('You are a failure, said your father')
		})

		expect(data).toBeNull()
		expect(error).toBeInstanceOf(Error)
		expect((error as Error).message).toBe('You are a failure, said your father')
	})
})

test('memoize', () => {
	let count = 0

	const result = memoize(() => {
		count++
		return count
	})

	expect(result.value).toBe(1)
	expect(result.value).toBe(1)
})
