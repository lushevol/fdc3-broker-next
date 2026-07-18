import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import moduleFederationConfig from './module-federation.config';

export default defineConfig({
  plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig)],
  html: { title: 'FMO Portal Host POC' },
  server: {
    port: 9100,
    host: '127.0.0.1',
    headers: { 'Cache-Control': 'no-store' },
  },
  output: { assetPrefix: '/' },
});
