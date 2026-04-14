import { describe, expect, it } from 'vitest';
import { DeterministicWeatherRunService, serializeSseFrame } from '../src';
import type { ChatRunRequest, ChatAssistantMessage } from '@fm/chat-protocol-contract';

describe('DeterministicWeatherRunService', () => {
  it('streams an initial weather flow that pauses for frontend tools', async () => {
    const service = new DeterministicWeatherRunService();
    const request: ChatRunRequest = {
      conversationId: 'conv_demo',
      trigger: 'submit-message',
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [{ type: 'text', text: 'What is the weather in San Francisco yesterday?' }],
          metadata: {},
        },
      ],
      metadata: {},
    };

    const frames = [];
    for await (const frame of service.streamRun(request)) {
      frames.push(frame);
    }

    expect(frames.map((frame) => frame.type)).toContain('reasoning-summary');
    expect(frames.map((frame) => frame.type)).toContain('plan-available');
    expect(frames).toContainEqual(
      expect.objectContaining({
        type: 'tool-input-start',
        toolName: 'location.resolve',
        executionTarget: 'frontend',
      }),
    );
    expect(frames.at(-1)).toEqual(
      expect.objectContaining({
        type: 'finish',
        finishReason: 'tool-calls',
      }),
    );
  });

  it('continues a resumed run into weather output and summary text', async () => {
    const service = new DeterministicWeatherRunService();
    const assistantMessage: ChatAssistantMessage = {
      id: 'msg_asst_weather_demo',
      role: 'assistant',
      parts: [
        {
          type: 'tool-call',
          toolCallId: 'tool_location_1',
          toolName: 'location.resolve',
          executionTarget: 'frontend',
          state: 'output-available',
          input: { query: 'San Francisco' },
          output: { name: 'San Francisco, CA', latitude: 37.7749, longitude: -122.4194 },
        },
      ],
      metadata: {},
    };

    const request: ChatRunRequest = {
      conversationId: 'conv_demo',
      trigger: 'submit-tool-result',
      messages: [
        {
          id: 'msg_user_1',
          role: 'user',
          parts: [{ type: 'text', text: 'What is the weather in San Francisco yesterday?' }],
          metadata: {},
        },
        assistantMessage,
      ],
      metadata: {},
    };

    const frames = [];
    for await (const frame of service.streamRun(request)) {
      frames.push(frame);
    }

    expect(frames).toContainEqual(
      expect.objectContaining({
        type: 'tool-input-start',
        toolName: 'weather.history',
      }),
    );
    expect(frames).toContainEqual(
      expect.objectContaining({
        type: 'ui-part-available',
        cardType: 'weather-summary',
      }),
    );
    expect(frames.at(-1)).toEqual(
      expect.objectContaining({
        type: 'finish',
        finishReason: 'stop',
      }),
    );
  });

  it('serializes SSE frames in browser-readable format', () => {
    expect(
      serializeSseFrame({
        type: 'finish',
        finishReason: 'stop',
      }),
    ).toBe('data: {"type":"finish","finishReason":"stop"}\n\n');
  });
});
