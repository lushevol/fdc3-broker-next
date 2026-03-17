import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ChatbotSidebar } from '../index';
import { ChatbotProvider } from '../common/ChatbotProvider';

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
});
