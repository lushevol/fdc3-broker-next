export type ChatRole = 'system' | 'user' | 'assistant' | 'tool';

export type ChatFinishReason = 'stop' | 'tool-calls' | 'action-required' | 'error';

export type ChatToolCallState =
  | 'input-available'
  | 'awaiting-execution'
  | 'awaiting-human'
  | 'output-available'
  | 'output-error';

export type ChatExecutionTarget = 'backend' | 'frontend';

export type ChatStepStatus = 'pending' | 'running' | 'completed' | 'failed';

export type ChatActionStatus = 'pending' | 'resolved';

export type ChatToolSource = 'frontend' | 'backend' | 'human' | 'mcp';

export type ChatTextPart = {
  type: 'text';
  text: string;
};

export type ChatReasoningSummaryPart = {
  type: 'reasoning-summary';
  text: string;
};

export type ChatPlanPart = {
  type: 'plan';
  planId: string;
  summary: string;
};

export type ChatStepStartPart = {
  type: 'step-start';
  stepId: string;
  title?: string;
};

export type ChatStepPart = {
  type: 'step';
  stepId: string;
  title: string;
  status: ChatStepStatus;
  detail?: string;
};

export type ChatToolCallPart = {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  source: ChatToolSource;
  state: ChatToolCallState;
  input: Record<string, unknown>;
  providerId?: string;
  output?: Record<string, unknown>;
  error?: string;
};

export type ChatToolResultPart = {
  type: 'tool-result';
  toolCallId: string;
  output: Record<string, unknown>;
  error?: string;
};

export type ChatCardPart = {
  type: 'card';
  cardType: string;
  props: Record<string, unknown>;
};

export type ChatActionOption = {
  id: string;
  label: string;
};

export type ChatActionPart = {
  type: 'action';
  actionId: string;
  actionType: string;
  status: ChatActionStatus;
  title: string;
  description?: string;
  toolCallId?: string;
  options?: ChatActionOption[];
};

export type ChatErrorPart = {
  type: 'error';
  message: string;
  code?: string;
};

export type ChatFilePart = {
  type: 'file';
  url?: string;
  fileId?: string;
  name?: string;
  mimeType?: string;
  sizeBytes?: number;
  data?: string;
  encoding?: 'base64';
};

export type ChatImagePart = {
  type: 'image';
  url: string;
  alt?: string;
  mimeType?: string;
};

export type ChatUserPart = ChatTextPart | ChatFilePart | ChatImagePart;
export type ChatAssistantPart =
  | ChatTextPart
  | ChatReasoningSummaryPart
  | ChatPlanPart
  | ChatStepStartPart
  | ChatStepPart
  | ChatToolCallPart
  | ChatToolResultPart
  | ChatCardPart
  | ChatActionPart
  | ChatErrorPart;

export type ChatPart = ChatUserPart | ChatAssistantPart;

export type ChatMessageMetadata = Record<string, unknown>;

export type ChatSystemMessage = {
  id: string;
  role: 'system';
  parts: ChatTextPart[];
  metadata?: ChatMessageMetadata;
};

export type ChatUserMessage = {
  id: string;
  role: 'user';
  parts: ChatUserPart[];
  metadata?: ChatMessageMetadata;
};

export type ChatAssistantMessage = {
  id: string;
  role: 'assistant';
  parts: ChatAssistantPart[];
  metadata?: ChatMessageMetadata;
};

export type ChatToolMessage = {
  id: string;
  role: 'tool';
  toolCallId: string;
  toolName: string;
  parts: ChatToolResultPart[];
  metadata?: ChatMessageMetadata;
};

export type ChatMessage =
  | ChatSystemMessage
  | ChatUserMessage
  | ChatAssistantMessage
  | ChatToolMessage;

export type ChatRunConfig = {
  modelName?: string;
  reasoningVisibility?: 'summary' | 'hidden';
};

export type ChatToolDescriptor = {
  name: string;
  source: ChatToolSource;
  description: string;
  parameters: Record<string, unknown>;
  providerId?: string;
  requiresConfirmation?: boolean;
  ui?: Record<string, unknown>;
};

export type ChatRunContext = {
  workspace?: {
    activeWorkspaceId?: string;
    activeAppId?: string;
  };
  tools?: ChatToolDescriptor[];
  [key: string]: unknown;
};

