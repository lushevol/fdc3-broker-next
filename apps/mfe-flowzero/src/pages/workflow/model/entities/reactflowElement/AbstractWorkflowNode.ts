import { AbstractElement, AbstractElementProps } from "./AbstractElement";

export interface HandleMetaProps {
  id: string;
  role: "source" | "target";
  label?: string;
  style?: any;
  isBranch?: boolean;
}

export interface AbstractWorkflowNodeProps<T> extends AbstractElementProps<T> {
  id: string;
  source: string;
  target: string;
  handlesMeta?: Array<HandleMetaProps>;
}

export class AbstractWorkflowNode<T> extends AbstractElement<T> {
  id: string;
  source: string;
  target: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;

  constructor(model: AbstractWorkflowNodeProps<T>) {
    super(model);
    this.id = model.id;
    this.source = model.source;
    this.target = model.target;

    this.position = { x: model.x, y: model.y };
    this.data = {
      label: model.label,
      subLabel: model.subLabel,
      icon: model.icon,
      properties: model.properties,
      handlesMeta: model.handlesMeta,
    };
  }

  getModel() {
    return {
      id: this.id,
      type: this.type,
      position: this.position,
      data: this.data,
      source: this.source,
      target: this.target,
    };
  }

  validation() {
    // Basic validation: ensure required fields are present
    return !!(this.id && this.type && this.label);
  }

  getBpmnAttributes(moddle: any, nodeData: any): Record<string, any> {
    return {};
  }

  // Accessor for handles metadata
  getHandlesMeta(nodeData?: any) {
    const d = nodeData || this.data;
    return (d as any).handlesMeta || [];
  }
}
