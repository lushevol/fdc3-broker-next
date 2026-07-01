import { WorkflowNodeType } from "../../../types";
import {
  AbstractWorkflowNode,
  AbstractWorkflowNodeProps,
  HandleMetaProps,
} from "./AbstractWorkflowNode";

export type UserTaskProps<T> = AbstractWorkflowNodeProps<T>;

export class UserTask<T> extends AbstractWorkflowNode<T> {
  constructor(model: UserTaskProps<T>) {
    super(model);
    this.type = WorkflowNodeType.USER_TASK;
    if (!(this.data.handlesMeta as HandleMetaProps[])?.length) {
      this.data.handlesMeta = [
        { id: `${this.id}_in`, role: "target", label: "In" },
        { id: `${this.id}_out`, role: "source", label: "Out" },
      ];
    }
  }

  getModel() {
    // TODO: implement UserTask specific logic
    return {
      ...super.getModel(),
      type: this.type,
    };
  }

  /**
   * Get BPMN-specific attributes for UserTask
   * Returns camunda:assignee attribute and extensionElements with rejectTo
   * @param moddle BPMNModdle instance
   * @param nodeData Full node data from ReactFlow
   */
  getBpmnAttributes(moddle: any, nodeData: any): Record<string, any> {
    const attributes: Record<string, any> = {};

    // Handle camunda:assignee attribute (UserTask specific)
    const assignee = nodeData?.assignee;
    if (assignee) {
      // assignee may be a UserResponse object or a plain bankId string
      attributes["camunda:assignee"] = assignee;
    }

    // Handle camunda:candidateUsers (array of bankIds set by the form, or
    // a raw comma-separated string as loaded directly from the XML without editing)
    const candidateUsers = nodeData?.candidateUsers;
    if (Array.isArray(candidateUsers) && candidateUsers.length > 0) {
      attributes["camunda:candidateUsers"] = candidateUsers
        .filter(Boolean)
        .join(",");
    } else if (
      typeof candidateUsers === "string" &&
      candidateUsers.trim().length > 0
    ) {
      attributes["camunda:candidateUsers"] = candidateUsers.trim();
    }

    // Handle camunda:candidateGroups (CandidateGroupVo name string)
    const candidateGroup = nodeData?.candidateGroup;
    if (candidateGroup) {
      attributes["camunda:candidateGroups"] = candidateGroup;
    }

    const customProperties = [
      { name: "rejectTo", value: String(nodeData?.rejectTo || "") },
      {
        name: "terminateButton",
        value: nodeData?.terminateButton || "",
      },
      {
        name: "rejectButton",
        value: nodeData?.rejectButton || "",
      },
      {
        name: "approveButton",
        value: nodeData?.approveButton || "",
      },
    ];

    const propertyElements = customProperties.map((prop) =>
      moddle.create("camunda:Property", prop)
    );

    const camundaProperties = moddle.create("camunda:Properties", {
      values: propertyElements,
    });

    const extensionElements = moddle.create("bpmn:ExtensionElements", {
      values: [camundaProperties],
    });

    attributes.extensionElements = extensionElements;

    return attributes;
  }

  validation() {
    // TODO: implement UserTask specific validation
    return super.validation();
  }
}
