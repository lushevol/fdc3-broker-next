import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationManifest,
  type ApplicationProps,
} from '@fm/platform-contracts';
import { createPlatformClient } from '@fm/platform-sdk';
import {
  Button,
  Card,
  ConfirmationDialog,
  DesignSystemProvider,
  Dialog,
  EmptyState,
  IconButton,
  InlineAlert,
  Select,
  StatusBadge,
  Tabs,
  TextArea,
  TextField,
} from '@fm/ratan-design';
import '@fm/ratan-design/styles.css';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import './styles.css';

export const manifest: ApplicationManifest = {
  id: 'fdc3-admin',
  displayName: 'FDC3 Admin',
  contractVersion: APPLICATION_CONTRACT_VERSION,
  appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
  identityContractVersion: IDENTITY_CONTRACT_VERSION,
  designSystemVersion: '1.1.0',
};

export interface IntentDefinition {
  readonly name: string;
  readonly description: string;
}

export interface ContextDefinition {
  readonly type: string;
  readonly description: string;
}

export interface Declaration {
  readonly appId: string;
  readonly listensFor: readonly string[];
  readonly raises: readonly string[];
  readonly contexts: readonly string[];
}

export const defaultIntents: readonly IntentDefinition[] = [
  { name: 'ViewInstrument', description: 'Display an instrument in the target application.' },
  { name: 'ViewContact', description: 'Display a client or trading contact.' },
  { name: 'StartChat', description: 'Start an operational collaboration.' },
];

export const defaultContexts: readonly ContextDefinition[] = [
  { type: 'fdc3.instrument', description: 'A financial instrument.' },
  { type: 'fdc3.contact', description: 'A business contact.' },
  { type: 'fdc3.chat.init', description: 'Conversation bootstrap details.' },
];

export const defaultDeclarations: readonly Declaration[] = [
  {
    appId: 'cashflow',
    listensFor: ['ViewInstrument'],
    raises: ['ViewContact'],
    contexts: ['fdc3.instrument', 'fdc3.contact'],
  },
  {
    appId: 'identity-profile',
    listensFor: ['ViewContact'],
    raises: [],
    contexts: ['fdc3.contact'],
  },
];

const unsubscribeIdentity = () => undefined;

function formatInterop(declaration: Declaration) {
  return JSON.stringify({
    intents: {
      listensFor: declaration.listensFor.map((intent) => ({
        intent,
        contexts: declaration.contexts,
      })),
      raises: declaration.raises.map((intent) => ({
        intent,
        contexts: declaration.contexts,
      })),
    },
  }, null, 2);
}

function parseInterop(value: string): Pick<Declaration, 'listensFor' | 'raises' | 'contexts'> {
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Interop JSON must be an object.');
  }
  const intents = (parsed as { intents?: unknown }).intents;
  if (!intents || typeof intents !== 'object' || Array.isArray(intents)) {
    throw new Error('Interop JSON must contain an intents object.');
  }
  const getEntries = (key: 'listensFor' | 'raises') => {
    const valueForKey = (intents as Record<string, unknown>)[key];
    if (!Array.isArray(valueForKey)) throw new Error(`intents.${key} must be an array.`);
    return valueForKey.map((entry) => {
      if (!entry || typeof entry !== 'object' || typeof (entry as { intent?: unknown }).intent !== 'string') {
        throw new Error(`Each intents.${key} entry requires an intent name.`);
      }
      return entry as { intent: string; contexts?: unknown };
    });
  };
  const listensFor = getEntries('listensFor');
  const raises = getEntries('raises');
  const contexts = new Set<string>();
  [...listensFor, ...raises].forEach((entry) => {
    if (entry.contexts !== undefined && !Array.isArray(entry.contexts)) {
      throw new Error('Intent contexts must be an array.');
    }
    entry.contexts?.forEach((context) => {
      if (typeof context !== 'string') throw new Error('Context names must be strings.');
      contexts.add(context);
    });
  });
  return {
    listensFor: listensFor.map((entry) => entry.intent),
    raises: raises.map((entry) => entry.intent),
    contexts: [...contexts],
  };
}

interface MasterListProps {
  readonly title: string;
  readonly kind: 'intent' | 'context';
  readonly rows: readonly IntentDefinition[] | readonly ContextDefinition[];
  readonly onSave: (name: string, description: string) => void;
  readonly onDelete: (name: string) => void;
  readonly references: (name: string) => readonly string[];
}

