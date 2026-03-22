import { defineConfig } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginReact } from '@rsbuild/plugin-react';

const port = Number(process.env.port);

export default defineConfig({
  plugins: [pluginReact({ splitChunks: false }), pluginLess()],
  source: {
    entry: {
      'template_container-app': {
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
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-dom/client': 'ReactDOM',
        '@fm/base': 'ContainerBase',
      },
      optimization: {
        runtimeChunk: false,
        splitChunks: false,
      },
      output: {
        uniqueName: '@fm/template_container',
        chunkFilename: '[chunkhash].[name].template_container.js',
      },
    },
  },
});
