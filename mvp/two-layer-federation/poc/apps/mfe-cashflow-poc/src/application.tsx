import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  type ApplicationManifest,
  type ApplicationProps,
} from '@fm/platform-contracts-poc';
import { createPlatformClient } from '@fm/platform-sdk-poc';
import { filterCashflows, summarizeCashflows, type CashflowRecord } from '@fm/ratan-sdk-poc';
import { CashflowTable } from '@fm/ratan-ui-poc';
import { Button, DesignSystemProvider, StatusBadge, TextField, type StatusTone } from '@fm/ratan-design-poc';
import './styles.css';

export const manifest: ApplicationManifest = {
  id: 'cashflow',
  displayName: 'Cashflow',
  contractVersion: APPLICATION_CONTRACT_VERSION,
  appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
};

const records: CashflowRecord[] = [
  { id: 'CF-1001', currency: 'USD', amount: 1250000, counterparty: 'Atlas Bank', status: 'Ready' },
  { id: 'CF-1002', currency: 'EUR', amount: -420000, counterparty: 'Northstar AM', status: 'Review' },
  { id: 'CF-1003', currency: 'USD', amount: 275000, counterparty: 'Summit Capital', status: 'Ready' },
  { id: 'CF-1004', currency: 'GBP', amount: 890000, counterparty: 'Meridian Securities', status: 'Blocked' },
];

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function useBrowserPath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  return path;
}

export function Application({ instanceId, basePath, capabilities }: ApplicationProps) {
  const client = useMemo(() => createPlatformClient(capabilities), [capabilities]);
  const appearance = useSyncExternalStore(
    client.subscribeToAppearance,
    client.getAppearance,
    client.getAppearance,
  );
  const path = useBrowserPath();
  const detailId = path.startsWith(`${basePath}/details/`)
    ? decodeURIComponent(path.slice(`${basePath}/details/`.length))
    : null;
  const detailRecord = detailId ? records.find((record) => record.id === detailId) : undefined;
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<CashflowRecord | null>(null);
  const filtered = useMemo(() => filterCashflows(records, query), [query]);
  const summary = useMemo(() => summarizeCashflows(filtered), [filtered]);

  useEffect(() => {
    if (detailRecord) client.track('cashflow.details.opened', { id: detailRecord.id });
  }, [client, detailRecord]);

  const content = detailId ? (
      <article className="cashflow-app cashflow-details" data-instance-id={instanceId}>
        <Button variant="ghost" className="back-button" onClick={() => client.navigate(basePath)}>
          ← Back to cashflows
        </Button>
        {detailRecord ? (
          <>
            <div className="details-heading">
              <div>
                <span className="section-label">Cashflow record</span>
                <h2>{detailRecord.id}</h2>
              </div>
              <StatusBadge status={detailRecord.status.toLowerCase() as StatusTone}>{detailRecord.status}</StatusBadge>
            </div>
            <dl className="details-grid">
              <div><dt>Counterparty</dt><dd>{detailRecord.counterparty}</dd></div>
              <div><dt>Currency</dt><dd>{detailRecord.currency}</dd></div>
              <div><dt>Amount</dt><dd>{numberFormatter.format(detailRecord.amount)}</dd></div>
              <div><dt>Application instance</dt><dd>{instanceId}</dd></div>
            </dl>
            <Button
              variant="primary"
              aria-label={`Notify host about ${detailRecord.id}`}
              onClick={() => client.notify(`Cashflow ${detailRecord.id} selected`)}
            >
              Notify portal host
            </Button>
          </>
        ) : (
          <div className="missing-record" role="alert">Cashflow record was not found.</div>
        )}
      </article>
  ) : (
    <article className="cashflow-app" data-instance-id={instanceId}>
      <header className="cashflow-header">
        <div>
          <span className="section-label">Ratan operations</span>
          <h2>Cashflow blotter</h2>
          <p>Direct federated application · {instanceId}</p>
        </div>
        <div className="summary-cards" aria-label="Filtered cashflow summary">
          <div><span>Records</span><strong>{summary.count} records</strong></div>
          <div><span>Net amount</span><strong>{numberFormatter.format(summary.netAmount)}</strong></div>
        </div>
      </header>

      <section className="cashflow-controls">
        <TextField
          id={`${instanceId}-filter`}
          label="Filter cashflows"
          type="search"
          value={query}
          placeholder="Currency, counterparty, status or ID"
          onChange={setQuery}
        />
      </section>

      <CashflowTable
        rows={filtered}
        selectedId={selected?.id ?? null}
        onSelect={(record) => {
          setSelected(record);
          client.track('cashflow.selected', { id: record.id });
        }}
      />

      {selected ? (
        <footer className="selection-bar">
          <div><span>Selected</span><strong>{selected.id}</strong></div>
          <Button
            variant="primary"
            aria-label={`View ${selected.id} details`}
            onClick={() => client.navigate(`${basePath}/details/${encodeURIComponent(selected.id)}`)}
          >
            View details →
          </Button>
        </footer>
      ) : null}
    </article>
  );

  return (
    <DesignSystemProvider
      appearance={{ scheme: appearance.scheme, density: appearance.density, direction: appearance.direction }}
      scope="application"
    >
      {content}
    </DesignSystemProvider>
  );
}

export default { manifest, Application };
