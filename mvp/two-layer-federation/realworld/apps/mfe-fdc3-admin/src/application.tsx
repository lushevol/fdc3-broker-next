import '@webcomponents/scoped-custom-element-registry';
import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationManifest,
  type ApplicationProps,
} from '@fm/platform-contracts';
import { createPlatformClient } from '@fm/platform-sdk';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import './styles.css';
import {
  ScAlert,
  ScBadge,
  ScButton,
  ScCard,
  ScDialog,
  ScIconButton,
  ScMenu,
  ScMenuItem,
  ScTab,
  ScTabGroup,
  ScTabPanel,
  ScTextInput,
} from './webkit';

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
    <ScCard className="fdc3-catalog-card">
      <header className="fdc3-card-header">
        <div><h2>{title}</h2><p>Deterministic master data for declaration validation.</p></div>
        <ScButton type="primary" role="button" onClick={openNew}>Create {kind}</ScButton>
      </header>
      {rows.length === 0 ? <section className="fdc3-empty-state"><h3>{`No ${kind}s`}</h3><p>Create the first catalog entry.</p></section> : (
        <div className="fdc3-table-frame">
          <table>
            <thead><tr><th scope="col">{kind === 'intent' ? 'Intent name' : 'Context type'}</th><th scope="col">Description</th><th scope="col">Actions</th></tr></thead>
            <tbody>{rows.map((row) => {
              const value = getValue(row);
              return <tr key={value}><th scope="row">{value}</th><td>{row.description}</td><td className="fdc3-actions"><ScIconButton name="edit" role="button" aria-label={`Edit ${value}`} onClick={() => openEdit(row)} /><ScIconButton name="trash--line" role="button" aria-label={`Delete ${value}`} onClick={() => setRemoving(value)} /></td></tr>;
            })}</tbody>
          </table>
        </div>
      )}
      {editing !== null ? <ScDialog
        open
        label={editing ? `Edit ${kind}` : `Create ${kind}`}
        role="dialog"
        aria-label={editing ? `Edit ${kind}` : `Create ${kind}`}
        onScHide={() => setEditing(null)}
      >
        <ScIconButton slot="header-actions" name="cross" role="button" aria-label={`Close ${editing ? `Edit ${kind}` : `Create ${kind}`}`} onClick={() => setEditing(null)} />
        <ScTextInput id={`${kind}-name`} label={kind === 'intent' ? 'Intent name' : 'Context type'} role="textbox" aria-label={kind === 'intent' ? 'Intent name' : 'Context type'} value={name} onScInput={(event: CustomEvent<{ value: string }>) => setName(event.detail.value)} disabled={Boolean(editing)} required helpText={editing ? 'The catalog key cannot change after declarations reference it.' : 'Use a unique FDC3 identifier.'} />
        <ScTextInput id={`${kind}-description`} label="Description" role="textbox" aria-label="Description" value={description} onScInput={(event: CustomEvent<{ value: string }>) => setDescription(event.detail.value)} multiline rows={3} />
        <div slot="footer" className="dialog-actions"><ScButton type="tertiary" role="button" onClick={() => setEditing(null)}>Cancel</ScButton><ScButton type="primary" role="button" onClick={save} disabled={!name.trim()}>{editing ? 'Save changes' : `Create ${kind}`}</ScButton></div>
      </ScDialog> : null}
      {removing !== null ? <ScDialog
        open
        label={`Delete ${kind}`}
        role="dialog"
        aria-label={`Delete ${kind}`}
        onScHide={() => setRemoving(null)}
      >
        <p>{removeReferences.length ? `${removing} is used by ${removeReferences.join(', ')}. Delete it anyway?` : `Delete ${removing}?`}</p>
        <div slot="footer" className="dialog-actions"><ScButton type="tertiary" role="button" onClick={() => setRemoving(null)}>Cancel</ScButton><ScButton type="secondary" state="error" role="button" onClick={() => { onDelete(removing); setRemoving(null); }}>Delete</ScButton></div>
      </ScDialog> : null}
    </ScCard>
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
  const [appMenuOpen, setAppMenuOpen] = useState(false);

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
        <ScCard><h3>Declarations</h3><strong>{declarations.length}</strong></ScCard>
        <ScCard><h3>Intents</h3><strong>{intents.length}</strong></ScCard>
        <ScCard><h3>Contexts</h3><strong>{contexts.length}</strong></ScCard>
        <ScCard><h3>Identity</h3><ScBadge type="text" color={identity?.state === 'authenticated' ? 'green' : 'grey'} label={identity?.state ?? 'anonymous'} aria-label={identity?.state ?? 'anonymous'} /></ScCard>
      </div>
      <div className="fdc3-toolbar"><ScTextInput id="fdc3-search" label="Search FDC3" role="searchbox" aria-label="Search FDC3" value={search} onScInput={(event: CustomEvent<{ value: string }>) => setSearch(event.detail.value)} type="search" /><ScButton type="primary" role="button" onClick={() => openEditor()}>Create declaration</ScButton></div>
      <ScCard className="fdc3-declarations-card">
        <header className="fdc3-card-header"><div><h2>Application declarations</h2><p>A searchable master-detail declaration registry.</p></div></header>
        {filtered.length === 0 ? <section className="fdc3-empty-state"><h3>No matching declarations</h3><p>Change the search or create a declaration.</p></section> : <div className="fdc3-table-frame"><table><thead><tr><th scope="col">Application</th><th scope="col">Listens</th><th scope="col">Raises</th><th scope="col">Contexts</th><th scope="col">Actions</th></tr></thead><tbody>{filtered.map((declaration) => <tr key={declaration.appId}><th scope="row">{declaration.appId}</th><td>{declaration.listensFor.length}</td><td>{declaration.raises.length}</td><td>{declaration.contexts.join(', ') || '—'}</td><td className="fdc3-actions"><ScIconButton name="edit" role="button" aria-label={`Edit declaration ${declaration.appId}`} onClick={() => openEditor(declaration)} /><ScIconButton name="trash--line" role="button" aria-label={`Delete declaration ${declaration.appId}`} onClick={() => setRemoving(declaration.appId)} /></td></tr>)}</tbody></table></div>}
      </ScCard>
    </section>
  );

  return <div className="fdc3-webkit-scope" data-scheme={appearance.scheme} data-density={appearance.density} dir={appearance.direction}>
    <article className="fdc3-app" data-instance-id={instanceId}>
      <header className="fdc3-header"><div><span>Component verification / FDC3</span><h1>Interop declarations</h1></div><ScButton type="secondary" role="button" onClick={() => client.notify('FDC3 adapter simulation ready')}>Test adapter</ScButton></header>
      <ScTabGroup aria-label="FDC3 administration">
        <ScTab slot="nav" panel="declarations" active aria-label="Declarations">Declarations</ScTab>
        <ScTab slot="nav" panel="intents" aria-label="Intent catalog">Intent catalog</ScTab>
        <ScTab slot="nav" panel="contexts" aria-label="Context catalog">Context catalog</ScTab>
        <ScTabPanel name="declarations" active>{declarationsPanel}</ScTabPanel>
        <ScTabPanel name="intents"><MasterList title="FDC3 intents" kind="intent" rows={intents} onSave={upsertIntent} onDelete={(name) => setIntents((current) => current.filter((value) => value.name !== name))} references={(name) => references('intent', name)} /></ScTabPanel>
        <ScTabPanel name="contexts"><MasterList title="FDC3 contexts" kind="context" rows={contexts} onSave={upsertContext} onDelete={(name) => setContexts((current) => current.filter((value) => value.type !== name))} references={(name) => references('context', name)} /></ScTabPanel>
      </ScTabGroup>
      {editing !== undefined ? <ScDialog open label={editing ? `Edit ${editing.appId}` : 'Create declaration'} role="dialog" aria-label={editing ? `Edit ${editing.appId}` : 'Create declaration'} onScHide={() => setEditing(undefined)}>
        <ScIconButton slot="header-actions" name="cross" role="button" aria-label={`Close ${editing ? `Edit ${editing.appId}` : 'Create declaration'}`} onClick={() => setEditing(undefined)} />
        <div className="fdc3-application-picker">
          <span>Application</span>
          <ScButton type="secondary" role="button" aria-label="Application" disabled={Boolean(editing)} onClick={() => setAppMenuOpen((open) => !open)}>{appOptions.find((option) => option.id === appId)?.label ?? 'Choose application'}</ScButton>
          {appMenuOpen ? <ScMenu aria-label="Applications">{appOptions.map((option) => <ScMenuItem key={option.id} role="menuitem" aria-label={option.label} onClick={() => { setAppId(option.id); setAppMenuOpen(false); }}>{option.label}</ScMenuItem>)}</ScMenu> : null}
          <small>Choose the tile that owns this declaration.</small>
        </div>
        <ScTextInput id="declaration-interop" label="Interop JSON" role="textbox" aria-label="Interop JSON" value={interop} onScInput={(event: CustomEvent<{ value: string }>) => setInterop(event.detail.value)} multiline rows={16} error={Boolean(interopError)} errorMessage={interopError ?? ''} helpText={interopError ? '' : 'Edit the FDC3 intent and context contract.'} />
        {interopError ? <ScAlert role="alert" type="error" title="Interop JSON is invalid">{interopError}</ScAlert> : null}
        <div slot="footer" className="dialog-actions"><ScButton type="tertiary" role="button" onClick={() => setEditing(undefined)}>Cancel</ScButton><ScButton type="primary" role="button" onClick={saveDeclaration} disabled={!appId}>Save declaration</ScButton></div>
      </ScDialog> : null}
      {removing !== null ? <ScDialog open label="Delete declaration" role="dialog" aria-label="Delete declaration" onScHide={() => setRemoving(null)}>
        <p>{`Delete the ${removing} declaration? This operation only changes the local verification fixture.`}</p>
        <div slot="footer" className="dialog-actions"><ScButton type="tertiary" role="button" onClick={() => setRemoving(null)}>Cancel</ScButton><ScButton type="secondary" state="error" role="button" onClick={() => { setDeclarations((current) => current.filter((value) => value.appId !== removing)); setRemoving(null); }}>Delete</ScButton></div>
      </ScDialog> : null}
    </article>
  </div>;
}

export { formatInterop, parseInterop };
export default { manifest, Application };
