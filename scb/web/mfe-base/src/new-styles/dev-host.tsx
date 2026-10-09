/** Local proof host: mounts the emitted SystemJS artifact, never the source App. */
import React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import * as JsxRuntime from 'react/jsx-runtime';
import * as singleSpa from 'single-spa';
import 'systemjs/dist/system.js';
import {
  RatanDesignProvider,
  type RatanAppearance,
} from 'ratan-design-origin';
import { Button } from 'ratan-design-origin/button';
import { Stack, TextField, Typography } from 'ratan-design-origin/primitives';

interface FixtureProps {
  appearance: RatanAppearance;
  tile?: string;
}

function FixtureTile({ appearance, tile }: FixtureProps) {
  const [count, setCount] = React.useState(0);
  return (
    <RatanDesignProvider {...appearance}>
      <Stack spacing={2} sx={{ p: 2 }} data-testid="systemjs-fixture-tile">
        <Typography variant="h6">SystemJS tile</Typography>
        <Typography data-testid="remote-appearance">
          {appearance.designGeneration} / {appearance.mode}
        </Typography>
        <Typography variant="body2">{tile}</Typography>
        <TextField label="Reference" size="small" />
        <Button variant="contained" onClick={() => setCount((value) => value + 1)}>
          Clicked {count} times
        </Button>
      </Stack>
    </RatanDesignProvider>
  );
}

interface BaseModule {
  bootstrap: singleSpa.LifeCycleFn<Record<string, unknown>> | singleSpa.LifeCycleFn<Record<string, unknown>>[];
  mount: singleSpa.LifeCycleFn<Record<string, unknown>> | singleSpa.LifeCycleFn<Record<string, unknown>>[];
}

async function runLifecycle(
  lifecycle: BaseModule['mount'],
  props: Record<string, unknown>,
) {
  for (const callback of Array.isArray(lifecycle) ? lifecycle : [lifecycle]) {
    await callback(props as singleSpa.AppProps & Record<string, unknown>);
  }
}

async function start() {
  const root = document.getElementById('portal-root');
  if (!root) throw new Error('Missing portal mount point');
  window.single_spa_container_id = root;
  const params = new URLSearchParams(window.location.search);
  const production = params.get('artifact') === 'production';
  const mappings = {
    react: 'app:react',
    'react-dom': 'app:react-dom',
    'react-dom/client': 'app:react-dom-client',
    'react/jsx-runtime': 'app:jsx-runtime',
    'single-spa': 'app:single-spa',
    '@fm/base': production ? '/base-production/base.js' : '/base/base.js',
    '@fm/ratan_container': 'app:fixture-remote',
    '@fm/alpha_payments': 'app:fixture-remote',
  };
  const map = document.createElement('script');
  map.type = 'systemjs-importmap';
  map.textContent = JSON.stringify({ imports: mappings });
  document.head.appendChild(map);
  System.set('app:react', { ...React, default: React });
  System.set('app:react-dom', { ...ReactDOM, default: ReactDOM });
  System.set('app:react-dom-client', { ...ReactDOMClient, default: ReactDOMClient });
  System.set('app:jsx-runtime', JsxRuntime);
  System.set('app:single-spa', singleSpa);
  System.set('app:fixture-remote', { default: FixtureTile });
  const base = await System.import<BaseModule>('@fm/base');
  const props = {
    name: '@fm/base',
    domElement: root,
    version: 'original-runtime-copy',
    newStyles: params.get('new-styles') !== 'false',
    loginAppearance: params.get('login-theme') === 'dark' ? 'dark' : 'light',
  };
  await runLifecycle(base.bootstrap, props);
  await runLifecycle(base.mount, props);
  document.body.dataset.baseArtifact = production ? 'production' : 'development';
}

start().catch((error: unknown) => {
  console.error(error);
  const root = document.getElementById('portal-root');
  if (root) root.textContent = error instanceof Error ? error.message : String(error);
});
