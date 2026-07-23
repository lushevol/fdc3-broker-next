import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { PlatformClient } from '@fm/platform-sdk';
import type { RatanDataGridProps } from '@fm/ratan-data-grid';
import { AuthorizationLimits, authorizationLimitColumns } from './AuthorizationLimits';
import { authorizationLimitFixtures, type AuthorizationLimitRecord, type AuthorizationLimitsRepository } from './authorization-limits-repository';

let gridProps: RatanDataGridProps<AuthorizationLimitRecord> | undefined;
jest.mock('@fm/ratan-data-grid', () => ({
  RatanDataGrid: (props: RatanDataGridProps<AuthorizationLimitRecord>) => {
    gridProps = props;
    if (props.loading) return <div role="status">Loading {props.ariaLabel}</div>;
    if (props.error) return <div role="alert">{props.error}<button onClick={props.onRetry}>Retry {props.ariaLabel}</button></div>;
    if (!props.rows.length) return <div role="status">{props.emptyMessage}</div>;
    return <div data-testid="authorization-grid">{props.rows.length} grid rows<button onClick={() => props.onSelectionChange?.(props.rows[0])}>Select first limit</button><button onClick={() => props.onActivate?.(props.rows[0])}>Activate first limit</button></div>;
  },
}));

function client(): PlatformClient {
  return {
    navigate: jest.fn(), notify: jest.fn(), track: jest.fn(), closeCurrentWorkspace: jest.fn(),
    getAppearance: jest.fn() as PlatformClient['getAppearance'], subscribeToAppearance: jest.fn(),
    getIdentity: jest.fn(), subscribeToIdentity: jest.fn(),
  };
}

describe('Authorization Limits read-only cohort', () => {
  beforeEach(() => { gridProps = undefined; });

  it('defines the bounded legacy-parity columns', () => {
    expect(authorizationLimitColumns.map(({ key, header }) => ({ key, header }))).toEqual([
      { key: 'profile', header: 'Profile' }, { key: 'currency', header: 'Currency' },
      { key: 'limitation', header: 'Limitation' }, { key: 'status', header: 'Status' },
    ]);
    expect(authorizationLimitColumns[2].formatValue?.(5000000, authorizationLimitFixtures[0])).toBe('$5,000,000.00');
    expect(authorizationLimitColumns[3].renderCell?.(authorizationLimitFixtures[2])).toBeTruthy();
  });

  it('loads, filters, selects, and activates details through the platform client', async () => {
    const platform = client();
    render(<AuthorizationLimits basePath="/cashflow" path="/cashflow/authorization-limits" client={platform} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    expect(await screen.findByTestId('authorization-grid')).toHaveTextContent('12 grid rows');
    expect(gridProps).toMatchObject({ pageSize: 5, selectedRowId: null });
    fireEvent.change(screen.getByRole('searchbox', { name: 'Filter Authorization Limits' }), { target: { value: 'TREASURY' } });
    expect(screen.getByTestId('authorization-grid')).toHaveTextContent('2 grid rows');
    fireEvent.click(screen.getByRole('button', { name: 'Select first limit' }));
    expect(gridProps?.selectedRowId).toBe('LIM-1003');
    fireEvent.click(screen.getByRole('button', { name: 'Activate first limit' }));
    expect(platform.navigate).toHaveBeenCalledWith('/cashflow/authorization-limits/details/LIM-1003');
  });

  it('renders details, metadata, deferral, back, and unknown recovery', async () => {
    const platform = client();
    const first = render(<AuthorizationLimits basePath="/cashflow" path="/cashflow/authorization-limits/details/LIM-1001" client={platform} />);
    expect(await screen.findByRole('heading', { name: 'LIM-1001' })).toBeInTheDocument();
    expect(screen.getByText('$5,000,000.00')).toBeInTheDocument();
    expect(screen.getByText(/Create, edit, delete, approve, and reject remain/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to Authorization Limits' }));
    expect(platform.navigate).toHaveBeenCalledWith('/cashflow/authorization-limits');
    first.unmount();
    render(<AuthorizationLimits basePath="/cashflow" path="/cashflow/authorization-limits/details/UNKNOWN" client={platform} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('not found');
  });

  it('distinguishes error/retry and empty repository states', async () => {
    const repository: AuthorizationLimitsRepository = { list: jest.fn()
      .mockRejectedValueOnce(new Error('Limits unavailable'))
      .mockResolvedValueOnce([]) };
    render(<AuthorizationLimits basePath="/cashflow" path="/cashflow/authorization-limits" client={client()} repository={repository} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Limits unavailable');
    fireEvent.click(screen.getByRole('button', { name: 'Retry Authorization Limits' }));
    await waitFor(() => expect(repository.list).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole('status')).toHaveTextContent('No Authorization Limits');
  });
});
