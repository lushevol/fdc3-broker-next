import fs from 'node:fs';
import path from 'node:path';

import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const port = Number(process.env.port);
const envMode = process.env.mode === 'production' ? 'production' : 'development';

function readMfeEnv(): Record<string, string> {
  const envPath = path.join(__dirname, '.env.mfe');

  if (!fs.existsSync(envPath)) {
    return {};
  }

  return fs
    .readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .reduce<Record<string, string>>((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        return acc;
      }

      const delimiterIndex = trimmed.indexOf('=');
      if (delimiterIndex === -1) {
        return acc;
      }

      const key = trimmed.slice(0, delimiterIndex).trim();
      const rawValue = trimmed.slice(delimiterIndex + 1).trim();
      const value =
        (rawValue.startsWith("'") && rawValue.endsWith("'")) ||
        (rawValue.startsWith('"') && rawValue.endsWith('"'))
          ? rawValue.slice(1, -1)
          : rawValue;
      acc[key] = value;
      return acc;
    }, {});
}

const injectedEnv = {
  NODE_ENV: envMode,
  ...readMfeEnv(),
  ...Object.fromEntries(Object.entries(process.env).filter(([, value]) => value !== undefined)),
};

export default defineConfig({
  plugins: [pluginReact({ splitChunks: false })],
  source: {
    entry: {
      base: {
        import: './src/system-entry.ts',
        html: false,
      },
    },
    define: Object.fromEntries(
      Object.entries(injectedEnv).map(([key, value]) => [
        `process.env.${key}`,
        JSON.stringify(value),
      ]),
    ),
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
        'react-dom': 'react-dom',
        'react-dom/client': 'react-dom/client',
        'single-spa': 'single-spa',
      },
      optimization: {
        runtimeChunk: false,
        splitChunks: false,
      },
      output: {
        uniqueName: '@fm/base',
        library: {
          type: 'system',
        },
        chunkFilename: '[chunkhash].[name].base.js',
      },
    },
  },
});
