import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import moduleFederationConfig from './module-federation.config';

export default defineConfig({
  plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig)],
  html: { title: 'FDC3 Admin Component Verification' },
  server: {
    port: 9204, host: '127.0.0.1',
    headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' },
  },
  output: { assetPrefix: 'http://127.0.0.1:9204/' },
});
