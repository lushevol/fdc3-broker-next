import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const workspaceRoot = join(import.meta.dirname, '..');
const activeOrigins = [
  'mfe-base-origin',
  'mfe-ratan-container-origin',
  'mfe-cashflow-blotter-origin',
] as const;

function packageJson(origin: (typeof activeOrigins)[number]) {
  return JSON.parse(readFileSync(join(workspaceRoot, 'web', origin, 'package.json'), 'utf8')) as {
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
}

describe('SCB Next composition architecture', () => {
  it('composes Alpha Payments through the generated tenant paths and workspace processes', () => {
    const baseConfig = readFileSync(
      join(workspaceRoot, 'web/mfe-base-origin/vite.config.ts'),
      'utf8',
    );
    const alphaConfig = readFileSync(
      join(workspaceRoot, 'web/mfe-alpha-payments-origin/vite.config.ts'),
      'utf8',
    );
    const rootManifest = JSON.parse(
      readFileSync(join(workspaceRoot, 'package.json'), 'utf8'),
    ) as { workspaces: string[]; scripts: Record<string, string> };

    expect(baseConfig).toContain('VITE_ALPHA_PAYMENTS_REMOTE_URL');
    expect(baseConfig).toContain('mfe_alpha_payments');
    expect(baseConfig).toContain('"/api/alpha-payments/"');
    expect(alphaConfig).toContain('port: 8018');
    expect(alphaConfig).toContain('VITE_ALPHA_PAYMENTS_API_TARGET');
    expect(alphaConfig).toContain('"./application"');
    expect(rootManifest.workspaces).toEqual(
      expect.arrayContaining([
        'web/mfe-alpha-payments-origin',
        'services/alpha-payments-api',
      ]),
    );
    expect(rootManifest.scripts.dev).toContain('@fm/alpha_payments-origin');
    expect(rootManifest.scripts.dev).toContain('@scb-next/alpha-payments-api');
  });

  it.each(activeOrigins)('uses Vite and Vitest in %s', (origin) => {
    const manifest = packageJson(origin);

    expect(existsSync(join(workspaceRoot, 'web', origin, 'vite.config.ts'))).toBe(true);
    expect(manifest.scripts?.build).toContain('vite build');
    expect(manifest.scripts?.test).toContain('vitest run');
    expect(manifest.devDependencies).toHaveProperty('vite');
    expect(manifest.devDependencies).toHaveProperty('vitest');
  });

  it.each(activeOrigins)('has no active single-spa toolchain in %s', (origin) => {
    const manifest = packageJson(origin);
    const packages = { ...manifest.dependencies, ...manifest.devDependencies };

    expect(Object.keys(packages).filter((name) => name.includes('single-spa'))).toEqual([]);
    expect(Object.keys(packages).filter((name) => name.startsWith('webpack'))).toEqual([]);
  });

  it('configures the base host and both federated remotes', () => {
    const baseConfig = readFileSync(
      join(workspaceRoot, 'web/mfe-base-origin/vite.config.ts'),
      'utf8',
    );
    const ratanConfig = readFileSync(
      join(workspaceRoot, 'web/mfe-ratan-container-origin/vite.config.ts'),
      'utf8',
    );
    const cashflowConfig = readFileSync(
      join(workspaceRoot, 'web/mfe-cashflow-blotter-origin/vite.config.ts'),
      'utf8',
    );

    expect(baseConfig).toContain('port: 8001');
    expect(baseConfig).toContain('mfe_ratan_container');
    expect(ratanConfig).toContain('port: 8009');
    expect(ratanConfig).toContain('mfe_cashflow_blotter');
    expect(ratanConfig).toContain('"react-router-dom": { singleton: true');
    expect(cashflowConfig).toContain('port: 8015');
    expect(cashflowConfig).toContain("'react-router-dom': { singleton: true");
    expect(ratanConfig).toContain('exposes');
    expect(cashflowConfig).toContain('exposes');
  });

  it('fails startup instead of silently moving federation origins to incompatible ports', () => {
    for (const origin of activeOrigins) {
      const config = readFileSync(join(workspaceRoot, 'web', origin, 'vite.config.ts'), 'utf8');
      expect(config).toContain('strictPort: true');
    }
  });

  it('contains no webpack HMR globals in active cashflow schemas', () => {
    const schemaRoot = join(workspaceRoot, 'web/mfe-cashflow-blotter-origin/src');
    const schemas = [
      'Cashflow_CN/schema/ultra-cashflow-query-count.generated.ts',
      'Cashflow_CN/schema/ultra-cashflow-query.generated.ts',
      'Cashflow_Group_Management/schema/group-message-query.generated.ts',
    ];

    for (const schema of schemas) {
      expect(readFileSync(join(schemaRoot, schema), 'utf8')).not.toContain('module.hot');
    }
  });

  it('supports same-origin production federation behind the Nginx edge', () => {
    const baseConfig = readFileSync(
      join(workspaceRoot, 'web/mfe-base-origin/vite.config.ts'),
      'utf8',
    );
    const ratanConfig = readFileSync(
      join(workspaceRoot, 'web/mfe-ratan-container-origin/vite.config.ts'),
      'utf8',
    );
    const cashflowConfig = readFileSync(
      join(workspaceRoot, 'web/mfe-cashflow-blotter-origin/vite.config.ts'),
      'utf8',
    );

    expect(baseConfig).toContain('VITE_RATAN_REMOTE_URL');
    expect(ratanConfig).toContain('VITE_CASHFLOW_REMOTE_URL');
    expect(ratanConfig).toContain('VITE_PUBLIC_BASE');
    expect(cashflowConfig).toContain('VITE_PUBLIC_BASE');
  });

  it('packages an immutable, health-checked Nginx production edge', () => {
    const nginxRoot = join(workspaceRoot, 'devops/nginx');
    const config = readFileSync(join(nginxRoot, 'default.conf.template'), 'utf8');
    const compose = readFileSync(
      join(workspaceRoot, 'devops/docker-compose.production.yml'),
      'utf8',
    );

    expect(config).toContain('location = /healthz');
    expect(config).toContain('location ^~ /remotes/ratan/');
    expect(config).toContain('location ^~ /remotes/cashflow/');
    expect(config).toContain('proxy_pass ${BFF_ORIGIN}');
    expect(config).toContain('proxy_set_header Upgrade $http_upgrade');
    expect(config).toContain('Content-Security-Policy');
    expect(compose).toContain('read_only: true');
    expect(compose).toContain('no-new-privileges:true');
    expect(compose).toContain('node:22-alpine');
    expect(compose).toContain('mock-bff/server.mjs');
    expect(compose).toContain('${SCB_NEXT_EDGE_PORT:-9081}:8080');
    expect(compose).toContain('condition: service_healthy');
  });

  it('preserves the production Ratan CSS namespace used by Cashflow overrides', () => {
    const ratanConfig = readFileSync(
      join(workspaceRoot, 'web/mfe-ratan-container-origin/vite.config.ts'),
      'utf8',
    );
    const cashflowLayout = readFileSync(
      join(workspaceRoot, 'web/mfe-cashflow-blotter-origin/src/Cashflow_CN/Main/style.ts'),
      'utf8',
    );

    expect(ratanConfig).toContain(
      '"process.env.MFE_APP_PREFIX_STYLE": JSON.stringify("MicroWebUI_ratan_container")',
    );
    expect(cashflowLayout).toContain(
      'filterCreateOrModifyBtn: "MicroWebUI_ratan_container_filter_selector-view-btn"',
    );
    expect(cashflowLayout).toContain(
      'viewCreateOrModifyBtn: "MicroWebUI_ratan_container_view_selector-view-btn"',
    );
    expect(cashflowLayout).not.toContain('${process.env.MFE_APP_PREFIX_STYLE}_ratan_container');
  });

  it('bundles the complete local Ratan grid skin into Cashflow', () => {
    const cashflowGridStyles = readFileSync(
      join(
        workspaceRoot,
        'web/mfe-cashflow-blotter-origin/src/cashflow-ratan/ratancomponents/DataGrid/styles/aggird.less',
      ),
      'utf8',
    );

    expect(cashflowGridStyles).toContain(
      'mfe-ratan-container-origin/src/ratancomponents/DataGrid/styles/ag-grid-ratan.css',
    );
    expect(cashflowGridStyles).toContain(
      'mfe-ratan-container-origin/src/ratancomponents/DataGrid/styles/ag-theme-alpine-ratan.css',
    );
    expect(cashflowGridStyles).not.toContain('https://');
  });
});
