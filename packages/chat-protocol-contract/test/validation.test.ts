import { describe, expect, it } from 'vitest';

import {
  createWeatherContinuationRunRequestFixture,
  createMixedToolRunRequestFixture,
  createToolPauseFrameFixture,
  createWeatherRunRequestFixture,
  validateRunRequest,
  validateStreamFrame,
} from '../src';

describe('chat protocol contract validation', () => {
  it('validates a weather run request fixture', () => {
    const request = createWeatherRunRequestFixture();

    const result = validateRunRequest(request);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.conversationId).toBe('conv_123');
      expect(result.data.messages).toHaveLength(1);
      expect(result.data.messages[0]?.parts[0]).toMatchObject({
        type: 'text',
        text: 'how is the weather in Beijing yesterday?',
      });
    }
  });

  it('validates continuation requests with assistant and tool history', () => {
    const result = validateRunRequest({
      conversationId: 'conv_123',
      trigger: 'submit-tool-result',
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [
            {
              type: 'text',
              text: 'weather in san francisco',
            },
          ],
        },
        {
          id: 'msg_assistant_1',
          role: 'assistant',
          parts: [
            {
              type: 'tool-call',
              toolCallId: 'call_1',
              toolName: 'geocode_location',
              source: 'backend',
              state: 'input-available',
              input: { query: 'San Francisco, CA' },
            },
          ],
        },
        {
          id: 'msg_tool_1',
          role: 'tool',
          toolCallId: 'call_1',
          toolName: 'geocode_location',
          parts: [
            {
              type: 'tool-result',
              toolCallId: 'call_1',
              output: { latitude: 37.7749, longitude: -122.4194 },
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('provides a continuation fixture with assistant and tool history', () => {
    const request = createWeatherContinuationRunRequestFixture();

    expect(request.messages.some((message) => message.role === 'assistant')).toBe(true);
    expect(request.messages.some((message) => message.role === 'tool')).toBe(true);
  });

  it('accepts mixed-source tools and validates MCP provider metadata', () => {
    const result = validateRunRequest(createMixedToolRunRequestFixture());

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.context?.tools).toHaveLength(5);
      expect(result.data.context?.tools?.[3]).toMatchObject({
        name: 'analytics_lookup',
        source: 'mcp',
        providerId: 'analytics-mcp',
      });
      expect(result.data.context?.tools?.[4]).toMatchObject({
        name: 'profile_lookup',
        source: 'mcp',
        providerId: 'profile-mcp',
      });
    }
  });

  it('rejects an MCP tool without providerId', () => {
    const result = validateRunRequest({
      conversationId: 'conv_tools_poc',
      trigger: 'submit-message',
      context: {
        tools: [
          {
            name: 'analytics_lookup',
            source: 'mcp',
            description: 'Look up analytics',
            parameters: {},
          },
        ],
      },
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [
            {
              type: 'text',
              text: 'run the tool demo',
            },
          ],
        },
      ],
      metadata: {},
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join('\n')).toContain('providerId');
    }
  });

  it('rejects an MCP tool call without providerId', () => {
    const result = validateRunRequest({
      conversationId: 'conv_tools_poc',
      trigger: 'submit-message',
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [
            {
              type: 'text',
              text: 'run the tool demo',
            },
          ],
        },
        {
          id: 'msg_assistant_1',
          role: 'assistant',
          parts: [
            {
              type: 'tool-call',
              toolCallId: 'call_mcp_1',
              toolName: 'analytics_lookup',
              source: 'mcp',
              state: 'input-available',
              input: { appId: 'analytics' },
            },
          ],
        },
      ],
      metadata: {},
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join('\n')).toContain('providerId');
    }
  });

  it('rejects an empty message list', () => {
    const result = validateRunRequest({
      conversationId: 'conv_123',
      messages: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join('\n')).toContain('messages');
    }
  });

  it('rejects a message with empty text content', () => {
    const result = validateRunRequest({
      conversationId: 'conv_123',
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [
            {
              type: 'text',
              text: '',
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join('\n')).toContain('text');
    }
  });

  it('accepts a base64 PDF file part in a user message', () => {
    const result = validateRunRequest({
      conversationId: 'conv_123',
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [
            {
              type: 'text',
              text: 'Summarize this PDF',
            },
            {
              type: 'file',
              name: 'report.pdf',
              mimeType: 'application/pdf',
              sizeBytes: 12,
              data: 'JVBERi0xLjQ=',
              encoding: 'base64',
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('rejects a file part without data, fileId, or url', () => {
    const result = validateRunRequest({
      conversationId: 'conv_123',
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [
            {
              type: 'file',
              name: 'report.pdf',
              mimeType: 'application/pdf',
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join('\n')).toContain('file part requires one of url, fileId, or data');
    }
  });

  it('rejects base64 file data without base64 encoding', () => {
    const result = validateRunRequest({
      conversationId: 'conv_123',
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [
            {
              type: 'file',
              name: 'report.pdf',
              data: 'JVBERi0xLjQ=',
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join('\n')).toContain('encoding must be base64 when data is provided');
    }
  });

  it('validates a tool pause finish frame fixture', () => {
    const frame = createToolPauseFrameFixture();

    const result = validateStreamFrame(frame);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('finish');
      expect(result.data.finishReason).toBe('tool-calls');
    }
  });

  it('rejects finish frames without a finish reason', () => {
    const result = validateStreamFrame({
      type: 'finish',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join('\n')).toContain('finishReason');
    }
  });

  it('rejects tool input frames without input payload', () => {
    const result = validateStreamFrame({
      type: 'tool-input-available',
      toolCallId: 'tc_1',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join('\n')).toContain('input');
    }
  });

  it('rejects malformed tool input payload structures', () => {
    const result = validateStreamFrame({
      type: 'tool-input-available',
      toolCallId: 'tc_1',
      input: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join('\n')).toContain('input');
    }
  });

  it('rejects tool output frames without output payload', () => {
    const result = validateStreamFrame({
      type: 'tool-output-available',
      toolCallId: 'tc_1',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join('\n')).toContain('output');
    }
  });

  it('reports root-level validation errors for non-object frames', () => {
    const result = validateStreamFrame(null);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join('\n')).toContain('root');
    }
  });
});
