import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
  base: env.VITE_PUBLIC_BASE ?? '/',
  plugins: [
    react(),
    federation({
      name: 'mfe_cashflow_blotter',
      filename: 'remoteEntry.js',
      exposes: { './application': './src/root.tsx' },
      dts: false,
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
        'react-router-dom': { singleton: true, requiredVersion: '^6.4.4' },
      },
    }),
  ],
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
      Import: fileURLToPath(new URL('./src/Root/import', import.meta.url)),
      '@Test': fileURLToPath(new URL('./src/test', import.meta.url)),
      '@cashflow-ratan': fileURLToPath(new URL('./src/cashflow-ratan', import.meta.url)),
      '@fm/base': fileURLToPath(new URL('./src/compat/base.tsx', import.meta.url)),
      '@fm/ratan_container': fileURLToPath(
        new URL('./src/compat/ratan-container.ts', import.meta.url),
      ),
      stompjs: fileURLToPath(new URL('./src/compat/stomp.ts', import.meta.url)),
      'stompjs-browser': fileURLToPath(
        new URL('../../../node_modules/stompjs/lib/stomp.js', import.meta.url),
      ),
      events: fileURLToPath(
        new URL('../../../node_modules/events/events.js', import.meta.url),
      ),
    },
  },
  define: {
    'process.env.MFE_APP_PREFIX_STYLE': JSON.stringify('MicroWebUI_cashflow_cn'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
  },
  server: { host: '127.0.0.1', port: 8015, cors: true, headers: { 'Cache-Control': 'no-store' } },
  preview: { host: '127.0.0.1', port: 8015, cors: true },
  build: { target: 'chrome89' },
  };
});
