import { WorkflowNodeType } from "../../../types";
import {
  AbstractWorkflowNode,
  AbstractWorkflowNodeProps,
  HandleMetaProps,
} from "./AbstractWorkflowNode";

export type EndEventProps<T> = AbstractWorkflowNodeProps<T>;

export class EndEvent<T> extends AbstractWorkflowNode<T> {
  constructor(model: EndEventProps<T>) {
    super(model);
    this.type = WorkflowNodeType.END_EVENT;
    // ensure end event has a target handle only
    if (!(this.data.handlesMeta as HandleMetaProps[])?.length) {
      this.data.handlesMeta = [
        { id: `${this.id}_in`, role: "target", label: "In" },
      ];
    }
  }

  getModel() {
    // TODO: implement EndEvent specific logic
    return {
      ...super.getModel(),
      type: this.type,
    };
  }

  validation() {
    // TODO: implement EndEvent specific validation
    return super.validation();
  }
}
