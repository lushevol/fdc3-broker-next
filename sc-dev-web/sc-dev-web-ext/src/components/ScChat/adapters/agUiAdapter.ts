import {
  AdapterClients,
  AdapterSettings,
  ChatApiAdapter,
  SetupAiModelsResult,
  StreamCallbacks,
  StreamRequest,
} from './types.js';
import { AgentSubscriber, HttpAgent, ResumeEntry } from '@ag-ui/client';
import type { UserMessage } from '@ag-ui/core';

const DEFAULT_AG_UI_API_NAME = 'ag-ui-api';
const DEFAULT_AG_UI_RESOURCE = 'chat';

const EMPTY_SETUP_RESULT: SetupAiModelsResult = {
  aiModels: [],
  aiModelMap: {},
};

const DEFAULT_AG_UI_VERSION = '1.0';

const buildAgUiRequestBody = (input: StreamRequest, settings?: AdapterSettings) => {
  const customMetadata = settings?.metadata || {};
  const resolvedModel = input.model || customMetadata.model || '';
  const hasResolvedModel = typeof resolvedModel === 'string' && resolvedModel.trim().length > 0;

  const requestBody: Record<string, any> = {
    version: DEFAULT_AG_UI_VERSION,
    messages: [
      {
        role: 'user',
        content: input.content,
      },
    ],
    conversationId: input.conversationId,
  };

  if (hasResolvedModel) {
    requestBody.metadata = {
      ...customMetadata,
      model: resolvedModel,
    };
  }

  return requestBody;
};

type RestClientHttpFetchOptions = {
  restClient?: AdapterClients['restClient'];
  apiName: string;
  resource: string;
  normalizeOutgoingBody?: (body: unknown) => string;
  headersToRecord?: (headers?: HeadersInit) => Record<string, string>;
  normalizeIncomingResponse?: (response: Response) => Promise<Response>;
  onSend?: (client: RuntimeAgentRequestClient) => void;
};

const createRestClientHttpFetch = (options: RestClientHttpFetchOptions) => {
  return async (_url: string, requestInit: RequestInit): Promise<Response> => {
    if (!options.restClient?.request) {
      throw new Error('REST client is not available in the current shell context.');
    }

    const abortSignal = requestInit.signal || undefined;
    const outgoingBody = options.normalizeOutgoingBody
      ? options.normalizeOutgoingBody(requestInit.body)
      : typeof requestInit.body === 'string'
      ? requestInit.body
      : requestInit.body === null
      ? undefined
      : String(requestInit.body);

    const response = await options.restClient.request(
      options.apiName,
      options.resource,
      requestInit.method || 'POST',
      outgoingBody,
      options.headersToRecord ? options.headersToRecord(requestInit.headers) : {},
      {},
      {
        onSend: (client: RuntimeAgentRequestClient) => {
          options.onSend?.(client);
          if (!abortSignal) {
            return;
          }

          if (abortSignal.aborted) {
            client?.abort?.();
            return;
          }

          abortSignal.addEventListener(
            'abort',
            () => {
              client?.abort?.();
            },
            { once: true }
          );
        },
      }
    );

    if (!options.normalizeIncomingResponse) {
      return response as Response;
    }

    return options.normalizeIncomingResponse(response as Response);
  };
};

const streamByRestClient = async (
  clients: AdapterClients,
  input: StreamRequest,
  callbacks: StreamCallbacks,
  settings?: AdapterSettings
) => {
  const restClient = clients.restClient;
  if (!restClient?.request) {
    throw new Error('REST client is required for AG-UI streaming');
  }

  const apiName = settings?.agUiApiName || DEFAULT_AG_UI_API_NAME;
  const resource = settings?.agUiResource || DEFAULT_AG_UI_RESOURCE;

  const fetch = createRestClientHttpFetch({
    restClient,
    apiName,
    resource,
    normalizeOutgoingBody: () => JSON.stringify(buildAgUiRequestBody(input, settings)),
    headersToRecord: () => ({
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    }),
    onSend: callbacks.onSend,
  });

  const streamAgent = new HttpAgent({
    url: `/${apiName}/${resource}`,
    threadId: input.conversationId,
    fetch,
  });

  let interrupted = false;
  let completed = false;
  const completeOnce = () => {
    if (!completed) {
      completed = true;
      callbacks.onComplete?.();
    }
  };

  try {
    await streamAgent.runAgent(undefined, {
      onRunStartedEvent: ({ event }) => {
        callbacks.onRunStarted?.({
          conversationId: event.threadId || input.conversationId,
          runId: event.runId,
        });
      },
      onTextMessageContentEvent: ({ event }) => {
        if (event.delta) {
          callbacks.onData(event.delta);
        }
      },
      onStateSnapshotEvent: ({ event }) => {
        const snapshot = event?.snapshot as { pendingInterrupts?: unknown } | undefined;
        const pendingInterrupts = snapshot?.pendingInterrupts;
        if (Array.isArray(pendingInterrupts) && pendingInterrupts.length > 0) {
          interrupted = true;
          callbacks.onInterrupt?.(pendingInterrupts as any[]);
        }
      },
      onCustomEvent: ({ event }) => {
        if (event.name === 'orchestrator.interrupt.widget') {
          callbacks.onInterruptWidget?.(event.value as any);
        }
      },
      onRunFinishedEvent: params => {
        if (params.outcome === 'interrupt') {
          interrupted = true;
          callbacks.onInterrupt?.((params.interrupts || []) as any[]);
        }
        if (interrupted) {
          return;
        }
        completeOnce();
      },
      onRunErrorEvent: ({ event }) => {
        throw new Error(event.message || 'AG-UI run failed');
      },
    });
  } catch (error) {
    callbacks.onDataError?.({
      data: undefined,
      error,
    });
    throw error;
  }
};

