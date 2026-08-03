import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { msg } from '@lit/localize';

import '../../../elements/sc-icon.js';
import '../../../elements/sc-tooltip.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import { ScTooltip } from '../ScTooltip/ScTooltip.js';
import ScCopyStyle from './ScCopy.style.js';
import { POSITION } from '../../shared/util.js';
import {
  getAnimation,
  setDefaultAnimation,
} from '../../shared/animation-registry.js';

/**
 * ScCopy can copy text data to the clipboard when user click the trigger.
 * @element sc-copy
 *
 * @slot copy-icon - The icon to show in the default copy state. Works best with `<sc-icon>`.
 * @slot success-icon - The icon to show when the content is copied. Works best with `<sc-icon>`.
 * @slot error-icon - The icon to show when a copy error occurs. Works best with `<sc-icon>`.
 */
export class ScCopy extends ScElement {
  static styles = ScTheme.getStyles().concat([ScCopyStyle]);

  @query('slot[name="label"]') copyIcon: HTMLSlotElement;
  @query('slot[name="copy-success"]') successIcon: HTMLSlotElement;
  @query('slot[name="copy-error"]') errorIcon: HTMLSlotElement;
  @query('sc-tooltip') tooltip: ScTooltip;

  @state() isCopying = false;
  @state() status: 'rest' | 'success' | 'error' = 'rest';

  /** The text value to copy. */
  @property() value = '';

  /**
   * An id that references an element in the same document from which data will be copied. If both this and `value` are
   * present, this value will take precedence. By default, the target element's `textContent` will be copied. To copy an
   * attribute, append the attribute name wrapped in square brackets, e.g. `from="el[value]"`. To copy a property,
   * append a dot and the property name, e.g. `from="el.value"`.
   */
  @property() from = '';

  /** Disables the copy button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Label when show in text mode. */
  @property({ attribute: 'label' }) label = '';

  /** A custom message to show in the tooltip. */
  @property({ attribute: 'help-text' }) helpText = '';

  /** A custom message to show in the tooltip after copying. */
  @property({ attribute: 'success-message' }) successMessage = '';

  /** A custom message to show in the tooltip when a copy error occurs. */
  @property({ attribute: 'error-message' }) errorMessage = '';

  /** The length of time to show feedback before restoring the default trigger. */
  @property({ attribute: 'feedback-duration', type: Number })
    feedbackDuration = 1000;

  /** The preferred placement of the tooltip. */
  @property({ attribute: 'tooltip-placement' }) tooltipPlacement: `${POSITION}` = 'top';

  @property({ type: String }) mode: 'default' | 'text' = 'default';

  public getValueForFrom() {
    let valueToCopy = this.value;
    const root = this.getRootNode() as ShadowRoot | Document;

    // Simple way to parse ids, properties, and attributes
    const isProperty = this.from.includes('.');
    const isAttribute = this.from.includes('[') && this.from.includes(']');
    let id = this.from;
    let field = '';

    if (isProperty) {
      // Split at the dot
      [id, field] = this.from.trim().split('.');
    } else if (isAttribute) {
      // Trim the ] and split at the [
      [id, field] = this.from.trim().replace(/]$/, '').split('[');
    }

    // Locate the target element by id
    const target = 'getElementById' in root ? root.getElementById(id) : null;

