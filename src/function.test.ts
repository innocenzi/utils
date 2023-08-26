import { expect, it } from 'vitest'
import { asyncInvoke, invoke, match, tap, value } from './function'

it('invoke', async() => {
	expect(invoke(undefined)).toBeUndefined()
	expect(invoke(() => 'foo')).toBe('foo')
})

it('asyncInvoke', async() => {
	expect(await Promise.all([
		asyncInvoke(async() => 'foo'),
		asyncInvoke(async() => 'bar'),
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

	expect(match('owo' as 'foo' | 'bar', {
		foo: '1',
		bar: '2',
		default: 'uwu',
	})).toEqual('uwu')

	expect(match('foo' as 'foo' | 'bar', {
		foo: () => '1',
		bar: () => '2',
	})).toBe('1')
})
