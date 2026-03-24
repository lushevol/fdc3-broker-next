import { render, screen } from '@testing-library/react';
import React from 'react';
import { Thread } from './thread';

const currentPart = {
  type: 'data',
  name: 'generative-ui',
  data: {
    componentName: 'ChartCard',
    props: { title: 'Revenue' },
  },
};

jest.mock('@/components/assistant-ui/attachment', () => ({
  ComposerAddAttachment: () => <div data-testid="composer-add-attachment" />,
  ComposerAttachments: () => <div data-testid="composer-attachments" />,
  UserMessageAttachments: () => <div data-testid="user-message-attachments" />,
}));

jest.mock('@/components/assistant-ui/markdown-text', () => ({
  MarkdownText: () => <div data-testid="markdown-text" />,
}));

jest.mock('@/components/assistant-ui/tool-fallback', () => ({
  ToolFallback: () => <div data-testid="tool-fallback" />,
}));

jest.mock('@/components/assistant-ui/tooltip-icon-button', () => ({
  TooltipIconButton: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

jest.mock('@/lib/utils', () => ({
  cn: (...classNames) => classNames.filter(Boolean).join(' '),
}));

jest.mock('../../../components/ChatbotSidebar/components/GenerativeUIRenderer', () => ({
  GenerativeUIRenderer: ({ componentName, props }) => (
    <div data-testid="generative-ui-renderer">
      {componentName}:{String(props.title ?? '')}
    </div>
  ),
}));

jest.mock('@assistant-ui/react', () => {
  const React = jest.requireActual('react');

  const passthrough =
    (Tag = 'div') =>
    ({ children }) =>
      React.createElement(
        Tag,
        {},
        typeof children === 'function' ? children({ part: currentPart }) : children,
      );

  return {
    AuiIf: ({ condition, children }) => {
      const state = {
        thread: { isEmpty: false, isRunning: false },
        message: { role: 'assistant', composer: { isEditing: false }, isCopied: false },
      };
      return condition(state) ? <>{children}</> : null;
    },
    useAuiState: (selector) =>
      selector({
        thread: { isEmpty: false, isRunning: false },
        message: { role: 'assistant', composer: { isEditing: false }, isCopied: false },
      }),
    ThreadPrimitive: {
      Root: passthrough(),
      Viewport: passthrough(),
      Messages: ({ children }) => <>{children()}</>,
      ViewportFooter: passthrough(),
      ScrollToBottom: ({ children }) => children,
      Suggestions: ({ children }) => <>{children()}</>,
    },
    SuggestionPrimitive: {
      Trigger: ({ children }) => children,
      Title: () => <span>Title</span>,
      Description: () => <span>Description</span>,
    },
    ComposerPrimitive: {
      Root: passthrough(),
      AttachmentDropzone: ({ children }) => children,
      Input: passthrough('textarea'),
      Send: ({ children }) => children,
      Cancel: ({ children }) => children,
    },
    MessagePrimitive: {
      Root: passthrough(),
      Parts: ({ children }) => <>{children({ part: currentPart })}</>,
      Error: passthrough(),
    },
    ErrorPrimitive: {
      Root: passthrough(),
      Message: () => <div>Error</div>,
    },
    ActionBarPrimitive: {
      Root: passthrough(),
      Copy: ({ children }) => children,
      Reload: ({ children }) => children,
      Edit: ({ children }) => children,
      ExportMarkdown: ({ children }) => children,
    },
    ActionBarMorePrimitive: {
      Root: passthrough(),
      Trigger: ({ children }) => children,
      Content: passthrough(),
      Item: passthrough(),
    },
    BranchPickerPrimitive: {
      Root: passthrough(),
      Previous: ({ children }) => children,
      Next: ({ children }) => children,
      Number: () => <span>1</span>,
      Count: () => <span>1</span>,
    },
  };
});

describe('Thread', () => {
  it('renders generative-ui data parts through the generative UI renderer', () => {
    render(<Thread />);

    expect(screen.getByTestId('generative-ui-renderer')).toHaveTextContent('ChartCard:Revenue');
  });
});
