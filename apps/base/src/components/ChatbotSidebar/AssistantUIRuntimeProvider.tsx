import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  AssistantRuntimeProvider,
  Tools,
  useAui,
  useLocalRuntime,
  type ChatModelAdapter,
  type ChatModelRunResult,
  type ThreadMessage,
  type Toolkit,
} from '@assistant-ui/react';
import {
  bindAssistantUiSSEStream,
  buildSSEUrl,
  createInitialStreamingState,
  handleSSEEvent,
  parseSSEEvent,
} from './adapters/sseToAssistantUi';
import type {
  AssistantUIMessage,
  ContentPart as StreamingContentPart,
  ToolCall as StreamingToolCall,
} from './adapters/types';
import { createBackendToolUiToolkit } from './tools/backendToolUiToolkit';
import { createDemoToolkit } from './tools/demoToolkit';
import {
  describeAssistantToolkit,
  getFrontendToolManifest,
  getHumanInTheLoopToolNames,
  type AssistantToolResolutionDebug,
  type AssistantToolMetadata,
  type AssistantRegisteredToolkit,
} from './tools/toolRouting';
import { GenerativeUIProvider, defaultGenerativeComponents } from './common/GenerativeUI';
import type { ReadonlyJSONObject } from 'assistant-stream/utils';

export interface AssistantUIRuntimeProviderValue {
  apiUrl: string;
  toolkit: Toolkit;
  hasToolkit: boolean;
  toolNames: string[];
  toolMetadata: AssistantToolMetadata[];
  lastToolRoute: AssistantToolResolutionDebug | null;
}

const AssistantUIRuntimeContext = createContext<AssistantUIRuntimeProviderValue | null>(null);
interface AssistantToolRegistrationContextValue {
  registerToolkit: (registrationId: string, toolkit: AssistantRegisteredToolkit) => void;
  unregisterToolkit: (registrationId: string) => void;
}

const AssistantToolRegistrationContext =
  createContext<AssistantToolRegistrationContextValue | null>(null);

let toolkitRegistrationSequence = 0;

export function useAssistantUIRuntime(options?: {
  optional?: false | undefined;
}): AssistantUIRuntimeProviderValue;
export function useAssistantUIRuntime(options?: {
  optional?: boolean | undefined;
}): AssistantUIRuntimeProviderValue | null;
export function useAssistantUIRuntime(options?: {
  optional?: boolean | undefined;
}): AssistantUIRuntimeProviderValue | null {
  const context = useContext(AssistantUIRuntimeContext);
  if (!context && !options?.optional) {
    throw new Error('useAssistantUIRuntime must be used within AssistantUIRuntimeProvider');
  }
  return context;
}

export function useAssistantToolMetadata(): AssistantToolMetadata[] {
  const context = useContext(AssistantUIRuntimeContext);

  if (!context) {
    throw new Error('useAssistantToolMetadata must be used within AssistantUIRuntimeProvider');
  }

  return context.toolMetadata;
}

export function useAssistantToolRoutingDebug(): AssistantToolResolutionDebug | null {
  const context = useContext(AssistantUIRuntimeContext);

  if (!context) {
    throw new Error('useAssistantToolRoutingDebug must be used within AssistantUIRuntimeProvider');
  }

  return context.lastToolRoute;
}

function createToolkitRegistrationId(): string {
  toolkitRegistrationSequence += 1;
  return `assistant-tools-${toolkitRegistrationSequence}`;
}

function mergeToolkits(
  baseToolkit: AssistantRegisteredToolkit,
  registeredToolkits: readonly AssistantRegisteredToolkit[],
): AssistantRegisteredToolkit {
  const mergedToolkit: AssistantRegisteredToolkit = { ...baseToolkit };
  const duplicateToolNames = new Set<string>();

  registeredToolkits.forEach((toolkit) => {
    Object.entries(toolkit).forEach(([toolName, toolDefinition]) => {
      if (toolName in mergedToolkit) {
        duplicateToolNames.add(toolName);
      }

      mergedToolkit[toolName] = toolDefinition;
    });
  });

  if (duplicateToolNames.size > 0 && process.env.NODE_ENV !== 'production') {
    throw new Error(
      `Duplicate assistant tool registration: ${Array.from(duplicateToolNames).sort().join(', ')}`,
    );
  }

  return mergedToolkit;
}

