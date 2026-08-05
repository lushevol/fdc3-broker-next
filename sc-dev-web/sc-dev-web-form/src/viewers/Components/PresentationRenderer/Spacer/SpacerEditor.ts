import { html } from 'lit';
import { BaseEditor } from '../../common/BaseEditor.js';

const Sizes = ['04', '08', '12', '16', '20', '24', '32', '40', '48', '56', '64'];
export class SpacerEditor extends BaseEditor {

  renderLabel = () => {};

  renderStyleAndLayout = () => {
    const { size } = this.component.template;
    return html`
      <div class=row>
        <sc-radio-group
          columns=4
          direction=horizontal
          label="Size"
          value=${size}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'size')}
        >
          ${
  Sizes.map((size: string) => html`<sc-radio value=${size}>${size}</sc-radio>`)
}
        </sc-radio-group>
      </div>
    `;
  };

  renderAlignment = () => {};

  getSpace() {
    const { size } = this.component.template;
    switch (size) {
    case '64':
      return 'var(--sc-spacing-64, 4rem)';
    case '56':
      return 'var(--sc-spacing-56, 3.5rem)';
    case '48':
      return 'var(--sc-spacing-48, 3rem)';
    case '40':
      return 'var(--sc-spacing-40, 2.5rem)';
    case '32':
      return 'var(--sc-spacing-32, 2rem)';
    case '24':
      return 'var(--sc-spacing-24, 1.5rem)';
    case '20':
      return 'var(--sc-spacing-20, 1.25rem)';
    case '16':
      return 'var(--sc-spacing-16, 1rem)';
    case '12':
      return 'var(--sc-spacing-12, 0.75rem)';
    case '08':
      return 'var(--sc-spacing-8, 0.5rem)';
    default:
      return 'var(--sc-spacing-4, 0.25rem)';
    }
  }

  renderBasicComponent = () => {
    return html`
      <style>
        .diagonal-gray-line {
          background: repeating-linear-gradient(
            48deg,
            var(--sc-color-grey-100),
            var(--sc-color-grey-100) 5px,
            transparent 5px,
            transparent 12px
          );
        }
      </style>
      <div style='text-indent:-9999px;font-size: ${this.getSpace()}' class='diagonal-gray-line'>${'<SPACER>'}</div>
      <div class=${this.component?.alignment}>
        ${this.renderConditionIcon()}
        ${this.renderHiddenIcon()}
        ${this.renderCommentsIcon()}
      </div>
    `;
  };
}