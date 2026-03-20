import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ChatbotSidebar } from '../index';

jest.mock('@assistant-ui/react', () => {
  const React = jest.requireActual('react');

  const Root = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const Anchor = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  );
  const Trigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) => {
    if (asChild) {
      return React.cloneElement(children, { 'data-testid': 'assistant-modal-trigger' });
    }

    return children;
  };
  const Content = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  );

  return {
    AssistantModalPrimitive: { Root, Anchor, Trigger, Content },
  };
});

jest.mock(
  '@/components/assistant-ui/thread',
  () => ({
    Thread: () => (
      <div>
        <div>Hello there!</div>
        <input aria-label="Message input" placeholder="Send a message..." />
      </div>
    ),
  }),
  { virtual: true },
);

jest.mock(
  '@/components/assistant-ui/tooltip-icon-button',
  () => ({
    TooltipIconButton: jest
      .requireActual('react')
      .forwardRef(
        (
          {
            tooltip,
            children,
            ...rest
          }: React.ButtonHTMLAttributes<HTMLButtonElement> & { tooltip?: string },
          ref: React.ForwardedRef<HTMLButtonElement>,
        ) => (
          <button ref={ref} aria-label={tooltip} type="button" {...rest}>
            {children}
          </button>
        ),
      ),
  }),
  { virtual: true },
);

describe('ChatbotSidebar', () => {
  it('renders a floating assistant trigger and opens the modal content through the runtime path', async () => {
    render(<ChatbotSidebar />);

    const trigger = screen.getByRole('button', { name: 'Open Assistant' });
    expect(trigger).toBeInTheDocument();
    expect(screen.getByTestId('assistant-modal-trigger').parentElement).toHaveClass(
      'aui-modal-anchor',
    );

    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Hello there!')).toBeInTheDocument();
      expect(screen.getByLabelText('Message input')).toBeInTheDocument();
    });

    expect(screen.getByText('Hello there!').parentElement?.parentElement).toHaveClass(
      'backdrop-blur-xl',
    );
  });
});
