import { html, LitElement, css, nothing } from 'lit';
import { consume } from '@lit/context';
import { state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { Component } from '../../models/Component.js';
import { 
  drop, 
  onPlaceholderDragOver, 
  onDragEnd,
  onDragLeave,
  onDragStart, 
  onDrop, 
  onMouseEnter, 
  onMouseLeave, 
} from './DragDropZone.js';
// @ts-ignore
import GridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import { modeContext } from '../contexts/mode-context.js';
import { dataContext } from '../contexts/data-context.js';
import { pageContext } from '../contexts/page-context.js';
import { dragDropContext } from '../contexts/drag-drop-context.js';
import type { CUSTOM_COMPONENT, INVALID_COMPONENT, FORM_DATA_TYPE, ERROR_MESSAGES } from '../types.js';
import { customComponentsContext } from '../contexts/custom-components-context.js';
import { actionContext } from '../contexts/action-context.js';
import { activeComponentContext } from '../contexts/active-component-context.js';
import { invalidComponentsContext } from '../contexts/invalid-components-context.js';
import { errorMessagesContext } from '../contexts/error-messages-context.js';
import { generateUniqueId } from '../../shared/generateUniqueId.js';
import { evaluateCondition, generateConditions } from '../Components/common/FormEngine.js';
import { ComponentNames } from '../../shared/componentTypes.js';

type Constructor<T = unknown> = new (...args: any[]) => T;

export declare class ComponentMixinInterface {
  renderFormField(c: Component, container?: boolean): unknown;
  generateComponent(c: Component[], viewer?: boolean, key?: string, data?: any, parentComponent?: Component, readonly?: boolean, noSpacing?: boolean): unknown;
  renderEmptyLabel(c: Component, index?: number): unknown;
}

export const ComponentMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class ComponentMixinClass extends superClass {
    
    static styles = css`${GridStyle}`;

    _components: Component[];

    // @ts-ignore
    @consume({ context: customComponentsContext })
    @state() 
      customComponents: CUSTOM_COMPONENT[];

    // @ts-ignore
    @consume({ context: dragDropContext })
    @state() 
      dragDropState: {
        _highlighting: boolean;
      };

    // @ts-ignore
    @consume({ context: invalidComponentsContext })
    @state() 
      invalidComponents: INVALID_COMPONENT[];

    // @ts-ignore
    @consume({ context: activeComponentContext })
    @state()
      activeComponent: object;    
        
    // @ts-ignore
    @consume({ context: errorMessagesContext, subscribe: true })
    @state() 
      errorMessages: ERROR_MESSAGES;

    //@ts-ignore
    @consume({ context: modeContext })
    @state() mode: string;
  
    //@ts-ignore
    @consume({ context: pageContext, subscribe: true })
    @state() _selectedPage: string;
  
    // @ts-ignore
    @consume({ context: dataContext })
    @state() 
      formData: any[];

    @consume({ context: actionContext })
      _formAction: any;

    @state() _editing = false;
    
    get page() {
      // @ts-ignore
      return this.formDefinition?.getPage(this._selectedPage?.id);
    }
    renderFormField(field: Component, customComponent?: CUSTOM_COMPONENT) {
      // @ts-ignore
      const isActiveComponent = field.id === this.activeComponent?.id;
      return html`
        <div 
          class=${
  classMap({
    active: isActiveComponent,
    'editor-container': true,
  })
}
        >
          <div 
            id="${field.id}"
            class=${
  classMap({
    container: field.isContainer?.(),
    fieldblock: true,
    active: isActiveComponent,
  })
}
            @mouseenter=${onMouseEnter}
            @mouseleave=${onMouseLeave}
          >
            <component-editor
              id=${field.id} 
              .key=${generateUniqueId()}
              .component=${field}
              .customComponent=${customComponent}
              .updateForm=${
  // @ts-ignore
  this.updateForm
}
              .updateEditingStatus=${
  (status: boolean) => this._editing = status
}
            ></component-editor>
          </div>
        </div>
      `;
    }

    renderComponentControl(component: Component, key: string | undefined, formData: any[] | undefined, parentComponent?: Component, readonly?: boolean, customComponent?: CUSTOM_COMPONENT, noSpacing?: boolean) {
      const isEmpty = !!this.invalidComponents?.find((d: any) => d.id === component.id);
      
      return html`
        <component-controller
          class=${noSpacing ? 'no-spacing' : ''}
          mode=view
          .key=${key}
          id=${component.id}
          error-message=${this.errorMessages?.[component.id] || (isEmpty ? 'This cannot be empty!' : '')}
          ?readonly=${(parentComponent ? parentComponent.template.readonly : component.template.readonly) || readonly} 
          .component=${component}
          .customComponent=${customComponent}
          .value=${formData?.find((d: any) => d.id === component.id)?.value}
          @component-value-changed=${this._formAction?.onValueChange}
        ></component-controller>
      `;
    }

    moveComponentToExistingRow = (event: DragEvent) => {
      const target = event.target as HTMLInputElement;
      // @ts-ignore
      const { id } = target;
      const position = target.getAttribute('data-insert-position') as string;
      const sourceId = event.dataTransfer?.getData('text/plain');
      this.sortComponents(event, sourceId, id, position, true);
      // @ts-ignore
      this.updateForm();
    };

    sortComponents(event: DragEvent, sourceId: string | undefined, targetId: string | undefined, position: string, keepSameRow: boolean) {
      if (!sourceId || !targetId) return;
      const allComponents = this.page?.getAllComponentsWithParents();
      let sourceComponent = allComponents.find((c: Component) => c.id === sourceId);
      const targetComponent = allComponents.find((c: Component) => c.id === targetId);
      if (!sourceComponent && !targetComponent) return;
      // Drag from the left panel
      if (targetComponent && !sourceComponent) {
        const [type] = drop(event) as any;
        if (type !== undefined) {
          let properties;
          if (this.customComponents) {
            const component = this.customComponents.find(c => c.id === type);
            properties = component?.element?.properties;
          }
          sourceComponent = new Component(type, undefined, undefined, undefined, properties);
        }
      }
      // Remove the source component
      if (keepSameRow) {
        sourceComponent.layout = {
          row: targetComponent.layout.row,
          column: sourceComponent.layout.column,
        };
      } else {
        sourceComponent.createNewRow();
      }
      if (targetComponent.tabId) {
        sourceComponent.tabId = targetComponent.tabId;
      }
      if (targetComponent.stepId) {
        sourceComponent.stepId = targetComponent.stepId;
      }
      this.page?.removeComponent(sourceId);
      this.page?.insertComponent(targetId, sourceComponent, position);
    }

    moveComponentToNewRow(event: DragEvent, previousEleId: string) {
      if (previousEleId) {
        const sourceId = event.dataTransfer?.getData('text/plain');
        this.sortComponents(event, sourceId, previousEleId, 'before', false);
        // @ts-ignore
        this.updateForm();
      }
    }

    renderStyle() {
      return html`
        <style>
          .editor-container {
            border: 0.125rem solid transparent;
            padding: 0 0.312rem;
            border-radius: 0.312rem;
          }
          .editor-container.active {
            border: 0.125rem solid hsl(205, 100%, 45%);
          }
          .fieldblock {
            display: flex;
            position: relative;
            margin-bottom: 0.625rem;
            cursor: move;
            border: 0.0625rem solid transparent;
            width: -webkit-fill-available;
          }
          .fieldblock.highlight {
            border: var(--sc-color-blue-50);
          }
          .drop-placeholder {
            width: 100%;
            height: 0.937rem;
            border: 0.0625rem solid transparent;
          }
          .grid-row .drop-placeholder {
            width: 0.937rem;
            height: 2.875rem;
            margin-top: 1.25rem;
          }
          .drop-placeholder.highlight {
            border: 0.0625rem dashed var(--sc-form-designer-drop-zone-border-color, var(--sc-color-blue-500));
            background: var(--sc-box-info-background-color, var(--sc-color-blue-50));
          }
          .column-placeholder {
            border: 0.0625rem dashed var(--sc-form-designer-drop-zone-border-color, var(--sc-color-blue-500));
            padding: 0;
            height: 3.125rem;
            margin-top: 1.25rem;
            margin-left: 1.25rem;
            background: var(--sc-box-info-background-color, var(--sc-color-blue-50));
          }
          .drop-placeholder.active {
            background: var(--sc-dropdown-item-background-hover-color, var(--sc-color-blue-100));
          }
          component-controller {
            padding: 0.625rem 0;
            display: block;
          }
          component-controller.no-spacing {
            padding: 0;
          }
        </style>
      `;
    }

    calculateConditions(template: any = {}) {
      if (this.mode === 'edit') return true;
      const { conditions, hidden } = template;
      if (!conditions || !this.formData) return true;
      const conditionStr = generateConditions(conditions, this.formData);
      if (!evaluateCondition(conditionStr, this.formData)) {
        return false;
      }
      if (hidden) {
        return false;
      }
      return true;
    }

    renderPlaceholder = (callback: any, id?: string, position?: string) => {
      return html`
        <div 
          class='drop-placeholder ${this.dragDropState?._highlighting ? 'highlight' : ''}'
          id=${id}
          data-insert-position=${position}
          @dragover=${onPlaceholderDragOver}
          @dragleave=${onDragLeave}
          @drop=${(e: DragEvent) => {
    onDrop(e, (e: DragEvent) => callback?.(e));
    this.getAndHighlight(false);
  }}
        ></div>
      `;
    };

    getAndHighlight = (highlight: boolean) => {
      if (this.dragDropState) {
        this.dragDropState._highlighting = highlight;
        this.requestUpdate();
      }
    };

    compareTmpValues(c: any, customComponent?: CUSTOM_COMPONENT & { settings?: Record<string, any>, element?: { properties?: Record<string, any>}}) {
      if (!c || !customComponent) return;
      const { template } = c;
      const settings = customComponent?.settings;
      const properties = customComponent.element?.properties;
      if (template && settings) {
        Object.keys(settings).forEach((key: string) => {
          if (template[key] && settings[key] && settings[key].oldOptions) {
            const index = settings[key].oldOptions.indexOf(template[key]);
            if (index > -1) {
              template[key] = settings[key].options[index];
            }
          }
        });
      }
      if (template && properties) {
        Object.keys(properties).forEach((key: string) => {
          if (template[key] && properties[key] && properties[key].unchanging) {
              template[key] = properties[key]?.defaultValue;
          }
        });
      }
    }

    generateComponent = (components: Component[], viewer?: boolean, key?: string, formData?: any[], parentComponent?: Component, readonly?: boolean, noSpacing?: boolean) => {
      if (!components || components.length === 0) return null;
      this._components = components;
      // @ts-ignore
      const { formDefinition } = this;
      const rows = this.page?.getAllRowsComponents(components);
      if (!rows) return null;
      return html`
        ${this.renderStyle()}
        <div>
          ${Object.keys(rows).map((id: string) => {
    const rowData = rows[id];
    const firstComponent = rowData && rowData[0];
    return html`
              ${!viewer ? this.renderPlaceholder((e: DragEvent) => { this.moveComponentToNewRow(e, firstComponent.id); }) : nothing}
              <sc-grid-row 
                data-row-id=${id} 
                class='grid-row'
                ?no-gutters=${!viewer || noSpacing}
                @dragleave=${onDragEnd}
              >
                ${!viewer ? this.renderPlaceholder(this.moveComponentToExistingRow, rowData[0].id, 'before') : nothing}
                ${
  rowData.map((c: Component, index: number) => {
    const { layout, customized, type, template, id } = c;
    let customComponent;
    if (customized && this.customComponents) {
      customComponent = this.customComponents.find(c => c.id === type);
    }
    this.compareTmpValues(c, customComponent);
    const res = this.calculateConditions(c.template);
    if (formData) {
      const dataIndex = formData.findIndex((data: FORM_DATA_TYPE) => data.id === id);
      const parents = this.page?.getComponentParents(c.id) || [];
      const tabs = parents.filter((p: Component) => p.type === ComponentNames.TABS).map((p: Component) => p.template.tabs).flat() || [];
      const parentShow = parents.every((parent: Component) => {
        // If the parent component is in a tab, return false if the tab not exist
        if (parent.tabId && !tabs.find((t: any) => t.id === parent.tabId)) {
          return false;
        }
        return this.calculateConditions(parent.template);
      });
      if (dataIndex > -1 && (!res || !parentShow || (c.tabId && !tabs.find((t: any) => t.id === c.tabId)))) {
        formData[dataIndex].hidden = true;
      } else {
        delete formData[dataIndex]?.hidden;
      }
    }
    if (viewer) {
      if (template.hidden) {
        return nothing;
      }
      return html`
                        <sc-grid-column
                          class='grid-column'
                          style='display: ${res ? 'block' : 'none'};'
                          id=${c.id}
                        >
                          ${this.renderComponentControl(c, key, formData, parentComponent, readonly, customComponent, noSpacing)}
                        </sc-grid-column>  
                      `;
    }
    return html`
                      <sc-grid-column
                        class='grid-column'
                        xs=${layout?.column}
                        id=${c.id}
                        draggable=${(viewer || this._editing) ? 'false' : 'true'}
                        @dragstart=${onDragStart}
                        
                      >
                        ${this.renderFormField(c, customComponent)}
                      </sc-grid-column>
                      ${viewer ? nothing : index < rowData.length - 1 ? html`${this.renderPlaceholder(this.moveComponentToExistingRow, c.id, 'after')}` : nothing}
                    `;
  })
}
                ${viewer ? nothing : this.renderPlaceholder(this.moveComponentToExistingRow, rowData[rowData.length - 1].id, 'after')}
              </sc-grid-row>
            `;
  })}
        </div>
      `;
    };

    renderEmptyLabel = (component: Component, index?: number) => {
      const { components } = component;
      const isContainer = component.isContainer();
      let _components = components;
      if (index !== undefined && index !== null) {
        _components = components[index].components;
      }
      return isContainer && (!_components || _components.length === 0) ? html`
        <style>
          .empty-label {
            width:100%;
            text-align:center;
            color: var(--sc-label-color, var(--sc-color-grey-650));
            font-size:0.8rem;
          }
        </style>
        <div class='empty-label' >
            Drag and drop components here
        </div>
      ` : '';
    };
  }
  return ComponentMixinClass as Constructor<ComponentMixinInterface> & T;
};
