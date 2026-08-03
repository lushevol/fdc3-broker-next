import { createRequire } from 'node:module';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [
    react({ babel: { plugins: ['babel-plugin-react-compiler'] } }),
    federation({ name: 'portal_host_poc', remotes: {}, shared: {} }),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
      'react/compiler-runtime': require.resolve('react/compiler-runtime'),
      react: require.resolve('react'),
      'react-dom/client': require.resolve('react-dom/client'),
      'react-dom': require.resolve('react-dom'),
    },
  },
  server: { host: '127.0.0.1', port: 9100 },
});
