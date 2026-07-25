import { applyWorkflowBindings } from './workflow-bindings';
import { renderWorkflowContextTemplate } from './workflow-template';
import type {
  WorkflowDefinition,
  WorkflowEvent,
  WorkflowEventListener,
  WorkflowJsonObject,
  WorkflowStepResult,
  WorkflowTranscript,
} from './workflow-types';
import { validateWorkflowDefinition } from './workflow-validator';

type IntentResolutionLike = {
  getResult(): Promise<unknown>;
};

export type RaiseWorkflowIntent = (
  intent: string,
  context: WorkflowJsonObject,
  target?: unknown,
) => Promise<IntentResolutionLike>;

export type WorkflowExecutionOptions = {
  runId?: string;
  emit?: WorkflowEventListener;
};

let nextWorkflowRunId = 1;

function createRunId(workflowId: string): string {
  const runId = `${workflowId}-${Date.now()}-${nextWorkflowRunId}`;
  nextWorkflowRunId += 1;
  return runId;
}

function isRecord(value: unknown): value is WorkflowJsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Workflow step failed';
}

export class WorkflowExecutor {
  private readonly workflowsById: Map<string, WorkflowDefinition>;

  constructor(
    workflows: WorkflowDefinition[],
    private readonly raiseIntent: RaiseWorkflowIntent,
  ) {
    this.workflowsById = new Map();

    for (const workflow of workflows) {
      const validation = validateWorkflowDefinition(workflow);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      this.workflowsById.set(workflow.workflowId, workflow);
    }
  }

  findWorkflow(workflowId: string): WorkflowDefinition | null {
    return this.workflowsById.get(workflowId) ?? null;
  }

  findWorkflowsByInput(_input?: WorkflowJsonObject): WorkflowDefinition[] {
    return Array.from(this.workflowsById.values());
  }

  async execute(
    workflowId: string,
    input: WorkflowJsonObject = {},
    options: WorkflowExecutionOptions = {},
  ): Promise<WorkflowTranscript> {
    const runId = options.runId ?? createRunId(workflowId);
    let sequence = 0;
    const emit = (event: Omit<WorkflowEvent, 'runId' | 'workflowId' | 'sequence' | 'timestamp'>) => {
      sequence += 1;
      options.emit?.({
        ...event,
        runId,
        workflowId,
        sequence,
        timestamp: new Date().toISOString(),
      });
    };
    const workflow = this.workflowsById.get(workflowId);
    if (!workflow) {
      const transcript: WorkflowTranscript = {
        status: 'error',
        workflowId,
        title: workflowId,
        input,
        completedSteps: [],
        failedStep: {
          stepId: '__workflow__',
          intent: '',
          status: 'error',
          context: {},
          error: `Unknown workflow: ${workflowId}`,
        },
        summary: `Unknown workflow: ${workflowId}`,
      };
      emit({ type: 'workflow.failed', error: transcript.summary, summary: transcript.summary });
      return transcript;
    }

    emit({ type: 'workflow.started' });
    const priorResults = new Map<string, unknown>();
    const completedSteps: WorkflowStepResult[] = [];

    for (const step of workflow.steps) {
      let context: WorkflowJsonObject;
      try {
        const baseContext = renderWorkflowContextTemplate(step.contextTemplate, input);
        context = applyWorkflowBindings({
          baseContext,
          priorResults,
          bindings: step.inputBindings,
        });
      } catch (error) {
        const failedStep: WorkflowStepResult = {
          stepId: step.id,
          intent: step.intent,
          status: 'error',
          context: {},
          error: errorMessage(error),
        };
        emit({
          type: 'node.failed',
          stepId: step.id,
          intent: step.intent,
          context: {},
          error: failedStep.error,
        });
        const transcript = this.failedTranscript(workflow, input, completedSteps, failedStep);
        emit({ type: 'workflow.failed', error: failedStep.error, summary: transcript.summary });
        return transcript;
      }

      emit({
        type: 'node.started',
        stepId: step.id,
        intent: step.intent,
        context,
      });
      try {
        const resolution = step.targetAppId
          ? await this.raiseIntent(step.intent, context, { appId: step.targetAppId })
          : await this.raiseIntent(step.intent, context);
        const result = await resolution.getResult();
        const stepResult: WorkflowStepResult = {
          stepId: step.id,
          intent: step.intent,
          status: 'ok',
          context,
          result: isRecord(result) ? { ...result } : result,
        };
        completedSteps.push(stepResult);
        priorResults.set(step.id, result);
        emit({
          type: 'node.completed',
          stepId: step.id,
          intent: step.intent,
          context,
          result: stepResult.result,
        });
      } catch (error) {
        const failedStep: WorkflowStepResult = {
          stepId: step.id,
          intent: step.intent,
          status: 'error',
          context,
          error: errorMessage(error),
        };
        emit({
          type: 'node.failed',
          stepId: step.id,
          intent: step.intent,
          context,
          error: failedStep.error,
        });
        if (!step.continueOnError) {
          const transcript = this.failedTranscript(workflow, input, completedSteps, failedStep);
          emit({ type: 'workflow.failed', error: failedStep.error, summary: transcript.summary });
          return transcript;
        }
        completedSteps.push(failedStep);
      }
    }

    const transcript: WorkflowTranscript = {
      status: 'ok',
      workflowId: workflow.workflowId,
      title: workflow.title,
      input,
      completedSteps,
      summary: `Completed ${completedSteps.length} of ${workflow.steps.length} workflow steps.`,
    };
    emit({ type: 'workflow.completed', summary: transcript.summary });
    return transcript;
  }

  private failedTranscript(
    workflow: WorkflowDefinition,
    input: WorkflowJsonObject,
    completedSteps: WorkflowStepResult[],
    failedStep: WorkflowStepResult,
  ): WorkflowTranscript {
    return {
      status: 'error',
      workflowId: workflow.workflowId,
      title: workflow.title,
      input,
      completedSteps,
      failedStep,
      summary: `Workflow failed at step ${failedStep.stepId}: ${failedStep.error ?? 'Unknown error'}`,
    };
  }
}
