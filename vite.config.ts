/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    testTimeout: 10000, // 10 seconds timeout
    hookTimeout: 10000, // 10 seconds for hooks
  },
  server: {
    port: 3000,
    cors: true,
  },
})