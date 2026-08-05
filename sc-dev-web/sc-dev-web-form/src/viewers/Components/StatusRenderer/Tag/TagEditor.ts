import { html } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { BaseEditor } from '../../common/BaseEditor.js';

export class TagEditor extends BaseEditor {

  renderLabel: any = () => {};

  renderStyleAndLayout = () => {
    const { maxWidth } = this.component.template;
    return html`
      <div class=row>
        <sc-number-input label='Max width'
          value=${maxWidth}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'maxWidth')}
        >
        </sc-number-input>
      </div>
    `;
  };

  renderBehavior: any = () => {
    const { disabled } = this.component?.template ?? {};
    return html`
      <div>
        <sc-switch
          label="Disabled"
          ?checked=${disabled}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'disabled')}
        >
        </sc-switch>
      </div>`;
  };

  renderOtherGeneral = () => {
    const { mode, iconName, type } = this.component.template;
    return html`
      <div class=row>
        <sc-radio-group
          columns=2
          label=Mode
          value=${mode}
          direction=horizontal
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'mode')}
        >
          <sc-radio value=default>Default</sc-radio>
          <sc-radio value=filled>Filled</sc-radio>
          <sc-radio value=link>Link</sc-radio>
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-radio-group
          columns=2
          label=Type
          value=${type}
          direction=horizontal
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'type')}
        >
          <sc-radio value=primary>Primary</sc-radio>
          <sc-radio value=success>Success</sc-radio>
          <sc-radio value=warning>Warning</sc-radio>
          <sc-radio value=error>Error</sc-radio>
          <sc-radio value=disabled>Disabled</sc-radio>
          <sc-radio value=transparent>Transparent</sc-radio>
          <sc-radio value=blue>Blue</sc-radio>
          <sc-radio value='dark-blue'>Dark blue</sc-radio>
          <sc-radio value=red>Red</sc-radio>
          <sc-radio value=amber>Amber</sc-radio>
          <sc-radio value=green>Green</sc-radio>
          <sc-radio value=grey>Grey</sc-radio>
          <sc-radio value=black>Black</sc-radio>
          <sc-radio value=white>White</sc-radio>
          <sc-radio value='grey-dash'>Grey dash</sc-radio>
        </sc-radio-group>
      </div>
      <div class=row>
      <sc-icon-selector
        label="Icon"
        value=${iconName}
        @value-changed=${(e: CustomEvent) => {
    this.onChange(e.detail.value, 'iconName');
    this.requestUpdate();
  }}
      ></sc-icon-selector>
    </div>
    `;
  };

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

  renderBasicComponent = () => {
    return html`
      <form-tag .component=${this.component} .key=${this.key}>
      </form-tag>
    `;
  };
}