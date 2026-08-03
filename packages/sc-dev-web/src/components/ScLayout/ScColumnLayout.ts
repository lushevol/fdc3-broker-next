import { html, nothing } from 'lit';
import { property, state, queryAssignedElements } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScColumnLayoutStyle from './ScColumnLayout.style.js';
import '../../../elements/sc-grid.js';
import '../../../elements/sc-scrollbar.js';
import '../ScSheet/ScSideSheet.js';
import { HasSlotController } from '../../shared/slot.js';
import { watch } from '../../shared/watch.js';
import { mediaQuery } from '../../shared/mediaQuery.js';


export class ScColumnLayout extends ScElement {
  static styles = ScTheme.getStyles().concat([ScColumnLayoutStyle]);

  /**
   * Store all timeout IDs so they can be cleared on disconnect
   */
  private _timeoutIds: number[] = [];
  @queryAssignedElements({ slot: 'sticky-button', selector: 'sc-button' })
  private _stickyButtons!: Array<HTMLElement>;

  @property({ type: String }) title = '';

  @property({ type: String })
  layout:
    | 'Main Content Right'
    | 'Main Content Left'
    | 'Main Content Middle'
    | 'Main Content Full' = 'Main Content Right';

  @property({ type: String }) height: 'cover' | 'auto' = 'auto';

  @property({ type: Boolean, attribute: 'left-column-collapsible' })
  leftColumnCollapsible = false;

  @property({ type: Boolean, attribute: 'left-column-collapse' })
  leftColumnCollapse = false;

  @property({ type: Boolean, attribute: 'left-divider-invisible' })
  leftDividerInvisible = false;

  @property({ type: Boolean, attribute: 'left-column-resizable' })
  leftColumnResizable = false;

  @property({ type: Boolean, attribute: 'left-header-divider' })
  leftHeaderDivider = false;

  @property({ type: Boolean, attribute: 'hide-zoom' })
  hideZoom = false;

  @property({ type: String, attribute: 'right-column-size' }) rightColumnSize =
    'md';

  @property({ type: String, attribute: 'right-column-title' }) rightColumnTitle = 'Detail';

  @property({ type: String, attribute: 'left-column-width' }) leftColumnWidth = '18.75rem';

  @property({ type: String, attribute: 'right-column-width' }) rightColumnWidth = '18.75rem';

  @property({ type: Boolean, attribute: 'right-column-collapsible' })
  rightColumnCollapsible = false;

  @property({ type: Boolean, attribute: 'right-column-collapse' })
  rightColumnCollapse = false;

  @property({ type: Boolean, attribute: 'right-divider-invisible' })
  rightDividerInvisible = false;

  @property({ type: Boolean, attribute: 'right-column-resizable' })
  rightColumnResizable = false;
  
  @property({ type: Boolean, attribute: 'right-header-divider' })
  rightHeaderDivider = false;

  @property({ type: Boolean, attribute: 'fix-sticky-bar' }) fixStickyBar =
    false;

  @property({ type: String, attribute: 'additional-height' }) additionalHeight =
    '0px';

  @property({ type: String, attribute: 'additional-slot-height' }) additionalSlotHeight = '';

  @property({ type: Boolean, attribute: 'auto-process-spacing-value' }) autoProcessSpacingValue = false;

  /**
   * If true, applies the 'standard-spacing' class to the root layout container for consistent spacing.
   */
  @property({ type: Boolean, attribute: 'standard-spacing' }) standardSpacing = false;

  @property({ type: Boolean }) unfloatable = false;

  @property({ type: Boolean })
  compact = false;

  @property({ type: String }) type: 'page' | 'component' = 'page';

  @property({ type: Boolean, attribute: 'disable-auto-collapse' })
  disableAutoCollapse = false;

  resizeObserver?: ResizeObserver;

  @state() _leftCollapse = false;

  @state() _leftCollapseTemp = false;

  @state() _leftCollapseAction = false;

  @property({ type: Array, attribute: 'custom-icons' }) customIcons = [];

  @state() _rightCollapse = false;

  @state() _rightCollapseTemp = false;

  @state() _rightCollapseAction = false;

  @state() _recentCollapseType = '';

  @state() _additionalOffset = '0px';

  @state() _fixedBar = false;

  @state() _scrollAction = '';

  @state() _mainContentZooming = false;

  @state() _showMainContentZoomInIcon = false;

  @state() _componentWidth = 0;

  @state() _userCollapseLeft = false;

  @state() _userCollapseRight = false;

  @state() _alreadyFirstUpdated = false;

  @state() _resizeHoverType: '' | 'left' | 'right' = '';

  @state() _resizeActionType: '' | 'left' | 'right' = '';

  @state() _leftResizableWidthPx = 0;

  @state() _rightResizableWidthPx = 0;

  @state() _isResizing = false;

  @state() _touchResizeReadyType: '' | 'left' | 'right' = '';

  @state() _root: any;

  @state() _previousTabletInfo: any = {};

  private _resizeStartX = 0;

  private _resizeStartLeftWidth = 0;

  private _resizeStartRightWidth = 0;

  private _resizeMinLeftWidth = 0;

  private _resizeMinRightWidth = 0;

  private _resizeBaseMinLeftWidth = 0;

  private _resizeBaseMinRightWidth = 0;

  private _touchResizeTapType: '' | 'left' | 'right' = '';

  private _touchResizeTapAt = 0;

  private _touchResizePendingClientX = 0;

  private _touchResizeArmTimeoutId = 0;

  private readonly _minMainContentWidth = 300;

  private readonly _collapseOvershoot = 80;

  private readonly _resizeBorderHitArea = 8;

  private readonly _touchResizeDoubleTapDelay = 350;

  private readonly _touchResizeArmTimeout = 1800;

  private readonly _onResizeMove = (e: MouseEvent) => {
    this.handleResizeMove(e);
  };

  private readonly _onResizeUp = () => {
    this.stopResizeDrag();
  };

  private readonly _onResizeTouchMove = (e: TouchEvent) => {
    this.handleResizeTouchMove(e);
  };

  private readonly _onResizeTouchEnd = () => {
    this.handleResizeTouchEnd();
  };

  /**
   * External CSS length variables that appear inside calc() expressions (directly or
   * via intermediate custom-property chains) in ScColumnLayout.style.ts.
   * If a consumer sets one of these to the unitless value `0`, browsers treat the
   * calc() as invalid.  We normalise them to `0rem` in willUpdate so the fix is
   * applied before every render / re-render.
   */
  private static readonly _calcLengthVars = [
    '--sc-layout-top-navigation-offset',
    '--sc-column-extra-top-offset',
    '--sc-layout-top-offset',
    '--sc-layout-header-offset',
    '--sc-layout-breadcrumb-offset',
    '--sc-layout-breadcrumb-padding-top',
    '--sc-layout-sticky-bar-left-offset',
    '--sc-layout-sticky-bar-right-offset',
    '--sc-bottom-offset',
    '--sc-layout-bottom-offset',
    '--sc-layout-grid-column-padding-x',
    '--sc-scrollbar-gutter',
    '--sc-layout-main-content-padding-x',
    '--sc-layout-main-content-padding-top',
    '--sc-layout-main-content-padding-bottom',
    '--sc-layout-left-header-height',
    '--sc-layout-right-header-height',
    '--sc-layout-left-panel-padding-x',
    '--sc-layout-right-panel-padding-x',
    '--sc-layout-left-panel-padding-top',
    '--sc-layout-left-panel-padding-bottom',
    '--sc-layout-right-panel-padding-top',
    '--sc-layout-right-panel-padding-bottom',
    '--sc-layout-left-header-padding-x',
    '--sc-layout-right-header-padding-x',
  ] as const;

