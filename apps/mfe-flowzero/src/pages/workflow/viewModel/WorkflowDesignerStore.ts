import { message } from "antd";
import { action, computed, makeAutoObservable, observable } from "mobx";
import type { FormFieldRef, FormResource } from "src/api/form/Form";
import {
  beforePublishCheck,
  getBpmnDetail,
  getFormDetail,
  publish,
  saveDraft,
} from "src/api/index";
import { BpmnService } from "src/pages/workflow/services/BpmnService";
import { navigationStore } from "src/stores/NavigationStore";
import { getUser } from "src/util/authenticator";

import type { AbstractWorkflowNode } from "../model/entities/reactflowElement/AbstractWorkflowNode";
import { EndEvent } from "../model/entities/reactflowElement/EndEvent";
import { ExclusiveGateway } from "../model/entities/reactflowElement/ExclusiveGateway";
import { StartEvent } from "../model/entities/reactflowElement/StartEvent";
import { UserTask } from "../model/entities/reactflowElement/UserTask";
import { ValidationService } from "../services/ValidationService";
import { BPMNParser, WorkflowNodeType } from "../types";
import type { IWorkflowMap } from "./IWorkflowMap";

export interface WorkflowEntity1 {
  workflowName: string;
  description: string;
  owner: string | null;
  country: string | null;
  icon: string;
  businessArea: string;
  uniqueProcessId?: string;
  displayVersion?: string | number;
}

export interface WorkflowEntity {
  displayVersion: number;
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
  name: string;
  countryCodes: string | Array<string>;
  ownerIds: string | Array<string>;
  description: string;
  status: string;
  content: string;
  succeedFromId: string;
  businessArea: string;
  uniqueProcessId: string;
  uniqueVersionId: string | null;
  workflowVersion: number;
  icon: string;
  forms: Array<relForm>;
}

export interface IWorkflowVariable {
  id: string;
  name: string;
  node: string;
  type: string;
}
export interface WorkflowRel {
  formId: string;
  // workflowVariables: IWorkflowVariable;
  workflowVariables: string;
}
export interface relForm extends FormResource {
  fields: string[];
  workflowVariables: WorkflowRel[];
}
export class WorkflowDesignerStore {
  workflowMap: IWorkflowMap;
  parser: BPMNParser;
  validationService: ValidationService;
  selectedNodeId: string | null = null;
  deployedVersionId: string = "";
  bpmnId: string = "";
  formFields: FormFieldRef[] = []; //all fields bind to forms
  selectedFormFields: FormFieldRef[] = []; // workflow variable setup
  _formFieldIdsMap: Record<string, string[]> = {};
  _fieldsInitialized: boolean = false;
  workflowEntity: Partial<WorkflowEntity> = {
    name: "",
    description: "",
    ownerIds: "",
    countryCodes: "",
    icon: "",
    businessArea: "",
    uniqueProcessId: "",
    version: 0,
    forms: [],
  };

  constructor() {
    // Initialize with empty workflow map
    this.workflowMap = {
      nodes: [],
      edges: [],
    };

    if (this.workflowMap.nodes.length === 0) {
      this.addReactFlowNode({
        id: "start-event-1" + Date.now().toString(),
        type: WorkflowNodeType.START_EVENT,
        position: { x: 100, y: 100 },
        data: {
          label: "Start with Form",
          subLabel: "Start Event",
          icon: "",
          properties: {},
        },
      });
    }
    // Initialize parser - TODO: provide actual implementation
    this.parser = {
      fromXML: async (xml: string) => {
        // console.log(xml);
        const service = new BpmnService();
        const { nodes, edges } = await service.parseXMLToReactFlow(xml);
        this.workflowMap.edges = edges as any;
        this.workflowMap.nodes = nodes as any;
      },

      toXML: async () => {
        let service = new BpmnService();
        const xml = await service.toXML(
          this.workflowMap.nodes as any,
          this.workflowMap.edges as any,
          this
        );
        return xml;
      },
    };

    this.validationService = new ValidationService();

    // Make this class observable
    makeAutoObservable(this, {
      workflowMap: observable,
      parser: observable,
      validationService: observable,
      selectedNodeId: observable,
      deployedVersionId: observable,
      bpmnId: observable,
      workflowEntity: observable,
      setBpmnId: action,
      setWorkflowEntity: action,
      addNode: action,
      addReactFlowNode: action,
      updateNode: action,
      deleteNode: action,
      selectNode: action,
      save: action,
      publishWorkflow: action,
      export: action,
      validation: action,
      loadFormFields: action,
      saveSelectedFormFields: action,
    });
  }

