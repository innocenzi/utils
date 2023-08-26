import { expect, it } from 'vitest'
import { capitalize, ensureStartsWith, ensureEndsWith, toForwardSlashes, template, toBackSlashes, replaceFirst } from './string'

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
	// $this->assertSame('fooqux foobar', Str::replaceFirst('bar', 'qux', 'foobar foobar'));
	// $this->assertSame('foo/qux? foo/bar?', Str::replaceFirst('bar?', 'qux?', 'foo/bar? foo/bar?'));
	// $this->assertSame('foo foobar', Str::replaceFirst('bar', '', 'foobar foobar'));
	// $this->assertSame('foobar foobar', Str::replaceFirst('xxx', 'yyy', 'foobar foobar'));
	// $this->assertSame('foobar foobar', Str::replaceFirst('', 'yyy', 'foobar foobar'));
	// $this->assertSame('1', Str::replaceFirst(0, '1', '0'));

	expect(replaceFirst('bar', 'qux', 'foobar foobar')).toEqual('fooqux foobar')
	expect(replaceFirst('bar?', 'qux?', 'foo/bar? foo/bar?')).toEqual('foo/qux? foo/bar?')
	expect(replaceFirst('bar', '', 'foobar foobar')).toEqual('foo foobar')
	expect(replaceFirst('xxx', 'yyy', 'foobar foobar')).toEqual('foobar foobar')
	expect(replaceFirst('', 'yyy', 'foobar foobar')).toEqual('foobar foobar')
	expect(replaceFirst(0, '1', '0')).toEqual('1')
})
