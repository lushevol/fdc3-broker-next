import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  server: {
    port: 3001,
    host: true,
  },
  resolve: {
    alias: {
      '@ratan-design/tokens': path.resolve(__dirname, './src/tokens'),
    },
  },
});