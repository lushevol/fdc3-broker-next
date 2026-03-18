import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AssistantUIRuntimeProvider, useAssistantUIRuntime } from '../AssistantUIRuntimeProvider';
import type { AssistantUIMessage } from '../adapters/types';
import type {
  ChatMessage,
  ChatbotContextValue,
  ToolCall,
  ToolDefinition,
  ToolResult,
} from './interface';

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

interface ChatbotProviderProps {
  children: ReactNode;
  apiUrl?: string;
  initialOpen?: boolean;
}

const DEFAULT_API_URL = '/api/chat';

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

const ChatbotProviderBridge: React.FC<{
  children: ReactNode;
  initialOpen: boolean;
}> = ({ children, initialOpen }) => {
  const runtime = useAssistantUIRuntime();
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = useMemo<ChatbotContextValue>(
    () => ({
      messages: runtime.messages.map(toChatMessage),
      isLoading: runtime.isLoading,
      error: runtime.error,
      conversationId: runtime.conversationId,
      isOpen,
      sendMessage: runtime.sendMessage,
      clearConversation: runtime.clearConversation,
      toggleSidebar,
      retryLastMessage: async () => {
        runtime.retryLastMessage();
      },
    }),
    [isOpen, runtime, toggleSidebar],
  );

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
};

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({
  children,
  apiUrl = DEFAULT_API_URL,
  initialOpen = false,
}) => {
  const existingRuntime = useAssistantUIRuntime({ optional: true });

  if (existingRuntime) {
    return <ChatbotProviderBridge initialOpen={initialOpen}>{children}</ChatbotProviderBridge>;
  }

  return (
    <AssistantUIRuntimeProvider apiUrl={apiUrl}>
      <ChatbotProviderBridge initialOpen={initialOpen}>{children}</ChatbotProviderBridge>
    </AssistantUIRuntimeProvider>
  );
};

export const useChatbot = (): ChatbotContextValue => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export const useOptionalChatbot = (): ChatbotContextValue | null => {
  return useContext(ChatbotContext);
};

// Hook for accessing tool registry (internal use)
export const useToolRegistry = () => {
  const toolRegistry = useRef<Map<string, ToolDefinition>>(new Map());

  const registerTool = useCallback((tool: ToolDefinition) => {
    toolRegistry.current.set(tool.name, tool);
  }, []);

  const unregisterTool = useCallback((name: string) => {
    toolRegistry.current.delete(name);
  }, []);

  const getTool = useCallback((name: string) => {
    return toolRegistry.current.get(name);
  }, []);

  const executeTool = useCallback(async (name: string, args: Record<string, unknown>) => {
    const tool = toolRegistry.current.get(name);
    if (!tool) {
      throw new Error(`Tool "${name}" not found`);
    }
    return tool.execute(args);
  }, []);

  return {
    registerTool,
    unregisterTool,
    getTool,
    executeTool,
  };
};

export default ChatbotProvider;
