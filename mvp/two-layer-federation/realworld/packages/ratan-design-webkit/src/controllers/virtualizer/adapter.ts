import { animationFrame, microTask, timeOut } from './async.js';
import { isSafari } from './browser-utils.js';
import { Debouncer, flush } from './debounce.js';
import { ironList } from './core.js';
import { TConfig } from './typeutils.js';

type TMetaEl = {
  __virtualizerPlaceholder: boolean;
  __lastUpdatedIndex: number;
  __virtualIndex: number;
};

const MAX_VIRTUAL_COUNT = 100000;
const OFFSET_ADJUST_MIN_THRESHOLD = 1000;

export class IronListAdapter {
  isAttached = true;
  private _vidxOffset = 0;
  private _maxPages = 1.3;
  private __elementHeightQueue = Array(10);
  private __placeholderHeight = 200;
  private __resizeObserver: ResizeObserver;
  private _scrollLineHeight: number | undefined;
  private __mouseDown: boolean;
  private __pendingReorder: boolean;
  createElements: TConfig['createElements'];
  updateElement: TConfig['updateElement'];
  scrollTarget: TConfig['scrollTarget'];
  scrollContainer: TConfig['scrollContainer'];
  elementsContainer: HTMLElement;
  reorderElements: TConfig['reorderElements'];
  createCallback?: () => void | undefined;
  firstVisibleIndex: number;
  lastVisibleIndex: number;
  _virtualCount: any;
  __pendingScrollToIndex: any;
  _physicalCount: number;
  __skipNextVirtualIndexAdjust: boolean;
  _maxScrollTop: number;
  grid: any;
  __fixInvalidItemPositioningDebouncer: any;
  __scrollReorderDebouncer: any;
  __debouncerWheelAnimationFrame: any;
  _physicalAverageCount: any;
  _physicalAverage: any;
  _physicalSizes: any;
  _physicalItems: any;
  _physicalSize: number;
  __preventElementUpdates: any;
  __placeholderClearDebouncer: any;
  __size: any;
  _debouncers: any;
  _isVisible: any;
  _scrollerPaddingTop: number;
  _isRTL: boolean;
  _viewportWidth: number;
  _viewportHeight: number;
  _scrollPageHeight: number;
  __clientFull: boolean;
  __previousScrollTop: number;
  _scrollPosition: number;
  _physicalTop: any;
  _virtualStart: any;
  _physicalStart: any;
  _physicalBottom: any;
  _scrollBottom: any;
  _ratio: any;
  _deltaYAcc: any;
  _wheelAnimationFrame: any;
  _hasResidualMomentum: boolean;
  _ignoreNewWheel: boolean;
  _debouncerIgnoreNewWheel: any;
  _previousMomentum: number;
  _optPhysicalSize: any;

  constructor({
    createElements,
    updateElement,
    scrollTarget,
    scrollContainer,
    elementsContainer,
    reorderElements,
    createCallback,
  }: TConfig) {
    this.createElements = createElements;
    this.updateElement = updateElement;
    this.scrollTarget = scrollTarget;
    this.scrollContainer = scrollContainer;
    this.elementsContainer = elementsContainer || scrollContainer;
    this.reorderElements = reorderElements;
    this.createCallback = createCallback;

    // @ts-ignore
    this.timeouts = {
      SCROLL_REORDER: 500,
      IGNORE_WHEEL: 500,
      FIX_INVALID_ITEM_POSITIONING: 100,
    };

    // @ts-ignore
    this.__resizeObserver = new ResizeObserver(() => this._resizeHandler());

    if (getComputedStyle(this.scrollTarget).overflow === 'visible') {
      this.scrollTarget.style.overflow = 'auto';
    }

    if (getComputedStyle(this.scrollContainer).position === 'static') {
      this.scrollContainer.style.position = 'relative';
    }

    this.__resizeObserver.observe(this.scrollTarget);
    this.scrollTarget.addEventListener('scroll', () => this._scrollHandler());

    this._scrollLineHeight = this._getScrollLineHeight();
    this.scrollTarget.addEventListener('wheel', (e) => this.__onWheel(e));

    this.scrollTarget.addEventListener('virtualizer-element-focused', (e) =>
      this.__onElementFocused(e),
    );
    this.elementsContainer.addEventListener('focusin', () => {
      this.scrollTarget.dispatchEvent(
        new CustomEvent('virtualizer-element-focused', {
          detail: { element: this.__getFocusedElement() },
        }),
      );
    });

    if (this.reorderElements) {
      this.scrollTarget.addEventListener('mousedown', () => {
        this.__mouseDown = true;
      });
      this.scrollTarget.addEventListener('mouseup', () => {
        this.__mouseDown = false;
        if (this.__pendingReorder) {
          this.__reorderElements();
        }
      });
    }
  }

