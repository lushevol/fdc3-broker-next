import fs from "node:fs";
import path from "node:path";

import { defineConfig, rspack } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

import packageJson from "./package.json";

const port = Number(process.env.port);
const rootDir = __dirname;

const readMfeEnv = (): Record<string, string> => {
  const envPath = path.resolve(rootDir, ".env.mfe");
  if (!fs.existsSync(envPath)) {
    return {};
  }

  return fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .reduce<Record<string, string>>((env, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        return env;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex < 0) {
        return env;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed
        .slice(separatorIndex + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "");
      env[key] = value;
      return env;
    }, {});
};

const mfeEnv = readMfeEnv();
const defineEnv = Object.fromEntries(
  Object.entries(mfeEnv).map(([key, value]) => [
    `process.env.${key}`,
    JSON.stringify(value),
  ])
);

class VersionJsonPlugin {
  apply(compiler: rspack.Compiler): void {
    compiler.hooks.thisCompilation.tap("VersionJsonPlugin", (compilation) => {
      compilation.emitAsset(
        "version.json",
        new rspack.sources.RawSource(
          JSON.stringify({ version: packageJson.version }, null, "\t")
        )
      );
    });
  }
}

export default defineConfig({
  plugins: [pluginReact({ splitChunks: false })],
  source: {
    entry: {
      ratan_cashflow_blotter: {
        import: "./src/system-entry.ts",
        html: false,
      },
    },
    define: defineEnv,
  },
  server: {
    port,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  dev: {
    hmr: false,
    liveReload: true,
    lazyCompilation: false,
    client: {
      host: "localhost",
      port: String(port),
    },
  },
  output: {
    assetPrefix: `http://localhost:${port}/`,
    distPath: {
      js: "",
      css: "",
    },
    filename: {
      js: "[name].js",
    },
  },
  performance: {
    chunkSplit: false,
  },
  resolve: {
    alias: {
      src: path.resolve(rootDir, "src"),
      Import: path.resolve(rootDir, "src/Root/import"),
      "@Test": path.resolve(rootDir, "src/test"),
    },
  },
  tools: {
    htmlPlugin: false,
    rspack: {
      externalsType: "system",
      externals: {
        react: "react",
        "react-dom": "react-dom",
        "react-dom/client": "react-dom/client",
        "@fm/base": "@fm/base",
        "@fm/ratan_container": "@fm/ratan_container",
      },
      resolve: {
        fallback: {
          net: false,
        },
      },
      optimization: {
        runtimeChunk: false,
        splitChunks: false,
        concatenateModules: false, // Prevent Rspack from merging CJS sub-module imports (lodash, etc.) into namespace references
      },
      output: {
        uniqueName: "@fm/ratan_cashflow_blotter",
        library: {
          type: "system",
        },
        chunkFilename: "[chunkhash].[name].ratan_cashflow_blotter.js",
        publicPath: `http://localhost:${port}/`,
      },
      plugins: [
        new rspack.BannerPlugin({
          entryOnly: true,
          banner: () => `version: ${packageJson.version}`,
        }),
        new VersionJsonPlugin(),
      ],
    },
  },
});
