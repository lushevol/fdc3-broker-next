import { useAssistantUIRuntime } from '../AssistantUIRuntimeProvider';
import { useOptionalChatbot } from './ChatbotProvider';
import type { ChatMessage, ChatState, ToolCall, ToolResult } from './interface';
import type { AssistantUIMessage } from '../adapters/types';

interface UseChatbotControllerProps {
  apiUrl?: string;
  conversationId?: string;
}

interface UseChatbotControllerReturn extends ChatState {
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
  retryLastMessage: () => Promise<void>;
  setConversationId: (id: string | null) => void;
}

const toChatMessage = (message: AssistantUIMessage): ChatMessage => {
  const toolCalls: ToolCall[] = [];
  const toolResults: ToolResult[] = [];
  let content = '';

  for (const part of message.content) {
    if (part.type === 'text') {
      content += part.text;
      continue;
    }

    if (part.type === 'tool-call') {
      toolCalls.push({
        id: part.toolCallId,
        name: part.toolName,
        arguments: part.args,
        status: part.status ?? 'running',
        requiresConfirmation: part.requiresConfirmation,
      });

      if (part.result !== undefined || part.error !== undefined) {
        toolResults.push({
          toolCallId: part.toolCallId,
          result: part.result,
          error: part.error,
        });
      }
    }
  }

  return {
    id: message.id,
    role: message.role,
    content,
    timestamp: message.createdAt ?? new Date(),
    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    toolResults: toolResults.length > 0 ? toolResults : undefined,
  };
};

export function useChatbotController(
  props?: UseChatbotControllerProps,
): UseChatbotControllerReturn {
  void props;

  const runtime = useAssistantUIRuntime({ optional: true });
  const chatbotContext = useOptionalChatbot();

  if (chatbotContext) {
    return {
      messages: chatbotContext.messages,
      isLoading: chatbotContext.isLoading,
      error: chatbotContext.error,
      conversationId: chatbotContext.conversationId,
      isOpen: chatbotContext.isOpen,
      sendMessage: chatbotContext.sendMessage,
      clearConversation: chatbotContext.clearConversation,
      retryLastMessage: async () => {
        await chatbotContext.retryLastMessage();
      },
      setConversationId: () => {
        // Conversation identity is owned by the assistant runtime.
      },
    };
  }

  if (runtime) {
    return {
      messages: runtime.messages.map(toChatMessage),
      isLoading: runtime.isLoading,
      error: runtime.error,
      conversationId: runtime.conversationId,
      isOpen: false,
      sendMessage: runtime.sendMessage,
      clearConversation: runtime.clearConversation,
      retryLastMessage: async () => {
        runtime.retryLastMessage();
      },
      setConversationId: () => {
        // Conversation identity is owned by the assistant runtime.
      },
    };
  }

  throw new Error('useChatbotController must be used within AssistantUIRuntimeProvider');
}

export default useChatbotController;