  get scrollOffset() {
    return 0;
  }

  get adjustedFirstVisibleIndex() {
    return this.firstVisibleIndex + this._vidxOffset;
  }

  get adjustedLastVisibleIndex() {
    return this.lastVisibleIndex + this._vidxOffset;
  }

  get _maxVirtualIndexOffset() {
    return this.size - this._virtualCount;
  }

  __hasPlaceholders() {
    return this.__getVisibleElements().some((el: any) => el.__virtualizerPlaceholder);
  }

  scrollToIndex(index?: number) {
    if (
      typeof index !== 'number' ||
      isNaN(index) ||
      this.size === 0 ||
      !this.scrollTarget.offsetHeight
    ) {
      return;
    }
    delete this.__pendingScrollToIndex;

    if (this._physicalCount <= 3) {
      this.flush();
    }

    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    index = this._clamp(index, 0, this.size - 1) as number;

    const visibleElementCount = this.__getVisibleElements().length;
    let targetVirtualIndex = Math.floor((index / this.size) * this._virtualCount);
    if (this._virtualCount - targetVirtualIndex < visibleElementCount) {
      targetVirtualIndex = this._virtualCount - (this.size - index);
      this._vidxOffset = this._maxVirtualIndexOffset;
    } else if (targetVirtualIndex < visibleElementCount) {
      if (index < OFFSET_ADJUST_MIN_THRESHOLD) {
        targetVirtualIndex = index;
        this._vidxOffset = 0;
      } else {
        targetVirtualIndex = OFFSET_ADJUST_MIN_THRESHOLD;
        this._vidxOffset = index - targetVirtualIndex;
      }
    } else {
      this._vidxOffset = index - targetVirtualIndex;
    }

    this.__skipNextVirtualIndexAdjust = true;
    // @ts-ignore
    super.scrollToIndex(targetVirtualIndex);

    if (
      this.adjustedFirstVisibleIndex !== index &&
      this._scrollTop < this._maxScrollTop &&
      !this.grid
    ) {
      this._scrollTop -= this.__getIndexScrollOffset(index) || 0;
    }
    this._scrollHandler();

    if (this.__hasPlaceholders()) {
      this.__pendingScrollToIndex = index;
    }
  }

  flush() {
    if (this.scrollTarget.offsetHeight === 0) {
      return;
    }
    // @ts-ignore
    this._resizeHandler();
    flush();
    this._scrollHandler();
    if (this.__fixInvalidItemPositioningDebouncer) {
      this.__fixInvalidItemPositioningDebouncer.flush();
    }
    if (this.__scrollReorderDebouncer) {
      this.__scrollReorderDebouncer.flush();
    }
    if (this.__debouncerWheelAnimationFrame) {
      this.__debouncerWheelAnimationFrame.flush();
    }
  }

  update(startIndex = 0, endIndex = this.size - 1) {
    const updatedElements: (HTMLElement & TMetaEl)[] = [];
    this.__getVisibleElements().forEach((el: any) => {
      if (el.__virtualIndex >= startIndex && el.__virtualIndex <= endIndex) {
        this.__updateElement(el, el.__virtualIndex, true);
        updatedElements.push(el);
      }
    });

    this.__afterElementsUpdated(updatedElements);
  }

