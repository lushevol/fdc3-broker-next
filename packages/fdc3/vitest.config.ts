import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text'],
      include: ['src/**/*.{ts,tsx}'],
    },
  },
});
