import { html, LitElement, nothing, PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { debounce } from '../../shared/debounce.js';
import ScElement from '../../shared/sc-element.js';
import { synchronizedScroll } from '../../shared/synchronized-scroll.js';
import { watch } from '../../shared/watch.js';
import ScTheme from '../../styles/ScTheme.js';
import { externalStyles, styles } from './Scrollbar.style.js';

const extStyleSheet = externalStyles.styleSheet as CSSStyleSheet;

export class ScScrollbar extends ScElement {
  static styles = ScTheme.getStyles().concat([styles]);

  /** Query selector for scrollable element. If blank string, selects next sibling element. */
  @property({ type: String })
  selector?: string;

  /** Forcefully disables vertical scrolling. Otherwise takes the value of `overflow-y`. */
  @property({ type: Boolean, attribute: 'no-y' })
  noY = false;

  /** Forcefully disables horizontal scrolling. Otherwise takes the value of `overflow-x`. */
  @property({ type: Boolean, attribute: 'no-x' })
  noX = false;

  /** Makes the background color not transparent. */
  @property({ type: Boolean })
  opaque = false;

  /** Preset size of scrollbar. Blank or invalid values sets to default size. */
  @property({ type: String })
  size: 'sm' | 'xs' | 'lg' | 'xl' | '' = '';

  /** Show border on the scrollbars */
  @property({ type: Boolean })
  border = false;

  /** Round the corners of the scrollbars */
  @property({ type: Boolean })
  round = false;

  /** Gutter behaviour */
  @property({ type: String, reflect: true })
  gutter: '' | 'none' | 'auto' | 'stable' | 'stable-both' = 'auto';

  /** Disable auto-hide */
  @property({ type: Boolean, attribute: 'always-visible' })
  alwaysVisible = false;

  /** Display as block */
  @property({ type: Boolean, reflect: true })
  block = false;

  /** Removes the corner part to make resizer visible */
  @property({ type: Boolean })
  resizer = false;

  /** Additional selector for elements to only sync scrolls with.
   * If **selector** is not set, you will have to be manually position this element. */
  @property({ type: String, attribute: 'sync-selector-all' })
  syncSelectorAll?: string;

  @query('[part="container"]') private _container: HTMLElement;
  @query('slot') private _slotElement: HTMLSlotElement;

  @state() private _yScrollRatio = 0;
  @state() private _xScrollRatio = 0;
  @state() private _isAnimating = false;

  private get _hasY() {
    return !this.noY && this._yScrollRatio > 1.0;
  }
  private get _hasX() {
    return !this.noX && this._xScrollRatio > 1.0;
  }

  private _resizeObserver = new ResizeObserver(
    debounce(this._updateSizes.bind(this), 33, {
      edges: ['leading', 'trailing'],
    })
  );
  private _mutateObserver = new MutationObserver(
    debounce(this._updateSizes.bind(this), 33, {
      edges: ['leading', 'trailing'],
    })
  );
  private _target?: HTMLElement;
  private _syncElements?: HTMLElement[];
  private _parent?: HTMLElement;
  private _unsyncScrolls?: () => void;
  private _transitionCleanup?: () => void;

  @watch(['selector', 'syncOnly', 'opaque'], { waitUntilFirstUpdate: true })
  handleSelectorChanged(): void {
    const root = this.getRootNode() as ShadowRoot | Document;

    const syncElements: HTMLElement[] = [];
    if (this.syncSelectorAll) {
      syncElements.push(
        ...Array.from(root.querySelectorAll<HTMLElement>(this.syncSelectorAll))
      );
    }

    const slots = this._slotElement.assignedElements();
    let target: typeof this._target;
    if (slots.length > 0) {
      target = slots[0] as HTMLElement;
    } else if (this.selector === '') {
      target = this.nextElementSibling as HTMLElement;
    } else if (this.selector) {
      target = root?.querySelector<HTMLElement>(this.selector) ?? undefined;
    }
    if (target) {
      if (!syncElements.includes(target)) syncElements.push(target);
    } else {
      target = syncElements.find(el => el.tagName !== 'SC-SCROLLBAR');
    }

    // clean previous sync
    if (this._syncElements?.length) {
      this._resizeObserver.disconnect();
      this._mutateObserver.disconnect();
      this._unsyncScrolls?.();
      this._syncElements.splice(0, this._syncElements.length).forEach(el => {
        if (el.tagName === 'SC-SCROLLBAR') {
          el.removeEventListener('sc-show', this.handleScScrollbarShow);
          this.removeEventListener(
            'sc-show',
            (el as ScScrollbar).handleScScrollbarShow
          );
          el.removeEventListener('sc-hide', this.handleScScrollbarShow);
          this.removeEventListener(
            'sc-hide',
            (el as ScScrollbar).handleScScrollbarShow
          );
        }
      });
      this._target?.classList.remove('-sc-scroll-target');
      this._target?.removeEventListener('mouseenter', this.handleMouseEnter);
      this._target?.removeEventListener('mouseleave', this.hide);
    }

    // new sync
    this._target = target;
    this._syncElements = syncElements;
    if (target) {
      if (this._hasSelectorTarget) {
        target.classList.add('-sc-scroll-target');
        target.addEventListener('mouseenter', this.handleMouseEnter);
        target.addEventListener('mouseleave', this.hide);
        
        this._resizeObserver.observe(target);
        this._mutateObserver.observe(target, {
          attributes: true,
          childList: true,
          subtree: true,
        });
        this._updateSizes();
        this.sync();
      }

      syncElements.forEach(el => {
        if (el.tagName === 'SC-SCROLLBAR') {
          const els = el as ScScrollbar;
          // check if el is not already syncing this, avoid circular references
          if (!els._syncElements?.includes(this)) {
            el.addEventListener('sc-show', this.handleScScrollbarShow);
            this.addEventListener(
              'sc-show',
              (el as ScScrollbar).handleScScrollbarShow
            );
            el.addEventListener('sc-hide', this.handleScScrollbarShow);
            this.addEventListener(
              'sc-hide',
              (el as ScScrollbar).handleScScrollbarShow
            );
          }
        }
      });

      this._unsyncScrolls = synchronizedScroll(
        [
          ...syncElements,
          ...Array.from(
            this.shadowRoot?.querySelectorAll<HTMLElement>(
              '.scroller, .fake-scroller'
            ) ?? []
          ),
        ],
        debounce(
          () => {
            if (!target) return;
            const { overflowY, overflowX } = getComputedStyle(target);
            const yRatio =
              overflowY === 'auto' || overflowY === 'scroll'
                ? target.scrollHeight / target.clientHeight
                : 0;
            const xRatio =
              overflowX === 'auto' || overflowX === 'scroll'
                ? target.scrollWidth / target.clientWidth
                : 0;
            if (
              yRatio !== this._yScrollRatio ||
              xRatio !== this._xScrollRatio
            ) {
              if (!isNaN(yRatio)) this._yScrollRatio = yRatio;
              if (!isNaN(xRatio)) this._xScrollRatio = xRatio;
              this._emitChange();
            }
          },
          2000,
          { edges: ['leading'] }
        )
      );
      this.handleGutterChanged();
    } else {
      console.warn(
        'ScScrollbar: No scrollable element selected or synced with.',
        this
      );
    }

    if (this._hasSelectorTarget) {
      let parent = (target?.offsetParent as HTMLElement) || undefined;
      if (
        !parent &&
        target?.parentElement &&
        !target.parentElement.shadowRoot
      ) {
        if (getComputedStyle(target?.parentElement).display !== 'contents')
          parent = target.parentElement;
      }
      if (parent !== this._parent || !this._parent) {
        // clean previous
        if (this._parent) {
          this._parent.style.removeProperty('position');
        }
        if (parent) {
          parent.style.setProperty('position', 'relative');
          this._resizeObserver.observe(parent);
        }
        this._parent = parent;
      }
    }
  }

  @watch('gutter', { waitUntilFirstUpdate: true })
  handleGutterChanged(): void {
    if (this.gutter === '') this.gutter = 'auto';
    if (this._hasSelectorTarget && this._target) {
      const classList = this._target.classList;
      for (const gutter of ['auto', 'stable', 'stable-both', 'none']) {
        classList.toggle(`-sc-scroll-gutter-${gutter}`, this.gutter === gutter);
      }
    }
  }

  @watch(['noY', 'noX'], { waitUntilFirstUpdate: true })
  handleXYChanged(): void {
    const classList = this._target?.classList;
    if (classList && this._hasSelectorTarget) {
      classList.toggle('-sc-scroll-no-y', this.noY);
      classList.toggle('-sc-scroll-no-x', this.noX);
    }
  }

  // @ts-ignore
  @watch('size', { waitUntilFirstUpdate: true })
  handleSizeChanged(oldValue?: string): void {
    const classList = this._target?.classList;
    if (classList && this._hasSelectorTarget) {
      if (oldValue) classList.remove(`-sc-scroll-${oldValue}`);
      if (this.size) classList.add(`-sc-scroll-${this.size}`);
    }
  }

  private _handleTransitions = (e: Event) => {
    const target = e.target as HTMLElement;
    const root = this.getRootNode() as ShadowRoot | Document;
    if (root instanceof ShadowRoot && target?.contains?.(root.host)) {
      this._isAnimating = !e.type.startsWith('sl-after-');
      if (!this._isAnimating) {
        requestAnimationFrame(() => {
          this._updateSizes();
          this.sync();
        });
      }
    }
  };

  show = (keep?: boolean) => {
    if (this.alwaysVisible) return;
    const classList = this._container.classList;
    if (classList.contains('show')) return;
    classList.add('show');
    this.emit('sc-show', { detail: { keep } });
    if (!keep) requestAnimationFrame(() => this.hide());
  };
  hide = () => {
    const classList = this._container.classList;
    if (classList.contains('show')) {
      this._container.classList.remove('show');
      this.emit('sc-hide');
    }
  };

  /** force a scroll position sync */
  sync() {
    (this._target ?? this._syncElements?.[0])?.dispatchEvent(
      new Event('scroll')
    );
  }

  private handleScScrollbarShow = (e: Event) => {
    if (this.alwaysVisible) return;
    if (e.type === 'sc-show') this.show((e as CustomEvent).detail?.keep);
    else this.hide();
  };
  private handleMouseEnter = () => this.show(true);

  private _emitChange() {
    this.emit('sc-change', {
      detail: {
        hasX: this._hasX,
        hasY: this._hasY,
        xRatio: this._xScrollRatio,
        yRatio: this._yScrollRatio,
      },
    });
  }

  private async _updateSizes() {
    const el = this._target;
    if (!el) return;
    const root = el.getRootNode();
    if (root instanceof ShadowRoot && root.host instanceof LitElement)
      await root.host.updateComplete;

    const {
      borderLeftWidth: bl,
      borderRightWidth: br,
      borderTopWidth: bt,
      borderBottomWidth: bb,
      width: w,
      height: h,
      overflowX,
      overflowY,
    } = getComputedStyle(el);

    const xRatio =
      overflowX === 'auto' || overflowX === 'scroll'
        ? el.scrollWidth / el.clientWidth
        : 0;
    const yRatio =
      overflowY === 'auto' || overflowY === 'scroll'
        ? el.scrollHeight / el.clientHeight
        : 0;
    const changed =
      xRatio !== this._xScrollRatio || yRatio !== this._yScrollRatio;

    if (isNaN(xRatio) || isNaN(yRatio)) return;
    this._xScrollRatio = xRatio;
    this._yScrollRatio = yRatio;

    if (this._hasSelectorTarget) {
      const rect = {
        left: el.offsetLeft + parseFloat(bl),
        top: el.offsetTop + parseFloat(bt),
        width: parseFloat(w) - parseFloat(bl) - parseFloat(br),
        height: parseFloat(h) - parseFloat(bt) - parseFloat(bb),
      };
      const inlineStyle = this._container.style;
      for (const k of Object.keys(rect) as (keyof typeof rect)[]) {
        inlineStyle.setProperty(`--offset-${k}`, `${rect[k]}px`);
      }

      this.handleXYChanged();
      if (!el.classList.contains('-sc-scroll-target'))
        requestAnimationFrame(() => {
          el.classList.add('-sc-scroll-target');
          this.handleGutterChanged();
          this.handleSizeChanged();
        });
      if (this._parent?.style.getPropertyValue('position') !== 'relative')
        requestAnimationFrame(() =>
          this._parent?.style.setProperty('position', 'relative')
        );
    } else if (changed && this._isSyncOnly && !this.alwaysVisible) {
      this.show();
    }
    this._emitChange();
  }

  private get _hasSelectorTarget() {
    return (
      typeof this.selector === 'string' ||
      this._slotElement.assignedElements().length > 0
    );
  }
  private get _isExternalTarget() {
    return (
      this._hasSelectorTarget &&
      !!this._target &&
      this._target.assignedSlot !== this._slotElement
    );
  }
  private get _isSyncOnly() {
    return !this._hasSelectorTarget && !!this.syncSelectorAll;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    const root = this.getRootNode() as ShadowRoot | Document;
    if (true || root instanceof ShadowRoot) {
      const host = root instanceof ShadowRoot ? root.host : root;
      host.addEventListener('sl-hide', this._handleTransitions);
      host.addEventListener('sc-hide', this._handleTransitions);
      host.addEventListener('sl-show', this._handleTransitions);
      host.addEventListener('sc-show', this._handleTransitions);
      host.addEventListener('sl-after-hide', this._handleTransitions);
      host.addEventListener('sl-after-show', this._handleTransitions);

      this._transitionCleanup = () => {
        host.removeEventListener('sl-hide', this._handleTransitions);
        host.removeEventListener('sc-hide', this._handleTransitions);
        host.removeEventListener('sl-show', this._handleTransitions);
        host.removeEventListener('sc-show', this._handleTransitions);
        host.removeEventListener('sl-after-hide', this._handleTransitions);
        host.removeEventListener('sl-after-show', this._handleTransitions);
      };
    }

    // adoptedStyleSheets is undefined in tests
    const sheets = root.adoptedStyleSheets ?? [];
    if (sheets.indexOf(extStyleSheet) === -1) sheets.push(extStyleSheet);
    root.adoptedStyleSheets ??= sheets;

    // redundant on 1st connect but handles when component is reused
    if (!this.isUpdatePending) this.requestUpdate();
    this.updateComplete.then(() => {
      this.handleSelectorChanged();
      this.handleSizeChanged('');
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver.disconnect();
    this._mutateObserver.disconnect();
    this._unsyncScrolls?.();
    this._unsyncScrolls = undefined;
    this._transitionCleanup?.();
    this._transitionCleanup = undefined;
    this._syncElements = this._target = this._parent = undefined;
  }

  protected updated(props: PropertyValues): void {
    if (!props.size) return;
    if (props.has('block')) {
      this.block || this._slotElement.assignedElements().length > 0
        ? this.removeAttribute('aria-hidden')
        : this.setAttribute('aria-hidden', 'true');
      this._updateSizes();
    }
  }

  protected render() {
    const klass = classMap({
      track: true,
      'has-y': this._hasY,
      'has-x': this._hasX,
    });

    return html`
      <slot></slot>
      <div
        class=${classMap({
          container: true,
          border: this.border,
          round: this.round,
          [`size-${this.size}`]: !!this.size,
          resizer: !!this.resizer,
          'always-visible': this.alwaysVisible,
          opaque: this.opaque,
          hide: !this._target || this._isAnimating,
        })}
        part="container"
      >
        <div
          class=${klass}
          part="y"
          @mouseenter=${this.handleMouseEnter}
          @mouseleave=${this.hide}
        >
          ${!this.opaque
            ? html`<div class="fake-scroller">
                <div
                  class="spacer"
                  style="height: ${this._yScrollRatio * 100}%;"
                ></div>
              </div>`
            : nothing}
          <div class="scroller">
            <div
              class="spacer"
              style="height: ${this._yScrollRatio * 100}%;"
            ></div>
          </div>
        </div>
        <div
          class=${klass}
          part="x"
          @mouseenter=${this.handleMouseEnter}
          @mouseleave=${this.hide}
        >
          ${!this.opaque
            ? html`<div class="fake-scroller">
                <div
                  class="spacer"
                  style="width: ${this._xScrollRatio * 100}%;"
                ></div>
              </div>`
            : nothing}
          <div class="scroller">
            <div
              class="spacer"
              style="width: ${this._xScrollRatio * 100}%;"
            ></div>
          </div>
        </div>
        <div class=${klass} part="corner"></div>
      </div>
    `;
  }
}
