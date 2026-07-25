import { applyBindings, renderContext, validateWorkflowDefinition } from './definition';
import { createFailure } from './failures';
import type {
  CapabilityCheck,
  CapabilityInspection,
  JsonObject,
  WorkflowDefinition,
  WorkflowDiagnostic,
  WorkflowEvent,
  WorkflowEventListener,
  WorkflowEventSubscription,
  WorkflowExecutionOptions,
  WorkflowFailure,
  WorkflowOrchestratorOptions,
  WorkflowPreflightReport,
  WorkflowStepDefinition,
  WorkflowStepResult,
  WorkflowSummary,
  WorkflowTranscript,
} from './types';

const DEFAULT_STEP_TIMEOUT_MS = 30_000;
let nextRunSequence = 1;

class ControlledExecutionError extends Error {
  constructor(readonly code: 'CANCELLED' | 'RESULT_TIMEOUT') {
    super(code);
  }
}

function delay(durationMs: number, signal?: AbortSignal): Promise<void> {
  if (durationMs <= 0) {
    return Promise.resolve();
  }
  return controlledPromise(
    new Promise((resolve) => {
      setTimeout(resolve, durationMs);
    }),
    durationMs + 1,
    signal,
  );
}

function controlledPromise<T>(
  promise: Promise<T>,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new ControlledExecutionError('CANCELLED'));
      return;
    }
    let settled = false;
    const finish = (callback: () => void): void => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      signal?.removeEventListener('abort', onAbort);
      callback();
    };
    const onAbort = (): void => finish(() => reject(new ControlledExecutionError('CANCELLED')));
    const timeout = setTimeout(
      () => finish(() => reject(new ControlledExecutionError('RESULT_TIMEOUT'))),
      timeoutMs,
    );
    signal?.addEventListener('abort', onAbort, { once: true });
    promise.then(
      (value) => finish(() => resolve(value)),
      (error: unknown) => finish(() => reject(error)),
    );
  });
}

function summarize(workflow: WorkflowDefinition): WorkflowSummary {
  return {
    workflowId: workflow.workflowId,
    title: workflow.title,
    description: workflow.description,
    inputSchema: workflow.inputSchema,
    stepCount: workflow.steps.length,
    steps: workflow.steps.map((step) => ({
      id: step.id,
      intent: step.intent,
      targetAppId: step.targetAppId,
      continueOnError: step.continueOnError ?? false,
      resultRequired: step.resultRequired ?? true,
    })),
  };
}

export class WorkflowOrchestrator {
  private readonly workflows = new Map<string, WorkflowDefinition>();
  private readonly listeners = new Set<WorkflowEventListener>();
  private readonly now: () => Date;

  constructor(private readonly options: WorkflowOrchestratorOptions) {
    this.now = options.now ?? (() => new Date());
    for (const workflow of options.workflows) {
      validateWorkflowDefinition(workflow);
      if (this.workflows.has(workflow.workflowId)) {
        throw new Error(`Duplicate workflow id ${workflow.workflowId}`);
      }
      this.workflows.set(workflow.workflowId, workflow);
    }
  }

  listWorkflows(): WorkflowSummary[] {
    return Array.from(this.workflows.values(), summarize);
  }

  inspectWorkflow(workflowId: string): WorkflowSummary | null {
    const workflow = this.workflows.get(workflowId);
    return workflow ? summarize(workflow) : null;
  }

  subscribe(listener: WorkflowEventListener): WorkflowEventSubscription {
    this.listeners.add(listener);
    return {
      unsubscribe: () => {
        this.listeners.delete(listener);
      },
    };
  }

