import { WorkflowNodeType } from "../../../types";
import {
  AbstractWorkflowNode,
  AbstractWorkflowNodeProps,
  HandleMetaProps,
} from "./AbstractWorkflowNode";

export type StartEventProps<T> = AbstractWorkflowNodeProps<T>;

export class StartEvent<T> extends AbstractWorkflowNode<T> {
  constructor(model: StartEventProps<T>) {
    super(model);
    this.type = WorkflowNodeType.START_EVENT;
    if (!(this.data.handlesMeta as HandleMetaProps[])?.length) {
      this.data.handlesMeta = [
        { id: `${this.id}_out`, role: "source", label: "Out" },
      ];
    }
  }

  getModel() {
    // TODO: implement StartEvent specific logic
    return {
      ...super.getModel(),
      type: this.type,
    };
  }

  validation() {
    // TODO: implement StartEvent specific validation
    return super.validation();
  }
}
