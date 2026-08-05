import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import { Component } from '../../../../models/Component.js';
import { TabOption } from '../../../../models/Components/TabsTemplate.js';

export class Tabs extends ComponentMixin(FormBaseViewer) {
 
  renderElement() {
    const tabs = this.component?.template?.tabs;
    return html`
      <sc-tab-group>
        ${
  tabs?.map((tab: TabOption) => {
    return html`
              <sc-tab slot="nav" panel=${tab.id}>${tab.name}</sc-tab>
              <sc-tab-panel name=${tab.id} style='overflow: hidden'>
                <div class="row">
                  ${
  this.generateComponent(
    this.component.components?.filter((c: Component) => c.tabId === tab.id), 
    true, 
    this.key, 
    this.formData, 
    this.component, 
    this.readonly,
  )
}
                </div>
              </sc-tab-panel>
            `;
  })
}
      </sc-tab-group>
    `;
  }
 
}