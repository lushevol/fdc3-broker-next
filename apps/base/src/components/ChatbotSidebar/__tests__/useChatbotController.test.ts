import { renderHook, act } from '@testing-library/react-hooks';
import { useChatbotController } from './common/useController';

// Mock EventSource
class MockEventSource {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  close = jest.fn();

  constructor(url: string) {
    // Simulate successful connection and message
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage(
          new MessageEvent('message', {
            data: JSON.stringify({ type: 'message', text: 'Hello' }),
          }),
        );
      }
    }, 100);
  }

  addEventListener(event: string, callback: Function) {
    if (event === 'done') {
      setTimeout(() => callback({}), 200);
    }
  }
}

// @ts-ignore
global.EventSource = MockEventSource;

describe('useChatbotController', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useChatbotController());

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.conversationId).toBeNull();
  });

  it('sends a message and updates state', async () => {
    const { result } = renderHook(() => useChatbotController());

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.messages.length).toBeGreaterThan(0);
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[0].content).toBe('Hello');
  });

  it('clears conversation', () => {
    const { result } = renderHook(() => useChatbotController());

    act(() => {
      result.current.clearConversation();
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.conversationId).toBeNull();
  });

  it('does not send empty messages', async () => {
    const { result } = renderHook(() => useChatbotController());

    const initialMessages = result.current.messages.length;

    await act(async () => {
      await result.current.sendMessage('');
    });

    expect(result.current.messages.length).toBe(initialMessages);
  });

  it('does not send whitespace-only messages', async () => {
    const { result } = renderHook(() => useChatbotController());

    const initialMessages = result.current.messages.length;

    await act(async () => {
      await result.current.sendMessage('   ');
    });

    expect(result.current.messages.length).toBe(initialMessages);
  });
});
