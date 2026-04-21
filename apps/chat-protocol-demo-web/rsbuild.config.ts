import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const port = Number(process.env.port) || 4173;

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
  server: {
    host: '127.0.0.1',
    port,
  },
  html: {
    title: 'Chat Protocol Demo',
    favicon: './public/favicon.svg',
  },
});
