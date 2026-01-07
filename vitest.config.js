import path from 'path'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,
    setupFiles: ['./src/test/vitest.setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      '.output',
      '.nuxt',
      '.nitro'
    ],
  },
  resolve: {
    alias: {
        '@': path.resolve(__dirname, 'src'),
        '~': path.resolve(__dirname, 'src'),
      },
  }
})