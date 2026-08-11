import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class DateDisplay extends FormBaseViewer {
  renderElement() {
    const {
      value,
      defaultValue,
      dateType = 'full-date',
      showTime = false,
      timeOnly = false,
      hideSeconds = false,
      showTimezone = false,
      size = 'md',
      helpText,
    } = this.template;

    const currentValue = this.getContextValue() || value || defaultValue;

    return html`
      <sc-date
        .date=${currentValue}
        date-type=${dateType}
        ?show-time=${showTime}
        ?time-only=${timeOnly}
        ?hide-seconds=${hideSeconds}
        ?show-timezone=${showTimezone}
        size=${size}
        style="--date-padding:0rem;"
      ></sc-date>
      ${helpText ? html`<div class="help-text">${unsafeHTML(helpText)}</div>` : ''}
    `;
  }
}