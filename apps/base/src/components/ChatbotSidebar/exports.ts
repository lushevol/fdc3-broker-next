// Main component exports
export { ChatbotSidebar } from './index';
export { default as ChatbotSidebarDefault } from './index';

// Context and hooks
export { ChatbotProvider, useChatbot, useToolRegistry } from './common/ChatbotProvider';

/**
 * @deprecated Use `useAssistantUIRuntime` from `@assistant-ui/react` instead.
 * This hook will be removed in a future version.
 */
export { useChatbotController } from './common/useController';

// Assistant-UI Runtime
export { AssistantUIRuntimeProvider, useAssistantUIRuntime } from './AssistantUIRuntimeProvider';

// Generative UI
export {
  GenerativeUIProvider,
  useGenerativeUI,
  useRegisterGenerativeComponent,
  RegisteredComponent,
  CardComponent,
  ListComponent,
  TableComponent,
  StatusComponent,
  ErrorComponent,
  FormComponent,
  defaultGenerativeComponents,
} from './common/GenerativeUI';

// Tool execution display
export { ToolExecutionCard, ToolExecutionList } from './common/ToolExecutionCard';

// Types
export type {
  ChatMessage,
  ToolCall,
  ToolResult,
  GenerativeUIComponent,
  ChatRequest,
  ChatResponse,
  SSEEventType,
  SSEEvent,
  ChatState,
  ChatbotContextValue,
  ToolDefinition,
  GenerativeComponentEntry,
  RegisteredComponentProps,
  ChatbotSidebarProps,
  CardComponentProps,
  ListComponentProps,
  TableComponentProps,
  StatusComponentProps,
  ErrorComponentProps,
  FormComponentProps,
} from './common/interface';

// Services
export {
  ChatService,
  RateLimitError,
  getChatService,
  initializeChatService,
} from './common/ChatService';
