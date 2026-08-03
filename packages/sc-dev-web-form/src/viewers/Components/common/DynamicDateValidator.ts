import { html } from 'lit';
import { property } from 'lit/decorators.js';
// @ts-ignore
import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import ScElement from '../../utils/sc-element.js';

const RangeOptions = [
  {
    label: 'Day',
    value: 'day',
  },
  {
    label: 'Week',
    value: 'week',
  },
  {
    label: 'Month',
    value: 'month',
  },
  {
    label: 'Year',
    value: 'year',
  },
];

const RuleOptions = [
  {
    label: 'Before',
    value: 'subtract',
  },
  {
    label: 'After',
    value: 'add',
  },
];

export class DynamicDateValidator extends ScElement {

  @property({ type: String }) type: string;

  @property({ type: String }) min = '';

  @property({ type: String }) max = '';

  @property({ type: Object }) dynamicDate: any;

  onTypeChange(type: string) {
    this.emit('value-changed', {
      detail: {
        value: type,
        name: 'type',
      },
    });
    this.emit('value-changed', {
      detail: {
        value: type === 'fixed' ? {} : { minDateType: 'day', maxDateType: 'day' },
        name: 'dynamicDate',
      },
    });
  }

  onDynamicDateChange(value: string, field: string) {
    this.emit('value-changed', {
      detail: {
        value: { ...this.dynamicDate, [field]: value },
        name: 'dynamicDate',
      },
    });
  }

  render() {
    return html`
      <style>
        .row {
          margin-bottom: 0.937rem;
        }
        .label {
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        .grid-row {
          margin-bottom: 0.5rem;
        }
        ${ScGridStyle}
      </style>
      <div class=row>
        <sc-button-group
          label=""
          single-select
          .value=${[this.type]}
          @sc-select=${(e: CustomEvent) => this.onTypeChange(e.detail.value[0])}
        >
          <sc-button-group-item value=fixed>Fixed</sc-button-group-item>
          <sc-button-group-item value=dynamic>Dynamic</sc-button-group-item>
        </sc-button-group>
      </div>
      ${this.type === 'fixed' ? html`
        <div class=row>
          <sc-date-input
            hoist
            label="Min value"
            value=${this.min}
            border-type="box"
            @sc-change=${(e: CustomEvent) => this.emit('value-changed', { detail: { value: e.detail.value, name: 'min' } })}
          >
          </sc-date-input>
        </div>
        <div class=row>
          <sc-date-input
            hoist
            label="Max value"
            value=${this.max}
            border-type="box"
            @sc-change=${(e: CustomEvent) => this.emit('value-changed', { detail: { value: e.detail.value, name: 'max' } })}
          >
          </sc-date-input>
        </div>
      ` : html`
        <div class=label>Min value</div>
          <sc-grid-row class="grid-row">
            <sc-grid-column>
              <sc-dropdown-input
                label="Date ranges"
                hoist
                placeholder="Select"
                value=${this.dynamicDate.minDateType}
                .data=${RangeOptions}
                @sc-select=${(e: CustomEvent) => this.onDynamicDateChange(e.detail.value, 'minDateType')}
              ></sc-dropdown-input>
            </sc-grid-column>
            <sc-grid-column>
              <sc-dropdown-input
                label="Rule"
                hoist
                placeholder="Select"
                value=${this.dynamicDate.minDateRule}
                .data=${RuleOptions}
                @sc-select=${(e: CustomEvent) => this.onDynamicDateChange(e.detail.value, 'minDateRule')}
              ></sc-dropdown-input>
            </sc-grid-column>
        </sc-grid-row>
        <div class=row>
          <sc-number-input
            label=${`Number of ${this.dynamicDate.minDateType}s`}
            value=${this.dynamicDate.minValue}
            @sc-input=${(e: CustomEvent) => this.onDynamicDateChange(e.detail.value, 'minValue')}
          >
          </sc-number-input>
        </div>

        <div class=label>Max value</div>
          <sc-grid-row class="grid-row">
            <sc-grid-column>
              <sc-dropdown-input
                label="Date ranges"
                hoist
                placeholder="Select"
                value=${this.dynamicDate.maxDateType}
                .data=${RangeOptions}
                @sc-select=${(e: CustomEvent) => this.onDynamicDateChange(e.detail.value, 'maxDateType')}
              ></sc-dropdown-input>
            </sc-grid-column>
            <sc-grid-column>
              <sc-dropdown-input
                label="Rule"
                hoist
                placeholder="Select"
                value=${this.dynamicDate.maxDateRule}
                .data=${RuleOptions}
                @sc-select=${(e: CustomEvent) => this.onDynamicDateChange(e.detail.value, 'maxDateRule')}
              ></sc-dropdown-input>
            </sc-grid-column>
        </sc-grid-row>
        <div class=row>
          <sc-number-input
            label=${`Number of ${this.dynamicDate.maxDateType}s`}
            value=${this.dynamicDate.maxValue}
            @sc-input=${(e: CustomEvent) => this.onDynamicDateChange(e.detail.value, 'maxValue')}
          >
          </sc-number-input>
        </div>
      `}
    `;
  }
}

if (!window.customElements.get('dynamic-date-validator')) {
  window.customElements.define('dynamic-date-validator', DynamicDateValidator);
}
