import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type AppearanceSnapshot,
  type ApplicationProps,
  type PlatformCapabilities,
} from '@fm/platform-contracts';
import { createAppearanceController, createIdentityController } from '@fm/platform-sdk';
import { Application, createCashflowApplication, filterRecords, manifest } from './application';
import { STANDALONE_APPEARANCE, standaloneCapabilities } from './standalone';
import { AUTHORIZATION_LIMITS_PERMISSIONS } from './authorization-limits-policy';
import { authorizationLimitFixtures } from './authorization-limits-repository';
import type { AuthorizationLimitsService } from './authorization-limits-service';

jest.mock('@fm/ratan-data-grid', () => ({
  RatanDataGrid: () => <div data-testid="mock-data-grid" />,
}));

const appearance: AppearanceSnapshot = {
  scheme: 'dark', preference: 'dark', density: 'compact', locale: 'en-US', direction: 'ltr',
  contractVersion: APPEARANCE_CONTRACT_VERSION,
};

function capabilities(controller = createAppearanceController(appearance)): PlatformCapabilities {
  return {
    navigation: { navigate: jest.fn((path) => { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); }) },
    notifications: { show: jest.fn() }, telemetry: { track: jest.fn() },
    workspace: { closeCurrent: jest.fn() }, appearance: controller.capability,
  };
}

function mount(platform = capabilities()) {
  const props: ApplicationProps = { instanceId: 'cashflow-1', basePath: '/cashflow', capabilities: platform };
  return { ...render(<Application {...props} />), platform };
}

function domainService(): AuthorizationLimitsService {
  const record = authorizationLimitFixtures[0];
  return {
    list: jest.fn().mockResolvedValue(authorizationLimitFixtures),
    create: jest.fn().mockResolvedValue(record), edit: jest.fn().mockResolvedValue(record),
    confirm: jest.fn().mockResolvedValue(record), reject: jest.fn().mockResolvedValue(record),
    remove: jest.fn().mockResolvedValue(record),
  };
}

