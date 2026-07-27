import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const portalNodeModules = fileURLToPath(new URL('./node_modules/', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // The portal is React 19 even while unrelated root workspaces still retain React 18.
    // Keep Vite's pre-bundler and every linked workspace on this application's copy.
    dedupe: ['react', 'react-dom'],
    alias: {
      'react-dom': `${portalNodeModules}react-dom`,
      react: `${portalNodeModules}react`,
    },
  },
  server: { host: '127.0.0.1', port: 9200, headers: { 'Cache-Control': 'no-store' } },
  preview: { host: '127.0.0.1', port: 9200 },
});
