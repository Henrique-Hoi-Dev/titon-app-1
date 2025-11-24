// TypeScript entry point - Metro bundler will resolve to .web.ts or .native.ts at runtime
// This file ensures TypeScript can find the module during type checking
export * from './skia.native'
export type { SkImage } from './skia.native'
