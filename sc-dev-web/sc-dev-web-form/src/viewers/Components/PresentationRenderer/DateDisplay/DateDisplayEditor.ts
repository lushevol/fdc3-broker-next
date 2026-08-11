import { html, nothing } from 'lit';
import { BaseEditor } from '../../common/BaseEditor.js';
import { FormSize } from '../../../../shared/utils.js';
import '../../common/PrefillAnswer.js';

export class DateDisplayEditor extends BaseEditor {
  renderLabel = () => nothing;

  renderTooltip = () => nothing;

  renderOtherGeneral = () => {
    const { dateType = 'full-date', defaultValue = '' } = this.component.template;
    return html`
      <div class=row>
        <sc-text-input
          label="Date"
          value=${defaultValue}
          placeholder="YYYY-MM-DD or ISO date"
          border-type="box"
          @sc-input=${(e: CustomEvent) => {
            this.onChange(e.detail.value, 'defaultValue');
            this.requestUpdate();
          }}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Date type"
          value=${dateType}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'dateType')}
        >
          <sc-radio value=full-date>Full date</sc-radio>
          <sc-radio value=short-date>Short date</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBehavior = () => {
    const { showTime = false, timeOnly = false, hideSeconds = false, showTimezone = false } = this.component.template;
    return html`
      <div class=w-half>
        <sc-switch
          label="Show time"
          ?checked=${showTime}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'showTime')}
        ></sc-switch>
      </div>
      <div class=w-half>
        <sc-switch
          label="Hide seconds"
          ?checked=${hideSeconds}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'hideSeconds')}
        ></sc-switch>
      </div>
      <div class=w-half>
        <sc-switch
          label="Time only"
          ?checked=${timeOnly}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'timeOnly')}
        ></sc-switch>
      </div>
      <div class=w-half>
        <sc-switch
          label="Show timezone"
          ?checked=${showTimezone}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'showTimezone')}
        ></sc-switch>
      </div>
    `;
  };

  renderPrefillAnswer = () => html`
    <prefill-answer
      .component=${this.component}
      @value-changed=${(event: CustomEvent) => {
        this.onChange(event.detail.value, event.detail.name);
        this.requestUpdate();
      }}
    ></prefill-answer>
  `;

  renderStyleAndLayout = () => {
    const { size = 'md' } = this.component.template;
    return html`
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Size"
          value=${size}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'size')}
        >
          ${FormSize.map((item: string) => html`<sc-radio value=${item}>${item.toUpperCase()}</sc-radio>`)}
        </sc-radio-group>
      </div>
    `;
  };

  renderBasicComponent = () => html`
    <form-date-display .component=${this.component}></form-date-display>
  `;
}