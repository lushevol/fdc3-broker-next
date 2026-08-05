import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SlDetails from '@shoelace-style/shoelace/dist/components/details/details.component.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-tooltip.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import { COMPACT_SIZE, ICON_ALIGN } from '../../shared/util.js';

export class ScAccordion extends ScElement {
  static styles = ScTheme.getStyles();

  static get scopedElements() {
    return {
      'sl-details': SlDetails,
    };
  }

  @property({ type: String }) summary = '';

  @property({ type: Number, attribute: 'summary-line' }) summaryLine = 0;

  @property({ attribute: 'icon-position' }) iconPosition: `${ICON_ALIGN}` = ICON_ALIGN.right;

  @property({ type: String, attribute: 'sub-summary' }) subSummary = '';

  @property({ type: String }) tooltip = '';

  @property({ type: Boolean }) border = false;

  @property({ attribute: 'label-size' }) labelSize: `${COMPACT_SIZE}` = COMPACT_SIZE.sm;

  @property({ type: Boolean, attribute: false }) first = false;

  @property({ type: Boolean, attribute: false }) last = false;

  @property({ type: Boolean }) open = false;

  @property({ type: Boolean, reflect: true }) disabled = false;

  renderCustomStyle() {
    const baseStyle = html`
      <style>
        .sc-accordion.border {
          border-top: 1px solid
            var(--sc-accordion-divider-color, var(--sc-color-grey-150));
          border-right: 1px solid
            var(--sc-accordion-divider-color, var(--sc-color-grey-150));
          border-left: 1px solid
            var(--sc-accordion-divider-color, var(--sc-color-grey-150));
          border-bottom-right-radius: var(--sc-radius-sm, 6px);
          border-bottom-left-radius: var(--sc-radius-sm, 6px);
          border-bottom: 1px solid
            var(--sc-accordion-divider-color, var(--sc-color-grey-150));
        }
        .sc-accordion.first {
          border-top-left-radius: var(--sc-radius-sm, 6px);
          border-top-right-radius: var(--sc-radius-sm, 6px);
        }
        .sc-accordion::part(summary) {
          margin-left: ${this.iconPosition === 'left' ? '0.625rem' : '0'};
          width: 100%;
        }
        .sc-accordion .summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .sc-accordion .title {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: ${this.summaryLine};
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.375rem;
        }
        .sc-accordion.md .title {
          font-size: 1rem;
        }
        .sc-accordion.lg .title {
          font-size: 1.25rem;
        }
        .sc-accordion .sub-title {
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.75rem;
          line-height: 1.25rem;
          color: var(--sc-accordion-sub-title-color, var(--sc-color-grey-500));
        }
        .sc-accordion .label-content {
          font-size: 0.875rem;
          line-height: 1.375rem;
          white-space: nowrap;
          color: var(--sc-accordion-label-color, var(--sc-color-blue-700));
        }
        .sc-accordion::part(header):focus {
          outline: 0;
        }
        .sc-accordion::part(base) {
          color: var(--sc-accordion-title-color, var(--sc-color-blue-900));
          border: none;
          border-radius: 0;
          background-color: var(--sc-accordion-background-color, transparent);
          padding: 0 0 0.75rem;
        }
        .sc-accordion::part(summary-icon) {
          color: var(--sc-accordion-icon-color, var(--sc-color-blue-900));
          rotate: none;
          align-self: center;
          order: ${this.iconPosition === 'left' ? '-1' : '1'};
        }
        .sc-accordion:not(.border)::part(header) {
          padding: 0 6px 12px 6px;
          border-bottom: 1px solid
            var(--sc-accordion-divider-color, var(--sc-color-grey-150));
        }
        .sc-accordion:.border::part(header) {
          padding: 0.75rem 1.5rem;
          border-bottom: 0
        }
        .sc-accordion::part(content) {
          padding: 0.8rem;
          font-weight: 400;
          font-size: 0.875rem;
          color: var(--sc-accordion-content-color, var(--sc-color-blue-900));
        }
        .sc-accordion:.border::part(content) {
          padding: 1.5rem;
        }
      </style>
    `;

    return html` ${baseStyle} `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateStyle();
  }

  updateStyle() {
    const whenAllDefined = Promise.all([
      customElements.whenDefined('sl-details'),
    ]);

    this.updateComplete.then(() => {
      whenAllDefined.then(() => {
        if (this.previousElementSibling?.tagName !== 'SC-ACCORDION') {
          this.first = true;
        }
        if (this.nextElementSibling?.tagName !== 'SC-ACCORDION') {
          this.last = true;
        }
      });
    });
  }

  render() {
    return html`
      ${this.renderCustomStyle()}
      <sl-details
        class=${classMap({
          'sc-accordion': true,
          border: this.border,
          first: this.first,
          last: this.last,
          [this.labelSize]: true,
        })}
        .open=${this.open}
        .disabled=${this.disabled}
        @sl-show=${(event: CustomEvent) => {
    this.stopDefaultEvent(event);
    this.open = true;
    this.emit('sc-show', {
      detail: {
        open: true,
      },
    });
  }}
        @sl-hide=${(event: CustomEvent) => {
    this.stopDefaultEvent(event);
    this.open = false;
    this.emit('sc-hide', {
      detail: {
        open: false,
      },
    });
  }}
      >
        <sc-icon
          compact
          name='arrow-ios-forward'
          slot='expand-icon'
          size='sm'
          style='display: flex'
        ></sc-icon>
        <sc-icon
          compact
          name='arrow-ios-downward'
          slot='collapse-icon'
          size='sm'
          style='display: flex'
        ></sc-icon>
        <div class='summary' slot='summary'>
          <div class='title-content'>
            <div class="sub-title">${this.subSummary}</div>
            <div style="display:flex">
              <div class="title" style="margin-right:0.5rem">
                <slot name="summary">${this.summary}</slot>
              </div>
              <sc-tooltip
                trigger="hover"
                style="display: ${this.tooltip
                  ? 'inline-flex'
                  : 'none'}"
                content=${this.tooltip}
              >
                <sc-icon name="info-circle--line" size="xxs" style='color: var(--sc-color-blue-500)'> </sc-icon>
              </sc-tooltip>
            </div>
          </div>
          <div class='label-content'>
              <slot name='label-content'></slot>
          </div>
        </div>
        <slot></slot>
      </sl-details>
    `;
  }
}
