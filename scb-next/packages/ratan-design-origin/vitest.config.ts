import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "@mui/material",
      "@mui/system",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
  ssr: { noExternal: [/@mui\//, /@emotion\//] },
  test: {
    environment: "jsdom",
    setupFiles: ["tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      thresholds: { lines: 90, branches: 90 },
    },
  },
});
