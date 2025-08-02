export type WithoutTimestamps<T> = Omit<T, 'createdAt' | 'updatedAt'>

export type DataToApiPost<T> = WithoutTimestamps<Omit<T, 'id' | 'freight_id'>>

// transform all fields of an object to string, except for the keys in K
export type Stringable<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] : string
}

// transform all keys of an object to camelCase, except for the keys in K, K is optional
// if K is not provided, all keys will be transformed to camelCase
// if K is provided, only the keys in K will not be transformed to camelCase
// if K is provided, the keys in K will be kept as they are
// if K is a union type, all keys in the union will be kept as they are
export type CamelCase<T, K extends keyof T = never> = {
  [P in keyof T as P extends K ? P : CamelCaseString<P & string>]: T[P]
}

// transform a string to camelCase
export type CamelCaseString<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${Lowercase<T>}${Capitalize<CamelCaseString<U>>}`
    : Lowercase<S>