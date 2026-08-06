import { DataGrid, type DataGridColumn } from '@fm/ratan-design/data-grid';

interface TradeRow { id: string; symbol: string; quantity: number }

const rows: TradeRow[] = Array.from({ length: 10_000 }, (_, index) => ({
  id: String(index),
  symbol: `SC${String(index).padStart(5, '0')}`,
  quantity: index * 10,
}));

const columns: DataGridColumn<TradeRow>[] = [
  { id: 'symbol', header: 'Symbol', accessor: 'symbol', sortable: true },
  { id: 'quantity', header: 'Quantity', accessor: 'quantity', sortable: true },
];

export function DataGridScenario() {
  return (
    <section aria-labelledby="grid-heading">
      <h2 id="grid-heading">Bounded large-data rendering</h2>
      <DataGrid aria-label="Ten thousand trades" data={rows} columns={columns} height={360} />
    </section>
  );
}
