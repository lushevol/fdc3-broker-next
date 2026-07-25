export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = Record<string, unknown>;

export type WorkflowFailureCode =
  | 'UNKNOWN_WORKFLOW'
  | 'INVALID_INPUT'
  | 'BINDING_FAILED'
  | 'CAPABILITY_UNAVAILABLE'
  | 'CAPABILITY_INSPECTION_FAILED'
  | 'HANDLER_NOT_REGISTERED'
  | 'HANDLER_NO_RESULT'
  | 'INTENT_RAISE_FAILED'
  | 'INTENT_EXECUTION_FAILED'
  | 'RESULT_TIMEOUT'
  | 'RESULT_INVALID'
  | 'CANCELLED'
  | 'INTERNAL_ERROR';

export type WorkflowFailure = {
  code: WorkflowFailureCode;
  message: string;
  recoverable: boolean;
  retryable: boolean;
  hint: string;
  workflowId: string;
  stepId?: string;
  intent?: string;
  attempt?: number;
};

export type WorkflowInputBinding = {
  fromStepId: string;
  resultPath: string;
  contextPath: string;
  required: boolean;
};

export type WorkflowRetryPolicy = {
  maxAttempts: number;
  delayMs?: number;
  retryOn: WorkflowFailureCode[];
};

export type WorkflowValueValidator = (value: JsonObject) => boolean;
export type WorkflowResultValidator = (value: unknown) => boolean;

export type WorkflowStepDefinition = {
  id: string;
  intent: string;
  contextTemplate: JsonObject;
  targetAppId?: string;
  timeoutMs?: number;
  continueOnError?: boolean;
  resultRequired?: boolean;
  inputBindings?: WorkflowInputBinding[];
  retry?: WorkflowRetryPolicy;
  validateResult?: WorkflowResultValidator;
};

export type WorkflowDefinition = {
  workflowId: string;
  title: string;
  description?: string;
  inputSchema: JsonObject;
  validateInput?: WorkflowValueValidator;
  steps: WorkflowStepDefinition[];
};

export type IntentResolutionLike = {
  getResult(): Promise<unknown>;
};

export type Fdc3IntentClient = {
  raiseIntent(
    intent: string,
    context: JsonObject,
    target?: { appId: string },
  ): Promise<IntentResolutionLike>;
};

export type CapabilityInspectionRequest = {
  workflowId: string;
  stepId: string;
  intent: string;
  context: JsonObject;
  targetAppId?: string;
};

export type CapabilityInspection = {
  state: 'ready' | 'declared-only' | 'unavailable' | 'unknown';
  appId?: string;
  instanceId?: string;
  detail?: string;
};

export type CapabilityInspector = (
  request: CapabilityInspectionRequest,
) => Promise<CapabilityInspection>;

export type WorkflowEventType =
  | 'workflow.started'
  | 'node.started'
  | 'node.retrying'
  | 'node.completed'
  | 'node.failed'
  | 'workflow.completed'
  | 'workflow.failed'
  | 'workflow.cancelled';

export type WorkflowEvent = {
  runId: string;
  workflowId: string;
  sequence: number;
  timestamp: string;
  type: WorkflowEventType;
  stepId?: string;
  intent?: string;
  attempt?: number;
  context?: JsonObject;
  result?: unknown;
  failure?: WorkflowFailure;
  summary?: string;
};

export type WorkflowEventListener = (event: WorkflowEvent) => void;

export type WorkflowEventSubscription = {
  unsubscribe(): void;
};

export type WorkflowStepResult = {
  stepId: string;
  intent: string;
  status: 'success' | 'error';
  attempts: number;
  context: JsonObject;
  result?: unknown;
  failure?: WorkflowFailure;
};

export type WorkflowTranscript = {
  runId: string;
  workflowId: string;
  title: string;
  status: 'success' | 'failed' | 'cancelled';
  input: JsonObject;
  completedSteps: WorkflowStepResult[];
  failures: WorkflowFailure[];
  startedAt: string;
  completedAt: string;
  summary: string;
};

export type WorkflowSummary = {
  workflowId: string;
  title: string;
  description?: string;
  inputSchema: JsonObject;
  stepCount: number;
  steps: Array<{
    id: string;
    intent: string;
    targetAppId?: string;
    continueOnError: boolean;
    resultRequired: boolean;
  }>;
};

export type CapabilityCheck = {
  stepId: string;
  intent: string;
  targetAppId?: string;
  state: CapabilityInspection['state'];
  failure?: WorkflowFailure;
};

export type WorkflowPreflightReport = {
  workflowId: string;
  ready: boolean;
  checks: CapabilityCheck[];
};

export type WorkflowDiagnostic = {
  code: 'EVENT_OBSERVER_FAILED' | 'CAPABILITY_INSPECTOR_FAILED';
  message: string;
  workflowId: string;
  stepId?: string;
};

export type WorkflowOrchestratorOptions = {
  workflows: WorkflowDefinition[];
  client: Fdc3IntentClient;
  inspectCapability?: CapabilityInspector;
  preflightMode?: 'best-effort' | 'required' | 'disabled';
  defaultStepTimeoutMs?: number;
  onDiagnostic?: (diagnostic: WorkflowDiagnostic) => void;
  now?: () => Date;
  createRunId?: (workflowId: string) => string;
};

export type WorkflowExecutionOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
  onEvent?: WorkflowEventListener;
};
