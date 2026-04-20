import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  envPrefix: ['REACT_APP_', 'VITE_'],
  server: { port: 3000, open: false },
  build: { outDir: 'build' },
})