  _updateMetrics(itemSet: number[]) {
    flush();

    let newPhysicalSize = 0;
    let oldPhysicalSize = 0;
    const prevAvgCount = this._physicalAverageCount;
    const prevPhysicalAvg = this._physicalAverage;

    // @ts-ignore
    this._iterateItems((pidx) => {
      oldPhysicalSize += this._physicalSizes[pidx];
      this._physicalSizes[pidx] = Math.ceil(this.__getBorderBoxHeight(this._physicalItems[pidx]));
      newPhysicalSize += this._physicalSizes[pidx];
      this._physicalAverageCount += this._physicalSizes[pidx] ? 1 : 0;
    }, itemSet);

    this._physicalSize = this._physicalSize + newPhysicalSize - oldPhysicalSize;

    if (this._physicalAverageCount !== prevAvgCount) {
      this._physicalAverage = Math.round(
        (prevPhysicalAvg * prevAvgCount + newPhysicalSize) / this._physicalAverageCount,
      );
    }
  }

  __getBorderBoxHeight(el: Element) {
    const style = getComputedStyle(el);

    const itemHeight = parseFloat(style.height) || 0;

    if (style.boxSizing === 'border-box') {
      return itemHeight;
    }

    const paddingBottom = parseFloat(style.paddingBottom) || 0;
    const paddingTop = parseFloat(style.paddingTop) || 0;
    const borderBottomWidth = parseFloat(style.borderBottomWidth) || 0;
    const borderTopWidth = parseFloat(style.borderTopWidth) || 0;

    return itemHeight + paddingBottom + paddingTop + borderBottomWidth + borderTopWidth;
  }

  __updateElement(el: HTMLElement & TMetaEl, index: number, forceSameIndexUpdates?: boolean) {
    if (el.__virtualizerPlaceholder) {
      el.style.paddingTop = '';
      el.style.opacity = '';
      el.__virtualizerPlaceholder = false;
    }

    if (
      !this.__preventElementUpdates &&
      (el.__lastUpdatedIndex !== index || forceSameIndexUpdates)
    ) {
      this.updateElement(el, index);
      el.__lastUpdatedIndex = index;
    }
  }

  __afterElementsUpdated(updatedElements: (HTMLElement & TMetaEl)[]) {
    updatedElements.forEach((el) => {
      const elementHeight = el.offsetHeight;
      if (elementHeight === 0) {
        el.style.paddingTop = `${this.__placeholderHeight}px`;
        el.style.opacity = '0';
        el.__virtualizerPlaceholder = true;

        this.__placeholderClearDebouncer = Debouncer.debounce(
          this.__placeholderClearDebouncer,
          animationFrame,
          // @ts-ignore
          () => this._resizeHandler(),
        );
      } else {
        this.__elementHeightQueue.push(elementHeight);
        this.__elementHeightQueue.shift();

        const filteredHeights = this.__elementHeightQueue.filter((h) => h !== undefined);
        this.__placeholderHeight = Math.round(
          filteredHeights.reduce((a, b) => a + b, 0) / filteredHeights.length,
        );
      }
    });

    if (this.__pendingScrollToIndex !== undefined && !this.__hasPlaceholders()) {
      this.scrollToIndex(this.__pendingScrollToIndex);
    }
  }

  __getIndexScrollOffset(index: number) {
    const element = this.__getVisibleElements().find((el) => el.__virtualIndex === index);
    return element
      ? this.scrollTarget.getBoundingClientRect().top - element.getBoundingClientRect().top
      : undefined;
  }

  get size() {
    return this.__size;
  }

