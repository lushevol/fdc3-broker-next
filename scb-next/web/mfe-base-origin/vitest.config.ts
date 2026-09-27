import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "@mui/material",
      "@mui/icons-material",
      "@mui/system",
      "@mui/x-date-pickers",
      "@mui/x-date-pickers-pro",
      "@mui/x-data-grid",
      "dayjs",
      "@emotion/react",
      "@emotion/styled",
    ],
    alias: {
      "@jest/globals": fileURLToPath(
        new URL("./src/test/vitest-jest-globals.ts", import.meta.url)
      ),
      "mfe_ratan_container/application": fileURLToPath(
        new URL("./src/test/remote-ratan.tsx", import.meta.url)
      ),
      "mfe_alpha_payments/application": fileURLToPath(
        new URL("./src/test/remote-alpha-payments.tsx", import.meta.url)
      ),
    },
  },
  ssr: { noExternal: ["ratan-design-origin", /@mui\//, /@emotion\//] },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    testTimeout: 20_000,
    coverage: { provider: "v8", thresholds: { lines: 90, branches: 90 } },
  },
});
