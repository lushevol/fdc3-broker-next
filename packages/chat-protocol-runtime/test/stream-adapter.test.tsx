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
        type: 'message-metadata',
        messageId: 'msg_asst_1',
        metadata: {
          toolIdentity: {
            source: 'frontend',
            toolCallId: 'tool_1',
            toolName: 'lookup_weather',
          },
        },
      },
      {
        type: 'tool-input-start',
        toolCallId: 'tool_1',
        toolName: 'lookup_weather',
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
      source: 'frontend',
      input: { location: 'Beijing' },
    });
  });

  it('maps reasoning and planning frames into assistant parts', () => {
    const message = applyFrameSequenceToMessage([
      { type: 'reasoning-summary', text: 'Resolve date, then location.' },
      { type: 'plan-available', planId: 'plan_1', summary: 'Resolve and summarize weather.' },
      { type: 'start-step', stepId: 'step_1', title: 'Resolve date' },
      { type: 'finish-step', stepId: 'step_1', status: 'completed' },
    ]);

    expect(message.content).toEqual([
      { type: 'reasoning-summary', text: 'Resolve date, then location.' },
      { type: 'plan', planId: 'plan_1', summary: 'Resolve and summarize weather.' },
      { type: 'step', stepId: 'step_1', title: 'Resolve date', status: 'completed' },
    ]);
  });

  it('keeps text deltas in stream order when a partId resumes after another text part', () => {
    const adapter = createProtocolStreamAdapter();

    adapter.applyFrame({ type: 'text-start', messageId: 'msg_asst_1', partId: 'intro' });
    adapter.applyFrame({
      type: 'text-delta',
      messageId: 'msg_asst_1',
      partId: 'intro',
      delta: 'Hello',
    });
    adapter.applyFrame({ type: 'text-start', messageId: 'msg_asst_1', partId: 'summary' });
    adapter.applyFrame({
      type: 'text-delta',
      messageId: 'msg_asst_1',
      partId: 'summary',
      delta: 'World',
    });
    adapter.applyFrame({
      type: 'text-delta',
      messageId: 'msg_asst_1',
      partId: 'intro',
      delta: ' again',
    });

    expect(adapter.getMessage().content).toEqual([
      { type: 'text', text: 'Hello' },
      { type: 'text', text: 'World' },
      { type: 'text', text: ' again' },
    ]);
  });

  it('keeps unkeyed text deltas after tool calls in stream order', () => {
    const message = applyFrameSequenceToMessage([
      { type: 'text-delta', messageId: 'msg_asst_1', delta: 'Before ' },
      {
        type: 'tool-input-start',
        toolCallId: 'tool_1',
        toolName: 'lookup_weather',
      },
      {
        type: 'tool-input-available',
        toolCallId: 'tool_1',
        input: { location: 'Beijing' },
      },
      { type: 'text-delta', messageId: 'msg_asst_1', delta: 'after.' },
    ]);

    expect(message.content).toEqual([
      { type: 'text', text: 'Before ' },
      {
        type: 'tool-call',
        toolCallId: 'tool_1',
        toolName: 'lookup_weather',
        source: 'frontend',
        state: 'input-available',
        input: { location: 'Beijing' },
      },
      { type: 'text', text: 'after.' },
    ]);
  });

  it('keeps keyed text deltas after tool calls in stream order when providers reuse partId', () => {
    const message = applyFrameSequenceToMessage([
      { type: 'text-start', messageId: 'msg_asst_1', partId: 'text-1' },
      { type: 'text-delta', messageId: 'msg_asst_1', partId: 'text-1', delta: 'Before ' },
      { type: 'text-end', messageId: 'msg_asst_1', partId: 'text-1' },
      {
        type: 'tool-input-start',
        toolCallId: 'tool_1',
        toolName: 'lookup_weather',
      },
      {
        type: 'tool-input-available',
        toolCallId: 'tool_1',
        input: { location: 'Beijing' },
      },
      { type: 'text-start', messageId: 'msg_asst_1', partId: 'text-1' },
      { type: 'text-delta', messageId: 'msg_asst_1', partId: 'text-1', delta: 'after.' },
      { type: 'text-end', messageId: 'msg_asst_1', partId: 'text-1' },
    ]);

    expect(message.content).toEqual([
      { type: 'text', text: 'Before ' },
      {
        type: 'tool-call',
        toolCallId: 'tool_1',
        toolName: 'lookup_weather',
        source: 'frontend',
        state: 'input-available',
        input: { location: 'Beijing' },
      },
      { type: 'text', text: 'after.' },
    ]);
  });

  it('preserves tool state and appends continued text after existing tool parts', () => {
    const initialMessage = applyFrameSequenceToMessage([
      {
        type: 'message-metadata',
        messageId: 'msg_asst_1',
        metadata: {
          toolIdentity: {
            source: 'frontend',
            toolCallId: 'tool_1',
            toolName: 'lookup_weather',
          },
        },
      },
      { type: 'text-start', messageId: 'msg_asst_1', partId: 'intro' },
      { type: 'text-delta', messageId: 'msg_asst_1', partId: 'intro', delta: 'Hello' },
      {
        type: 'tool-input-start',
        toolCallId: 'tool_1',
        toolName: 'lookup_weather',
      },
      { type: 'tool-input-available', toolCallId: 'tool_1', input: { location: 'Beijing' } },
    ]);

    const adapter = createProtocolStreamAdapter(initialMessage);
    adapter.applyFrames([
      { type: 'text-delta', messageId: 'msg_asst_1', partId: 'intro', delta: ' again' },
      { type: 'tool-output-available', toolCallId: 'tool_1', output: { temperatureC: 22 } },
    ]);

    expect(adapter.getMessage().content).toEqual([
      { type: 'text', text: 'Hello' },
      {
        type: 'tool-call',
        toolCallId: 'tool_1',
        toolName: 'lookup_weather',
        source: 'frontend',
        state: 'output-available',
        input: { location: 'Beijing' },
        output: { temperatureC: 22 },
      },
      { type: 'text', text: ' again' },
    ]);
  });

  it('keeps backend tool frames in running state until the stream finishes', () => {
    const adapter = createProtocolStreamAdapter();

    adapter.applyFrame({
      type: 'message-metadata',
      messageId: 'msg_asst_1',
      metadata: {
        toolIdentity: {
          source: 'backend',
          toolCallId: 'tool_backend_1',
          toolName: 'get_weather',
        },
      },
    });
    adapter.applyFrame({
      type: 'tool-input-start',
      toolCallId: 'tool_backend_1',
      toolName: 'get_weather',
    });
    adapter.applyFrame({
      type: 'tool-input-available',
      toolCallId: 'tool_backend_1',
      input: { location: 'San Francisco, US' },
    });

    expect(adapter.getMessage().status).toEqual({ type: 'running' });

    adapter.applyFrame({
      type: 'tool-output-available',
      toolCallId: 'tool_backend_1',
      output: { location: 'San Francisco, US', temperature: 22 },
    });
    adapter.applyFrame({
      type: 'finish',
      finishReason: 'stop',
      messageId: 'msg_asst_1',
    });

    expect(adapter.getMessage().status).toEqual({ type: 'complete', reason: 'stop' });
  });

  it('maps human source to awaiting-human state', () => {
    const adapter = createProtocolStreamAdapter();
    adapter.applyFrame({ type: 'start', conversationId: 'conv_human_test', runId: 'run_1' });
    adapter.applyFrame({ type: 'message-start', messageId: 'msg_asst_1', role: 'assistant' });
    adapter.applyFrame({
      type: 'tool-input-start',
      toolCallId: 'tool_human_1',
      toolName: 'approval_confirm',
      source: 'human',
    });
    adapter.applyFrame({
      type: 'tool-input-available',
      toolCallId: 'tool_human_1',
      input: { decision: 'approve analytics lookup' },
      source: 'human',
    });

    const message = adapter.getMessage();
    const toolPart = message.content.find((part) => part.type === 'tool-call');
    expect(toolPart).toMatchObject({
      type: 'tool-call',
      toolCallId: 'tool_human_1',
      toolName: 'approval_confirm',
      source: 'human',
      state: 'awaiting-human',
    });
  });

  it('emits interrupt metadata for pending human tools when action is required', () => {
    const adapter = createProtocolStreamAdapter();
    adapter.applyFrame({ type: 'start', conversationId: 'conv_human_test', runId: 'run_1' });
    adapter.applyFrame({ type: 'message-start', messageId: 'msg_asst_human', role: 'assistant' });
    adapter.applyFrame({
      type: 'tool-input-start',
      toolCallId: 'tool_human_1',
      toolName: 'approval_confirm',
      source: 'human',
    });
    adapter.applyFrame({
      type: 'tool-input-available',
      toolCallId: 'tool_human_1',
      input: {
        to: 'ops@example.com',
        subject: 'Daily report',
      },
      source: 'human',
    });
    adapter.applyFrame({
      type: 'finish',
      finishReason: 'action-required',
      messageId: 'msg_asst_human',
    });

    const threadMessage = adapter.toThreadMessage();
    const toolPart = threadMessage.content.find(
      (part) => part.type === 'tool-call' && part.toolCallId === 'tool_human_1',
    );

    expect(threadMessage.status).toEqual({ type: 'requires-action', reason: 'interrupt' });
    expect(toolPart).toMatchObject({
      type: 'tool-call',
      toolCallId: 'tool_human_1',
      toolName: 'approval_confirm',
      args: {
        to: 'ops@example.com',
        subject: 'Daily report',
      },
      interrupt: {
        type: 'human',
        payload: {
          toolCallId: 'tool_human_1',
          toolName: 'approval_confirm',
          source: 'human',
          input: {
            to: 'ops@example.com',
            subject: 'Daily report',
          },
        },
      },
    });
  });

  it('uses inline source on tool-input-start when no metadata is present', () => {
    const adapter = createProtocolStreamAdapter();
    adapter.applyFrame({ type: 'start', conversationId: 'conv_inline_test', runId: 'run_1' });
    adapter.applyFrame({ type: 'message-start', messageId: 'msg_asst_1', role: 'assistant' });
    adapter.applyFrame({
      type: 'tool-input-start',
      toolCallId: 'tool_mcp_inline',
      toolName: 'analytics_lookup',
      source: 'mcp',
      providerId: 'analytics-mcp',
    });
    adapter.applyFrame({
      type: 'tool-input-available',
      toolCallId: 'tool_mcp_inline',
      input: { appId: 'weather-tile' },
    });

    const message = adapter.getMessage();
    const toolPart = message.content.find((part) => part.type === 'tool-call');
    expect(toolPart).toMatchObject({
      type: 'tool-call',
      toolCallId: 'tool_mcp_inline',
      toolName: 'analytics_lookup',
      source: 'mcp',
      providerId: 'analytics-mcp',
      state: 'awaiting-execution',
    });
  });

  it('uses inline source on tool-input-available for backend tools', () => {
    const adapter = createProtocolStreamAdapter();
    adapter.applyFrame({ type: 'start', conversationId: 'conv_backend_test', runId: 'run_1' });
    adapter.applyFrame({ type: 'message-start', messageId: 'msg_asst_1', role: 'assistant' });
    adapter.applyFrame({
      type: 'tool-input-start',
      toolCallId: 'tool_backend_1',
      toolName: 'summary_compose',
      source: 'backend',
    });
    adapter.applyFrame({
      type: 'tool-input-available',
      toolCallId: 'tool_backend_1',
      input: { text: 'compose' },
      source: 'backend',
    });

    const message = adapter.getMessage();
    const toolPart = message.content.find((part) => part.type === 'tool-call');
    expect(toolPart).toMatchObject({
      type: 'tool-call',
      toolCallId: 'tool_backend_1',
      toolName: 'summary_compose',
      source: 'backend',
      state: 'awaiting-execution',
    });
  });

  it('patches an already rendered tool call when source metadata arrives later', () => {
    const adapter = createProtocolStreamAdapter();

    adapter.applyFrame({
      type: 'tool-input-available',
      toolCallId: 'tool_mcp_1',
      input: { appId: 'weather-tile' },
    });
    adapter.applyFrame({
      type: 'message-metadata',
      messageId: 'msg_asst_1',
      metadata: {
        toolIdentity: {
          source: 'mcp',
          toolCallId: 'tool_mcp_1',
          toolName: 'analytics_lookup',
          providerId: 'analytics-mcp',
        },
      },
    });

    const message = adapter.getMessage();
    const toolPart = message.content.find((part) => part.type === 'tool-call');
    expect(toolPart).toMatchObject({
      type: 'tool-call',
      toolCallId: 'tool_mcp_1',
      toolName: 'analytics_lookup',
      source: 'mcp',
      providerId: 'analytics-mcp',
      state: 'awaiting-execution',
    });
  });
});
