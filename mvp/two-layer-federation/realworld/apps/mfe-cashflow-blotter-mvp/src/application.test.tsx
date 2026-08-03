import {
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationProps,
  type PlatformCapabilities,
} from '@fm/platform-contracts';
import { createAppearanceController, createIdentityController } from '@fm/platform-sdk';
import { act, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Application, manifest } from './application';

function platform() {
  const appearance = createAppearanceController({
    scheme: 'light',
    preference: 'light',
    density: 'compact',
    locale: 'en-SG',
    direction: 'ltr',
    contractVersion: APPEARANCE_CONTRACT_VERSION,
  });
  const identity = createIdentityController({
    state: 'authenticated',
    userId: 'cashflow.verifier',
    permissions: ['cashflow:view'],
    contractVersion: IDENTITY_CONTRACT_VERSION,
  });
  const capabilities: PlatformCapabilities = {
    navigation: { navigate: jest.fn() },
    notifications: { show: jest.fn() },
    telemetry: { track: jest.fn() },
    workspace: { closeCurrent: jest.fn() },
    appearance: appearance.capability,
    identity: identity.capability,
  };
  return { appearance, capabilities };
}

describe('actual Cashflow CN Portal Host migration entry', () => {
  it('publishes the Cashflow CN federated identity', () => {
    expect(manifest).toMatchObject({
      id: 'cashflow-blotter',
      displayName: 'Cashflow CN',
      designSystemVersion: '1.1.0',
    });
  });

  it('renders the actual Cashflow CN entry rather than fixture records', () => {
    const host = platform();
    const props: ApplicationProps = {
      instanceId: 'cashflow-cn-1',
      basePath: '/cashflow-blotter',
      capabilities: host.capabilities,
    };
    const { container } = render(<Application {...props} />);

    expect(screen.getByTestId('actual-cashflow-cn-root')).toBeInTheDocument();
    expect(container.querySelector('[data-source="src/Cashflow_CN"]'))
      .toBeInTheDocument();
    expect(host.capabilities.telemetry.track).toHaveBeenCalledWith(
      'cashflow-cn.migrated-root.mounted',
      { source: 'src/Cashflow_CN' },
    );
    expect(screen.queryByText('CF-CN-24001')).not.toBeInTheDocument();
  });

  it('updates the migrated root when host appearance changes', () => {
    const host = platform();
    render(
      <Application
        instanceId="cashflow-cn-appearance"
        basePath="/cashflow-blotter"
        capabilities={host.capabilities}
      />,
    );
    act(() => {
      host.appearance.setSnapshot({
        scheme: 'dark',
        preference: 'dark',
        density: 'comfortable',
        locale: 'en-SG',
        direction: 'rtl',
        contractVersion: APPEARANCE_CONTRACT_VERSION,
      });
    });
    expect(document.querySelector('[data-ratan-theme="dark"]')).toBeInTheDocument();
  });

  it('keeps a mechanical provenance link to the production Cashflow CN root', () => {
    const migrationEntry = readFileSync(resolve(__dirname, 'migrated-entry.tsx'), 'utf8');
    const migratedRoot = resolve(__dirname, 'Cashflow_CN/index.tsx');
    const legacyRoot = resolve(
      __dirname,
      '../../../../../../apps/mfe-cashflow-blotter/src/Cashflow_CN/index.tsx',
    );
    expect(migrationEntry).toContain("from '@migrated-cashflow-cn'");
    expect(readFileSync(migratedRoot, 'utf8')).toBe(readFileSync(legacyRoot, 'utf8'));
    expect(readFileSync(migratedRoot, 'utf8')).toContain('createStore');
    expect(readFileSync(migratedRoot, 'utf8')).toContain('<Main {...props} />');
  });
});
