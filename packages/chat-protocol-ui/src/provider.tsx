import type { ReactNode } from 'react';
import { useMemo } from 'react';
import {
  AssistantRuntimeProvider,
  Tools,
  useAui,
  useLocalRuntime,
  type Toolkit,
} from '@assistant-ui/react';
import type { ChatRunRequest, ChatToolCallPart, ChatToolDescriptor } from '@fm/chat-protocol-contract';
import {
  buildChatProtocolRequest,
  createProtocolLocalRuntime,
  streamProtocolRun,
  toProtocolMessages,
} from '../../chat-protocol-runtime/src';

export type ChatProtocolProviderProps = {
  apiUrl: string;
  toolkit: Toolkit;
  tools?: ChatToolDescriptor[];
  context?: ChatRunRequest['context'];
  metadata?: ChatRunRequest['metadata'];
  fetch?: typeof globalThis.fetch;
  onFrame?: (frame: import('@fm/chat-protocol-contract').ChatStreamFrame) => void;
  resolveFrontendTool?: (
    toolCall: ChatToolCallPart,
    request: ChatRunRequest,
  ) => Promise<Record<string, unknown>> | Record<string, unknown>;
  createConversationId?: (threadId?: string) => string;
  children: ReactNode;
};

function defaultCreateConversationId(threadId?: string): string {
  return threadId ? `conv-${threadId}` : 'conv-chat-protocol';
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
  createConversationId = defaultCreateConversationId,
  children,
}: ChatProtocolProviderProps): JSX.Element {
  const modelAdapter = useMemo(
    () =>
      createProtocolLocalRuntime({
        stream: (runOptions) => {
          const request = buildChatProtocolRequest({
            conversationId: createConversationId(runOptions.unstable_threadId),
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
            onFrame,
            resolveFrontendTool,
          });
        },
      }),
    [apiUrl, context, createConversationId, fetch, metadata, onFrame, resolveFrontendTool, tools],
  );

  const runtime = useLocalRuntime(modelAdapter);
  const aui = useAui({
    tools: Tools({ toolkit }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime} aui={aui}>
      {children}
    </AssistantRuntimeProvider>
  );
}
