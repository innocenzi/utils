import { flattenArrayable } from './array'

/**
 * Clamps the given number between `min` and `max`.
 *
 * @category Math
 */
export function clamp(n: number, min: number, max: number) {
	return Math.min(max, Math.max(min, n))
}

/**
 * Returns the sum of all numbers in the given array.
 *
 * @category Math
 */
export function sum(...args: number[] | number[][]) {
	return flattenArrayable(args).reduce((a, b) => a + b, 0)
}

/**
 * Linearly interpolates between `min` and `max` based on `t`
 *
 * @category Math
 * @param t The interpolation value clamped between 0 and 1
 * @example
 * ```
 * const value = lerp(0, 2, 0.5) // value will be 1
 * ```
 */
export function lerp(min: number, max: number, t: number) {
	const interpolation = clamp(t, 0.0, 1.0)
	return min + (max - min) * interpolation
}

/**
 * Returns the magnitude of a vector with components `a` and `b`.
 *
 * @category Math
 */
export function magnitude(a: number, b: number) {
	return Math.sqrt((a * a) + (b * b))
}

/**
 * Linearly remaps a clamped value from its source range [`inMin`, `inMax`] to the destination range [`outMin`, `outMax`]
 *
 * @category Math
 * @example
 * ```
 * const value = remap(0.5, 0, 1, 200, 400) // value will be 300
 * ```
 */
export function remap(n: number, inMin: number, inMax: number, outMin: number, outMax: number) {
	const interpolation = (n - inMin) / (inMax - inMin)
	return lerp(outMin, outMax, interpolation)
}
/**
 * Gradually changes a value towards a desired goal over time.
 * From: https://github.com/Unity-Technologies/UnityCsReference/blob/02d565cf3dd0f6b15069ba976064c75dc2705b08/Runtime/Export/Math/Mathf.cs#L301-L329
 *
 * @param velocity Reference to current velocity
 * @param smoothTime Larger number = more smoothing
 * @param deltaTime In seconds
 */
export function smoothDamp(
	current: number,
	target: number,
	velocity: number,
	smoothTime: number,
	maxSpeed: number,
	deltaTime: number,
) {
	// Based on Game Programming Gems 4 Chapter 1.10
	smoothTime = Math.max(0.0001, smoothTime)
	const omega = 2.0 / smoothTime

	const x = omega * deltaTime
	const exp = 1.0 / (1.0 + x + 0.48 * x * x + 0.235 * x * x * x)
	let change = current - target
	const originalTo = target

	// Clamp maximum speed
	const maxChange = maxSpeed * smoothTime
	change = clamp(change, -maxChange, maxChange)
	target = current - change

	const temp = (velocity + omega * change) * deltaTime
	velocity = (velocity - omega * temp) * exp
	let smoothed = target + (change + temp) * exp

	// Prevent overshooting
	if ((originalTo - current > 0.0) === (smoothed > originalTo)) {
		smoothed = originalTo
		velocity = (smoothed - originalTo) / deltaTime
	}

	return {
		smoothed,
		velocity,
	}
}
