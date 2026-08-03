import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { watch } from '../../shared/watch.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import ScTabStyle from './ScTab.style.js';
import { when } from 'lit/directives/when.js';
import { EASING } from '../../shared/animation.js';

let id = 0;

/**
 * Symbol for tabs to use to animate their indicators based off another tab's
 * indicator.
 */
export const INDICATOR = Symbol('indicator');

/**
 * Symbol used by the tab bar to request a tab to animate its indicator from a
 * previously selected tab.
 */
export const ANIMATE_INDICATOR = Symbol('animateIndicator');

/**
 * @summary Tabs are used inside [tab groups] to represent and activate [tab panels].
 *
 * @slot - The tab's label.
 *
 * @csspart base - The component's base wrapper.
 */

export class ScTab extends ScElement {
  static styles = ScTheme.getStyles().concat([ScTabStyle]);

  private readonly attrId = ++id;
  private readonly componentId = `sc-tab-${this.attrId}`;

  @query('.tab') tab: HTMLElement;
  @query('.indicator') readonly [INDICATOR]!: HTMLElement | null;

  /** The name of the tab panel this tab is associated with. The panel must be located in the same tab group. */
  @property({ reflect: true }) panel = '';

  @property({ type: Boolean, reflect: true }) closable = false;

  /** Draws the tab in an active state. */
  @property({ type: Boolean, reflect: true }) active = false;

  /** Disables the tab and prevents selection. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Disables the tab and prevents selection. */
  @property({ type: Boolean, attribute: false }) noActiveBottomLine = false;

  /** Draws the tab in an error state. */
  @property({ type: Boolean, reflect: true }) error = false;

  /** Add icon in tab. */
  @property({ reflect: true }) icon?: string;

  /** Add counter text in tab. */
  @property({ type: Number, reflect: true }) counter?: number;

  /** Change Tab styles as per type. */
  @property({ type: String, reflect: true }) type:
    | 'filled'
    | 'outline'
    | 'segmented' = 'outline';

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'tab');
  }

  @watch('active')
  handleActiveChange() {
    this.setAttribute('aria-selected', this.active ? 'true' : 'false');
  }

  @watch('disabled')
  handleDisabledChange() {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  /** Sets focus to the tab. */
  focus(options?: FocusOptions) {
    this.tab.focus(options);
  }

  /** Removes focus from the tab. */
  blur() {
    this.tab.blur();
  }

  handleClose(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.emit('sc-close', {
      bubbles: true,
      detail: {
        tab: this,
        name: this.panel,
      },
    });
  }

  renderClosable() {
    return html` ${when(
      this.closable,
      () =>
        html` <sc-icon
          @click=${this.handleClose}
          name="cross"
          customSize="16"
        ></sc-icon>`
    )}`;
  }

  renderTabIcon() {
    return html` ${when(
      this.icon,
      () =>
        html` <sc-icon
          class="icon"
          customSize="16"
          name=${this.icon}
        ></sc-icon>`
    )}`;
  }

  renderTabCounter() {
    return html` ${when(
      this.counter,
      () => html` <span class="counter">${this.counter}</span>`
    )}`;
  }

  render() {
    // If the user didn't provide an ID, we'll set one so we can link tabs and tab panels with aria labels
    this.id = this.id.length > 0 ? this.id : this.componentId;

    const baseClass = classMap({
      tab: true,
      'tab-active': this.active,
      'tab-disabled': this.disabled,
      'tab-no-active-bottom-line': this.noActiveBottomLine,
      'tab-error': this.error,
      [this.type]: true,
    });
    const indicator = html`<div class="indicator"></div>`;

    return html`
      <div
        part="base"
        class=${baseClass}
        tabindex=${this.disabled ? '-1' : '0'}
      >
        <div class="tab-content">
          ${this.renderTabIcon()}
          <slot></slot>
          ${this.renderTabCounter()}
        </div>
        ${this.renderClosable()}
        ${ indicator }
      </div>
      
    `;
  }
  [ANIMATE_INDICATOR](previousTab: ScTab) {
    if (!this[INDICATOR] || !this[INDICATOR].getAnimations) {
      return;
    }
    this[INDICATOR].getAnimations().forEach(a => {
      a.cancel();
    });
    const frames = this.getKeyframes(previousTab);
    if (frames !== null) {
      this[INDICATOR].animate(frames, {
        duration: 250,
        easing: EASING.EMPHASIZED_EASE_OUT,
      });
    }
  }
  private getKeyframes(previousTab: ScTab) {
    const reduceMotion = shouldReduceMotion();
    if (!this.active) {
      return reduceMotion ? [{ opacity: 1 }, { transform: 'none' }] : null;
    }

    const from: Keyframe = {};
    const fromRect =
      previousTab[INDICATOR]?.getBoundingClientRect() ?? ({} as DOMRect);
    const fromPos = fromRect.left;
    const fromExtent = fromRect.width;
    const toRect = this[INDICATOR]!.getBoundingClientRect();
    const toPos = toRect.left;
    const toExtent = toRect.width;
    const scale = fromExtent / toExtent;
    if (
      !reduceMotion &&
      fromPos !== undefined &&
      toPos !== undefined &&
      !isNaN(scale)
    ) {
      from['transform'] = `translateX(${(fromPos - toPos).toFixed(
        4,
      )}px) scaleX(${scale.toFixed(4)})`;
    } else {
      from['opacity'] = 0;
    }
    // note, including `transform: none` avoids quirky Safari behavior
    // that can hide the animation.
    return [from, { transform: 'none' }];
  }
}
// Check if the 'Reduce Animation' option is enabled in the user's system settings
function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}