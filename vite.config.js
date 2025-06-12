import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/interview-practice/',
  plugins: [react()],
  build: {
    outDir: 'build' // Optional — only if you want `build` instead of `dist`
  },
})
