import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatbotProvider, useChatbot } from '../common/ChatbotProvider';
import { AssistantUIRuntimeProvider } from '../AssistantUIRuntimeProvider';

// Test component to access the context
const TestComponent = () => {
  const { messages, sendMessage, clearConversation, isOpen, toggleSidebar } = useChatbot();

  return (
    <div>
      <span data-testid="message-count">{messages.length}</span>
      <span data-testid="is-open">{isOpen.toString()}</span>
      <button onClick={() => sendMessage('Test message')} data-testid="send-btn">
        Send
      </button>
      <button onClick={clearConversation} data-testid="clear-btn">
        Clear
      </button>
      <button onClick={toggleSidebar} data-testid="toggle-btn">
        Toggle
      </button>
    </div>
  );
};

describe('ChatbotProvider', () => {
  it('provides initial context values', () => {
    render(
      <ChatbotProvider>
        <TestComponent />
      </ChatbotProvider>,
    );

    expect(screen.getByTestId('message-count')).toHaveTextContent('0');
    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
  });

  it('toggles sidebar state', () => {
    render(
      <ChatbotProvider>
        <TestComponent />
      </ChatbotProvider>,
    );

    fireEvent.click(screen.getByTestId('toggle-btn'));
    expect(screen.getByTestId('is-open')).toHaveTextContent('true');

    fireEvent.click(screen.getByTestId('toggle-btn'));
    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
  });

  it('clears conversation', () => {
    render(
      <ChatbotProvider>
        <TestComponent />
      </ChatbotProvider>,
    );

    fireEvent.click(screen.getByTestId('clear-btn'));
    expect(screen.getByTestId('message-count')).toHaveTextContent('0');
  });

  it('creates an assistant runtime provider when used standalone', () => {
    render(
      <ChatbotProvider>
        <TestComponent />
      </ChatbotProvider>,
    );

    expect(screen.getAllByTestId('assistant-runtime-provider')).toHaveLength(1);
  });

  it('reuses an existing assistant runtime provider when already wrapped', () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="http://localhost:8080/api/chat">
        <ChatbotProvider>
          <TestComponent />
        </ChatbotProvider>
      </AssistantUIRuntimeProvider>,
    );

    expect(screen.getAllByTestId('assistant-runtime-provider')).toHaveLength(1);
  });
});
