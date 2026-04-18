import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // listen on all interfaces so LAN devices can reach it
    port: 5173,
    proxy: {
      // Forward PocketBase API and admin UI to local PocketBase instance during dev
      '/api': 'http://localhost:8090',
      '/_': 'http://localhost:8090',
    },
  },
})
