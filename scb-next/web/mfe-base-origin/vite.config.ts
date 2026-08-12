import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "mfe_base_host",
      remotes: {
        mfe_ratan_container: {
          type: "module",
          name: "mfe_ratan_container",
          entry: "http://127.0.0.1:8009/remoteEntry.js",
          entryGlobalName: "mfe_ratan_container",
          shareScope: "default",
        },
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.2.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.2.0" },
      },
    }),
  ],
  define: {
    "process.env.MFE_APP_PREFIX_STYLE": JSON.stringify("MicroWebUI_base"),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
  },
  server: { host: "127.0.0.1", port: 8001, headers: { "Cache-Control": "no-store" } },
  preview: { host: "127.0.0.1", port: 8001 },
  build: { target: "chrome89" },
});