export function useRegisterAssistantTools(toolkit: AssistantRegisteredToolkit): void {
  const context = useContext(AssistantToolRegistrationContext);
  const registrationIdRef = useRef<string | null>(null);

  if (!context) {
    throw new Error('useRegisterAssistantTools must be used within AssistantUIRuntimeProvider');
  }

  if (!registrationIdRef.current) {
    registrationIdRef.current = createToolkitRegistrationId();
  }

  useEffect(() => {
    const registrationId = registrationIdRef.current;
    if (!registrationId) {
      return undefined;
    }
    context.registerToolkit(registrationId, toolkit);

    return () => {
      context.unregisterToolkit(registrationId);
    };
  }, [context, toolkit]);
}

interface AssistantUIRuntimeProviderProps {
  children: ReactNode;
  apiUrl: string;
}

interface FrontendToolContinuationPayload {
  originalUserMessage: string;
  toolCallId: string;
  toolName: string;
  args: ReadonlyJSONObject;
  result: unknown;
  isError: boolean;
  error?: string;
}

type AssistantRunContent = NonNullable<ChatModelRunResult['content']>;

interface ToolResultContinuationPart {
  type: 'tool-result';
  toolCallId: string;
  result: unknown;
  isError?: boolean;
}

interface ToolCallContinuationPart {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: ReadonlyJSONObject;
}

interface CompletedAssistantToolCallPart extends ToolCallContinuationPart {
  result: unknown;
  isError?: boolean;
  error?: string;
}

function getTextFromMessage(message: ThreadMessage): string {
  return message.content
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('')
    .trim();
}

function isToolRoundtripMessage(message: unknown): boolean {
  return (
    typeof message === 'object' &&
    message !== null &&
    (message as { role?: string }).role === 'tool'
  );
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isToolResultContinuationPart(part: unknown): part is ToolResultContinuationPart {
  return (
    isObjectRecord(part) &&
    part.type === 'tool-result' &&
    typeof part.toolCallId === 'string' &&
    'result' in part
  );
}

function isToolCallContinuationPart(part: unknown): part is ToolCallContinuationPart {
  return (
    isObjectRecord(part) &&
    part.type === 'tool-call' &&
    typeof part.toolCallId === 'string' &&
    typeof part.toolName === 'string' &&
    isObjectRecord(part.args)
  );
}

function isCompletedAssistantToolCallPart(part: unknown): part is CompletedAssistantToolCallPart {
  return isToolCallContinuationPart(part) && 'result' in part;
}

function findLatestUserText(messages: readonly ThreadMessage[]): string | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];

    if (message?.role !== 'user') {
      continue;
    }

    const text = getTextFromMessage(message);
    if (text) {
      return text;
    }
  }

  return null;
}

function serializeToolContinuationPayload(payload: FrontendToolContinuationPayload): string {
  return JSON.stringify(payload);
}

function serializeFrontendToolManifest(toolkit: AssistantRegisteredToolkit): string | undefined {
  const manifest = getFrontendToolManifest(toolkit);
  return manifest.length > 0 ? JSON.stringify(manifest) : undefined;
}

function buildToolRoundtripContinuationPayload(
  messages: readonly ThreadMessage[],
  currentAssistantMessage?: ThreadMessage,
): FrontendToolContinuationPayload | null {
  const originalUserMessage = findLatestUserText(messages);
  if (!originalUserMessage) {
    return null;
  }

  const latestMessage = currentAssistantMessage ?? messages[messages.length - 1];

  if (isToolRoundtripMessage(latestMessage)) {
    const toolResultPart = (latestMessage.content as readonly unknown[]).find(
      isToolResultContinuationPart,
    );

    if (!toolResultPart) {
      return null;
    }

    let matchingToolCall: ToolCallContinuationPart | undefined;

    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const message = messages[index];
      if (message?.role !== 'assistant') {
        continue;
      }

      const candidate = (message.content as readonly unknown[]).find(
        (part): part is ToolCallContinuationPart =>
          isToolCallContinuationPart(part) && part.toolCallId === toolResultPart.toolCallId,
      );

      if (candidate) {
        matchingToolCall = candidate;
        break;
      }
    }

    if (!matchingToolCall) {
      return null;
    }

    return {
      originalUserMessage,
      toolCallId: matchingToolCall.toolCallId,
      toolName: matchingToolCall.toolName,
      args: matchingToolCall.args,
      result: toolResultPart.result,
      isError: !!toolResultPart.isError,
    };
  }

  if (latestMessage?.role === 'assistant') {
    const completedToolCallPart = (latestMessage.content as readonly unknown[]).find(
      isCompletedAssistantToolCallPart,
    );

    if (!completedToolCallPart) {
      return null;
    }

    return {
      originalUserMessage,
      toolCallId: completedToolCallPart.toolCallId,
      toolName: completedToolCallPart.toolName,
      args: completedToolCallPart.args,
      result: completedToolCallPart.result,
      isError: !!completedToolCallPart.isError,
      ...(completedToolCallPart.error ? { error: completedToolCallPart.error } : {}),
    };
  }

  return null;
}

