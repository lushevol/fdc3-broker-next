import { msg } from '@lit/localize';
import { html, nothing } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-scrollbar.js';
import { cssUnitToPx } from '../../shared/css-unit.js';
import { debounce } from '../../shared/debounce.js';
import ScElement from '../../shared/sc-element.js';
import { DIRECTION, POSITION } from '../../shared/util.js';
import { watch } from '../../shared/watch.js';
import ScTheme from '../../styles/ScTheme.js';
import { ScStep } from './ScStep.js';
import ScStepperStyle from './ScStepper.style.js';

/**
 * ScStepper provides a steps.
 * @element sc-stepper
 *
 * @slot - Renders the step components inside default slot.
 *
 * @fires sc-active-step-changing - Emitted when the active step is about to change.
 * @fires sc-active-step-changed - Emitted when the active step is changed.
 */
export class ScStepper extends ScElement {
  static styles = ScTheme.getStyles().concat([ScStepperStyle]);

  public rect = { width: 0, height: 0 };

  @queryAssignedElements({ selector: 'sc-step' })
  public steps: Array<ScStep>;

  private activeStep: ScStep;

  @query('.sc-stepper')
  container: HTMLDivElement;

  @state() showExpandCollapse = false;

  @state() expanded = false;

  @property({ reflect: true }) direction: `${DIRECTION}` = DIRECTION.horizontal;

  @property({ reflect: true }) mode: 'indicator' | 'full' = 'full';

  @property({ type: Number, attribute: false }) current = -1;

  @property({ attribute: 'title-position' }) titlePosition: `${POSITION}` = POSITION.top;

  @property({ type: Boolean, reflect: true }) compact = false;

  // Vertical Stepper component can be expanded and collapsed based on the number of elements a user wants to see in the trail.
  @property({ type: Number, attribute: 'presence-numbers' })
  presenceNumbers = 0; // 0 means no configuration from the user, display all steps by default.

  @property({ type: String, attribute: 'min-horizontal-step-width' })
  minHorizontalStepWidth = '220px';

  @property({ type: String, attribute: 'min-horizontal-response', reflect: true })
  minHorizontalResponse: 'scroll' | 'vertical' = 'scroll';

  @watch('direction', { waitUntilFirstUpdate: true })
  directionChange(): void {
    this.titlePositionChange();
    this.steps.forEach(step => (step.direction = this.effectiveDirection));

    this.initExpandCollapse();
  }

  @watch('mode', { waitUntilFirstUpdate: true })
  modeChange(): void {
    this.steps.forEach((step: ScStep) => (step.mode = this.mode));
  }

  @watch('titlePosition', { waitUntilFirstUpdate: true })
  titlePositionChange(): void {
    const tpos = this.effectiveTitlePosition;
    this.steps.forEach(step => (step.titlePosition = tpos));
  }

  @watch('compact', { waitUntilFirstUpdate: true })
  compactChange(): void {
    this.syncProperties();
  }

  @watch('minHorizontalStepWidth')
  minHorizontalWidthChange(): void {
    let value = this._minHorWidth;
    if (/^\d+$/.test(this.minHorizontalStepWidth)) {
      value = parseFloat(this.minHorizontalStepWidth);
      this.minHorizontalStepWidth = `${value}px`;
    } else {
      value =
        cssUnitToPx(this.minHorizontalStepWidth, this, 'width') ||
        (this.container
          ? this.container.scrollWidth / this.steps.length
          : this.rect.width / 2);
    }
    if (value !== this._minHorWidth) {
      this._minHorWidth = value;
      this.stepsChanged();
    }
  }

  @watch('minHorizontalResponse')
  minHorizontalResponseChange(): void {
    if (!['vertical', 'scroll'].includes(this.minHorizontalResponse))
      this.minHorizontalResponse = 'scroll';
  }

  private _resizeObserver = new ResizeObserver(
    debounce(this._handleResize.bind(this), 100, {
      edges: ['leading', 'trailing'],
    })
  );
  private _minHorWidth = 0;

  constructor() {
    super();

    this.addEventListener('stepActiveChanged', (event: any) => {
      event.stopPropagation();
      this.activateStep(event.target, event.detail);
    });

    this.addEventListener('stepStatusChanged', (event: any) => {
      event.stopPropagation();
      this.preStatusUpdate(event.target);
    });
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tablist');
    this._resizeObserver.observe(this);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver.disconnect();
  }

