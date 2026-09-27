import { defineConfig } from "vite";
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
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        primitives: "src/primitives.ts",
        icons: "src/icons.ts",
        "data-grid": "src/data-grid.ts",
        theme: "src/theme/index.ts",
        tokens: "src/tokens/index.ts",
        compatibility: "src/compatibility.ts",
        "base-compat": "src/base-compat.tsx",
        dates: "src/dates.tsx",
        "date-range": "src/date-range.tsx",
        "portal-theme": "src/portal-theme.ts",
      },
      formats: ["es"],
      fileName: (_format, name) => `${name}.js`,
    },
    rolldownOptions: {
      external:
        /^(react|react-dom|@mui\/material|@mui\/icons-material|@mui\/x-date-pickers|@mui\/x-date-pickers-pro|@mui\/x-data-grid|dayjs|@emotion\/react|@emotion\/styled)(\/|$)/,
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    },
  },
});
