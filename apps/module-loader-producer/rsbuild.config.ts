import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const port = Number(process.env.port) || 8024;

export default defineConfig({
  plugins: [pluginReact({ splitChunks: false })],
  source: {
    entry: {
      'module-loader-producer': {
        import: './src/system-entry.ts',
        html: false,
      },
    },
  },
  server: {
    port,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  dev: {
    hmr: false,
    liveReload: true,
    lazyCompilation: false,
  },
  output: {
    assetPrefix: `http://localhost:${port}/`,
    filename: { js: '[name].js' },
  },
  performance: { chunkSplit: false },
  tools: {
    htmlPlugin: false,
    rspack: {
      externalsType: 'system',
      externals: { react: 'react', 'react-dom': 'react-dom', '@fm/base': '@fm/base' },
      optimization: { runtimeChunk: false, splitChunks: false },
      output: { uniqueName: '@fm/module-loader-producer', library: { type: 'system' } },
    },
  },
});
