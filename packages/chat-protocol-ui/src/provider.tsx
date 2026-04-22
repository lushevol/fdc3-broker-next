import { cn } from '@/lib/utils';
import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AssistantRuntimeProvider,
  Tools,
  useAui,
  useLocalRuntime,
  type Toolkit,
} from '@assistant-ui/react';
import type {
  ChatRunRequest,
  ChatToolCallPart,
  ChatToolDescriptor,
} from 'chat-protocol-contract';
import {
  buildChatProtocolRequest,
  buildHumanToolResumeRequest,
  createProtocolLocalRuntime,
  createProtocolResultStream,
  streamProtocolRun,
  toProtocolMessages,
} from 'chat-protocol-runtime';
import type { ToolkitBridge } from 'chat-protocol-runtime';

const PortalContainerContext = createContext<React.RefObject<HTMLElement | null> | null>(null);

export function usePortalContainer(): HTMLElement | null {
  const ref = useContext(PortalContainerContext);
  return ref?.current ?? null;
}

function useHtmlDarkMode(): boolean {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

export type ChatProtocolProviderProps = {
  apiUrl: string;
  toolkit: Toolkit;
  tools?: ChatToolDescriptor[];
  context?: ChatRunRequest['context'];
  metadata?: ChatRunRequest['metadata'];
  fetch?: typeof globalThis.fetch;
  onFrame?: (frame: import('chat-protocol-contract').ChatStreamFrame) => void;

  /**
   * @deprecated Use toolkitBridge instead for unified tool execution.
   * This will be removed in v3.0.0.
   */
  resolveFrontendTool?: (
    toolCall: ChatToolCallPart,
    request: ChatRunRequest,
  ) => Promise<Record<string, unknown>> | Record<string, unknown>;

  /**
   * Toolkit bridge for unified frontend tool execution.
   * When provided, the protocol will use this bridge to execute frontend tools
   * through the app's toolkit, eliminating the need for resolveFrontendTool.
   *
   * @example
   * ```typescript
   * import { createToolkitBridge } from '@/lib/toolkitBridge';
   *
   * const toolkitBridge = createToolkitBridge(toolkit);
   *
   * <ChatProtocolProvider
   *   toolkitBridge={toolkitBridge}
   * >
   * ```
   */
  toolkitBridge?: ToolkitBridge;

  createConversationId?: (threadId?: string) => string;
  dark?: boolean;
  children: ReactNode;
};

function defaultCreateConversationId(threadId?: string): string {
  return threadId ? `conv-${threadId}` : 'conv-chat-protocol';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toResultRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : { value };
}

export function ChatProtocolProvider({
  apiUrl,
  toolkit,
  tools,
  context,
  metadata,
  fetch,
  onFrame,
  resolveFrontendTool,
  toolkitBridge,
  createConversationId = defaultCreateConversationId,
  dark,
  children,
}: ChatProtocolProviderProps): JSX.Element {
  const latestConversationIdRef = useRef<string>();
  const latestRunIdRef = useRef<string | null>();

  const handleFrame = useCallback(
    (frame: import('chat-protocol-contract').ChatStreamFrame) => {
      if (frame.type === 'start') {
        if (frame.conversationId) {
          latestConversationIdRef.current = frame.conversationId;
        }

        if (frame.runId !== undefined) {
          latestRunIdRef.current = frame.runId ?? null;
        }
      }

      onFrame?.(frame);
    },
    [onFrame],
  );

  const modelAdapter = useMemo(
    () =>
      createProtocolLocalRuntime({
        stream: (runOptions) => {
          const conversationId = createConversationId(runOptions.unstable_threadId);
          latestConversationIdRef.current = conversationId;
          const request = buildChatProtocolRequest({
            conversationId,
            messages: toProtocolMessages(runOptions.messages),
            tools,
            context,
            metadata: {
              ...(metadata ?? {}),
              ...((runOptions.runConfig.custom as Record<string, unknown> | undefined) ?? {}),
            },
          });

          return streamProtocolRun({
            request,
            url: apiUrl,
            fetch,
            onFrame: handleFrame,
            resolveFrontendTool,
            toolkitBridge,
          });
        },
      }),
    [
      apiUrl,
      context,
      createConversationId,
      fetch,
      handleFrame,
      metadata,
      resolveFrontendTool,
      toolkitBridge,
      tools,
    ],
  );

  const runtime = useLocalRuntime(modelAdapter);
  const wrappedToolkit = useMemo<Toolkit>(() => {
    return Object.fromEntries(
      Object.entries(toolkit).map(([toolName, tool]) => {
        if (!tool.render || tool.type !== 'human') {
          return [toolName, tool];
        }

        const Render = tool.render;

        return [
          toolName,
          {
            ...tool,
            render: ((props) => {
              const resume = (payload: unknown) => {
                const result = toResultRecord(payload);

                props.addResult(result);

                const request = buildHumanToolResumeRequest({
                  conversationId:
                    latestConversationIdRef.current ?? createConversationId(undefined),
                  runId: latestRunIdRef.current,
                  messages: toProtocolMessages(runtime.thread.getState().messages),
                  toolCallId: props.toolCallId,
                  toolName: props.toolName,
                  result,
                  tools,
                  context,
                  metadata,
                });

                runtime.thread.resumeRun({
                  parentId: runtime.thread.getState().messages.at(-1)?.id ?? null,
                  runConfig: {},
                  stream: () =>
                    createProtocolResultStream(
                      streamProtocolRun({
                        request,
                        url: apiUrl,
                        fetch,
                        onFrame: handleFrame,
                        resolveFrontendTool,
                        toolkitBridge,
                      }),
                    ),
                });
              };

              return <Render {...props} resume={resume} />;
            }) as typeof tool.render,
          },
        ];
      }),
    ) as Toolkit;
  }, [
    apiUrl,
    context,
    createConversationId,
    fetch,
    handleFrame,
    metadata,
    resolveFrontendTool,
    runtime,
    toolkit,
    tools,
  ]);
  const aui = useAui({
    tools: Tools({ toolkit: wrappedToolkit }),
  });

  const portalContainerRef = useRef<HTMLDivElement>(null);
  const htmlDark = useHtmlDarkMode();
  const isDark = dark ?? htmlDark;

  return (
    <PortalContainerContext.Provider value={portalContainerRef}>
      <div ref={portalContainerRef} className={cn('cp-root', isDark && 'dark')}>
        <AssistantRuntimeProvider runtime={runtime} aui={aui}>
          {children}
        </AssistantRuntimeProvider>
      </div>
    </PortalContainerContext.Provider>
  );
}
