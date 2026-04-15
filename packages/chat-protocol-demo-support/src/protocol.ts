import type {
  ChatAssistantMessage,
  ChatMessage,
  ChatStreamFrame,
  ChatRunRequest,
  ChatUiPartAvailableFrame,
} from '@fm/chat-protocol-contract';
import { validateRunRequest } from '@fm/chat-protocol-contract';

export interface ProtocolFrameEmitter {
  emit(frame: ChatStreamFrame): void;
  finish(): void;
}

export interface ProtocolResumeService {
  streamRun(request: ChatRunRequest): AsyncIterable<ChatStreamFrame>;
}

export interface ProtocolToolAdapter {
  toolName: string;
  executionTarget: 'backend' | 'frontend';
}

export interface ProtocolCardFactory {
  createWeatherSummaryCard(input: WeatherSnapshot): ChatUiPartAvailableFrame;
}

export type ProtocolRunService = ProtocolResumeService;

export type WeatherSnapshot = {
  locationName: string;
  date: string;
  latitude: number;
  longitude: number;
  condition: string;
  summary: string;
  highC: number;
  lowC: number;
};

export type DemoConversationState = {
  conversationId: string;
  runId: string;
  userQuestion: string;
  requestedLocation: string;
  resolvedDate: string;
};

const DEFAULT_MESSAGE_ID = 'msg_asst_weather_demo';
const DATE_TOOL_CALL_ID = 'tool_date_1';
const LOCATION_TOOL_CALL_ID = 'tool_location_1';
const WEATHER_TOOL_CALL_ID = 'tool_weather_1';
const DEFAULT_RUN_ID = 'run_weather_demo';

const LOCATION_FIXTURES: Record<string, Omit<WeatherSnapshot, 'date'>> = {
  'san francisco': {
    locationName: 'San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
    condition: 'Foggy AM, sunny PM',
    summary: 'San Francisco stayed cool with morning fog and a clearer afternoon breeze.',
    highC: 18,
    lowC: 11,
  },
  beijing: {
    locationName: 'Beijing, CN',
    latitude: 39.9042,
    longitude: 116.4074,
    condition: 'Clear',
    summary: 'Beijing stayed clear and dry through the day with light wind.',
    highC: 24,
    lowC: 12,
  },
};

function getLatestUserQuestion(messages: readonly ChatMessage[]): string {
  const latestUser = [...messages].reverse().find((message) => message.role === 'user');

  if (!latestUser) {
    return '';
  }

  return latestUser.parts
    .filter((part): part is Extract<typeof part, { type: 'text' }> => part.type === 'text')
    .map((part) => part.text)
    .join(' ')
    .trim();
}

function detectLocation(question: string): string {
  const normalized = question.toLowerCase();

  if (normalized.includes('san francisco')) {
    return 'San Francisco';
  }

  if (normalized.includes('beijing')) {
    return 'Beijing';
  }

  return 'San Francisco';
}

function detectDate(question: string): string {
  const normalized = question.toLowerCase();

  if (normalized.includes('yesterday')) {
    return '2026-04-14';
  }

  if (normalized.includes('today')) {
    return '2026-04-15';
  }

  return '2026-04-15';
}

function getWeatherSnapshot(locationName: string, date: string): WeatherSnapshot {
  const key = locationName.toLowerCase();
  const base = LOCATION_FIXTURES[key] ?? LOCATION_FIXTURES['san francisco'];

  return {
    ...base,
    date,
  };
}

function getAssistantToolOutput(
  messages: readonly ChatMessage[],
  toolName: string,
): Record<string, unknown> | null {
  const assistantMessages = messages.filter(
    (message): message is ChatAssistantMessage => message.role === 'assistant',
  );

  for (const message of assistantMessages.reverse()) {
    for (const part of [...message.parts].reverse()) {
      if (part.type === 'tool-call' && part.toolName === toolName && part.output) {
        return part.output;
      }
    }
  }

  return null;
}