    if (target) {
      if (isAttribute) {
        valueToCopy = target.getAttribute(field) || '';
      } else if (isProperty) {
        // @ts-expect-error - deal with it
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        valueToCopy = target[field] || '';
      } else {
        valueToCopy = target.textContent || '';
      }
    } else {
      // No target
      this.showStatus('error');
    }
    return valueToCopy;
  }

  public async handleCopy() {
    if (this.disabled || this.isCopying) {
      return;
    }
    this.isCopying = true;

    // Copy the value by default
    let valueToCopy = this.value;

    // If an element is specified, copy from that instead
    if (this.from) {
      valueToCopy = this.getValueForFrom();
    }

    // No value
    if (!valueToCopy) {
      this.showStatus('error');
    } else {
      try {
        await navigator.clipboard.writeText(valueToCopy);
        this.showStatus('success');
      } catch (error) {
        // Rejected by browser
        this.showStatus('error');
      }
    }
  }

  private async showStatus(status: 'success' | 'error') {
    const helpText = this.helpText || msg('Copy content', { id: 'sc-copy-help-text' });
    const successMessage = this.successMessage || msg('Copied', { id: 'sc-copy-success-text' });
    const errorMessage = this.errorMessage || msg('Could not copy', { id: 'sc-copy-error-text' });
    const iconToShow = status === 'success' ? this.successIcon : this.errorIcon;
    const showAnimation = getAnimation(this, 'copy.in', { dir: 'ltr' });
    const hideAnimation = getAnimation(this, 'copy.out', { dir: 'ltr' });

    if (this.mode === 'default') {
      this.tooltip.content =
        status === 'success' ? successMessage : errorMessage;
    }

    // Show the feedback icon
    await this.copyIcon.animate(hideAnimation.keyframes, hideAnimation.options).finished;
    this.copyIcon.hidden = true;
    this.status = status;
    iconToShow.hidden = false;
    await iconToShow.animate(showAnimation.keyframes, showAnimation.options).finished;

    // After a brief delay, restore the original state
    setTimeout(async () => {
      await iconToShow.animate(hideAnimation.keyframes, hideAnimation.options).finished;
      iconToShow.hidden = true;
      this.status = 'rest';
      this.copyIcon.hidden = false;
      await this.copyIcon.animate(showAnimation.keyframes, showAnimation.options).finished;

      if (this.mode === 'default') {
        this.tooltip.content = helpText;
      }
      this.isCopying = false;
    }, this.feedbackDuration);
  }

  render() {
    const helpText = this.helpText || msg('Copy content', { id: 'sc-copy-help-text' });

    return this.mode === 'default'
      ? html`
          <sc-tooltip
            class=${classMap({
    'copy-button': true,
    'copy-button--success': this.status === 'success',
    'copy-button--error': this.status === 'error',
  })}
            placement=${this.tooltipPlacement}
            ?disabled=${this.disabled}
            trigger="hover"
          >
            <slot slot="content" name="help-text">${helpText}</slot>
            <button
              class="copy-button__button copy-button__icon"
              part="button"
              type="button"
              ?disabled=${this.disabled}
              @click=${this.handleCopy}
            >
              <slot part="copy-icon" name="label">
                <sc-icon name="copy--line"></sc-icon>
              </slot>
              <slot part="success-icon" name="copy-success" hidden>
                <sc-icon name="tick"></sc-icon>
              </slot>
              <slot part="error-icon" name="copy-error" hidden>
                <sc-icon name="cross"></sc-icon>
              </slot>
            </button>
          </sc-tooltip>
        `
      : html`
          <div
            class=${classMap({
    'copy-button': true,
    'copy-button--success': this.status === 'success',
    'copy-button--error': this.status === 'error',
  })}
          >
            <button
              class="copy-button__button copy-button__text"
              part="button"
              type="button"
              ?disabled=${this.disabled}
              @click=${this.handleCopy}
            >
              <slot part="copy-icon" name="label">
                <span>
                  ${this.label 
    ? this.label 
    : msg('Copy content', { id: 'sc-copy-help-text' })
}
                </span>
              </slot>
              <slot part="success-icon" name="copy-success" hidden>
                <span>
                  ${this.successMessage 
    ? this.successMessage 
    : msg('Copied', { id: 'sc-copy-success-text' })
}
                </span>
              </slot>
              <slot part="error-icon" name="copy-error" hidden>
                <span>
                  ${this.errorMessage
    ? this.errorMessage
    : msg('Could not copy', { id: 'sc-copy-error-text' })
}
                </span>
              </slot>
            </button>
          </div>
        `;
  }
}

setDefaultAnimation('copy.in', {
  keyframes: [
    { scale: '.25', opacity: '.25' },
    { scale: '1', opacity: '1' },
  ],
  options: { duration: 100 },
});

setDefaultAnimation('copy.out', {
  keyframes: [
    { scale: '1', opacity: '1' },
    { scale: '.25', opacity: '0' },
  ],
  options: { duration: 100 },
});
