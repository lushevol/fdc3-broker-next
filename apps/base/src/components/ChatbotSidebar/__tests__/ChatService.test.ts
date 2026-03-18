import { ChatService } from '../common/ChatService';

class MockEventSource {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  close = jest.fn();
  addEventListener = jest.fn((type: string, listener: (event: MessageEvent) => void) => {
    this.listeners.set(type, listener);
  });

  private listeners = new Map<string, (event: MessageEvent) => void>();

  constructor(public url: string) {
    (global as unknown as { __chatServiceEventSource?: MockEventSource }).__chatServiceEventSource =
      this;
  }

  emit(type: string, data: string) {
    const listener = this.listeners.get(type);
    if (listener) {
      listener(new MessageEvent(type, { data }));
      return;
    }

    if (type === 'message' && this.onmessage) {
      this.onmessage(new MessageEvent(type, { data }));
    }
  }
}

(global as unknown as { EventSource: typeof MockEventSource }).EventSource = MockEventSource;

describe('ChatService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (global as unknown as { __chatServiceEventSource?: MockEventSource })
      .__chatServiceEventSource;
  });

  it('forwards conversation_id events through the shared SSE contract', () => {
    const service = new ChatService({ baseUrl: 'http://localhost:8080/api/chat' });
    const onEvent = jest.fn();

    service.createStreamConnection('Hello', null, onEvent, jest.fn(), jest.fn());

    const eventSource = (global as unknown as { __chatServiceEventSource: MockEventSource })
      .__chatServiceEventSource;
    eventSource.emit('conversation_id', 'conv-123');

    expect(onEvent).toHaveBeenCalledWith({
      type: 'conversation_id',
      data: 'conv-123',
    });
  });

  it('forwards tool_call events as parsed payloads', () => {
    const service = new ChatService({ baseUrl: 'http://localhost:8080/api/chat' });
    const onEvent = jest.fn();

    service.createStreamConnection('Hello', null, onEvent, jest.fn(), jest.fn());

    const eventSource = (global as unknown as { __chatServiceEventSource: MockEventSource })
      .__chatServiceEventSource;
    eventSource.emit(
      'tool_call',
      JSON.stringify({
        id: 'tool-1',
        name: 'calculator',
        arguments: { value: 1 },
        status: 'running',
      }),
    );

    expect(onEvent).toHaveBeenCalledWith({
      type: 'tool_call',
      data: {
        id: 'tool-1',
        name: 'calculator',
        arguments: { value: 1 },
        status: 'running',
      },
    });
  });
});