function toAssistantMessageContent(content: StreamingContentPart[]): AssistantRunContent {
  return content.map((part) => {
    if (part.type === 'text') {
      return { type: 'text', text: part.text };
    }

    if (part.type === 'tool-call') {
      return {
        type: 'tool-call',
        toolCallId: part.toolCallId,
        toolName: part.toolName,
        args: part.args as ReadonlyJSONObject,
        argsText: part.argsText,
        result: part.result,
        isError: part.isError,
      };
    }

    return {
      type: 'data',
      name: part.name,
      data: part.data,
    };
  });
}

function updateToolCallContentWithResult(
  content: AssistantRunContent,
  toolCallId: string,
  result: unknown,
  isError: boolean,
  error?: string,
): AssistantRunContent {
  return content.map((part) => {
    if (part.type !== 'tool-call' || part.toolCallId !== toolCallId) {
      return part;
    }

    return {
      ...part,
      result,
      isError,
      ...(error ? { error } : {}),
    };
  });
}

function getLatestAssistantContent(messages: AssistantUIMessage[]): AssistantRunContent {
  const latestAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'assistant');
  return latestAssistantMessage ? toAssistantMessageContent(latestAssistantMessage.content) : [];
}

function createStreamQueue() {
  const values: ChatModelRunResult[] = [];
  const resolvers: Array<(value: IteratorResult<ChatModelRunResult, void>) => void> = [];
  let isClosed = false;

  return {
    push(value: ChatModelRunResult) {
      if (isClosed) {
        return;
      }

      const resolver = resolvers.shift();
      if (resolver) {
        resolver({ value, done: false });
        return;
      }

      values.push(value);
    },
    close() {
      isClosed = true;
      let resolver = resolvers.shift();
      while (resolver) {
        resolver({ value: undefined, done: true });
        resolver = resolvers.shift();
      }
    },
    next(): Promise<IteratorResult<ChatModelRunResult, void>> {
      const value = values.shift();
      if (value) {
        return Promise.resolve({ value, done: false });
      }

      if (isClosed) {
        return Promise.resolve({ value: undefined, done: true });
      }

      return new Promise<IteratorResult<ChatModelRunResult, void>>((resolve) => {
        resolvers.push(resolve);
      });
    },
  };
}

