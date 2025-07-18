import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['.trycloudflare.com'], // wildcard for all tunnel domains
    host: true, // optional, allows access from external IPs too
  }
})
