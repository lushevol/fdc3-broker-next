import workflows from '../../../fdc3/declarations/workflows.json';

type WorkflowDeclaration = {
  workflowId?: string;
  title?: string;
  description?: string;
};

export function getFdc3WorkflowCatalogDescription(): string {
  const declaredWorkflows = workflows as WorkflowDeclaration[];
  if (declaredWorkflows.length === 0) {
    return 'No declaration-backed FDC3 workflows are currently available.';
  }

  return declaredWorkflows
    .map((workflow) => `${workflow.workflowId}: ${workflow.description ?? workflow.title ?? ''}`)
    .join(' ');
}
