import { html, css, LitElement } from 'lit';
import { consume } from '@lit/context';
import { property, state } from 'lit/decorators.js';
import './DragAndDrop.js';
import './ComponentEditor.js';
import { Component } from '../../models/Component.js';
import { FormDefinition } from '../../models/FormDefinition.js';
import { reorderArrayBasedOnIndex } from '../utils/DragDropZone.js';
import { ComponentMixin } from '../utils/component-mixin.js';
import { formContext } from '../contexts/form-context.js';
// @ts-ignore
import GridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';

export class FormGenerator extends ComponentMixin(LitElement) {
  @property({ type: Array }) components = [];

  // @ts-ignore
  @consume({ context: formContext, subscribe: true })
  @state() 
    formDefinition: FormDefinition;

  @property({ type: Function }) updateForm = (components: Component[]) => {};

  @property({ type: Number }) key: number;

  static styles = css`
    .row {
      margin: 0.937rem 0;
      font-weight: 600;
      width: 100%;
    }
    .col {
      margin: 0.937rem 0;
      width: 100%;
      display: flex;
    }
    .sep {
      width: 0.625rem;
    }
    .adjustwidth {
      width: -webkit-fill-available;
      margin: auto;
    }
    ${GridStyle}
  `;

  findId(array: any[], id: string) {
    const result: any = { foundInParent: false };
    array.forEach(obj => {
      if (obj.id === id) {
        result.foundInParent = true;
        if (obj.child) {
          result.parentId = obj.id;
          result.parentType = obj.type;
        }
      } else if (obj.child) {
        const childIndex = obj.child.findIndex((childObj: any) => childObj.id === id);
        if (childIndex !== -1) {
          result.foundInParent = true;
          result.parentId = obj.id;
          result.parentType = obj.type;
        }
      }
    });
    return result;
  }

  updateObjectById(array: any[], id: string, updates: any) {
    array.forEach(obj => {
      if (obj.id === id) {
        Object.assign(obj, updates);
      }
      if (obj.child) {
        this.updateObjectById(obj.child, id, updates);
      }
    });
  }

  reorderForm(arrangement: any) {
    if (arrangement?.length <= 1) return;
    let tempArry: any[] = [...this.components];
    tempArry = reorderArrayBasedOnIndex(tempArry, arrangement);
    this.updateForm(tempArry);
  }

  render() {
    return this.generateComponent(this.components);
  }
}

if (!window.customElements.get('form-generator')) {
  window.customElements.define('form-generator', FormGenerator);
}