  /**
   * Get currently selected node
   */
  selectedNode(): AbstractWorkflowNode<any> | undefined {
    return this.workflowMap.nodes.find(
      (node) => node.id === this.selectedNodeId
    );
  }

  /**
   * Add a new ReactFlow node to the workflow
   */
  addReactFlowNode(node: any) {
    this.workflowMap.nodes.push(node);
    return node;
  }

  /**
   * Add a new node to the workflow
   */
  addNode<T>(type: WorkflowNodeType, props: any) {
    let node;
    switch (type) {
      case WorkflowNodeType.START_EVENT:
        node = new StartEvent<T>(props);
        break;
      case WorkflowNodeType.END_EVENT:
        node = new EndEvent<T>(props);
        break;
      case WorkflowNodeType.USER_TASK:
        node = new UserTask<T>(props);
        break;
      case WorkflowNodeType.EXCLUSIVE_GATEWAY:
        node = new ExclusiveGateway<T>(props);
        break;
      default:
        throw new Error(`Unknown node type: ${type}`);
    }
    this.workflowMap.nodes.push(node);
    return node;
  }

  /**
   * Update an existing node
   */
  updateNode(nodeId: string, updates: Partial<any>) {
    const node = this.workflowMap.nodes.find((n) => n.id === nodeId);
    if (node) {
      Object.assign(node, updates);
    }
  }

