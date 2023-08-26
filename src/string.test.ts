import { expect, it } from 'vitest'
import { capitalize, ensureStartsWith, ensureEndsWith, toForwardSlashes, template, toBackSlashes, replaceFirst, replaceLast, before, beforeLast, after, afterLast, between, betweenShrink } from './string'

it('template', () => {
	expect(
		template(
			'Hello {0}! My name is {1}.',
			'Inès',
			'Anthony',
		),
	).toEqual('Hello Inès! My name is Anthony.')

	expect(
		template(
			'{0} + {1} = {2}{3}',
			1,
			'1',
			// @ts-expect-error disallow non-literal on type
			{ v: 2 },
			[2, 3],
		),
	).toEqual('1 + 1 = [object Object]2,3')

	expect(
		template(
			'{10}',
		),
	).toEqual('undefined')

	expect(
		template(
			'Hi',
			'',
		),
	).toEqual('Hi')
})

it('namedTemplate', () => {
	expect(
		template(
			'{greet}! My name is {name}.',
			{ greet: 'Hello', name: 'Anthony' },
		),
	).toEqual('Hello! My name is Anthony.')

	expect(
		template(
			'{a} + {b} = {result}',
			{ a: 1, b: 2, result: 3 },
		),
	).toEqual('1 + 2 = 3')

	expect(
		template(
			'{1} + {b} = 3',
			{ 1: 'a', b: 2 },
		),
	).toEqual('a + 2 = 3')

	// Without fallback return the variable name
	expect(
		template(
			'{10}',
			{},
		),
	).toEqual('10')

	expect(
		template(
			'{11}',
			null,
		),
	).toEqual('undefined')

	expect(
		template(
			'{11}',
			undefined,
		),
	).toEqual('undefined')

	expect(
		template(
			'{10}',
			{},
			'unknown',
		),
	).toEqual('unknown')

	expect(
		template(
			'{1} {2} {3} {4}',
			{ 4: 'known key' },
			(k) => String(+k * 2),
		),
	).toEqual('2 4 6 known key')
})

it('toForwardSlashes', () => {
	expect(toForwardSlashes('\\123')).toEqual('/123')
	expect(toForwardSlashes('\\\\')).toEqual('//')
	expect(toForwardSlashes('\\\h\\\i')).toEqual('/h/i')
})

it('toBackSlashes', () => {
	expect(toBackSlashes('/123')).toEqual('\\123')
	expect(toBackSlashes('//')).toEqual('\\\\')
	expect(toBackSlashes('/\h/\i')).toEqual('\\h\\i')
})

it('ensurePrefix', () => {
	expect(ensureStartsWith('abc', 'abcdef')).toEqual('abcdef')
	expect(ensureStartsWith('hi ', 'jack')).toEqual('hi jack')
})

it('ensureSuffix', () => {
	expect(ensureEndsWith('world', 'hello ')).toEqual('hello world')
	expect(ensureEndsWith('123', 'abc123')).toEqual('abc123')
})

it('capitalize', () => {
	expect(capitalize('hello World')).toEqual('Hello world')
	expect(capitalize('123')).toEqual('123')
	expect(capitalize('中国')).toEqual('中国')
	expect(capitalize('āÁĂÀ')).toEqual('Āáăà')
	expect(capitalize('\a')).toEqual('A')
})

it('replaceFirst', () => {
	expect(replaceFirst('bar', 'qux', 'foobar foobar')).toEqual('fooqux foobar')
	expect(replaceFirst('bar?', 'qux?', 'foo/bar? foo/bar?')).toEqual('foo/qux? foo/bar?')
	expect(replaceFirst('bar', '', 'foobar foobar')).toEqual('foo foobar')
	expect(replaceFirst('xxx', 'yyy', 'foobar foobar')).toEqual('foobar foobar')
	expect(replaceFirst('', 'yyy', 'foobar foobar')).toEqual('foobar foobar')
	expect(replaceFirst(0, '1', '0')).toEqual('1')
})

it('replaceLast', () => {
	expect(replaceLast('bar', 'qux', 'foobar foobar')).toEqual('foobar fooqux')
	expect(replaceLast('bar?', 'qux?', 'foo/bar? foo/bar?')).toEqual('foo/bar? foo/qux?')
	expect(replaceLast('bar', '', 'foobar foobar')).toEqual('foobar foo')
	expect(replaceLast('xxx', 'yyy', 'foobar foobar')).toEqual('foobar foobar')
	expect(replaceLast('', 'yyy', 'foobar foobar')).toEqual('foobar foobar')
})