  /** Replace every unitless `0` value among the tracked variables with `0rem`. */
  private _fixUnitlessCssVariables() {
    if (!this.autoProcessSpacingValue) return;
    const computed = getComputedStyle(this);
    for (const name of ScColumnLayout._calcLengthVars) {
      if (computed.getPropertyValue(name).trim() === '0') {
        this.style.setProperty(name, '0rem');
      }
    }
  }

  override willUpdate(changedProperties: Map<PropertyKey, unknown>) {
    super.willUpdate(changedProperties);
    this._fixUnitlessCssVariables();
  }

  constructor() {
    super();

    this.initPortraitLayoutSideColumn();
  }

  @mediaQuery(['desktop', 'tablet', 'portrait'] as any[], { waitAfterUpdate: true })
  renderOnMobile() {
    if (this._previousTabletInfo.tablet !== this.isTablet || this._previousTabletInfo.portrait !== this.isPortrait) {
      this.initPortraitLayoutSideColumn();
    }
    this._previousTabletInfo = {
      tablet: this.isTablet,
      portrait: this.isPortrait,
    };
    this.requestUpdate();
  }

  autoCollapse(entry: any) {
    // check if need to force collapse for the tablet size on PC
    if (this.isPortraitLeftColumn && !this._leftCollapse && !this._leftCollapseTemp && this.isPortraitRightColumn && !this._rightCollapse && !this._rightCollapseTemp) {
      // need to collapse right
      this._rightCollapse = true;
      this._rightCollapseTemp = true;
      this._userCollapseRight = false;
    }

    if (this.disableAutoCollapse) return;
    const newWidth = Math.floor(entry.borderBoxSize[0].inlineSize);
    const needCollapseLeft = this.leftColumnCollapsible && !(this._leftCollapse || this._leftCollapseTemp);
    const needCollpaseRight = this.rightColumnCollapsible && !(this._rightCollapse || this._rightCollapseTemp);

    if (this.isPcDevice && this._componentWidth !== newWidth && Math.abs(this._componentWidth - newWidth) > 20) {
      const oldWidth = this._componentWidth;
      this._componentWidth = newWidth;
      
      if (this._componentWidth < 600 && this._componentWidth > 0 && (this._componentWidth < oldWidth || oldWidth === 0)) {
        if (needCollapseLeft) {
          this.handleCollapseLeft();
          this._userCollapseLeft = false;
        }
        if (needCollpaseRight) {
          this.handleCollapseRight();
          this._userCollapseRight = false;
        }
      } else if (this._componentWidth >= 616 && this._componentWidth > oldWidth) {
        // expand
        if (this._leftCollapseTemp && this._leftCollapse && !this.isPortraitLeftColumn && !this._userCollapseLeft) {
          this.handleCollapseLeft();
          this._userCollapseLeft = false;
        }
        if (this._rightCollapseTemp && this._rightCollapse && !this.isPortraitRightColumn && !this._userCollapseRight) {
          this.handleCollapseRight();
          this._userCollapseRight = false;
        }
      }
    }
  }