  async preflight(workflowId: string, input: JsonObject = {}): Promise<WorkflowPreflightReport> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      return {
        workflowId,
        ready: false,
        checks: [],
      };
    }
    const checks: CapabilityCheck[] = [];
    for (const step of workflow.steps) {
      let context: JsonObject = {};
      try {
        context = renderContext(step.contextTemplate, input);
      } catch {
        checks.push({
          stepId: step.id,
          intent: step.intent,
          targetAppId: step.targetAppId,
          state: 'unknown',
          failure: createFailure('BINDING_FAILED', workflowId, step),
        });
        continue;
      }
      checks.push(await this.inspectStep(workflowId, step, context));
    }
    return {
      workflowId,
      ready: checks.every((check) => !check.failure),
      checks,
    };
  }

  async execute(
    workflowId: string,
    input: JsonObject = {},
    executionOptions: WorkflowExecutionOptions = {},
  ): Promise<WorkflowTranscript> {
    const runId =
      this.options.createRunId?.(workflowId) ??
      `${workflowId}-${this.now().getTime()}-${nextRunSequence++}`;
    const startedAt = this.now().toISOString();
    const workflow = this.workflows.get(workflowId);
    let sequence = 0;
    const emit = (event: Omit<WorkflowEvent, 'runId' | 'workflowId' | 'sequence' | 'timestamp'>) => {
      sequence += 1;
      const completeEvent: WorkflowEvent = {
        ...event,
        runId,
        workflowId,
        sequence,
        timestamp: this.now().toISOString(),
      };
      this.notifyObservers(completeEvent, executionOptions.onEvent);
    };
    if (!workflow) {
      const failure = createFailure('UNKNOWN_WORKFLOW', workflowId);
      emit({ type: 'workflow.failed', failure, summary: failure.message });
      return this.transcript({
        runId,
        workflowId,
        title: workflowId,
        input,
        startedAt,
        status: 'failed',
        completedSteps: [],
        failures: [failure],
        summary: failure.message,
      });
    }
    emit({ type: 'workflow.started' });
    if (executionOptions.signal?.aborted) {
      return this.cancelledTranscript(workflow, runId, input, startedAt, [], emit);
    }
    if (!this.validInput(workflow, input)) {
      const failure = createFailure('INVALID_INPUT', workflowId);
      emit({ type: 'workflow.failed', failure, summary: failure.message });
      return this.transcript({
        runId,
        workflowId,
        title: workflow.title,
        input,
        startedAt,
        status: 'failed',
        completedSteps: [],
        failures: [failure],
        summary: failure.message,
      });
    }
    const preflight = await this.preflight(workflowId, input);
    const preflightFailure = preflight.checks.find((check) => check.failure)?.failure;
    if (preflightFailure) {
      emit({
        type: 'node.failed',
        stepId: preflightFailure.stepId,
        intent: preflightFailure.intent,
        failure: preflightFailure,
      });
      emit({ type: 'workflow.failed', failure: preflightFailure, summary: preflightFailure.message });
      return this.transcript({
        runId,
        workflowId,
        title: workflow.title,
        input,
        startedAt,
        status: 'failed',
        completedSteps: [],
        failures: [preflightFailure],
        summary: preflightFailure.message,
      });
    }

    const results = new Map<string, unknown>();
    const completedSteps: WorkflowStepResult[] = [];
    const failures: WorkflowFailure[] = [];
    const deadline =
      executionOptions.timeoutMs === undefined
        ? undefined
        : Date.now() + executionOptions.timeoutMs;

    for (const step of workflow.steps) {
      if (executionOptions.signal?.aborted) {
        return this.cancelledTranscript(
          workflow,
          runId,
          input,
          startedAt,
          completedSteps,
          emit,
          failures,
        );
      }
      let context: JsonObject = {};
      try {
        context = applyBindings(
          renderContext(step.contextTemplate, input),
          step.inputBindings,
          results,
        );
      } catch {
        const failure = createFailure('BINDING_FAILED', workflowId, step);
        const outcome = this.recordFailure(step, context, 1, failure, completedSteps, failures, emit);
        if (!outcome) {
          return this.failedTranscript(workflow, runId, input, startedAt, completedSteps, failures, emit);
        }
        continue;
      }

      const maxAttempts = step.retry?.maxAttempts ?? 1;
      let stepCompleted = false;
      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        emit({
          type: 'node.started',
          stepId: step.id,
          intent: step.intent,
          context,
          attempt,
        });
        const attemptResult = await this.executeAttempt(
          workflowId,
          step,
          context,
          attempt,
          deadline,
          executionOptions.signal,
        );
        if ('result' in attemptResult) {
          const stepResult: WorkflowStepResult = {
            stepId: step.id,
            intent: step.intent,
            status: 'success',
            attempts: attempt,
            context,
            result: attemptResult.result,
          };
          results.set(step.id, attemptResult.result);
          completedSteps.push(stepResult);
          emit({
            type: 'node.completed',
            stepId: step.id,
            intent: step.intent,
            context,
            result: attemptResult.result,
            attempt,
          });
          stepCompleted = true;
          break;
        }
        const failure = attemptResult.failure;
        if (failure.code === 'CANCELLED') {
          failures.push(failure);
          return this.cancelledTranscript(
            workflow,
            runId,
            input,
            startedAt,
            completedSteps,
            emit,
            failures,
          );
        }
        const canRetry =
          attempt < maxAttempts && (step.retry?.retryOn.includes(failure.code) ?? false);
        if (canRetry) {
          emit({
            type: 'node.retrying',
            stepId: step.id,
            intent: step.intent,
            context,
            attempt,
            failure,
          });
          try {
            await delay(step.retry?.delayMs ?? 0, executionOptions.signal);
          } catch {
            failures.push(createFailure('CANCELLED', workflowId, step, attempt));
            return this.cancelledTranscript(
              workflow,
              runId,
              input,
              startedAt,
              completedSteps,
              emit,
              failures,
            );
          }
          continue;
        }
        const shouldContinue = this.recordFailure(
          step,
          context,
          attempt,
          failure,
          completedSteps,
          failures,
          emit,
        );
        if (!shouldContinue) {
          return this.failedTranscript(
            workflow,
            runId,
            input,
            startedAt,
            completedSteps,
            failures,
            emit,
          );
        }
        break;
      }
      if (!stepCompleted && !step.continueOnError) {
        return this.failedTranscript(
          workflow,
          runId,
          input,
          startedAt,
          completedSteps,
          failures,
          emit,
        );
      }
    }

    const summary = `Completed ${completedSteps.filter((step) => step.status === 'success').length} of ${workflow.steps.length} workflow steps.`;
    emit({ type: 'workflow.completed', summary });
    return this.transcript({
      runId,
      workflowId,
      title: workflow.title,
      input,
      startedAt,
      status: 'success',
      completedSteps,
      failures,
      summary,
    });
  }

  private async inspectStep(
    workflowId: string,
    step: WorkflowStepDefinition,
    context: JsonObject,
  ): Promise<CapabilityCheck> {
    if (!this.options.inspectCapability || this.options.preflightMode === 'disabled') {
      return {
        stepId: step.id,
        intent: step.intent,
        targetAppId: step.targetAppId,
        state: 'unknown',
      };
    }
    let inspection: CapabilityInspection;
    try {
      inspection = await this.options.inspectCapability({
        workflowId,
        stepId: step.id,
        intent: step.intent,
        context,
        targetAppId: step.targetAppId,
      });
    } catch {
      this.diagnostic({
        code: 'CAPABILITY_INSPECTOR_FAILED',
        message: 'Capability inspector rejected its readiness request.',
        workflowId,
        stepId: step.id,
      });
      return {
        stepId: step.id,
        intent: step.intent,
        targetAppId: step.targetAppId,
        state: 'unknown',
        failure:
          this.options.preflightMode === 'required'
            ? createFailure('CAPABILITY_INSPECTION_FAILED', workflowId, step)
            : undefined,
      };
    }
    const failureCode =
      inspection.state === 'declared-only'
        ? 'HANDLER_NOT_REGISTERED'
        : inspection.state === 'unavailable'
          ? 'CAPABILITY_UNAVAILABLE'
          : undefined;
    return {
      stepId: step.id,
      intent: step.intent,
      targetAppId: step.targetAppId,
      state: inspection.state,
      failure: failureCode ? createFailure(failureCode, workflowId, step) : undefined,
    };
  }

  private async executeAttempt(
    workflowId: string,
    step: WorkflowStepDefinition,
    context: JsonObject,
    attempt: number,
    deadline: number | undefined,
    signal: AbortSignal | undefined,
  ): Promise<{ result: unknown } | { failure: WorkflowFailure }> {
    const configuredTimeout = step.timeoutMs ?? this.options.defaultStepTimeoutMs ?? DEFAULT_STEP_TIMEOUT_MS;
    const remaining = deadline === undefined ? configuredTimeout : Math.min(configuredTimeout, Math.max(1, deadline - Date.now()));
    let resolution;
    try {
      resolution = await controlledPromise(
        this.options.client.raiseIntent(
          step.intent,
          context,
          step.targetAppId ? { appId: step.targetAppId } : undefined,
        ),
        remaining,
        signal,
      );
    } catch (error) {
      const code = this.controlledCode(error) ?? 'INTENT_RAISE_FAILED';
      return { failure: createFailure(code, workflowId, step, attempt) };
    }
    let result: unknown;
    try {
      result = await controlledPromise(resolution.getResult(), remaining, signal);
    } catch (error) {
      const code = this.controlledCode(error) ?? 'INTENT_EXECUTION_FAILED';
      return { failure: createFailure(code, workflowId, step, attempt) };
    }
    if ((step.resultRequired ?? true) && result === undefined) {
      return { failure: createFailure('HANDLER_NO_RESULT', workflowId, step, attempt) };
    }
    if (step.validateResult) {
      let valid = false;
      try {
        valid = step.validateResult(result);
      } catch {
        valid = false;
      }
      if (!valid) {
        return { failure: createFailure('RESULT_INVALID', workflowId, step, attempt) };
      }
    }
    return { result };
  }

  private recordFailure(
    step: WorkflowStepDefinition,
    context: JsonObject,
    attempts: number,
    failure: WorkflowFailure,
    completedSteps: WorkflowStepResult[],
    failures: WorkflowFailure[],
    emit: (event: Omit<WorkflowEvent, 'runId' | 'workflowId' | 'sequence' | 'timestamp'>) => void,
  ): boolean {
    failures.push(failure);
    completedSteps.push({
      stepId: step.id,
      intent: step.intent,
      status: 'error',
      attempts,
      context,
      failure,
    });
    emit({
      type: 'node.failed',
      stepId: step.id,
      intent: step.intent,
      context,
      attempt: attempts,
      failure,
    });
    return step.continueOnError ?? false;
  }

  private failedTranscript(
    workflow: WorkflowDefinition,
    runId: string,
    input: JsonObject,
    startedAt: string,
    completedSteps: WorkflowStepResult[],
    failures: WorkflowFailure[],
    emit: (event: Omit<WorkflowEvent, 'runId' | 'workflowId' | 'sequence' | 'timestamp'>) => void,
  ): WorkflowTranscript {
    const failure = failures[failures.length - 1] ?? createFailure('INTERNAL_ERROR', workflow.workflowId);
    const summary = `Workflow failed at ${failure.stepId ?? workflow.workflowId}: ${failure.message}`;
    emit({ type: 'workflow.failed', failure, summary });
    return this.transcript({
      runId,
      workflowId: workflow.workflowId,
      title: workflow.title,
      input,
      startedAt,
      status: 'failed',
      completedSteps,
      failures,
      summary,
    });
  }

  private cancelledTranscript(
    workflow: WorkflowDefinition,
    runId: string,
    input: JsonObject,
    startedAt: string,
    completedSteps: WorkflowStepResult[],
    emit: (event: Omit<WorkflowEvent, 'runId' | 'workflowId' | 'sequence' | 'timestamp'>) => void,
    existingFailures: WorkflowFailure[] = [],
  ): WorkflowTranscript {
    const failures = existingFailures.some((failure) => failure.code === 'CANCELLED')
      ? existingFailures
      : [...existingFailures, createFailure('CANCELLED', workflow.workflowId)];
    const failure = failures[failures.length - 1];
    emit({ type: 'workflow.cancelled', failure, summary: failure.message });
    return this.transcript({
      runId,
      workflowId: workflow.workflowId,
      title: workflow.title,
      input,
      startedAt,
      status: 'cancelled',
      completedSteps,
      failures,
      summary: failure.message,
    });
  }

  private transcript(
    value: Omit<WorkflowTranscript, 'completedAt'>,
  ): WorkflowTranscript {
    return {
      ...value,
      completedAt: this.now().toISOString(),
    };
  }

  private validInput(workflow: WorkflowDefinition, input: JsonObject): boolean {
    if (!workflow.validateInput) {
      return true;
    }
    try {
      return workflow.validateInput(input);
    } catch {
      return false;
    }
  }

  private controlledCode(error: unknown): 'CANCELLED' | 'RESULT_TIMEOUT' | undefined {
    return error instanceof ControlledExecutionError ? error.code : undefined;
  }

  private notifyObservers(event: WorkflowEvent, runObserver?: WorkflowEventListener): void {
    const observers = runObserver ? [...this.listeners, runObserver] : [...this.listeners];
    for (const observer of observers) {
      try {
        observer(event);
      } catch {
        this.diagnostic({
          code: 'EVENT_OBSERVER_FAILED',
          message: 'A workflow event observer threw an exception.',
          workflowId: event.workflowId,
          stepId: event.stepId,
        });
      }
    }
  }

  private diagnostic(diagnostic: WorkflowDiagnostic): void {
    try {
      this.options.onDiagnostic?.(diagnostic);
    } catch {
      // Diagnostics must never affect workflow execution.
    }
  }
}