function createChatModelAdapter(
  apiUrl: string,
  toolkit: AssistantRegisteredToolkit,
  onToolRouteChange: (debug: AssistantToolResolutionDebug | null) => void,
  conversationIdRef: React.MutableRefObject<string | null>,
): ChatModelAdapter {
  return {
    run(runOptions) {
      const { messages, abortSignal } = runOptions;
      const currentAssistantMessage =
        'unstable_getMessage' in runOptions && typeof runOptions.unstable_getMessage === 'function'
          ? runOptions.unstable_getMessage()
          : undefined;
      const latestMessage = messages[messages.length - 1];

      if (process.env.NODE_ENV !== 'production') {
        console.debug('[assistant-tools] adapter run', {
          messageRoles: messages.map((message) => message.role),
          latestRole: latestMessage?.role,
          latestContentTypes: latestMessage?.content?.map((part) => part.type) ?? [],
          latestText:
            latestMessage && latestMessage.role === 'user' ? getTextFromMessage(latestMessage) : '',
        });
      }

      const streamResponsesWithToolContext = async function* (
        messageText: string,
        toolContext?: string,
        initialContent: AssistantRunContent = [],
        frontendToolManifest?: string,
      ): AsyncGenerator<ChatModelRunResult, void, unknown> {
        const streamQueue = createStreamQueue();
        let streamingMessages: AssistantUIMessage[] = [];
        let streamingState = createInitialStreamingState();
        streamingState.conversationId = conversationIdRef.current;
        let pendingStructuredUpdate = false;
        let pendingFrontendToolCall: StreamingToolCall | null = null;
        let streamError: Error | null = null;
        let isStreamTerminal = false;
        let isEventSourceClosedIntentionally = false;

        const emitVisibleState = (status?: ChatModelRunResult['status']) => {
          const latestContent = getLatestAssistantContent(streamingMessages);
          const combinedContent =
            initialContent.length > 0 ? [...initialContent, ...latestContent] : latestContent;
          streamQueue.push({
            content: combinedContent,
            ...(status ? { status } : {}),
          });
        };

        const closeEventSource = () => {
          isEventSourceClosedIntentionally = true;
          eventSource.close();
        };

        const eventSource = new EventSource(
          buildSSEUrl(
            apiUrl,
            messageText,
            conversationIdRef.current,
            toolContext,
            frontendToolManifest,
          ),
        );

        bindAssistantUiSSEStream(eventSource, {
          onEvent(eventType, data) {
            const next = handleSSEEvent(streamingMessages, streamingState, eventType, data);
            streamingMessages = next.messages;
            streamingState = next.streamingState;
            conversationIdRef.current = streamingState.conversationId;

            if (next.error) {
              streamError = new Error(next.error);
              closeEventSource();
              streamQueue.close();
              return;
            }

            if (eventType === 'tool_call') {
              const parsedToolCall = parseSSEEvent(eventType, data);
              if (
                parsedToolCall?.type === 'tool_call' &&
                typeof parsedToolCall.payload === 'object' &&
                parsedToolCall.payload !== null &&
                (parsedToolCall.payload as StreamingToolCall).executionTarget === 'frontend'
              ) {
                pendingFrontendToolCall = parsedToolCall.payload as StreamingToolCall;
              }
            }

            if (eventType === 'conversation_id') {
              return;
            }

            if (eventType === 'message') {
              emitVisibleState();
              return;
            }

            if (
              eventType === 'tool_call' ||
              eventType === 'tool_result' ||
              eventType === 'generative_ui'
            ) {
              pendingStructuredUpdate = true;
              return;
            }

            if (eventType === 'done') {
              const latestContent = getLatestAssistantContent(streamingMessages);
              const combinedContent =
                initialContent.length > 0 ? [...initialContent, ...latestContent] : latestContent;

              if (pendingFrontendToolCall) {
                const frontendToolDefinition = toolkit[pendingFrontendToolCall.name];

                if (frontendToolDefinition?.humanInTheLoop) {
                  isStreamTerminal = true;
                  streamQueue.push({
                    content: combinedContent,
                    status: {
                      type: 'requires-action',
                      reason: 'tool-calls',
                    },
                  });
                  closeEventSource();
                  streamQueue.close();
                  return;
                }

                void (async () => {
                  let toolResult: unknown;
                  let toolError: string | undefined;

                  streamQueue.push({
                    content: combinedContent,
                    status: {
                      type: 'requires-action',
                      reason: 'tool-calls',
                    },
                  });

                  try {
                    if (!frontendToolDefinition?.execute) {
                      throw new Error(
                        `Frontend tool is not executable: ${pendingFrontendToolCall?.name ?? 'unknown'}`,
                      );
                    }

                    toolResult = await frontendToolDefinition.execute(
                      pendingFrontendToolCall.arguments,
                      {} as never,
                    );
                  } catch (error) {
                    toolError =
                      error instanceof Error ? error.message : 'Frontend tool execution failed';
                    toolResult = { message: toolError };
                  }

                  const resolvedContent = updateToolCallContentWithResult(
                    combinedContent,
                    pendingFrontendToolCall.id,
                    toolResult,
                    !!toolError,
                    toolError,
                  );

                  streamQueue.push({
                    content: resolvedContent,
                  });

                  const continuationPayload: FrontendToolContinuationPayload = {
                    originalUserMessage: messageText,
                    toolName: pendingFrontendToolCall.name,
                    toolCallId: pendingFrontendToolCall.id,
                    args: pendingFrontendToolCall.arguments as ReadonlyJSONObject,
                    result: toolResult,
                    isError: !!toolError,
                    ...(toolError ? { error: toolError } : {}),
                  };

                  try {
                    for await (const chunk of streamResponsesWithToolContext(
                      messageText,
                      serializeToolContinuationPayload(continuationPayload),
                      resolvedContent,
                      undefined,
                    )) {
                      streamQueue.push(chunk);
                    }
                  } catch (error) {
                    streamError =
                      error instanceof Error
                        ? error
                        : new Error('Frontend tool continuation failed');
                  } finally {
                    streamQueue.close();
                  }
                })();

                closeEventSource();
                return;
              }

              if (pendingStructuredUpdate || (combinedContent?.length ?? 0) > 0) {
                isStreamTerminal = true;
                streamQueue.push({
                  content: combinedContent,
                  status: {
                    type: 'complete',
                    reason: 'stop',
                  },
                });
              }

              closeEventSource();
              streamQueue.close();
            }
          },
          onConnectionError() {
            if (abortSignal.aborted || isStreamTerminal || isEventSourceClosedIntentionally) {
              closeEventSource();
              streamQueue.close();
              return;
            }

            streamError = new Error('Chat stream connection failed');
            closeEventSource();
            streamQueue.close();
          },
        });

        abortSignal?.addEventListener(
          'abort',
          () => {
            closeEventSource();
            streamQueue.close();
          },
          { once: true },
        );

        try {
          while (true) {
            const next = await streamQueue.next();
            if (next.done) {
              break;
            }

            yield next.value;
          }
        } finally {
          closeEventSource();
        }

        if (streamError) {
          throw streamError;
        }
      };

      const continuationPayload = buildToolRoundtripContinuationPayload(
        messages,
        currentAssistantMessage,
      );
      const frontendToolManifest = serializeFrontendToolManifest(toolkit);

      if (continuationPayload) {
        onToolRouteChange(null);

        return streamResponsesWithToolContext(
          continuationPayload.originalUserMessage,
          serializeToolContinuationPayload(continuationPayload),
          [],
          undefined,
        );
      }

      if (!latestMessage || latestMessage.role !== 'user') {
        onToolRouteChange(null);
        return Promise.resolve({
          content: [{ type: 'text', text: 'How can I help you today?' }],
        });
      }

      const currentUserText = getTextFromMessage(latestMessage);
      onToolRouteChange(null);
      async function* streamResponses(): AsyncGenerator<ChatModelRunResult, void, unknown> {
        yield* streamResponsesWithToolContext(currentUserText, undefined, [], frontendToolManifest);
      }

      return streamResponses();
    },
  };
}

