import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createColumnDefinitions, RatanDataGrid, type RatanDataGridColumn } from '../src';

let gridProps: Record<string, unknown> = {};
vi.mock('ag-grid-react', () => ({ AgGridReact: (props: Record<string, unknown>) => { gridProps = props; return <div data-testid="ag-grid" />; } }));

interface Row { id: string; amount: number; status: string }
const rows: Row[] = [{ id: 'one', amount: 12, status: 'Ready' }];
const columns: RatanDataGridColumn<Row>[] = [
  { key: 'id', header: 'ID', flex: 1 },
  { key: 'amount', header: 'Amount', formatValue: (value) => `$${value}` },
  { key: 'status', header: 'Status', renderCell: (row) => <strong>{row.status}</strong> },
];

describe('RatanDataGrid', () => {
  beforeEach(() => { gridProps = {}; });
  it('maps the bounded column model', () => {
    const definitions = createColumnDefinitions(columns);
    expect(definitions.map(({ colId, headerName, sortable }) => ({ colId, headerName, sortable }))).toEqual([
      { colId: 'id', headerName: 'ID', sortable: true },
      { colId: 'amount', headerName: 'Amount', sortable: true },
      { colId: 'status', headerName: 'Status', sortable: true },
    ]);
    expect(definitions[1].valueFormatter?.({ value: 12, data: rows[0] } as never)).toBe('$12');
    expect(definitions[1].valueFormatter?.({ value: 12 } as never)).toBe('');
    expect(definitions[2].cellRenderer?.({ data: rows[0] } as never)).toEqual(<strong>Ready</strong>);
    expect(definitions[2].cellRenderer?.({} as never)).toBeNull();
    expect(definitions[0].valueFormatter).toBeUndefined();
    expect(definitions[0].cellRenderer).toBeUndefined();
  });

  it('renders deterministic infrastructure states and retry', () => {
    const base = { ariaLabel: 'limits', rows, columns, getRowId: (row: Row) => row.id };
    const loading = render(<RatanDataGrid {...base} loading />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading limits');
    loading.rerender(<RatanDataGrid {...base} rows={[]} emptyMessage="Nothing here" />);
    expect(screen.getByRole('status')).toHaveTextContent('Nothing here');
    const retry = vi.fn();
    loading.rerender(<RatanDataGrid {...base} error="Failed" onRetry={retry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry limits' }));
    expect(retry).toHaveBeenCalledOnce();
    loading.rerender(<RatanDataGrid {...base} error="Still failed" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('maps stable identity, selection, pagination, pointer and keyboard activation', () => {
    const select = vi.fn();
    const activate = vi.fn();
    render(<RatanDataGrid ariaLabel="limits" rows={rows} columns={columns} getRowId={(row) => row.id} selectedRowId="one" pageSize={5} onSelectionChange={select} onActivate={activate} />);
    expect(screen.getByRole('region', { name: 'limits' })).toContainElement(screen.getByTestId('ag-grid'));
    expect(gridProps.paginationPageSize).toBe(5);
    expect(gridProps.rowSelection).toEqual({ mode: 'singleRow' });
    expect((gridProps.getRowId as (value: { data: Row }) => string)({ data: rows[0] })).toBe('one');
    expect((gridProps.getRowClass as (value: { data: Row }) => string)({ data: rows[0] })).toBe('ratan-row-selected');
    (gridProps.onRowClicked as (value: { data: Row }) => void)({ data: rows[0] });
    (gridProps.onRowDoubleClicked as (value: { data: Row }) => void)({ data: rows[0] });
    (gridProps.onCellKeyDown as (value: { data: Row; event: KeyboardEvent }) => void)({ data: rows[0], event: new KeyboardEvent('keydown', { key: 'Enter' }) });
    (gridProps.onCellKeyDown as (value: { data: Row; event: KeyboardEvent }) => void)({ data: rows[0], event: new KeyboardEvent('keydown', { key: 'Escape' }) });
    expect(select).toHaveBeenCalledWith(rows[0]);
    expect(activate).toHaveBeenCalledTimes(2);
  });

  it('uses safe defaults when optional selection and activation callbacks are absent', () => {
    render(<RatanDataGrid ariaLabel="limits" rows={rows} columns={columns} getRowId={(row) => row.id} />);
    expect(gridProps.paginationPageSize).toBe(10);
    expect((gridProps.getRowClass as (value: { data?: Row }) => string | undefined)({ data: rows[0] })).toBeUndefined();
    expect(() => (gridProps.onRowClicked as (value: { data?: Row }) => void)({})).not.toThrow();
    expect(() => (gridProps.onRowDoubleClicked as (value: { data?: Row }) => void)({})).not.toThrow();
    expect(() => (gridProps.onCellKeyDown as (value: { data?: Row; event?: KeyboardEvent }) => void)({ data: rows[0] })).not.toThrow();
  });
});
