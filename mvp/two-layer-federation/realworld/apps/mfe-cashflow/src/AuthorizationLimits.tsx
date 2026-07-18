import { useEffect, useMemo, useState } from 'react';
import type { PlatformClient } from '@fm/platform-sdk';
import { RatanDataGrid, type RatanDataGridColumn } from '@fm/ratan-data-grid';
import { Button, InlineAlert, StatusBadge, TextField, type StatusTone } from '@fm/ratan-design';
import { AuthorizationLimitEditor } from './AuthorizationLimitEditor';
import {
  AuthorizationLimitTransitionDialog,
  authorizationLimitTransitionPresentation,
  type AuthorizationLimitTransitionAction,
} from './AuthorizationLimitTransitionDialog';
import {
  createAuthorizationLimitsPolicy,
  type AuthorizationLimitsPrincipal,
} from './authorization-limits-policy';
import {
  authorizationLimitsRepository,
  formatUsdLimit,
  type AuthorizationLimitRecord,
  type AuthorizationLimitsRepository,
} from './authorization-limits-repository';
import type { AuthorizationLimitsService } from './authorization-limits-service';

export interface AuthorizationLimitsMutationCapability {
  readonly principal: AuthorizationLimitsPrincipal;
  readonly service: AuthorizationLimitsService;
}

interface Props {
  readonly basePath: string;
  readonly path: string;
  readonly client: PlatformClient;
  readonly repository?: AuthorizationLimitsRepository;
  readonly mutation?: AuthorizationLimitsMutationCapability;
}

type EditorState =
  | { readonly mode: 'create' }
  | { readonly mode: 'edit'; readonly record: AuthorizationLimitRecord };

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

export function AuthorizationLimits({
  basePath,
  path,
  client,
  repository = authorizationLimitsRepository,
  mutation,
}: Props) {
  const route = `${basePath}/authorization-limits`;
  const detailPrefix = `${route}/details/`;
  const detailId = path.startsWith(detailPrefix) ? decodeURIComponent(path.slice(detailPrefix.length)) : null;
  const [attempt, setAttempt] = useState(0);
  const [rows, setRows] = useState<readonly AuthorizationLimitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [transition, setTransition] = useState<{
    readonly action: AuthorizationLimitTransitionAction;
    readonly record: AuthorizationLimitRecord;
  } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const policy = useMemo(
    () => mutation ? createAuthorizationLimitsPolicy(mutation.principal) : null,
    [mutation],
  );

  useEffect(() => {
    setEditor(null);
    setTransition(null);
  }, [mutation]);

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
  const submitEditor = async (profile: string, limitation: number) => {
    if (!mutation || !editor) throw new Error('Mutation capability is unavailable.');
    if (editor.mode === 'create') {
      const created = await mutation.service.create({ profile, currency: 'USD', limitation });
      setRows((current) => [...current, created]);
      setFeedback('Authorization Limit created.');
      return;
    }
    const updated = await mutation.service.edit({
      profile: editor.record.profile,
      currency: editor.record.currency,
      limitation,
      expectedVersion: editor.record.version,
    });
    setRows((current) => current.map((record) =>
      record.limitationId === updated.limitationId ? updated : record));
    setFeedback('Authorization Limit updated.');
  };
  const editorDialog = editor ? (
    <AuthorizationLimitEditor
      key={`${editor.mode}-${editor.mode === 'edit' ? editor.record.limitationId : 'new'}`}
      mode={editor.mode}
      record={editor.mode === 'edit' ? editor.record : undefined}
      onSubmit={submitEditor}
      onClose={() => setEditor(null)}
    />
  ) : null;
  const executeTransition = async () => {
    if (!mutation || !transition) throw new Error('Mutation capability is unavailable.');
    const { action, record } = transition;
    const key = {
      profile: record.profile,
      currency: record.currency,
      expectedVersion: record.version,
    } as const;
    if (action === 'delete') {
      await mutation.service.remove(key);
    } else {
      const command = { ...key, status: record.status as Exclude<typeof record.status, 'CONFIRMED'> };
      if (action.startsWith('approve-')) await mutation.service.confirm(command);
      else await mutation.service.reject(command);
    }
    setRows(await mutation.service.list());
    setFeedback(authorizationLimitTransitionPresentation[action].success);
  };
  const transitionDialog = transition ? (
    <AuthorizationLimitTransitionDialog
      key={`${transition.action}-${transition.record.limitationId}`}
      action={transition.action}
      record={transition.record}
      onExecute={executeTransition}
      onClose={() => setTransition(null)}
    />
  ) : null;
  const localFeedback = feedback
    ? <InlineAlert tone="success" message={feedback} />
    : null;

  if (detailId) {
    return <section className="authorization-limits authorization-limit-details">
      <Button variant="ghost" onClick={() => client.navigate(route)}>Back to Authorization Limits</Button>
      {localFeedback}
      {loading ? <p role="status">Loading Authorization Limit…</p> : detail ? <>
        <header><div><span className="section-label">Authorization Limit</span><h2>{detail.limitationId}</h2></div><StatusBadge status={statusTone(detail.status)}>{detail.status.replace('_', ' ')}</StatusBadge></header>
        <dl className="details-grid">
          <div><dt>Profile</dt><dd>{detail.profile}</dd></div><div><dt>Currency</dt><dd>{detail.currency}</dd></div>
          <div><dt>Limitation</dt><dd>{formatUsdLimit(detail.limitation)}</dd></div><div><dt>Status</dt><dd>{detail.status}</dd></div>
          <div><dt>Version</dt><dd>{detail.version}</dd></div><div><dt>Updated</dt><dd>{detail.updatedAt}</dd></div>
          <div><dt>Created by</dt><dd>{detail.createdBy}</dd></div><div><dt>Updated by</dt><dd>{detail.updatedBy}</dd></div>
        </dl>
        <div className="authorization-limit-actions">
          {policy?.actionsFor(detail).map((action) => action === 'edit' ? (
            <Button key={action} onClick={() => setEditor({ mode: 'edit', record: detail })}>
              Edit Authorization Limit
            </Button>
          ) : action !== 'create' ? (
            <Button
              key={action}
              variant={authorizationLimitTransitionPresentation[action].tone === 'danger' ? 'danger' : 'secondary'}
              onClick={() => setTransition({ action, record: detail })}
            >
              {authorizationLimitTransitionPresentation[action].trigger}
            </Button>
          ) : null)}
        </div>
        <p className="migration-note">{mutation
          ? 'Opt-in mutation composition. Runtime activation awaits an approved authenticated service adapter.'
          : 'Read-only migration cohort. Create, edit, delete, approve, and reject remain in the legacy workflow.'}</p>
      </> : <p role="alert">Authorization Limit record was not found.</p>}
      {editorDialog}
      {transitionDialog}
    </section>;
  }

  return <section className="authorization-limits">
    <header className="authorization-limits-header"><div><span className="section-label">Migration cohort 1</span><h2>Authorization Limits</h2><p>{mutation ? 'Opt-in mutation composition · production activation remains gated' : 'Read-only list and details · mutations remain in legacy'}</p></div><div className="authorization-limits-summary"><strong>{filtered.length} limits</strong>{policy?.create.allowed ? <Button onClick={() => setEditor({ mode: 'create' })}>Create Authorization Limit</Button> : null}</div></header>
    {localFeedback}
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
    {editorDialog}
    {transitionDialog}
  </section>;
}
