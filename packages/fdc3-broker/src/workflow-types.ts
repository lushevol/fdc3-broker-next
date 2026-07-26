export type WorkflowJsonObject = Record<string, unknown>;

export type WorkflowInputBinding = {
  fromStepId: string;
  resultPath: string;
  contextPath: string;
  required: boolean;
};

export type WorkflowStepDefinition = {
  id: string;
  intent: string;
  contextTemplate: WorkflowJsonObject;
  targetAppId?: string;
  timeoutMs?: number;
  continueOnError?: boolean;
  inputBindings?: WorkflowInputBinding[];
};

export type WorkflowDefinition = {
  workflowId: string;
  title: string;
  description?: string;
  inputSchema: WorkflowJsonObject;
  steps: WorkflowStepDefinition[];
};

export type WorkflowOptions = {
  timeoutMs?: number;
};

export type WorkflowCapabilityInspectionRequest = {
  intent: string;
  targetAppId?: string;
};

export type WorkflowCapabilityInspection = {
  state: 'ready' | 'declared-only' | 'unavailable' | 'unknown';
  appId?: string;
  instanceId?: string;
};

export type WorkflowEventType =
  | 'workflow.started'
  | 'node.started'
  | 'node.completed'
  | 'node.failed'
  | 'workflow.completed'
  | 'workflow.failed';

export type WorkflowEvent = {
  runId: string;
  workflowId: string;
  sequence: number;
  timestamp: string;
  type: WorkflowEventType;
  stepId?: string;
  intent?: string;
  context?: WorkflowJsonObject;
  result?: unknown;
  error?: string;
  summary?: string;
};

export type WorkflowEventListener = (event: WorkflowEvent) => void;

export type WorkflowEventSubscription = {
  unsubscribe(): void;
};

export type WorkflowStepResult = {
  stepId: string;
  intent: string;
  status: 'ok' | 'error' | 'skipped';
  context: WorkflowJsonObject;
  result?: unknown;
  error?: string;
};

export type WorkflowTranscript = {
  status: 'ok' | 'error';
  workflowId: string;
  title: string;
  input: WorkflowJsonObject;
  completedSteps: WorkflowStepResult[];
  failedStep?: WorkflowStepResult;
  summary: string;
};

export type WorkflowResolution = {
  workflowId: string;
  getResult(): Promise<WorkflowTranscript>;
  subscribe(listener: WorkflowEventListener): WorkflowEventSubscription;
};

export type WorkflowRegistry = {
  findWorkflow(workflowId: string): Promise<WorkflowDefinition | null>;
  findWorkflowsByInput(input?: WorkflowJsonObject): Promise<WorkflowDefinition[]>;
};
