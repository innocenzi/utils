import { describe, expect, expectTypeOf, it } from 'vitest'
import { asyncInvoke, invoke, match, tap, tryAsync, value } from './function'

it('invoke', async () => {
	expect(invoke(undefined)).toBeUndefined()
	expect(invoke(() => 'foo')).toBe('foo')
})

it('asyncInvoke', async () => {
	expect(await Promise.all([
		asyncInvoke(async () => 'foo'),
		asyncInvoke(async () => 'bar'),
	])).toStrictEqual(['foo', 'bar'])
})

it('value', () => {
	expect(value(undefined)).toBeUndefined()
	expect(value('foo')).toBe('foo')
	expect(value(() => 'foo')).toBe('foo')
})

it('tap', () => {
	expect(tap(1, (value) => value++)).toEqual(1)
	expect(tap(undefined, (value) => value)).toBeUndefined()
	expect(tap({ a: 1 }, (obj) => obj.a++)).toEqual({ a: 2 })
})

it('match', () => {
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
		default: 'nope',
	})).toEqual('1')

	expect(match('owo' as 'foo' | 'bar', {
		foo: '1',
		bar: '2',
		default: 'uwu',
	})).toEqual('uwu')

	// @ts-expect-error missing 'default' or 'bar'
	expect(match('foo' as 'foo' | 'bar', {
		foo: () => '1',
	})).toBe('1')

	expect(match('foo' as 'foo' | 'bar', {
		foo: () => '1',
		bar: () => '2',
	})).toBe('1')

	expect(match(undefined as 'foo' | 'bar' | undefined, {
		foo: () => '1',
		bar: () => '2',
		default: 'foo',
	})).toBe('foo')

	expect(match('foo' as 'foo' | 'bar' | undefined, {
		bar: () => '2',
		default: '1',
	})).toBe('1')

	expect(match(123, {
		100: 'foo',
		200: 'bar',
		default: 'baz',
	})).toBe('baz')

	expectTypeOf(match('foo', { foo: () => 1, bar: () => 2 })).toBeNumber()
	expectTypeOf(match('foo', { foo: () => 'a', bar: () => 'b' })).toBeString()
	expectTypeOf(match('foo', { foo: () => 'a', bar: () => 'b', default: () => 'c' })).toBeString()
	expectTypeOf(match('foo', { foo: 1, bar: 2 })).toBeNumber()
	expectTypeOf(match('foo', { baz: 1, bar: 2, default: 3 })).toBeNumber()
	expectTypeOf(match(123, { 123: 'foo', 200: 'bar' })).toBeString()
	expectTypeOf(match(123, { 100: 'foo', 200: 'bar', default: 'baz' })).toBeString()
	expectTypeOf(match('bar' as string | number, { foo: 'a', default: 'b' })).toMatchTypeOf<string | number>()
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