  private get _isResponsive() {
    return this.direction === DIRECTION.horizontal &&
        this._minHorWidth * this.steps.length > this.rect.width;
  }

  get effectiveDirection(): keyof typeof DIRECTION {
    return this.minHorizontalResponse === DIRECTION.vertical &&
      this._isResponsive
      ? DIRECTION.vertical
      : this.direction === DIRECTION.horizontal
      ? DIRECTION.horizontal
      : DIRECTION.vertical;
  }
  get effectiveTitlePosition(): keyof typeof POSITION {
    if (this.effectiveDirection === DIRECTION.vertical) return POSITION.right;
    if (!Object.keys(POSITION).includes(this.titlePosition))
      return POSITION.bottom;
    return this.titlePosition;
  }

  private activateFirstStep() {
    const firstEnabledStep = this.steps.find((s: ScStep) => !s.disabled);
    if (firstEnabledStep) {
      this.activateStep(firstEnabledStep, false);
    }
  }

  private preStatusUpdate(step: ScStep) {
    if (step.index < this.steps.length - 1) {
      this.steps[step.index + 1].lastFinished = step.status === 'finish';
    }
  }

  private async activateStep(step: ScStep, shouldEmit = true) {
    if (step === this.activeStep) {
      return;
    }

    if (shouldEmit) {
      const args = {
        detail: {
          owner: this,
          oldIndex: this.activeStep.index,
          newIndex: step.index,
        },
        cancelable: true,
      };

      this.emit('sc-active-step-changing', args);

      this.changeActiveStep(step);

      this.emit('sc-active-step-changed', {
        detail: { 
          owner: this, 
          index: step.index, 
        },
      });
    } else {
      this.changeActiveStep(step);
    }
  }

  private changeActiveStep(step: ScStep) {
    if (this.activeStep) {
      this.activeStep.active = false;
    }
    step.active = true;
    this.activeStep = step;
    
    this.updateComplete.then(() => {
      this.container.scrollLeft =
        step.container.offsetLeft - (this.rect.width - this._minHorWidth) / 2;
    });
  }

  private syncProperties(): void {
    let lastFinished = false;
    const dir = this.effectiveDirection;
    const tpos = this.effectiveTitlePosition;
    this.steps.forEach((step: ScStep, index: number) => {
      step.direction = dir;
      step.mode = this.mode;
      step.compact = this.compact;
      step.titlePosition = tpos;
      step.index = index;
      step.active = this.activeStep === step;
      step.classList.add('sc-step');
      step.header?.setAttribute('aria-posinset', (index + 1).toString());
      step.header?.setAttribute('aria-setsize', this.steps.length.toString());
      step.header?.setAttribute('id', `sc-step-header-${index}`);
      step.style.setProperty('--indicator-size', this.compact 
        ? 'var(--indicator-size-compact)' 
        : 'var(--indicator-size-default)'
      );
      step.style.setProperty('--min-horizontal-item-width', this.minHorizontalStepWidth);
      if (index > 0) {
        step.lastFinished = lastFinished;
      }
      lastFinished = step.status === 'finish';
    });
  }

  private stepsChanged(): void {
    this.style.setProperty('--steps-count', this.steps.length.toString());

    const lastActiveStep = this.steps.reverse().find((step: ScStep) => step.active);
    if (!lastActiveStep) {
      // initially when there isn't a predefined active step or when the active step is removed
      this.activateFirstStep();
    } else {
      // activate the last active step
      this.activateStep(lastActiveStep, false);
    }
    this.syncProperties();
    this.initExpandCollapse();
  }

  initExpandCollapse() {
    this.showExpandCollapse = false;

    if (
      this.effectiveDirection === 'vertical' &&
      this.presenceNumbers > 0 &&
      this.presenceNumbers < this.steps.length
    ) {
      // Apply to vertical stepper only. If user sets the numbers and it's less than the total count, display 'Show more +'.
      this.showExpandCollapse = true;
      if (!this.expanded)
        this.showPartialStepper();
    } else if (this.expanded) {
      // Otherwise, hide the expand/collapse element.
      this.showEntireStepper();
    }
  }

  @watch('presenceNumbers', { waitUntilFirstUpdate: true })
  presenceNumbersChange(): void {
    this.initExpandCollapse();
  }

