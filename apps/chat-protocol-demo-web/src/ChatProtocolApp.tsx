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
import { ToolRegistryPanel, useToolInvocationTracker } from '@/ToolRegistryPanel';
import type { ToolInvocation } from '@/ToolRegistryPanel';
import {
  getProtocolToolDescriptors,
  getToolkitForPreset,
  getToolDescriptors,
  type ToolPreset,
} from '@/toolkit';

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
      <main className="grid min-h-screen grid-cols-1 items-center gap-8 px-5 py-10 md:px-8 lg:grid-cols-[minmax(320px,520px)_minmax(320px,1fr)] lg:px-16">
        <section className="min-w-0">
          <span className="inline-flex w-fit rounded-full bg-[rgba(120,164,203,0.16)] px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[#37516a]">
            assistant-ui modal
          </span>
          <h1 className="my-4 text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.04em] text-[#132744]">
            Chat protocol demo
          </h1>
          <p className="mb-4 max-w-[36rem] text-[1.05rem] leading-[1.7] text-[#4c6680]">
            Floating button that opens an AI assistant chat box. This demo streams reasoning, plan
            steps, backend and frontend tools, and the final response through the chat protocol
            runtime. Human-in-the-loop (HITL) approval tools pause for user confirmation before
            continuing.
          </p>
          <p className="mb-4 max-w-[36rem] text-[1.05rem] leading-[1.7] text-[#4c6680]">
            Configure <code>VITE_PROTOCOL_DEMO_API_URL</code> to point at the mock demo server or
            the real LangChain4j backend.
          </p>
          <div className="mb-5 inline-flex flex-wrap items-center gap-2 rounded-[1.25rem] border border-[rgba(16,32,51,0.1)] bg-[rgba(255,255,255,0.7)] p-2 text-sm text-[#173b60] shadow-[0_10px_30px_-24px_rgba(16,32,51,0.35)]">
            <span className="px-2 font-semibold uppercase tracking-[0.08em] text-[#4c6680]">
              Active preset
            </span>
            <button
              type="button"
              onClick={() => selectToolPreset('minimal')}
              aria-pressed={activeToolPreset === 'minimal'}
              className="rounded-full border px-3 py-1.5 transition-colors aria-pressed:border-[#173b60] aria-pressed:bg-[#173b60] aria-pressed:text-white"
            >
              Use minimal tools
            </button>
            <button
              type="button"
              onClick={() => selectToolPreset('full')}
              aria-pressed={activeToolPreset === 'full'}
              className="rounded-full border px-3 py-1.5 transition-colors aria-pressed:border-[#173b60] aria-pressed:bg-[#173b60] aria-pressed:text-white"
            >
              Use full tools
            </button>
          </div>
          <div className="mb-4 max-w-[36rem] space-y-2">
            <h2 className="text-[1.05rem] font-semibold text-[#173b60]">Demo Test Cases</h2>
            <ul className="list-inside list-disc space-y-1 text-[0.95rem] text-[#4c6680]">
              <li>
                <strong>TC1 Frontend delegation:</strong> Ask &ldquo;What is the weather in San
                Francisco?&rdquo; with minimal preset — validates <code>location.resolve</code>{' '}
                &rarr; <code>get_weather</code> chain.
              </li>
              <li>
                <strong>TC2 Backend multi-tool:</strong> Ask &ldquo;What is the weather and current
                time?&rdquo; with full preset — validates <code>get_weather</code> +{' '}
                <code>get_current_time</code> backend tools.
              </li>
              <li>
                <strong>TC3 HITL approval:</strong> Ask &ldquo;Should I proceed with this
                action?&rdquo; with full preset — validates <code>approval.confirm</code> human tool
                pause/resume.
              </li>
              <li>
                <strong>TC4 Dynamic preset:</strong> Send a message with minimal preset, switch to
                full preset, send another message — validates tool set change without restart.
              </li>
              <li>
                <strong>TC5 Mixed sources:</strong> Ask &ldquo;Give me a full briefing with weather,
                approval, and analytics&rdquo; with full preset — validates all four source types in
                one run.
              </li>
            </ul>
          </div>
          <p className="max-w-[36rem] text-[1.05rem] font-semibold leading-[1.7] text-[#173b60]">
            The assistant modal is available in the bottom right corner of the screen.
          </p>
        </section>
        <section
          className="flex min-w-0 flex-col items-center justify-start lg:items-start lg:justify-center"
          aria-hidden="true"
        >
          <ToolRegistryPanel
            tools={currentTools}
            invocations={invocations}
            onResetInvocations={resetInvocations}
          />
        </section>
      </main>
      <AssistantModal />
    </ChatProtocolProvider>
  );
}

export function ChatProtocolApp() {
  const [activeToolPreset, setActiveToolPreset] = useState<ToolPreset>('minimal');

  return (
    <ChatProtocolAppContent
      activeToolPreset={activeToolPreset}
      selectToolPreset={setActiveToolPreset}
    />
  );
}
