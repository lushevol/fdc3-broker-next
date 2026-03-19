// Main component exports
export { ChatbotSidebar } from './index';
export { default as ChatbotSidebarDefault } from './index';

// Context and hooks
export { ChatbotProvider, useChatbot, useToolRegistry } from './common/ChatbotProvider';

/**
 * @deprecated Use the assistant-ui runtime directly where possible.
 * This export is retained for compile-time compatibility during the cutover.
 */
export { useChatbotController } from './common/useController';

// Assistant-UI Runtime
export {
  AssistantUIRuntimeProvider,
  useAssistantUIRuntime,
} from './AssistantUIRuntimeProvider';

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

// Compatibility helpers
export {
  ChatService,
  RateLimitError,
  getChatService,
  initializeChatService,
} from './common/ChatService';

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