  set size(size) {
    if (size === this.size) {
      return;
    }
    if (this.__fixInvalidItemPositioningDebouncer) {
      this.__fixInvalidItemPositioningDebouncer.cancel();
    }
    if (this._debouncers && this._debouncers._increasePoolIfNeeded) {
      this._debouncers._increasePoolIfNeeded.cancel();
    }

    this.__preventElementUpdates = true;

    let fvi: number;
    let fviOffsetBefore;
    if (size > 0) {
      fvi = this.adjustedFirstVisibleIndex;
      fviOffsetBefore = this.__getIndexScrollOffset(fvi);
    }

    this.__size = size;

    // @ts-ignore
    this._itemsChanged({
      path: 'items',
    });
    flush();

    if (size > 0) {
      // @ts-ignore
      fvi = Math.min(fvi, size - 1);
      this.scrollToIndex(fvi);

      const fviOffsetAfter = this.__getIndexScrollOffset(fvi);
      if (fviOffsetBefore !== undefined && fviOffsetAfter !== undefined) {
        this._scrollTop += fviOffsetBefore - fviOffsetAfter;
      }
    }

    this.__preventElementUpdates = false;

    if (!this._isVisible) {
      this._assignModels();
    }

    if (!this.elementsContainer.children.length) {
      // @ts-ignore
      requestAnimationFrame(() => this._resizeHandler());
    }

    // @ts-ignore
    this._resizeHandler();
    flush();
    // @ts-ignore
    this._debounce('_update', this._update, microTask);
  }

  get _scrollTop() {
    return this.scrollTarget.scrollTop;
  }

  set _scrollTop(top) {
    this.scrollTarget.scrollTop = top;
  }

  get items() {
    return {
      length: Math.min(this.size, MAX_VIRTUAL_COUNT),
    };
  }

  get offsetHeight() {
    return this.scrollTarget.offsetHeight;
  }

  get $() {
    return {
      items: this.scrollContainer,
    };
  }

  updateViewportBoundaries() {
    const styles = window.getComputedStyle(this.scrollTarget);
    this._scrollerPaddingTop =
      // @ts-ignore
      this.scrollTarget === this ? 0 : parseInt(styles['padding-top'], 10);
    this._isRTL = Boolean(styles.direction === 'rtl');
    this._viewportWidth = this.elementsContainer.offsetWidth;
    this._viewportHeight = this.scrollTarget.offsetHeight;
    this._scrollPageHeight = this._viewportHeight - this._scrollLineHeight!; // eslint-disable-line
    if (this.grid) {
      // @ts-ignore
      this._updateGridMetrics();
    }
  }

  setAttribute() {}

  _createPool(size: number) {
    const isInitial = !this.elementsContainer.innerText;
    const physicalItems = this.createElements(size);
    const fragment = document.createDocumentFragment();
    physicalItems.forEach((el) => {
      el.style.position = 'absolute';
      fragment.appendChild(el);
      this.__resizeObserver.observe(el);
    });
    this.elementsContainer.appendChild(fragment);
    if (isInitial) {
      this.createCallback?.();
    }
    return physicalItems;
  }

  _assignModels(itemSet?: number[]) {
    const updatedElements: (HTMLElement & TMetaEl)[] = [];
    // @ts-ignore
    this._iterateItems((pidx, vidx) => {
      const el = this._physicalItems[pidx];
      el.hidden = vidx >= this.size;
      if (!el.hidden) {
        el.__virtualIndex = vidx + (this._vidxOffset || 0);
        this.__updateElement(el, el.__virtualIndex);
        updatedElements.push(el);
      } else {
        delete el.__lastUpdatedIndex;
      }
    }, itemSet);

    this.__afterElementsUpdated(updatedElements);
  }

  _isClientFull() {
    setTimeout(() => {
      this.__clientFull = true;
    });
    // @ts-ignore
    return this.__clientFull || super._isClientFull();
  }

  translate3d(_x: string, y: string, _z: string, el: HTMLElement) {
    el.style.transform = `translateY(${y})`;
  }

  toggleScrollListener() {}

