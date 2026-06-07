export interface IWorkflowService {
  getWorkflowById(id: string): Promise<any>;

  getWorkflowByBpmnId(bpmnId: string): Promise<any>;

  createWorkflow(command: object): Promise<any>;

  updateWorkflow(command: object): Promise<any>;

  saveAsDraft(command: object): Promise<any>;

  deployWorkflow(command: object): Promise<any>;

  deleteWorkflow(id: string): Promise<void>;

  exportBpmn(id: string): Promise<string>;

  validateWorkflow(id: string): Promise<any>;

  validateBpmnXml(bpmnXml: string): Promise<any>;
}
