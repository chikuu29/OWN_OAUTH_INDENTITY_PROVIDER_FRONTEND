import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import createVersionPlugin from './plugin/vite-plugin-version/index'; // Adjust the path as needed
import tsconfigPaths from 'vite-tsconfig-paths'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), createVersionPlugin(),tsconfigPaths()],
  server: {

    hmr: {overlay:true},
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
