import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginReact } from '@rsbuild/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import moduleFederationConfig from './module-federation.config';

const workspaceDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(workspaceDir, '../../../../..');
const cashflowRatanSource = path.join(workspaceDir, 'src/cashflow-ratan');

export default defineConfig({
  plugins: [pluginReact(), pluginLess(), pluginModuleFederation(moduleFederationConfig)],
  html: { title: 'Cashflow CN' },
  source: {
    define: {
      'process.env.MFE_APP_PREFIX_STYLE': JSON.stringify('MicroWebUI_cashflow_cn'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
    },
  },
  server: {
    port: 9206,
    host: '127.0.0.1',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  },
  dev: {
    lazyCompilation: false,
  },
  output: { assetPrefix: 'auto' },
  resolve: {
    alias: {
      stompjs: path.join(workspaceDir, 'src/compat/stomp.ts'),
      'stompjs-browser': path.join(repositoryRoot, 'node_modules/stompjs/lib/stomp.js'),
      '@migrated-cashflow-cn': path.join(workspaceDir, 'src/Cashflow_CN/index.tsx'),
      '@cashflow-ratan': cashflowRatanSource,
      '@fm/base': path.join(workspaceDir, 'src/compat/base.tsx'),
      '@fm/ratan_container': path.join(workspaceDir, 'src/compat/ratan-container.ts'),
      './itemsFun': path.join(workspaceDir, 'src/compat/quick-search-items.ts'),
      Import: path.join(workspaceDir, 'src/Root/import'),
      src: path.join(workspaceDir, 'src'),
    },
  },
});
