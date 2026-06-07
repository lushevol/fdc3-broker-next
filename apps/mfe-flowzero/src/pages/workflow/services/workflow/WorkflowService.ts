import type { IWorkflowService } from "./IWorkflowService";

export class WorkflowService implements IWorkflowService {
  constructor(private readonly workflowRepository: any) {}

  async getWorkflowById(id: string): Promise<any> {
    throw new Error("Not implemented");
  }

  async getWorkflowByBpmnId(bpmnId: string): Promise<any> {
    throw new Error("Not implemented");
  }

  async createWorkflow(command: any): Promise<any> {
    throw new Error("Not implemented");
  }

  async updateWorkflow(command: any): Promise<any> {
    throw new Error("Not implemented");
  }

  async saveAsDraft(command: any): Promise<any> {
    throw new Error("Not implemented");
  }

  async deployWorkflow(command: any): Promise<any> {
    throw new Error("Not implemented");
  }

  async deleteWorkflow(id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async exportBpmn(id: string): Promise<string> {
    throw new Error("Not implemented");
  }

  async validateWorkflow(id: string): Promise<any> {
    throw new Error("Not implemented");
  }

  async validateBpmnXml(bpmnXml: string): Promise<any> {
    throw new Error("Not implemented");
  }
}
