import { html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import { Component } from '../../../../models/Component.js';
import { StepOption } from '../../../../models/Components/StepperTemplate.js';

export class Stepper extends ComponentMixin(FormBaseViewer) {
 
  @state() _selectedIndex = 0;

  @state() _stepChanged = false;

  willUpdate(properties: any) {
    if (properties.get('component') || (properties.get('key') && properties.size > 1)) {
      const { steps } = this.component?.template ?? {};
      if (steps) {
        const index = steps.findIndex((s: StepOption) => s.active);
        if (index >= 0) {
          this._selectedIndex = index;
          this._stepChanged = true;
        }
      }
    }
  }

  onStepChanged(event: CustomEvent) {
    const { index } = event.detail;
    if (this.isDisabled(index)) return;
    this._selectedIndex = index;
    this._stepChanged = true;
  }

  isDisabled(index: number) {
    const { steps, conditional } = this.component?.template ?? {};
    const preStatus = index > 0 ? steps[index - 1]?.status : 'finish';
    const disabled = conditional && preStatus !== 'finish' ? true : false;
    return disabled;
  }

  renderElement() {
    const { defaultValue, value, steps } = this.component?.template ?? {};
    let defaultIndex = 0;
    if (steps) {
      defaultIndex = steps.findIndex((s: StepOption) => s.id === (defaultValue || value));
    }
    return html`
      <div>
        <sc-stepper title-position="bottom" style='margin:1.25rem 0' @sc-active-step-changed=${this.onStepChanged}>
          ${
  steps?.map((step: StepOption, index: number) => {
    return html`
                <sc-step 
                  .status=${step.status} 
                  ?disabled=${step.disabled || this.isDisabled(index)}
                  ?active=${(this._stepChanged ? this._selectedIndex : defaultIndex) === index}
                ><span slot="title">${step.title}</span></sc-step>
              `;
  })
}
        </sc-stepper>
        ${
  steps?.map((step: StepOption, index: number) => {
    if (this._selectedIndex === index) {
      return html`
                ${
  this.generateComponent(
    this.component.components?.filter((c: Component) => c.stepId === step.id), 
    true, 
    this.key, 
    this.formData, 
    this.component, 
    this.readonly,
  )
}
              `;
    }
    return nothing;
  })
}
      </div>
    `;
  }
 
}