import { act, render } from '@testing-library/react';
import React from 'react';
import { AssistantUIRuntimeProvider } from '../AssistantUIRuntimeProvider';
import { AssistantRegisteredToolkit } from '../tools/toolRouting';

const mockUseLocalRuntime = jest.fn(() => ({ kind: 'local-runtime' }));
const mockUseAui = jest.fn(() => ({ kind: 'aui-instance' }));
const mockTools = jest.fn((config: unknown) => ({ kind: 'tools-resource', config }));
const mockFetch = jest.fn();
const mockEventSourceInstances: MockEventSource[] = [];

class MockEventSource {
  public onerror: ((event: Event) => void) | null = null;

  private readonly listeners = new Map<string, Array<(event: MessageEvent) => void>>();

  constructor(public readonly url: string) {
    mockEventSourceInstances.push(this);
  }

  addEventListener(type: string, listener: (event: MessageEvent) => void): void {
    const currentListeners = this.listeners.get(type) ?? [];
    currentListeners.push(listener);
    this.listeners.set(type, currentListeners);
  }

  emit(type: string, data = ''): void {
    const event = new MessageEvent(type, { data });
    (this.listeners.get(type) ?? []).forEach((listener) => listener(event));
  }

  failConnection(): void {
    this.onerror?.({} as Event);
  }

  close = jest.fn();
}

function parseEventSourceUrl(url: string): URL {
  return new URL(url, 'http://localhost');
}

Object.defineProperty(global, 'fetch', {
  writable: true,
  value: mockFetch,
});

Object.defineProperty(global, 'EventSource', {
  writable: true,
  value: MockEventSource,
});

jest.mock('@assistant-ui/react', () => {
  const React = jest.requireActual('react');

  return {
    AssistantRuntimeProvider: ({
      children,
      runtime,
      aui,
    }: {
      children: React.ReactNode;
      runtime: unknown;
      aui: unknown;
    }) => (
      <div
        data-testid="assistant-runtime-provider"
        data-runtime={JSON.stringify(runtime)}
        data-aui={JSON.stringify(aui)}
      >
        {children}
      </div>
    ),
    useLocalRuntime: (adapter: unknown, options?: unknown) => mockUseLocalRuntime(adapter, options),
    useAui: (config?: unknown) => mockUseAui(config),
    Tools: (config: unknown) => mockTools(config),
  };
});

