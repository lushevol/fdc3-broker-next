import { getAgentApi } from 'ratan-fdc3-agent';
import { createDeclarationBackedFdc3ActionProvider } from './action-provider';

type IntentResolution = {
  getResult(): Promise<unknown>;
};

type Fdc3ContextObject = Record<string, unknown> & { type: string };

type AgentApiLike = {
  raiseIntent(
    intent: string,
    context: Fdc3ContextObject,
    app?: unknown,
  ): Promise<IntentResolution>;
};

type Fdc3ExecutionTile = {
  appId: string;
  instanceId: string;
};

export type Fdc3ActionContinuationSuccess = {
  status: 'ok';
  intent: string;
  context: Fdc3ContextObject;
  totalCount: number;
  summary: string;
  trades: unknown[];
  tile?: Fdc3ExecutionTile;
};

export type Fdc3ActionContinuationError = {
  status: 'error';
  intent: string;
  message: string;
};

export type Fdc3ActionContinuationResult =
  | Fdc3ActionContinuationSuccess
  | Fdc3ActionContinuationError;

type Fdc3ActionExecuteOptions = {
  continuationPayload?: boolean;
};

export type Fdc3ActionExecutor = {
  execute(input: { actionId: string }, options?: Fdc3ActionExecuteOptions): Promise<unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeTile(value: unknown): Fdc3ExecutionTile | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  if (typeof value.appId !== 'string' || typeof value.instanceId !== 'string') {
    return undefined;
  }

  return { appId: value.appId, instanceId: value.instanceId };
}

function normalizeSuccessPayload(input: {
  intent: string;
  context: Fdc3ContextObject;
  result: unknown;
}): Fdc3ActionContinuationSuccess {
  const result = isRecord(input.result) ? input.result : {};
  const tile = normalizeTile(result.tile);

  return {
    status: 'ok',
    intent: input.intent,
    context: input.context,
    totalCount: Number(result.totalCount ?? 0),
    summary: String(result.summary ?? ''),
    trades: Array.isArray(result.trades) ? result.trades.slice(0, 10) : [],
    ...(tile ? { tile } : {}),
  };
}

function normalizeErrorPayload(
  intent: string,
  error: unknown,
): Fdc3ActionContinuationError {
  return {
    status: 'error',
    intent,
    message: error instanceof Error ? error.message : 'Unknown FDC3 execution error',
  };
}

export function createFdc3ActionExecutor(deps: {
  getAgentApi?: () => AgentApiLike;
} = {}): Fdc3ActionExecutor {
  const provider = createDeclarationBackedFdc3ActionProvider();
  const getFdc3Api = deps.getAgentApi ?? getAgentApi;

  return {
    async execute(input, options) {
      const action = await provider.resolveAction(input.actionId);
      if (!action) {
        const error = new Error(`Unknown FDC3 action: ${input.actionId}`);
        if (options?.continuationPayload) {
          return normalizeErrorPayload('unknown', error);
        }
        throw error;
      }

      try {
        const api = getFdc3Api();

        // @ts-expect-error
        const resolution = await api.raiseIntent(action.intent, action.defaultContext);
        const result = await resolution.getResult();

        if (options?.continuationPayload) {
          if (result && isRecord(result) && result.status === 'error') {
            return normalizeErrorPayload(
              action.intent,
              String(result.message ?? 'FDC3 execution error'),
            );
          }

          return normalizeSuccessPayload({
            intent: action.intent,
            // @ts-expect-error
            context: action.defaultContext,
            result,
          });
        }

        return result;
      } catch (error) {
        if (options?.continuationPayload) {
          return normalizeErrorPayload(action.intent, error);
        }

        throw error;
      }
    },
  };
}
