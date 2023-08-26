export function assert(condition: boolean, message: string): asserts condition {
	if (!condition) {
		throw new Error(message)
	}
}

export function getTypeAsString(v: any) {
	return Object.prototype.toString.call(v)
}

export function getTypeName(v: any) {
	if (v === null) {
		return 'null'
	}

	const type = getTypeAsString(v).slice(8, -1).toLowerCase()

	return (typeof v === 'object' || typeof v === 'function')
		? type
		: typeof v
}

export function noop() {}
