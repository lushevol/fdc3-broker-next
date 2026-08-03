import { html, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import ScTheme from '../../styles/ScTheme.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-tooltip.js';
import ScLabelStyle from './ScLabel.style.js';
import { LabelBase } from '../common/LabelBase.js';
import { HasSlotController } from '../../shared/slot.js';

const labelSizeMapping = {
  sm: '0.625rem',
  md: '0.75rem',
  lg: '0.875rem',
};
const labelLineHeightMapping = {
  sm: '1.125rem',
  md: '1.25rem',
  lg: '1.375rem',
};

/**
 * @summary Label is used to show label with text and tooltip.
 */

export class ScLabel extends LabelBase {
  static styles = ScTheme.getStyles().concat([ScLabelStyle]);

  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'label',
    'hint',
    'tooltip'
  );

  getIconSize() {
    //scale down 1 size
    let iconSize;
    switch (this.labelSize) {
      case 'sm':
        iconSize = 'xxs';
        break;
      case 'md':
        iconSize = 'xxs';
        break;
      case 'lg':
        iconSize = 'sm';
        break;
      default:
        iconSize = 'xxs';
        break;
    }
    return iconSize;
  }

  hasTrustPoint() {
    const sizes = ['lg'];
    return (
      this.hasPrimaryLabel && this.trustpoint && sizes.includes(this.labelSize)
    );
  }

  get hasPrimaryLabel() {
    return this.label.length > 0 || this.hasSlotController.test('label');
  }

  get hasLabel() {
    return this.hasPrimaryLabel;
  }
  get hasTootip() {
    return this.tooltip.length > 0 || this.hasSlotController.test('tooltip');
  }
  get hasHint() {
    return this.hint.length > 0 || this.hasSlotController.test('hint');
  }

  renderTooltips() {
    const klass = {
      'sc-label-tooltip': true,
      'no-label': !this.hasLabel,
    };

    return html` <div class=${classMap(klass)}>
      <sc-tooltip placement=${this.tooltipPlacement} trigger="hover" ?hoist=${true}>
        <slot slot="content" name="tooltip">${this.tooltip}</slot>
        <sc-icon
          name="info-circle--line"
          size="${this.getIconSize()}"
        ></sc-icon>
      </sc-tooltip>
    </div>`;
  }

  renderHint() {
    const klass = {
      'sc-label-hint': true,
    };

    return html` <div class=${classMap(klass)}>
      <sc-tooltip trigger="hover" placement=${this.hintPlacement} ?hoist=${true}>
        <slot slot="content" name="hint">${this.hint}</slot>
        <sc-icon name="light-bulb--fill" size="${this.getIconSize()}"></sc-icon>
      </sc-tooltip>
    </div>`;
  }

  renderPrimaryLabel() {
    return html`
      <div class="label-box">
        <slot class="label" name="label">
          <div class="sc-label-wrapper">
            <div class="sc-label-text">${this.label}</div>
          </div>
        </slot>
      </div>
    `;
  }

  get isOptional() {
    return this.hasLabel && !this.required;
  }

  render() {
    const labelSize = labelSizeMapping[this.labelSize as keyof typeof labelSizeMapping];
    const labelLineHeight = labelLineHeightMapping[this.labelSize as keyof typeof labelLineHeightMapping];
    const hasTrustPoint = this.hasTrustPoint();

    const labelBaseClass = {
      'sc-label-base': true,
      trustpoint: hasTrustPoint,
      'sc-truncate': this.truncate,
      'label-right': this.labelAlignment === 'right',
    };

    return html`
      <div
        class="sc-label"
        style="--sc-label-font-size: ${labelSize}; --sc-label-line-height: ${labelLineHeight};"
        part="sc-label-root"
      >
        <div class=${classMap(labelBaseClass)}>
          <div class="trust-point-prefix"></div>
          ${this.renderPrimaryLabel()}
          <div class="trust-point-suffix"></div>
          ${this.required 
            ? html`<span class=${classMap({
              required: true,
              'no-others': !this.hasLabel && !this.hasTootip,
            })}>*</span> ` 
            : null
          }
          ${this.hasTootip ? html` ${this.renderTooltips()} ` : nothing}
          ${this.hasHint ? html` ${this.renderHint()} ` : nothing}
          
          <slot name="tooltip"></slot>
          <slot name="hint"></slot>
        </div>
      </div>
    `;
  }
}