  /**
   * Delete a node from the workflow
   */
  deleteNode(nodeId: string) {
    this.workflowMap.nodes = this.workflowMap.nodes.filter(
      (n) => n.id !== nodeId
    );
    // Also remove associated edges
    this.workflowMap.edges = this.workflowMap.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    );
    if (this.selectedNodeId === nodeId) {
      this.selectedNodeId = null;
    }
  }

  /**
   * Select a node
   */
  selectNode(nodeId: string | null) {
    this.selectedNodeId = nodeId;
  }

  /**
   * Get node by ID
   */
  getNodeById(nodeId: string) {
    return this.workflowMap.nodes.find((n) => n.id === nodeId);
  }

  /**
   * Set BPMN ID for the workflow
   */
  setBpmnId(id: string) {
    this.bpmnId = id;
  }

  setWorkflowEntity(values: Partial<WorkflowEntity>) {
    this.workflowEntity = { ...this.workflowEntity, ...values };
    // Reset so selectedFormFields can be re-initialized from new workflowVariables
    if (values.forms !== undefined) {
      this._fieldsInitialized = false;
    }
  }

  formsToRels(forms: Array<relForm>): WorkflowRel[] {
    const selectedSet = new Set(this.selectedFormFields.map((f) => f.id));
    return forms.map((form) => {
      const formFieldIds = new Set(this._formFieldIdsMap[form.id] ?? []);
      const fields = this.formFields.filter(
        (f) => formFieldIds.has(f.id) && selectedSet.has(f.id)
      );
      return {
        formId: form.id,
        workflowVariables: JSON.stringify(
          fields.map((field) => ({
            id: field.id,
            name: field.indexedTerm,
            type: field.dataType,
            label: field.label,
            // TODO temporarily set node to "start", because only start node can bind to form. Need to support multiple nodes in the future
            node: "start",
          }))
        ),
      };
    });
  }

  async loadFormFields() {
    const forms = this.workflowEntity.forms ?? [];
    const fields: FormFieldRef[] = [];
    const idMap: Record<string, string[]> = {};
    for (const form of forms) {
      const detail = await getFormDetail(form.id);
      if (detail.fields) {
        fields.push(...detail.fields);
        idMap[form.id] = detail.fields.map((f) => f.id);
      } else {
        idMap[form.id] = [];
      }
    }
    this._formFieldIdsMap = idMap;
    this.formFields = fields;
    // Only initialize selectedFormFields from workflowVariables on first load;
    // subsequent calls keep the user's in-memory selection intact.
    if (!this._fieldsInitialized) {
      const selectedIds = new Set(
        forms.flatMap((f) => {
          try {
            const vars =
              typeof f.workflowVariables === "string"
                ? JSON.parse(f.workflowVariables)
                : f.workflowVariables;
            return (vars ?? []).map((v: IWorkflowVariable) => v.id as string);
          } catch {
            return [];
          }
        })
      );
      this.selectedFormFields = fields.filter((f) => selectedIds.has(f.id));
      this._fieldsInitialized = true;
    }
  }

  saveSelectedFormFields(fields: FormFieldRef[]) {
    this.selectedFormFields = fields;
  }

  async save() {
    if (!this.bpmnId) {
      message.error("Workflow ID is required.");
      return;
    }
    const xml = await this.parser.toXML("");
    const { id } = getUser();
    let params = {
      name: this.workflowEntity.name,
      id: this.bpmnId,
      ownerIds: Array.isArray(this.workflowEntity.ownerIds)
        ? this.workflowEntity.ownerIds.join(",")
        : this.workflowEntity.ownerIds,
      countryCodes: Array.isArray(this.workflowEntity.countryCodes)
        ? this.workflowEntity.countryCodes.join(",")
        : this.workflowEntity.countryCodes,
      description: this.workflowEntity.description,
      businessArea: this.workflowEntity.businessArea,
      icon: this.workflowEntity.icon,
      content: xml,
      rels: this.formsToRels(this.workflowEntity.forms ?? []),
    };
    console.log(this.selectedFormFields);
    saveDraft(params)
      .then(
        (res: { code: number; id: string; msg: string; status: string }) => {
          if (res?.id) this.bpmnId = res.id;
          message.success(`Save Successfully`);
        }
      )
      .catch(() => {
        message.error(`Save Failed`);
      });
  }

  async beforePublishCheck() {
    if (!this.bpmnId) {
      message.error("Please save the workflow before publishing.");
      return false;
    }
    try {
      const res = await beforePublishCheck(this.bpmnId);
      if (res.runningInstancesNum) return true;
      return false;
    } catch (error) {
      message.error("Pre-publish check failed.");
      return false;
    }
  }

  async publishWorkflow(stopType: "force" | "graceful" = "graceful") {
    if (!this.bpmnId) {
      message.error("Please save the workflow before publishing.");
      return;
    }
    let params = { id: this.bpmnId, stopType };
    try {
      const res: any = await publish(params);

      this.setBpmnId(res);
      message.success(`Publish Successfully`);
      if (this.workflowEntity.name) {
        navigationStore.triggerRefresh(this.workflowEntity.name);
      }
      const workflowDetail = await getBpmnDetail(res);
      if (workflowDetail) {
        this.setWorkflowEntity({
          displayVersion: workflowDetail.displayVersion,
        });
      }
    } catch (error) {
      message.error(`Publish Failed`);
    }
  }

  export() {
    // TODO: implement export logic
    console.log("Exporting workflow...", this.workflowMap);
    return this.workflowMap;
  }

  validation(): boolean {
    // TODO: implement validation logic
    return this.validationService.validate(this.workflowMap);
  }
}
