import { html, nothing } from 'lit';
import { property, query, queryAssignedElements } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScStepperStyle from './ScStepper.style.js';
import ScStepStyle from './ScStep.style.js';
import { watch } from '../../shared/watch.js';
import '../../../elements/sc-icon.js';
import { partNameMap, POSITION, DIRECTION, ICON_SIZE } from '../../shared/util.js';
import { HasSlotController } from '../../shared/slot.js';

/**
 * @summary Steps are used inside [stepper] to represent different steps.
 *
 *
 * @csspart base - The component's base wrapper.
 * @csspart title - The step's title.
 * @csspart time - The step's time.
 * @csspart description - The step's description.
 */
export class ScStep extends ScElement {
  static styles = ScTheme.getStyles().concat([ScStepperStyle, ScStepStyle]);

  @queryAssignedElements({ slot: 'title' })
  private _titleChildren!: Array<HTMLElement>;
  
  @query('[part~="title"]')
  private _titleDiv!: HTMLElement;

  @query('[part~="time"]')
  private _timeDiv!: HTMLElement;

  @query('[part~="description"]')
  private _descriptionDiv!: HTMLElement;

  @query('[part~="view"]')
  private _viewDiv!: HTMLElement;

  @query('[part~="header"]')
  public header!: HTMLElement;

  @query('[part~="header-container"]')
  public container: HTMLDivElement;

  @property({ reflect: true }) status: 'error' | 'process' | 'wait' | 'finish';

  @property({ attribute: 'title-position', reflect: true }) titlePosition: `${POSITION}` = POSITION.top;

  @property({ reflect: true }) direction: `${DIRECTION}` = DIRECTION.horizontal;

  @property({ attribute: false }) mode: 'indicator' | 'full' = 'full';

  @property({ attribute: false, type: Boolean }) lastFinished = false;

  @property({ reflect: true, type: Boolean }) active = false;

  @property({ reflect: true, type: Boolean }) disabled = false;

  @property({ attribute: false }) index = -1;

  @property({ attribute: false, reflect: true }) hovered = false;

  @property({ type: Boolean, reflect: true }) compact = false;

  @property({ type: String, attribute: 'title' }) title = '';

  @property({ type: String, attribute: 'time' }) time = '';

  @property({ type: Boolean, attribute: 'show-time', reflect: true }) showTime = false;

  @property({ type: String, attribute: 'description' }) description = '';

  @property({ type: Boolean, attribute: 'show-description', reflect: true }) showDescription = false;

  @property({ type: String, attribute: 'view-link' }) viewLink = '';

  @property({ type: Boolean, attribute: 'show-view', reflect: true }) showView = false;

  @property({ type: Boolean, attribute: 'flex-column' }) flexColumn = false;

  private readonly hasSlotController = new HasSlotController(
    this,
    'description',
    'title',
    'time',
    'view-link'
  );

  @watch('titlePosition', { waitUntilFirstUpdate: true })
  titlePositionChange() {
    this.setFlexColumn();
  }

  @watch('direction', { waitUntilFirstUpdate: true })
  directionChange() {
    this.setFlexColumn();
  }

  private setFlexColumn() {
    if (this.direction === 'horizontal' && (this.titlePosition === 'right' || this.titlePosition === 'left')) {
      this.setAttribute('flex-column', 'true'); // for the case of isolating title from the other texts.
    } else {
      this.setAttribute('flex-column', 'false');
    }
  }

  @watch('active', { waitUntilFirstUpdate: true })
  activeChange() {
    if (this.active) {
      this.dispatchEvent(
        new CustomEvent('stepActiveChanged', { bubbles: true, detail: false })
      );
    }
  }

  @watch('status', { waitUntilFirstUpdate: true })
  statusChange() {
    this.dispatchEvent(
      new CustomEvent('stepStatusChanged', { bubbles: true, detail: false })
    );
  }

