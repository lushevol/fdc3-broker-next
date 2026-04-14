import { describe, expect, it } from 'vitest';
import {
  applyFrameSequenceToMessage,
  createProtocolStreamAdapter,
} from '../src/runtime/createProtocolStreamAdapter';

describe('protocol stream adapter', () => {
  it('builds assistant text from text delta frames', () => {
    const message = applyFrameSequenceToMessage([
      { type: 'text-start', messageId: 'msg_asst_1' },
      { type: 'text-delta', messageId: 'msg_asst_1', delta: 'Hello' },
      { type: 'text-delta', messageId: 'msg_asst_1', delta: ' world' },
      { type: 'text-end', messageId: 'msg_asst_1' },
    ]);

    expect(message.role).toBe('assistant');
    expect(message.content).toHaveLength(1);
    expect(message.content[0]).toMatchObject({ type: 'text', text: 'Hello world' });
  });

  it('turns tool input frames into tool-call parts', () => {
    const message = applyFrameSequenceToMessage([
      {
        type: 'tool-input-start',
        toolCallId: 'tool_1',
        toolName: 'lookup_weather',
        executionTarget: 'frontend',
      },
      { type: 'tool-input-delta', toolCallId: 'tool_1', delta: '{"location":"' },
      { type: 'tool-input-delta', toolCallId: 'tool_1', delta: 'Beijing"}' },
      { type: 'tool-input-available', toolCallId: 'tool_1', input: { location: 'Beijing' } },
    ]);

    expect(message.content).toHaveLength(1);
    expect(message.content[0]).toMatchObject({
      type: 'tool-call',
      toolCallId: 'tool_1',
      toolName: 'lookup_weather',
      executionTarget: 'frontend',
      input: { location: 'Beijing' },
    });
  });

  it('keeps separate text parts stable by partId across streamed frames', () => {
    const adapter = createProtocolStreamAdapter();

    adapter.applyFrame({ type: 'text-start', messageId: 'msg_asst_1', partId: 'intro' });
    adapter.applyFrame({ type: 'text-delta', messageId: 'msg_asst_1', partId: 'intro', delta: 'Hello' });
    adapter.applyFrame({ type: 'text-start', messageId: 'msg_asst_1', partId: 'summary' });
    adapter.applyFrame({ type: 'text-delta', messageId: 'msg_asst_1', partId: 'summary', delta: 'World' });
    adapter.applyFrame({ type: 'text-delta', messageId: 'msg_asst_1', partId: 'intro', delta: ' again' });

    expect(adapter.getMessage().content).toEqual([
      { type: 'text', text: 'Hello again' },
      { type: 'text', text: 'World' },
    ]);
  });

  it('preserves text and tool state when continuing from an existing message', () => {
    const initialMessage = applyFrameSequenceToMessage([
      { type: 'text-start', messageId: 'msg_asst_1', partId: 'intro' },
      { type: 'text-delta', messageId: 'msg_asst_1', partId: 'intro', delta: 'Hello' },
      {
        type: 'tool-input-start',
        toolCallId: 'tool_1',
        toolName: 'lookup_weather',
        executionTarget: 'frontend',
      },
      { type: 'tool-input-available', toolCallId: 'tool_1', input: { location: 'Beijing' } },
    ]);

    const adapter = createProtocolStreamAdapter(initialMessage);
    adapter.applyFrames([
      { type: 'text-delta', messageId: 'msg_asst_1', partId: 'intro', delta: ' again' },
      { type: 'tool-output-available', toolCallId: 'tool_1', output: { temperatureC: 22 } },
    ]);

    expect(adapter.getMessage().content).toEqual([
      { type: 'text', text: 'Hello again' },
      {
        type: 'tool-call',
        toolCallId: 'tool_1',
        toolName: 'lookup_weather',
        executionTarget: 'frontend',
        state: 'output-available',
        input: { location: 'Beijing' },
        output: { temperatureC: 22 },
      },
    ]);
  });
});
