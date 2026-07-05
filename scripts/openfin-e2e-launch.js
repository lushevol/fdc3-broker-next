#!/usr/bin/env node
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { spawn } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const openfinDir = path.join(root, '.openfin');
const manifestPath = path.join(openfinDir, 'fdc3-broker-e2e-app.json');

const rvmPath =
  process.env.OPENFIN_RVM_PATH ||
  path.join(process.env.HOME || '', 'Applications/OpenFinRVM.app/Contents/MacOS/OpenFinRVM');
const appUrl = process.env.OPENFIN_E2E_APP_URL || 'http://127.0.0.1:8001/?show_normal_login=Y';
const port = Number(process.env.OPENFIN_E2E_MANIFEST_PORT || 9499);
const devtoolsPort = Number(process.env.OPENFIN_CDP_PORT || 9223);
const runtimeVersion = process.env.OPENFIN_RUNTIME_VERSION || 'stable';
const platformUuid = process.env.OPENFIN_E2E_PLATFORM_UUID || 'fdc3-broker-next-e2e-platform';
const mfeTargetName = process.env.OPENFIN_E2E_MFE_TARGET_NAME || 'fdc3-broker-next-e2e';
const homeName = process.env.OPENFIN_E2E_HOME_NAME || 'fdc3-broker-next-e2e-home';
const providerAppUrl = new URL(appUrl);
providerAppUrl.searchParams.set('openfin_platform_provider_e2e', '1');

fs.mkdirSync(openfinDir, { recursive: true });

function withNoStoreJson(response, payload) {
  response.writeHead(200, {
    'content-type': 'application/json',
    'cache-control': 'no-store',
  });
  response.end(JSON.stringify(payload, null, 2));
}

function withNoStoreHtml(response, html) {
  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(html);
}

function scriptJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

const manifest = {
  devtools_port: devtoolsPort,
  runtime: {
    version: runtimeVersion,
    arguments: `--v=1 --remote-debugging-port=${devtoolsPort}`,
  },
  platform: {
    uuid: platformUuid,
    name: 'fdc3-broker-next-e2e-platform',
    autoShow: false,
    providerUrl: `http://127.0.0.1:${port}/platform-provider.html`,
    permissions: {
      webAPIs: ['openExternal'],
    },
    defaultWindowOptions: {
      saveWindowState: false,
      fdc3Api: true,
      fdc3InteropApi: '2.0',
      defaultWidth: 1440,
      defaultHeight: 950,
    },
  },
  snapshot: {
    windows: [
      {
        name: homeName,
        uuid: platformUuid,
        url: `http://127.0.0.1:${port}/openfin-home.html`,
        autoShow: true,
        saveWindowState: false,
        fdc3Api: true,
        fdc3InteropApi: '2.0',
        defaultWidth: 1000,
        defaultHeight: 700,
      },
    ],
  },
};

const appConfig = {
  platformUuid,
  mfeTargetName,
  homeName,
  apps: {
    [mfeTargetName]: providerAppUrl.toString(),
  },
  targetRules: [
    {
      intents: ['scb.ViewLaunch', 'scb.ViewUpdate', 'ViewCashflow'],
      contextTypes: ['scb.fmptp.cashflow'],
      target: mfeTargetName,
    },
  ],
};

const providerHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>FDC3 Broker E2E Platform Provider</title>
  </head>
  <body>
    <h1>FDC3 Broker E2E Platform Provider</h1>
    <script>
      const openfinConfigs = ${scriptJson(appConfig)};

      window.__OPENFIN_E2E_PROVIDER_EVENTS__ = [];

      function recordProviderEvent(type, detail) {
        const event = { type, detail, timestamp: Date.now() };
        window.__OPENFIN_E2E_PROVIDER_EVENTS__.push(event);
        console.log('[OpenFin E2E Provider]', type, detail);
      }

      function resolveTarget(intentName, contextType) {
        const rule = openfinConfigs.targetRules.find((candidate) => {
          return candidate.intents.includes(intentName) &&
            candidate.contextTypes.includes(contextType);
        });
        return rule?.target;
      }

      async function waitForFin() {
        if (window.fin?.Platform) {
          return;
        }

        await new Promise((resolve) => {
          const timeout = window.setTimeout(resolve, 10000);
          window.addEventListener('DOMContentLoaded', () => {
            window.clearTimeout(timeout);
            resolve();
          }, { once: true });
        });
      }

      async function createAppWindow({ name, url }) {
        const platform = fin.Platform.getCurrentSync();
        recordProviderEvent('create-window', { name, url });
        const createdWindow = await platform.createWindow({
          name,
          url,
          autoShow: true,
          saveWindowState: false,
          fdc3Api: true,
          fdc3InteropApi: '2.0',
          defaultWidth: 1440,
          defaultHeight: 950,
        });
        return createdWindow.identity ?? { uuid: openfinConfigs.platformUuid, name };
      }

      async function initProvider() {
        await waitForFin();

        await fin.Platform.init({
          interopOverride: async (InteropBroker) => {
            class Override extends InteropBroker {
              async handleFiredIntent(intent, clientIdentity) {
                const contextType = intent?.context?.type;
                const targetApp = resolveTarget(intent.name, contextType);
                recordProviderEvent('handle-fired-intent', {
                  intent: intent.name,
                  contextType,
                  clientIdentity,
                  targetApp,
                });

                if (!targetApp) {
                  const error = new Error(
                    'Unable to resolve target for intent=' + intent.name +
                      ', contextType=' + contextType,
                  );
                  recordProviderEvent('resolve-error', { message: error.message });
                  throw error;
                }

                const clientInfo = await super.getAllClientInfo();
                const targetView = clientInfo.find((info) => info.name === targetApp);
                let targetIdentity = targetView ?? null;

                recordProviderEvent('target-lookup', {
                  targetApp,
                  found: Boolean(targetView),
                });

                if (!targetIdentity) {
                  const appUrl = openfinConfigs.apps[targetApp];
                  if (!appUrl) {
                    const error = new Error(
                      'Unable to find the Target Application with name=' + targetApp,
                    );
                    recordProviderEvent('app-url-error', { message: error.message });
                    throw error;
                  }
                  targetIdentity = await createAppWindow({ name: targetApp, url: appUrl });
                }

                const selectedTarget = {
                  uuid: targetIdentity.uuid ?? openfinConfigs.platformUuid,
                  name: targetIdentity.name ?? targetApp,
                };
                recordProviderEvent('set-intent-target', {
                  intent: intent.name,
                  target: selectedTarget,
                });
                await super.setIntentTarget(intent, selectedTarget);

                return {
                  intent: intent.name,
                  source: {
                    appId: selectedTarget.name,
                    instanceId: selectedTarget.uuid,
                  },
                  getResult: async () => undefined,
                };
              }
            }
            return new Override();
          },
        });

        recordProviderEvent('provider-ready', {
          platformUuid: openfinConfigs.platformUuid,
          mfeTargetName: openfinConfigs.mfeTargetName,
        });
      }

      initProvider().catch((error) => {
        recordProviderEvent('provider-error', {
          message: error?.message ?? String(error),
        });
        console.error(error);
      });
    </script>
  </body>
