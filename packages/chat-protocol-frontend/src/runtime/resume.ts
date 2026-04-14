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

export function createToolCallResumeRequest(
  input: ToolCallResumeRequest,
): ToolCallResumeRequest {
  return input;
}

export function createActionResumeRequest(
  input: ActionResumeRequest,
): ActionResumeRequest {
  return input;
}
