import { html, css, nothing } from 'lit';
import { provide, consume } from '@lit/context';
import { property, state } from 'lit/decorators.js';
import { drop, renderDragDropZone } from '../utils/DragDropZone.js';
import { FormDefinition } from '../../models/FormDefinition.js';
import ScElement from '../utils/sc-element.js';
import { formContext } from '../contexts/form-context.js';
import { dataContext } from '../contexts/data-context.js';
import { pageContext } from '../contexts/page-context.js';
import { dragDropContext } from '../contexts/drag-drop-context.js';
import { customComponentsContext } from '../contexts/custom-components-context.js';
import { Component } from '../../models/Component.js';
import './ComponentPropertiesEditor.js';
import type { CUSTOM_COMPONENT, FORM_DATA_TYPE } from '../types.js';
import type { ValueChangeFunction, CommentsChangeFunction } from '../../shared/formTypes.js';

import './FormGenerator.js';
import './CodeViewer.js';
import { generateUniqueId } from '../../shared/generateUniqueId.js';
import { ComponentTypes } from '../../shared/componentTypes.js';


const DESIGNER_VIEW = 'designer';
const CODE_VIEW = 'code';
const DATA_VIEW = 'data';

export class FormRender extends ScElement {
  static styles = css`
    :host {
      display: block;
      overflow-y: scroll;
      overflow-x: hidden;
      width: 100%;
    }
    .container {
      background: transparent;
      position: sticky;
      padding: 0 0.625rem;
      width: -webkit-fill-available;
      min-height: 99%;
      color: var(--sc-color-blue-500-100);
      border-radius: 0.5rem;
      display: flex;
      flex-direction: column;
    }
    .toggle-container {
      display: flex;
    }
    .toggle-container >div {
      flex: 1;
    }
    .toggle-container .switch {
      position: absolute;
      top: 0.75rem;
    }
    .components-container {
      display: flex;
      flex-direction: column;
      position: relative;
      flex: 1;
    }
    .left-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .right-content {
      margin-left: 1rem;
    }
    .row {
      padding: 0.625rem 0 0 0;
      width: 90%;
    }
    .toggle {
      text-align: right;
      margin-top: 1rem;
    }
    .toggle sc-button-group {
      display: inline-block;
    }
  `;
    
  @consume({ context: dataContext })
  @property()
  private _formAllData: FORM_DATA_TYPE[] = [];
  
  @provide({ context: dragDropContext })
  @state() 
    dragDropState: {
    _highlighting: boolean;
  };

  @consume({ context: formContext, subscribe: true })
  @property({ attribute: false }) 
  private formDefinition: FormDefinition;

  @consume({ context: customComponentsContext, subscribe: true })
  @property({ attribute: false }) 
  private  customComponents: CUSTOM_COMPONENT[];
      
  @consume({ context: pageContext, subscribe: true })
  @state()
  private _selectedPage = { id: '' };
  
  @property({ type: Boolean, attribute: 'hide-toggle' }) hideToggle = false;
  
  @property({ type: String }) key: string;

  @property({ type: Function }) onValueChange: ValueChangeFunction;

  @property({ type: Function }) onCommentsChange: CommentsChangeFunction;

  @state() _viewer: string = DESIGNER_VIEW;

  constructor() {
    super();
    this.dragDropState = {
      _highlighting: false,
    };
  }
  
  cancelHighlight() {
    this.getAndHighlight(false);
  }

  highlight() {
    this.getAndHighlight(true);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('dragenter', this.highlight);
    this.addEventListener('dragleave', this.cancelHighlight);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('dragenter', this.highlight);
    this.addEventListener('dragleave', this.cancelHighlight);
  }

  get page() {
    return this.formDefinition?.getPage(this._selectedPage?.id);
  }

  get components() {
    return this.page?.components;
  }

  onComponentEdit = (component: Component, customComponent: CUSTOM_COMPONENT) => {
    this.emit('component-edit', {
      detail: {
        component,
        customComponent,
      },
    });
  };

