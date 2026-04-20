import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const port = Number(process.env.port) || 8011;

export default defineConfig({
  plugins: [pluginReact({ splitChunks: false })],
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  server: {
    port,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  dev: {
    hmr: false,
    liveReload: true,
    lazyCompilation: false,
    client: {
      host: 'localhost',
      port: String(port),
    },
  },
  output: {
    assetPrefix: `http://localhost:${port}/`,
    distPath: {
      root: 'dist',
    },
  },
  performance: {
    chunkSplit: false,
  },
});
