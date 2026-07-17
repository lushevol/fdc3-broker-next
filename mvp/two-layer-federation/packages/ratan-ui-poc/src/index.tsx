import type { CashflowRecord } from '@fm/ratan-sdk-poc';
import { Button, StatusBadge, type StatusTone } from '@fm/ratan-design-poc';

export interface CashflowTableProps {
  rows: CashflowRecord[];
  selectedId: string | null;
  onSelect(record: CashflowRecord): void;
}

const amountFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function CashflowTable({ rows, selectedId, onSelect }: CashflowTableProps) {
  return (
    <div className="ratan-table-frame">
      <table className="ratan-table" aria-label="Cashflow records">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Counterparty</th>
            <th scope="col">Currency</th>
            <th scope="col">Amount</th>
            <th scope="col">Status</th>
            <th scope="col"><span className="visually-hidden">Action</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="ratan-table-empty">No cashflows match this filter.</td>
            </tr>
          ) : (
            rows.map((record) => (
              <tr key={record.id} aria-selected={selectedId === record.id}>
                <th scope="row">{record.id}</th>
                <td>{record.counterparty}</td>
                <td>{record.currency}</td>
                <td className={record.amount < 0 ? 'amount-negative' : undefined}>
                  {amountFormatter.format(record.amount)}
                </td>
                <td><StatusBadge status={record.status.toLowerCase() as StatusTone}>{record.status}</StatusBadge></td>
                <td>
                  <Button variant="ghost" className="row-action" onClick={() => onSelect(record)}>
                    Select <span className="visually-hidden">{record.id}</span>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export type { CashflowRecord } from '@fm/ratan-sdk-poc';