  __getFocusedElement(visibleElements = this.__getVisibleElements()) {
    return visibleElements.find(
      (element) =>
        element.contains(
          (this.elementsContainer.getRootNode() as Document | ShadowRoot).activeElement,
        ) ||
        element.contains((this.scrollTarget.getRootNode() as Document | ShadowRoot).activeElement),
    );
  }

  __nextFocusableSiblingMissing(
    focusedElement: HTMLElement & TMetaEl,
    visibleElements: HTMLElement[],
  ) {
    return (
      visibleElements.indexOf(focusedElement) === visibleElements.length - 1 &&
      this.size > focusedElement.__virtualIndex + 1
    );
  }

  __previousFocusableSiblingMissing(
    focusedElement: HTMLElement & TMetaEl,
    visibleElements: HTMLElement[],
  ) {
    return visibleElements.indexOf(focusedElement) === 0 && focusedElement.__virtualIndex > 0;
  }

  __onElementFocused(e: any) {
    if (!this.reorderElements) {
      return;
    }

    const focusedElement = e.detail.element;
    if (!focusedElement) {
      return;
    }

    const visibleElements = this.__getVisibleElements();
    if (
      this.__previousFocusableSiblingMissing(focusedElement, visibleElements) ||
      this.__nextFocusableSiblingMissing(focusedElement, visibleElements)
    ) {
      this.flush();
    }

    const reorderedVisibleElements = this.__getVisibleElements();
    if (this.__nextFocusableSiblingMissing(focusedElement, reorderedVisibleElements)) {
      this._scrollTop +=
        Math.ceil(focusedElement.getBoundingClientRect().bottom) -
        Math.floor(this.scrollTarget.getBoundingClientRect().bottom - 1);
      this.flush();
    } else if (this.__previousFocusableSiblingMissing(focusedElement, reorderedVisibleElements)) {
      this._scrollTop -=
        Math.ceil(this.scrollTarget.getBoundingClientRect().top + 1) -
        Math.floor(focusedElement.getBoundingClientRect().top);
      this.flush();
    }
  }

  _scrollHandler() {
    if (this.scrollTarget.offsetHeight === 0) {
      return;
    }

    this._adjustVirtualIndexOffset(this._scrollTop - (this.__previousScrollTop || 0));
    const delta = this.scrollTarget.scrollTop - this._scrollPosition;

    // @ts-ignore
    super._scrollHandler();

    if (this._physicalCount !== 0) {
      const isScrollingDown = delta >= 0;
      // @ts-ignore
      const reusables = this._getReusables(!isScrollingDown);

      if (reusables.indexes.length) {
        this._physicalTop = reusables.physicalTop;

        if (isScrollingDown) {
          this._virtualStart -= reusables.indexes.length;
          this._physicalStart -= reusables.indexes.length;
        } else {
          this._virtualStart += reusables.indexes.length;
          this._physicalStart += reusables.indexes.length;
        }
        // @ts-ignore
        this._resizeHandler();
      }
    }

    if (delta) {
      this.__fixInvalidItemPositioningDebouncer = Debouncer.debounce(
        this.__fixInvalidItemPositioningDebouncer,
        // @ts-ignore
        timeOut.after(this.timeouts.FIX_INVALID_ITEM_POSITIONING),
        () => this.__fixInvalidItemPositioning(),
      );
    }

    if (this.reorderElements) {
      this.__scrollReorderDebouncer = Debouncer.debounce(
        this.__scrollReorderDebouncer,
        // @ts-ignore
        timeOut.after(this.timeouts.SCROLL_REORDER),
        () => this.__reorderElements(),
      );
    }

    this.__previousScrollTop = this._scrollTop;

    if (this._scrollTop === 0 && this.firstVisibleIndex !== 0 && Math.abs(delta) > 0) {
      this.scrollToIndex(0);
    }
  }
  __fixInvalidItemPositioning() {
    if (!this.scrollTarget.isConnected) {
      return;
    }

    const physicalTopBelowTop = this._physicalTop > this._scrollTop;
    const physicalBottomAboveBottom = this._physicalBottom < this._scrollBottom;

    const firstIndexVisible = this.adjustedFirstVisibleIndex === 0;
    const lastIndexVisible = this.adjustedLastVisibleIndex === this.size - 1;

    if (
      (physicalTopBelowTop && !firstIndexVisible) ||
      (physicalBottomAboveBottom && !lastIndexVisible)
    ) {
      const isScrollingDown = physicalBottomAboveBottom;
      const originalRatio = this._ratio;
      this._ratio = 0;
      this._scrollPosition = this._scrollTop + (isScrollingDown ? -1 : 1);
      this._scrollHandler();
      this._ratio = originalRatio;
    }
  }