it('before', () => {
	expect(before('hannah', 'nah')).toEqual('han')
	expect(before('hannah', 'n')).toEqual('ha')
	expect(before('ééé hannah', 'han')).toEqual('ééé ')
	expect(before('hannah', 'xxxx')).toEqual('hannah')
	expect(before('hannah', '')).toEqual('hannah')
	expect(before('han0nah', '0')).toEqual('han')
	expect(before('han0nah', 0)).toEqual('han')
	expect(before('han2nah', 2)).toEqual('han')
})

it('beforeLast', () => {
	expect(beforeLast('yvette', 'tte')).toEqual('yve')
	expect(beforeLast('yvette', 't')).toEqual('yvet')
	expect(beforeLast('ééé yvette', 'yve')).toEqual('ééé ')
	expect(beforeLast('yvette', 'yve')).toEqual('')
	expect(beforeLast('yvette', 'xxxx')).toEqual('yvette')
	expect(beforeLast('yvette', '')).toEqual('yvette')
	expect(beforeLast('yv0et0te', '0')).toEqual('yv0et')
	expect(beforeLast('yv0et0te', 0)).toEqual('yv0et')
	expect(beforeLast('yv2et2te', 2)).toEqual('yv2et')
})

it('after', () => {
	expect(after('hannah', 'han')).toEqual('nah')
	expect(after('hannah', 'n')).toEqual('nah')
	expect(after('ééé hannah', 'han')).toEqual('nah')
	expect(after('hannah', 'xxxx')).toEqual('hannah')
	expect(after('hannah', '')).toEqual('hannah')
	expect(after('han0nah', '0')).toEqual('nah')
	expect(after('han0nah', 0)).toEqual('nah')
	expect(after('han2nah', 2)).toEqual('nah')
})

it('afterLast', () => {
	expect(afterLast('yvette', 'yve')).toEqual('tte')
	expect(afterLast('yvette', 't')).toEqual('e')
	expect(afterLast('ééé yvette', 't')).toEqual('e')
	expect(afterLast('yvette', 'tte')).toEqual('')
	expect(afterLast('yvette', 'xxxx')).toEqual('yvette')
	expect(afterLast('yvette', '')).toEqual('yvette')
	expect(afterLast('yv0et0te', '0')).toEqual('te')
	expect(afterLast('yv0et0te', 0)).toEqual('te')
	expect(afterLast('yv2et2te', 2)).toEqual('te')
	expect(afterLast('----foo', '---')).toEqual('foo')
})

it('between', () => {
	expect(between('abc', '', 'c')).toEqual('abc')
	expect(between('abc', 'a', '')).toEqual('abc')
	expect(between('abc', '', '')).toEqual('abc')
	expect(between('abc', 'a', 'c')).toEqual('b')
	expect(between('dddabc', 'a', 'c')).toEqual('b')
	expect(between('abcddd', 'a', 'c')).toEqual('b')
	expect(between('dddabcddd', 'a', 'c')).toEqual('b')
	expect(between('hannah', 'ha', 'ah')).toEqual('nn')
	expect(between('[a]ab[b]', '[', ']')).toEqual('a]ab[b')
	expect(between('foofoobar', 'foo', 'bar')).toEqual('foo')
	expect(between('foobarbar', 'foo', 'bar')).toEqual('bar')
})

it('betweenShrink', () => {
	expect(betweenShrink('abc', '', 'c')).toEqual('abc')
	expect(betweenShrink('abc', 'a', '')).toEqual('abc')
	expect(betweenShrink('abc', '', '')).toEqual('abc')
	expect(betweenShrink('abc', 'a', 'c')).toEqual('b')
	expect(betweenShrink('dddabc', 'a', 'c')).toEqual('b')
	expect(betweenShrink('abcddd', 'a', 'c')).toEqual('b')
	expect(betweenShrink('dddabcddd', 'a', 'c')).toEqual('b')
	expect(betweenShrink('hannah', 'ha', 'ah')).toEqual('nn')
	expect(betweenShrink('[a]ab[b]', '[', ']')).toEqual('a')
	expect(betweenShrink('foofoobar', 'foo', 'bar')).toEqual('foo')
	expect(betweenShrink('foobarbar', 'foo', 'bar')).toEqual('')
})
