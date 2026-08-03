import { v4 } from 'uuid';
import { cloneProperties } from '../shared/utils.js';
import { ComponentTypes } from '../shared/componentTypes.js';
import { FormBase } from './base/FormBase.js';
import * as ComponentTemplates from './Components/index.js';
import { WebkitComponentsMapping } from '../shared/webkitComponentsMapping.js';
import { generateUniqueId } from '../shared/generateUniqueId.js';

type LAYOUT_OPTIONS = {
  row: string;
  column?: string
}

export class Component extends FormBase {
  template: any;
  type: string;
  customized: boolean;
  tabId: string;
  rules: string[];
  stepId: string;
  alignment?: string;
  undeletable?: boolean;
  repeatGroupIndex: number;
  value: any;
  referrers: string[];
  populators: string[];
  layout: LAYOUT_OPTIONS;

  constructor(type?: string, template?: any, rowId?: string, tabId?: string, properties?: any, stepId?: string) {
    super();
    if (!type) return this;
    this.type = type;
    // @ts-ignore
    const CT = ComponentTemplates[`${ComponentTypes[type]?.replaceAll(' ', '')}Template`];
    if (CT) {
      this.template = template ? CT.from(template) : new CT();
      if (this.template.initComponents) {
        // This is used to init the grid columns components
        this.components = this.template.initComponents();
      }
    } else { // Create custom component template
      const defaultProperties: any = {};
      if (properties) {
        Object.keys(properties).forEach((k: any) => {
          if (properties[k].defaultValue !== undefined) {
            defaultProperties[k] = JSON.parse(JSON.stringify(properties[k].defaultValue));
          }
        });
      }
      this.template = template ? ComponentTemplates.CustomTemplate.from(template) : ComponentTemplates.CustomTemplate.from(defaultProperties);
      this.customized = true;
    }
    if (rowId) {
      this.layout.row = rowId;
    }
    if (tabId) {
      this.tabId = tabId;
    }
    if (stepId) {
      this.stepId = stepId;
    }
    if (!this.id) {
      this.id = (this.template?.label || this.type).replaceAll(' ', '') + generateUniqueId();
    }
  }

  static from(target: Component, removeRedundantProps?: boolean) {
    let obj = { ...target };
    if (!obj) return new Component();

    const { template } = obj;
    Reflect.deleteProperty(obj, 'template');
    const newInstance = new Component(obj.type, template);
    if (obj.components) {
      obj = Component.createNewInstance(obj);
    }
    cloneProperties(newInstance, obj, removeRedundantProps);
    return newInstance;
  }

  static createNewInstance(obj: any) {
    const { components } = obj;
    if (components) {
      obj.components = components.map((c: any) => {
        let component = c;
        if (component.components) {
          component = Component.from(component);
          return Component.createNewInstance(component);
        } else {
          if (component.template?.constructor === Object) {
            return Component.from(component);
          } else {
            return component;
          }
        }
      });
    }
    return obj;
  }

  static duplicate(component: Component, removeRedundantProps?: boolean) {
    const newComponent = Component.from(component, removeRedundantProps);
    newComponent.id = component.template?.label;
    const { type } = newComponent;
    let { template } = newComponent;
    // @ts-ignore
    const CT = ComponentTemplates[`${ComponentTypes[type].replaceAll(' ', '')}Template`];
    template = CT.duplicate(template);
    return newComponent;
  }

  addComponent(type: string, tabId?: string, properties?: any, stepId?: string) {
    const newComponent = new Component(type, undefined, undefined, tabId, properties, stepId);
    this.components = (this.components || []).concat(newComponent);
    return {
      newComponent,
      self: this,
    };
  }

  updateId(id: string) {
    this.id = id;
  }

  updateAlignment(alignment: string) {
    this.alignment = alignment === 'default' ? '' : alignment;
  }

  updateTemplate(key: string, value: any) {
    this.template[key] = value;
  }

  updateComponents(components: Component[]) {
    this.components = components;
  }

  updateReferrers(id: string) {
    if (this.referrers && this.referrers.includes(id)) return;
    if (this.referrers) {
      this.referrers.push(id);
    } else {
      this.referrers = [id];
    }
  }

  updatePopulators(id: string) {
    if (this.populators && this.populators.includes(id)) return;
    if (this.populators) {
      this.populators.push(id);
    } else {
      this.populators = [id];
    }
  }

  updateRules(id: string) {
    if (this.rules && this.rules.includes(id)) return;
    if (this.rules) {
      this.rules.push(id);
    } else {
      this.rules = [id];
    }
  }

  isContainer() {
    const containers = ['accordion', 'box', 'tabs', 'stepper', 'repeater', 'dynamic-display', 'grid-1-column', 'grid-2-columns', 'grid-3-columns', 'carousel', 'modal'];
    Object.keys(WebkitComponentsMapping).forEach((c: string) => {
      if (WebkitComponentsMapping[c]?.type === 'containers') {
        containers.push(c);
      }
    });
    return containers.includes(this.type);
  }

  createNewRow() {
    this.layout.row = v4();
  }

}
