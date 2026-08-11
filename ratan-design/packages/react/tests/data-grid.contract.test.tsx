import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { assertNoAxeViolations } from '@fm/ratan-design-vitest';

import parityManifest from '../../../manifests/parity-manifest.json';
import {
  DataGrid,
  type DataGridColumn,
  type DataGridSorting,
} from '../src/data-grid';

interface Trade { id: string; symbol: string; quantity: number }
const rows: Trade[] = [
  { id: '1', symbol: 'ZINC', quantity: 20 },
  { id: '2', symbol: 'ALUM', quantity: 10 },
];
const columns: DataGridColumn<Trade>[] = [
  { id: 'symbol', header: 'Symbol', accessor: 'symbol', sortable: true },
  { id: 'quantity', header: 'Quantity', accessor: (row) => row.quantity, sortable: true },
];

describe('DataGrid representative proof contract', () => {
  it('client-sorts through a React Aria keyboard action with a Ratan-owned detail', async () => {
    const user = userEvent.setup();
    const onSortingChange = vi.fn();
    render(<DataGrid aria-label="Trades" data={rows} columns={columns} getRowId={(row) => row.id} onSortingChange={onSortingChange} />);

    const sort = screen.getByRole('button', { name: /Sort by Symbol/ });
    sort.focus();
    await user.keyboard('{Enter}');
    expect(onSortingChange).toHaveBeenCalledWith(
      [{ id: 'symbol', descending: false }],
      expect.objectContaining({ reason: 'sort' }),
    );
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('ALUM');
  });

  it('reports manual sorting without transforming server-owned rows', async () => {
    const user = userEvent.setup();
    const onSortingChange = vi.fn();
    render(<DataGrid aria-label="Server trades" data={rows} columns={columns} manualSorting onSortingChange={onSortingChange} />);
    await user.click(screen.getByRole('button', { name: /Sort by Symbol/ }));
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('ZINC');
    expect(onSortingChange).toHaveBeenCalled();
  });

  it('supports controlled sorting and React Aria selection presses', async () => {
    const user = userEvent.setup();
    const sorting: DataGridSorting = [{ id: 'quantity', descending: true }];
    const onSelectionChange = vi.fn();
    render(<DataGrid aria-label="Selected trades" data={rows} columns={columns} sorting={sorting} selectionMode="multiple" onSelectionChange={onSelectionChange} />);
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('ZINC');
    await user.click(screen.getByRole('button', { name: 'Select row 1' }));
    expect(onSelectionChange).toHaveBeenCalledWith(['1'], expect.objectContaining({ reason: 'selection', rowId: '1' }));
  });

  it('keeps stale rows visible while refreshing and separates terminal states', () => {
    const { rerender } = render(<DataGrid aria-label="States" data={rows} columns={columns} refreshing />);
    expect(screen.getByRole('grid')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('ZINC')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Refreshing');

    rerender(<DataGrid aria-label="States" data={[]} columns={columns} loading loadingState={<p>Loading trades</p>} />);
    expect(screen.getByText('Loading trades')).toBeInTheDocument();
    rerender(<DataGrid aria-label="States" data={[]} columns={columns} emptyState={<p>No trades</p>} />);
    expect(screen.getByText('No trades')).toBeInTheDocument();
    rerender(<DataGrid aria-label="States" data={[]} columns={columns} error={new Error('failed')} errorState={<p>Trade error</p>} />);
    expect(screen.getByText('Trade error')).toBeInTheDocument();
  });

  it('uses bounded DOM rendering for a large dataset', () => {
    const manyRows = Array.from({ length: 1000 }, (_, index) => ({ id: String(index), symbol: `S${index}`, quantity: index }));
    render(<DataGrid aria-label="Large trades" data={manyRows} columns={columns} height={120} rowHeight={30} overscan={1} />);
    expect(screen.getAllByRole('row').length).toBeLessThan(20);
    expect(screen.getByRole('grid')).toHaveAttribute('aria-rowcount', '1001');
  });

  it('maps the included frozen grid and passes automated accessibility checks', async () => {
    const { container } = render(<DataGrid aria-label="Accessible trades" data={rows} columns={columns} />);
    const entry = parityManifest.components.find((component) => component.legacy.tag === 'sc-data-grid');
    expect(entry?.classification).toBe('included');
    expect(entry?.react?.subpath).toBe('./data-grid');
    expect(within(screen.getByRole('grid')).getAllByRole('columnheader')).toHaveLength(2);
    await expect(assertNoAxeViolations({ context: container })).resolves.toBeDefined();
  });
});
