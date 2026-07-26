import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  APPEARANCE_CONTRACT_VERSION,
  type AppearanceSnapshot,
  type ApplicationProps,
  type PlatformCapabilities,
} from '@fm/platform-contracts-poc';
import { createAppearanceController } from '@fm/platform-sdk-poc';
import { Application, applicationManifest, manifest, mount, unmount } from './application';
import { STANDALONE_APPEARANCE, standaloneAppearanceCapability } from './standalone';

const defaultAppearance: AppearanceSnapshot = {
  scheme: 'dark', preference: 'dark', density: 'compact', locale: 'en-US', direction: 'ltr',
  contractVersion: APPEARANCE_CONTRACT_VERSION,
};

function createCapabilities(): PlatformCapabilities {
  return {
    navigation: {
      navigate: jest.fn((path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }),
    },
    notifications: { show: jest.fn() },
    telemetry: { track: jest.fn() },
    workspace: { closeCurrent: jest.fn() },
    appearance: createAppearanceController(defaultAppearance).capability,
  };
}

const renderApplication = (capabilities = createCapabilities()) => {
  const props: ApplicationProps = { instanceId: 'cashflow-1', basePath: '/cashflow', capabilities };
  return { ...render(<Application {...props} />), capabilities };
};

describe('Cashflow federated application', () => {
  beforeEach(() => window.history.replaceState({}, '', '/cashflow'));

  it('publishes a compatible application manifest and Host Tile contract', () => {
    expect(applicationManifest).toEqual({
      id: 'cashflow', displayName: 'Cashflow', contractVersion: '1.0.0',
      appearanceContractVersion: '1.0.0',
    });
    expect(manifest).toEqual({ tileId: 'cashflow', contractVersion: '0.1' });
  });

  it('defines deterministic standalone appearance defaults', () => {
    expect(standaloneAppearanceCapability.getSnapshot()).toEqual(STANDALONE_APPEARANCE);
    expect(STANDALONE_APPEARANCE).toMatchObject({ scheme: 'dark', density: 'compact' });
  });

  it('subscribes a local provider to live host appearance updates', () => {
    const controller = createAppearanceController(defaultAppearance);
    const capabilities = { ...createCapabilities(), appearance: controller.capability };
    renderApplication(capabilities);
    const designRoot = document.querySelector('[data-ratan-scope="application"]');
    expect(designRoot).toHaveAttribute('data-ratan-theme', 'dark');
    expect(designRoot).toHaveAttribute('data-ratan-density', 'compact');

    act(() => controller.setSnapshot({
      ...defaultAppearance, scheme: 'light', preference: 'light', density: 'comfortable',
    }));
    expect(designRoot).toHaveAttribute('data-ratan-theme', 'light');
    expect(designRoot).toHaveAttribute('data-ratan-density', 'comfortable');
  });

  it('uses the shared filter, action, and status primitives', () => {
    renderApplication();
    expect(screen.getByRole('searchbox', { name: 'Filter cashflows' })).toHaveAttribute('data-ratan-control', 'text-field');
    fireEvent.click(screen.getByRole('button', { name: 'Select CF-1001' }));
    expect(screen.getByRole('button', { name: 'View CF-1001 details' })).toHaveAttribute('data-ratan-variant', 'primary');
    expect(screen.getAllByText('Ready')[0].closest('[data-status]')).toHaveAttribute('data-status', 'ready');
  });

  it('filters records and updates the application-owned summary', () => {
    renderApplication();
    expect(screen.getByText('4 records')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Filter cashflows' }), { target: { value: 'USD' } });
    expect(screen.getByText('2 records')).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'CF-1001' })).toBeInTheDocument();
    expect(screen.queryByRole('rowheader', { name: 'CF-1002' })).not.toBeInTheDocument();
  });

  it('selects a record, navigates to details, and notifies through host capabilities', () => {
    const { capabilities } = renderApplication();
    fireEvent.click(screen.getByRole('button', { name: 'Select CF-1002' }));
    expect(screen.getByRole('row', { name: /CF-1002/ })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'View CF-1002 details' }));
    expect(capabilities.navigation.navigate).toHaveBeenCalledWith('/cashflow/details/CF-1002');
    expect(screen.getByRole('heading', { name: 'CF-1002' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Notify host about CF-1002' }));
    expect(capabilities.notifications.show).toHaveBeenCalledWith('Cashflow CF-1002 selected');
    expect(capabilities.telemetry.track).toHaveBeenCalledWith('cashflow.details.opened', { id: 'CF-1002' });
  });

  it('supports direct nested-route refresh and back navigation', () => {
    window.history.replaceState({}, '', '/cashflow/details/CF-1003');
    const { capabilities } = renderApplication();
    expect(screen.getByRole('heading', { name: 'CF-1003' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Back to cashflows/ }));
    expect(capabilities.navigation.navigate).toHaveBeenCalledWith('/cashflow');
    expect(screen.getByRole('searchbox', { name: 'Filter cashflows' })).toHaveValue('');
  });

  it('shows an unknown-record recovery route', () => {
    window.history.replaceState({}, '', '/cashflow/details/UNKNOWN');
    renderApplication();
    expect(screen.getByText('Cashflow record was not found.')).toBeInTheDocument();
  });

  it('starts with fresh local state after unmount and reopen', () => {
    const first = renderApplication();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Filter cashflows' }), { target: { value: 'EUR' } });
    expect(screen.getByRole('searchbox', { name: 'Filter cashflows' })).toHaveValue('EUR');
    first.unmount();
    renderApplication();
    expect(screen.getByRole('searchbox', { name: 'Filter cashflows' })).toHaveValue('');
  });

  it('mounts and unmounts through the Host Shadow Root contract', () => {
    const host = document.createElement('section');
    const root = host.attachShadow({ mode: 'open' });
    const close = jest.fn();
    const telemetry = jest.fn();
    act(() => mount({
      tileId: 'cashflow', instanceId: 'cashflow-2', root,
      capabilities: { close, telemetry: { track: telemetry }, fdc3: { raise: jest.fn() } },
    }));
    expect(root.textContent).toContain('Cashflow blotter');
    const select = [...root.querySelectorAll('button')].find((button) => button.textContent === 'Select CF-1001') as HTMLButtonElement;
    act(() => select.click());
    const details = root.querySelector('[aria-label="View CF-1001 details"]') as HTMLButtonElement;
    act(() => details.click());
    const notify = root.querySelector('[aria-label="Notify host about CF-1001"]') as HTMLButtonElement;
    act(() => notify.click());
    expect(window.location.pathname).toBe('/cashflow/details/CF-1001');
    expect(telemetry).toHaveBeenCalledWith('cashflow.notification.Cashflow CF-1001 selected');
    expect(telemetry).toHaveBeenCalledWith('cashflow.details.opened');
    act(() => unmount('cashflow-2'));
    expect(root.textContent).toBe('');
    act(() => unmount('cashflow-missing'));
    expect(close).not.toHaveBeenCalled();
  });
});
