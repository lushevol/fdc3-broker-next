import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'] },
  ssr: { noExternal: ['ratan-design-origin', /@mui\//, /@emotion\//] },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'src/new-styles/**/*.test.{ts,tsx}',
      'src/components/**/prototype*.test.tsx',
      'src/pages/**/prototype*.test.tsx',
      'src/components/**/compatibility.test.tsx',
      'src/components/mui5-compatibility.test.tsx',
      'src/components/Dialog/common/Draggable.test.tsx',
      'src/components/TableDetail/Field.console-contract.test.tsx',
    ],
    testTimeout: 20000,
    coverage: { provider: 'v8', include: ['src/new-styles/**/*.{ts,tsx}'],
      exclude: ['src/new-styles/**/*.test.{ts,tsx}', 'src/new-styles/dev-host.tsx'],
      thresholds: { lines: 90, branches: 90 } },
  },
});
