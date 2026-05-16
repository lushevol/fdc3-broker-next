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
};

export type WorkflowRegistry = {
  findWorkflow(workflowId: string): Promise<WorkflowDefinition | null>;
  findWorkflowsByInput(input?: WorkflowJsonObject): Promise<WorkflowDefinition[]>;
};
