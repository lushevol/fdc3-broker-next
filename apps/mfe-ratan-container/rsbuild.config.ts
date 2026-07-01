import fs from 'node:fs';
import path from 'node:path';

import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig, rspack } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginReact } from '@rsbuild/plugin-react';

import moduleFederationConfig from './module-federation.config';
import packageJson from './package.json';

const port = Number(process.env.port);
const rootDir = __dirname;

const readMfeEnv = (): Record<string, string> => {
  const envPath = path.resolve(rootDir, '.env.mfe');
  if (!fs.existsSync(envPath)) {
    return {};
  }

  return fs
    .readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .reduce<Record<string, string>>((env, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        return env;
      }

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex < 0) {
        return env;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed
        .slice(separatorIndex + 1)
        .trim()
        .replace(/^['"]|['"]$/g, '');
      env[key] = value;
      return env;
    }, {});
};

const mfeEnv = readMfeEnv();
const defineEnv = Object.fromEntries(
  Object.entries(mfeEnv).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]),
);

export default defineConfig({
  plugins: [
    pluginReact({ splitChunks: false }),
    pluginLess(),
    pluginModuleFederation(moduleFederationConfig),
  ],
  source: {
    define: defineEnv,
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
  resolve: {
    alias: {
      src: path.resolve(rootDir, 'src'),
      '@fm/base': path.resolve(rootDir, 'src/Root/import/baseModuleFederationBridge.ts'),
    },
  },
  tools: {
    htmlPlugin: false,
    rspack: {
      optimization: {
        runtimeChunk: false,
        splitChunks: false,
        concatenateModules: false, // Prevent Rspack from merging CJS sub-module imports into namespace references
      },
      plugins: [
        new rspack.BannerPlugin({
          entryOnly: true,
          banner: () => `version: ${packageJson.version}`,
        }),
      ],
    },
  },
});
