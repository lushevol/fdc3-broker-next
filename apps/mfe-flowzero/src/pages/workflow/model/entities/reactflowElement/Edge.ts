import type { Expression } from "../../../types";
import { AbstractElement, AbstractElementProps } from "./AbstractElement";

export interface EdgeProps<T> extends AbstractElementProps<T> {
  source: string;
  target: string;
  condition?: Expression;
}

export class Edge<T> extends AbstractElement<T> {
  source: string;
  target: string;
  condition?: Expression;

  constructor(model: EdgeProps<T>) {
    super(model);
    this.source = model.source;
    this.target = model.target;
    this.condition = model.condition;
  }

  getModel() {
    return {
      id: this.id,
      type: this.type,
      source: this.source,
      target: this.target,
      condition: this.condition,
      label: this.label,
      subLabel: this.subLabel,
      properties: this.properties,
    };
  }

  validation() {
    // Validate that source and target are set
    return !!(this.source && this.target && this.id);
  }
}
