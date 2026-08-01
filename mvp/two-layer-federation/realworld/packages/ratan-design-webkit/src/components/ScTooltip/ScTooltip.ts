import { html, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';

import SlTooltip from '@shoelace-style/shoelace/dist/components/tooltip/tooltip.component.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import ScTheme from '../../styles/ScTheme.js';
import { POSITION } from '../../shared/util.js';
import {
  tooltipStyle,
  lightModeStyle,
  successModeStyle,
  warningModeStyle,
  errorModeStyle,
  primaryModeStyle,
  glassyModeStyle,
} from './ScTooltip.style.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

enum TRIGGER_TYPE {
  click = 'click',
  hover = 'hover',
  manual = 'manual',
}

enum MODE {
  dark = 'dark',
  light = 'light',
  success = 'success',
  warning = 'warning',
  error = 'error',
  primary = 'primary',
  glassy = 'glassy',
}

export class ScTooltip extends ScopedElementsMixin(LitElement) {
  static styles = ScTheme.getStyles();

  static get scopedElements() {
    return {
      'sl-tooltip': SlTooltip,
    };
  }

  @property() placement: `${POSITION}` = POSITION.top;

  @property() trigger: `${TRIGGER_TYPE}` = TRIGGER_TYPE.click;

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property() mode: `${MODE}` = MODE.dark;

  @property({ type: Boolean, reflect: true }) open = false;

  @property({ type: String }) content = '';

  @property({ attribute: 'content-max-width', type: String }) contentMaxWidth =
    '144px';

  @property({ type: Number, attribute: 'hover-show-delay' }) hoverShowDelay = 0;

  @property({ type: Number, attribute: 'hover-hide-delay' }) hoverHideDelay = 150;
  
  @property({ type: Number }) distance = 10;

  @property({ type: Number }) skidding = 0;

  @property({ type: String }) header = '';

  @property({ type: Boolean }) hoist = false;

  @query('sl-tooltip') tooltip: SlTooltip;

  renderTooltipStyle() {
    let styles = '';

    switch (this.mode) {
      case 'light':
        styles = `${lightModeStyle}`;
        break;
      case 'success':
        styles = `${successModeStyle}`;
        break;
      case 'warning':
        styles = `${warningModeStyle}`;
        break;
      case 'error':
        styles = `${errorModeStyle}`;
        break;
      case 'primary':
        styles = `${primaryModeStyle}`;
        break; 
      case 'glassy':
        styles = `
        :host{
          --sc-tooltip-animation-show-name: glassy-${this.placement}-show;
          --sc-tooltip-animation-hide-name: glassy-${this.placement}-hide;
        }
        ${glassyModeStyle}
        `;
        break; 
    }

    return html`<style>
      ${tooltipStyle} ${styles}
    </style>`;
  }

  renderHeader() {
    return html` ${when(
      this.header,
      () => {
        return html`<p class="header">${this.header}</p>`;
      },
      () => nothing
    )}`;
  }

  reposition() {
    const tooltipEle = this.shadowRoot?.querySelector('sl-tooltip');
    const popupEle = tooltipEle?.shadowRoot?.querySelector('sl-popup');
    const position = popupEle?.getAttribute('data-current-placement');
    if (position) {
      tooltipEle?.setAttribute('data-current-placement', position);
    }
  }

  show() {
    this.open = true;
  }
  hide() {
    this.open = false;
  }

  render() {
    const contentClass = this.mode === 'glassy' ? classMap({
      'glassy-tooltip-content-wrapper': true,
      'glassy-show': this.open, 
      'glassy-hide': !this.open,
      blur: true,
    }) : '';
    return html`
      ${this.renderTooltipStyle()}
      <sl-tooltip
        class="sc-tooltip"
        part="base"
        style=${styleMap({
          '--max-width': this.contentMaxWidth,
          '--show-delay': this.hoverShowDelay,
          '--hide-delay': this.hoverHideDelay,
        })}
        placement=${this.placement}
        trigger=${this.trigger}
        distance=${this.distance}
        skidding=${this.skidding}
        ?disabled=${this.disabled}
        ?open=${this.open}
        ?hoist=${this.hoist}
        @sl-show=${(e: Event) => {
          this.open = true;
          e.stopPropagation();
        }}
        @sl-hide=${(e: Event) => {
          this.open = false;
          e.stopPropagation();
        }}
        @sl-after-hide=${(e: Event) => e.stopPropagation()}
        @sl-reposition=${this.reposition}
      >
        <div slot="content" class=${contentClass}>
          <slot name="header">${this.renderHeader()}</slot>
          <slot name="content">${this.content}</slot>
        </div>
        <span class="container" part=container>
          <slot></slot>
        </span>
      </sl-tooltip>
    `;
  }
}
