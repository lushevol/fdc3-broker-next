import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationManifest,
  type ApplicationProps,
} from '@fm/platform-contracts';
import { RatanDataGrid, type RatanDataGridColumn } from '@fm/ratan-data-grid';
import '@fm/ratan-data-grid/styles.css';
import { createPlatformClient } from '@fm/platform-sdk';
import {
  Button,
  DesignSystemProvider,
  StatusBadge,
  TextField,
  type StatusTone,
} from '@fm/ratan-design';
import '@fm/ratan-design/styles.css';
import { useMemo, useState, useSyncExternalStore } from 'react';
import './styles.css';

export const manifest: ApplicationManifest = {
  id: 'cashflow-blotter',
  displayName: 'Cashflow Blotter MVP',
  contractVersion: APPLICATION_CONTRACT_VERSION,
  appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
  identityContractVersion: IDENTITY_CONTRACT_VERSION,
  designSystemVersion: '1.1.0',
};

export interface CashflowRecord {
  readonly id: string;
  readonly counterparty: string;
  readonly currency: string;
  readonly amount: number;
  readonly status: 'Ready' | 'Review' | 'Blocked';
}

export const cashflows: readonly CashflowRecord[] = [
  {
    id: 'CF-24001',
    counterparty: 'Atlas Bank',
    currency: 'USD',
    amount: 1250000,
    status: 'Ready',
  },
  {
    id: 'CF-24002',
    counterparty: 'Northstar AM',
    currency: 'EUR',
    amount: -420000,
    status: 'Review',
  },
  {
    id: 'CF-24003',
    counterparty: 'Summit Capital',
    currency: 'USD',
    amount: 275000,
    status: 'Ready',
  },
  {
    id: 'CF-24004',
    counterparty: 'Meridian Securities',
    currency: 'GBP',
    amount: 890000,
    status: 'Blocked',
  },
];

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function cashflowStatusTone(status: CashflowRecord['status']): StatusTone {
  if (status === 'Ready') return 'ready';
  if (status === 'Blocked') return 'blocked';
  return 'review';
}

export const cashflowColumns: readonly RatanDataGridColumn<CashflowRecord>[] = [
  { key: 'id', header: 'Cashflow ID', width: 150 },
  { key: 'counterparty', header: 'Counterparty', flex: 1, minWidth: 210 },
  { key: 'currency', header: 'Currency', width: 120 },
  {
    key: 'amount',
    header: 'Amount',
    width: 180,
    formatValue: (value) => numberFormatter.format(Number(value)),
  },
  {
    key: 'status',
    header: 'Status',
    width: 150,
    renderCell: (row) => (
      <StatusBadge status={cashflowStatusTone(row.status)}>{row.status}</StatusBadge>
    ),
  },
];

export function filterCashflows(query: string): readonly CashflowRecord[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return cashflows;
  return cashflows.filter((record) =>
    [record.id, record.counterparty, record.currency, record.status].some((value) =>
      value.toLocaleLowerCase().includes(normalized),
    ),
  );
}

export function Application({ instanceId, capabilities }: ApplicationProps) {
  const client = useMemo(() => createPlatformClient(capabilities), [capabilities]);
  const appearance = useSyncExternalStore(
    client.subscribeToAppearance,
    client.getAppearance,
    client.getAppearance,
  );
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const rows = useMemo(() => filterCashflows(query), [query]);
  const selected = cashflows.find((record) => record.id === selectedId);

  const select = (record: CashflowRecord) => {
    setSelectedId(record.id);
    client.track('cashflow-blotter.selected', { id: record.id });
  };

  return (
    <DesignSystemProvider
      appearance={{
        scheme: appearance.scheme,
        density: appearance.density,
        direction: appearance.direction,
      }}
      scope="application"
    >
      <article className="cashflow-blotter-app" data-instance-id={instanceId}>
        <header className="cashflow-blotter-header">
          <div>
            <span className="cashflow-kicker">Two-layer migration proof</span>
            <h1>Cashflow blotter</h1>
            <p>Direct host composition with package-owned Ratan UI and grid behavior.</p>
          </div>
          <StatusBadge status="ready">Container runtime removed</StatusBadge>
        </header>
        <TextField
          id={`${instanceId}-filter`}
          label="Filter cashflows"
          type="search"
          value={query}
          onChange={setQuery}
        />
        <RatanDataGrid
          ariaLabel="Cashflow blotter"
          rows={rows}
          columns={cashflowColumns}
          getRowId={(row) => row.id}
          selectedRowId={selectedId}
          onSelectionChange={select}
          onActivate={select}
          pageSize={5}
          emptyMessage="No cashflows match the current filter."
        />
        {selected ? (
          <footer className="cashflow-selection">
            <strong>Selected {selected.id}</strong>
            <Button
              aria-label={`Notify host about ${selected.id}`}
              onClick={() => client.notify(`Cashflow ${selected.id} selected.`)}
            >
              Notify host
            </Button>
          </footer>
        ) : null}
      </article>
    </DesignSystemProvider>
  );
}

export default { manifest, Application };
