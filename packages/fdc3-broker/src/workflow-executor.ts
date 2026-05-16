import { applyWorkflowBindings } from './workflow-bindings';
import { renderWorkflowContextTemplate } from './workflow-template';
import type {
  WorkflowDefinition,
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

  findWorkflowsByInput(): WorkflowDefinition[] {
    return Array.from(this.workflowsById.values());
  }

  async execute(workflowId: string, input: WorkflowJsonObject = {}): Promise<WorkflowTranscript> {
    const workflow = this.workflowsById.get(workflowId);
    if (!workflow) {
      return {
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
    }

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
        return this.failedTranscript(workflow, input, completedSteps, failedStep);
      }

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
      } catch (error) {
        const failedStep: WorkflowStepResult = {
          stepId: step.id,
          intent: step.intent,
          status: 'error',
          context,
          error: errorMessage(error),
        };
        if (!step.continueOnError) {
          return this.failedTranscript(workflow, input, completedSteps, failedStep);
        }
        completedSteps.push(failedStep);
      }
    }

    return {
      status: 'ok',
      workflowId: workflow.workflowId,
      title: workflow.title,
      input,
      completedSteps,
      summary: `Completed ${completedSteps.length} of ${workflow.steps.length} workflow steps.`,
    };
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
