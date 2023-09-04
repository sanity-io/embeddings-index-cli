export default {
  create: async (options: {argv: string[]}) => {
    await (await import('./create')).default(options)
  },
  delete: async (options: {argv: string[]}) => {
    await (await import('./delete')).default(options)
  },
  get: async (options: {argv: string[]}) => {
    await (await import('./get')).default(options)
  },
  list: async (options: {argv: string[]}) => {
    await (await import('./list')).default(options)
  },
  query: async (options: {argv: string[]}) => {
    await (await import('./query')).default(options)
  },
  manifest: async (options: {argv: string[]}) => {
    await (await import('./manifest')).default(options)
  },
  version: async (options: {argv: string[]}) => {
    await (await import('./version')).default(options)
  },
}
