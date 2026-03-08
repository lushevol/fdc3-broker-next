// Chat message types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

// Tool call from the assistant
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

// Tool execution result
export interface ToolResult {
  toolCallId: string;
  result: unknown;
  error?: string;
}

// Generative UI component directive
export interface GenerativeUIComponent {
  name: string;
  props: Record<string, unknown>;
}

// Chat request to backend
export interface ChatRequest {
  messages: ChatMessage[];
  conversationId?: string;
  stream?: boolean;
}

// Chat response from backend
export interface ChatResponse {
  id: string;
  conversationId: string;
  message: ChatMessage;
}

// SSE event types
export type SSEEventType = 'message' | 'tool_call' | 'tool_result' | 'generative_ui' | 'error' | 'done';

export interface SSEEvent {
  type: SSEEventType;
  data: unknown;
}

// Chat state
export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  conversationId: string | null;
  isOpen: boolean;
}

// Chatbot context value
export interface ChatbotContextValue extends ChatState {
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
  toggleSidebar: () => void;
  retryLastMessage: () => Promise<void>;
}

// Tool definition for registration
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  requiresConfirmation?: boolean;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}

// Generative component registry entry
export interface GenerativeComponentEntry {
  name: string;
  component: React.ComponentType<{ props: Record<string, unknown> }>;
  propTypes?: Record<string, unknown>;
}

// Component props for generative UI rendering
export interface RegisteredComponentProps {
  name: string;
  props: Record<string, unknown>;
  onAction?: (action: string, data: unknown) => void;
}

// Chatbot sidebar props
export interface ChatbotSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  apiUrl?: string;
  position?: 'left' | 'right';
  width?: number | string;
}

// Default generative component props
export interface CardComponentProps {
  title: string;
  content: string;
  icon?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export interface ListComponentProps {
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
    href?: string;
    onClick?: () => void;
  }>;
  ordered?: boolean;
}

export interface TableComponentProps {
  columns: Array<{ key: string; label: string }>;
  rows: Record<string, unknown>[];
}

export interface StatusComponentProps {
  status: 'loading' | 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: string;
}

export interface ErrorComponentProps {
  title: string;
  message: string;
  code?: string;
  retryable?: boolean;
  onRetry?: () => void;
}

export interface FormComponentProps {
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea';
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
    defaultValue?: unknown;
  }>;
  submitLabel?: string;
  onSubmit: (values: Record<string, unknown>) => void;
}