  private handleClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.isAccessible) {
      this.dispatchEvent(
        new CustomEvent('stepActiveChanged', { bubbles: true, detail: true })
      );
    }
  }

  private handleHover(event: MouseEvent): void {
    event.stopPropagation();
    if (this.isAccessible) {
      this.hovered = true;
    }
  }

  private handleBlur(event: MouseEvent): void {
    event.stopPropagation();
    if (this.isAccessible) {
      this.hovered = false;
    }
  }

  get isAccessible(): boolean {
    return !this.disabled;
  }

  private get headerContainerParts() {
    return {
      'header-container': true,
      'last-finished': this.lastFinished,
      hovered: this.hovered,
      disabled: !this.isAccessible,
      // passed: this.passed,
      top: this.titlePosition === 'top',
      bottom: this.titlePosition === 'bottom' || (this.direction === 'horizontal' && !this.titlePosition),
      left: this.titlePosition === 'left',
      right: this.titlePosition === 'right' || (this.direction === 'vertical' && !this.titlePosition),
    };
  }

  checkEmpty() {
    if (this.mode === 'indicator') {
      return true;
    }

    const titleSlot = [...this.childNodes].filter((i: any) => i?.slot === 'title');
    const hasTitle = Boolean(this.title) || this._titleChildren.length > 0 || titleSlot.length > 0;
    const hasTime = this.showTime && (Boolean(this.time) || this.hasSlotController.test('time'));
    const hasDescription =
      this.showDescription && (Boolean(this.description) || this.hasSlotController.test('description'));
    const hasView = this.showView && (Boolean(this.viewLink) || this.hasSlotController.test('view-link'));

    return !hasTitle && !hasTime && !hasDescription && !hasView;
  }

  private get textParts() {
    return {
      text: true,
      empty: this.checkEmpty(),
    };
  }

  protected renderIndicator() {
    let iconName: any, iconSize: `${ICON_SIZE}` = 'md';
    let showNumber = true;
    switch (this.status) {
      case 'error':
        showNumber = false;
        iconName = 'cross';
        break;
      case 'finish':
        showNumber = false;
        iconName = 'tick';
        iconSize = 'sm';
        break;
      case 'process':
        break;
      default:
        break;
    }

    return html`
      <div class='sc-step-container'>
        ${when(this.direction === 'vertical',
    () => html`<div part='separator' class='sc-step-tail'></div>`,
    () => nothing
  )}
        <span part='indicator' class='sc-step-indicator'>
          ${when(this.compact,
    () =>
      html`<span class='sc-step-indicator-content'></span>`,
    () => nothing
  )}

          ${when(iconName && !this.compact,
    () =>
      html`
                <sc-icon
                  compact
                  name='${iconName}'
                  size='${iconSize}'
                ></sc-icon>
              `,
    () => nothing
  )}
          ${when(!iconName && !this.compact,
    () =>
      html`
                <span class='sc-step-indicator-content'>
                  ${showNumber ? this.index + 1 : nothing}
                </span>
              `,
    () => nothing
  )}
        </span>
      </div>
    `;
  }

  protected renderOptionalContents() {
    return html`
      ${this.showTime && (this.time || this.hasSlotController.test('time'))
        ? html`
            <div part='time' slot=time>
              <slot name=time>
                <span>${this.time.slice(0, 100)}</span>
              </slot>
            </div>
          `
        : null}

      ${this.showDescription && (this.description || this.hasSlotController.test('description'))
        ? html`
            <div part='description' slot=description>
              <slot name=description>
                <span>${this.description.slice(0, 200)}</span>
              </slot>
            </div>
          `
        : null}

      ${this.showView && (this.viewLink || this.hasSlotController.test('view-link'))
        ? html`
            <div part='view'>
              <slot name='view-link'>
                <a href=${this.viewLink} target="_blank">View</a>
              </slot>
            </div>
          `
        : null}
    `;
  }

  protected renderTextSection() {
    return html`
      <div part='${partNameMap(this.textParts)}'>
        <div part='title'>
          ${this.title ? html`<span>${this.title.slice(0, 100)}</span>` : html`<slot name='title'></slot>`}
        </div>
        ${this.direction === 'vertical' || (this.direction === 'horizontal' && !this.titlePosition) || this.titlePosition === 'bottom' || this.titlePosition === 'top'
          ? this.renderOptionalContents()
          : html``}
      </div>
    `;
  }

  render() {
    return html`
      <div part='${partNameMap(this.headerContainerParts)}'>
        <div
          part='header'
          tabindex='${this.active ? '0' : '-1'}'
          role='tab'
          aria-selected='${this.active}'
          @click=${this.handleClick}
          @mouseover=${this.handleHover}
          @mouseout=${this.handleBlur}
        >
          ${this.renderIndicator()} ${this.renderTextSection()}
        </div>
      </div>
      ${this.direction === 'horizontal' && (this.titlePosition === 'right' || this.titlePosition === 'left')
          ? html`
            <div class='optional-contents' part="${this.checkEmpty() ? 'empty' : ''}">${this.renderOptionalContents()}</div>
          `
          : html``}
    `;
  }
}
