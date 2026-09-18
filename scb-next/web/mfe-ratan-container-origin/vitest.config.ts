import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
export default defineConfig({ plugins: [react()], resolve: {
  dedupe: ['react', 'react-dom', '@mui/material', '@mui/icons-material', '@mui/system', '@emotion/react', '@emotion/styled'],
  alias: [
  { find: /^antd$/, replacement: fileURLToPath(new URL("../../../node_modules/antd/lib/index.js", import.meta.url)) },
  { find: /^antd\/es\/(.*)$/, replacement: fileURLToPath(new URL("../../../node_modules/antd/lib/$1", import.meta.url)) },
  { find: "@fm/base", replacement: fileURLToPath(new URL("./src/compat/base.tsx", import.meta.url)) },
  { find: "mfe_cashflow_blotter/application", replacement: fileURLToPath(new URL("./src/test/remote-cashflow.tsx", import.meta.url)) },
] }, ssr: { noExternal: ['ratan-design-origin', /@mui\//, /@emotion\//] },
test: { globals: true, environment: "jsdom", setupFiles: ["./src/vitest.setup.ts"], include: ["src/**/*.{test,spec}.{ts,tsx}"], testTimeout: 20_000, coverage: { provider: "v8", thresholds: { lines: 90, branches: 90 } } } });
