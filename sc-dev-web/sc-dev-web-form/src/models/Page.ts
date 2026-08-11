import { v4 } from 'uuid';
import { cloneProperties } from '../shared/utils.js';
import { Component } from './Component.js';
import { FormBase } from './base/FormBase.js';

export class Page extends FormBase {
  sequence: number;
  type: string;
  show: boolean;
  name: string;
  components: Component[];

  constructor(components?: Component[], type?: string, sequence?: number) {
    super();
    if (!this.id) {
      this.id = v4();
    }
    this.type = type || 'form';
    this.name = this.type[0].toUpperCase() + this.type.replace('-', ' ').slice(1);
    if (sequence) {
      this.name = this.name + sequence;
    }
    if (!components || !Array.isArray(components)) return this;
    this.components = components.map(component => Component.from(component));
  }

  static from(target: Page, removeRedundantProps?: boolean) {
    const obj = { ...target };
    if (!obj) return new Page();

    const components = (obj.components || []).slice();
    Reflect.deleteProperty(obj, 'components');

    const newInstance = new Page(components);
    cloneProperties(newInstance, obj, removeRedundantProps);

    return newInstance;
  }

  static duplicate(page: Page, removeRedundantProps?: boolean) {
    const newPage = Page.from(page, removeRedundantProps);

    newPage.id = v4();
    newPage.components = newPage.components.map(component =>
      Component.duplicate(component, removeRedundantProps)
    );

    return newPage;
  }

  addComponent(type: string, rowId?: string, properties?: object) {
    const component = new Component(type, null, rowId, undefined, properties);
    this.components = (this.components || []).concat(component);

    return this;
  }

  insertComponent(id: string, component: Component, position?: string, components?: Component[]) {
    const _components = components || this.components;
    
    if (!_components) return;

    const index = _components.findIndex(c => c.id === id);

    if (index === -1) {
      _components.forEach((c, index) => {
        if (c.components) {
          this.insertComponent(id, component, position, c.components);
        }
      });
    } else if (index > -1) {
      if (position === 'before') {
        _components.splice(index, 0, component);
      } else {
        _components.splice(index + 1, 0, component);
      }
    }
    
  }

  removeComponent(id: string, components?: Component[]) {
    const _components = components || this.components;

    if (!_components) return;

    _components.forEach((c, index) => {
      if (Array.isArray(c)) {
        this.removeComponent(id, c);
      } else {
        if (c.id === id) {
          _components.splice(index, 1);
        } else if (c.components) {
          this.removeComponent(id, c.components);
        }
      }
    });
    this.components = [..._components];
    return this;
  }

  getComponent(id: string, data?: Component[]): Component | undefined {
    const _components = data || this.components;
    if (!_components) return;
    for (const c of _components) {
      if (Array.isArray(c)) {
        const found = this.getComponent(id, c);
        if (found) return found;
      } else if (c.id === id) {
        return c;
      } else if (c.components) {
        const found = this.getComponent(id, c.components);
        if (found) return found;
      }
    }
    return undefined;
  }
  
  getAllComponents(parentObj?: any, res?: any) {
    let obj = parentObj;
    if (!parentObj) { 
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      obj = this;
    }
    const components: any = res || [];
    if (obj.components) {
      obj.components.forEach((c: any) => {
        if (Array.isArray(c)) {
          c.forEach(d => this.getAllComponents(d, components));
        } else if (c.components && Array.isArray(c.components)) {
          this.getAllComponents(c, components);
        } else {
          components.push(c);
        }
      });
    } else {
      components.push(obj);
    }
    return components;
  }

  getAllComponentsWithParents(parentObj?: any, res?: any) {
    let obj = parentObj;
    if (!parentObj) { 
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      obj = this;
    }
    const components: any = res || [];
    if (obj.components) {
      obj.components.forEach((c: any) => {
        if (Array.isArray(c)) {
          c.forEach(d => this.getAllComponents(d, components));
        } else if (c.components && Array.isArray(c.components)) {
          components.push(c);
          this.getAllComponents(c, components);
        } else {
          components.push(c);
        }
      });
    } else {
      components.push(obj);
    }
    return components;
  }

  getAllRowsComponents(components?: Component[]) {
    const _components = components || this.components;
    const rows: {[key: string]: Component[]} = {};
    if (_components && Array.isArray(_components)) {
      _components.forEach((c: Component) => {
        const row = c?.layout?.row;
        if (row) {
          if (rows[row]) {
            rows[row].push(c);
          } else {
            rows[row] = [c];
          }
        }
      });
    }
    return rows;
  }

  updateComponent(id: string, component: Component, components?: any) {
    const _components = components || this.components;
    _components.forEach((s: Component, index: number) => {
      if (s.id === id) {
        _components[index] = component;
      } else if (s.components && Array.isArray(s.components)) {
        this.updateComponent(id, component, s.components);
      }
    });
    return this;
  }

  // @ts-ignore
  getComponentParents(id: string, components?: Component[], path?: []) {
    const _components = components || this.components;
    const _path = path || [];
    for (let i = 0; i < _components.length; i++) {
      if (_components[i].id === id) {
        // @ts-ignore
        _path.concat(_components[i]);
        return _path;
      }
      if (Array.isArray(_components[i]?.components)) {
        // @ts-ignore
        const result = this.getComponentParents(id, _components[i].components, _path.concat(_components[i]));
        if (result) {
          return result;
        }
      }
      if (Array.isArray(_components[i])) {
        // @ts-ignore
        const result = this.getComponentParents(id, _components[i], _path);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  updateStatus(show: boolean) {
    this.show = !!show;
  }
}