describe('production Cashflow application', () => {
  beforeEach(() => window.history.replaceState({}, '', '/cashflow'));

  it('publishes production identity and deterministic standalone appearance', () => {
    expect(manifest).toMatchObject({
      id: 'cashflow', contractVersion: '1.0.0', appearanceContractVersion: '1.0.0',
      identityContractVersion: IDENTITY_CONTRACT_VERSION, designSystemVersion: '1.1.0',
    });
    expect(STANDALONE_APPEARANCE).toMatchObject({ scheme: 'dark', density: 'compact' });
  });

  it('remains read-only when the host supplies anonymous identity', () => {
    const identity = createIdentityController({
      state: 'anonymous', contractVersion: IDENTITY_CONTRACT_VERSION,
    });
    const platform = {
      ...capabilities(),
      identity: identity.capability,
    };
    mount(platform);
    expect(screen.queryByRole('button', { name: 'Create authorization limit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Edit authorization limit/ })).not.toBeInTheDocument();
  });

  it('keeps the default export read-only for authenticated identity without a service', async () => {
    window.history.replaceState({}, '', '/cashflow/authorization-limits');
    const identity = createIdentityController({
      state: 'authenticated', userId: 'maker-one',
      permissions: [AUTHORIZATION_LIMITS_PERMISSIONS.access, AUTHORIZATION_LIMITS_PERMISSIONS.initiate],
      contractVersion: IDENTITY_CONTRACT_VERSION,
    });
    mount({ ...capabilities(), identity: identity.capability });
    await screen.findByTestId('mock-data-grid');
    expect(screen.queryByRole('button', { name: 'Create Authorization Limit' })).not.toBeInTheDocument();
  });

  it('keeps an injected service read-only for anonymous identity', async () => {
    window.history.replaceState({}, '', '/cashflow/authorization-limits');
    const service = domainService();
    const FactoryApplication = createCashflowApplication({ authorizationLimitsService: service });
    const platform = capabilities();
    render(<FactoryApplication instanceId="cashflow-service" basePath="/cashflow" capabilities={{
      ...platform,
      identity: createIdentityController({ state: 'anonymous', contractVersion: IDENTITY_CONTRACT_VERSION }).capability,
    }} />);
    await screen.findByTestId('mock-data-grid');
    expect(service.list).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Create Authorization Limit' })).not.toBeInTheDocument();
  });

  it('composes an authenticated service and removes open mutation UI on logout', async () => {
    window.history.replaceState({}, '', '/cashflow/authorization-limits');
    const identity = createIdentityController({
      state: 'authenticated', userId: 'maker-one',
      permissions: [AUTHORIZATION_LIMITS_PERMISSIONS.access, AUTHORIZATION_LIMITS_PERMISSIONS.initiate],
      contractVersion: IDENTITY_CONTRACT_VERSION,
    });
    const FactoryApplication = createCashflowApplication({ authorizationLimitsService: domainService() });
    render(<FactoryApplication instanceId="cashflow-authenticated" basePath="/cashflow" capabilities={{
      ...capabilities(), identity: identity.capability,
    }} />);
    const create = await screen.findByRole('button', { name: 'Create Authorization Limit' });
    fireEvent.click(create);
    expect(screen.getByRole('dialog', { name: 'Create Authorization Limit' })).toBeInTheDocument();
    act(() => identity.setSnapshot({ state: 'anonymous', contractVersion: IDENTITY_CONTRACT_VERSION }));
    expect(screen.queryByRole('button', { name: 'Create Authorization Limit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Create Authorization Limit' })).not.toBeInTheDocument();
  });

  it('filters application-owned records', () => {
    expect(filterRecords('usd')).toHaveLength(2);
    expect(filterRecords('')).toHaveLength(4);
    mount();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Filter cashflows' }), { target: { value: 'EUR' } });
    expect(screen.getByText('1 records')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select CF-1002' })).toBeInTheDocument();
  });

  it('uses public primitives, selects, navigates, tracks, and notifies', () => {
    const { platform } = mount();
    expect(screen.getByRole('searchbox')).toHaveAttribute('data-ratan-control', 'text-field');
    expect(screen.getAllByText('Ready')[0].closest('[data-status]')).toHaveAttribute('data-status', 'ready');
    fireEvent.click(screen.getByRole('button', { name: 'Select CF-1002' }));
    fireEvent.click(screen.getByRole('button', { name: 'View CF-1002 details' }));
    expect(platform.navigation.navigate).toHaveBeenCalledWith('/cashflow/details/CF-1002');
    expect(screen.getByRole('heading', { name: 'CF-1002' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Notify host about CF-1002' }));
    expect(platform.notifications.show).toHaveBeenCalledWith('Cashflow CF-1002 selected');
    expect(platform.telemetry.track).toHaveBeenCalledWith('cashflow.details.opened', { id: 'CF-1002' });
  });

  it('updates its local provider without losing selected state', () => {
    const controller = createAppearanceController(appearance);
    mount(capabilities(controller));
    fireEvent.click(screen.getByRole('button', { name: 'Select CF-1001' }));
    act(() => controller.setSnapshot({ ...appearance, scheme: 'light', preference: 'light', density: 'comfortable' }));
    expect(document.querySelector('[data-ratan-scope="application"]')).toHaveAttribute('data-ratan-theme', 'light');
    expect(screen.getByRole('button', { name: 'View CF-1001 details' })).toBeInTheDocument();
  });

  it('supports direct details, missing recovery, back, and fresh reopen state', () => {
    window.history.replaceState({}, '', '/cashflow/details/UNKNOWN');
    const first = mount();
    expect(screen.getByRole('alert')).toHaveTextContent('not found');
    fireEvent.click(screen.getByRole('button', { name: 'Back to cashflows' }));
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'GBP' } });
    first.unmount();
    mount();
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('provides complete standalone capability behavior', () => {
    const alert = jest.spyOn(window, 'alert').mockImplementation(() => undefined);
    const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    standaloneCapabilities.navigation.navigate('/cashflow/details/CF-1001');
    standaloneCapabilities.notifications.show('ready');
    standaloneCapabilities.telemetry.track('preview', { ok: true });
    standaloneCapabilities.workspace.closeCurrent();
    expect(window.location.pathname).toBe('/cashflow/details/CF-1001');
    expect(alert).toHaveBeenCalledWith('ready');
    expect(info).toHaveBeenCalledTimes(2);
    alert.mockRestore();
    info.mockRestore();
  });
});