function buildIntroFrames(state: DemoConversationState): ChatStreamFrame[] {
  return [
    {
      type: 'start',
      conversationId: state.conversationId,
      runId: state.runId,
    },
    {
      type: 'message-start',
      messageId: DEFAULT_MESSAGE_ID,
      role: 'assistant',
    },
    {
      type: 'message-metadata',
      messageId: DEFAULT_MESSAGE_ID,
      metadata: {
        scenario: 'weather-demo',
      },
    },
    {
      type: 'reasoning-summary',
      messageId: DEFAULT_MESSAGE_ID,
      text: 'I will resolve the date first, then the location, then fetch the weather.',
    },
    {
      type: 'plan-available',
      planId: 'plan_weather_1',
      summary: `Resolve the time and location for "${state.userQuestion}", then summarize the weather.`,
    },
  ];
}

function buildInitialFrames(state: DemoConversationState): ChatStreamFrame[] {
  return [
    ...buildIntroFrames(state),
    {
      type: 'start-step',
      stepId: 'step_date',
      title: 'Resolve requested date',
    },
    {
      type: 'tool-input-start',
      toolCallId: DATE_TOOL_CALL_ID,
      toolName: 'datetime.resolve_relative_date',
      executionTarget: 'backend',
    },
    {
      type: 'tool-input-available',
      toolCallId: DATE_TOOL_CALL_ID,
      input: {
        expression: state.userQuestion.toLowerCase().includes('yesterday') ? 'yesterday' : 'today',
      },
    },
    {
      type: 'tool-output-available',
      toolCallId: DATE_TOOL_CALL_ID,
      output: {
        date: state.resolvedDate,
      },
    },
    {
      type: 'finish-step',
      stepId: 'step_date',
      status: 'completed',
    },
    {
      type: 'start-step',
      stepId: 'step_location',
      title: 'Resolve requested location',
    },
    {
      type: 'tool-input-start',
      toolCallId: LOCATION_TOOL_CALL_ID,
      toolName: 'location.resolve',
      executionTarget: 'frontend',
    },
    {
      type: 'tool-input-available',
      toolCallId: LOCATION_TOOL_CALL_ID,
      input: {
        query: state.requestedLocation,
      },
    },
    {
      type: 'finish',
      messageId: DEFAULT_MESSAGE_ID,
      finishReason: 'tool-calls',
    },
  ];
}

function buildWeatherCard(snapshot: WeatherSnapshot): ChatUiPartAvailableFrame {
  return {
    type: 'ui-part-available',
    messageId: DEFAULT_MESSAGE_ID,
    cardType: 'weather-summary',
    props: {
      location: snapshot.locationName,
      date: snapshot.date,
      condition: snapshot.condition,
      summary: snapshot.summary,
      highC: snapshot.highC,
      lowC: snapshot.lowC,
      latitude: snapshot.latitude,
      longitude: snapshot.longitude,
    },
  };
}

