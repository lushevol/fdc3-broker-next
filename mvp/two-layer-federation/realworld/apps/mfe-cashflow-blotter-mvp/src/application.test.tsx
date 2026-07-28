import {
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationProps,
  type PlatformCapabilities,
} from '@fm/platform-contracts';
import { createAppearanceController, createIdentityController } from '@fm/platform-sdk';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  Application,
  cashflowColumns,
  cashflowStatusTone,
  cashflows,
  filterCashflows,
  manifest,
} from './application';

jest.mock('@fm/ratan-data-grid', () => ({
  RatanDataGrid: ({
    rows,
    onSelectionChange,
    getRowId,
  }: {
    rows: Array<{ id: string }>;
    onSelectionChange: (row: { id: string }) => void;
    getRowId: (row: { id: string }) => string;
  }) => (
    <div aria-label="Cashflow blotter">
      {rows.map((row) => (
        <button key={getRowId(row)} onClick={() => onSelectionChange(row)}>
          {getRowId(row)}
        </button>
      ))}
    </div>
  ),
}));

function capabilities(): PlatformCapabilities {
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
  return {
    navigation: { navigate: jest.fn() },
    notifications: { show: jest.fn() },
    telemetry: { track: jest.fn() },
    workspace: { closeCurrent: jest.fn() },
    appearance: appearance.capability,
    identity: identity.capability,
  };
}

describe('Cashflow Blotter migration MVP', () => {
  it('publishes the migrated production identity', () => {
    expect(manifest).toMatchObject({
      id: 'cashflow-blotter',
      displayName: 'Cashflow Blotter MVP',
      designSystemVersion: '1.1.0',
    });
  });

  it('filters the migration dataset without a container runtime', () => {
    expect(filterCashflows('atlas')).toEqual([expect.objectContaining({ id: 'CF-24001' })]);
    expect(filterCashflows('')).toHaveLength(4);
    expect(filterCashflows('review')).toEqual([expect.objectContaining({ id: 'CF-24002' })]);
    expect(filterCashflows('missing')).toEqual([]);
  });

  it('formats amounts and maps every migrated status to a design-system tone', () => {
    expect(cashflowStatusTone('Ready')).toBe('ready');
    expect(cashflowStatusTone('Review')).toBe('review');
    expect(cashflowStatusTone('Blocked')).toBe('blocked');

    const amountColumn = cashflowColumns.find((column) => column.key === 'amount');
    expect(amountColumn?.formatValue?.(1250000, cashflows[0])).toBe('1,250,000.00');

    const statusColumn = cashflowColumns.find((column) => column.key === 'status');
    render(
      <>
        {cashflows.map((record) => (
          <span key={record.id}>{statusColumn?.renderCell?.(record)}</span>
        ))}
      </>,
    );
    expect(screen.getAllByText('Ready')).toHaveLength(2);
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });

  it('renders the package-owned grid and reports selection through host capabilities', () => {
    const platform = capabilities();
    const props: ApplicationProps = {
      instanceId: 'cashflow-blotter-1',
      basePath: '/cashflow-blotter',
      capabilities: platform,
    };
    render(<Application {...props} />);

    expect(screen.getByRole('heading', { name: 'Cashflow blotter' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Filter cashflows'), {
      target: { value: 'atlas' },
    });
    expect(screen.getByRole('button', { name: 'CF-24001' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'CF-24002' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'CF-24001' }));
    fireEvent.click(screen.getByRole('button', { name: 'Notify host about CF-24001' }));
    expect(platform.notifications.show).toHaveBeenCalledWith('Cashflow CF-24001 selected.');
    expect(platform.telemetry.track).toHaveBeenCalledWith('cashflow-blotter.selected', {
      id: 'CF-24001',
    });
  });
});
