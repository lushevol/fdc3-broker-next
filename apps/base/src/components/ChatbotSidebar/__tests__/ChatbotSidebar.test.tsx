import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ChatbotSidebar } from '../index';
import { ChatbotProvider, useChatbot } from '../common/ChatbotProvider';
import { AssistantUIRuntimeProvider } from '../AssistantUIRuntimeProvider';

// Mock MUI Slide component to disable animations in tests
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    Slide: ({ children, in: inProp }: { children: React.ReactNode; in?: boolean }) => {
      if (!inProp) return null;
      return <div data-testid="slide-container">{children}</div>;
    },
  };
});

describe('ChatbotSidebar', () => {
  const renderWithProvider = (props = {}) => {
    return render(
      <ChatbotProvider>
        <ChatbotSidebar {...props} />
      </ChatbotProvider>,
    );
  };

  it('renders toggle button when closed', () => {
    renderWithProvider();
    expect(screen.getByLabelText('Open chatbot')).toBeInTheDocument();
  });

  it('opens sidebar when toggle button is clicked', async () => {
    renderWithProvider();

    const toggleButton = screen.getByLabelText('Open chatbot');
    fireEvent.click(toggleButton);

    // Use findAllByText since there are multiple elements with "AI Assistant" text
    // (one in header, one in empty state)
    const aiAssistants = await screen.findAllByText(/AI Assistant/);
    expect(aiAssistants.length).toBeGreaterThanOrEqual(1);
  });

  it('renders close button when open', async () => {
    renderWithProvider({ isOpen: true });

    const closeButton = await screen.findByTitle('Close');
    expect(closeButton).toBeInTheDocument();
  });

  it('renders new chat button', async () => {
    renderWithProvider({ isOpen: true });

    const newChatButton = await screen.findByTitle('New conversation');
    expect(newChatButton).toBeInTheDocument();
  });

  it('displays empty state message when no messages', async () => {
    renderWithProvider({ isOpen: true });

    const emptyState = await screen.findByText(/Ask me anything!/);
    expect(emptyState).toBeInTheDocument();
  });

  it('shares sidebar open state with ChatbotProvider consumers', async () => {
    const ProviderControl = () => {
      const { toggleSidebar } = useChatbot();
      return (
        <button type="button" data-testid="provider-toggle" onClick={toggleSidebar}>
          Toggle From Provider
        </button>
      );
    };

    render(
      <ChatbotProvider>
        <ProviderControl />
        <ChatbotSidebar />
      </ChatbotProvider>,
    );

    fireEvent.click(screen.getByTestId('provider-toggle'));

    const aiAssistants = await screen.findAllByText(/AI Assistant/);
    expect(aiAssistants.length).toBeGreaterThanOrEqual(1);
  });

  it('reuses an existing assistant runtime provider instead of nesting a new one', () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="http://localhost:8080/api/chat">
        <ChatbotSidebar isOpen />
      </AssistantUIRuntimeProvider>,
    );

    expect(screen.getAllByTestId('assistant-runtime-provider')).toHaveLength(1);
  });
});