export function AssistantUIRuntimeProvider({
  children,
  apiUrl,
}: AssistantUIRuntimeProviderProps): JSX.Element {
  const baseToolkit = useMemo(
    () => mergeToolkits(createDemoToolkit(), [createBackendToolUiToolkit()]),
    [],
  );
  const [registeredToolkits, setRegisteredToolkits] = useState<
    Map<string, AssistantRegisteredToolkit>
  >(() => new Map());
  const registerToolkit = useCallback(
    (registrationId: string, toolkit: AssistantRegisteredToolkit) => {
      setRegisteredToolkits((previous) => {
        const next = new Map(previous);
        next.set(registrationId, toolkit);
        return next;
      });
    },
    [],
  );
  const unregisterToolkit = useCallback((registrationId: string) => {
    setRegisteredToolkits((previous) => {
      if (!previous.has(registrationId)) {
        return previous;
      }

      const next = new Map(previous);
      next.delete(registrationId);
      return next;
    });
  }, []);
  const toolkit = useMemo(
    () => mergeToolkits(baseToolkit, Array.from(registeredToolkits.values())),
    [baseToolkit, registeredToolkits],
  );
  const [lastToolRoute, setLastToolRoute] = useState<AssistantToolResolutionDebug | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const toolMetadata = useMemo(() => describeAssistantToolkit(toolkit), [toolkit]);
  const modelAdapter = useMemo(
    () => createChatModelAdapter(apiUrl, toolkit, setLastToolRoute, conversationIdRef),
    [apiUrl, toolkit],
  );
  const humanInTheLoopToolNames = useMemo(() => getHumanInTheLoopToolNames(toolkit), [toolkit]);
  const runtime = useLocalRuntime(modelAdapter, {
    unstable_humanToolNames:
      humanInTheLoopToolNames.length > 0 ? humanInTheLoopToolNames : undefined,
  });
  const aui = useAui({
    tools: Tools({ toolkit }),
  });

  const value = useMemo<AssistantUIRuntimeProviderValue>(
    () => ({
      apiUrl,
      toolkit,
      hasToolkit: Object.keys(toolkit).length > 0,
      toolNames: toolMetadata.map((item) => item.toolName),
      toolMetadata,
      lastToolRoute,
    }),
    [apiUrl, lastToolRoute, toolMetadata, toolkit],
  );
  const registrationValue = useMemo<AssistantToolRegistrationContextValue>(
    () => ({
      registerToolkit,
      unregisterToolkit,
    }),
    [registerToolkit, unregisterToolkit],
  );

  return (
    <AssistantToolRegistrationContext.Provider value={registrationValue}>
      <AssistantUIRuntimeContext.Provider value={value}>
        <GenerativeUIProvider initialComponents={defaultGenerativeComponents}>
          <AssistantRuntimeProvider runtime={runtime} aui={aui}>
            {children}
          </AssistantRuntimeProvider>
        </GenerativeUIProvider>
      </AssistantUIRuntimeContext.Provider>
    </AssistantToolRegistrationContext.Provider>
  );
}

export default AssistantUIRuntimeProvider;
