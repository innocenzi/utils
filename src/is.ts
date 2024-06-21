import { getTypeAsString } from './base'

export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean'
export const isFunction = <T extends Function> (val: any): val is T => typeof val === 'function'
export const isNumber = (val: any): val is number => typeof val === 'number'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isObject = (val: any): val is object => getTypeAsString(val) === '[object Object]'
export const isUndefined = (val: any): val is undefined => getTypeAsString(val) === '[object Undefined]'
export const isNull = (val: any): val is null => getTypeAsString(val) === '[object Null]'
export const isRegExp = (val: any): val is RegExp => getTypeAsString(val) === '[object RegExp]'
export const isDate = (val: any): val is Date => getTypeAsString(val) === '[object Date]'

// @ts-expect-error window is not typed here
export const isWindow = (val: any): boolean => typeof window !== 'undefined' && getTypeAsString(val) === '[object Window]'
// @ts-expect-error window is not typed here
export const isBrowser = typeof window !== 'undefined'