export type ChatRunRequest = {
  conversationId: string;
  runId?: string | null;
  trigger?: 'submit-message' | 'submit-tool-result' | 'submit-action';
  config?: ChatRunConfig;
  context?: ChatRunContext;
  messages: ChatMessage[];
  metadata?: ChatMessageMetadata;
  /**
   * Explicit user ID from the MFE base / frontend auth context.
   * Used for per-user memory isolation on the backend.
   */
  userId?: string;
};

export type ChatFrameMetadata = Record<string, unknown>;

export type ChatStartFrame = {
  type: 'start';
  runId?: string;
  conversationId?: string;
};

export type ChatMessageStartFrame = {
  type: 'message-start';
  messageId: string;
  role: ChatRole;
};

export type ChatMessageMetadataFrame = {
  type: 'message-metadata';
  messageId: string;
  metadata: ChatFrameMetadata;
};

export type ChatStartStepFrame = {
  type: 'start-step';
  stepId: string;
  title?: string;
  parentStepId?: string;
};

export type ChatReasoningSummaryFrame = {
  type: 'reasoning-summary';
  messageId?: string;
  text: string;
};

export type ChatPlanAvailableFrame = {
  type: 'plan-available';
  planId: string;
  summary: string;
};

export type ChatStepStatusFrame = {
  type: 'step-status';
  stepId: string;
  status: ChatStepStatus;
  detail?: string;
};

export type ChatFinishStepFrame = {
  type: 'finish-step';
  stepId: string;
  status?: Exclude<ChatStepStatus, 'pending' | 'running'>;
};

export type ChatTextStartFrame = {
  type: 'text-start';
  messageId: string;
  partId?: string;
};

export type ChatTextDeltaFrame = {
  type: 'text-delta';
  messageId: string;
  partId?: string;
  delta: string;
};

export type ChatTextEndFrame = {
  type: 'text-end';
  messageId: string;
  partId?: string;
};

export type ChatToolInputStartFrame = {
  type: 'tool-input-start';
  toolCallId: string;
  toolName: string;
  source?: ChatToolSource;
  providerId?: string;
  executionTarget?: ChatExecutionTarget;
};

export type ChatToolInputDeltaFrame = {
  type: 'tool-input-delta';
  toolCallId: string;
  delta: string;
};

export type ChatToolInputAvailableFrame = {
  type: 'tool-input-available';
  toolCallId: string;
  input: Record<string, unknown>;
  source?: ChatToolSource;
  providerId?: string;
};

export type ChatToolOutputAvailableFrame = {
  type: 'tool-output-available';
  toolCallId: string;
  output: Record<string, unknown>;
  source?: ChatToolSource;
  providerId?: string;
};

export type ChatToolOutputErrorFrame = {
  type: 'tool-output-error';
  toolCallId: string;
  error: string;
  source?: ChatToolSource;
  providerId?: string;
};

export type ChatUiPartAvailableFrame = {
  type: 'ui-part-available';
  messageId?: string;
  cardType: string;
  props: Record<string, unknown>;
};

export type ChatActionRequiredFrame = {
  type: 'action-required';
  actionId: string;
  actionType: string;
  title: string;
  description?: string;
  options?: ChatActionOption[];
};

export type ChatActionResolvedFrame = {
  type: 'action-resolved';
  actionId: string;
  status: 'resolved';
  decision: string;
};

export type ChatFinishFrame = {
  type: 'finish';
  finishReason: ChatFinishReason;
  messageId?: string;
  usage?: Record<string, unknown>;
};

export type ChatErrorFrame = {
  type: 'error';
  message: string;
  code?: string;
};

export type ChatStreamFrame =
  | ChatStartFrame
  | ChatMessageStartFrame
  | ChatMessageMetadataFrame
  | ChatStartStepFrame
  | ChatReasoningSummaryFrame
  | ChatPlanAvailableFrame
  | ChatStepStatusFrame
  | ChatFinishStepFrame
  | ChatTextStartFrame
  | ChatTextDeltaFrame
  | ChatTextEndFrame
  | ChatToolInputStartFrame
  | ChatToolInputDeltaFrame
  | ChatToolInputAvailableFrame
  | ChatToolOutputAvailableFrame
  | ChatToolOutputErrorFrame
  | ChatUiPartAvailableFrame
  | ChatActionRequiredFrame
  | ChatActionResolvedFrame
  | ChatFinishFrame
  | ChatErrorFrame;
