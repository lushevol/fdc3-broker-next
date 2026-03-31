import { fireEvent, render, screen } from '@testing-library/react';
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

const mockEditComposerSend = jest.fn();
const mockEditComposerCancel = jest.fn();

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
  let isEditing = false;

  const passthrough =
    (Tag = 'div') =>
    ({ children, ...props }) =>
      React.createElement(
        Tag,
        props,
        typeof children === 'function' ? children({ part: currentPart }) : children,
      );

  return {
    AuiIf: ({ condition, children }) => {
      const state = {
        thread: { isEmpty: false, isRunning: false },
        message: { role: 'assistant', composer: { isEditing }, isCopied: false },
      };
      return condition(state) ? <>{children}</> : null;
    },
    useAuiState: (selector) =>
      selector({
        thread: { isEmpty: false, isRunning: false },
        message: { role: 'assistant', composer: { isEditing }, isCopied: false },
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
      Root: passthrough('form'),
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
    __threadTest: {
      setIsEditing: (value: boolean) => {
        isEditing = value;
      },
    },
  };
});

jest.mock('@assistant-ui/core/react', () => ({
  useEditComposerSend: () => ({ send: mockEditComposerSend, disabled: false }),
  useEditComposerCancel: () => ({ cancel: mockEditComposerCancel }),
}));

const assistantUiModule = jest.requireMock('@assistant-ui/react') as {
  __threadTest: {
    setIsEditing: (value: boolean) => void;
  };
};

describe('Thread', () => {
  beforeEach(() => {
    assistantUiModule.__threadTest.setIsEditing(false);
    mockEditComposerSend.mockClear();
    mockEditComposerCancel.mockClear();
  });

  it('renders generative-ui data parts through the generative UI renderer', () => {
    render(<Thread />);

    expect(screen.getByTestId('generative-ui-renderer')).toHaveTextContent('ChartCard:Revenue');
  });

  it('renders tool-call parts through toolUI before falling back to ToolFallback', () => {
    Object.assign(currentPart, {
      type: 'tool-call',
      toolName: 'get_weather',
      toolCallId: 'tool-1',
      args: { location: 'Singapore' },
      argsText: '{"location":"Singapore"}',
      toolUI: <div data-testid="tool-ui">Weather Tool UI</div>,
    });

    render(<Thread />);

    expect(screen.getByTestId('tool-ui')).toHaveTextContent('Weather Tool UI');
    expect(screen.queryByTestId('tool-fallback')).not.toBeInTheDocument();
  });

  it('submits and cancels the inline edit composer through edit-specific hooks', () => {
    assistantUiModule.__threadTest.setIsEditing(true);

    render(<Thread />);

    fireEvent.submit(screen.getByRole('button', { name: 'Update' }).closest('form')!);
    expect(mockEditComposerSend).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockEditComposerCancel).toHaveBeenCalledTimes(1);
  });
});