  firstUpdated() {
    this.initPortraitLayoutSideColumn();

    this.updateLeftCollapse();
    this.updateRightCollapse();
    this.updateFixStickyBar();
    if (!this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0];
        if (entry) {
          this.autoCollapse(entry);
        }
      });
      const root = this.shadowRoot?.querySelector('.sc-column-layout');
      if (root) {
        this._root = root;
        this.resizeObserver.observe(this._root);
      }
    }

    this._alreadyFirstUpdated = true;
  }

  @watch('fixStickyBar', { waitUntilFirstUpdate: true })
  updateFixStickyBar() {
    if (this.type === 'component') {
      if (this._scrollAction) {
        window.removeEventListener('scroll', this.scrollAction);
        this._scrollAction = '';
      }
      this._fixedBar = true;
      this.stickyButtonsChanged();
      return;
    }
    if (this.fixStickyBar) {
      this._fixedBar = true;
      if (this._scrollAction) {
        window.removeEventListener('scroll', this.scrollAction);
        this._scrollAction = '';
      }
      this.stickyButtonsChanged();
    } else {
      if (!this._scrollAction) {
        window.addEventListener('scroll', this.scrollAction);
        this._scrollAction = 'scroll';
      }
      this.scrollAction();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._scrollAction &&
      window.removeEventListener('scroll', this.scrollAction);
    window.removeEventListener('mousemove', this._onResizeMove);
    window.removeEventListener('mouseup', this._onResizeUp);
    this.detachTouchResizeListeners();
    if (this._root && this.resizeObserver) {
      this.resizeObserver.unobserve(this._root);
      this.resizeObserver = undefined;
    }
    // Clear all pending timeouts
    if (this._timeoutIds && this._timeoutIds.length > 0) {
      this._timeoutIds.forEach(id => clearTimeout(id));
      this._timeoutIds = [];
    }
  }

  @watch(['leftColumnCollapse', 'leftColumnCollapsible'], {
    waitUntilFirstUpdate: true,
  })
  updateLeftCollapse() {
    if (
      this.isPcModeLayout && 
      ((this.leftColumnCollapse === !this._leftCollapse &&
        this.leftColumnCollapsible) ||
      (!this.leftColumnCollapsible && this._leftCollapse))
    )
      this.handleCollapseLeft();
  }

  @watch(['rightColumnCollapse', 'rightColumnCollapsible'], {
    waitUntilFirstUpdate: true,
  })
  updateRightCollapse() {
    if (
      this.isPcModeLayout && 
      ((this.rightColumnCollapse === !this._rightCollapse &&
        this.rightColumnCollapsible) ||
      (!this.rightColumnCollapsible && this._rightCollapse))
    )
      this.handleCollapseRight();
  }

  @watch('additionalHeight')
  updateAdditionalOffset() {
    if (!this.additionalHeight) {
      this._additionalOffset = '0px';
    } else if (
      !isNaN(parseFloat(this.additionalHeight)) &&
      this.additionalHeight.toLowerCase().indexOf('px') === -1
    ) {
      this._additionalOffset = `${this.additionalHeight}px`;
    } else {
      this._additionalOffset = this.additionalHeight;
    }
  }

  readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'left-header',
    'left-action',
    'left',
    'middle',
    'right-header',
    'right',
    'title',
    'breadcrumb',
    'sticky-breadcrumb',
    'sticky-button',
    'additional'
  );

  get isSafari() {
    if (!navigator?.userAgent) return false;
    return (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent));
  }

  get isSplitView() {
    const style = getComputedStyle(this);
    return style.getPropertyValue('--sc-is-split-view').trim() === '1';
  }

  get layoutType() {
    const res = {
      isFull: this.layout === 'Main Content Full',
      isLeft: this.layout === 'Main Content Left',
      isMiddle: this.layout === 'Main Content Middle',
      isRight: this.layout === 'Main Content Right',
      isOthers: false,
    };
    res.isOthers = !res.isFull && !res.isLeft && !res.isMiddle && !res.isRight;
    return res;
  }

  get columnSizes(): any {
    switch (true) {
      case this.layoutType.isFull:
        return {
          left: { xs: 12, md: 12, xl: 12, isMain: true },
          middle: { xs: 0, md: 0, xl: 0 },
          right: { xs: 0, md: 0, xl: 0 },
        };
      case this.layoutType.isLeft:
        return this._rightCollapse
          ? {
              left: { xs: 12, md: 12, xl: 12, isMain: true },
              middle: { xs: 0, md: 0, xl: 0 },
              right: { xs: 12, md: 3, xl: 3 },
            }
          : {
              left: { xs: 12, md: 9, xl: 9, isMain: true },
              middle: { xs: 0, md: 0, xl: 0 },
              right: { xs: 12, md: 3, xl: 3 },
            };
      case this.layoutType.isMiddle: {
        const res = {
          left: { xs: 12, md: 3, xl: 3 },
          middle: { xs: 12, md: 6, xl: 6, isMain: true },
          right: { xs: 12, md: 3, xl: 3 },
        };
        if (this._rightCollapse) {
          res.middle.md += 3;
          res.middle.xl += 3;
        }
        if (this._leftCollapse) {
          res.middle.md += 3;
          res.middle.xl += 3;
        }
        return res;
      }
      case this.layoutType.isRight:
      default:
        return this._leftCollapse
          ? {
              left: { xs: 12, md: 3, xl: 3 },
              middle: { xs: 0, md: 0, xl: 0 },
              right: { xs: 12, md: 12, xl: 12, isMain: true },
            }
          : {
              left: { xs: 12, md: 3, xl: 3 },
              middle: { xs: 0, md: 0, xl: 0 },
              right: { xs: 12, md: 9, xl: 9, isMain: true },
            };
    }
  }

  get isPcModeLayout() {
    if (this.compact) return false;
    return this.isDesktop || !this.isPortrait;
  }

  private get isPcDevice() {
    if (typeof navigator === 'undefined') return true;
    if ((navigator as any).userAgentData?.mobile !== undefined) {
      return !(navigator as any).userAgentData.mobile;
    }
    return !/Android|iP(ad|hone|od)|Tablet|Mobile|Silk|Kindle|PlayBook|BB10|Windows Phone/i.test(
      navigator.userAgent
    );
  }

  // fixed width, 300px
  get computedLeftColumnSize() {
    return '18.75rem';
  }

  get computedRightColumnSize() {
    switch (this.rightColumnSize) {
      case 'lg':
        return '22.5rem';
      case 'sm':
        return '13.75rem';
      case 'md':
      default:
        return '18.75rem';
    }
  }

  get resolvedLeftColumnWidth() {
    return this._leftResizableWidthPx > 0
      ? `${this._leftResizableWidthPx}px`
      : this.leftColumnWidth;
  }

  get resolvedRightColumnWidth() {
    return this._rightResizableWidthPx > 0
      ? `${this._rightResizableWidthPx}px`
      : this.rightColumnWidth;
  }

  get canResizeLeftColumn() {
    return (
      this.isPcModeLayout &&
      this.leftColumnResizable &&
      !this.layoutType.isLeft &&
      !this.layoutType.isFull
    );
  }

  get canResizeRightColumn() {
    return (
      this.isPcModeLayout &&
      this.rightColumnResizable &&
      !this.layoutType.isRight &&
      !this.layoutType.isFull
    );
  }

  private _toPx(value = '0px') {
    const raw = `${value}`.trim();
    if (!raw) return 0;
    if (raw.endsWith('rem')) {
      const rem = parseFloat(raw);
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
      return rem * rootFontSize;
    }
    if (raw.endsWith('px')) {
      return parseFloat(raw);
    }
    const numberValue = parseFloat(raw);
    return isNaN(numberValue) ? 0 : numberValue;
  }

  private handleResizeHover(type: 'left' | 'right', active: boolean) {
    this._resizeHoverType = active ? type : (this._resizeHoverType === type ? '' : this._resizeHoverType);
  }

  private get canResizeWithTouch() {
    return this.isPcModeLayout && !this.isPcDevice;
  }

  private canTouchResize(type: 'left' | 'right') {
    return this.canResizeWithTouch && (type === 'left' ? this.canResizeLeftColumn : this.canResizeRightColumn);
  }

  private attachTouchResizeListeners() {
    window.addEventListener('touchmove', this._onResizeTouchMove, { passive: false });
    window.addEventListener('touchend', this._onResizeTouchEnd);
    window.addEventListener('touchcancel', this._onResizeTouchEnd);
  }

  private detachTouchResizeListeners() {
    window.removeEventListener('touchmove', this._onResizeTouchMove);
    window.removeEventListener('touchend', this._onResizeTouchEnd);
    window.removeEventListener('touchcancel', this._onResizeTouchEnd);
  }

  private clearTouchResizeArming(resetTap = false) {
    if (this._touchResizeArmTimeoutId) {
      clearTimeout(this._touchResizeArmTimeoutId);
      this._touchResizeArmTimeoutId = 0;
    }
    this._touchResizeReadyType = '';
    this._touchResizePendingClientX = 0;
    if (resetTap) {
      this._touchResizeTapType = '';
      this._touchResizeTapAt = 0;
    }
  }

  private armTouchResize(type: 'left' | 'right', clientX: number) {
    this.clearTouchResizeArming();
    this._touchResizeReadyType = type;
    this._touchResizePendingClientX = clientX;
    this.attachTouchResizeListeners();
    const timeoutId = window.setTimeout(() => {
      if (this._touchResizeArmTimeoutId === timeoutId) {
        this._touchResizeArmTimeoutId = 0;
      }
      this.detachTouchResizeListeners();
      this.clearTouchResizeArming(true);
    }, this._touchResizeArmTimeout);
    this._touchResizeArmTimeoutId = timeoutId;
    this._timeoutIds.push(timeoutId);
  }

  private beginTouchResizeDrag(type: 'left' | 'right', clientX: number) {
    this.attachTouchResizeListeners();
    this.startResizeDrag(type, clientX);
    this.clearTouchResizeArming();
  }

  private isResizeBorderHit(
    type: 'left' | 'right',
    clientXOrEvent: number | MouseEvent,
    target?: HTMLElement | null
  ) {
    const clientX =
      typeof clientXOrEvent === 'number'
        ? clientXOrEvent
        : clientXOrEvent.clientX;
    const resolvedTarget =
      target ??
      (typeof clientXOrEvent === 'number'
        ? null
        : (clientXOrEvent.currentTarget as HTMLElement | null));
    if (!resolvedTarget) return false;
    const rect = resolvedTarget.getBoundingClientRect();
    if (type === 'left') {
      const diff = rect.right - clientX;
      return diff >= 0 && diff <= this._resizeBorderHitArea;
    }
    const diff = clientX - rect.left;
    return diff >= 0 && diff <= this._resizeBorderHitArea;
  }

  private handlePanelBorderMouseMove(type: 'left' | 'right', e: MouseEvent) {
    this.handleResizeHover(
      type,
      this.isResizeBorderHit(type, e.clientX, e.currentTarget as HTMLElement | null)
    );
  }

  private handlePanelBorderMouseLeave(type: 'left' | 'right') {
    if (this._resizeActionType !== type) {
      this.handleResizeHover(type, false);
    }
  }

  private handlePanelBorderMouseDown(type: 'left' | 'right', e: MouseEvent) {
    if (!this.isResizeBorderHit(type, e.clientX, e.currentTarget as HTMLElement | null)) return;
    this.startResizeDrag(type, e.clientX);
    e.preventDefault?.();
  }

  private handlePanelBorderTouchStart(type: 'left' | 'right', e: TouchEvent) {
    if (!this.canTouchResize(type)) return;
    const touch = e.touches[0];
    if (!touch) return;
    if (!this.isResizeBorderHit(type, touch.clientX, e.currentTarget as HTMLElement | null)) return;

    if (this._touchResizeReadyType && this._touchResizeReadyType !== type) {
      this.detachTouchResizeListeners();
      this.clearTouchResizeArming(true);
    }

    if (this._touchResizeReadyType === type) {
      this.beginTouchResizeDrag(type, touch.clientX);
      e.preventDefault();
      return;
    }

    const now = Date.now();
    const isDoubleTap =
      this._touchResizeTapType === type &&
      now - this._touchResizeTapAt <= this._touchResizeDoubleTapDelay;
    this._touchResizeTapType = type;
    this._touchResizeTapAt = now;

    if (isDoubleTap) {
      this.armTouchResize(type, touch.clientX);
      e.preventDefault();
    }
  }

  private handleResizeHandleTouchStart(type: 'left' | 'right', e: TouchEvent) {
    if (!this.canTouchResize(type)) return;
    const touch = e.touches[0];
    if (!touch) return;

    if (this._touchResizeReadyType && this._touchResizeReadyType !== type) {
      this.detachTouchResizeListeners();
      this.clearTouchResizeArming(true);
    }

    if (this._touchResizeReadyType === type) {
      this.beginTouchResizeDrag(type, touch.clientX);
      e.preventDefault();
      return;
    }

    const now = Date.now();
    const isDoubleTap =
      this._touchResizeTapType === type &&
      now - this._touchResizeTapAt <= this._touchResizeDoubleTapDelay;
    this._touchResizeTapType = type;
    this._touchResizeTapAt = now;

    if (isDoubleTap) {
      this.armTouchResize(type, touch.clientX);
      e.preventDefault();
    }
  }

  private startResizeDrag(type: 'left' | 'right', clientX: number) {
    if (!this.isPcModeLayout) return;

    const gridRow = this.shadowRoot?.querySelector('.grid-row') as HTMLElement | null;
    if (!gridRow) return;

    const leftPanel = this.shadowRoot?.querySelector('.grid-column.left-column.minor') as HTMLElement | null;
    const rightPanel = this.shadowRoot?.querySelector('.grid-column.right-column.minor') as HTMLElement | null;

    const startLeft = leftPanel?.getBoundingClientRect().width || this._toPx(this.resolvedLeftColumnWidth);
    const startRight = rightPanel?.getBoundingClientRect().width || this._toPx(this.resolvedRightColumnWidth);

    if (startLeft > 0 && this._leftResizableWidthPx === 0) {
      this._leftResizableWidthPx = Math.round(startLeft);
    }
    if (startRight > 0 && this._rightResizableWidthPx === 0) {
      this._rightResizableWidthPx = Math.round(startRight);
    }

    this._resizeActionType = type;
    this._isResizing = true;
    this._resizeStartX = clientX;
    this._resizeStartLeftWidth = startLeft;
    this._resizeStartRightWidth = startRight;
    this._resizeMinLeftWidth = this._toPx(this.computedLeftColumnSize);
    this._resizeMinRightWidth = this._toPx(this.computedRightColumnSize);

    window.addEventListener('mousemove', this._onResizeMove);
    window.addEventListener('mouseup', this._onResizeUp);
  }

  private handleResizeMove(e: MouseEvent) {
    this.handleResizeMoveByClientX(e.clientX);
  }

  private handleResizeTouchMove(e: TouchEvent) {
    const touch = e.touches[0];
    if (!touch) return;

    if (this._touchResizeReadyType && !this._isResizing) {
      this.beginTouchResizeDrag(this._touchResizeReadyType, this._touchResizePendingClientX || touch.clientX);
    }

    if (!this._isResizing) return;

    this.handleResizeMoveByClientX(touch.clientX);
    e.preventDefault();
  }

  private handleResizeTouchEnd() {
    if (this._isResizing) {
      this.stopResizeDrag();
      return;
    }

    this.detachTouchResizeListeners();
  }

  private handleResizeMoveByClientX(clientX: number) {
    if (!this._isResizing || !this._resizeActionType) return;

    const gridRow = this.shadowRoot?.querySelector('.grid-row') as HTMLElement | null;
    if (!gridRow) return;
    const containerWidth = gridRow.getBoundingClientRect().width;
    const deltaX = clientX - this._resizeStartX;

    if (this._resizeActionType === 'left') {
      const maxLeftWidth = Math.max(0, containerWidth - this._resizeStartRightWidth - this._minMainContentWidth);
      const nextLeft = Math.min(
        Math.max(this._resizeStartLeftWidth + deltaX, this._resizeMinLeftWidth),
        maxLeftWidth
      );
      this._leftResizableWidthPx = Math.round(nextLeft);

      const overshoot = this._resizeMinLeftWidth - (this._resizeStartLeftWidth + deltaX);
      if (
        overshoot > this._collapseOvershoot &&
        this.leftColumnCollapsible &&
        !this._leftCollapse
      ) {
        this.stopResizeDrag();
        this.handleCollapseLeft();
      }
      return;
    }

    const maxRightWidth = Math.max(0, containerWidth - this._resizeStartLeftWidth - this._minMainContentWidth);
    const nextRight = Math.min(
      Math.max(this._resizeStartRightWidth - deltaX, this._resizeMinRightWidth),
      maxRightWidth
    );
    this._rightResizableWidthPx = Math.round(nextRight);

    const overshoot = this._resizeMinRightWidth - (this._resizeStartRightWidth - deltaX);
    if (
      overshoot > this._collapseOvershoot &&
      this.rightColumnCollapsible &&
      !this._rightCollapse
    ) {
      this.stopResizeDrag();
      this.handleCollapseRight();
    }
  }

  private stopResizeDrag() {
    this._isResizing = false;
    this._resizeActionType = '';
    window.removeEventListener('mousemove', this._onResizeMove);
    window.removeEventListener('mouseup', this._onResizeUp);
    this.detachTouchResizeListeners();
    this.clearTouchResizeArming(true);
  }

  private get isLeftResizeAffordanceActive() {
    return (
      (this._isResizing && this._resizeActionType === 'left') ||
      this._touchResizeReadyType === 'left'
    );
  }

  private get isRightResizeAffordanceActive() {
    return (
      (this._isResizing && this._resizeActionType === 'right') ||
      this._touchResizeReadyType === 'right'
    );
  }

  get mainContentIconList() {
    const list: any[] = this.customIcons || [];
    if (this.hideZoom) {
      return list.filter(item => !!item?.name);
    }

    const zoomIcon = {
      in: {
        name: 'page-zoom-in--line',
        action: (e: Event) => {
          e?.stopPropagation();
          this._mainContentZooming = true;
          this._showMainContentZoomInIcon = false;
          window.setTimeout(() => {
            this._mainContentZooming = false;
          }, 200);
        },
        showInMaxScreen: true,
      },
      out: {
        name: 'page-zoom-out--line',
        action: (e: Event) => {
          e?.stopPropagation();
          this._mainContentZooming = true;
          this._showMainContentZoomInIcon = true;
          window.setTimeout(() => {
            this._mainContentZooming = false;
          }, 200);
        },
        showInMaxScreen: true,
      },
    };
    const target = this._showMainContentZoomInIcon
      ? zoomIcon.in
      : zoomIcon.out;
    const first = list?.[0];
    if (
      !first ||
      ![zoomIcon.in.name, zoomIcon.out.name].includes(first.name)
    ) {
      list.unshift(target);
    } else {
      list.splice(0, 1);
      list.unshift(target);
    }
    return list.filter(item => !!item?.name);
  }

  get isPortraitLeftColumn() {
    return !this.isPcModeLayout && (this.layoutType.isRight || this.layoutType.isMiddle);
  }

  get isPortraitRightColumn() {
    return !this.isPcModeLayout && (this.layoutType.isLeft || this.layoutType.isMiddle);
  }

  initPortraitLayoutSideColumn() {
    if (
      this.leftColumnCollapsible &&
      this.rightColumnCollapsible &&
      !this._leftCollapse &&
      !this._rightCollapse
    ) {
      this._rightCollapse = true;
      this._rightCollapseTemp = true;
      this._userCollapseRight = false;
    }

    if (this.disableAutoCollapse) return;

    if (this.isPortraitLeftColumn && !this._userCollapseLeft) {
      this._leftCollapse = true;
      this._leftCollapseTemp = true;
      this._userCollapseLeft = false;
    }
    if (this.isPortraitRightColumn && !this._userCollapseRight) {
      this._rightCollapse = true;
      this._rightCollapseTemp = true;
      this._userCollapseRight = false;
    }
  }

  handleCollapseLeft() {
    this._leftCollapseAction = true;
    this._recentCollapseType = 'left';
    this._leftCollapseTemp = !this._leftCollapse;
    this._userCollapseLeft = true;
    
    this.emit('sc-action', {
      detail: {
        action: 'left-collapse',
        value: this._leftCollapseTemp,
      },
    });

    if (this._leftCollapse) {
      this._leftCollapse = false;
    } else {
      const id = window.setTimeout(() => {
        this._leftCollapse = true;
      }, 300);
      this._timeoutIds.push(id);
    }
    
    const id2 = window.setTimeout(() => {
      this._leftCollapseAction = false;
    }, 300);
    this._timeoutIds.push(id2);
  }
  handleOuterCollapseLeft(type: 'show' | 'hide') {
    const toCollapse = type === 'hide';
    if (toCollapse === this._leftCollapse) {
      return;
    }
    this._leftCollapseTemp = toCollapse;
    if (toCollapse) {
      const id = window.setTimeout(() => this._leftCollapse = toCollapse, 250);
      this._timeoutIds.push(id);
    } else {
      this._leftCollapse = toCollapse;
    }
  }

  handleCollapseRight() {
    this._rightCollapseAction = true;
    this._recentCollapseType = 'right';
    this._rightCollapseTemp = !this._rightCollapse;
    this._userCollapseRight = true;

    this.emit('sc-action', {
      detail: {
        action: 'right-collapse',
        value: this._rightCollapseTemp,
      },
    });

    if (this._rightCollapse) {
      this._rightCollapse = false;
    } else {
      const id = window.setTimeout(
        () => {
          this._rightCollapse = true;
        },
        300
      );
      this._timeoutIds.push(id);
    }
    const id2 = window.setTimeout(() => {
      this._rightCollapseAction = false;
    }, 300);
    this._timeoutIds.push(id2);
  }
  handleOuterCollapseRight(type: 'show' | 'hide' | string = '') {
    const toCollapse = type === 'hide' || (!type && !this._rightCollapse);
    
    if (toCollapse === this._rightCollapse) {
      return;
    }
    this._rightCollapseTemp = toCollapse;
    if (toCollapse) {
      const id = window.setTimeout(() => this._rightCollapse = toCollapse, 250);
      this._timeoutIds.push(id);
    } else {
      this._rightCollapse = toCollapse;
    }
  }

  scrollAction() {
    const stickyBar = this.renderRoot?.querySelector('.header-bar');
    const barContainer = this.renderRoot?.querySelector(
      '.header-bar-container'
    );
    if (!stickyBar || !barContainer) {
      return;
    }
    const containerDistance = barContainer.getBoundingClientRect().top;
    const topElement = this.renderRoot?.querySelector('.sc-column-layout');
    let top = '0px';
    if (topElement) {
      top = getComputedStyle(topElement)?.getPropertyValue(
        '--column-layout-sticky-top-offset'
      );
    }
    const topDistance = Number(top.replace(/[^\d]+.*/, '') ?? 0);

    this._fixedBar = containerDistance < topDistance;
    this.stickyButtonsChanged();
  }

  stickyButtonsChanged() {
    const buttons = this._stickyButtons || [];
    buttons.forEach((el: any) => {
      el.size = this._fixedBar ? 'sm' : 'md';
    });
  }

  preventDefault(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleScrollbarChange(className: string, e: CustomEvent) {
    if (!e?.target || !e?.detail) {
      return;
    }
    const { hasX = false, hasY = false } = e.detail || {};
    const target = e.target as any;
    const parentRoot = (target.parentNode || target.parentNode) as HTMLElement;
    const targetDom = parentRoot?.querySelector(className);
    if (targetDom) {
      targetDom.classList.toggle('-sc-scroll-has-x', hasX);
      targetDom.classList.toggle('-sc-scroll-has-y', hasY);
    }
  }

  renderHeader(withFloat: boolean) {
    if (withFloat && this.unfloatable) return null;
    if (!withFloat && !this.unfloatable) return null;
    const hasTitleSlot = this.hasSlotController.test('title');
    return hasTitleSlot || this.title
      ? html`
        <div class="title">
          <sc-title level="2">
            ${this.title
              ? html`${this.title}`
              : html` <slot name="title"></slot> `}
          </sc-title>
        </div>

        `
      : null;
  }

  renderCustomIcons(type = '') {
    const list = this.mainContentIconList;
    const actionEmitter = (action: any, e?: Event) => {
      e?.preventDefault();
      if (typeof action === 'string') {
        action &&
          this.dispatchEvent(
            new CustomEvent(action, {
              bubbles: true,
              composed: true,
            })
          );
      } else {
        action?.();
      }
    };

    return html`
      <style>
        .user-action-wrap {
          position: absolute;
          z-index: 1;
          top: 4px;
          right: calc(0px - var(--grid-column-padding-x, 0.75rem));
          width: 1.625rem;
          height: auto;
          padding: 1px;
          will-change: transform, right;
          transform: scale(0.5) translate(-50%, -50%);
          transition: right 300ms ease-in-out;
        }
        .user-action-wrap.right {
          transform: scale(0.5) translate(-100%, -50%);
        }
        .action-icon-wrap {
          width: 3rem;
          height: 3rem;
          border: 1px solid #d9d9d9;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: transform 0.2s ease-in-out;
          transform-origin: 100% 10%;
        }
        .action-icon-wrap:not(:last-child) {
          margin-bottom: var(--sc-spacing-6, 1.5rem);
        }
        .action-icon-wrap:hover {
          transform: scale(1.5);
        }
        @media (max-width: 1800px) {
          .action-icon-wrap.max-screen {
            display: none;
          }
        }
      </style>
      <div class="user-action-wrap ${type}">
        ${list.map(item => {
          return html`
            <div
              class="action-icon-wrap ${item.showInMaxScreen
                ? 'max-screen'
                : ''}"
            >
              <sc-icon-button
                size="lg"
                type="text"
                .name=${item.name}
                @click=${actionEmitter.bind(this, item?.action)}
              ></sc-icon-button>
            </div>
          `;
        })}
        <slot name="user-icon"></slot>
      </div>
    `;
  }

  renderCollapseIcon(type: 'left' | 'right' = 'left', fixedType = '') {
    if (!['left', 'right'].includes(type) || (!this[`${type}ColumnCollapsible`] && this.isPcModeLayout))
      return;

    const hasLeftTitleSlot = this.hasSlotController.test('left-header');
    const hasRightTitleSlot = this.hasSlotController.test('right-header');
    const upperType = (type[0].toUpperCase() + type.slice(1)) as
      | 'Left'
      | 'Right';
    const isCollapsed = this[`_${type}Collapse`];
    const IconName = `page-collapse${
      (type === 'left' ? isCollapsed : !isCollapsed) ? 'd' : ''
    }-left--line`;
    const iconWrapperClass = classMap({
      'collapse-block': true,
      [type]: true,
      collapsed: isCollapsed,
      [fixedType]: true,
      'in-left-header': hasLeftTitleSlot,
      'in-right-header': hasRightTitleSlot,
    });
    return html`
      <div class="collapse-icon-wrapper ${isCollapsed ? 'collapsed' : ''}">
        <div
          class=${iconWrapperClass}
          @click=${(e: Event) => {
            e?.stopPropagation();
            if (!this.isPcModeLayout && type === 'left') {
              this.handleOuterCollapseLeft(isCollapsed ? 'show' : 'hide');
            } else {
              this[`_userCollapse${upperType}`] = true;
              this[`handleCollapse${upperType}`]?.();
            }
          }}
        >
          ${isCollapsed
            ? html` <sc-icon name=${IconName} size="sm"></sc-icon>`
            : html`
                <sc-icon-button
                  type="text"
                  name=${IconName}
                  size="sm"
                ></sc-icon-button>
              `}
        </div>
      </div>
    `;
  }

  renderLeftColumn() {
    const hasLeftTitleSlot = this.hasSlotController.test('left-header');
    const hasLeftActionSlot = this.hasSlotController.test('left-action');
    const useLeftDividerBorderResize = this.canResizeLeftColumn && !this.leftDividerInvisible;

    if (this.isPortraitLeftColumn) {
      // render in tablet portrait mode
      // when using auto height, the left-side-sheet will be fixed and with max height.
      const isContained = this.height === 'cover';
      let leftHeaderSlot: any = nothing;
      if (this.isPcDevice) {
        if (hasLeftTitleSlot && hasLeftActionSlot) {
          leftHeaderSlot = html`
            <div style="display: flex; flex-direction: column;">
              <slot name="left-header"></slot>
              <slot name="left-action"></slot>
            </div>
          `;
        } else {
          leftHeaderSlot = html`
            ${hasLeftTitleSlot ? html`<slot name="left-header" slot="label"><div style="min-height: 2rem;"></div></slot>` : null}
            ${hasLeftActionSlot ? html`<slot name="left-action" slot="label"></slot>` : null}
          `;
        }
      } else {
        leftHeaderSlot = html`
          <slot name="left-header" slot="label"></slot>
          <slot name="left-action" slot="footer"></slot>
        `;
      }

      return html`
        ${
          isContained ? html`
            <div 
              class="portrait-overlay left ${!this._leftCollapse ? 'show' : ''}"
              @click=${this.handleOuterCollapseLeft.bind(this, 'hide')}
            ></div>
          ` : nothing
        }
        ${
          (!this.isPcDevice || !this._leftCollapse || !this._leftCollapseTemp) ? html`
            <div class="tablet-left-collapse-icon-container ${this.isPcDevice ? 'pc-device' : ''} left ${this._leftCollapse ? 'collapsed' : ''}">
              ${this.renderCollapseIcon('left')}
            </div>
          ` : nothing
        }

        <div part="left-column" class="tablet-portrait grid-column left-column minor ${!this._leftCollapse ? 'show' : ''}" style="border-right: none;">
          <div style="width: ${this.computedLeftColumnSize}; height: 100%; position: relative;">
            <sc-side-sheet 
              class="left-side-sheet"
              position="left" 
              ?contained=${isContained}
              ?open=${!this._leftCollapse}
              width="${this.computedLeftColumnSize}"
              ?no-header=${!hasLeftTitleSlot && (!hasLeftActionSlot || !this.isPcDevice)}
              .noFooter=${this.isPcDevice || !hasLeftActionSlot}
              no-close-icon
              @sc-hide=${this.handleOuterCollapseLeft.bind(this, 'hide')} 
              style="
                --sc-sheet-body-spacing: var(--sc-layout-left-slot-spacing-tablet, var(--column-layout-left-panel-padding-top) var(--column-layout-left-panel-padding-x) var(--column-layout-left-panel-padding-bottom));
                ${isContained 
                  ? '--sc-sheet-overlay-display: none;' 
                  : '--sc-sheet-padding-bottom: calc(var(--bottom-offset) + var(--column-layout-left-panel-padding-bottom));'}
                overflow-x: hidden;
                --sc-sheet-panel-background: var(--sc-column-layout-sheet-background-color, var(--sc-color-white));
              "
            >
              ${leftHeaderSlot}
  
              <slot name="left"></slot>
            </sc-side-sheet>
          </div>
        </div>
      `;
    }

    // normal left-column
    return html`
      <sc-scrollbar selector=".grid-column.left-column" @sc-change=${this.handleScrollbarChange.bind(this, '.grid-column.left-column')}></sc-scrollbar>
      <div
        class="grid-column left-column ${this.columnSizes.left
          .isMain
          ? 'major'
          : 'minor'}"
        part="left-column"
        xs="${this.columnSizes.left.xs}"
        md="${this.columnSizes.left.md}"
        xl="${this.columnSizes.left.xl}"
        @mousemove=${useLeftDividerBorderResize
          ? (e: MouseEvent) => this.handlePanelBorderMouseMove('left', e)
          : null}
        @mouseleave=${useLeftDividerBorderResize
          ? () => this.handlePanelBorderMouseLeave('left')
          : null}
        @mousedown=${useLeftDividerBorderResize
          ? (e: MouseEvent) => this.handlePanelBorderMouseDown('left', e)
          : null}
        @touchstart=${useLeftDividerBorderResize && this.canTouchResize('left')
          ? (e: TouchEvent) => this.handlePanelBorderTouchStart('left', e)
          : null}
      >
        ${this.layoutType.isFull ||
        this.layoutType.isLeft ||
        !this.leftColumnCollapsible ||
        !this._leftCollapse
          ? html`
            <div
              class="column-content-container"
              style="position: relative;"
            >
              ${this.layoutType.isFull
                ? html`
                    ${this.renderHeader(false)}
                    
                    <sc-scrollbar selector=""></sc-scrollbar>
                    <div class="content-scroll-wrapper">
                      <slot name="content"></slot>
                    </div>

                    ${this.hasSlotController.test('content')
                      ? this.renderCustomIcons()
                      : nothing}
                  `
                : html`
                    ${this.layoutType.isLeft
                      ? this.renderHeader(false)
                      : nothing}
                    ${!this.columnSizes.left.isMain && 
                      (hasLeftTitleSlot || hasLeftActionSlot || this.leftColumnCollapsible)
                      ? html`<div
                          class="left-column-header-bar ${this.leftColumnCollapsible
                            ? 'collapsible'
                            : ''} ${this.leftHeaderDivider ? 'divider' : ''}"
                        >
                          ${!this._leftCollapse
                            ? this.renderCollapseIcon('left')
                            : nothing}
                            ${
                              hasLeftTitleSlot
                              ? html`
                                <sc-title level="5" style="margin-top: 0; margin-bottom: 0; width: 100%;">
                                  <slot name="left-header"></slot>
                                </sc-title>
                              `
                              : hasLeftActionSlot
                              ? html`
                                <slot name="left-action"></slot>
                              `
                              : nothing
                            }
                        </div>
                        ${
                          hasLeftTitleSlot && hasLeftActionSlot
                          ? html`
                            <div class="left-column-header-bar ${this.leftHeaderDivider ? 'divider' : ''}">
                              <slot name="left-action"></slot>
                            </div>
                          `
                          : nothing
                        }
                      `
                      : hasLeftTitleSlot ? html`
                        <div
                          class="left-column-header-bar ${this.leftHeaderDivider ? 'divider' : ''}"
                        >
                          <slot name="left-header"></slot>
                        </div>
                      ` : nothing
                    }

                    ${
                      this.columnSizes.left.isMain
                        ? html`
                          <sc-scrollbar selector=""></sc-scrollbar>
                          <div class="content-scroll-wrapper">
                            <slot name="left"></slot>
                          </div>
                        `
                        : html`
                          <sc-scrollbar selector=""></sc-scrollbar>
                          <div class="left-slot-wrapper">
                            <slot name="left"></slot>
                          </div>
                        `
                    }

                    ${this.canResizeLeftColumn && this.leftDividerInvisible && !this._leftCollapse
                      ? html`
                        <div
                              class="column-resize-handle left ${this
                                .isLeftResizeAffordanceActive
                                ? 'active'
                                : ''}"
                              @mousedown=${(e: MouseEvent) => {
                                this.startResizeDrag('left', e.clientX);
                                e.preventDefault();
                              }}
                              @touchstart=${this.canTouchResize('left')
                                ? (e: TouchEvent) => this.handleResizeHandleTouchStart('left', e)
                                : null}
                          @mouseenter=${() => this.handleResizeHover('left', true)}
                          @mouseleave=${() => this.handleResizeHover('left', false)}
                        ></div>
                      `
                      : nothing}

                    ${this.layoutType.isLeft &&
                    this.hasSlotController.test('left')
                      ? this.renderCustomIcons()
                      : nothing}
                  `}
            </div>
          `
        : null}
      </div>
    `;
  }

  renderRightColumn() {
    const hasRightTitleSlot = this.hasSlotController.test('right-header');
    const useRightDividerBorderResize = this.canResizeRightColumn && !this.rightDividerInvisible;

    if (this.isPortraitRightColumn) {
      // render in tablet portrait mode
      // tips: using the bottom-sheet animation, so need to change the open value immediately
      return html`
        <div part="right-column" class="tablet-portrait grid-column right-column minor ${!this._rightCollapse ? 'show' : ''}">
          <sc-bottom-sheet 
            class="bottom-side-sheet"
            ?open=${!this._rightCollapse && !this._rightCollapseTemp}
            expandable
            contained
            outer-action-title="${this.rightColumnTitle}"
            contained-with-overlay
            expand-height="60%"
            show-outer-action
            ?no-header=${!hasRightTitleSlot}
            no-close-icon
            @sc-show=${this.handleOuterCollapseRight.bind(this, 'show')}
            @sc-hide=${(this.handleOuterCollapseRight as any).bind(this, 'hide')} 
            style="
              --sc-bottom-sheet-body-padding: var(--sc-layout-right-slot-spacing-tablet, var(--column-layout-right-panel-padding-top) 1.25rem var(--column-layout-right-panel-padding-bottom));
            "
          >
            <div slot="draggable-area" class="draggable-bar" @click=${this.handleOuterCollapseRight.bind(this, '')}>
              <sc-icon name="arrow-ios-${this._rightCollapse ? 'up' : 'down'}ward"></sc-icon>
              <sc-paragraph>${this.rightColumnTitle}</sc-paragraph>
              <sc-icon name="drag-handle" class="rotate-90" @click=${this.preventDefault}></sc-icon>
            </div>

            <slot name="right-header" slot="label"></slot>

            <slot name="right"></slot>
          </sc-bottom-sheet>
        </div>
      `;
    }

    return html`
      <sc-scrollbar selector=".grid-column.right-column"  @sc-change=${this.handleScrollbarChange.bind(this, '.grid-column.right-column')}></sc-scrollbar>
      <div
        class="grid-column right-column ${this.columnSizes.right
          .isMain
          ? 'major'
          : 'minor'}"
        part="right-column"
        xs="${this.columnSizes.right.xs}"
        md="${this.columnSizes.right.md}"
        xl="${this.columnSizes.right.xl}"
        @mousemove=${useRightDividerBorderResize
          ? (e: MouseEvent) => this.handlePanelBorderMouseMove('right', e)
          : null}
        @mouseleave=${useRightDividerBorderResize
          ? () => this.handlePanelBorderMouseLeave('right')
          : null}
        @mousedown=${useRightDividerBorderResize
          ? (e: MouseEvent) => this.handlePanelBorderMouseDown('right', e)
          : null}
        @touchstart=${useRightDividerBorderResize && this.canTouchResize('right')
          ? (e: TouchEvent) => this.handlePanelBorderTouchStart('right', e)
          : null}
      >
        ${!this._rightCollapse && !this.layoutType.isFull
          ? html`
              <div class="column-content-container" style="position: relative;">
                ${this.layoutType.isRight
                  ? this.renderHeader(false)
                  : nothing}
                ${hasRightTitleSlot || this.rightColumnCollapsible
                  ? html`
                      <div class="right-column-header-bar ${this.rightHeaderDivider ? 'divider' : ''}">
                        ${this.rightColumnCollapsible
                          ? this.renderCollapseIcon('right')
                          : nothing}
                        <sc-title level="5" style="margin-top: 0; margin-bottom: 0; width: 100%;">
                          <slot name="right-header">${this.rightColumnTitle}</slot>
                        </sc-title>
                      </div>
                    `
                  : nothing}
                ${
                  this.columnSizes.right.isMain 
                    ? html`
                      <sc-scrollbar selector=""></sc-scrollbar>
                      <div class="content-scroll-wrapper">
                        <slot name="right"></slot>
                      </div>
                    `
                    : html`
                      <sc-scrollbar selector=""></sc-scrollbar>
                      <div class="right-slot-wrapper">
                        <slot name="right"></slot>
                      </div>
                    `
                }

                ${this.hasSlotController.test('right') &&
                this.layoutType.isRight
                  ? this.renderCustomIcons('right')
                  : nothing}

                ${this.canResizeRightColumn && this.rightDividerInvisible && !this._rightCollapse
                  ? html`
                    <div
                      class="column-resize-handle right ${this
                        .isRightResizeAffordanceActive
                        ? 'active'
                        : ''}"
                      @mousedown=${(e: MouseEvent) => {
                        this.startResizeDrag('right', e.clientX);
                        e.preventDefault();
                      }}
                      @touchstart=${this.canTouchResize('right')
                        ? (e: TouchEvent) => this.handleResizeHandleTouchStart('right', e)
                        : null}
                      @mouseenter=${() => this.handleResizeHover('right', true)}
                      @mouseleave=${() => this.handleResizeHover('right', false)}
                    ></div>
                  `
                  : nothing}
              </div>
              `
        : null}
      </div>
      ${(this.layoutType.isLeft || this.layoutType.isMiddle) &&
      this._rightCollapse
        ? this.renderCollapseIcon('right')
        : null}
    `;
  }

  render() {
    const hasStickySlot =
      this.hasSlotController.test('sticky-breadcrumb') ||
      this.hasSlotController.test('sticky-button');
    const hasTitleSlot = this.hasSlotController.test('title');
    const hasBreadcrumbSlot =
      this.hasSlotController.test('breadcrumb') || hasStickySlot;
    const hasLeftTitleSlot = this.hasSlotController.test('left-header');
    const hasLeftActionSlot = this.hasSlotController.test('left-action');
    const hasRightTitleSlot = this.hasSlotController.test('right-header');
    const classes = classMap({
      'content-wrapper': true,
      unfloatable: this.unfloatable,
      [`height-${this.height}`]: true,
      ...this.isPcModeLayout ? {
        'left-collapse': this._leftCollapseTemp,
        'right-collapse': this._rightCollapseTemp,
        normal: !this._rightCollapseTemp && !this._leftCollapseTemp,
        'click-collapse-left': this._recentCollapseType === 'left',
        'click-collapse-right': this._recentCollapseType === 'right',
        'right-collapsed': this._rightCollapse,
        'left-collapsed': this._leftCollapse,
        'manual-collapse': this._rightCollapseAction || this._leftCollapseAction,
      } : {
        // keep collpased for the normal columns in portrait mode
        'left-collapsed': this.isPortraitLeftColumn,
        'right-collapsed': this.isPortraitRightColumn,
      },
      'exclude-header-offset': !hasTitleSlot && !this.title,
      'exclude-breadcrumb-offset': !hasBreadcrumbSlot,
      'main-middle': this.layoutType.isMiddle,
      'main-left': this.layoutType.isLeft,
      'main-right': this.layoutType.isRight,
      'main-full': this.layoutType.isFull,
      'main-width-85': this._showMainContentZoomInIcon,
      zooming: this._mainContentZooming,
      'no-right-border': this.rightDividerInvisible,
      'no-left-border': this.leftDividerInvisible,
      'left-resizable': this.canResizeLeftColumn,
      'right-resizable': this.canResizeRightColumn,
      'resize-hover-left':
        this._resizeHoverType === 'left' || this.isLeftResizeAffordanceActive,
      'resize-hover-right':
        this._resizeHoverType === 'right' || this.isRightResizeAffordanceActive,
      resizing: this._isResizing,
    });
    const parentClasses = classMap({
      'sc-column-layout': true,
      'tablet-portrait-mode': !this.isPcModeLayout,
      container: true,
      'sticky-bar': hasStickySlot && this._fixedBar,
      'has-sticky-bar': hasStickySlot,
      'has-left-header': hasLeftTitleSlot,
      'has-left-action': hasLeftActionSlot,
      'has-right-header': hasRightTitleSlot,
      'has-left-header-divider': this.leftHeaderDivider,
      'has-right-header-divider': this.rightHeaderDivider,
      'standard-spacing': this.standardSpacing,
      'type-component': this.type === 'component',
      'is-split-view': this.isSplitView,
    });
    const tabletColumnClasses = classMap({
      'tablet-column-layout': true,
      'left-collapse': this._leftCollapseTemp,
      'left-collapsed': this._leftCollapse,
      'right-collapse': this._rightCollapseTemp,
      'right-collapsed': this._rightCollapse,
      [`height-${this.height}`]: true,
      'is-safari': this.isSafari,
      'has-right-column': this.isPortraitRightColumn,
    });
    
    return html`
      <sc-scrollbar selector=".sc-column-layout"></sc-scrollbar>
      <div
        class=${parentClasses}
        style="
        --column-layout-additional-offset: ${this.additionalSlotHeight || this._additionalOffset};
        --left-column-width: ${this.resolvedLeftColumnWidth};
        --right-column-width: ${this.resolvedRightColumnWidth};
      "
      >
        ${hasStickySlot
          ? html`
              <sc-scrollbar selector=".header-bar-container"></sc-scrollbar>
              <div class="header-bar-container" style="padding-top: ${this._fixedBar ? '1' : '0'}px;">
                <div class="header-bar">
                  <div><slot name="sticky-breadcrumb"></slot></div>
                  <div class="sticky-buttons">
                    <slot
                      name="sticky-button"
                      @slotchange=${this.stickyButtonsChanged}
                    ></slot>
                  </div>
                </div>
              </div>
            `
          : null}
        ${!hasStickySlot && hasBreadcrumbSlot
          ? html`
              <sc-scrollbar selector=".breadcrumb-wrapper"></sc-scrollbar>
              <div class="breadcrumb-wrapper">
                <slot name="breadcrumb"></slot>
              </div>
            `
          : null}

        <div class="page-content">
          ${this.renderHeader(true)}
          <sc-scrollbar selector=".additional-wrapper"></sc-scrollbar>
          <div class="additional-wrapper">
            <slot name="additional"></slot>
          </div>
          <sc-scrollbar selector=".content-wrapper"></sc-scrollbar>
          <div class=${classes}>
            <div class="row-wrapper">
              <sc-scrollbar selector=".grid-row"></sc-scrollbar>
              <div class="grid-row">
                ${!this.isPortraitLeftColumn ? this.renderLeftColumn() : nothing}

                ${!(this.layoutType.isFull || this.layoutType.isLeft) &&
                this._leftCollapse && (this.isPcDevice || !this.isPortraitLeftColumn)
                  ? this.renderCollapseIcon('left')
                  : null}
                
                ${this.layoutType.isMiddle
                  ? html`
                      <sc-scrollbar selector=".grid-column.middle-column"  @sc-change=${this.handleScrollbarChange.bind(this, '.grid-column.middle-column')}></sc-scrollbar>
                      <div
                        class="grid-column middle-column ${this.columnSizes
                          .middle.isMain
                          ? 'major'
                          : 'minor'}"
                        part="middle-column"
                        xs="${this.columnSizes.middle.xs}"
                        md="${this.columnSizes.middle.md}"
                        xl="${this.columnSizes.middle.xl}"
                      >
                        <div
                          class="column-content-container"
                          style="position: relative;"
                        >
                          ${this.renderHeader(false)}
                          <sc-scrollbar selector=""></sc-scrollbar>
                          <div class="content-scroll-wrapper">
                            <slot name="middle"></slot>
                          </div>

                          ${this.hasSlotController.test('middle')
                            ? this.renderCustomIcons()
                            : nothing}
                        </div>
                      </div>
                    `
                  : null}
                
                ${!this.isPortraitRightColumn ? this.renderRightColumn() : nothing}
              </div>
              <!-- keep the slot dom when collapsed -->
              ${this._leftCollapse && !this.isPortraitLeftColumn &&
              !(this.layoutType.isFull || this.layoutType.isLeft)
                ? html`
                    <div class="collapse-panel left">
                      <div class="collapse-wrapper left">
                        <slot name="left"></slot>
                      </div>
                    </div>
                  `
                : null}
              ${this._rightCollapse && !this.isPortraitRightColumn &&
              (this.layoutType.isLeft || this.layoutType.isMiddle)
                ? html`
                    <div class="collapse-panel right">
                      <div class="collapse-right-wrapper">
                        <slot name="right"></slot>
                      </div>
                    </div>
                  `
                : null}
            </div>
          </div>
        </div>

        <div class=${tabletColumnClasses}>
          ${this.isPortraitLeftColumn && this._alreadyFirstUpdated ? this.renderLeftColumn() : nothing}
          ${this.isPortraitRightColumn && this._alreadyFirstUpdated ? this.renderRightColumn() : nothing}
        </div>
      </div>
    `;
  }
}

