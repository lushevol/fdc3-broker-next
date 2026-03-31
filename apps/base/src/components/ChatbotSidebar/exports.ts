// Main component exports
export { ChatbotSidebar } from './index';
export { default as ChatbotSidebarDefault } from './index';

// Assistant-UI Runtime
export {
  AssistantUIRuntimeProvider,
  useAssistantToolMetadata,
  useAssistantToolRoutingDebug,
  useAssistantUIRuntime,
  useRegisterAssistantTools,
} from './AssistantUIRuntimeProvider';
export type { AssistantUIRuntimeProviderValue } from './AssistantUIRuntimeProvider';
export { ToolRegistryDebugPanel } from './ToolRegistryDebugPanel';
export { Fdc3IntentToolRegistration } from './Fdc3IntentToolRegistration';
export { WorkspaceSummaryToolRegistrationExample } from './WorkspaceSummaryToolRegistrationExample';
export type {
  AssistantRegisteredToolkit,
  AssistantToolMetadata,
  AssistantToolResolutionDebug,
} from './tools/toolRouting';

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

// Demo frontend tools
export { createDemoToolkit } from './tools/demoToolkit';
export { createFdc3IntentToolkit } from './tools/fdc3IntentTool';
export { createWorkspaceSummaryToolkit } from './tools/workspaceSummaryTool';

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
