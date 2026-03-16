import { TextDecoder, TextEncoder } from 'text-encoding';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
const mockComponent = (c) => {
  return <section>{c.children}</section>;
};
// Mock SystemJS
async function mockImport(name) {
  return Promise.resolve({
    __esModule: true,
    default: mockComponent,
    [name]: mockComponent,
    getRoot: mockComponent,
  });
}
// @ts-expect-error
global.System = {
  import: jest.fn(mockImport),
};
jest.setTimeout(60000);

// Mock @assistant-ui/react
jest.mock('@assistant-ui/react', () => {
  const mockReact = jest.requireActual('react');

  const MockPrimitive = ({ children }: { children?: any }) => {
    return mockReact.createElement('div', { 'data-testid': 'mock-primitive' }, children);
  };

  const createMockRuntime = (config: any) => {
    const messages = config?.messages || [];
    const isRunning = config?.isRunning || false;

    return {
      thread: {
        getState: () => ({
          messages,
          isRunning,
        }),
        getMessages: () => messages,
        setMessages: () => {},
        subscribe: () => () => {},
        on: () => {},
        off: () => {},
      },
      messages: {
        getState: () => ({
          messages,
          isRunning,
        }),
      },
      subscribe: () => () => {},
      on: () => {},
      off: () => {},
    };
  };

  return {
    ThreadPrimitive: {
      Root: MockPrimitive,
      Viewport: MockPrimitive,
      Empty: MockPrimitive,
      Messages: MockPrimitive,
      ScrollToBottom: MockPrimitive,
      Suggestion: MockPrimitive,
      Suggestions: MockPrimitive,
      If: MockPrimitive,
    },
    ComposerPrimitive: {
      Root: MockPrimitive,
      Input: ({ placeholder }: { placeholder?: string }) =>
        mockReact.createElement('input', { 'data-testid': 'composer-input', placeholder }),
      Send: () => mockReact.createElement('button', { 'data-testid': 'composer-send' }, 'Send'),
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
    },
    MessagePrimitive: {
      Root: MockPrimitive,
      Content: MockPrimitive,
      Attachments: MockPrimitive,
      AttachmentByIndex: MockPrimitive,
      BranchPicker: MockPrimitive,
      If: MockPrimitive,
    },
    useExternalStoreRuntime: (config: any) => createMockRuntime(config),
    AssistantRuntimeProvider: ({ children }: { children: any }) =>
      mockReact.createElement('div', { 'data-testid': 'assistant-runtime-provider' }, children),
    useAssistantRuntime: () => ({
      thread: {
        getState: () => ({ isRunning: false }),
      },
    }),
    useAui: () => ({
      thread: {
        getState: () => ({ isRunning: false }),
      },
    }),
    useAuiState: () => null,
    useAuiEvent: () => {},
    AuiProvider: ({ children }: { children: any }) =>
      mockReact.createElement('div', { 'data-testid': 'aui-provider' }, children),
  };
});
