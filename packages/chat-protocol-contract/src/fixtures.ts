import type { ChatRunRequest, ChatStreamFrame } from './types';

export function createWeatherRunRequestFixture(): ChatRunRequest {
  return {
    conversationId: 'conv_123',
    runId: null,
    trigger: 'submit-message',
    config: {
      modelName: 'openai/gpt-4.1',
      reasoningVisibility: 'summary',
    },
    context: {
      workspace: {
        activeWorkspaceId: 'ws_1',
        activeAppId: 'weather-tile',
      },
      frontendTools: [
        {
          name: 'location.resolve',
          description: 'Resolve a location in the frontend/runtime context',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
              },
            },
            required: ['query'],
          },
          interactionMode: 'auto',
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
            text: 'how is the weather in Beijing yesterday?',
          },
        ],
        metadata: {},
      },
    ],
    metadata: {},
  };
}

export function createToolPauseFrameFixture(): ChatStreamFrame {
  return {
    type: 'finish',
    finishReason: 'tool-calls',
    messageId: 'msg_asst_1',
  };
}
