import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatbotSidebar } from './index';
import { ChatbotProvider } from './common/ChatbotProvider';

// Mock assistant-ui
jest.mock('@assistant-ui/react', () => ({
  AssistantRuntimeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useLocalRuntime: () => ({
    append: jest.fn(),
    resetThread: jest.fn(),
  }),
  Thread: () => <div data-testid="thread">Thread</div>,
  Composer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useThread: () => ({ messages: [] }),
  useThreadRuntime: () => ({ append: jest.fn() }),
}));

describe('ChatbotSidebar', () => {
  const renderWithProvider = (props = {}) => {
    return render(
      <ChatbotProvider>
        <ChatbotSidebar {...props} />
      </ChatbotProvider>
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

    await waitFor(() => {
      expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    });
  });

  it('renders close button when open', async () => {
    renderWithProvider({ isOpen: true });

    await waitFor(() => {
      expect(screen.getByLabelText('Close')).toBeInTheDocument();
    });
  });

  it('renders new chat button', async () => {
    renderWithProvider({ isOpen: true });

    await waitFor(() => {
      expect(screen.getByLabelText('New conversation')).toBeInTheDocument();
    });
  });

  it('displays empty state message when no messages', async () => {
    renderWithProvider({ isOpen: true });

    await waitFor(() => {
      expect(screen.getByText('Ask me anything!')).toBeInTheDocument();
    });
  });
});