import { useEffect, useMemo, useState } from 'react';
import type { PlatformClient } from '@fm/platform-sdk';
import { RatanDataGrid, type RatanDataGridColumn } from '@fm/ratan-data-grid';
import { Button, StatusBadge, TextField, type StatusTone } from '@fm/ratan-design';
import {
  authorizationLimitsRepository,
  formatUsdLimit,
  type AuthorizationLimitRecord,
  type AuthorizationLimitsRepository,
} from './authorization-limits-repository';

interface Props {
  readonly basePath: string;
  readonly path: string;
  readonly client: PlatformClient;
  readonly repository?: AuthorizationLimitsRepository;
}

function statusTone(status: AuthorizationLimitRecord['status']): StatusTone {
  if (status === 'CONFIRMED') return 'ready';
  if (status === 'DELETE_PENDING') return 'blocked';
  return 'review';
}

export const authorizationLimitColumns: readonly RatanDataGridColumn<AuthorizationLimitRecord>[] = [
  { key: 'profile', header: 'Profile', flex: 1, minWidth: 190 },
  { key: 'currency', header: 'Currency', width: 120 },
  { key: 'limitation', header: 'Limitation', width: 180, formatValue: (value) => formatUsdLimit(Number(value)) },
  { key: 'status', header: 'Status', width: 170, renderCell: (row) => <StatusBadge status={statusTone(row.status)}>{row.status.replace('_', ' ')}</StatusBadge> },
];

export function AuthorizationLimits({ basePath, path, client, repository = authorizationLimitsRepository }: Props) {
  const route = `${basePath}/authorization-limits`;
  const detailPrefix = `${route}/details/`;
  const detailId = path.startsWith(detailPrefix) ? decodeURIComponent(path.slice(detailPrefix.length)) : null;
  const [attempt, setAttempt] = useState(0);
  const [rows, setRows] = useState<readonly AuthorizationLimitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    repository.list()
      .then((records) => { if (active) setRows(records); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : String(reason)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt, repository]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((record) => [record.limitationId, record.profile, record.currency, record.status]
      .some((value) => value.toLowerCase().includes(normalized)));
  }, [query, rows]);
  const detail = detailId ? rows.find((record) => record.limitationId === detailId) : undefined;

  if (detailId) {
    return <section className="authorization-limits authorization-limit-details">
      <Button variant="ghost" onClick={() => client.navigate(route)}>Back to Authorization Limits</Button>
      {loading ? <p role="status">Loading Authorization Limit…</p> : detail ? <>
        <header><div><span className="section-label">Authorization Limit</span><h2>{detail.limitationId}</h2></div><StatusBadge status={statusTone(detail.status)}>{detail.status.replace('_', ' ')}</StatusBadge></header>
        <dl className="details-grid">
          <div><dt>Profile</dt><dd>{detail.profile}</dd></div><div><dt>Currency</dt><dd>{detail.currency}</dd></div>
          <div><dt>Limitation</dt><dd>{formatUsdLimit(detail.limitation)}</dd></div><div><dt>Status</dt><dd>{detail.status}</dd></div>
          <div><dt>Version</dt><dd>{detail.version}</dd></div><div><dt>Updated</dt><dd>{detail.updatedAt}</dd></div>
          <div><dt>Created by</dt><dd>{detail.createdBy}</dd></div><div><dt>Updated by</dt><dd>{detail.updatedBy}</dd></div>
        </dl>
        <p className="migration-note">Read-only migration cohort. Create, edit, delete, approve, and reject remain in the legacy workflow.</p>
      </> : <p role="alert">Authorization Limit record was not found.</p>}
    </section>;
  }

  return <section className="authorization-limits">
    <header className="authorization-limits-header"><div><span className="section-label">Migration cohort 1</span><h2>Authorization Limits</h2><p>Read-only list and details · mutations remain in legacy</p></div><strong>{filtered.length} limits</strong></header>
    <TextField id="authorization-limits-filter" label="Filter Authorization Limits" type="search" value={query} onChange={setQuery} />
    <RatanDataGrid
      ariaLabel="Authorization Limits"
      rows={filtered}
      columns={authorizationLimitColumns}
      getRowId={(row) => row.limitationId}
      selectedRowId={selectedId}
      onSelectionChange={(row) => setSelectedId(row.limitationId)}
      onActivate={(row) => client.navigate(`${detailPrefix}${encodeURIComponent(row.limitationId)}`)}
      pageSize={5}
      loading={loading}
      error={error}
      onRetry={() => setAttempt((value) => value + 1)}
      emptyMessage="No Authorization Limits match the current filter."
    />
  </section>;
}
