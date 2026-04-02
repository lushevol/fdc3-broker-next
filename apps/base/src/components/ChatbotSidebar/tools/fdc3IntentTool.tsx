import type { AppIdentifier, Context } from '@finos/fdc3';
import type { ToolCallMessagePartProps } from '@assistant-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import contextDeclarations from '../../../fdc3/declarations/contexts.json';
import appDeclarations from '../../../fdc3/declarations/fdc3-definitions.json';
import intentDeclarations from '../../../fdc3/declarations/intents.json';
import type { AssistantRegisteredToolkit } from './toolRouting';
import type { AssistantToolArgs } from './toolRouting';

interface ContextDeclaration {
  schema?: {
    properties?: {
      type?: {
        const?: string;
      };
    };
  };
  simples?: Context[];
  description?: string;
}

interface AppIntentDeclaration {
  intent: string;
  contexts?: string[];
}

interface AppDeclaration {
  appId: string;
  interop?: {
    intents?: {
      listensFor?: AppIntentDeclaration[];
    };
  };
}

interface IntentDeclaration {
  name: string;
  description?: string;
}

export interface Fdc3IntentToolArgs {
  matchedIntent: string;
  targetAppId: string;
  targetContexts: string[];
  payload: Context;
  canProcess: boolean;
  sourcePrompt: string;
  blockedReason?: string;
}

export interface Fdc3IntentToolResult {
  outcome: 'success' | 'error';
  summary: string;
  matchedIntent: string;
  targetAppId: string;
  targetInstanceId?: string;
  payload: Context;
  error?: string;
}

interface Fdc3IntentToolkitDependencies {
  openTile: (args: { tile: string }) => Promise<{
    workspaceId: string;
    opened: boolean;
    newTile: boolean;
    failedReason: string;
  }>;
  waitForIntentListener: (args: { appId: string; intent: string }) => Promise<void>;
  raiseIntent: (intent: string, context: Context, target: AppIdentifier) => Promise<unknown>;
}

type BrowserFdc3Agent = {
  raiseIntent: (intent: string, context: Context, target: AppIdentifier) => Promise<unknown>;
};

function getBrowserFdc3Agent(): BrowserFdc3Agent {
  const brokerInstance = (
    window as Window & {
      __RATAN_FDC3__?: {
        brokerInstance?: BrowserFdc3Agent;
      };
    }
  ).__RATAN_FDC3__?.brokerInstance;

  if (!brokerInstance) {
    throw new Error('FDC3 broker is not initialized in the browser.');
  }

  return brokerInstance;
}

function getBrowserBrokerRuntime() {
  return (
    window as Window & {
      __RATAN_FDC3__?: {
        brokerInstance?: BrowserFdc3Agent & {
          tileRegistry?: {
            getAllTiles: () => Array<{
              appId?: string;
              intentListeners?: Set<string>;
            }>;
          };
        };
      };
    }
  ).__RATAN_FDC3__?.brokerInstance;
}

async function waitForBrowserIntentListener(args: {
  appId: string;
  intent: string;
}): Promise<void> {
  const timeoutMs = 10000;
  const pollMs = 100;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const tiles = getBrowserBrokerRuntime()?.tileRegistry?.getAllTiles?.() ?? [];
    const hasMatchingListener = tiles.some(
      (tile: { appId?: string; intentListeners?: Set<string> }) =>
        tile.appId === args.appId && tile.intentListeners?.has(args.intent),
    );

    if (hasMatchingListener) {
      return;
    }

    await new Promise((resolve) => {
      window.setTimeout(resolve, pollMs);
    });
  }

  throw new Error(`Timed out waiting for ${args.appId} to register ${args.intent}.`);
}

const typedContextDeclarations = contextDeclarations as ContextDeclaration[];
const typedAppDeclarations = appDeclarations as AppDeclaration[];
const typedIntentDeclarations = intentDeclarations as IntentDeclaration[];

const fdc3IntentToolParameters = z.object({
  matchedIntent: z.string(),
  targetAppId: z.string(),
  targetContexts: z.array(z.string()),
  payload: z.object({
    type: z.string(),
    id: z.object({
      ticker: z.string(),
    }),
    name: z.string().optional(),
  }),
  canProcess: z.boolean(),
  sourcePrompt: z.string(),
  blockedReason: z.string().optional(),
});

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ');
}

function humanizeIntentName(intentName: string): string {
  return intentName
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim()
    .toLowerCase();
}

function cloneContextTemplate(template: Context | undefined): Context | null {
  if (!template) {
    return null;
  }

  return JSON.parse(JSON.stringify(template)) as Context;
}

function getDeclaredContextType(declaration: ContextDeclaration): string | null {
  const simpleType = declaration.simples?.[0]?.type;
  if (typeof simpleType === 'string' && simpleType.length > 0) {
    return simpleType;
  }

  const schemaType = declaration.schema?.properties?.type?.const;
  return typeof schemaType === 'string' && schemaType.length > 0 ? schemaType : null;
}

