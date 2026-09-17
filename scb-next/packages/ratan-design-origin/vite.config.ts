import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        theme: "src/theme/index.ts",
        tokens: "src/tokens/index.ts",
        compatibility: "src/compatibility.ts",
      },
      formats: ["es"],
      fileName: (_format, name) => `${name}.js`,
    },
    rolldownOptions: {
      external:
        /^(react|react-dom|@mui\/material|@mui\/icons-material|@emotion\/react|@emotion\/styled)(\/|$)/,
    },
  },
});