export type RuntimeAgentRequestClient = {
  abort?: () => void;
};

export type RuntimeAgentOptions = {
  restClient?: AdapterClients['restClient'];
  agUiApiName?: string;
  agUiResource?: string;
  conversationId: string;
  normalizeOutgoingBody?: (body: unknown) => string;
  runtimeHeadersToRecord?: (headers?: HeadersInit) => Record<string, string>;
  normalizeIncomingResponse?: (response: Response) => Promise<Response>;
  onSend?: (client: RuntimeAgentRequestClient) => void;
};

export const createAgUiRuntimeAgent = (options: RuntimeAgentOptions) => {
  const apiName = options.agUiApiName || DEFAULT_AG_UI_API_NAME;
  const resource = options.agUiResource || DEFAULT_AG_UI_RESOURCE;

  const fetch = createRestClientHttpFetch({
    restClient: options.restClient,
    apiName,
    resource,
    normalizeOutgoingBody: options.normalizeOutgoingBody,
    headersToRecord: options.runtimeHeadersToRecord,
    normalizeIncomingResponse: options.normalizeIncomingResponse,
    onSend: options.onSend,
  });

  return new HttpAgent({
    url: `/${apiName}/${resource}`,
    threadId: options.conversationId,
    fetch,
  });
};

export type RuntimePromptOptions = {
  agent: HttpAgent;
  prompt: string;
  createRuntimeId: (prefix: string) => string;
  metadata?: Record<string, unknown>;
  subscriber: AgentSubscriber;
  onPromptMessage?: (message: UserMessage) => void;
};

type RuntimeRunCommonOptions = {
  agent: HttpAgent;
  createRuntimeId: (prefix: string) => string;
  metadata?: Record<string, unknown>;
  subscriber: AgentSubscriber;
  onUserMessage?: (message: UserMessage) => void;
};

type RuntimePromptRunOptions = RuntimeRunCommonOptions & {
  mode: 'prompt';
  prompt: string;
};

type RuntimeResumeRunOptions = RuntimeRunCommonOptions & {
  mode: 'resume';
  status: 'resolved' | 'cancelled';
  resume: ResumeEntry[];
  summary?: string;
};

export type RuntimeRunOptions = RuntimePromptRunOptions | RuntimeResumeRunOptions;

export const executeAgUiRuntimeRun = async (options: RuntimeRunOptions) => {
  let message: UserMessage | undefined;

  if (options.mode === 'prompt') {
    message = {
      id: options.createRuntimeId('msg'),
      role: 'user',
      content: options.prompt,
    };
  }

  if (options.mode === 'resume' && options.status === 'resolved' && options.summary) {
    message = {
      id: options.createRuntimeId('msg'),
      role: 'user',
      content: options.summary,
    };
  }

  if (message) {
    options.agent.addMessage(message);
    options.onUserMessage?.(message);
  }

  await options.agent.runAgent(
    options.mode === 'prompt'
      ? {
          runId: options.createRuntimeId('run'),
          forwardedProps: { ...(options.metadata || {}) },
        }
      : {
          runId: options.createRuntimeId('run'),
          resume: options.resume,
          forwardedProps: { ...(options.metadata || {}) },
        },
    options.subscriber
  );

  return {
    message,
  };
};

export const submitAgUiRuntimePrompt = async (options: RuntimePromptOptions) => {
  const result = await executeAgUiRuntimeRun({
    mode: 'prompt',
    agent: options.agent,
    prompt: options.prompt,
    createRuntimeId: options.createRuntimeId,
    metadata: options.metadata,
    subscriber: options.subscriber,
    onUserMessage: options.onPromptMessage,
  });

  return result.message as UserMessage;
};

export type RuntimeResumeOptions = {
  agent: HttpAgent;
  status: 'resolved' | 'cancelled';
  resume: ResumeEntry[];
  createRuntimeId: (prefix: string) => string;
  metadata?: Record<string, unknown>;
  subscriber: AgentSubscriber;
  summary?: string;
  onResumeMessage?: (message: UserMessage) => void;
};

export const submitAgUiRuntimeResume = async (options: RuntimeResumeOptions) => {
  await executeAgUiRuntimeRun({
    mode: 'resume',
    agent: options.agent,
    status: options.status,
    resume: options.resume,
    createRuntimeId: options.createRuntimeId,
    metadata: options.metadata,
    subscriber: options.subscriber,
    summary: options.summary,
    onUserMessage: options.onResumeMessage,
  });
};

export const agUiAdapter: ChatApiAdapter = {
  protocol: 'ag-ui',
  setupAiModels: async () => {
    return EMPTY_SETUP_RESULT;
  },
  streamChat: async (
    clients: AdapterClients,
    input: StreamRequest,
    callbacks: StreamCallbacks,
    settings?: AdapterSettings
  ) => {
    try {
      await streamByRestClient(clients, input, callbacks, settings);
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') {
        return;
      }
      callbacks.onError?.(error);
    }
  },
};
