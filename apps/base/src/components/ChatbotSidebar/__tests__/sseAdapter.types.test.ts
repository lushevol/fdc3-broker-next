/**
 * Type Tests for SSE to Assistant-UI Adapter
 *
 * These tests verify type safety of the adapter transformations.
 */

import type {
  ToolCall,
  ToolResult,
  GenerativeUIDirective,
  ContentPart,
  AssistantUIMessage,
  StreamingState,
} from '../adapters/types';
import {
  generateMessageId,
  createInitialStreamingState,
  createUserMessage,
  createAssistantMessage,
  bindAssistantUiSSEStream,
  parseSSEEvent,
  transformToolCall,
  transformToolResult,
  transformGenerativeUI,
  updateAssistantMessageContent,
  addContentPartToAssistantMessage,
  buildSSEUrl,
  handleSSEEvent,
} from '../adapters/sseToAssistantUi';

describe('SSE Adapter Type Safety', () => {
  describe('generateMessageId', () => {
    it('should return a string', () => {
      const id = generateMessageId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe('createInitialStreamingState', () => {
    it('should return StreamingState with correct structure', () => {
      const state = createInitialStreamingState();

      expect(state).toMatchObject<StreamingState>({
        conversationId: null,
        assistantMessageId: null,
        accumulatedContent: '',
        pendingToolCalls: expect.any(Map),
      });

      expect(state.pendingToolCalls.size).toBe(0);
    });
  });

  describe('handleSSEEvent', () => {
    it('resets stream-local state on done while preserving the conversation id', () => {
      const state = createInitialStreamingState();
      const withConversation = handleSSEEvent([], state, 'conversation_id', 'conv-123');
      const withMessage = handleSSEEvent(
        withConversation.messages,
        withConversation.streamingState,
        'message',
        'Hello',
      );

      const done = handleSSEEvent(withMessage.messages, withMessage.streamingState, 'done', '');

      expect(done.streamingState.conversationId).toBe('conv-123');
      expect(done.streamingState.assistantMessageId).toBeNull();
      expect(done.streamingState.accumulatedContent).toBe('');
      expect(done.streamingState.pendingToolCalls.size).toBe(0);
    });

    it('preserves tool metadata when a tool_result resolves a prior tool_call', () => {
      const state = createInitialStreamingState();
      const toolCall: ToolCall = {
        id: 'tool-123',
        name: 'get_weather',
        arguments: { location: 'Singapore' },
        status: 'running',
      };

      const afterToolCall = handleSSEEvent([], state, 'tool_call', JSON.stringify(toolCall));
      const afterToolResult = handleSSEEvent(
        afterToolCall.messages,
        afterToolCall.streamingState,
        'tool_result',
        JSON.stringify({
          toolCallId: 'tool-123',
          result: { location: 'Singapore', temperature: 31 },
        } satisfies ToolResult),
      );

      const assistantMessage = afterToolResult.messages.find(
        (message) => message.role === 'assistant',
      );
      const toolPart = assistantMessage?.content.find(
        (part): part is Extract<ContentPart, { type: 'tool-call' }> => part.type === 'tool-call',
      );

      expect(toolPart).toMatchObject({
        type: 'tool-call',
        toolCallId: 'tool-123',
        toolName: 'get_weather',
        args: { location: 'Singapore' },
        result: { location: 'Singapore', temperature: 31 },
      });
    });

    it('merges tool-linked generative_ui directives into the existing tool-call part', () => {
      const state = createInitialStreamingState();
      const toolCall: ToolCall = {
        id: 'tool-456',
        name: 'get_weather',
        arguments: { location: 'Shanghai, China' },
        status: 'completed',
      };

      const afterToolCall = handleSSEEvent([], state, 'tool_call', JSON.stringify(toolCall));
      const afterToolResult = handleSSEEvent(
        afterToolCall.messages,
        afterToolCall.streamingState,
        'tool_result',
        JSON.stringify({
          toolCallId: 'tool-456',
          result: { location: 'Shanghai, China', temperature: 22 },
        } satisfies ToolResult),
      );
      const afterGenerativeUi = handleSSEEvent(
        afterToolResult.messages,
        afterToolResult.streamingState,
        'generative_ui',
        JSON.stringify({
          name: 'ChartCard',
          toolCallId: 'tool-456',
          props: { title: 'Weather Summary' },
        } satisfies GenerativeUIDirective),
      );

      const assistantMessage = afterGenerativeUi.messages.find(
        (message) => message.role === 'assistant',
      );

      expect(assistantMessage?.content).toHaveLength(2);
      expect(assistantMessage?.content[0]).toMatchObject({
        type: 'text',
        text: 'Checking with get weather...',
      });
      expect(assistantMessage?.content[1]).toMatchObject({
        type: 'tool-call',
        toolCallId: 'tool-456',
        result: {
          location: 'Shanghai, China',
          temperature: 22,
          __assistantUiGenerativeUi: {
            componentName: 'ChartCard',
            props: { title: 'Weather Summary' },
          },
        },
      });
    });
  });

  describe('bindAssistantUiSSEStream', () => {
    it('registers the backend event contract and routes named events through the adapter callback', () => {
      const addEventListener = jest.fn();
      const eventSource = {
        addEventListener,
        onerror: null as ((event: Event) => void) | null,
      };
      const onEvent = jest.fn();
      const onConnectionError = jest.fn();

      bindAssistantUiSSEStream(eventSource, {
        onEvent,
        onConnectionError,
      });

      expect(addEventListener).toHaveBeenCalledWith('conversation_id', expect.any(Function));
      expect(addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
      expect(addEventListener).toHaveBeenCalledWith('tool_call', expect.any(Function));
      expect(addEventListener).toHaveBeenCalledWith('tool_result', expect.any(Function));
      expect(addEventListener).toHaveBeenCalledWith('generative_ui', expect.any(Function));
      expect(addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
      expect(addEventListener).toHaveBeenCalledWith('done', expect.any(Function));

      const messageListener = addEventListener.mock.calls.find(
        ([eventName]) => eventName === 'message',
      )?.[1];
      const errorListener = addEventListener.mock.calls.find(
        ([eventName]) => eventName === 'error',
      )?.[1];
      const doneListener = addEventListener.mock.calls.find(
        ([eventName]) => eventName === 'done',
      )?.[1];

      messageListener(new MessageEvent('message', { data: 'Hello' }));
      errorListener(new MessageEvent('error', { data: 'Backend failed' }));
      doneListener(new MessageEvent('done'));

      expect(onEvent).toHaveBeenNthCalledWith(1, 'message', 'Hello');
      expect(onEvent).toHaveBeenNthCalledWith(2, 'error', 'Backend failed');
      expect(onEvent).toHaveBeenNthCalledWith(3, 'done', '');
      expect(onConnectionError).not.toHaveBeenCalled();
    });
  });

  describe('createUserMessage', () => {
    it('should create valid AssistantUIMessage with user role', () => {
      const message = createUserMessage('Hello world');

      expect(message).toMatchObject<AssistantUIMessage>({
        id: expect.any(String),
        role: 'user',
        content: [{ type: 'text', text: 'Hello world' }],
        createdAt: expect.any(Date),
      });
    });

    it('should handle empty content', () => {
      const message = createUserMessage('');
      expect(message.content).toHaveLength(1);
      expect(message.content[0]).toMatchObject({ type: 'text', text: '' });
    });
  });

  describe('createAssistantMessage', () => {
    it('should create valid AssistantUIMessage with assistant role', () => {
      const message = createAssistantMessage();

      expect(message).toMatchObject<AssistantUIMessage>({
        id: expect.any(String),
        role: 'assistant',
        content: [],
        createdAt: expect.any(Date),
      });
    });

    it('should use provided id', () => {
      const customId = 'custom-id-123';
      const message = createAssistantMessage(customId);
      expect(message.id).toBe(customId);
    });
  });

  describe('parseSSEEvent', () => {
    it('should parse message event', () => {
      const result = parseSSEEvent('message', 'Hello');
      expect(result).toEqual({
        type: 'message',
        payload: 'Hello',
      });
    });

    it('should parse JSON-wrapped message chunks without losing leading spaces', () => {
      const result = parseSSEEvent('message', '{"text":" check"}');
      expect(result).toEqual({
        type: 'message',
        payload: ' check',
      });
    });

    it('should parse conversation_id event', () => {
      const result = parseSSEEvent('conversation_id', 'conv-123');
      expect(result).toEqual({
        type: 'conversation_id',
        payload: 'conv-123',
      });
    });

    it('should parse JSON events', () => {
      const toolCall: ToolCall = {
        id: 'tool-1',
        name: 'calculator',
        arguments: { a: 1, b: 2 },
        status: 'pending',
      };
      const result = parseSSEEvent('tool_call', JSON.stringify(toolCall));
      expect(result?.type).toBe('tool_call');
      expect(result?.payload).toMatchObject(toolCall);
    });

    it('should normalize backend tool_call enums to assistant-ui payload shape', () => {
      const result = parseSSEEvent(
        'tool_call',
        JSON.stringify({
          id: 'tool-frontend-1',
          name: 'generate_status_card',
          arguments: {},
          status: 'RUNNING',
          executionTarget: 'FRONTEND',
          requiresConfirmation: false,
        }),
      );

      expect(result).toEqual({
        type: 'tool_call',
        payload: {
          id: 'tool-frontend-1',
          name: 'generate_status_card',
          arguments: {},
          status: 'running',
          executionTarget: 'frontend',
          requiresConfirmation: false,
        },
      });
    });

    it('should handle invalid JSON', () => {
      const result = parseSSEEvent('tool_call', 'invalid json');
      expect(result).toBeNull();
    });
  });

  describe('transformToolCall', () => {
    it('should transform ToolCall to ContentPart', () => {
      const toolCall: ToolCall = {
        id: 'tool-1',
        name: 'calculator',
        arguments: { a: 1, b: 2 },
        status: 'pending',
      };

      const result = transformToolCall(toolCall);

      expect(result).toMatchObject<ContentPart>({
        type: 'tool-call',
        toolCallId: 'tool-1',
        toolName: 'calculator',
        args: { a: 1, b: 2 },
        argsText: '{"a":1,"b":2}',
        status: 'pending',
      });
    });
  });

  describe('transformToolResult', () => {
    it('should transform ToolResult to ContentPart', () => {
      const toolResult: ToolResult = {
        toolCallId: 'tool-1',
        result: 42,
      };

      const result = transformToolResult(toolResult);

      expect(result).toMatchObject<ContentPart>({
        type: 'tool-call',
        toolCallId: 'tool-1',
        toolName: '',
        args: {},
        argsText: '{}',
        result: 42,
        isError: false,
        status: 'completed',
      });
    });

    it('should handle error results', () => {
      const toolResult: ToolResult = {
        toolCallId: 'tool-1',
        result: null,
        error: 'Something went wrong',
      };

      const result = transformToolResult(toolResult);

      expect((result as Extract<ContentPart, { type: 'tool-call' }>).isError).toBe(true);
      expect((result as Extract<ContentPart, { type: 'tool-call' }>).error).toBe(
        'Something went wrong',
      );
    });
  });

  describe('transformGenerativeUI', () => {
    it('should transform GenerativeUIDirective to ContentPart', () => {
      const directive: GenerativeUIDirective = {
        name: 'ChartCard',
        props: { data: [1, 2, 3] },
      };

      const result = transformGenerativeUI(directive);

      expect(result).toMatchObject<ContentPart>({
        type: 'data',
        name: 'generative-ui',
        data: {
          componentName: 'ChartCard',
          props: { data: [1, 2, 3] },
        },
      });
    });
  });

  describe('updateAssistantMessageContent', () => {
    it('should add text to empty message', () => {
      const message = createAssistantMessage();
      const updated = updateAssistantMessageContent(message, 'Hello');

      expect(updated.content).toHaveLength(1);
      expect(updated.content[0]).toMatchObject({ type: 'text', text: 'Hello' });
    });

    it('should update trailing text part', () => {
      const message: AssistantUIMessage = {
        id: '1',
        role: 'assistant',
        content: [{ type: 'text', text: 'Hello' }],
        createdAt: new Date(),
      };
      const updated = updateAssistantMessageContent(message, 'Hello World');

      expect(updated.content).toHaveLength(1);
      expect(updated.content[0]).toMatchObject({ type: 'text', text: 'Hello World' });
    });

    it('should start a new text part after structured content', () => {
      const message: AssistantUIMessage = {
        id: '1',
        role: 'assistant',
        content: [
          { type: 'text', text: 'Hello' },
          { type: 'tool-call', toolCallId: 't1', toolName: 'calc', args: {}, argsText: '{}' },
        ],
        createdAt: new Date(),
      };
      const updated = updateAssistantMessageContent(message, 'Hello World');

      expect(updated.content).toHaveLength(3);
      expect(updated.content[0]).toMatchObject({ type: 'text', text: 'Hello' });
      expect(updated.content[1]).toMatchObject({ type: 'tool-call', toolCallId: 't1' });
      expect(updated.content[2]).toMatchObject({ type: 'text', text: 'Hello World' });
    });
  });

  describe('addContentPartToAssistantMessage', () => {
    it('should append content part to message', () => {
      const message = createAssistantMessage();
      const part: ContentPart = { type: 'text', text: 'New content' };
      const updated = addContentPartToAssistantMessage(message, part);

      expect(updated.content).toHaveLength(1);
      expect(updated.content[0]).toEqual(part);
    });

    it('should insert tool result after corresponding tool call', () => {
      const message: AssistantUIMessage = {
        id: '1',
        role: 'assistant',
        content: [
          { type: 'tool-call', toolCallId: 't1', toolName: 'calc', args: {}, argsText: '{}' },
        ],
        createdAt: new Date(),
      };
      const resultPart: ContentPart = {
        type: 'tool-call',
        toolCallId: 't1',
        toolName: 'calc',
        args: {},
        argsText: '{}',
        result: 42,
        status: 'completed',
      };
      const updated = addContentPartToAssistantMessage(message, resultPart);

      expect(updated.content).toHaveLength(1);
      expect(updated.content[0]).toMatchObject({
        type: 'tool-call',
        toolCallId: 't1',
        result: 42,
        status: 'completed',
      });
    });
  });

  describe('buildSSEUrl', () => {
    it('should build URL with message only', () => {
      const url = buildSSEUrl('http://api.example.com', 'Hello');
      expect(url).toBe('http://api.example.com/stream?message=Hello');
    });

    it('should include conversationId when provided', () => {
      const url = buildSSEUrl('http://api.example.com', 'Hello', 'conv-123');
      expect(url).toBe('http://api.example.com/stream?message=Hello&conversationId=conv-123');
    });

    it('should trim message whitespace', () => {
      const url = buildSSEUrl('http://api.example.com', '  Hello World  ');
      expect(url).toBe('http://api.example.com/stream?message=Hello+World');
    });

    it('should include serialized frontend tool manifest when provided', () => {
      const url = buildSSEUrl(
        'http://api.example.com',
        'Hello',
        'conv-123',
        undefined,
        JSON.stringify([
          {
            name: 'send_workspace_announcement',
            description: 'Prepare a workspace announcement',
            humanInTheLoop: true,
          },
        ]),
      );

      const parsed = new URL(url);
      expect(parsed.searchParams.get('conversationId')).toBe('conv-123');
      expect(parsed.searchParams.get('frontendTools')).toBe(
        '[{"name":"send_workspace_announcement","description":"Prepare a workspace announcement","humanInTheLoop":true}]',
      );
    });
  });

  describe('handleSSEEvent', () => {
    it('should handle conversation_id event', () => {
      const messages: AssistantUIMessage[] = [];
      const state = createInitialStreamingState();

      const result = handleSSEEvent(messages, state, 'conversation_id', 'conv-123');

      expect(result.streamingState.conversationId).toBe('conv-123');
      expect(result.messages).toHaveLength(0);
    });

    it('should handle message event and create assistant message', () => {
      const messages: AssistantUIMessage[] = [];
      const state = createInitialStreamingState();

      const result = handleSSEEvent(messages, state, 'message', 'Hello');

      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].role).toBe('assistant');
      expect(result.messages[0].content[0]).toMatchObject({ type: 'text', text: 'Hello' });
      expect(result.streamingState.accumulatedContent).toBe('Hello');
    });

    it('should accumulate message content', () => {
      const messages: AssistantUIMessage[] = [];
      let state = createInitialStreamingState();

      // First chunk
      let result = handleSSEEvent(messages, state, 'message', 'Hello');
      messages.push(...result.messages);
      state = result.streamingState;

      // Second chunk - should update existing message
      result = handleSSEEvent(messages, state, 'message', ' World');

      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].content[0]).toMatchObject({ type: 'text', text: 'Hello World' });
      expect(result.streamingState.accumulatedContent).toBe('Hello World');
    });

    it('should handle tool_call event', () => {
      const messages: AssistantUIMessage[] = [createAssistantMessage()];
      const state = createInitialStreamingState();
      state.assistantMessageId = messages[0].id;

      const toolCall: ToolCall = {
        id: 'tool-1',
        name: 'calculator',
        arguments: {},
        status: 'pending',
      };

      const result = handleSSEEvent(messages, state, 'tool_call', JSON.stringify(toolCall));

      expect(result.messages[0].content).toHaveLength(2);
      expect(result.messages[0].content[0]).toMatchObject({
        type: 'text',
        text: 'Checking with calculator...',
      });
      expect(result.messages[0].content[1].type).toBe('tool-call');
      expect(result.streamingState.accumulatedContent).toBe('');
    });

    it('should prepend a visible progress stub when a tool call arrives before any assistant text', () => {
      const messages: AssistantUIMessage[] = [];
      const state = createInitialStreamingState();

      const toolCall: ToolCall = {
        id: 'tool-leading-1',
        name: 'generate_status_card',
        arguments: { title: 'Workspace Health Status' },
        status: 'running',
      };

      const result = handleSSEEvent(messages, state, 'tool_call', JSON.stringify(toolCall));

      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].content).toEqual([
        { type: 'text', text: 'Checking with generate status card...' },
        {
          type: 'tool-call',
          toolCallId: 'tool-leading-1',
          toolName: 'generate_status_card',
          args: { title: 'Workspace Health Status' },
          argsText: '{"title":"Workspace Health Status"}',
          status: 'running',
          executionTarget: undefined,
          requiresConfirmation: undefined,
        },
      ]);
    });

    it('should interleave text around tool calls in arrival order', () => {
      let messages: AssistantUIMessage[] = [];
      let state = createInitialStreamingState();

      const firstText = handleSSEEvent(messages, state, 'message', 'First thought. ');
      messages = firstText.messages;
      state = firstText.streamingState;

      const toolCall: ToolCall = {
        id: 'tool-ordered-1',
        name: 'get_weather',
        arguments: { location: 'Shanghai' },
        status: 'running',
      };
      const afterToolCall = handleSSEEvent(messages, state, 'tool_call', JSON.stringify(toolCall));
      messages = afterToolCall.messages;
      state = afterToolCall.streamingState;

      const secondText = handleSSEEvent(messages, state, 'message', 'After tool result.');

      expect(secondText.messages[0].content).toEqual([
        { type: 'text', text: 'First thought. ' },
        {
          type: 'tool-call',
          toolCallId: 'tool-ordered-1',
          toolName: 'get_weather',
          args: { location: 'Shanghai' },
          argsText: '{"location":"Shanghai"}',
          status: 'running',
          requiresConfirmation: undefined,
        },
        { type: 'text', text: 'After tool result.' },
      ]);
    });

    it('should interleave text around standalone generative ui in arrival order', () => {
      let messages: AssistantUIMessage[] = [];
      let state = createInitialStreamingState();

      const firstText = handleSSEEvent(messages, state, 'message', 'Thinking...');
      messages = firstText.messages;
      state = firstText.streamingState;

      const afterGenerativeUi = handleSSEEvent(
        messages,
        state,
        'generative_ui',
        JSON.stringify({
          name: 'ChartCard',
          props: { title: 'Summary' },
        } satisfies GenerativeUIDirective),
      );
      messages = afterGenerativeUi.messages;
      state = afterGenerativeUi.streamingState;

      const secondText = handleSSEEvent(messages, state, 'message', 'Done reasoning.');

      expect(secondText.messages[0].content).toEqual([
        { type: 'text', text: 'Thinking...' },
        {
          type: 'data',
          name: 'generative-ui',
          data: {
            componentName: 'ChartCard',
            props: { title: 'Summary' },
          },
        },
        { type: 'text', text: 'Done reasoning.' },
      ]);
    });

    it('should handle done event', () => {
      const messages: AssistantUIMessage[] = [];
      const state = createInitialStreamingState();
      state.accumulatedContent = 'Some content';
      state.assistantMessageId = 'msg-1';
      state.pendingToolCalls.set('tool-1', {
        type: 'tool-call',
        toolCallId: 'tool-1',
        toolName: 'calculator',
        args: {},
        argsText: '{}',
      });

      const result = handleSSEEvent(messages, state, 'done', '');

      expect(result.streamingState.accumulatedContent).toBe('');
      expect(result.streamingState.assistantMessageId).toBeNull();
      expect(result.streamingState.pendingToolCalls.size).toBe(0);
    });

    it('should handle error event', () => {
      const messages: AssistantUIMessage[] = [];
      const state = createInitialStreamingState();

      const result = handleSSEEvent(messages, state, 'error', 'Something went wrong');

      expect(result.error).toBe('Something went wrong');
    });
  });
});
