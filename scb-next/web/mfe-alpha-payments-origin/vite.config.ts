import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_ALPHA_PAYMENTS_API_TARGET ?? "http://127.0.0.1:8086";

  return {
    base: env.VITE_PUBLIC_BASE ?? "/",
    plugins: [
      react(),
      federation({
        name: "mfe_alpha_payments",
        filename: "remoteEntry.js",
        exposes: { "./application": "./src/root.tsx" },
        dts: false,
        shared: {
          react: { singleton: true, requiredVersion: "^18.2.0" },
          "react-dom": { singleton: true, requiredVersion: "^18.2.0" }
        }
      })
    ],
    server: {
      host: "127.0.0.1",
      port: 8018,
      strictPort: true,
      cors: true,
      headers: { "Cache-Control": "no-store" },
      proxy: {
        "/api/alpha-payments/": { target: apiTarget, changeOrigin: true }
      }
    },
    preview: { host: "127.0.0.1", port: 8018, cors: true },
    build: { target: "chrome117" }
  };
});
