import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: { title: 'Ratan Design packed-package playground' },
  source: { entry: { index: './src/main.tsx' } },
  output: { distPath: { root: 'dist' } },
});
