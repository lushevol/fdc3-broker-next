/**
 * SSE Event Types for Chatbot Backend
 *
 * These types represent the custom SSE event protocol used by the chatbot-backend service.
 * They need to be transformed to assistant-ui's message format.
 */

export type SSEEventType =
  | 'message'
  | 'execution_plan'
  | 'execution_step'
  | 'tool_call'
  | 'tool_result'
  | 'generative_ui'
  | 'error'
  | 'done'
  | 'conversation_id';

export interface SSEEvent {
  type: SSEEventType;
  data: string;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  executionTarget?: 'backend' | 'frontend';
  requiresConfirmation?: boolean;
}

export interface ToolResult {
  toolCallId: string;
  result: unknown;
  error?: string;
}

export interface GenerativeUIDirective {
  name: string;
  props: Record<string, unknown>;
  toolCallId?: string;
}

export interface ExecutionPlanEvent {
  planId: string;
  summary: string;
  status: 'running' | 'completed' | 'failed' | 'awaiting_review';
  totalSteps: number;
}

export interface ExecutionStepEvent {
  planId: string;
  stepId: string;
  targetName: string;
  summary: string;
  stepType: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

/**
 * Assistant UI Content Part Types
 * Based on assistant-ui's expected format
 */
export type ContentPartType = 'text' | 'tool-call' | 'data';

export interface TextContentPart {
  type: 'text';
  text: string;
}

export interface ToolCallContentPart {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  argsText: string;
  result?: unknown;
  isError?: boolean;
  error?: string;
  status?: ToolCall['status'];
  executionTarget?: ToolCall['executionTarget'];
  requiresConfirmation?: boolean;
}

export interface GenerativeUIContentPart {
  type: 'data';
  name: 'generative-ui';
  data: {
    componentName: string;
    props: Record<string, unknown>;
  };
}

export type ContentPart = TextContentPart | ToolCallContentPart | GenerativeUIContentPart;

/**
 * Assistant UI Message Format
 */
export interface AssistantUIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: ContentPart[];
  createdAt?: Date;
}

/**
 * Streaming state tracking
 */
export interface StreamingState {
  conversationId: string | null;
  assistantMessageId: string | null;
  accumulatedContent: string;
  pendingToolCalls: Map<string, ToolCallContentPart>;
}
