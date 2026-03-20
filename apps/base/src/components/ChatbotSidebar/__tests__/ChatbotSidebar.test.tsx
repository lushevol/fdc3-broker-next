import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ChatbotSidebar } from '../index';
import { ChatbotProvider, useChatbot } from '../common/ChatbotProvider';
import { AssistantUIRuntimeProvider } from '../AssistantUIRuntimeProvider';

const mockEventSource = jest.fn();
(global as unknown as { EventSource: jest.Mock }).EventSource = mockEventSource;

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
  beforeEach(() => {
    mockEventSource.mockClear();
  });

  const renderWithProvider = (props = {}) => {
    return render(
      <AssistantUIRuntimeProvider apiUrl="http://localhost:8080/api/chat">
        <ChatbotProvider>
          <ChatbotSidebar {...props} />
        </ChatbotProvider>
      </AssistantUIRuntimeProvider>,
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

  it('displays the assistant-ui welcome state when no messages', async () => {
    renderWithProvider({ isOpen: true });

    expect(await screen.findByText(/Hello there!/)).toBeInTheDocument();
    expect(screen.getByText(/How can I help you today\?/)).toBeInTheDocument();
  });

  it('renders the assistant-ui composer placeholder', async () => {
    renderWithProvider({ isOpen: true });

    expect(await screen.findByPlaceholderText(/Send a message/i)).toBeInTheDocument();
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
      <AssistantUIRuntimeProvider apiUrl="http://localhost:8080/api/chat">
        <ChatbotProvider>
          <ProviderControl />
          <ChatbotSidebar />
        </ChatbotProvider>
      </AssistantUIRuntimeProvider>,
    );

    fireEvent.click(screen.getByTestId('provider-toggle'));

    const aiAssistants = await screen.findAllByText(/AI Assistant/);
    expect(aiAssistants.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the sidebar against an app-level runtime provider', () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="http://localhost:8080/api/chat">
        <ChatbotProvider initialOpen>
          <ChatbotSidebar isOpen />
        </ChatbotProvider>
      </AssistantUIRuntimeProvider>,
    );

    expect(screen.getByText(/Hello there!/)).toBeInTheDocument();
    expect(screen.getByTitle('New conversation')).toBeInTheDocument();
    expect(screen.getAllByTestId('assistant-runtime-provider')).toHaveLength(1);
  });

  it('bootstraps a local assistant runtime when rendered directly by a host', () => {
    render(<ChatbotSidebar isOpen apiUrl="http://localhost:8080/embedded-chat" />);

    expect(screen.getByText(/Hello there!/)).toBeInTheDocument();
    expect(screen.getByTitle('New conversation')).toBeInTheDocument();
    expect(screen.getAllByTestId('assistant-runtime-provider')).toHaveLength(1);
  });
});
