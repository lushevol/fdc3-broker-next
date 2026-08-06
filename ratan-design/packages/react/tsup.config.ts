import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    button: 'src/button.ts',
    'data-grid': 'src/data-grid.ts',
    'date-picker': 'src/date-picker.ts',
    dialog: 'src/dialog.ts',
    index: 'src/index.ts',
    tabs: 'src/tabs.ts',
    'text-input': 'src/text-input.ts',
    testing: 'src/testing.ts',
    tokens: 'src/tokens.ts',
  },
  external: [
    '@testing-library/react',
    '@testing-library/user-event',
    'react',
    'react-dom',
  ],
  format: ['esm'],
  minify: false,
  splitting: true,
  sourcemap: true,
  target: 'es2022',
  treeshake: true,
});
