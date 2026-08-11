import { html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { ContainerBaseEditor } from '../../common/ContainerBaseEditor.js';
import { TabOption } from '../../../../models/Components/TabsTemplate.js';
import { renderDragDropZone } from '../../../utils/DragDropZone.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import { Component } from '../../../../models/Component.js';

export class TabsEditor extends ComponentMixin(ContainerBaseEditor) {

  @state() _tabs: TabOption[] = [];

  renderLabel: any = () => nothing;

  willUpdate() {
    const { tabs } = this.component.template;
    if (tabs) {
      this._tabs = tabs;
    }
  }



  addTab() {
    this._tabs.push(new TabOption());
    this.requestUpdate();
  }
  
  deleteTab(index: number) {
    if (this._tabs.length === 1) return;
    this._tabs.splice(index, 1);
    this.onChange(this._tabs, 'tabs');
    // delete components in the deleted tab
    const tabIds = this._tabs.map(t => t.id);
    const updatedComponents = this.component.components?.filter((c: Component) => tabIds.includes(c.tabId));
    updatedComponents?.length && this.component.updateComponents(updatedComponents);
    this.requestUpdate();
  }

  updateTab(value: string, type: string, index: number) {
    const tab: TabOption = this._tabs[index];
    if (tab) {
      // @ts-ignore
      tab[type] = value;
      if (type === 'name') {
        tab['id'] = this.removeSpaces(value);
      }
      this._tabs[index] = tab;
      this._tabs = this.getFilterOption(this._tabs);
      this.onChange(this._tabs, 'tabs');
      this.requestUpdate();
    }
  }

  renderDataOptions: any = () => {
    return html`
      <style>
        .option-title {
          font-size: 0.875rem;
          margin-bottom: var(--sc-spacing-8);
        }
        .options-container {
          overflow-x: hidden;
        }
        .options-text {
          font-size: 0.875rem;
        }
        .options-row {
          margin-bottom: var(--sc-spacing-4);
        }
        .options-row .value-col {
          padding-left: var(--sc-spacing-8);
        }
        .options-remove {
          color: var(--sc-color-red-500);
          margin-top:0.4rem;
          padding-left: var(--sc-spacing-4);
          cursor: pointer;
        }
        .options-remove-disable {
          color: var(--sc-color-grey-500);
          margin-top:0.4rem;
          padding-left: var(--sc-spacing-4);
          cursor: pointer;
        }
        .add-link {
          color: var(--sc-color-blue-500);
          cursor: pointer;
        }
      </style>
      <div>
        <div class=option-title>Options</div>
        <div class="options-container">
        ${this._tabs?.length > 0 ? html`
          <sc-grid-row class="options-text">
            <sc-grid-column md="5"><sc-label label="Label" label-size="md"></sc-label></sc-grid-column>
            <sc-grid-column md="6"><sc-label label="Value" label-size="md"></sc-label></sc-grid-column>
          </sc-grid-row>` : '' }
        ${
  this._tabs?.map((tab: TabOption, index: number) => {
    return html`
            <sc-grid-row no-gutters class="options-row">
              <sc-grid-column md="5">
                <sc-text-input value=${tab.name}
                  @sc-input=${(e: CustomEvent) => this.updateTab(e.detail.value, 'name', index)}
                ></sc-text-input>
              </sc-grid-column>
              <sc-grid-column md="6">
                <div class="value-col">
                  <sc-text-input value=${tab.id}
                    @sc-input=${(e: CustomEvent) => this.updateTab(this.removeSpaces(e.detail?.value), 'id', index)}
                  ></sc-text-input>
                </div>
              </sc-grid-column>
              <sc-grid-column md="1">
                <sc-icon
                  name="trash--line"
                  class=${ this._tabs.length === 1 ? 'options-remove-disable' : 'options-remove ' }
                  @click=${() => this.deleteTab(index)}
                >
              </sc-grid-column>
            </sc-grid-row>
            `;
  })
}
        </div>
        <div @click=${this.addTab} class='add-link row'>+ Add tab</div>
      </div>
    `;
  };

  renderBasicComponent = () => {
    this._tabs = this.getFilterOption(this._tabs);
    return html`
      <sc-tab-group style='padding: 0 1rem; box-shadow: rgba(0, 0, 0, 0.15) 0 0.0625rem 0.25rem 0; border-radius: 1rem'>
        ${
  this._tabs?.map((tab: TabOption) => {
    return html`
              <sc-tab slot="nav" panel=${tab.id}>${tab.name}</sc-tab>
              <sc-tab-panel name=${tab.id} style='overflow: hidden'>
                ${
  this.generateComponent(
    this.component.components?.filter((c: Component) => c.tabId === tab.id)
  )
}
                ${renderDragDropZone(e => this.onDrop(e, tab.id), this.dragDropState?._highlighting, ()=> this.renderEmptyLabel(this.component))}
              </sc-tab-panel>
            `;
  })
}
      </sc-tab-group>
      <div class=${this.component?.alignment}>
        ${this.renderConditionIcon()}
        ${this.renderHiddenIcon()}
        ${this.renderCommentsIcon()}
      </div>
    `;
  };
}