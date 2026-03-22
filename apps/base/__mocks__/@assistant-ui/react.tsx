/**
 * Mock for @assistant-ui/react
 */

import React from 'react';

// Create mock primitives
const MockPrimitive = ({ children, ...props }: { children?: React.ReactNode }) => (
  <div data-testid="mock-primitive">{children}</div>
);

// ThreadPrimitive
export const ThreadPrimitive = {
  Root: MockPrimitive,
  Viewport: MockPrimitive,
  Empty: MockPrimitive,
  Messages: MockPrimitive,
  ScrollToBottom: MockPrimitive,
  Suggestion: MockPrimitive,
  Suggestions: MockPrimitive,
  If: MockPrimitive,
};

// ComposerPrimitive
export const ComposerPrimitive = {
  Root: MockPrimitive,
  Input: ({ placeholder, ...props }: { placeholder?: string }) => (
    <input data-testid="composer-input" placeholder={placeholder} {...props} />
  ),
  Send: () => <button data-testid="composer-send">Send</button>,
  Cancel: MockPrimitive,
  Attachments: MockPrimitive,
  AttachmentByIndex: MockPrimitive,
  AddAttachment: MockPrimitive,
  AttachmentDropzone: MockPrimitive,
  Dictate: MockPrimitive,
  StopDictation: MockPrimitive,
  DictationTranscript: MockPrimitive,
  If: MockPrimitive,
  Quote: MockPrimitive,
  QuoteText: MockPrimitive,
  QuoteDismiss: MockPrimitive,
};

// MessagePrimitive
export const MessagePrimitive = {
  Root: MockPrimitive,
  Content: MockPrimitive,
  Attachments: MockPrimitive,
  AttachmentByIndex: MockPrimitive,
  BranchPicker: MockPrimitive,
  If: MockPrimitive,
};

// ActionBarPrimitive
export const ActionBarPrimitive = {
  Root: MockPrimitive,
  Copy: MockPrimitive,
  ThumbsUp: MockPrimitive,
  ThumbsDown: MockPrimitive,
  Speak: MockPrimitive,
};

// BranchPickerPrimitive
export const BranchPickerPrimitive = {
  Root: MockPrimitive,
  Previous: MockPrimitive,
  Next: MockPrimitive,
  Count: MockPrimitive,
};

export const AssistantModalPrimitive = {
  Root: MockPrimitive,
  Anchor: MockPrimitive,
  Trigger: MockPrimitive,
  Content: MockPrimitive,
};

// Create a mock runtime that matches assistant-ui's expected structure
const createMockRuntime = (config: any) => {
  const messages = config.messages || [];
  const isRunning = config.isRunning || false;

  return {
    thread: {
      getState: () => ({
        messages,
        isRunning,
      }),
      getMessages: () => messages,
      setMessages: (newMessages: any[]) => {},
      subscribe: (callback: any) => () => {},
      on: (event: string, handler: any) => {},
      off: (event: string, handler: any) => {},
    },
    messages: {
      getState: () => ({
        messages,
        isRunning,
      }),
    },
    subscribe: (callback: any) => () => {},
    on: (event: string, handler: any) => {},
    off: (event: string, handler: any) => {},
  };
};

// Runtime hooks - returns a proper runtime object that matches assistant-ui's expectations
export const useExternalStoreRuntime = jest.fn((config: any) => {
  return createMockRuntime(config);
});

export const useAssistantRuntime = () => ({
  thread: {
    getState: () => ({ isRunning: false }),
  },
});

// Providers
export const AssistantRuntimeProvider = ({
  children,
  runtime,
}: {
  children: React.ReactNode;
  runtime: any;
}) => {
  // Ensure runtime is valid even in tests
  const safeRuntime = runtime || createMockRuntime({});
  return <div data-testid="assistant-runtime-provider">{children}</div>;
};

// Store hooks
export const useAui = () => ({
  thread: {
    getState: () => ({ isRunning: false }),
  },
});

export const useAuiState = (selector: any) => null;
export const useAuiEvent = (event: string, handler: any) => {};

// Context
export const AuiProvider = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="aui-provider">{children}</div>
);

// Types (these are just type exports, no actual values in JS)
export type ThreadMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: any[];
  createdAt: Date;
  status?: any;
  metadata?: any;
};

export type AppendMessage = Omit<ThreadMessage, 'id'> & {
  parentId: string | null;
  sourceId: string | null;
  runConfig: any;
  attachments: any[];
};

export type ThreadAssistantMessage = ThreadMessage & {
  role: 'assistant';
  status: any;
};

export type ThreadUserMessage = ThreadMessage & {
  role: 'user';
  attachments: any[];
};
