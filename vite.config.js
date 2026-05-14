import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub repo name.
// Repo "manpreet.github.io" -> base "/manpreet.github.io/".
// If you rename the repo to "data-is-spaghetti.github.io", set base to "/".
export default defineConfig({
  plugins: [react()],
  base: '/manpreet.github.io/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
})
