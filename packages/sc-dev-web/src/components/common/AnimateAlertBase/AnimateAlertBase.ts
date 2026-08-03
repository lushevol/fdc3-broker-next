import { html } from 'lit';
import { property, query, queryAssignedElements } from 'lit/decorators.js';

import ScTheme from '../../../styles/ScTheme.js';
import ScElement from '../../../shared/sc-element.js';
import { watch } from '../../../shared/watch.js';
import { waitForEvent } from '../../../shared/event.js';
import AlertBaseStyle from './AnimateAlertBase.style.js';
import { getPositionFixedContainer } from '../../../shared/fixed-container.js';

export class AnimateAlertBase extends ScElement {

  static styles = ScTheme.getStyles().concat([AlertBaseStyle]);

  @property({ type: Boolean, reflect: true }) closable = false;

  @property({ type: Boolean, reflect: true }) open = false;

  @property({ type: Boolean, reflect: true, attribute: 'icon-hide' }) iconHide = false;

  @property({ type: String }) type: 'success'| 'warning' | 'error' | 'info' | 'disabled' | 'loading' = 'success';

  @property({ type: Number }) duration = 3000;

  @property({ type: Boolean }) truncate = false;

  @property({ type: String })
    placement: 'top' | 'bottom' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' = 'top';

  private _currentStack: AnimateAlertBase[] | undefined;

  private _animationEndController: AbortController | null = null;

  private autoHideTimeout: number;

  private timeoutStart: number;

  private timeoutRemaining: number;

  @query('.alert') base: HTMLElement;

  @queryAssignedElements({ selector: 'sc-button', slot: 'action' })
    actionButtons: Array<any>;

  override disconnectedCallback(): void {
    this.autoHideTimeout && clearTimeout(this.autoHideTimeout);
    super.disconnectedCallback();
    this._stackRemove();
  }

  firstUpdated() {
    this.base.hidden = !this.open;
    this.base.dataset.state = this.open ? 'open' : 'hidden';
  }

  /** Cancel any in-flight CSS animation and abort its waitForAnimation promise. */
  private _stopCurrentAnimation(): void {
    if (this._animationEndController) {
      this._animationEndController.abort();
      this._animationEndController = null;
    }
    // Temporarily disable CSS animation so a new one starts cleanly after reflow.
    this.base.style.animation = 'none';
  }

  /**
   * Apply a state change then re-enable CSS animations.
   * The momentary `animation: none` + forced reflow lets the browser restart
   * the keyframe even when transitioning between two animated states.
   */
  private _resetAndStartAnimation(fn: () => void): void {
    fn();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.base.offsetHeight; // force reflow to flush animation:none
    this.base.style.removeProperty('animation');
  }

  /**
   * Returns a promise that resolves when the current CSS animation ends.
   * A 300 ms fallback guards against cases where no animation fires
   * (e.g. `animation: none` set externally, or an unsupported property).
   */
  private _waitForAnimation(): Promise<void> {
    return new Promise<void>(resolve => {
      const ac = new AbortController();
      this._animationEndController = ac;

      const cleanup = () => {
        this._animationEndController = null;
        clearTimeout(fallbackTimer);
        resolve();
      };

      const fallbackTimer = window.setTimeout(cleanup, 300);

      this.base.addEventListener('animationend', cleanup, { once: true, signal: ac.signal });
      ac.signal.addEventListener('abort', () => { clearTimeout(fallbackTimer); resolve(); }, { once: true });
    });
  }

  setDuration() {
  }

  private restartAutoHide() {
    clearTimeout(this.autoHideTimeout);
    if (this.open && this.duration < Infinity) {
      this.timeoutRemaining = this.duration;
      this.timeoutStart = new Date().getTime();
      this.autoHideTimeout = window.setTimeout(() => this.hide(), this.duration);
    }
  }

  private handleCloseClick() {
    this.hide();
  }

  handleMouseOver() {
    if (this.duration < Infinity) {
      clearTimeout(this.autoHideTimeout);
      this.timeoutRemaining -= new Date().getTime() - this.timeoutStart;
      this.style.setProperty('--sc-animation-state', 'paused');
    }
  }

  handleMouseOut() {
    if (this.duration < Infinity) {
      clearTimeout(this.autoHideTimeout);
      this.timeoutStart = new Date().getTime();
      this.autoHideTimeout = window.setTimeout(() => this.hide(), this.timeoutRemaining);

      this.style.setProperty('--sc-animation-state', 'running');
    }
  }

