const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const mockLoginResp = require("./login-resp.mock.json");
require("ts-node").register({ transpileOnly: true });
const { generateJWT } = require("./scripts/jwt");

module.exports = (webpackConfigEnv, argv) => {
  const port = process.env.port;
  const mode = process.env.mode;
  const orgName = process.env.orgName;
  const devtool =
    process.env.devtool.toLocaleLowerCase() === "false"
      ? false
      : process.env.devtool;
  const isLocal = process.env.isLocal.toLocaleLowerCase() === "true";
  const publicUrl = process.env.publicUrl || "";
  const importmap = process.env.importmap || "";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    mode,
    devtool,
    entry: path.resolve(__dirname, "src", "root"),
    output: {
      filename: "config.js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal,
          orgName,
          publicUrl,
          importmap,
        },
      }),
    ],
    devServer: {
      hot: true,
      port,
      client: {
        overlay: false,
      },
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error("webpack-dev-server is not defined");
        }

        const exp = Math.floor(Date.now() / 1000) + 12 * 60 * 60;
        const token = generateJWT({ exp, iat: Math.floor(Date.now() / 1000) });

        // In-memory store for FDC3 data
        const fdc3Store = {
          intents: [
            { name: "ViewInstrument", description: "View instrument details" },
            { name: "ViewContact", description: "View contact details" }
          ],
          contexts: [
            { schema: { type: "fdc3.instrument" }, description: "Financial Instrument" },
            { schema: { type: "fdc3.contact" }, description: "Contact Info" }
          ],
          declarations: []
        };

        // Initialize declarations from file if possible, else empty
        try {
          delete require.cache[require.resolve("./fdc3-declaration.mock.json")];
          const initialData = require("./fdc3-declaration.mock.json");
          if (initialData.data) fdc3Store.declarations = initialData.data;
        } catch (e) {
          console.log("Could not load initial fdc3 mock data", e);
        }

        const bodyParser = (req) => new Promise((resolve) => {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try { resolve(JSON.parse(body)); } catch (e) { resolve({}); }
          });
        });

        const jsonResponse = (res, data) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ code: 200, message: "success", data }));
        };

        // Login Mock
        // middlewares.unshift({
        //   name: "mock-login",
        //   path: "/api/auth/v2/sso/login",
        //   middleware: (req, res) => {
        //     res.statusCode = 200;
        //     res.setHeader("Content-Type", "application/json");
        //     res.setHeader("single-ui-authorization", `Bearer ${token}`);
        //     res.end(JSON.stringify(mockLoginResp));
        //   },
        // });

        // --- FDC3 Intents Mocks ---
        middlewares.unshift({
          name: "mock-fdc3-intent-list",
          path: "/api/auth/v1/fmo/admin/fdc3/intent/data",
          middleware: (req, res) => jsonResponse(res, fdc3Store.intents)
        });

        middlewares.unshift({
          name: "mock-fdc3-intent-create",
          path: "/api/auth/v1/fmo/admin/fdc3/intent/create",
          middleware: async (req, res) => {
            const body = await bodyParser(req);
            if (body.name) {
              const existing = fdc3Store.intents.find(i => i.name === body.name);
              if (!existing) fdc3Store.intents.push({ name: body.name, description: body.description });
            }
            jsonResponse(res, body);
          }
        });

        middlewares.unshift({
          name: "mock-fdc3-intent-update",
          path: "/api/auth/v1/fmo/admin/fdc3/intent/update",
          middleware: async (req, res) => {
            const body = await bodyParser(req);
            const idx = fdc3Store.intents.findIndex(i => i.name === body.name);
            if (idx !== -1) fdc3Store.intents[idx] = { ...fdc3Store.intents[idx], ...body };
            jsonResponse(res, body);
          }
        });

        middlewares.unshift({
          name: "mock-fdc3-intent-delete",
          path: "/api/auth/v1/fmo/admin/fdc3/intent/delete",
          middleware: async (req, res) => {
            const body = await bodyParser(req);
            fdc3Store.intents = fdc3Store.intents.filter(i => i.name !== body.name);
            jsonResponse(res, body);
          }
        });

        // --- FDC3 Contexts Mocks ---
        middlewares.unshift({
          name: "mock-fdc3-context-list",
          path: "/api/auth/v1/fmo/admin/fdc3/context/data",
          middleware: (req, res) => jsonResponse(res, fdc3Store.contexts)
        });

        middlewares.unshift({
          name: "mock-fdc3-context-create",
          path: "/api/auth/v1/fmo/admin/fdc3/context/create",
          middleware: async (req, res) => {
            const body = await bodyParser(req);
            if (body.schema?.type) {
              const existing = fdc3Store.contexts.find(c => c.schema?.type === body.schema.type);
              if (!existing) fdc3Store.contexts.push(body);
            }
            jsonResponse(res, body);
          }
        });

        middlewares.unshift({
          name: "mock-fdc3-context-update",
          path: "/api/auth/v1/fmo/admin/fdc3/context/update",
          middleware: async (req, res) => {
            const body = await bodyParser(req);
            const idx = fdc3Store.contexts.findIndex(c => c.schema?.type === body.schema?.type);
            if (idx !== -1) fdc3Store.contexts[idx] = { ...fdc3Store.contexts[idx], ...body };
            jsonResponse(res, body);
          }
        });

        middlewares.unshift({
          name: "mock-fdc3-context-delete",
          path: "/api/auth/v1/fmo/admin/fdc3/context/delete",
          middleware: async (req, res) => {
            const body = await bodyParser(req);
            fdc3Store.contexts = fdc3Store.contexts.filter(c => c.schema?.type !== body.schema?.type);
            jsonResponse(res, body);
          }
        });

        // --- FDC3 Declarations Mocks ---
        middlewares.unshift({
          name: "mock-fdc3-data",
          path: "/api/auth/v1/fmo/admin/fdc3/data",
          middleware: (req, res) => jsonResponse(res, fdc3Store.declarations)
        });

        middlewares.unshift({
          name: "mock-fdc3-create",
          path: "/api/auth/v1/fmo/admin/fdc3/create",
          middleware: async (req, res) => {
            const body = await bodyParser(req);
            const newItem = {
              ...body,
              appId: body.appId || `app-${Date.now()}`
            };
            // Add at beginning
            fdc3Store.declarations.unshift(newItem);
            jsonResponse(res, newItem);
          }
        });

        middlewares.unshift({
          name: "mock-fdc3-update",
          path: "/api/auth/v1/fmo/admin/fdc3/update",
          middleware: async (req, res) => {
            const body = await bodyParser(req);
            const idx = fdc3Store.declarations.findIndex(d => d.appId === body.appId);
            if (idx !== -1) fdc3Store.declarations[idx] = { ...fdc3Store.declarations[idx], ...body };
            jsonResponse(res, body); // Return full body so frontend knows it updated
          }
        });

        middlewares.unshift({
          name: "mock-fdc3-delete",
          path: "/api/auth/v1/fmo/admin/fdc3/delete",
          middleware: async (req, res) => {
            const body = await bodyParser(req);
            fdc3Store.declarations = fdc3Store.declarations.filter(d => d.appId !== body.appId);
            jsonResponse(res, body);
          }
        });

        middlewares.unshift({
          name: "mock-category-data",
          path: "/api/auth/v1/fmo/admin/category/data",
          middleware: (req, res) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            delete require.cache[require.resolve("./category.mock.json")];
            const mockCategoryResp = require("./category.mock.json");
            res.end(JSON.stringify(mockCategoryResp));
          },
        });

        return middlewares;
      },
      proxy: [
        {
          context: ["/api/bff/"],
          pathRewrite: { "^/api/bff": "" },
          target: "http://localhost:8088",
          secure: false,
          changeOrigin: true,
        },
        {
          context: ["/api/log/"],
          pathRewrite: { "^/api/log": "" },
          target: "http://localhost:8088",
          secure: false,
          changeOrigin: true,
          ws: true,
        },
        {
          context: ["/api/auth/"],
          pathRewrite: { "^/api/auth": "" },
          target: "http://localhost:8088",
          secure: false,
          changeOrigin: true,
        },
        {
          context: ["/api/sse/"],
          pathRewrite: { "^/api/sse": "" },
          target: "http://localhost:8088",
          secure: false,
          changeOrigin: true,
        },
      ],
      allowedHosts: "all",
      compress: false,
      static: {
        directory: path.join(__dirname, "dist"),
      },
    },
  });
};
