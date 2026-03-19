import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ChatbotProvider, useChatbot } from '../common/ChatbotProvider';
import { useAssistantUIRuntime } from '../AssistantUIRuntimeProvider';

jest.mock('../AssistantUIRuntimeProvider', () => ({
  useAssistantUIRuntime: jest.fn(),
}));

const mockedUseAssistantUIRuntime = useAssistantUIRuntime as jest.Mock;

const TestComponent = () => {
  const {
    messages,
    sendMessage,
    clearConversation,
    retryLastMessage,
    isOpen,
    toggleSidebar,
    isLoading,
    error,
    conversationId,
  } = useChatbot();

  return (
    <div>
      <span data-testid="message-count">{messages.length}</span>
      <span data-testid="message-content">{messages[0]?.content ?? ''}</span>
      <span data-testid="tool-count">{messages[0]?.toolCalls?.length ?? 0}</span>
      <span data-testid="tool-name">{messages[0]?.toolCalls?.[0]?.name ?? ''}</span>
      <span data-testid="is-open">{isOpen.toString()}</span>
      <span data-testid="is-loading">{isLoading.toString()}</span>
      <span data-testid="error">{error ?? ''}</span>
      <span data-testid="conversation-id">{conversationId ?? ''}</span>
      <button onClick={() => sendMessage('Test message')} data-testid="send-btn">
        Send
      </button>
      <button onClick={clearConversation} data-testid="clear-btn">
        Clear
      </button>
      <button onClick={() => void retryLastMessage()} data-testid="retry-btn">
        Retry
      </button>
      <button onClick={toggleSidebar} data-testid="toggle-btn">
        Toggle
      </button>
    </div>
  );
};

describe('ChatbotProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('projects runtime state and keeps only sidebar open state locally', async () => {
    const runtimeSendMessage = jest.fn().mockResolvedValue(undefined);
    const runtimeClearConversation = jest.fn();
    const runtimeRetryLastMessage = jest.fn();
    const runtime = {
      messages: [
        {
          id: 'assistant-1',
          role: 'assistant',
          content: [
            { type: 'text', text: 'projected response' },
            {
              type: 'tool-call',
              toolCallId: 'tool-1',
              toolName: 'lookup',
              args: { query: 'alpha' },
              argsText: '{"query":"alpha"}',
              status: 'running',
              requiresConfirmation: true,
            },
          ],
          createdAt: new Date('2026-03-19T00:00:00.000Z'),
        },
      ],
      isLoading: false,
      error: 'runtime failure',
      conversationId: 'conv-123',
      sendMessage: runtimeSendMessage,
      clearConversation: runtimeClearConversation,
      retryLastMessage: runtimeRetryLastMessage,
    };

    mockedUseAssistantUIRuntime.mockReturnValue(runtime);

    render(
      <ChatbotProvider>
        <TestComponent />
      </ChatbotProvider>,
    );

    expect(screen.getByTestId('message-count')).toHaveTextContent('1');
    expect(screen.getByTestId('message-content')).toHaveTextContent('projected response');
    expect(screen.getByTestId('tool-count')).toHaveTextContent('1');
    expect(screen.getByTestId('tool-name')).toHaveTextContent('lookup');
    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('runtime failure');
    expect(screen.getByTestId('conversation-id')).toHaveTextContent('conv-123');

    fireEvent.click(screen.getByTestId('send-btn'));
    fireEvent.click(screen.getByTestId('clear-btn'));
    fireEvent.click(screen.getByTestId('retry-btn'));
    fireEvent.click(screen.getByTestId('toggle-btn'));

    expect(runtimeSendMessage).toHaveBeenCalledWith('Test message');
    expect(runtimeClearConversation).toHaveBeenCalledTimes(1);
    expect(runtimeRetryLastMessage).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('is-open')).toHaveTextContent('true');
  });
});
