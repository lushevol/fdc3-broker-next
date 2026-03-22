import { defineConfig } from '@rsbuild/core';

import { rootConfigDevSetup, rootConfigProxy } from './dev-server';

const port = Number(process.env.port);
const mode = process.env.mode === 'production' ? 'production' : 'development';
const devtool = process.env.devtool?.toLowerCase() === 'false' ? false : process.env.devtool;
const isLocal = process.env.isLocal?.toLowerCase() === 'true';
const publicUrl = process.env.publicUrl ?? '';
const importmap = process.env.importmap ?? '';

export { rootConfigDevSetup, rootConfigProxy };

export default defineConfig({
  mode,
  source: {
    entry: {
      index: {
        import: './src/root.ts',
      },
    },
  },
  html: {
    template: './src/index.ejs',
    inject: false,
    templateParameters: {
      isLocal,
      orgName: process.env.orgName ?? 'fm',
      publicUrl,
      importmap,
    },
  },
  server: {
    port,
    proxy: rootConfigProxy,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
  dev: {
    hmr: true,
    setupMiddlewares: [rootConfigDevSetup],
    client: {
      overlay: false,
    },
  },
  output: {
    assetPrefix: `http://localhost:${port}/`,
    distPath: {
      js: '',
      css: '',
    },
    filename: {
      js: 'config.js',
    },
  },
  performance: {
    chunkSplit: false,
  },
  tools: {
    rspack: {
      devtool,
      module: {
        rules: [
          {
            test: /\.html$/i,
            type: 'asset/source',
            exclude: /index\.ejs$/i,
          },
        ],
      },
      externalsType: 'system',
      externals: {
        'single-spa': 'single-spa',
      },
      optimization: {
        runtimeChunk: false,
        splitChunks: false,
      },
      output: {
        uniqueName: '@fm/root-config',
        library: {
          type: 'system',
        },
        chunkFilename: '[chunkhash].[name].root-config.js',
      },
    },
  },
});