function hasRequiredIdentifierValue(context: Context): boolean {
  if (!('id' in context) || typeof context.id !== 'object' || context.id === null) {
    return false;
  }

  return Object.values(context.id as Record<string, unknown>).every(
    (value) => typeof value === 'string' && value.trim().length > 0,
  );
}

function resolveDeclarationBackedMatch(input: string): Fdc3IntentToolArgs | null {
  const normalizedInput = normalizeText(input);
  const declaredIntentNames = new Set(typedIntentDeclarations.map((intent) => intent.name));

  const matchingDeclaration = typedAppDeclarations.find((app) =>
    (app.interop?.intents?.listensFor ?? []).some((listener) => {
      const normalizedIntentName = normalizeText(humanizeIntentName(listener.intent));
      const intentIsDeclared =
        declaredIntentNames.has(listener.intent) ||
        typedIntentDeclarations.length === 0 ||
        listener.intent === 'ViewChart';

      return intentIsDeclared && normalizedInput.includes(normalizedIntentName);
    }),
  );

  if (!matchingDeclaration) {
    return null;
  }

  const matchingListener = (matchingDeclaration.interop?.intents?.listensFor ?? []).find(
    (listener) => normalizedInput.includes(normalizeText(humanizeIntentName(listener.intent))),
  );

  if (!matchingListener) {
    return null;
  }

  const contextType = matchingListener.contexts?.[0];
  if (!contextType) {
    return null;
  }

  const contextDeclaration = typedContextDeclarations.find(
    (declaration) => getDeclaredContextType(declaration) === contextType,
  );

  const payload = cloneContextTemplate(contextDeclaration?.simples?.[0]);
  if (!payload) {
    return null;
  }

  const canProcess = hasRequiredIdentifierValue(payload);

  return {
    matchedIntent: matchingListener.intent,
    targetAppId: matchingDeclaration.appId,
    targetContexts: matchingListener.contexts ?? [],
    payload,
    canProcess,
    sourcePrompt: input,
    ...(canProcess
      ? {}
      : {
          blockedReason: 'Missing required payload identifiers in declarations.',
        }),
  };
}

async function processMatchedIntent(
  args: Fdc3IntentToolArgs,
  dependencies: Fdc3IntentToolkitDependencies,
): Promise<Fdc3IntentToolResult> {
  const openStatus = await dependencies.openTile({
    tile: args.targetAppId,
  });

  if (!openStatus.opened) {
    throw new Error(openStatus.failedReason || 'Failed to open target tile.');
  }

  if (openStatus.workspaceId) {
    await dependencies.waitForIntentListener({
      appId: args.targetAppId,
      intent: args.matchedIntent,
    });
  }

  const target: AppIdentifier = {
    appId: args.targetAppId,
  };

  await dependencies.raiseIntent(args.matchedIntent, args.payload, target);

  return {
    outcome: 'success',
    summary: `Raised ${args.matchedIntent} to ${args.targetAppId}.`,
    matchedIntent: args.matchedIntent,
    targetAppId: args.targetAppId,
    targetInstanceId: openStatus.workspaceId,
    payload: args.payload,
  };
}

function getCardPalette(tone: 'pending' | 'success' | 'error'): React.CSSProperties {
  if (tone === 'success') {
    return {
      borderColor: '#2e7d32',
      backgroundColor: '#edf7ed',
      color: '#1b5e20',
    };
  }

  if (tone === 'error') {
    return {
      borderColor: '#c62828',
      backgroundColor: '#ffebee',
      color: '#7f0000',
    };
  }

  return {
    borderColor: '#1565c0',
    backgroundColor: '#eff6ff',
    color: '#0d47a1',
  };
}

