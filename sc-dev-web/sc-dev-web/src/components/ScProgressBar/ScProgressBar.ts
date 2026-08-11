import { html } from 'lit';
import { property } from 'lit/decorators.js';
import SlProgressBar from '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.component.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScProgressBarStyle from './ScProgressBar.style.js';
import { COMPACT_SIZE } from '../../shared/util.js';

export class ScProgressBar extends ScElement {
  constructor() {
    super();
  }

  @property() size: `${COMPACT_SIZE}` = COMPACT_SIZE.sm;

  @property({ type: String }) type:
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'disabled' = 'success';

  private _value = '0';

  @property({ type: String })
  get value(): string {
    return this._value;
  }
  set value(newValue: string) {
    const numValue = Math.max(0, Math.min(100, Number(newValue)));
    this._value = numValue.toString();
    this.requestUpdate('value', this._value);
  }

  @property({ type: Boolean, reflect: true }) indeterminate = false;

  @property({ type: Boolean, attribute: 'show-label' }) showLabel = false;

  static styles = ScTheme.getStyles().concat([ScProgressBarStyle]);

  static get scopedElements() {
    return {
      'sl-progress-bar': SlProgressBar,
    };
  }

  getLineHeight() {
    switch (this.size) {
      case 'lg':
        return 'var(--sc-line-width-8, 8px)';
      case 'md':
        return 'var(--sc-line-width-4, 4px)';
      case 'sm':
      default:
        return 'var(--sc-line-width-2, 2px)';
    }
  }

  render() {
    return html`
      <div class='sc-progress-bar'>
      ${this.showLabel ? (this.indeterminate ? html`<slot class='label' name='label'></slot>` :
          html`<slot class='label' name='label'>${this.value}%</slot>`) : null}
        <sl-progress-bar
          class='progress-bar ${this.type}'
          .value=${this.value}
          ?indeterminate=${this.indeterminate}
          style='--height: ${this.getLineHeight()};'
        >
        </sl-progress-bar>
        <slot class='help-text'></slot>
      </div>
    `;
  }
}
