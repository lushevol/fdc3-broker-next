import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^antd$/, replacement: fileURLToPath(new URL('../../../node_modules/antd/lib/index.js', import.meta.url)) },
      { find: /^antd\/es\/(.*)$/, replacement: fileURLToPath(new URL('../../../node_modules/antd/lib/$1', import.meta.url)) },
      { find: /^events$/, replacement: fileURLToPath(new URL('../../../node_modules/events/events.js', import.meta.url)) },
      { find: 'src', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: 'Import', replacement: fileURLToPath(new URL('./src/Root/import', import.meta.url)) },
      { find: '@Test', replacement: fileURLToPath(new URL('./src/test', import.meta.url)) },
      { find: '@cashflow-ratan', replacement: fileURLToPath(new URL('./src/cashflow-ratan', import.meta.url)) },
      { find: '@fm/base', replacement: fileURLToPath(new URL('./src/compat/base.tsx', import.meta.url)) },
      { find: '@fm/ratan_container', replacement: fileURLToPath(new URL('./src/compat/ratan-container.ts', import.meta.url)) },
      { find: 'stompjs', replacement: fileURLToPath(new URL('./src/compat/stomp.ts', import.meta.url)) },
      { find: 'stompjs-browser', replacement: fileURLToPath(new URL('../../../node_modules/stompjs/lib/stomp.js', import.meta.url)) },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    testTimeout: 20_000,
    hookTimeout: 20_000,
    server: { deps: { inline: true } },
    coverage: { provider: 'v8', thresholds: { lines: 90, branches: 90 } },
  },
});
