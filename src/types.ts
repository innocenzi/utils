export type Awaitable<T> = T | PromiseLike<T>
export type AwaitableFn<T> = Fn<Awaitable<T>>
export type Nullable<T> = T | null | undefined
export type Arrayable<T> = T | Array<T>
export type Fn<T = void> = () => T
export type Constructor<T = void> = new (...args: any[]) => T
export type ElementOf<T> = T extends (infer E)[] ? E : never

/**
 * Defines an intersection type of all union items.
 *
 * @param U Union of any types that will be intersected.
 * @returns U items intersected
 * @see https://stackoverflow.com/a/50375286/9259330
 */
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

/**
 * Infers the arguments type of a function
 */
export type ArgumentsType<T> = T extends ((...args: infer A) => any) ? A : never

export type MergeInsertions<T> =
	T extends object
		? { [K in keyof T]: MergeInsertions<T[K]> }
		: T

export type DeepMerge<F, S> = MergeInsertions<{
	[K in keyof F | keyof S]: K extends keyof S & keyof F
		? DeepMerge<F[K], S[K]>
		: K extends keyof S
			? S[K]
			: K extends keyof F
				? F[K]
				: never;
}>

export interface Vector2 {
	x: number
	y: number
}

export interface Vector3 {
	x: number
	y: number
	z: number
}
