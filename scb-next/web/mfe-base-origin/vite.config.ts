import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv, searchForWorkspaceRoot } from "vite";
import { devMockApiPlugin } from "./dev/mock-api";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const ratanRemoteUrl =
    env.VITE_RATAN_REMOTE_URL ?? "http://127.0.0.1:8009/remoteEntry.js";
  const alphaPaymentsRemoteUrl =
    env.VITE_ALPHA_PAYMENTS_REMOTE_URL ??
    "http://127.0.0.1:8018/remoteEntry.js";
  const alphaPaymentsApiTarget =
    env.VITE_ALPHA_PAYMENTS_API_TARGET ?? "http://127.0.0.1:8086";

  return {
    cacheDir: process.env.BASE_UI_PARITY_CACHE_DIR,
    optimizeDeps: {
      include: ["ratan-design-origin/icons", "ratan-design-origin/data-grid"],
    },
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
    },
    plugins: [
      react(),
      devMockApiPlugin(),
      ...(process.env.STORYBOOK
        ? []
        : federation({
            name: "mfe_base_host",
            remotes: {
              mfe_ratan_container: {
                type: "module",
                name: "mfe_ratan_container",
                entry: ratanRemoteUrl,
                entryGlobalName: "mfe_ratan_container",
                shareScope: "default",
              },
              mfe_alpha_payments: {
                type: "module",
                name: "mfe_alpha_payments",
                entry: alphaPaymentsRemoteUrl,
                entryGlobalName: "mfe_alpha_payments",
                shareScope: "default",
              },
            },
            shared: {
              react: { singleton: true, requiredVersion: "^18.2.0" },
              "react-dom": { singleton: true, requiredVersion: "^18.2.0" },
            },
          })),
    ],
    define: {
      "process.env.MFE_APP_PREFIX_STYLE": JSON.stringify("MicroWebUI_base"),
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV ?? "development"
      ),
    },
    server: {
      host: "127.0.0.1",
      port: 8001,
      strictPort: true,
      fs: {
        allow: [
          searchForWorkspaceRoot(process.cwd()),
          fileURLToPath(new URL("../../../sc-dev-web/sc-dev-web", import.meta.url)),
        ],
      },
      headers: { "Cache-Control": "no-store" },
      proxy: {
        "/api/alpha-payments/": {
          target: alphaPaymentsApiTarget,
          changeOrigin: true,
        },
      },
    },
    preview: { host: "127.0.0.1", port: 8001 },
    build: { target: "chrome117" },
  };
});