export function Fdc3IntentToolUi({
  args,
  result,
  status,
  addResult,
}: ToolCallMessagePartProps<Fdc3IntentToolArgs, Fdc3IntentToolResult>): JSX.Element {
  const [pending, setPending] = useState(false);
  const [optimisticResult, setOptimisticResult] = useState<Fdc3IntentToolResult | null>(
    result ?? null,
  );

  useEffect(() => {
    setOptimisticResult(result ?? null);
    setPending(false);
  }, [result]);

  const resolvedResult = result ?? optimisticResult;
  const tone: 'pending' | 'success' | 'error' = resolvedResult
    ? resolvedResult.outcome === 'success'
      ? 'success'
      : 'error'
    : 'pending';

  const palette = getCardPalette(tone);

  const handleProcessIntent = async () => {
    if (!args.canProcess || pending || resolvedResult) {
      return;
    }

    setPending(true);

    try {
      const nextResult = await processMatchedIntent(args, {
        openTile: async ({ tile }) => {
          const toolArgs = args as Fdc3IntentToolArgs & {
            __dependencies?: Fdc3IntentToolkitDependencies;
          };
          return toolArgs.__dependencies!.openTile({ tile });
        },
        waitForIntentListener: async ({ appId, intent }) => {
          const toolArgs = args as Fdc3IntentToolArgs & {
            __dependencies?: Fdc3IntentToolkitDependencies;
          };
          return toolArgs.__dependencies!.waitForIntentListener({ appId, intent });
        },
        raiseIntent: async (intent, context, target) => {
          const toolArgs = args as Fdc3IntentToolArgs & {
            __dependencies?: Fdc3IntentToolkitDependencies;
          };
          return toolArgs.__dependencies!.raiseIntent(intent, context, target);
        },
      });

      setOptimisticResult(nextResult);
      addResult(nextResult);
    } catch (error) {
      const failure: Fdc3IntentToolResult = {
        outcome: 'error',
        summary: `Failed to raise ${args.matchedIntent}.`,
        matchedIntent: args.matchedIntent,
        targetAppId: args.targetAppId,
        payload: args.payload,
        error: error instanceof Error ? error.message : 'Unknown intent processing error.',
      };
      setOptimisticResult(failure);
      addResult(failure);
    } finally {
      setPending(false);
    }
  };

  const payloadJson = useMemo(() => JSON.stringify(args.payload, null, 2), [args.payload]);

  return (
    <div
      style={{
        marginTop: '0.75rem',
        border: '1px solid',
        borderRadius: '14px',
        padding: '1rem',
        ...palette,
      }}
    >
      <div style={{ fontWeight: 700 }}>FDC3 Intent Match</div>
      <div style={{ marginTop: '0.375rem', fontSize: '0.95rem' }}>
        Intent: <strong>{args.matchedIntent}</strong>
      </div>
      <div style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
        Target Tile: {args.targetAppId}
      </div>
      <div style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
        Context Types: {args.targetContexts.join(', ')}
      </div>
      <pre
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem',
          borderRadius: '10px',
          backgroundColor: '#0f172a',
          color: '#e2e8f0',
          fontSize: '0.8rem',
          overflowX: 'auto',
        }}
      >
        {payloadJson}
      </pre>
      {!resolvedResult ? (
        <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
          {args.canProcess
            ? 'The intent is matched from declarations and ready to be processed.'
            : args.blockedReason}
        </div>
      ) : null}
      {resolvedResult ? (
        <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
          {resolvedResult.summary}
          {resolvedResult.error ? ` ${resolvedResult.error}` : ''}
        </div>
      ) : null}
      {(status.type === 'requires-action' || !resolvedResult) && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={() => {
              void handleProcessIntent();
            }}
            disabled={!args.canProcess || pending || !!resolvedResult}
            style={{
              border: 'none',
              borderRadius: '999px',
              padding: '0.55rem 0.95rem',
              backgroundColor: '#1565c0',
              color: '#ffffff',
              cursor: !args.canProcess || pending || !!resolvedResult ? 'not-allowed' : 'pointer',
              opacity: !args.canProcess || pending || !!resolvedResult ? 0.6 : 1,
              fontWeight: 600,
            }}
          >
            {pending ? 'Processing...' : 'Process Intent'}
          </button>
        </div>
      )}
    </div>
  );
}

export function createFdc3IntentToolkit(
  dependencies: Fdc3IntentToolkitDependencies,
): AssistantRegisteredToolkit {
  return {
    process_fdc3_intent: {
      type: 'frontend',
      description:
        'Match a user request to a declaration-backed FDC3 intent and let the user process it from an inline card.',
      parameters: fdc3IntentToolParameters,
      humanInTheLoop: true,
      execute: async (args) => {
        const typedArgs = args as Fdc3IntentToolArgs;
        return {
          outcome: 'success',
          summary: `Intent ${typedArgs.matchedIntent} is ready for user processing.`,
          matchedIntent: typedArgs.matchedIntent,
          targetAppId: typedArgs.targetAppId,
          payload: typedArgs.payload,
        } satisfies Fdc3IntentToolResult;
      },
      render: (props) => (
        <Fdc3IntentToolUi
          {...props}
          args={{
            ...props.args,
            __dependencies: dependencies,
          }}
        />
      ),
      matchPriority: 100,
      matchPrompt: (input) => resolveDeclarationBackedMatch(input) as AssistantToolArgs | null,
    },
  };
}

export function createBrowserFdc3IntentToolkit(
  openTile: Fdc3IntentToolkitDependencies['openTile'],
  getFdc3Agent: () => BrowserFdc3Agent = getBrowserFdc3Agent,
  waitForIntentListener: Fdc3IntentToolkitDependencies['waitForIntentListener'] = waitForBrowserIntentListener,
): AssistantRegisteredToolkit {
  return createFdc3IntentToolkit({
    openTile,
    waitForIntentListener,
    raiseIntent: async (intent, context, target) => {
      await getFdc3Agent().raiseIntent(intent, context, target);
    },
  });
}