  __onWheel(e: WheelEvent) {
    if (e.ctrlKey || this._hasScrolledAncestor(e.target, e.deltaX, e.deltaY)) {
      return;
    }

    let deltaY = e.deltaY;
    if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      deltaY *= this._scrollLineHeight!; // eslint-disable-line
    } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      deltaY *= this._scrollPageHeight;
    }

    if (!this._deltaYAcc) {
      this._deltaYAcc = 0;
    }

    if (this._wheelAnimationFrame) {
      this._deltaYAcc += deltaY;
      e.preventDefault();
      return;
    }

    deltaY += this._deltaYAcc;
    this._deltaYAcc = 0;

    this._wheelAnimationFrame = true;
    this.__debouncerWheelAnimationFrame = Debouncer.debounce(
      this.__debouncerWheelAnimationFrame,
      animationFrame,
      () => {
        this._wheelAnimationFrame = false;
      },
    );

    const momentum = Math.abs(e.deltaX) + Math.abs(deltaY);

    if (this._canScroll(this.scrollTarget, e.deltaX, deltaY)) {
      e.preventDefault();
      this.scrollTarget.scrollTop += deltaY;
      this.scrollTarget.scrollLeft += e.deltaX;

      this._hasResidualMomentum = true;

      this._ignoreNewWheel = true;
      this._debouncerIgnoreNewWheel = Debouncer.debounce(
        this._debouncerIgnoreNewWheel,
        // @ts-ignore
        timeOut.after(this.timeouts.IGNORE_WHEEL),
        () => {
          this._ignoreNewWheel = false;
        },
      );
    } else if (
      (this._hasResidualMomentum && momentum <= this._previousMomentum) ||
      this._ignoreNewWheel
    ) {
      e.preventDefault();
    } else if (momentum > this._previousMomentum) {
      this._hasResidualMomentum = false;
    }
    this._previousMomentum = momentum;
  }

  // @ts-ignore
  _hasScrolledAncestor(el: any, deltaX: number, deltaY: number) {
    if (el === this.scrollTarget || el === (this.scrollTarget.getRootNode() as ShadowRoot).host) {
      return false;
    } else if (
      this._canScroll(el, deltaX, deltaY) &&
      ['auto', 'scroll'].indexOf(getComputedStyle(el).overflow) !== -1
    ) {
      return true;
      // @ts-ignore
    } else if (el !== this && el.parentElement) {
      return this._hasScrolledAncestor(el.parentElement, deltaX, deltaY);
    }
  }

  _canScroll(el: HTMLElement, deltaX: number, deltaY: number) {
    return (
      (deltaY > 0 && el.scrollTop < el.scrollHeight - el.offsetHeight) ||
      (deltaY < 0 && el.scrollTop > 0) ||
      (deltaX > 0 && el.scrollLeft < el.scrollWidth - el.offsetWidth) ||
      (deltaX < 0 && el.scrollLeft > 0)
    );
  }

  _increasePoolIfNeeded(count: number) {
    if (this._physicalCount > 2 && count) {
      const totalItemCount = Math.ceil(this._optPhysicalSize / this._physicalAverage);
      const missingItemCount = totalItemCount - this._physicalCount;
      // @ts-ignore
      super._increasePoolIfNeeded(Math.max(count, Math.min(100, missingItemCount)));
    } else {
      // @ts-ignore
      super._increasePoolIfNeeded(count);
    }
  }

  _getScrollLineHeight() {
    const el = document.createElement('div');
    el.style.fontSize = 'initial';
    el.style.display = 'none';
    document.body.appendChild(el);
    const fontSize = window.getComputedStyle(el).fontSize;
    document.body.removeChild(el);
    return fontSize ? window.parseInt(fontSize) : undefined;
  }

  __getVisibleElements() {
    return Array.from(this.elementsContainer.children).filter(
      (element: any) => !element.hidden,
    ) as (HTMLElement & TMetaEl)[];
  }

  __reorderElements() {
    if (this.__mouseDown) {
      this.__pendingReorder = true;
      return;
    }
    this.__pendingReorder = false;

    const adjustedVirtualStart = this._virtualStart + (this._vidxOffset || 0);

    const visibleElements = this.__getVisibleElements();
    const targetElement = this.__getFocusedElement(visibleElements) || visibleElements[0];
    if (!targetElement) {
      return;
    }

    const targetPhysicalIndex = targetElement.__virtualIndex - adjustedVirtualStart;

    const delta = visibleElements.indexOf(targetElement) - targetPhysicalIndex;
    if (delta > 0) {
      for (let i = 0; i < delta; i++) {
        this.elementsContainer.appendChild(visibleElements[i]);
      }
    } else if (delta < 0) {
      for (let i = visibleElements.length + delta; i < visibleElements.length; i++) {
        this.elementsContainer.insertBefore(visibleElements[i], visibleElements[0]);
      }
    }

    if (isSafari) {
      const { transform } = this.scrollTarget.style;
      this.scrollTarget.style.transform = 'translateZ(0)';
      setTimeout(() => {
        this.scrollTarget.style.transform = transform;
      });
    }
  }

  _adjustVirtualIndexOffset(delta: number) {
    const maxOffset = this._maxVirtualIndexOffset;

    if (this._virtualCount >= this.size) {
      this._vidxOffset = 0;
    } else if (this.__skipNextVirtualIndexAdjust) {
      this.__skipNextVirtualIndexAdjust = false;
    } else if (Math.abs(delta) > 10000) {
      const scale =
        this._scrollTop / (this.scrollTarget.scrollHeight - this.scrollTarget.clientHeight);
      this._vidxOffset = Math.round(scale * maxOffset);
    } else {
      const oldOffset = this._vidxOffset;
      const threshold = OFFSET_ADJUST_MIN_THRESHOLD;
      const maxShift = 100;

      if (this._scrollTop === 0) {
        this._vidxOffset = 0;
        if (oldOffset !== this._vidxOffset) {
          // @ts-ignore
          super.scrollToIndex(0);
        }
      } else if (this.firstVisibleIndex < threshold && this._vidxOffset > 0) {
        this._vidxOffset -= Math.min(this._vidxOffset, maxShift);
        // @ts-ignore
        super.scrollToIndex(this.firstVisibleIndex + (oldOffset - this._vidxOffset));
      }

      if (this._scrollTop >= this._maxScrollTop && this._maxScrollTop > 0) {
        this._vidxOffset = maxOffset;
        if (oldOffset !== this._vidxOffset) {
          // @ts-ignore
          super.scrollToIndex(this._virtualCount - 1);
        }
      } else if (
        this.firstVisibleIndex > this._virtualCount - threshold &&
        this._vidxOffset < maxOffset
      ) {
        this._vidxOffset += Math.min(maxOffset - this._vidxOffset, maxShift);
        // @ts-ignore
        super.scrollToIndex(this.firstVisibleIndex - (this._vidxOffset - oldOffset));
      }
    }
  }
}

Object.setPrototypeOf(IronListAdapter.prototype, ironList);
