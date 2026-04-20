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
      tools: [
        {
          name: 'location.resolve',
          source: 'frontend',
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

export function createMixedToolRunRequestFixture(): ChatRunRequest {
  return {
    conversationId: 'conv_tools_fixture',
    runId: null,
    trigger: 'submit-message',
    context: {
      tools: [
        {
          name: 'location.resolve',
          source: 'frontend',
          description: 'Resolve a location in the runtime',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'approval_confirm',
          source: 'human',
          description: 'Confirm a user decision',
          parameters: {
            type: 'object',
            properties: {
              decision: {
                type: 'string',
              },
            },
            required: ['decision'],
          },
        },
        {
          name: 'summary_compose',
          source: 'backend',
          description: 'Compose a final summary',
          parameters: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
              },
            },
            required: ['text'],
          },
        },
        {
          name: 'analytics_lookup',
          source: 'mcp',
          providerId: 'analytics-mcp',
          description: 'Look up analytics',
          parameters: {
            type: 'object',
            properties: {
              appId: {
                type: 'string',
              },
            },
            required: ['appId'],
          },
        },
        {
          name: 'profile_lookup',
          source: 'mcp',
          providerId: 'profile-mcp',
          description: 'Look up user profile context',
          parameters: {
            type: 'object',
            properties: {
              userId: {
                type: 'string',
              },
            },
            required: ['userId'],
          },
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
        metadata: {},
      },
    ],
    metadata: {},
  };
}

export function createWeatherContinuationRunRequestFixture(): ChatRunRequest {
  return {
    conversationId: 'conv_123',
    runId: 'run_002',
    trigger: 'submit-tool-result',
    config: {
      modelName: 'openai/gpt-4.1',
      reasoningVisibility: 'summary',
    },
    messages: [
      {
        id: 'msg_user_1',
        role: 'user',
        parts: [
          {
            type: 'text',
            text: 'what is the weather in San Francisco?',
          },
        ],
        metadata: {},
      },
      {
        id: 'msg_assistant_1',
        role: 'assistant',
        parts: [
          {
            type: 'step-start',
            stepId: 'step_1',
            title: 'Resolve location',
          },
          {
            type: 'tool-call',
            toolCallId: 'call_geocode_1',
            toolName: 'geocode_location',
            source: 'backend',
            state: 'output-available',
            input: {
              query: 'San Francisco',
            },
            output: {
              latitude: 37.77493,
              longitude: -122.41942,
            },
          },
        ],
        metadata: {},
      },
      {
        id: 'msg_tool_1',
        role: 'tool',
        toolCallId: 'call_geocode_1',
        toolName: 'geocode_location',
        parts: [
          {
            type: 'tool-result',
            toolCallId: 'call_geocode_1',
            output: {
              latitude: 37.77493,
              longitude: -122.41942,
              country: 'United States',
              admin1: 'California',
            },
          },
        ],
        metadata: {},
      },
      {
        id: 'msg_assistant_2',
        role: 'assistant',
        parts: [
          {
            type: 'step-start',
            stepId: 'step_2',
            title: 'Fetch weather',
          },
          {
            type: 'tool-call',
            toolCallId: 'call_weather_1',
            toolName: 'weather_search',
            source: 'backend',
            state: 'input-available',
            input: {
              query: 'San Francisco, CA',
              latitude: 37.77493,
              longitude: -122.41942,
            },
          },
        ],
        metadata: {},
      },
      {
        id: 'msg_tool_2',
        role: 'tool',
        toolCallId: 'call_weather_1',
        toolName: 'weather_search',
        parts: [
          {
            type: 'tool-result',
            toolCallId: 'call_weather_1',
            output: {
              temperatureC: 18,
              summary: 'Partly cloudy',
            },
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