  protected firstUpdated(): void {
    this.initExpandCollapse();
  }

  private showPartialStepper() {
    this.showEntireStepper(); // reset to default
    const activeIndex = this.steps.findIndex((step: ScStep) => step.active);
    const start = activeIndex;
    const end = activeIndex + this.presenceNumbers - 1;
    for (let index = 0; index < this.steps.length; index++) {
      const element = this.steps[index];
      if (index >= start && index <= end) {
        element.style.setProperty('display', '');
      } else {
        element.style.setProperty('display', 'none');
      }
    }
  }
  private showEntireStepper() {
    this.steps.forEach(step => {
      step.style.removeProperty('display');
    });
  }

  toggleExpandCollapse() {
    this.expanded = !this.expanded;
    this.expanded ? this.showEntireStepper() : this.showPartialStepper();

    this.emit('sc-change', {
      detail: {
        expanded: this.expanded,
      },
    });
  }

  private async _handleResize(entries: ResizeObserverEntry[]) {
    const rect = entries.find(entry => entry.target === this)?.contentRect;
    if (!rect || this.rect.width === rect.width) return;
    this.rect = rect;
    if (this.direction === DIRECTION.horizontal) {
      this.minHorizontalWidthChange();
      this.requestUpdate();
      if (this.minHorizontalResponse === 'vertical')
        this.updateComplete.then(() => this.syncProperties());
      else if (this.activeStep)
        this.changeActiveStep(this.activeStep);
      
      this.hasUpdated || await this.updateComplete;
    }
  }


  private _scrollLeft = 0;
  private _mouseX: number | null = null;

  private _handleScrollEnd() {
    if (this._mouseX === null)
      this._scrollLeft = this.container.scrollLeft;
  }

  private _handleMouseDown(event: MouseEvent) {
    this._mouseX = event.clientX;
    this._scrollLeft = this.container.scrollLeft;
    this.container.classList.add('dragging');
  }
  private _handleMouseMove(event: MouseEvent) {
    if (this._mouseX === null) return;
    event.preventDefault();
    const left = this._scrollLeft + this._mouseX - event.clientX;
    this.container.scrollLeft = left;
  }
  private _handleMouseUp() {
    if (this._mouseX === null) return;
    const cur = this.container.scrollLeft;
    // get snapped scroll from applied css
    this.container.classList.remove('dragging');
    const left = this.container.scrollLeft;
    if (cur !== left && this.container.scrollTo) {
      // remove temporarily to allow smooth scroll
      this.container.classList.add('dragging');
      this.container.scrollLeft = cur;
      this.container.scrollTo({ left, behavior: 'smooth' });
      this.container.classList.remove('dragging');
    } else {
      this.container.scrollLeft = this._scrollLeft = left;
    }
    this._mouseX = null;
  }


  render() {
    const isHorScrollable = this._isResponsive && this.minHorizontalResponse === 'scroll';
    return html`
      <div
        class=${classMap({
          'sc-stepper': true,
          [this.effectiveDirection]: true,
          [`title-${this.effectiveTitlePosition}`]: true,
          [`mode-${this.mode}`]: true,
        })}
        @mousedown=${isHorScrollable ? this._handleMouseDown : nothing}
        @mouseup=${isHorScrollable ? this._handleMouseUp : nothing}
        @mouseleave=${isHorScrollable ? this._handleMouseUp : nothing}
        @mousemove=${isHorScrollable ? this._handleMouseMove : nothing}
        @dragstart=${(e: DragEvent) => e.preventDefault()}
        @scrollend=${isHorScrollable ? this._handleScrollEnd : nothing}
      >
        <slot @slotchange=${this.stepsChanged}></slot>
        <div
          class="expand-collapse ${!this.showExpandCollapse
            ? 'display-none'
            : 'display-block'}"
          @click=${this.toggleExpandCollapse}
        >
          <span>
            ${this.expanded
              ? msg('Show less', { id: 'sc-form-input-collapse-all' })
              : msg('Show more', { id: 'sc-form-input-expand-all' })}
          </span>
          <sc-icon
            size="sm"
            name="${this.expanded ? 'minus' : 'plus'}"
          ></sc-icon>
        </div>
      </div>
      <sc-scrollbar selector=".sc-stepper"></sc-scrollbar>
    `;
  }
}