  updateAllIds(array: any[]) {
    array.forEach(obj => {
      if (obj.child) {
        this.updateAllIds(obj.child);
      }
    });
    return array;
  }

  updateForm = (components: Component[]) => {
    const { page } = this;
    if (page && components) {
      page.components = components;
    }
    this.onSave();
    this.requestUpdate();
  };

  matchComponentType(type: string) {
    let _type;
    Object.keys(ComponentTypes).some(key => {
      const currentComponent = ComponentTypes[key].replace(/ /g, '');
      if (type.includes(currentComponent) || type.includes(key)) {
        _type = key;
        return true;
      }
    });
    if (!_type) {
      // check in custom components
      const customComponent = this.customComponents.find(c => type.includes(c.id));
      if (customComponent) {
        _type = customComponent.id;
      }
    }
    return _type;
  }

  createNewComponent = (e: any) => {
    const sourceId = e.dataTransfer.getData('text/plain');
    const type = (drop(e) as any) ? (drop(e) as any)?.[0] : this.matchComponentType(sourceId);
    if (type !== undefined) {
      let properties;
      if (this.customComponents) {
        const component = this.customComponents.find(c => c.id === type);
        properties = component?.element?.properties;
      }
      const { page } = this;
      if (page) {
        page.addComponent(type, undefined, properties);
        page.removeComponent(sourceId);
      }
      this.requestUpdate();
      this.getAndHighlight(false);
    }
    this.onSave();
  };

  onSave() {
    this.emit('form-updated', {
      composed: true,
      bubbles: true,
      detail: {
        definition: this.formDefinition,
      },
    });
  }

  updateViewer(e: CustomEvent) {
    const viewer = e.detail.value;
    this._viewer = viewer[0];
    this.requestUpdate();
  }

  getAndHighlight = (highlight: boolean) => {
    this.dragDropState._highlighting = highlight;
    this.requestUpdate();
  };

  changePageStatus(event: CustomEvent) {
    const { checked } = event.detail;
    if (checked) {
      this.formDefinition.addPage({}, this._selectedPage?.id);
    } else {
      if (this.page) {
        this.formDefinition.removePage(this.page.id);
      }
    }
    this.page?.updateStatus(checked);
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="container">
        <div class=toggle-container>
          <!-- <div class=switch>
            ${
  this._selectedPage?.id !== 'form' ? html`
                <sc-label label='Show this page'></sc-label>
                <sc-switch 
                  label=${this.page?.show ? 'Off' : 'On'}
                  ?checked=${this.page?.show}
                  @sc-change=${this.changePageStatus}
                ></sc-switch>
              ` : nothing
}
          </div> -->
          
          ${this.hideToggle ? null : html`<div class=toggle>
            <sc-button-group @sc-select=${this.updateViewer} single-select size=md .value=${JSON.stringify([this._viewer])}>
              <sc-button-group-item value=designer>Designer</sc-button-group-item>
              <sc-button-group-item value=code>Code</sc-button-group-item>
              <sc-button-group-item value=data>Data</sc-button-group-item>
            </sc-button-group>
          </div>`}
        </div>
        <div class=components-container>
          <div class=left-content>
            ${this._viewer === DESIGNER_VIEW ? html`<form-generator
              .key=${generateUniqueId()}
              .components=${this.components}
              .updateForm=${this.updateForm}
              .onValueChange=${this.onValueChange}
              .onCommentsChange=${this.onCommentsChange}
            >
            </form-generator>
            ${renderDragDropZone(this.createNewComponent, this.dragDropState?._highlighting)}
            ` : this._viewer === CODE_VIEW ? html`
              <code-viewer
                editable
                .codeSinppets=${JSON.stringify(this.formDefinition)}
              ></code-viewer>
            ` : this._viewer === DATA_VIEW ? html`
              <code-viewer .codeSinppets=${JSON.stringify(this._formAllData)}></code-viewer>
            ` : nothing}
          </div>
        </div>
      </div>
    `;
  }
}

if (!window.customElements.get('form-render')) {
  window.customElements.define('form-render', FormRender);
}