</html>`;

const homeHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>FDC3 Broker E2E Home</title>
  </head>
  <body>
    <h1>FDC3 Broker E2E Home</h1>
    <button id="raise-view-launch">Raise ViewLaunch</button>
    <script>
      window.__OPENFIN_E2E_HOME_EVENTS__ = [];

      function recordHomeEvent(type, detail) {
        const event = { type, detail, timestamp: Date.now() };
        window.__OPENFIN_E2E_HOME_EVENTS__.push(event);
        console.log('[OpenFin E2E Home]', type, detail);
      }

      async function waitForFdc3() {
        if (window.fdc3?.raiseIntent) {
          return;
        }

        await new Promise((resolve) => {
          const timeout = window.setTimeout(resolve, 10000);
          window.addEventListener('fdc3Ready', () => {
            window.clearTimeout(timeout);
            resolve();
          }, { once: true });
        });
      }

      window.__OPENFIN_E2E_RAISE_INTENT__ = async function raiseIntent(intent, context) {
        await waitForFdc3();
        recordHomeEvent('raise-intent', { intent, context });
        const result = await window.fdc3.raiseIntent(intent, context);
        recordHomeEvent('raise-intent-result', { intent, source: result?.source });
        return result;
      };

      window.__OPENFIN_E2E_DISPATCH_INTENT__ = async function dispatchIntent(intent, context) {
        await waitForFdc3();
        recordHomeEvent('dispatch-intent', { intent, context });
        window.fdc3.raiseIntent(intent, context)
          .then((result) => {
            recordHomeEvent('dispatch-intent-result', { intent, source: result?.source });
          })
          .catch((error) => {
            recordHomeEvent('dispatch-intent-error', {
              intent,
              message: error?.message ?? String(error),
            });
          });
      };

      document.getElementById('raise-view-launch').addEventListener('click', () => {
        window.__OPENFIN_E2E_RAISE_INTENT__('scb.ViewLaunch', {
          type: 'scb.fmptp.cashflow',
          id: { cashflowId: 'CF-OPENFIN-HOME-001' },
        }).catch((error) => {
          recordHomeEvent('raise-intent-error', { message: error?.message ?? String(error) });
        });
      });

      waitForFdc3()
        .then(() => recordHomeEvent('home-ready', {}))
        .catch((error) => recordHomeEvent('home-error', { message: error?.message ?? String(error) }));
    </script>
  </body>
</html>`;

const legacyManifest = {
  devtools_port: devtoolsPort,
  runtime: {
    version: runtimeVersion,
    arguments: `--v=1 --remote-debugging-port=${devtoolsPort}`,
  },
  startup_app: {
    name: mfeTargetName,
    uuid: mfeTargetName,
    url: appUrl,
    autoShow: true,
    saveWindowState: false,
    fdc3Api: true,
    fdc3InteropApi: '2.0',
    defaultWidth: 1440,
    defaultHeight: 950,
  },
};

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

if (!fs.existsSync(rvmPath)) {
  console.error(`[OpenFin E2E] RVM not found: ${rvmPath}`);
  console.error('[OpenFin E2E] Set OPENFIN_RVM_PATH to your OpenFinRVM executable.');
  process.exit(1);
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url || '/', `http://127.0.0.1:${port}`);

  if (requestUrl.pathname === '/fdc3-broker-e2e-app.json') {
    withNoStoreJson(response, manifest);
    return;
  }

  if (requestUrl.pathname === '/fdc3-broker-e2e-legacy-app.json') {
    withNoStoreJson(response, legacyManifest);
    return;
  }

  if (requestUrl.pathname === '/openfin-config.json') {
    withNoStoreJson(response, appConfig);
    return;
  }

  if (requestUrl.pathname === '/platform-provider.html') {
    withNoStoreHtml(response, providerHtml);
    return;
  }

  if (requestUrl.pathname === '/openfin-home.html') {
    withNoStoreHtml(response, homeHtml);
    return;
  }

  response.writeHead(404);
  response.end('not found');
});

server.listen(port, '127.0.0.1', () => {
  const manifestUrl = `http://127.0.0.1:${port}/fdc3-broker-e2e-app.json`;
  const child = spawn(rvmPath, [`--config=${manifestUrl}`], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();

  console.log(`[OpenFin E2E] Manifest: ${manifestPath}`);
  console.log(`[OpenFin E2E] Launching: ${rvmPath} --config=${manifestUrl}`);
  console.log(`[OpenFin E2E] CDP URL: http://127.0.0.1:${devtoolsPort}`);
  console.log('[OpenFin E2E] Keep this process running while the test starts.');
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
