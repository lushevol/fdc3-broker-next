import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import moduleFederationConfig from './module-federation.config';

const localReact = fileURLToPath(new URL('./node_modules/react', import.meta.url));
const localReactDom = fileURLToPath(new URL('./node_modules/react-dom', import.meta.url));

export default defineConfig({
  plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig)],
  html: { title: 'Cashflow Application' },
  server: {
    port: 9201,
    host: '127.0.0.1',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  },
  resolve: {
    // Cashflow owns React 18. Resolve workspace dependencies (including the
    // design system) to this copy rather than their development React 19 copy.
    alias: { react: localReact, 'react-dom': localReactDom },
  },
  output: { assetPrefix: 'http://127.0.0.1:9201/' },
});
