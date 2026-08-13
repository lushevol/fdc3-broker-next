import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const cashflowRemoteUrl = env.VITE_CASHFLOW_REMOTE_URL ?? "http://127.0.0.1:8015/remoteEntry.js";

  return {
    base: env.VITE_PUBLIC_BASE ?? "/",
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
            entry: cashflowRemoteUrl,
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
      "process.env.MFE_APP_PREFIX_STYLE": JSON.stringify("MicroWebUI_ratan_container"),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
    },
    server: {
      host: "127.0.0.1",
      port: 8009,
      strictPort: true,
      cors: true,
      headers: { "Cache-Control": "no-store" },
    },
    preview: { host: "127.0.0.1", port: 8009, cors: true },
    build: { target: "chrome89" },
  };
});
