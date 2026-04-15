import {
  AuiIf,
  AssistantRuntimeProvider,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useAuiState,
  useLocalRuntime,
  type ThreadMessage,
} from '@assistant-ui/react';
import type {
  ChatAssistantMessage,
  ChatMessage,
  ChatRunRequest,
  ChatStreamFrame,
  ChatToolCallPart,
} from '@fm/chat-protocol-contract';
import {
  createProtocolLocalRuntime,
  createProtocolStreamAdapter,
} from '@fm/chat-protocol-frontend';
import { useMemo } from 'react';

const API_URL = import.meta.env.VITE_PROTOCOL_DEMO_API_URL ?? 'http://127.0.0.1:4111/api/chat/runs';

type WeatherCardData = {
  location: string;
  date: string;
  condition: string;
  summary: string;
  highC: number;
  lowC: number;
};

function getTextParts(message: ThreadMessage): string[] {
  return message.content
    .filter((part): part is Extract<ThreadMessage['content'][number], { type: 'text' }> => part.type === 'text')
    .map((part) => part.text);
}

function toProtocolMessages(messages: readonly ThreadMessage[]): ChatMessage[] {
  return messages
    .filter((message) => message.role === 'user')
    .map((message) => ({
      id: message.id,
      role: 'user' as const,
      parts: getTextParts(message).map((text) => ({
        type: 'text' as const,
        text,
      })),
      metadata: message.metadata.custom,
    }));
}

function encodeLocationToolResult(part: ChatToolCallPart): ChatToolCallPart {
  const query = typeof part.input.query === 'string' ? part.input.query : 'San Francisco';
  const normalized = query.toLowerCase();

  if (normalized.includes('beijing')) {
    return {
      ...part,
      state: 'output-available',
      output: {
        name: 'Beijing, CN',
        latitude: 39.9042,
        longitude: 116.4074,
      },
    };
  }

  return {
    ...part,
    state: 'output-available',
    output: {
      name: 'San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194,
    },
  };
}

function extractDataLines(event: string): string[] {
  return event
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => (line.startsWith('data: ') ? line.slice('data: '.length) : line.slice('data:'.length)));
}

async function* parseSseFrames(response: Response): AsyncGenerator<ChatStreamFrame, void> {
  if (!response.ok || !response.body) {
    throw new Error(`Chat protocol request failed with status ${response.status}`);
  }

  const decoder = new TextDecoder();
  const reader = response.body.getReader();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    if (!value) {
      continue;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      const dataLines = extractDataLines(event);

      if (dataLines.length === 0) {
        continue;
      }

      yield JSON.parse(dataLines.join('\n')) as ChatStreamFrame;
    }
  }

  const finalEvents = buffer.split('\n\n').filter(Boolean);
  for (const event of finalEvents) {
    const dataLines = extractDataLines(event);

    if (dataLines.length === 0) {
      continue;
    }

    yield JSON.parse(dataLines.join('\n')) as ChatStreamFrame;
  }
}

async function postRunRequest(request: ChatRunRequest): Promise<Response> {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
}

async function* streamProtocolFrames(
  request: ChatRunRequest,
  adapter = createProtocolStreamAdapter(),
): AsyncGenerator<ChatStreamFrame, void> {
  let nextRequest: ChatRunRequest | null = request;
  let currentRunId = request.runId ?? null;

  while (nextRequest) {
    const response = await postRunRequest({
      ...nextRequest,
      ...(currentRunId ? { runId: currentRunId } : {}),
    });

    let finishReason: string | null = null;

    for await (const frame of parseSseFrames(response)) {
      adapter.applyFrame(frame);

      if (frame.type === 'start' && frame.runId) {
        currentRunId = frame.runId;
      }

      if (frame.type === 'finish') {
        finishReason = frame.finishReason;
      }

      yield frame;
    }

    if (finishReason !== 'tool-calls') {
      break;
    }

    const assistantMessage = adapter.getMessage();
    const pendingTool = [...assistantMessage.content]
      .reverse()
      .find(
        (part): part is ChatToolCallPart =>
          part.type === 'tool-call' &&
          part.executionTarget === 'frontend' &&
          part.state === 'input-available' &&
          !part.output,
      );

    if (!pendingTool) {
      break;
    }

    const resumedParts = assistantMessage.content.map((part) => {
      if (part.type === 'tool-call' && part.toolCallId === pendingTool.toolCallId) {
        return encodeLocationToolResult(part);
      }

      return part;
    });

    const resumedAssistantMessage: ChatAssistantMessage = {
      id: assistantMessage.id,
      role: 'assistant',
      parts: resumedParts,
      metadata: assistantMessage.metadata,
    };

    const resolvedTool = resumedParts.find(
      (part): part is ChatToolCallPart =>
        part.type === 'tool-call' && part.toolCallId === pendingTool.toolCallId,
    );

    if (resolvedTool?.output) {
      yield {
        type: 'tool-output-available',
        toolCallId: resolvedTool.toolCallId,
        output: resolvedTool.output,
      };
    }

    nextRequest = {
      conversationId: request.conversationId,
      runId: currentRunId,
      trigger: 'submit-tool-result',
      messages: [...request.messages, resumedAssistantMessage],
      metadata: request.metadata,
    };
  }
}

function createConversationId(threadId?: string): string {
  return threadId ? `conv-${threadId}` : 'conv-chat-protocol-demo';
}

