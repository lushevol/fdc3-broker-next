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
      "@emotion/react",
      "@emotion/styled"
    ],
    alias: [
      {
        find: /^react$/,
        replacement: fileURLToPath(new URL("./node_modules/react/index.js", import.meta.url))
      },
      {
        find: /^react\/jsx-runtime$/,
        replacement: fileURLToPath(
          new URL("./node_modules/react/jsx-runtime.js", import.meta.url)
        )
      },
      {
        find: /^react-dom$/,
        replacement: fileURLToPath(
          new URL("./node_modules/react-dom/index.js", import.meta.url)
        )
      },
      {
        find: /^react-dom\/client$/,
        replacement: fileURLToPath(
          new URL("./node_modules/react-dom/client.js", import.meta.url)
        )
      }
    ]
  },
  ssr: { noExternal: ["ratan-design-origin", /@mui\//, /@emotion\//] },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/test/**", "src/main.tsx", "src/root.tsx"],
      thresholds: {
        lines: 90,
        branches: 90,
        functions: 90,
        statements: 90
      }
    }
  }
});
