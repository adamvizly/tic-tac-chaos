import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/ws': {
        target: 'wss://tic-tac-chaos-production.up.railway.app',
        ws: true
      }
    }
  }
})
