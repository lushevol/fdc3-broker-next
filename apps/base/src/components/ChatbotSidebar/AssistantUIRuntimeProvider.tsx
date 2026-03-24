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
} from './adapters/sseToAssistantUi';
import type { AssistantUIMessage, ContentPart as StreamingContentPart } from './adapters/types';
import { createDemoToolkit } from './tools/demoToolkit';
import {
  describeAssistantToolkit,
  executeAssistantTool,
  resolveAssistantToolInvocation,
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

function createToolCallId(toolName: string): string {
  return `${toolName}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
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

function toAssistantMessageContent(content: StreamingContentPart[]): ChatModelRunResult['content'] {
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

function getLatestAssistantContent(messages: AssistantUIMessage[]): ChatModelRunResult['content'] {
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
    run({ messages, abortSignal }) {
      const latestMessage = messages[messages.length - 1];

      if (isToolRoundtripMessage(latestMessage)) {
        onToolRouteChange(null);
        return Promise.resolve({
          content: [],
          status: { type: 'complete', reason: 'stop' as const },
        });
      }

      if (!latestMessage || latestMessage.role !== 'user') {
        onToolRouteChange(null);
        return Promise.resolve({
          content: [{ type: 'text', text: 'How can I help you today?' }],
        });
      }

      const latestUserText = getTextFromMessage(latestMessage);
      const demoInvocation = resolveAssistantToolInvocation(latestUserText, toolkit);

      if (demoInvocation) {
        const invocation = demoInvocation;
        onToolRouteChange(invocation.debug);

        const runFrontendTool = async function* (): AsyncGenerator<
          ChatModelRunResult,
          void,
          unknown
        > {
          const toolCall = {
            type: 'tool-call' as const,
            toolCallId: createToolCallId(invocation.toolName),
            toolName: invocation.toolName,
            args: invocation.args as ReadonlyJSONObject,
            argsText: JSON.stringify(invocation.args),
          };

          yield {
            content: [toolCall],
            status: {
              type: 'requires-action',
              reason: 'tool-calls',
            },
          };

          try {
            const result = await executeAssistantTool(toolkit, invocation);

            yield {
              content: [
                {
                  ...toolCall,
                  result,
                },
              ],
              status: {
                type: 'complete',
                reason: 'stop',
              },
            };
          } catch (error) {
            yield {
              content: [
                {
                  ...toolCall,
                  result: {
                    message:
                      error instanceof Error ? error.message : 'Frontend tool execution failed',
                  },
                  isError: true,
                },
              ],
              status: {
                type: 'incomplete',
                reason: 'error',
                error: error instanceof Error ? error.message : 'Frontend tool execution failed',
              },
            };
          }
        };

        return runFrontendTool();
      }

      onToolRouteChange(null);
      const streamQueue = createStreamQueue();

      async function* streamResponses(): AsyncGenerator<ChatModelRunResult, void, unknown> {
        let streamingMessages: AssistantUIMessage[] = [];
        let streamingState = createInitialStreamingState();
        streamingState.conversationId = conversationIdRef.current;
        let pendingStructuredUpdate = false;
        let streamError: Error | null = null;

        const emitVisibleState = (status?: ChatModelRunResult['status']) => {
          streamQueue.push({
            content: getLatestAssistantContent(streamingMessages),
            ...(status ? { status } : {}),
          });
        };

        const eventSource = new EventSource(
          buildSSEUrl(apiUrl, latestUserText, conversationIdRef.current),
        );

        bindAssistantUiSSEStream(eventSource, {
          onEvent(eventType, data) {
            const next = handleSSEEvent(streamingMessages, streamingState, eventType, data);
            streamingMessages = next.messages;
            streamingState = next.streamingState;
            conversationIdRef.current = streamingState.conversationId;

            if (next.error) {
              streamError = new Error(next.error);
              eventSource.close();
              streamQueue.close();
              return;
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
              const latestAssistantContent = getLatestAssistantContent(streamingMessages);

              if (pendingStructuredUpdate || (latestAssistantContent?.length ?? 0) > 0) {
                emitVisibleState({
                  type: 'complete',
                  reason: 'stop',
                });
              }

              eventSource.close();
              streamQueue.close();
            }
          },
          onConnectionError() {
            if (abortSignal.aborted) {
              eventSource.close();
              streamQueue.close();
              return;
            }

            streamError = new Error('Chat stream connection failed');
            eventSource.close();
            streamQueue.close();
          },
        });

        abortSignal.addEventListener(
          'abort',
          () => {
            eventSource.close();
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
          eventSource.close();
        }

        if (streamError) {
          throw streamError;
        }
      }

      return streamResponses();
    },
  };
}

export function AssistantUIRuntimeProvider({
  children,
  apiUrl,
}: AssistantUIRuntimeProviderProps): JSX.Element {
  const baseToolkit = useMemo(() => createDemoToolkit(), []);
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
  const runtime = useLocalRuntime(modelAdapter);
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
