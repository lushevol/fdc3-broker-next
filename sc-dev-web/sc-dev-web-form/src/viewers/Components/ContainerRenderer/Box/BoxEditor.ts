import { html, nothing } from 'lit';
import { ContainerBaseEditor } from '../../common/ContainerBaseEditor.js';
import { renderDragDropZone } from '../../../utils/DragDropZone.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';

export class BoxEditor extends ComponentMixin(ContainerBaseEditor) {

  renderOtherGeneral = () => {
    const { type } = this.component.template;
    return html`
      <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Type"
          value=${type}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'type')}
        >
          ${
  ['Default', 'Info', 'Success', 'Warning', 'Error', 'Disabled', 'Transparent'].map(
    (type: string) => html`
                <sc-radio value=${type.toLowerCase()}>
                  <span class="option-capitalize">${type}</span>
                </sc-radio>`
  )
}
        </sc-radio-group>
      </div>
      
    `;
  };

  renderStyleAndLayout = () => {
    const { labelSize } = this.component?.template ?? {};
    return html`
    <div class=row>
      <sc-radio-group
        columns=3
        direction=horizontal
        label="Title size"
        value=${labelSize}
        @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'labelSize')}
      >
        <sc-radio value=sm>SM</sc-radio>
        <sc-radio value=md>MD</sc-radio>
        <sc-radio value=lg>LG</sc-radio>
      </sc-radio-group>
    </div>
    `;
  };

  renderBasicComponent = () => {
    const { id, components } = this.component;
    const { label, type, labelSize } = this.component?.template ?? {};
    return html`
      <sc-box type=${type || 'default'}>
        <div class='box-body' id="${id}">
          ${label ? html`
            <sc-label
              label="${label}"
              label-size=${labelSize}
            ></sc-label>` : nothing }
          ${
  this.generateComponent(components)
}
          ${renderDragDropZone(this.onDrop, this.dragDropState?._highlighting, ()=> this.renderEmptyLabel(this.component))}
        </div>
      </sc-box>
      <div class=${this.component?.alignment}>
        ${this.renderConditionIcon()}
        ${this.renderHiddenIcon()}
        ${this.renderCommentsIcon()}
      </div>
    `;
  };
}