function MasterList({
  title,
  kind,
  rows,
  onSave,
  onDelete,
  references,
}: MasterListProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);
  const getValue = (row: IntentDefinition | ContextDefinition) =>
    kind === 'intent' ? (row as IntentDefinition).name : (row as ContextDefinition).type;
  const openNew = () => { setEditing(''); setName(''); setDescription(''); };
  const openEdit = (row: IntentDefinition | ContextDefinition) => {
    const value = getValue(row);
    setEditing(value);
    setName(value);
    setDescription(row.description);
  };
  const save = () => {
    if (!name.trim()) return;
    onSave(name.trim(), description.trim());
    setEditing(null);
  };
  const removeReferences = removing ? references(removing) : [];
  return (
    <Card
      title={title}
      description="Deterministic master data for declaration validation."
      actions={<Button onClick={openNew}>Create {kind}</Button>}
    >
      {rows.length === 0 ? <EmptyState title={`No ${kind}s`} description="Create the first catalog entry." /> : (
        <div className="fdc3-table-frame">
          <table>
            <thead><tr><th scope="col">{kind === 'intent' ? 'Intent name' : 'Context type'}</th><th scope="col">Description</th><th scope="col">Actions</th></tr></thead>
            <tbody>{rows.map((row) => {
              const value = getValue(row);
              return <tr key={value}><th scope="row">{value}</th><td>{row.description}</td><td className="fdc3-actions"><IconButton label={`Edit ${value}`} icon="✎" variant="ghost" onClick={() => openEdit(row)} /><IconButton label={`Delete ${value}`} icon="×" variant="danger" onClick={() => setRemoving(value)} /></td></tr>;
            })}</tbody>
          </table>
        </div>
      )}
      <Dialog
        open={editing !== null}
        title={editing ? `Edit ${kind}` : `Create ${kind}`}
        onClose={() => setEditing(null)}
        actions={<><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} disabled={!name.trim()}>{editing ? 'Save changes' : `Create ${kind}`}</Button></>}
      >
        <TextField id={`${kind}-name`} label={kind === 'intent' ? 'Intent name' : 'Context type'} value={name} onChange={setName} disabled={Boolean(editing)} required helperText={editing ? 'The catalog key cannot change after declarations reference it.' : 'Use a unique FDC3 identifier.'} />
        <TextArea id={`${kind}-description`} label="Description" value={description} onChange={setDescription} rows={3} />
      </Dialog>
      <ConfirmationDialog
        open={removing !== null}
        title={`Delete ${kind}`}
        message={removeReferences.length ? `${removing} is used by ${removeReferences.join(', ')}. Delete it anyway?` : `Delete ${removing}?`}
        confirmLabel="Delete"
        tone="danger"
        onCancel={() => setRemoving(null)}
        onConfirm={() => { if (removing) onDelete(removing); setRemoving(null); }}
      />
    </Card>
  );
}