  @watch('open', { waitUntilFirstUpdate: true })
  async handleOpenChange() {
    if (this.open) {
      // Show
      this.emit('sc-show');

      this._stopCurrentAnimation();
      this._stackPush();
      this.base.hidden = false;
      this._resetAndStartAnimation(() => { this.base.dataset.state = 'open'; });

      await this._waitForAnimation();

      if (this.duration < Infinity) {
        this.restartAutoHide();
      }
      this.setDuration();

      this.emit('sc-after-show');
    } else {
      // Hide
      this.emit('sc-hide');

      clearTimeout(this.autoHideTimeout);

      this._stopCurrentAnimation();
      this._resetAndStartAnimation(() => { this.base.dataset.state = 'hiding'; });

      await this._waitForAnimation();

      this.base.hidden = true;
      this.base.dataset.state = 'hidden';
      this._stackPop();

      this.emit('sc-after-hide');
    }
  }

  @watch('duration')
  handleDurationChange() {
    this.setDuration();
    this.restartAutoHide();
  }

  @watch('placement', { waitUntilFirstUpdate: true })
  assignStack() {
    const stack = getStackList(this, this.placement);
    if (this._currentStack === stack) return;
    this._stackPop();
    if (this.open) {
      this._stackPush();
    }
  }

  get stackIndex() {
    return this._currentStack?.indexOf(this) ?? -1;
  }

  private _stackPush() {
    const stack = getStackList(this, this.placement);
    if (stack?.indexOf(this) === -1) {
      this._updateOffsetFrom(stack);
      stack.push(this);
    }
    this._currentStack = stack || undefined;
  }
  private _stackPop() {
    const { p, stack } = this._stackRemove();
    if (p > -1 && stack) {
      // update all after the removed one
      stack
        .slice(p)
        .forEach((item, i) => item._updateOffsetFrom(stack.slice(0, p + i)));
    }
  }
  private _stackRemove() {
    const stack = this._currentStack;
    if (!stack) return { stack, p: -1 };
    const p = stack.indexOf(this);
    if (p > -1) stack.splice(p, 1);
    return { stack, p };
  }
  private _updateOffsetFrom(list: AnimateAlertBase[]) {
    const gap = list.length / 2;
    const height = list.reduce((t, el) => el.base.offsetHeight + t, 0);
    if (this.placement.startsWith('top')) {
      this.base.style.marginTop = `calc(${height}px + ${gap}rem)`;
      this.base.style.removeProperty('margin-bottom');
    } else {
      this.base.style.marginBottom = `calc(${height}px + ${gap}rem)`;
      this.base.style.removeProperty('margin-top');
    }
  }


  /** Shows the alert. */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, 'sc-after-show');
  }

  /** Hides the alert */
  async hide() {
    if (!this.open) {
      return undefined;
    }

    this.open = false;
    return waitForEvent(this, 'sc-after-hide');
  }

  renderIcon() {
    return html`<slot name="icon"></slot>`;
  }

  renderMessage() {
    return html`<slot></slot>`;
  }

  renderCloseIcon() {
    return html`
      <sc-icon name='cross' size='md'></sc-icon>
    `;
  }

  renderDelimiter() {
    return html`<slot name='delimiter'></slot>`;
  }

  renderButtons() {
    return html``;
  }

  formatAction() {

  }

  classes() {
    return '';
  }

  render() {
    return html`
      <div
        class='
          ${this.classes()}
          alert
          alert--${this.type}
          ${this.open ? 'open' : ''}
          ${this.closable ? 'closable' : ''}
          ${this.placement}
          ${this.truncate ? 'sc-truncate' : ''}
        '
        part='base'
        role='alert'
        aria-hidden=${!this.open}
        @mouseenter=${this.handleMouseOver}
        @mouseleave=${this.handleMouseOut}
      >
        ${!this.iconHide ? html`
          <div part="icon" class="alert-icon ${this.type}">
            <slot name='icon'>
              ${this.renderIcon()}
            </slot>
          </div>
        ` : null}
        <div part="message" class="alert-message" aria-live="polite">
          ${this.renderMessage()}
        </div>
        <slot name='action' @slotchange=${this.formatAction} style="height:100%">
          ${this.renderButtons()}
        </slot>
        ${this.renderDelimiter()}
        ${this.closable ? html`
          <div part='close-icon' class='close-icon' @click=${this.handleCloseClick}>
            <slot name='close-icon'>${this.renderCloseIcon()}</slot>
          </div>
        ` : null}
      </div>
    `;
  }
}


const stacksKey = Symbol('__scAniAlertStacks');

function getStackList(el: HTMLElement, placement: string): AnimateAlertBase[] {
  const container = getPositionFixedContainer(el) as any;
  return (container[stacksKey] ??= {})[placement] ??= [];
}
