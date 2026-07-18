import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  type ApplicationManifest,
  type ApplicationProps,
} from '@fm/platform-contracts';
import { createPlatformClient } from '@fm/platform-sdk';
import {
  Button,
  DesignSystemProvider,
  StatusBadge,
  TextField,
  type StatusTone,
} from '@fm/ratan-design';
import './styles.css';
import { AuthorizationLimits } from './AuthorizationLimits';

export const manifest: ApplicationManifest = {
  id: 'cashflow',
  displayName: 'Cashflow',
  contractVersion: APPLICATION_CONTRACT_VERSION,
  appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
  designSystemVersion: '1.0.0',
};

export interface CashflowRecord {
  readonly id: string;
  readonly currency: string;
  readonly amount: number;
  readonly counterparty: string;
  readonly status: 'Ready' | 'Review' | 'Blocked';
}

export const records: readonly CashflowRecord[] = [
  { id: 'CF-1001', currency: 'USD', amount: 1250000, counterparty: 'Atlas Bank', status: 'Ready' },
  { id: 'CF-1002', currency: 'EUR', amount: -420000, counterparty: 'Northstar AM', status: 'Review' },
  { id: 'CF-1003', currency: 'USD', amount: 275000, counterparty: 'Summit Capital', status: 'Ready' },
  { id: 'CF-1004', currency: 'GBP', amount: 890000, counterparty: 'Meridian Securities', status: 'Blocked' },
];

const formatNumber = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function filterRecords(query: string): readonly CashflowRecord[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return records;
  return records.filter((record) =>
    [record.id, record.currency, record.counterparty, record.status]
      .some((value) => value.toLowerCase().includes(normalized)),
  );
}

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
  const detailPrefix = `${basePath}/details/`;
  const detailId = path.startsWith(detailPrefix)
    ? decodeURIComponent(path.slice(detailPrefix.length))
    : null;
  const detail = detailId ? records.find((record) => record.id === detailId) : undefined;
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filtered = useMemo(() => filterRecords(query), [query]);
  const selected = records.find((record) => record.id === selectedId);

  useEffect(() => {
    if (detail) client.track('cashflow.details.opened', { id: detail.id });
  }, [client, detail]);

  const isAuthorizationLimits = path === `${basePath}/authorization-limits`
    || path.startsWith(`${basePath}/authorization-limits/`);

  return (
    <DesignSystemProvider
      appearance={{
        scheme: appearance.scheme,
        density: appearance.density,
        direction: appearance.direction,
      }}
      scope="application"
    >
      {isAuthorizationLimits ? (
        <article className="cashflow-app" data-instance-id={instanceId}>
          <Button variant="ghost" onClick={() => client.navigate(basePath)}>Back to Cashflow</Button>
          <AuthorizationLimits basePath={basePath} path={path} client={client} />
        </article>
      ) : detailId ? (
        <article className="cashflow-app cashflow-details" data-instance-id={instanceId}>
          <Button variant="ghost" onClick={() => client.navigate(basePath)}>
            Back to cashflows
          </Button>
          {detail ? (
            <>
              <header className="details-heading">
                <div><span className="section-label">Cashflow record</span><h2>{detail.id}</h2></div>
                <StatusBadge status={detail.status.toLowerCase() as StatusTone}>{detail.status}</StatusBadge>
              </header>
              <dl className="details-grid">
                <div><dt>Counterparty</dt><dd>{detail.counterparty}</dd></div>
                <div><dt>Currency</dt><dd>{detail.currency}</dd></div>
                <div><dt>Amount</dt><dd>{formatNumber.format(detail.amount)}</dd></div>
                <div><dt>Instance</dt><dd>{instanceId}</dd></div>
              </dl>
              <Button
                aria-label={`Notify host about ${detail.id}`}
                onClick={() => client.notify(`Cashflow ${detail.id} selected`)}
              >
                Notify portal host
              </Button>
            </>
          ) : <p role="alert">Cashflow record was not found.</p>}
        </article>
      ) : (
        <article className="cashflow-app" data-instance-id={instanceId}>
          <header className="cashflow-header">
            <div><span className="section-label">Ratan operations</span><h2>Cashflow blotter</h2></div>
            <div className="cashflow-header-actions"><Button variant="secondary" onClick={() => client.navigate(`${basePath}/authorization-limits`)}>Authorization Limits</Button><strong>{filtered.length} records</strong></div>
          </header>
          <TextField
            id={`${instanceId}-filter`}
            label="Filter cashflows"
            type="search"
            value={query}
            onChange={setQuery}
          />
          <div className="cashflow-table-frame">
            <table>
              <thead><tr><th scope="col">ID</th><th scope="col">Counterparty</th><th scope="col">Currency</th><th scope="col">Amount</th><th scope="col">Status</th></tr></thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id} aria-selected={record.id === selectedId}>
                    <th scope="row">
                      <button aria-label={`Select ${record.id}`} onClick={() => {
                        setSelectedId(record.id);
                        client.track('cashflow.selected', { id: record.id });
                      }}>{record.id}</button>
                    </th>
                    <td>{record.counterparty}</td><td>{record.currency}</td>
                    <td>{formatNumber.format(record.amount)}</td>
                    <td><StatusBadge status={record.status.toLowerCase() as StatusTone}>{record.status}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selected ? (
            <footer className="selection-bar">
              <strong>Selected {selected.id}</strong>
              <Button
                aria-label={`View ${selected.id} details`}
                onClick={() => client.navigate(`${basePath}/details/${encodeURIComponent(selected.id)}`)}
              >View details</Button>
            </footer>
          ) : null}
        </article>
      )}
    </DesignSystemProvider>
  );
}

export default { manifest, Application };
