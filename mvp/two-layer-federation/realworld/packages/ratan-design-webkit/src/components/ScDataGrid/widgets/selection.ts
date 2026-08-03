import { html } from 'lit';
import { property } from 'lit/decorators.js';
import style, { classNamePrefix } from './selection.style.js';
import ScElement from '../../../shared/sc-element.js';
import ScTheme from '../../../styles/ScTheme.js';
import { StyleToolMixin } from '../mixins/style-tool-mixin.js';
import { classMap } from 'lit/directives/class-map.js';

export class ScDataGridSelectionCell extends StyleToolMixin(classNamePrefix)(
  ScElement
) {
  static styles = ScTheme.getStyles().concat([style]);

  @property({ type: Boolean, reflect: true }) checked?: boolean;
  @property({ type: Boolean, reflect: true }) indeterminate?: boolean;
  @property({ type: Boolean, reflect: true }) disabled?: boolean;
  @property({ type: Boolean, reflect: true }) hide?: boolean;
  @property({ type: Boolean, reflect: true }) radio = false;
  @property({ type: String, reflect: true, attribute: 'a11y-label' })
  a11yLabel?: string;

  handleClick() {
    this.checked = !this.checked;
    this.emit('sc-select', {
      detail: {
        value: this.checked,
      },
    });
  }
  
  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.stopDefaultEvent);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this.stopDefaultEvent);
  }

  render() {
    return html`<div
      class="${classMap({
        [this.makeClassName('root')]: true,
      })}"
    >
      ${this.radio
        ? html`<sc-radio
            ?disabled=${this.disabled}
            ?checked=${this.checked}
            @click=${this.handleClick}
          >
            <span class="sc-data-grid-a11y-only">${this.a11yLabel}</span>
          </sc-radio>`
        : html`<sc-checkbox
            ?disabled=${this.disabled}
            ?checked=${this.checked}
            ?indeterminate=${!this.checked && this.indeterminate}
            @sc-change=${this.handleClick}
          >
            <span class="sc-data-grid-a11y-only">${this.a11yLabel}</span>
          </sc-checkbox>`}
    </div>`;
  }
}
