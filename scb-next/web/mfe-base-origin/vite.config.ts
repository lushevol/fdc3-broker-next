import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { devMockApiPlugin } from "./dev/mock-api";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const ratanRemoteUrl = env.VITE_RATAN_REMOTE_URL ?? "http://127.0.0.1:8009/remoteEntry.js";

  return {
    plugins: [
      react(),
      devMockApiPlugin(),
      federation({
        name: "mfe_base_host",
        remotes: {
          mfe_ratan_container: {
            type: "module",
            name: "mfe_ratan_container",
            entry: ratanRemoteUrl,
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
    server: {
      host: "127.0.0.1",
      port: 8001,
      strictPort: true,
      headers: { "Cache-Control": "no-store" },
    },
    preview: { host: "127.0.0.1", port: 8001 },
    build: { target: "chrome89" },
  };
});
