import type {
  FDC3ContextDefinition,
  FDC3DeclarationData,
  FDC3Interop,
  FDC3IntentDefinition,
} from './interface';

export interface FDC3TileOption {
  tileId?: string;
  appId?: string;
  title?: string;
}

export interface FDC3DeclarationSummary {
  declarations: number;
  intents: number;
  contexts: number;
  emptyDeclarations: number;
}

export interface FDC3IntentContextEntry {
  intent: string;
  contexts: string[];
}

type LegacyInteropMap = Record<string, { contexts?: string[] } | undefined>;

const toEntries = (
  value: FDC3Interop['intents']['listensFor'] | FDC3Interop['intents']['raises'] | undefined,
): FDC3IntentContextEntry[] => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === 'string') {
          return { intent: entry, contexts: [] };
        }

        return {
          intent: entry.intent,
          contexts: entry.contexts ?? [],
        };
      })
      .filter((entry) => !!entry.intent);
  }

  return Object.entries((value ?? {}) as LegacyInteropMap).map(([intent, entry]) => ({
    intent,
    contexts: entry?.contexts ?? [],
  }));
};

export const getContextType = (context: FDC3ContextDefinition): string => {
  const schema = context.schema as {
    type?: string;
    properties?: { type?: { const?: string } };
  };

  return schema.properties?.type?.const ?? schema.type ?? '';
};

export const normalizeInterop = (interop?: Partial<FDC3Interop>): FDC3Interop => ({
  ...interop,
  intents: {
    listensFor: toEntries(interop?.intents?.listensFor),
    raises: toEntries(interop?.intents?.raises),
  },
});

export const getDeclarationSummary = (
  declarations: FDC3DeclarationData[],
  intents: FDC3IntentDefinition[],
  contexts: FDC3ContextDefinition[],
): FDC3DeclarationSummary => ({
  declarations: declarations.length,
  intents: intents.length,
  contexts: contexts.length,
  emptyDeclarations: declarations.filter((declaration) => {
    const interop = normalizeInterop(declaration.interop);

    return interop.intents.listensFor.length === 0 && (interop.intents.raises?.length ?? 0) === 0;
  }).length,
});

export const findTileLabel = (tiles: FDC3TileOption[], appId: string): string => {
  const tile = tiles.find((item) => item.tileId === appId || item.appId === appId);

  return [tile?.title, tile?.tileId ?? tile?.appId].filter(Boolean).join(' - ');
};

export const filterDeclarations = (
  declarations: FDC3DeclarationData[],
  tiles: FDC3TileOption[],
  query: string,
): FDC3DeclarationData[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return declarations;
  }

  return declarations.filter((declaration) => {
    const interop = normalizeInterop(declaration.interop);
    const searchable = [
      declaration.appId,
      findTileLabel(tiles, declaration.appId),
      ...interop.intents.listensFor.flatMap((entry) => [entry.intent, ...entry.contexts]),
      ...(interop.intents.raises ?? []).flatMap((entry) => [entry.intent, ...entry.contexts]),
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
};

export const getReferencedIntentNames = (
  declarations: FDC3DeclarationData[],
  intentName: string,
): string[] =>
  declarations
    .filter((declaration) => {
      const interop = normalizeInterop(declaration.interop);

      return [...interop.intents.listensFor, ...(interop.intents.raises ?? [])].some(
        (entry) => entry.intent === intentName,
      );
    })
    .map((declaration) => declaration.appId);

export const getReferencedContextTypes = (
  declarations: FDC3DeclarationData[],
  contextType: string,
): string[] =>
  declarations
    .filter((declaration) => {
      const interop = normalizeInterop(declaration.interop);

      return [...interop.intents.listensFor, ...(interop.intents.raises ?? [])].some((entry) =>
        entry.contexts.includes(contextType),
      );
    })
    .map((declaration) => declaration.appId);
