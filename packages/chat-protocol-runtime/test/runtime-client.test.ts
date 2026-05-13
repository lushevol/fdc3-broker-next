import { describe, expect, it, vi } from 'vitest';
import type { ThreadMessage } from '@assistant-ui/react';
import type {
  ChatRunRequest,
  ChatStreamFrame,
  ChatToolDescriptor,
} from '@fm/chat-protocol-contract';
import {
  buildChatProtocolRequest,
  buildHumanToolResumeRequest,
  parseSseFrames,
  streamProtocolRun,
  toProtocolMessages,
} from '../src/runtime/client';

function createSseResponse(frames: readonly ChatStreamFrame[]): Response {
  const body = frames.map((frame) => `data: ${JSON.stringify(frame)}\n\n`).join('');

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
}

describe('runtime client', () => {
  it('converts assistant-ui thread messages into protocol messages including tool results', async () => {
    const messages: ThreadMessage[] = [
      {
        id: 'msg_user_1',
        role: 'user',
        createdAt: new Date('2026-04-17T00:00:00Z'),
        status: { type: 'complete', reason: 'stop' },
        metadata: {
          custom: { origin: 'demo' },
          unstable_annotations: [],
          unstable_data: [],
          unstable_state: null,
          steps: [],
        },
        content: [{ type: 'text', text: 'Weather in Beijing?' }],
      },
      {
        id: 'msg_asst_1',
        role: 'assistant',
        createdAt: new Date('2026-04-17T00:00:01Z'),
        status: { type: 'requires-action', reason: 'tool-calls' },
        metadata: {
          custom: {},
          unstable_annotations: [],
          unstable_data: [],
          unstable_state: null,
          steps: [],
        },
        content: [
          {
            type: 'tool-call',
            toolCallId: 'tool_1',
            toolName: 'location.resolve',
            args: { query: 'Beijing' },
            argsText: '{"query":"Beijing"}',
            result: { name: 'Beijing, CN' },
          },
        ],
      },
      {
        id: 'msg_tool_1',
        role: 'tool',
        createdAt: new Date('2026-04-17T00:00:02Z'),
        status: { type: 'complete', reason: 'stop' },
        metadata: {
          custom: {},
          unstable_annotations: [],
          unstable_data: [],
          unstable_state: null,
          steps: [],
        },
        content: [
          {
            type: 'tool-result',
            toolCallId: 'tool_1',
            result: { name: 'Beijing, CN' },
          },
        ],
      } as unknown as ThreadMessage,
    ];

    await expect(toProtocolMessages(messages)).resolves.toEqual([
      {
        id: 'msg_user_1',
        role: 'user',
        parts: [{ type: 'text', text: 'Weather in Beijing?' }],
        metadata: { origin: 'demo' },
      },
      {
        id: 'msg_asst_1',
        role: 'assistant',
        parts: [
          {
            type: 'tool-call',
            toolCallId: 'tool_1',
            toolName: 'location.resolve',
            source: 'backend',
            state: 'output-available',
            input: { query: 'Beijing' },
            output: { name: 'Beijing, CN' },
          },
        ],
        metadata: {},
      },
      {
        id: 'msg_tool_1',
        role: 'tool',
        toolCallId: 'tool_1',
        toolName: 'location.resolve',
        parts: [
          {
            type: 'tool-result',
            toolCallId: 'tool_1',
            output: { name: 'Beijing, CN' },
          },
        ],
        metadata: {},
      },
    ]);
  });

  it('converts user text and PDF attachments into protocol parts', async () => {
    const pdf = new File(['%PDF-1.4'], 'report.pdf', { type: 'application/pdf' });
    const messages = [
      {
        id: 'msg_user_1',
        role: 'user',
        content: [
          { type: 'text', text: 'Summarize this' },
          {
            type: 'file',
            file: pdf,
            filename: 'report.pdf',
            mimeType: 'application/pdf',
          },
        ],
        metadata: { custom: {} },
      },
    ];

    const result = await toProtocolMessages(messages as never);

    expect(result[0]).toMatchObject({
      id: 'msg_user_1',
      role: 'user',
      parts: [
        { type: 'text', text: 'Summarize this' },
        {
          type: 'file',
          name: 'report.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 8,
          encoding: 'base64',
        },
      ],
    });
    expect(result[0]?.parts[1]).toHaveProperty('data');
  });

  it('builds a submit-message run request with tools and metadata', () => {
    const tools: ChatToolDescriptor[] = [
      {
        name: 'location.resolve',
        source: 'frontend',
        description: 'Resolve a location',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    ];

    const request = buildChatProtocolRequest({
      conversationId: 'conv_demo',
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [{ type: 'text', text: 'Weather in Beijing?' }],
        },
      ],
      tools,
      metadata: { origin: 'demo' },
    });

    expect(request).toEqual<ChatRunRequest>({
      conversationId: 'conv_demo',
      trigger: 'submit-message',
      context: { tools },
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [{ type: 'text', text: 'Weather in Beijing?' }],
        },
      ],
      metadata: { origin: 'demo' },
    });
  });

  it('parses SSE responses into protocol frames', async () => {
    const frames: ChatStreamFrame[] = [
      { type: 'start', conversationId: 'conv_demo', runId: 'run_1' },
      { type: 'text-delta', messageId: 'msg_asst_1', delta: 'Hello' },
      { type: 'finish', finishReason: 'stop', messageId: 'msg_asst_1' },
    ];

    await expect(Array.fromAsync(parseSseFrames(createSseResponse(frames)))).resolves.toEqual(
      frames,
    );
  });

  it('auto-resolves frontend tools and resumes the run', async () => {
    const firstResponse = createSseResponse([
      { type: 'start', conversationId: 'conv_demo', runId: 'run_1' },
      { type: 'message-start', messageId: 'msg_asst_1', role: 'assistant' },
      {
        type: 'tool-input-start',
        toolCallId: 'tool_1',
        toolName: 'location.resolve',
        source: 'frontend',
      },
      {
        type: 'tool-input-available',
        toolCallId: 'tool_1',
        input: { query: 'Beijing' },
        source: 'frontend',
      },
      { type: 'finish', finishReason: 'tool-calls', messageId: 'msg_asst_1' },
    ]);

    const secondResponse = createSseResponse([
      { type: 'start', conversationId: 'conv_demo', runId: 'run_1' },
      { type: 'message-start', messageId: 'msg_asst_2', role: 'assistant' },
      { type: 'text-start', messageId: 'msg_asst_2' },
      { type: 'text-delta', messageId: 'msg_asst_2', delta: 'Resolved Beijing.' },
      { type: 'finish', finishReason: 'stop', messageId: 'msg_asst_2' },
    ]);

    const fetchMock = vi
      .fn<(_: RequestInfo | URL, __?: RequestInit) => Promise<Response>>()
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(secondResponse);

    const request = buildChatProtocolRequest({
      conversationId: 'conv_demo',
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [{ type: 'text', text: 'Weather in Beijing?' }],
        },
      ],
    });

    const frames = await Array.fromAsync(
      streamProtocolRun({
        request,
        fetch: fetchMock,
        url: 'http://127.0.0.1:8080/api/chat/runs',
        resolveFrontendTool: async (toolCall) => {
          expect(toolCall.toolName).toBe('location.resolve');
          return { name: 'Beijing, CN', latitude: 39.9042, longitude: 116.4074 };
        },
      }),
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[1]?.body).toContain('"trigger":"submit-tool-result"');
    expect(frames).toContainEqual({
      type: 'tool-output-available',
      toolCallId: 'tool_1',
      output: { name: 'Beijing, CN', latitude: 39.9042, longitude: 116.4074 },
      source: 'frontend',
    });
    expect(frames.at(-1)).toEqual({
      type: 'finish',
      finishReason: 'stop',
      messageId: 'msg_asst_2',
    });
  });

  it('stops when the backend re-issues an already resolved frontend tool', async () => {
    const firstResponse = createSseResponse([
      { type: 'start', conversationId: 'conv_demo', runId: 'run_1' },
      { type: 'message-start', messageId: 'msg_asst_1', role: 'assistant' },
      {
        type: 'tool-input-start',
        toolCallId: 'tool_1',
        toolName: 'profile_lookup',
        source: 'frontend',
      },
      {
        type: 'tool-input-available',
        toolCallId: 'tool_1',
        input: { userId: '123' },
        source: 'frontend',
      },
      { type: 'finish', finishReason: 'tool-calls', messageId: 'msg_asst_1' },
    ]);

    const repeatedToolResponse = createSseResponse([
      { type: 'start', conversationId: 'conv_demo', runId: 'run_1' },
      { type: 'message-start', messageId: 'msg_asst_2', role: 'assistant' },
      {
        type: 'tool-input-start',
        toolCallId: 'tool_1',
        toolName: 'profile_lookup',
        source: 'frontend',
      },
      {
        type: 'tool-input-available',
        toolCallId: 'tool_1',
        input: { userId: '123' },
        source: 'frontend',
      },
      { type: 'finish', finishReason: 'tool-calls', messageId: 'msg_asst_2' },
    ]);

    const fetchMock = vi
      .fn<(_: RequestInfo | URL, __?: RequestInit) => Promise<Response>>()
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(repeatedToolResponse);

    const resolveFrontendTool = vi.fn(async () => ({ id: '123', name: 'Ada Lovelace' }));

    const request = buildChatProtocolRequest({
      conversationId: 'conv_demo',
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [{ type: 'text', text: 'Show profile 123' }],
        },
      ],
    });

    const frames = await Array.fromAsync(
      streamProtocolRun({
        request,
        fetch: fetchMock,
        url: 'http://127.0.0.1:8080/api/chat/runs',
        resolveFrontendTool,
      }),
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(resolveFrontendTool).toHaveBeenCalledTimes(1);
    expect(frames).toContainEqual({
      type: 'tool-output-error',
      toolCallId: 'tool_1',
      error:
        'Frontend tool "profile_lookup" was already resolved earlier in this run. Refusing to execute it again.',
      source: 'frontend',
    });
  });

  it('builds a submit-tool-result request for human tool approval continuations', () => {
    const request = buildHumanToolResumeRequest({
      conversationId: 'conv_demo',
      runId: 'run_human',
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [{ type: 'text', text: 'Send the email' }],
        },
        {
          id: 'msg_asst_1',
          role: 'assistant',
          parts: [
            {
              type: 'tool-call',
              toolCallId: 'tool_human_1',
              toolName: 'approval_confirm',
              source: 'human',
              state: 'output-available',
              input: { to: 'ops@example.com', subject: 'Daily report' },
              output: { confirmed: true },
            },
          ],
          metadata: {},
        },
      ],
      toolCallId: 'tool_human_1',
      toolName: 'approval_confirm',
      result: { confirmed: true },
      tools: [
        {
          name: 'approval_confirm',
          source: 'human',
          description: 'Send an email with confirmation',
          parameters: { type: 'object', properties: {}, required: [] },
        },
      ],
      metadata: { origin: 'demo' },
    });

    expect(request).toEqual({
      conversationId: 'conv_demo',
      runId: 'run_human',
      trigger: 'submit-tool-result',
      context: {
        tools: [
          {
            name: 'approval_confirm',
            source: 'human',
            description: 'Send an email with confirmation',
            parameters: { type: 'object', properties: {}, required: [] },
          },
        ],
      },
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [{ type: 'text', text: 'Send the email' }],
        },
        {
          id: 'msg_asst_1',
          role: 'assistant',
          parts: [
            {
              type: 'tool-call',
              toolCallId: 'tool_human_1',
              toolName: 'approval_confirm',
              source: 'human',
              state: 'output-available',
              input: { to: 'ops@example.com', subject: 'Daily report' },
              output: { confirmed: true },
            },
          ],
          metadata: {},
        },
        {
          id: 'tool_human_1-tool-result',
          role: 'tool',
          toolCallId: 'tool_human_1',
          toolName: 'approval_confirm',
          parts: [
            {
              type: 'tool-result',
              toolCallId: 'tool_human_1',
              output: { confirmed: true },
            },
          ],
          metadata: {},
        },
      ],
      metadata: { origin: 'demo' },
    });
  });
});
