import type {
  WorkflowFailure,
  WorkflowFailureCode,
  WorkflowStepDefinition,
} from './types';

const FAILURE_DETAILS: Record<
  WorkflowFailureCode,
  Pick<WorkflowFailure, 'message' | 'recoverable' | 'retryable' | 'hint'>
> = {
  UNKNOWN_WORKFLOW: {
    message: 'The requested workflow is not registered.',
    recoverable: true,
    retryable: false,
    hint: 'List available workflows and use a registered workflow identifier.',
  },
  INVALID_INPUT: {
    message: 'The workflow input is invalid.',
    recoverable: true,
    retryable: false,
    hint: 'Inspect the workflow input schema and correct the request.',
  },
  BINDING_FAILED: {
    message: 'A workflow context binding could not be resolved.',
    recoverable: true,
    retryable: false,
    hint: 'Inspect upstream results and required result paths.',
  },
  CAPABILITY_UNAVAILABLE: {
    message: 'No application declares the required FDC3 capability.',
    recoverable: true,
    retryable: false,
    hint: 'Install or enable a tile that declares the required intent.',
  },
  CAPABILITY_INSPECTION_FAILED: {
    message: 'Capability readiness could not be verified.',
    recoverable: true,
    retryable: true,
    hint: 'Retry readiness inspection or use best-effort preflight.',
  },
  HANDLER_NOT_REGISTERED: {
    message: 'The target tile declares the intent but has no live handler registered.',
    recoverable: true,
    retryable: true,
    hint: 'Open or restart the target tile and verify its intent listener registration.',
  },
  HANDLER_NO_RESULT: {
    message: 'The FDC3 intent completed without a workflow result.',
    recoverable: true,
    retryable: true,
    hint: 'Verify that the tile installs a handler and returns a result from it.',
  },
  INTENT_RAISE_FAILED: {
    message: 'The FDC3 intent could not be routed.',
    recoverable: true,
    retryable: true,
    hint: 'Check target availability, entitlements, and resolver configuration.',
  },
  INTENT_EXECUTION_FAILED: {
    message: 'The FDC3 intent handler failed.',
    recoverable: true,
    retryable: true,
    hint: 'Inspect the target tile logs and retry only if the operation is idempotent.',
  },
  RESULT_TIMEOUT: {
    message: 'The FDC3 intent result exceeded its execution timeout.',
    recoverable: true,
    retryable: true,
    hint: 'Check target health or increase the bounded timeout.',
  },
  RESULT_INVALID: {
    message: 'The FDC3 intent returned an invalid workflow result.',
    recoverable: true,
    retryable: false,
    hint: 'Align the handler result with the workflow result contract.',
  },
  CANCELLED: {
    message: 'The workflow was cancelled.',
    recoverable: true,
    retryable: false,
    hint: 'Start a new run when execution should resume.',
  },
  INTERNAL_ERROR: {
    message: 'The workflow encountered an unexpected internal error.',
    recoverable: false,
    retryable: false,
    hint: 'Inspect host diagnostics using the run identifier.',
  },
};

export function createFailure(
  code: WorkflowFailureCode,
  workflowId: string,
  step?: WorkflowStepDefinition,
  attempt?: number,
): WorkflowFailure {
  return {
    code,
    ...FAILURE_DETAILS[code],
    workflowId,
    stepId: step?.id,
    intent: step?.intent,
    attempt,
  };
}
