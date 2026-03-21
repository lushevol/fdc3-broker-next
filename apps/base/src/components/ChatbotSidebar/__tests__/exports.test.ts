jest.mock('../index', () => ({
  ChatbotSidebar: () => null,
  default: () => null,
}));

import * as ChatbotExports from '../exports';

describe('chatbot exports', () => {
  it('does not expose legacy sidebar compatibility helpers', () => {
    expect((ChatbotExports as Record<string, unknown>).ChatbotProvider).toBeUndefined();
    expect((ChatbotExports as Record<string, unknown>).useChatbotController).toBeUndefined();
    expect((ChatbotExports as Record<string, unknown>).ChatService).toBeUndefined();
    expect((ChatbotExports as Record<string, unknown>).getChatService).toBeUndefined();
    expect((ChatbotExports as Record<string, unknown>).initializeChatService).toBeUndefined();
  });
});
