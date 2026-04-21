import type { ChatMessage } from 'chat-protocol-contract';

export type ToolCallResumeRequest = {
  conversationId: string;
  toolCallId: string;
  confirmed: boolean;
  payload?: unknown;
};

export type ActionResumeRequest = {
  conversationId: string;
  actionId: string;
  decision: 'resolved' | 'rejected' | string;
  payload?: unknown;
};

export function createToolCallResumeRequest(input: ToolCallResumeRequest): ToolCallResumeRequest {
  return input;
}

export function createActionResumeRequest(input: ActionResumeRequest): ActionResumeRequest {
  return input;
}

export function appendResolvedToolResult(
  messages: ChatMessage[],
  toolResultMessage: ChatMessage,
): ChatMessage[] {
  return [...messages, toolResultMessage];
}

export function appendHumanDecision(
  messages: ChatMessage[],
  decisionMessage: ChatMessage,
): ChatMessage[] {
  return [...messages, decisionMessage];
}
