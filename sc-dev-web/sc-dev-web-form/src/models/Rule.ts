import { v4 } from 'uuid';
import { cloneProperties } from '../shared/utils.js';

export class Rule {
  id: string = v4();
  type: string;
  name: string;
  dataSource: string;
  parameters: [];
  fields: object;
  targetComponent: string;
  responseAttribute: string;
  disableTriggerInReadonly?: boolean;
  hiddenInRuleTab?: boolean;

  constructor(type?: string, name?: string) {
    if (!type) return this;
    this.type = type;
    if (!name) return this;
    this.name = name;
  }

  static from(target: any) {
    const obj = { ...target };
    if (!obj) return new Rule();

    const newInstance = new Rule(obj.type, obj.name);
    cloneProperties(newInstance, obj);
    return newInstance;
  }

}
