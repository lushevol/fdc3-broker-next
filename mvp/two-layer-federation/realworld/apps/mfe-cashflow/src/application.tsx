import '@webcomponents/scoped-custom-element-registry';
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationManifest,
  type ApplicationProps,
} from '@fm/platform-contracts';
import { createPlatformClient } from '@fm/platform-sdk';
import '@fm/ratan-data-grid/styles.css';
import './styles.css';
import { ScBadge, ScButton, ScTextInput } from './webkit';
import { AuthorizationLimits } from './AuthorizationLimits';
import { composeAuthorizationLimitsRuntime } from './authorization-limits-runtime';
import type { AuthorizationLimitsService } from './authorization-limits-service';

export const manifest: ApplicationManifest = {
  id: 'cashflow',
  displayName: 'Cashflow',
  contractVersion: APPLICATION_CONTRACT_VERSION,
  appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
  identityContractVersion: IDENTITY_CONTRACT_VERSION,
  designSystemVersion: '1.1.0',
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

export interface CashflowRuntimeDependencies {
  readonly authorizationLimitsService?: AuthorizationLimitsService;
}

const unsubscribeIdentity = () => undefined;

const statusColor = (status: CashflowRecord['status']) => ({
  Ready: 'green',
  Review: 'orange',
  Blocked: 'red',
})[status];

export function createCashflowApplication(dependencies: CashflowRuntimeDependencies = {}) {
  const runtimeDependencies = Object.freeze({ ...dependencies });

  function CashflowApplication({ instanceId, basePath, capabilities }: ApplicationProps) {
    const client = useMemo(() => createPlatformClient(capabilities), [capabilities]);
    const appearance = useSyncExternalStore(
      client.subscribeToAppearance,
      client.getAppearance,
      client.getAppearance,
    );
    const subscribeToIdentity = useCallback(
      (listener: () => void) => client.subscribeToIdentity(listener) ?? unsubscribeIdentity,
      [client],
    );
    const getIdentity = useCallback(() => client.getIdentity(), [client]);
    const identity = useSyncExternalStore(subscribeToIdentity, getIdentity, getIdentity);
    const authorizationLimitsRuntime = useMemo(
      () => composeAuthorizationLimitsRuntime(identity, runtimeDependencies.authorizationLimitsService),
      [identity],
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
    <div
      className="cashflow-webkit-scope"
      data-scheme={appearance.scheme}
      data-density={appearance.density}
      dir={appearance.direction}
    >
      {isAuthorizationLimits ? (
        <article className="cashflow-app" data-instance-id={instanceId}>
          <ScButton type="tertiary" role="button" onClick={() => client.navigate(basePath)}>Back to Cashflow</ScButton>
          <AuthorizationLimits
            basePath={basePath}
            path={path}
            client={client}
            repository={authorizationLimitsRuntime.repository}
            mutation={authorizationLimitsRuntime.mutation}
          />
        </article>
      ) : detailId ? (
        <article className="cashflow-app cashflow-details" data-instance-id={instanceId}>
          <ScButton type="tertiary" role="button" onClick={() => client.navigate(basePath)}>
            Back to cashflows
          </ScButton>
          {detail ? (
            <>
              <header className="details-heading">
                <div><span className="section-label">Cashflow record</span><h2>{detail.id}</h2></div>
                <ScBadge type="text" color={statusColor(detail.status)} label={detail.status} aria-label={detail.status} />
              </header>
              <dl className="details-grid">
                <div><dt>Counterparty</dt><dd>{detail.counterparty}</dd></div>
                <div><dt>Currency</dt><dd>{detail.currency}</dd></div>
                <div><dt>Amount</dt><dd>{formatNumber.format(detail.amount)}</dd></div>
                <div><dt>Instance</dt><dd>{instanceId}</dd></div>
              </dl>
              <ScButton
                type="primary"
                role="button"
                aria-label={`Notify host about ${detail.id}`}
                onClick={() => client.notify(`Cashflow ${detail.id} selected`)}
              >
                Notify portal host
              </ScButton>
            </>
          ) : <p role="alert">Cashflow record was not found.</p>}
        </article>
      ) : (
        <article className="cashflow-app" data-instance-id={instanceId}>
          <header className="cashflow-header">
            <div><span className="section-label">Ratan operations</span><h2>Cashflow blotter</h2></div>
            <div className="cashflow-header-actions"><ScButton type="secondary" role="button" onClick={() => client.navigate(`${basePath}/authorization-limits`)}>Authorization Limits</ScButton><strong>{filtered.length} records</strong></div>
          </header>
          <ScTextInput
            id={`${instanceId}-filter`}
            label="Filter cashflows"
            type="search"
            role="searchbox"
            aria-label="Filter cashflows"
            value={query}
            onScInput={(event: CustomEvent<{ value: string }>) => setQuery(event.detail.value)}
          />
          <div className="cashflow-table-frame">
            <table>
              <thead><tr><th scope="col">ID</th><th scope="col">Counterparty</th><th scope="col">Currency</th><th scope="col">Amount</th><th scope="col">Status</th></tr></thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id} aria-selected={record.id === selectedId}>
                    <th scope="row">
                      <ScButton type="tertiary" role="button" aria-label={`Select ${record.id}`} onClick={() => {
                        setSelectedId(record.id);
                        client.track('cashflow.selected', { id: record.id });
                      }}>{record.id}</ScButton>
                    </th>
                    <td>{record.counterparty}</td><td>{record.currency}</td>
                    <td>{formatNumber.format(record.amount)}</td>
                    <td><ScBadge type="text" color={statusColor(record.status)} label={record.status} aria-label={record.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selected ? (
            <footer className="selection-bar">
              <strong>Selected {selected.id}</strong>
              <ScButton
                type="primary"
                role="button"
                aria-label={`View ${selected.id} details`}
                onClick={() => client.navigate(`${basePath}/details/${encodeURIComponent(selected.id)}`)}
              >View details</ScButton>
            </footer>
          ) : null}
        </article>
      )}
    </div>
    );
  }

  CashflowApplication.displayName = 'CashflowApplication';
  return CashflowApplication;
}

export const Application = createCashflowApplication();

export interface IsolatedApplicationMountInput extends ApplicationProps {
  readonly root: HTMLElement;
}

const mountedRoots = new Map<string, { container: HTMLDivElement; root: Root }>();

/**
 * Imperative boundary for hosts on a different React major. The component
 * export remains available for same-major hosts; cross-major hosts use this
 * entry point and never exchange React elements. CSS isolation is deliberately
 * out of scope for this initial compatibility boundary.
 */
export function mount({ root, ...props }: IsolatedApplicationMountInput) {
  const existing = mountedRoots.get(props.instanceId);
  existing?.root.unmount();
  existing?.container.remove();
  const container = document.createElement('div');
  root.append(container);
  const applicationRoot = createRoot(container);
  applicationRoot.render(<Application {...props} />);
  mountedRoots.set(props.instanceId, { container, root: applicationRoot });
}

export function unmount(instanceId: string) {
  const mounted = mountedRoots.get(instanceId);
  if (!mounted) return;
  mounted.root.unmount();
  mounted.container.remove();
  mountedRoots.delete(instanceId);
}

export default { manifest, Application, mount, unmount };
