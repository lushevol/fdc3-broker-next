import { act, renderHook } from '@testing-library/react-hooks';
import { useChatbotController } from '../common/useController';
import { useAssistantUIRuntime } from '../AssistantUIRuntimeProvider';
import { useOptionalChatbot } from '../common/ChatbotProvider';

jest.mock('../AssistantUIRuntimeProvider', () => ({
  useAssistantUIRuntime: jest.fn(),
}));

jest.mock('../common/ChatbotProvider', () => ({
  useOptionalChatbot: jest.fn(),
}));

const mockedUseAssistantUIRuntime = useAssistantUIRuntime as jest.Mock;
const mockedUseOptionalChatbot = useOptionalChatbot as jest.Mock;

describe('useChatbotController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global as unknown as { EventSource: jest.Mock }).EventSource = jest.fn();
  });

  it('projects runtime state instead of opening its own stream', async () => {
    const runtimeRetryLastMessage = jest.fn();
    const runtimeSendMessage = jest.fn().mockResolvedValue(undefined);
    const runtimeClearConversation = jest.fn();
    const runtimeConversationId = 'conv-123';
    const createdAt = new Date('2026-03-19T00:00:00.000Z');

    mockedUseOptionalChatbot.mockReturnValue(null);
    mockedUseAssistantUIRuntime.mockReturnValue({
      messages: [
        {
          id: 'assistant-1',
          role: 'assistant',
          content: [
            { type: 'text', text: 'hello ' },
            {
              type: 'tool-call',
              toolCallId: 'tool-1',
              toolName: 'lookup',
              args: { query: 'alpha' },
              argsText: '{"query":"alpha"}',
              result: { ok: true },
              status: 'completed',
              requiresConfirmation: true,
            },
          ],
          createdAt,
        },
      ],
      isLoading: true,
      error: 'runtime error',
      conversationId: runtimeConversationId,
      sendMessage: runtimeSendMessage,
      clearConversation: runtimeClearConversation,
      retryLastMessage: runtimeRetryLastMessage,
    });

    const { result } = renderHook(() => useChatbotController());

    expect(result.current.messages).toEqual([
      {
        id: 'assistant-1',
        role: 'assistant',
        content: 'hello ',
        timestamp: createdAt,
        toolCalls: [
          {
            id: 'tool-1',
            name: 'lookup',
            arguments: { query: 'alpha' },
            status: 'completed',
            requiresConfirmation: true,
          },
        ],
        toolResults: [
          {
            toolCallId: 'tool-1',
            result: { ok: true },
          },
        ],
      },
    ]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe('runtime error');
    expect(result.current.conversationId).toBe(runtimeConversationId);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.sendMessage).toBe(runtimeSendMessage);
    expect(result.current.clearConversation).toBe(runtimeClearConversation);

    await act(async () => {
      await result.current.sendMessage('ignored by the hook');
      await result.current.retryLastMessage();
    });

    expect(runtimeSendMessage).toHaveBeenCalledWith('ignored by the hook');
    expect(runtimeRetryLastMessage).toHaveBeenCalledTimes(1);
    expect((global as unknown as { EventSource: jest.Mock }).EventSource).not.toHaveBeenCalled();
  });
});