export function Application({ instanceId, capabilities }: ApplicationProps) {
  const client = useMemo(() => createPlatformClient(capabilities), [capabilities]);
  const appearance = useSyncExternalStore(client.subscribeToAppearance, client.getAppearance, client.getAppearance);
  const subscribeToIdentity = useCallback((listener: () => void) => client.subscribeToIdentity(listener) ?? unsubscribeIdentity, [client]);
  const getIdentity = useCallback(() => client.getIdentity(), [client]);
  const identity = useSyncExternalStore(subscribeToIdentity, getIdentity, getIdentity);
  const [intents, setIntents] = useState<readonly IntentDefinition[]>(defaultIntents);
  const [contexts, setContexts] = useState<readonly ContextDefinition[]>(defaultContexts);
  const [declarations, setDeclarations] = useState<readonly Declaration[]>(defaultDeclarations);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Declaration | null | undefined>(undefined);
  const [appId, setAppId] = useState('');
  const [interop, setInterop] = useState(formatInterop({ appId: '', listensFor: [], raises: [], contexts: [] }));
  const [interopError, setInteropError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const appOptions = [
    { id: 'cashflow', label: 'Cashflow' },
    { id: 'identity-profile', label: 'Identity & Profile' },
    { id: 'fdc3-admin', label: 'FDC3 Admin' },
  ];
  const filtered = declarations.filter((declaration) => [declaration.appId, ...declaration.listensFor, ...declaration.raises, ...declaration.contexts].join(' ').toLowerCase().includes(search.toLowerCase()));
  const references = (kind: 'intent' | 'context', value: string) => declarations.filter((declaration) => kind === 'intent' ? [...declaration.listensFor, ...declaration.raises].includes(value) : declaration.contexts.includes(value)).map((declaration) => declaration.appId);
  const openEditor = (declaration?: Declaration) => {
    setEditing(declaration ?? null);
    setAppId(declaration?.appId ?? '');
    setInterop(formatInterop(declaration ?? { appId: '', listensFor: [], raises: [], contexts: [] }));
    setInteropError(null);
  };
  const saveDeclaration = () => {
    if (!appId) return;
    try {
      const parsed = parseInterop(interop);
      const next = { appId, ...parsed };
      setDeclarations((current) => editing ? current.map((value) => value.appId === editing.appId ? next : value) : [...current, next]);
      setEditing(undefined);
      client.notify(`FDC3 declaration for ${appId} saved`);
    } catch (error) {
      setInteropError(error instanceof Error ? error.message : 'Interop JSON is invalid.');
    }
  };
  const upsertIntent = (name: string, description: string) => setIntents((current) => {
    const found = current.some((value) => value.name === name);
    return found ? current.map((value) => value.name === name ? { name, description } : value) : [...current, { name, description }];
  });
  const upsertContext = (type: string, description: string) => setContexts((current) => {
    const found = current.some((value) => value.type === type);
    return found ? current.map((value) => value.type === type ? { type, description } : value) : [...current, { type, description }];
  });

  const declarationsPanel = (
    <section className="fdc3-panel">
      <div className="fdc3-summary">
        <Card title="Declarations"><strong>{declarations.length}</strong></Card>
        <Card title="Intents"><strong>{intents.length}</strong></Card>
        <Card title="Contexts"><strong>{contexts.length}</strong></Card>
        <Card title="Identity"><StatusBadge status={identity?.state === 'authenticated' ? 'ready' : 'neutral'}>{identity?.state ?? 'anonymous'}</StatusBadge></Card>
      </div>
      <div className="fdc3-toolbar"><TextField id="fdc3-search" label="Search FDC3" value={search} onChange={setSearch} type="search" /><Button onClick={() => openEditor()}>Create declaration</Button></div>
      <Card title="Application declarations" description="A searchable master-detail declaration registry.">
        {filtered.length === 0 ? <EmptyState title="No matching declarations" description="Change the search or create a declaration." /> : <div className="fdc3-table-frame"><table><thead><tr><th scope="col">Application</th><th scope="col">Listens</th><th scope="col">Raises</th><th scope="col">Contexts</th><th scope="col">Actions</th></tr></thead><tbody>{filtered.map((declaration) => <tr key={declaration.appId}><th scope="row">{declaration.appId}</th><td>{declaration.listensFor.length}</td><td>{declaration.raises.length}</td><td>{declaration.contexts.join(', ') || '—'}</td><td className="fdc3-actions"><IconButton label={`Edit declaration ${declaration.appId}`} icon="✎" variant="ghost" onClick={() => openEditor(declaration)} /><IconButton label={`Delete declaration ${declaration.appId}`} icon="×" variant="danger" onClick={() => setRemoving(declaration.appId)} /></td></tr>)}</tbody></table></div>}
      </Card>
    </section>
  );

  return <DesignSystemProvider appearance={{ scheme: appearance.scheme, density: appearance.density, direction: appearance.direction }} scope="application">
    <article className="fdc3-app" data-instance-id={instanceId}>
      <header className="fdc3-header"><div><span>Component verification / FDC3</span><h1>Interop declarations</h1></div><Button variant="secondary" onClick={() => client.notify('FDC3 adapter simulation ready')}>Test adapter</Button></header>
      <Tabs ariaLabel="FDC3 administration" tabs={[
        { id: 'declarations', label: 'Declarations', content: declarationsPanel },
        { id: 'intents', label: 'Intent catalog', content: <MasterList title="FDC3 intents" kind="intent" rows={intents} onSave={upsertIntent} onDelete={(name) => setIntents((current) => current.filter((value) => value.name !== name))} references={(name) => references('intent', name)} /> },
        { id: 'contexts', label: 'Context catalog', content: <MasterList title="FDC3 contexts" kind="context" rows={contexts} onSave={upsertContext} onDelete={(name) => setContexts((current) => current.filter((value) => value.type !== name))} references={(name) => references('context', name)} /> },
      ]} />
      <Dialog open={editing !== undefined} title={editing ? `Edit ${editing.appId}` : 'Create declaration'} width="large" onClose={() => setEditing(undefined)} actions={<><Button variant="secondary" onClick={() => setEditing(undefined)}>Cancel</Button><Button onClick={saveDeclaration} disabled={!appId}>Save declaration</Button></>}>
        <Select id="declaration-app" label="Application" options={appOptions} selectedId={appId || undefined} onChange={setAppId} disabled={Boolean(editing)} required helperText="Choose the tile that owns this declaration." />
        <TextArea id="declaration-interop" label="Interop JSON" value={interop} onChange={setInterop} rows={16} error={Boolean(interopError)} helperText={interopError ?? 'Edit the FDC3 intent and context contract.'} />
        {interopError ? <InlineAlert tone="error" title="Interop JSON is invalid" message={interopError} /> : null}
      </Dialog>
      <ConfirmationDialog open={removing !== null} title="Delete declaration" message={`Delete the ${removing} declaration? This operation only changes the local verification fixture.`} confirmLabel="Delete" tone="danger" onCancel={() => setRemoving(null)} onConfirm={() => { if (removing) setDeclarations((current) => current.filter((value) => value.appId !== removing)); setRemoving(null); }} />
    </article>
  </DesignSystemProvider>;
}

export { formatInterop, parseInterop };
export default { manifest, Application };
