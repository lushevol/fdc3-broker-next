import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Hooks } from './base';
import { getEnable, getUser, hasPermission } from './ratan-utilities';

describe('Cashflow-owned Ratan utility compatibility', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    window.ratanConfig = {};
  });

  it('preserves direct actions and nested entitlement permission checks', () => {
    jest.spyOn(Hooks, 'getHooks').mockReturnValue({
      store: {
        user: {
          id: 'maker-1',
          fullName: 'Cashflow Maker',
          entitlement: {
            actions: ['RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Hold'],
            role: 'maker',
          },
          entitlements: {
            X_RATANONE_SG: {
              RATAN_STRATEGIC_CASHFLOW_BLOTTER: ['F_Export_Data'],
            },
          },
        },
      },
    } as never);

    expect(getUser()).toMatchObject({
      id: 'maker-1',
      name: 'Cashflow Maker',
      role: 'maker',
    });
    expect(hasPermission('RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Hold')).toBe(true);
    expect(hasPermission('RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Export_Data')).toBe(true);
    expect(hasPermission('RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Release')).toBe(false);
  });

  it('preserves disabled-feature user overrides', () => {
    jest.spyOn(Hooks, 'getHooks').mockReturnValue({
      store: {
        user: {
          id: 'enabled-user',
          fullName: 'Enabled User',
          entitlement: { actions: [], role: 'viewer' },
          entitlements: {},
        },
      },
    } as never);
    window.ratanConfig = {
      disabledFeature: ['CashflowExport'],
      enableFeatureForUser: { CashflowExport: ['enabled-user'] },
    };

    expect(getEnable('CashflowExport')).toBe(true);
    expect(getEnable('UnconfiguredFeature')).toBe(true);
  });

  it('removes the extracted utility cohort from the legacy source facade', () => {
    const facade = readFileSync(resolve(process.cwd(), 'src/compat/ratan-container.ts'), 'utf8');

    expect(facade).not.toContain('@legacy-ratan/ratanutils/authenticator');
    expect(facade).not.toContain('@legacy-ratan/ratanutils/componentEnabling');
    expect(facade).not.toContain('@legacy-ratan/ratanutils/logger');
  });

  it('owns the complete Cashflow Ratan source boundary inside the workspace', () => {
    const workspaceFiles = [
      'rsbuild.config.ts',
      'tsconfig.json',
      'tsconfig.application.json',
      'src/compat/ratan-container.ts',
      'src/compat/quick-search-items.ts',
    ].map((file) => readFileSync(resolve(process.cwd(), file), 'utf8'));

    workspaceFiles.forEach((source) => {
      expect(source).not.toContain('apps/mfe-ratan-container');
      expect(source).not.toContain('@legacy-ratan');
    });
    expect(existsSync(resolve(process.cwd(), 'src/cashflow-ratan'))).toBe(true);
  });
});
