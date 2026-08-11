import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataGrid, type DataGridColumn, type DataGridSorting } from '../src/index.js';

interface Row { id: string; symbol: string; quantity: number }
const data: Row[] = [{ id: '1', symbol: 'ZINC', quantity: 20 }, { id: '2', symbol: 'ALUM', quantity: 10 }];
const columns: DataGridColumn<Row>[] = [{ id: 'symbol', header: 'Symbol', accessor: 'symbol', sortable: true }, { id: 'quantity', header: 'Quantity', accessor: (row) => row.quantity, sortable: true }];

describe('DataGrid private foundation', () => {
  it('sorts ascending and descending with uncontrolled state', async () => {
    const onSortingChange = vi.fn();
    render(<DataGrid aria-label="Trades" data={data} columns={columns} onSortingChange={onSortingChange} />);
    const sort = screen.getByRole('button', { name: 'Sort by Symbol' });
    await userEvent.click(sort);
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('ALUM');
    await userEvent.click(sort);
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('ZINC');
    expect(onSortingChange).toHaveBeenLastCalledWith([{ id: 'symbol', descending: true }], { reason: 'sort' });
  });

  it('keeps manual and controlled sorting application-owned', async () => {
    const onSortingChange = vi.fn();
    const sorting: DataGridSorting = [{ id: 'quantity', descending: true }];
    render(<DataGrid aria-label="Server" data={data} columns={columns} sorting={sorting} manualSorting onSortingChange={onSortingChange} />);
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('ZINC');
    await userEvent.click(screen.getByRole('button', { name: 'Sort by Symbol' }));
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('ZINC');
    expect(onSortingChange).toHaveBeenCalled();
  });

  it('supports multiple controlled selection without mutating the controlled value', async () => {
    const onSelectionChange = vi.fn();
    render(<DataGrid aria-label="Multiple" data={data} columns={columns} selectionMode="multiple" selection={['1']} onSelectionChange={onSelectionChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Deselect row 1' }));
    expect(onSelectionChange).toHaveBeenCalledWith([], { reason: 'selection', rowId: '1' });
    expect(screen.getByRole('button', { name: 'Deselect row 1' })).toBeInTheDocument();
  });

  it('supports single uncontrolled selection and deselection', async () => {
    render(<DataGrid aria-label="Single" data={data} columns={columns} selectionMode="single" />);
    await userEvent.click(screen.getByRole('button', { name: 'Select row 1' }));
    expect(screen.getByRole('button', { name: 'Deselect row 1' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Deselect row 1' }));
    expect(screen.getByRole('button', { name: 'Select row 1' })).toBeInTheDocument();
  });

  it('renders custom cells, widths, default row ids, and native presentation props', () => {
    const custom: DataGridColumn<Row>[] = [{ id: 'symbol', header: <strong>Symbol</strong>, accessor: 'symbol', width: 180, cell: ({ value, rowIndex, columnId }) => `${columnId}:${rowIndex}:${String(value)}` }, { id: 'quantity', header: 'Quantity', accessor: 'quantity' }];
    render(<DataGrid aria-label="Custom" data={data} columns={custom} className="custom" dir="rtl" lang="ar" />);
    expect(screen.getByRole('grid')).toHaveClass('custom');
    expect(screen.getByRole('grid')).toHaveAttribute('dir', 'rtl');
    expect(screen.getByText('symbol:0:ZINC')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Sort/ })).not.toBeInTheDocument();
  });

  it('uses custom row identifiers in selection callbacks', async () => {
    const onSelectionChange = vi.fn();
    render(<DataGrid aria-label="Ids" data={data} columns={columns} getRowId={(row) => `trade-${row.id}`} selectionMode="multiple" defaultSelection={['trade-1']} onSelectionChange={onSelectionChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Select row trade-2' }));
    expect(onSelectionChange).toHaveBeenCalledWith(['trade-1', 'trade-2'], { reason: 'selection', rowId: 'trade-2' });
  });

  it('separates default and custom terminal states', () => {
    const { rerender } = render(<DataGrid aria-label="Loading" data={[]} columns={columns} loading />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    rerender(<DataGrid aria-label="Error" data={[]} columns={columns} error="failed" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Unable to load data');
    rerender(<DataGrid aria-label="Empty" data={[]} columns={columns} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
    rerender(<DataGrid aria-label="Custom loading" data={[]} columns={columns} loading loadingState="Wait" />);
    expect(screen.getByText('Wait')).toBeInTheDocument();
  });

  it('retains rows and busy semantics while refreshing', () => {
    render(<DataGrid aria-label="Refresh" data={data} columns={columns} refreshing />);
    expect(screen.getByRole('grid')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Refreshing');
  });

  it('bounds a thousand-row render with TanStack Virtual', () => {
    const many = Array.from({ length: 1000 }, (_, index) => ({ id: String(index), symbol: `S${index}`, quantity: index }));
    render(<DataGrid aria-label="Virtual" data={many} columns={columns} height={120} rowHeight={30} overscan={1} />);
    expect(screen.getAllByRole('row').length).toBeLessThan(20);
    expect(screen.getByRole('grid')).toHaveAttribute('aria-rowcount', '1001');
  });
});
