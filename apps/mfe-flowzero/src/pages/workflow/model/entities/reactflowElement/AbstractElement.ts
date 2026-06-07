import type { BPMNParser, WorkflowNodeType } from "../../../types";

export interface AbstractElementProps<T> {
  id: string;
  label: string;
  subLabel: string;
  type: WorkflowNodeType;
  x: number;
  y: number;
  icon: string;
  bpmnParser?: BPMNParser;
  properties: T;
}

export abstract class AbstractElement<T> {
  id: string;
  label: string;
  subLabel: string;
  type: WorkflowNodeType;
  x: number;
  y: number;
  icon: string;
  bpmnParser?: BPMNParser;
  properties: T;

  constructor(model: AbstractElementProps<T>) {
    this.id = model.id;
    this.label = model.label;
    this.subLabel = model.subLabel;
    this.type = model.type;
    this.x = model.x;
    this.y = model.y;
    this.icon = model.icon;
    this.bpmnParser = model.bpmnParser;
    this.properties = model.properties;
  }

  abstract getModel(): any;
  abstract validation(): boolean;
}
