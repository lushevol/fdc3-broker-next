/**
 * WorkflowStatus - Domain Enumeration
 * Represents the lifecycle status of a workflow
 */
export enum WorkflowStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  PUBLISHED = "published",
  DISABLED = "disabled",
  ARCHIVED = "archived",
}

export const isValidWorkflowStatus = (
  status: string
): status is WorkflowStatus => {
  return Object.values(WorkflowStatus).includes(status as WorkflowStatus);
};
