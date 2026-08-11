import { html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { ContainerBaseEditor } from '../../common/ContainerBaseEditor.js';
import { StepOption } from '../../../../models/Components/StepperTemplate.js';
import { renderDragDropZone } from '../../../utils/DragDropZone.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import { Component } from '../../../../models/Component.js';

export class StepperEditor extends ComponentMixin(ContainerBaseEditor) {

  @state() _steps: StepOption[] = [];

  @state() _selectedIndex = 0;

  renderLabel: any = () => nothing;

  willUpdate() {
    const { steps } = this.component.template;
    if (steps) {
      this._steps = steps;
    }
  }

  onStepChanged(event: CustomEvent) {
    const { index } = event.detail;
    this._selectedIndex = index;
  }

  addStep() {
    this._steps.push(new StepOption());
    this.requestUpdate();
  }
  
  deleteStep(index: number) {
    if (this._steps.length === 1) return;
    this._steps.splice(index, 1);
    this.onChange(this._steps, 'steps');
    this.requestUpdate();
  }

  updateStepper(value: string, type: string, index: number) {
    const step: StepOption = this._steps[index];
    if (step) {
      // @ts-ignore
      step[type] = value;
      if (type === 'title') {
        step['id'] = this.removeSpaces(value);
      }
      this._steps[index] = step;
      this._steps = this.getFilterOption(this._steps);
      this.onChange(this._steps, 'steps');
      this.requestUpdate();
    }
  }

  renderPrefillAnswer: any = () => {
    return html`
      <prefill-answer
        .component=${this.component}
        @value-changed=${(event: CustomEvent) => {
    this.onChange(event.detail.value, event.detail.name);
    this.requestUpdate();
  }}
      ></prefill-answer>
    `;
  };

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
          margin-bottom: 0.937rem;
        }

        .row {
          padding: 0.937rem 0 0;
          width: 100%;
        }
      </style>
      <div>
        <div class=option-title>Options</div>
        <div class="options-container">
        ${this._steps?.length > 0 ? html`
          <sc-grid-row class="options-text">
            <sc-grid-column md="5"><sc-label label="Label" label-size="md"></sc-label></sc-grid-column>
            <sc-grid-column md="6"><sc-label label="Value" label-size="md"></sc-label></sc-grid-column>
          </sc-grid-row>` : ''}
        ${
  this._steps?.map((step: StepOption, index: number) => {
    return html`
              <sc-grid-row no-gutters class="options-row">
                <sc-grid-column md="5">
                  <sc-text-input value=${step.title}
                    @sc-input=${(e: CustomEvent) => this.updateStepper(e.detail.value, 'title', index)}
                  ></sc-text-input>
                </sc-grid-column>
                <sc-grid-column md="6">
                  <div class="value-col">
                    <sc-text-input value=${step.id}
                      @sc-input=${(e: CustomEvent) => this.updateStepper(this.removeSpaces(e.detail.value), 'id', index)}
                    ></sc-text-input>
                  </div>
                </sc-grid-column>
                <sc-grid-column md="1">
                  <sc-icon
                    name="trash--line"
                    class=${ this._steps.length === 1 ? 'options-remove-disable' : 'options-remove ' }
                    @click=${() => this.deleteStep(index)}
                  >
                </sc-grid-column>
              </sc-grid-row>
            `;
  })
}
        </div>
        <div @click=${this.addStep} class='add-link'>+ Add step</div>
      </div>
    `;
  };

  renderOtherBehavior = () => {
    const { conditional } = this.component.template;
    return html`
      <sc-switch
        label='Conditional step'
        ?checked=${conditional}
        @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'conditional')}
      >
      </sc-switch>
    `;
  };

  renderBasicComponent = () => {
    this._steps = this.getFilterOption(this._steps);
    return html`
      <div style='padding: 1rem 1rem; box-shadow: rgba(0, 0, 0, 0.15) 0 0.0625rem 0.25rem 0; border-radius: 1rem'>
        <sc-stepper title-position="bottom" style='margin: 1.25rem 0' @sc-active-step-changed=${this.onStepChanged}>
          ${
  this._steps?.map((step: StepOption) => {
    return html`
                <sc-step><span slot="title">${step.title}</span></sc-step>
              `;
  })
}
        </sc-stepper>
        ${
  this._steps?.map((step: StepOption, index: number) => {
    if (this._selectedIndex === index) {
      return html`
                ${
  this.generateComponent(
    this.component.components?.filter((c: Component) => c.stepId === step.id)
  )
}
                ${renderDragDropZone(e => this.onDrop(e, undefined, step.id), this.dragDropState?._highlighting, ()=> this.renderEmptyLabel(this.component))}
              `;
    }
    return nothing;
  })
}
        <div class=${this.component?.alignment}>
          ${this.renderConditionIcon()}
          ${this.renderHiddenIcon()}
          ${this.renderCommentsIcon()}
        </div>
      </div>
    `;
  };
}