describe('AssistantUIRuntimeProvider - ReAct Thinking Flow', () => {
  beforeEach(() => {
    mockUseLocalRuntime.mockClear();
    mockUseAui.mockClear();
    mockTools.mockClear();
    mockFetch.mockReset();
    mockEventSourceInstances.length = 0;
  });

  describe('ReAct Pattern - AI reasoning after tool execution', () => {
    it('continues to backend after frontend tool execution for AI analysis (ReAct pattern)', async () => {
      const toolExecute = jest.fn(async () => ({ temperature: 72, conditions: 'sunny' }));
      const customToolkit: AssistantRegisteredToolkit = {
        get_weather: {
          type: 'frontend',
          description: 'Get weather information',
          parameters: {
            type: 'object',
            properties: {
              location: { type: 'string' },
            },
          },
          execute: toolExecute,
          matchPrompt: (input: string) =>
            input.includes('weather') ? { args: { location: 'New York' }, confidence: 0.9 } : null,
        },
      };

      const RegisterTools = () => {
        const { useRegisterAssistantTools } = jest.requireActual('../AssistantUIRuntimeProvider');
        useRegisterAssistantTools(customToolkit);
        return null;
      };

      render(
        <AssistantUIRuntimeProvider apiUrl="/api/chat">
          <RegisterTools />
        </AssistantUIRuntimeProvider>,
      );

      const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
        run: (input: {
          messages: Array<{
            id: string;
            role: 'user';
            content: Array<{ type: 'text'; text: string }>;
          }>;
          abortSignal?: AbortSignal;
        }) => AsyncGenerator<{
          content?: Array<{
            type: string;
            toolName?: string;
            result?: unknown;
            text?: string;
          }>;
          status?: {
            type: string;
            reason?: string;
          };
        }>;
      };

      const stream = adapter.run({
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: [{ type: 'text', text: 'what is the weather' }],
          },
        ],
        abortSignal: new AbortController().signal,
      });

      // First yield: tool call with requires-action status
      const firstYield = await stream.next();
      expect(firstYield.value.content[0]).toMatchObject({
        type: 'tool-call',
        toolName: 'get_weather',
      });
      expect(firstYield.value.status).toMatchObject({
        type: 'requires-action',
        reason: 'tool-calls',
      });

      // Second yield: tool result is displayed before the backend continuation starts
      const secondYield = await stream.next();
      expect(secondYield.value.content[0]).toMatchObject({
        type: 'tool-call',
        toolName: 'get_weather',
        result: { temperature: 72, conditions: 'sunny' },
      });
      expect(secondYield.done).toBe(false);

      // Third iteration: Triggers backend connection with original user intent plus tool context
      const thirdYieldPromise = stream.next();

      // Backend continuation keeps the original user message and includes structured tool context
      expect(mockEventSourceInstances.length).toBe(1);
      const continuationUrl = parseEventSourceUrl(mockEventSourceInstances[0]?.url ?? '');
      expect(continuationUrl.searchParams.get('message')).toBe('what is the weather');
      expect(continuationUrl.searchParams.get('toolContext')).toEqual(
        expect.stringContaining('"originalUserMessage":"what is the weather"'),
      );

      // Backend responds with AI analysis
      mockEventSourceInstances[0]?.emit('conversation_id', 'conv-123');
      mockEventSourceInstances[0]?.emit(
        'message',
        'The weather in New York is sunny with a temperature of 72°F.',
      );
      mockEventSourceInstances[0]?.emit('done');

      // Third yield: AI response analyzing tool result (message event)
      const thirdYield = await thirdYieldPromise;
      expect(thirdYield.done).toBe(false);
      expect(thirdYield.value.content).toHaveLength(2); // tool-call + text
      expect(thirdYield.value.content[0]).toMatchObject({
        type: 'tool-call',
        toolName: 'get_weather',
        result: { temperature: 72, conditions: 'sunny' },
      });
      expect(thirdYield.value.content[1]).toMatchObject({
        type: 'text',
        text: 'The weather in New York is sunny with a temperature of 72°F.',
      });

      // Fourth yield: done event with status
      const fourthYield = await stream.next();
      expect(fourthYield.done).toBe(false);
      expect(fourthYield.value.status).toBeDefined();
      expect(fourthYield.value.status).toMatchObject({
        type: 'complete',
        reason: 'stop',
      });

      // Fifth iteration should complete the generator
      const fifthYield = await stream.next();
      expect(fifthYield.done).toBe(true);
    });

    it('sends tool result to backend with proper ReAct context', async () => {
      const toolExecute = jest.fn(async () => ({ result: 42 }));
      const customToolkit: AssistantRegisteredToolkit = {
        calculator: {
          type: 'frontend',
          description: 'Calculate expressions',
          parameters: {
            type: 'object',
            properties: {
              expression: { type: 'string' },
            },
          },
          execute: toolExecute,
          matchPrompt: (input: string) =>
            input.includes('calculate') ? { args: { expression: '2+2' }, confidence: 0.9 } : null,
        },
      };

      const RegisterTools = () => {
        const { useRegisterAssistantTools } = jest.requireActual('../AssistantUIRuntimeProvider');
        useRegisterAssistantTools(customToolkit);
        return null;
      };

      render(
        <AssistantUIRuntimeProvider apiUrl="/api/chat">
          <RegisterTools />
        </AssistantUIRuntimeProvider>,
      );

      const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
        run: (input: {
          messages: Array<{
            id: string;
            role: 'user';
            content: Array<{ type: 'text'; text: string }>;
          }>;
          abortSignal?: AbortSignal;
        }) => AsyncGenerator<unknown>;
      };

      const stream = adapter.run({
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: [{ type: 'text', text: 'calculate 2+2' }],
          },
        ],
        abortSignal: new AbortController().signal,
      });

      // Consume tool execution (2 yields)
      await stream.next();
      await stream.next();

      // Third iteration triggers backend connection
      const nextPromise = stream.next();

      // Verify backend was called with tool result context
      expect(mockEventSourceInstances.length).toBe(1);
      const url = parseEventSourceUrl(mockEventSourceInstances[0]?.url ?? '');

      // URL should preserve the original user question and the tool result context
      expect(url.searchParams.get('message')).toBe('calculate 2+2');
      expect(url.searchParams.get('toolContext')).toEqual(
        expect.stringContaining('"originalUserMessage":"calculate 2+2"'),
      );
      expect(url.searchParams.get('toolContext')).toEqual(expect.stringContaining('calculator'));
      expect(url.searchParams.get('toolContext')).toEqual(expect.stringContaining('42'));

      // Clean up
      act(() => {
        mockEventSourceInstances[0]?.emit('done');
      });
      await nextPromise;
    });

    it('includes backend tool results in conversation for AI analysis', async () => {
      render(
        <AssistantUIRuntimeProvider apiUrl="/api/chat">
          <div>child</div>
        </AssistantUIRuntimeProvider>,
      );

      const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
        run: (input: {
          messages: Array<{
            id: string;
            role: 'user';
            content: Array<{ type: 'text'; text: string }>;
          }>;
          abortSignal?: AbortSignal;
        }) => AsyncGenerator<{
          content?: Array<{
            type: string;
            toolName?: string;
            result?: unknown;
            text?: string;
          }>;
          status?: {
            type: string;
            reason?: string;
          };
        }>;
      };

      const stream = adapter.run({
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: [{ type: 'text', text: 'what is the stock price' }],
          },
        ],
        abortSignal: new AbortController().signal,
      });

      // Backend handles ReAct internally: tool call, execution, and AI analysis
      // are all part of the same stream
      const firstYieldPromise = stream.next();

      mockEventSourceInstances[0]?.emit('conversation_id', 'conv-1');
      mockEventSourceInstances[0]?.emit(
        'tool_call',
        JSON.stringify({
          id: 'tool-1',
          name: 'get_stock_price',
          arguments: { symbol: 'AAPL' },
          status: 'running',
        }),
      );
      mockEventSourceInstances[0]?.emit(
        'tool_result',
        JSON.stringify({
          toolCallId: 'tool-1',
          result: { symbol: 'AAPL', price: 150.5 },
        }),
      );
      // Backend continues conversation and sends AI analysis
      mockEventSourceInstances[0]?.emit('message', 'The stock price for AAPL is $150.50.');
      mockEventSourceInstances[0]?.emit('done');

      const firstYield = await firstYieldPromise;

      // First yield contains the AI analysis (backend handled ReAct internally)
      expect(firstYield.done).toBe(false);
      expect(firstYield.value.content).toHaveLength(2);
      expect(firstYield.value.content[0]).toMatchObject({
        type: 'tool-call',
        toolName: 'get_stock_price',
        result: { symbol: 'AAPL', price: 150.5 },
      });
      expect(firstYield.value.content[1]).toMatchObject({
        type: 'text',
        text: 'The stock price for AAPL is $150.50.',
      });

      // Final yield with status
      const secondYield = await stream.next();
      expect(secondYield.done).toBe(false);
      expect(secondYield.value.status).toMatchObject({
        type: 'complete',
        reason: 'stop',
      });

      // Generator completes
      const thirdYield = await stream.next();
      expect(thirdYield.done).toBe(true);
    });
  });
});
