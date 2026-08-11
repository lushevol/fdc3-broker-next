import { LitElement, html, css } from 'lit';

import './Rearrange';

export class DragAndDrop extends LitElement {
  static properties = {
    childList: { type: Array, Reflect: true },
    reorder: { type: Function },
    formDefinition: { type: Array },
  };

  constructor() {
    super();
    this.childList = [];
    this.formDefinition = [];
  }

  static styles = css`
    .editicon {
      position: absolute;
      right: 0;
      text-align: end;
      margin: auto;
      cursor: pointer;
    }
    .editiconrow {
      position: absolute;
      right: 0;
      text-align: end;
      margin-left: 0.312rem;
      margin-top: 0;
      cursor: pointer;
    }
    .box-body .editiconrow {
      margin-top: -1.875rem;
      margin-right: 1.25rem;
    }
    .row {
      margin: 0.937rem 0;
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
  `;

  findId(array, id) {
    const result = { foundInParent: false };
    array.forEach(obj => {
      if (obj.id === id) {
        result.foundInParent = true;
        if (obj.child) {
          result.parentId = obj.id;
          result.parentType = obj.type;
          result.parentChild = obj.child;
        }
      } else if (obj.child) {
        const childIndex = obj.child.findIndex(childObj => childObj.id === id);
        if (childIndex !== -1) {
          result.foundInParent = true;
          result.parentId = obj.id;
          result.parentType = obj.type;
          result.parentChild = obj.child;
        }
      }
    });
    return result;
  }

  updateObjectById(array, id, updates) {
    array.forEach(obj => {
      if (obj.id === id) {
        Object.assign(obj, updates);
      }
      if (obj.child) {
        this.updateObjectById(obj.child, id, updates);
      }
    });
  }

  render() {
    return html`
      <sortable-list .childList=${this.childList} .reorderForm=${this.reorder}>
        ${this.childList?.map(
          (item, index) => html` <sortable-item> ${item}</sortable-item> `
        )}
      </sortable-list>
    `;
  }
}

if (!window.customElements.get('drag-drop')) {
  window.customElements.define('drag-drop', DragAndDrop);
}
