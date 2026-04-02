jest.mock('../index', () => ({
  ChatbotSidebar: () => null,
  default: () => null,
}));

import * as ChatbotExports from '../exports';

describe('chatbot exports', () => {
  it('exposes the assistant tool registration hook', () => {
    expect(typeof ChatbotExports.useRegisterAssistantTools).toBe('function');
  });

  it('exposes the assistant tool metadata hook', () => {
    expect(typeof ChatbotExports.useAssistantToolMetadata).toBe('function');
  });

  it('exposes the assistant tool routing debug hook', () => {
    expect(typeof ChatbotExports.useAssistantToolRoutingDebug).toBe('function');
  });

  it('exposes the central frontend tool registry factory', () => {
    expect(typeof ChatbotExports.createFrontendToolRegistry).toBe('function');
  });

  it('does not expose legacy sidebar compatibility helpers', () => {
    expect((ChatbotExports as Record<string, unknown>).ChatbotProvider).toBeUndefined();
    expect((ChatbotExports as Record<string, unknown>).useChatbotController).toBeUndefined();
    expect((ChatbotExports as Record<string, unknown>).ChatService).toBeUndefined();
    expect((ChatbotExports as Record<string, unknown>).getChatService).toBeUndefined();
    expect((ChatbotExports as Record<string, unknown>).initializeChatService).toBeUndefined();
  });
});
