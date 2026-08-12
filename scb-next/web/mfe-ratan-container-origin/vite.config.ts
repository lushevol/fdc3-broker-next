import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "mfe_ratan_container",
      filename: "remoteEntry.js",
      exposes: { "./application": "./src/root.tsx" },
      dts: false,
      remotes: {
        mfe_cashflow_blotter: {
          type: "module",
          name: "mfe_cashflow_blotter",
          entry: "http://127.0.0.1:8015/remoteEntry.js",
          entryGlobalName: "mfe_cashflow_blotter",
          shareScope: "default",
        },
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.2.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.2.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.4.4" },
      },
    }),
  ],
  resolve: {
    alias: { "@fm/base": fileURLToPath(new URL("./src/compat/base.tsx", import.meta.url)) },
  },
  css: { preprocessorOptions: { less: { javascriptEnabled: true } } },
  define: {
    "process.env.MFE_APP_PREFIX_STYLE": JSON.stringify("MicroWebUI_ratan"),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
  },
  server: { host: "127.0.0.1", port: 8009, cors: true, headers: { "Cache-Control": "no-store" } },
  preview: { host: "127.0.0.1", port: 8009, cors: true },
  build: { target: "chrome89" },
});
