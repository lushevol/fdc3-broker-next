import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const port = Number(process.env.port);

export default defineConfig({
  plugins: [pluginReact({ splitChunks: false })],
  source: {
    entry: {
      template: {
        import: './src/system-entry.ts',
        html: false,
      },
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
    liveReload: false,
    lazyCompilation: false,
  },
  output: {
    assetPrefix: `http://localhost:${port}/`,
    distPath: {
      js: '',
      css: '',
    },
    filename: {
      js: '[name].js',
    },
  },
  performance: {
    chunkSplit: false,
  },
  tools: {
    htmlPlugin: false,
    rspack: {
      externalsType: 'system',
      externals: {
        react: 'react',
        '@fm/base': '@fm/base',
      },
      optimization: {
        runtimeChunk: false,
        splitChunks: false,
      },
      output: {
        uniqueName: '@fm/template',
        library: {
          type: 'system',
        },
        chunkFilename: '[chunkhash].[name].template.js',
      },
    },
  },
});
