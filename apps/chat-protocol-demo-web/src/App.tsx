'use client';

import { useCallback, useState } from 'react';
import type {
  ChatStreamFrame,
  ChatToolCallPart,
  ChatToolInputStartFrame,
  ChatToolOutputAvailableFrame,
  ChatToolOutputErrorFrame,
} from '@fm/chat-protocol-contract';
import { AssistantModal, ChatProtocolProvider } from '@fm/chat-protocol-ui';
import { ToolRegistryPanel, useToolInvocationTracker } from '@/components/ToolRegistryPanel';
import type { ToolInvocation } from '@/components/ToolRegistryPanel';
import {
  getProtocolToolDescriptors,
  getToolkitForPreset,
  getToolDescriptors,
  type ToolPreset,
} from '@/components/toolkit/tools';

const API_URL = import.meta.env.VITE_PROTOCOL_DEMO_API_URL ?? 'http://127.0.0.1:8080/api/chat/runs';

type ResolveFrontendTool = (
  toolCall: ChatToolCallPart,
) => Promise<Record<string, unknown>> | Record<string, unknown>;

function createConversationId(threadId?: string): string {
  return threadId ? `conv-${threadId}` : 'conv-chat-protocol-demo';
}

const resolveFrontendTool: ResolveFrontendTool = async (toolCall) => {
  if (toolCall.toolName === 'location.resolve') {
    const query = typeof toolCall.input.query === 'string' ? toolCall.input.query : 'San Francisco';
    const normalized = query.toLowerCase();
    if (normalized.includes('beijing')) {
      return {
        name: 'Beijing, CN',
        latitude: 39.9042,
        longitude: 116.4074,
      };
    }

    return {
      name: 'San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194,
    };
  }

  return {
    result: `Simulated result from frontend tool: ${toolCall.toolName}`,
  };
};

function ChatProtocolAppContent({
  activeToolPreset,
  selectToolPreset,
}: {
  activeToolPreset: ToolPreset;
  selectToolPreset: (preset: ToolPreset) => void;
}) {
  const { invocations, trackInvocation, updateInvocation, resetInvocations } =
    useToolInvocationTracker();

  const onFrame = useCallback(
    (frame: ChatStreamFrame) => {
      if (frame.type === 'tool-input-start') {
        const toolFrame = frame as ChatToolInputStartFrame & {
          source?: string;
          providerId?: string;
        };
        trackInvocation({
          toolCallId: toolFrame.toolCallId,
          toolName: toolFrame.toolName,
          source:
            (toolFrame.source as ToolInvocation['source']) ??
            (toolFrame.executionTarget === 'frontend' ? 'frontend' : 'backend'),
          providerId: toolFrame.providerId,
          input: undefined,
          state: 'input-available',
        });
        return;
      }

      if (frame.type === 'tool-input-available') {
        updateInvocation(frame.toolCallId, {
          input: frame.input,
          state: 'input-available',
        });
        return;
      }

      if (frame.type === 'tool-output-available') {
        const toolFrame = frame as ChatToolOutputAvailableFrame & {
          source?: string;
          providerId?: string;
        };
        updateInvocation(toolFrame.toolCallId, {
          output: toolFrame.output,
          state: 'output-available',
          source: (toolFrame.source as ToolInvocation['source']) ?? 'backend',
          providerId: toolFrame.providerId,
        });
        return;
      }

      if (frame.type === 'tool-output-error') {
        const toolFrame = frame as ChatToolOutputErrorFrame & {
          source?: string;
          providerId?: string;
        };
        updateInvocation(toolFrame.toolCallId, {
          error: toolFrame.error,
          state: 'output-error',
          source: (toolFrame.source as ToolInvocation['source']) ?? 'backend',
          providerId: toolFrame.providerId,
        });
      }
    },
    [trackInvocation, updateInvocation],
  );

  const toolkit = getToolkitForPreset(activeToolPreset);
  const currentTools = getToolDescriptors(activeToolPreset);
  const protocolTools = getProtocolToolDescriptors(activeToolPreset);

  return (
    <ChatProtocolProvider
      apiUrl={API_URL}
      toolkit={toolkit}
      tools={protocolTools}
      onFrame={onFrame}
      resolveFrontendTool={resolveFrontendTool}
      createConversationId={createConversationId}
    >
      <main className="flex min-h-screen flex-col gap-8 p-5 md:p-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => selectToolPreset('minimal')}
            aria-pressed={activeToolPreset === 'minimal'}
            className="rounded-md border px-3 py-1.5 text-sm transition-colors aria-pressed:border-[#173b60] aria-pressed:bg-[#173b60] aria-pressed:text-white"
          >
            minimal
          </button>
          <button
            type="button"
            onClick={() => selectToolPreset('full')}
            aria-pressed={activeToolPreset === 'full'}
            className="rounded-md border px-3 py-1.5 text-sm transition-colors aria-pressed:border-[#173b60] aria-pressed:bg-[#173b60] aria-pressed:text-white"
          >
            full
          </button>
        </div>
        <ToolRegistryPanel
          tools={currentTools}
          invocations={invocations}
          onResetInvocations={resetInvocations}
        />
      </main>
      <AssistantModal />
    </ChatProtocolProvider>
  );
}

export function App() {
  const [activeToolPreset, setActiveToolPreset] = useState<ToolPreset>('full');

  return (
    <ChatProtocolAppContent
      activeToolPreset={activeToolPreset}
      selectToolPreset={setActiveToolPreset}
    />
  );
}
