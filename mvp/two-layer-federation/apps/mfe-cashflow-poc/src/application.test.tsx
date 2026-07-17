import { fireEvent, render, screen } from '@testing-library/react';
import type { ApplicationProps, PlatformCapabilities } from '@fm/platform-contracts-poc';
import { Application, manifest } from './application';

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
  };
}

const renderApplication = (capabilities = createCapabilities()) => {
  const props: ApplicationProps = { instanceId: 'cashflow-1', basePath: '/cashflow', capabilities };
  return { ...render(<Application {...props} />), capabilities };
};

describe('Cashflow federated application', () => {
  beforeEach(() => window.history.replaceState({}, '', '/cashflow'));

  it('publishes a compatible application manifest', () => {
    expect(manifest).toEqual({ id: 'cashflow', displayName: 'Cashflow', contractVersion: '1.0.0' });
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
});
