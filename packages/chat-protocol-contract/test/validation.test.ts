import { describe, expect, it } from 'vitest';

import {
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