function buildResumeFrames(
  state: DemoConversationState,
  locationOutput: Record<string, unknown>,
): ChatStreamFrame[] {
  const snapshot = getWeatherSnapshot(state.requestedLocation, state.resolvedDate);
  const resolvedName =
    typeof locationOutput.name === 'string' ? locationOutput.name : snapshot.locationName;
  const resolvedLatitude =
    typeof locationOutput.latitude === 'number' ? locationOutput.latitude : snapshot.latitude;
  const resolvedLongitude =
    typeof locationOutput.longitude === 'number' ? locationOutput.longitude : snapshot.longitude;

  const finalSnapshot: WeatherSnapshot = {
    ...snapshot,
    locationName: resolvedName,
    latitude: resolvedLatitude,
    longitude: resolvedLongitude,
  };

  return [
    {
      type: 'start',
      conversationId: state.conversationId,
      runId: state.runId,
    },
    {
      type: 'start-step',
      stepId: 'step_weather',
      title: 'Fetch weather history',
    },
    {
      type: 'tool-input-start',
      toolCallId: WEATHER_TOOL_CALL_ID,
      toolName: 'weather.history',
      executionTarget: 'backend',
    },
    {
      type: 'tool-input-available',
      toolCallId: WEATHER_TOOL_CALL_ID,
      input: {
        date: state.resolvedDate,
        latitude: finalSnapshot.latitude,
        longitude: finalSnapshot.longitude,
      },
    },
    {
      type: 'tool-output-available',
      toolCallId: WEATHER_TOOL_CALL_ID,
      output: {
        location: finalSnapshot.locationName,
        condition: finalSnapshot.condition,
        highC: finalSnapshot.highC,
        lowC: finalSnapshot.lowC,
      },
    },
    {
      type: 'finish-step',
      stepId: 'step_weather',
      status: 'completed',
    },
    buildWeatherCard(finalSnapshot),
    {
      type: 'text-start',
      messageId: DEFAULT_MESSAGE_ID,
      partId: 'summary',
    },
    {
      type: 'text-delta',
      messageId: DEFAULT_MESSAGE_ID,
      partId: 'summary',
      delta: `${finalSnapshot.locationName} on ${finalSnapshot.date}: `,
    },
    {
      type: 'text-delta',
      messageId: DEFAULT_MESSAGE_ID,
      partId: 'summary',
      delta: `${finalSnapshot.summary} High ${finalSnapshot.highC}C, low ${finalSnapshot.lowC}C.`,
    },
    {
      type: 'text-end',
      messageId: DEFAULT_MESSAGE_ID,
      partId: 'summary',
    },
    {
      type: 'finish',
      messageId: DEFAULT_MESSAGE_ID,
      finishReason: 'stop',
    },
  ];
}

function buildFallbackFrames(request: ChatRunRequest): ChatStreamFrame[] {
  return [
    {
      type: 'start',
      conversationId: request.conversationId,
      runId: request.runId ?? DEFAULT_RUN_ID,
    },
    {
      type: 'message-start',
      messageId: DEFAULT_MESSAGE_ID,
      role: 'assistant',
    },
    {
      type: 'text-start',
      messageId: DEFAULT_MESSAGE_ID,
      partId: 'summary',
    },
    {
      type: 'text-delta',
      messageId: DEFAULT_MESSAGE_ID,
      partId: 'summary',
      delta: 'This demo currently supports deterministic weather questions only.',
    },
    {
      type: 'text-end',
      messageId: DEFAULT_MESSAGE_ID,
      partId: 'summary',
    },
    {
      type: 'finish',
      messageId: DEFAULT_MESSAGE_ID,
      finishReason: 'stop',
    },
  ];
}

export class DemoProtocolCardFactory implements ProtocolCardFactory {
  createWeatherSummaryCard(input: WeatherSnapshot): ChatUiPartAvailableFrame {
    return buildWeatherCard(input);
  }
}

export class DeterministicWeatherDemoRunService implements ProtocolRunService {
  async *streamRun(rawRequest: ChatRunRequest): AsyncIterable<ChatStreamFrame> {
    const validation = validateRunRequest(rawRequest);
    if (!validation.success) {
      yield {
        type: 'error',
        message: validation.errors.join('; '),
        code: 'invalid_request',
      };
      yield {
        type: 'finish',
        finishReason: 'error',
      };
      return;
    }

    const request = validation.data;
    const question = getLatestUserQuestion(request.messages);
    const requestedLocation = detectLocation(question);
    const resolvedDate = detectDate(question);
    const state: DemoConversationState = {
      conversationId: request.conversationId,
      runId: request.runId ?? DEFAULT_RUN_ID,
      userQuestion: question,
      requestedLocation,
      resolvedDate,
    };

    const locationOutput = getAssistantToolOutput(request.messages, 'location.resolve');
    const isResume = request.trigger === 'submit-tool-result' && locationOutput;
    const isWeatherQuestion = /\bweather\b/i.test(question);

    const frames = !isWeatherQuestion
      ? buildFallbackFrames(request)
      : isResume
        ? buildResumeFrames(state, locationOutput)
        : buildInitialFrames(state);

    for (const frame of frames) {
      yield frame;
    }
  }
}