function MessageContent() {
  const role = useAuiState((state) => state.message.role);
  const parts = useAuiState((state) => state.message.content);

  if (role === 'user') {
    return parts.map((part, index) =>
      part.type === 'text' ? (
        <p className="bubble bubble-user" key={`${part.type}-${index}`}>
          {part.text}
        </p>
      ) : null,
    );
  }

  return parts.map((part, index) => {
    if (part.type === 'text') {
      return (
        <p className="bubble bubble-assistant" data-testid="final-summary" key={`${part.type}-${index}`}>
          {part.text}
        </p>
      );
    }

    if (part.type === 'reasoning') {
      return (
        <div className="trace-card reasoning-card" data-testid="reasoning-summary" key={`${part.type}-${index}`}>
          <span className="trace-label">Reasoning</span>
          <p>{part.text}</p>
        </div>
      );
    }

    if (part.type === 'tool-call') {
      return (
        <div
          className="trace-card tool-card"
          data-testid={`tool-call-${part.toolName}`}
          key={part.toolCallId}
        >
          <span className="trace-label">Tool</span>
          <strong>{part.toolName}</strong>
          <pre>{JSON.stringify(part.args, null, 2)}</pre>
          {part.result ? (
            <pre>{JSON.stringify(part.result, null, 2)}</pre>
          ) : (
            <p className="trace-note">Waiting for result…</p>
          )}
        </div>
      );
    }

    if (part.type === 'data' && part.name === 'plan') {
      return (
        <div className="trace-card plan-card" data-testid="plan-summary" key={`${part.name}-${index}`}>
          <span className="trace-label">Plan</span>
          <p>{String((part.data as { summary?: string }).summary ?? '')}</p>
        </div>
      );
    }

    if (part.type === 'data' && (part.name === 'step-start' || part.name === 'step')) {
      const data = part.data as { title?: string; stepId?: string };
      return (
        <div className="trace-card step-card" key={`${part.name}-${index}`}>
          <span className="trace-label">Step</span>
          <p>{data.title ?? data.stepId}</p>
        </div>
      );
    }

    if (part.type === 'data' && part.name === 'weather-summary') {
      const data = part.data as WeatherCardData;
      return (
        <article className="weather-card" data-testid="weather-card" key={`${part.name}-${index}`}>
          <header>
            <span className="trace-label">Weather card</span>
            <h3>{data.location}</h3>
            <p>{data.date}</p>
          </header>
          <div className="weather-grid">
            <div>
              <span>Condition</span>
              <strong>{data.condition}</strong>
            </div>
            <div>
              <span>High</span>
              <strong>{data.highC}C</strong>
            </div>
            <div>
              <span>Low</span>
              <strong>{data.lowC}C</strong>
            </div>
          </div>
          <p>{data.summary}</p>
        </article>
      );
    }

    if (part.type === 'data' && part.name === 'error') {
      return (
        <p className="bubble bubble-error" key={`${part.name}-${index}`}>
          {String((part.data as { message?: string }).message ?? 'Error')}
        </p>
      );
    }

    if (part.type === 'data' && part.name === 'Card') {
      const data = part.data as { title?: string; content?: string; variant?: string };
      return (
        <div className="trace-card" key={`${part.name}-${index}`}>
          <span className="trace-label">{data.title ?? 'Info'}</span>
          <p>{data.content ?? ''}</p>
        </div>
      );
    }

    return null;
  });
}

function ThreadMessageView() {
  return (
    <MessagePrimitive.Root className="message-row">
      <MessageContent />
    </MessagePrimitive.Root>
  );
}

function DemoThread() {
  return (
    <ThreadPrimitive.Root className="thread-root">
      <ThreadPrimitive.Viewport className="thread-viewport">
        <AuiIf condition={(state) => state.thread.isEmpty}>
          <div className="empty-state">
            <h2>Chat protocol demo</h2>
            <p>Try: “What is the weather in San Francisco yesterday?”</p>
          </div>
        </AuiIf>

        <ThreadPrimitive.Messages>
          {() => <ThreadMessageView />}
        </ThreadPrimitive.Messages>

        <ThreadPrimitive.ViewportFooter className="thread-footer">
          <ComposerPrimitive.Root className="composer-root">
            <ComposerPrimitive.Input
              className="composer-input"
              aria-label="Message input"
              placeholder="Ask about the weather..."
              rows={1}
            />
            <div className="composer-actions">
              <ComposerPrimitive.Send asChild>
                <button className="send-button" type="button" aria-label="Send message">
                  Send
                </button>
              </ComposerPrimitive.Send>
            </div>
          </ComposerPrimitive.Root>
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
}

export function App() {
  const modelAdapter = useMemo(
    () =>
      createProtocolLocalRuntime({
        stream: (runOptions) => {
          const conversationId = createConversationId(runOptions.unstable_threadId);
          const messages = toProtocolMessages(runOptions.messages);

          const request: ChatRunRequest = {
            conversationId,
            trigger: 'submit-message',
            messages,
            metadata: runOptions.runConfig.custom ?? {},
          };

          return streamProtocolFrames(request);
        },
      }),
    [],
  );
  const runtime = useLocalRuntime(modelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <main className="app-shell">
        <section className="hero-panel">
          <span className="eyebrow">assistant-ui + LocalRuntime</span>
          <h1>Chat protocol demo</h1>
          <p>
            Streams reasoning, plan steps, backend and frontend tools, a card payload, and the final answer
            over the standalone protocol. Point <code>VITE_PROTOCOL_DEMO_API_URL</code> at the demo server or
            the real LangChain4j backend.
          </p>
        </section>
        <section className="thread-panel">
          <DemoThread />
        </section>
      </main>
    </AssistantRuntimeProvider>
  );
}
