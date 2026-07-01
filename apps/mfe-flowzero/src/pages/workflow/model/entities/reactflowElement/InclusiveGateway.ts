import { WorkflowNodeType } from "../../../types";
import {
  AbstractWorkflowNode,
  AbstractWorkflowNodeProps,
  HandleMetaProps,
} from "./AbstractWorkflowNode";

export type InclusiveGatewayProps<T> = AbstractWorkflowNodeProps<T>;

export class InclusiveGateway<T> extends AbstractWorkflowNode<T> {
  constructor(model: InclusiveGatewayProps<T>) {
    super(model);
    this.type = WorkflowNodeType.INCLUSIVE_GATEWAY;
    if (!(this.data.handlesMeta as HandleMetaProps[])?.length) {
      this.data.handlesMeta = [
        { id: `${this.id}_in`, role: "target", label: "In" },
        { id: `${this.id}_out`, role: "source", label: "Out" },
      ];
    }
  }

  getModel() {
    return {
      ...super.getModel(),
      type: this.type,
    };
  }

  validation() {
    return super.validation();
  }
}

export default InclusiveGateway;
