export type WithoutTimestamps<T> = Omit<T, 'createdAt' | 'updatedAt'>

export type DataToApiPost<T> = WithoutTimestamps<Omit<T, 'id' | 'freight_id'>>

// transform all fields of an object to string, except for the keys in K
export type Stringable<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] : string
}
