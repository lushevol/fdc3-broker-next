import { html, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScPaginationStyle from './ScPagination.style.js';
import { classMap } from 'lit/directives/class-map.js';
import { watch } from '../../shared/watch.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-spinner.js';
import '../../../elements/sc-dropdown-input.js';
import { debounce } from '../../shared/debounce.js';

type PaginationSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface PageItem {
  page: number;
  disabled: boolean;
}

interface EllipsisItem {
  ellipsis: 'prev' | 'next';
}

type PaginationItem = PageItem | EllipsisItem;

export class ScPagination extends ScElement {
  static styles = ScTheme.getStyles().concat([ScPaginationStyle]);

  private get isDocument() {
    return this.mode === 'document';
  }

  @state() private pageBufferSize = 1;
  @state() private selectedPage = 1;
  @state() private pages: PaginationItem[] = [];
  @state() private selectedPageSize = 10;
  @state() private inputValue = '';
  @state() private maxPagesInLine = 7;


  @property() size: `${PaginationSize}` = 'md';

  @property({ type: Number }) total = 0;
  @property({ type: Boolean }) label = false;
  @property({ type: Number, attribute: 'page-size' }) pageSize = 10;
  @property({ type: Boolean, attribute: 'quick-jumper' }) quickJumper = false;
  @property({ type: Boolean, attribute: 'size-changer' }) sizeChanger = false;
  @property({ type: Number, attribute: 'current-page' }) currentPage = 1;
  @property({ type: Number, attribute: 'total-pages' }) totalPages = 0;
  @property({ type: String }) mode: 'default' | 'document' = 'default';
  @property({ type: String }) alignment: 'center' | 'left' | 'right' = 'center';
  @property({ type: Array, attribute: 'disabled-pages' })
  disabledPages: number[] = [];
  @property({ type: Boolean, attribute: 'no-truncation' }) noTruncation = false;
  @property({ type: Boolean, attribute: 'jump-first-last-page' })
  jumpFirstLastPage = false;
  @property({ type: Array, attribute: 'page-size-options' })
  pageSizeOptions: number[] = [];
  @property({ type: Boolean, attribute: 'no-margin', reflect: true }) noMargin = false;

  /** Whether loading state is active */
  @property({ type: Boolean, reflect: true }) loading = false;

  /** Which page/target is loading */
  @property({ type: String, attribute: 'loading-target' }) loadingTarget:
    | string
    | null = null;

  sizeChangeObserver?: ResizeObserver;

  /* ====== LIFECYCLE ====== */

  connectedCallback() {
    super.connectedCallback();
    this.selectedPage = this.currentPage;
    this.selectedPageSize = this.pageSize;
    this.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeyDown);
    this.sizeChangeObserver?.disconnect();
  }

  firstUpdated() {
    this.screenSizeUpdated();
  }

  updated(properties: PropertyValues) {
    if (
      properties.has('current-page') &&
      properties.get('current-page') !== this.currentPage
    ) {
      this.selectedPage = this.currentPage;
    }
    if (this.isDocument) {
      if (properties.has('total-pages')) {
        this.requestUpdate();
      }
    } else {
      if (properties.has('total') && properties.get('total') !== this.total) {
        this.selectedPageSize = this.pageSize;
        this.generatePages({ emitEvents: false });
      }
    }
  }

  /* ====== KEYBOARD NAVIGATION ====== */

  private handleKeyDown = (e: KeyboardEvent) => {
    const activeEl = this.shadowRoot?.activeElement;
    if (activeEl?.tagName === 'INPUT') return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.goPrev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.goNext();
        break;
      case 'Home':
        e.preventDefault();
        this.goFirst();
        break;
      case 'End':
        e.preventDefault();
        this.goLast();
        break;
      case 'PageUp':
        e.preventDefault();
        this.jumpBackward();
        break;
      case 'PageDown':
        e.preventDefault();
        this.jumpForward();
        break;
      case 'Enter':
      case ' ':
        const target = e.composedPath()[0] as HTMLElement;
        if (
          target?.classList.contains('sc-pagination-item') ||
          target?.classList.contains('sc-pagination-jump-prev') ||
          target?.classList.contains('sc-pagination-jump-next')
        ) {
          e.preventDefault();
          target.click();
        }
        break;
    }
  };

  /* ====== RESPONSIVE HANDLING ====== */

  screenSizeUpdated(): void {
    this.updateComplete.then(() => {
      this.updateMaxPagesInLine();
      this.generatePages({ emitEvents: false });
    });
    const containerElement = this.shadowRoot?.querySelector(
      '.sc-pagination-container'
    );
    if (containerElement) {
      this.sizeChangeObserver = new ResizeObserver(() => {
        this.updateMaxPagesInLine();
        this.generatePages({ emitEvents: false });
      });
      this.sizeChangeObserver.observe(containerElement);
    }
  }

  updateMaxPagesInLine() {
    const containerElement = this.shadowRoot?.querySelector(
      '.sc-pagination-container'
    );
    if (containerElement) {
      const containerWidth = containerElement.clientWidth;
      if (containerWidth <= 380) {
        this.maxPagesInLine = 5;
      } else {
        this.maxPagesInLine = 7;
      }
    }
  }

  /* ====== LOADING STATE HELPERS ====== */

  private isTargetLoading(target: string | number): boolean {
    return this.loading && this.loadingTarget === String(target);
  }

  /* ====== PAGE CHANGE HANDLERS ====== */

  private handlePageClick(page: number) {
    this.selectedPage = page;
    this.generatePages({ emitEvents: true });
  }

  handleChange(p: number, preventEvent?: boolean) {
    if (p) {
      this.selectedPage = p;
      if (this.isDocument) {
        !preventEvent && this.emitChange();
        return;
      }
      this.generatePages({ emitEvents: !preventEvent });
    }
    if (this.quickJumper) {
      this.inputValue = '';
    }
  }

  @watch('currentPage', { waitUntilFirstUpdate: true })
  currentPageChange() {
    // It won't trigger sc-change event when setting currentPage property only by code.
    this.handleChange(Math.max(1, this.currentPage), true);
  }

  goPrev() {
    const maxPage = this.isDocument ? this.totalPages : this.calculatePage();
    if (
      this.selectedPage <= 1 ||
      (this.selectedPage === 2 && this.isPageDisabled(1))
    ) {
      return;
    }
    let prevPage = this.selectedPage - 1;
    while (prevPage > 0 && this.isPageDisabled(prevPage)) {
      prevPage--;
    }
    this.handleChange(Math.max(1, prevPage));
  }

  goNext() {
    const maxPage = this.isDocument ? this.totalPages : this.calculatePage();
    if (
      this.selectedPage >= maxPage ||
      (this.selectedPage === maxPage - 1 && this.isPageDisabled(maxPage))
    ) {
      return;
    }
    let nextPage = this.selectedPage + 1;
    while (nextPage <= maxPage && this.isPageDisabled(nextPage)) {
      nextPage++;
    }
    this.handleChange(Math.min(maxPage, nextPage));
  }

  goFirst() {
    let firstPage = 1;
    const maxPage = this.isDocument ? this.totalPages : this.calculatePage();
    while (firstPage <= maxPage && this.isPageDisabled(firstPage)) {
      firstPage++;
    }
    this.handleChange(Math.min(maxPage, firstPage));
  }

  goLast() {
    const maxPage = this.isDocument ? this.totalPages : this.calculatePage();
    let lastPage = maxPage;
    while (lastPage > 0 && this.isPageDisabled(lastPage)) {
      lastPage--;
    }
    this.handleChange(Math.max(1, lastPage));
  }

  jumpBackward() {
    const jumpAmount = this.maxPagesInLine - 2;
    const target = Math.max(1, this.selectedPage - jumpAmount);
    this.handleChange(target);
  }

  jumpForward() {
    const maxPage = this.isDocument ? this.totalPages : this.calculatePage();
    const jumpAmount = this.maxPagesInLine - 2;
    const target = Math.min(maxPage, this.selectedPage + jumpAmount);
    this.handleChange(target);
  }

  isPageDisabled(page: number): boolean {
    if (!this.disabledPages) return false;
    return this.disabledPages.includes(page);
  }

  calculatePage() {
    return Math.ceil(this.total / (this.selectedPageSize as number));
  }

  /* ====== PAGE GENERATION ====== */

  private generatePages(config?: { emitEvents?: boolean }) {
    if (this.mode === 'default') {
      this.totalPages = this.calculatePage();
      this.pages = [];

      if (!this.noTruncation && this.totalPages > this.maxPagesInLine) {
        this.pages.push(this.createPageItem(1));

        const needsLeftTruncation = this.selectedPage > 3;
        const needsRightTruncation = this.selectedPage < this.totalPages - 3;

        if (needsLeftTruncation && needsRightTruncation) {
          this.pages.push(this.createEllipsisItem('prev'));

          const startPage = this.selectedPage - 1;
          const endPage = this.selectedPage + 2;

          for (let i = startPage; i <= endPage; i++) {
            this.pages.push(this.createPageItem(i));
          }

          this.pages.push(this.createEllipsisItem('next'));
        } else if (needsLeftTruncation) {
          this.pages.push(this.createEllipsisItem('prev'));

          const startPage = this.totalPages - 4;
          const endPage = this.totalPages - 1;

          for (let i = startPage; i <= endPage; i++) {
            this.pages.push(this.createPageItem(i));
          }
        } else if (needsRightTruncation) {
          const startPage = 2;
          const endPage = 5;

          for (let i = startPage; i <= endPage; i++) {
            this.pages.push(this.createPageItem(i));
          }

          this.pages.push(this.createEllipsisItem('next'));
        }

        if (this.totalPages > 1) {
          this.pages.push(this.createPageItem(this.totalPages));
        }
      } else {
        for (let i = 1; i <= this.totalPages; i++) {
          this.pages.push(this.createPageItem(i));
        }
      }

      if (config?.emitEvents) {
        this.emitChange();
      }
    }
  }

  private createPageItem(page: number): PageItem {
    const isDisabled = this.disabledPages.includes(page);
    return { page, disabled: isDisabled };
  }

  private createEllipsisItem(position: 'prev' | 'next'): EllipsisItem {
    return { ellipsis: position };
  }

  emitChange() {
    this.emit('sc-change', {
      detail: {
        page: this.selectedPage,
        pageSize: this.selectedPageSize,
      },
    });
  }

  @watch(['noTruncation', 'disabledPages'], { waitUntilFirstUpdate: true })
  truncationChange() {
    this.generatePages({ emitEvents: true });
  }

  @watch('pageSize', { waitUntilFirstUpdate: true })
  pageSizeChange() {
    this.handlePageSizeChange(this.pageSize);
  }

  handlePageSizeChange(size: number) {
    if (size) {
      this.selectedPageSize = size;
      this.selectedPage = 1;
      this.generatePages({ emitEvents: true });
    }
  }

  /* ====== DROPDOWN HELPERS ====== */

  private getPageSizeData() {
    const options =
      this.pageSizeOptions?.length > 0
        ? this.pageSizeOptions
        : [10, 20, 30, 40];

    const perPageText = msg('/ page', { id: 'sc-pagination-per-page' });

    return options.map(val => ({
      label: () => html`<span>${val} ${perPageText}</span>`,
      value: String(val),
      displayValue: `${val} ${perPageText}`,
      children: undefined,
      disabled: undefined,
      hideOption: undefined,
    })) as any;
  }

  // Maps pagination size to one level down for navigation icons
  private getNavIconSize(): string {
    const sizeMap: Record<string, string> = {
      xs: 'xs',
      sm: 'xs',
      md: 'sm',
      lg: 'md',
      xl: 'lg',
    };
    return sizeMap[this.size] || 'sm';
  }

  private handlePageSizeSelect(e: CustomEvent) {
    const value = e.detail?.value;
    if (value) {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        this.selectedPageSize = numValue;
        this.selectedPage = 1;
        this.generatePages({ emitEvents: true });
      }
    }
  }

  private handleDropdownInput(e: Event) {
    e.preventDefault();
    const perPageText = msg('/ page', { id: 'sc-pagination-per-page' });
    const target = e.target as HTMLInputElement;
    if (target) {
      target.value = `${this.selectedPageSize} ${perPageText}`;
    }
  }

  private handleDropdownKeydown(e: KeyboardEvent) {
    const allowedKeys = ['Enter', ' ', 'ArrowUp', 'ArrowDown', 'Escape', 'Tab'];
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  }

  /* ====== QUICK JUMPER ====== */

  onInput(e: any) {
    this.inputValue = e.target.value.replace(/[^(\d)]/g, '');
    const inputEl = this.shadowRoot?.querySelector(
      '.sc-pagination-jump-to'
    ) as HTMLInputElement;
    if (inputEl) {
      inputEl.value = this.inputValue;
    }
    this.debounceJumpToPage();
  }

  debounceJumpToPage = debounce(async () => {
    this.jumpToPage();
  }, 500);

  jumpToPage() {
    if (Number(this.inputValue)) {
      const maxPage = this.isDocument ? this.totalPages : this.calculatePage();
      this.selectedPage = Math.min(Number(this.inputValue), maxPage);

      if (this.isDocument) {
        this.emitChange();
      } else {
        this.generatePages({ emitEvents: true });
      }
    }
  }

  /* ====== RENDER HELPERS ====== */

  private renderNavButton(
    title: string,
    className: string,
    isDisabled: boolean,
    clickHandler: () => void,
    iconName: string,
    targetId: 'prev' | 'next' | 'first' | 'last'
  ) {
    const isLoading = this.isTargetLoading(targetId);

    return html`
      <li
        title=${title}
        class=${classMap({
          [className]: true,
          disabled: isDisabled,
          loading: isLoading,
        })}
        aria-disabled=${isDisabled ? 'true' : 'false'}
        tabindex=${isDisabled ? '-1' : '0'}
        role="button"
        @click=${!isDisabled && !isLoading ? clickHandler : null}
      >
        <a class="sc-pagination-item-link">
          ${isLoading
            ? html`<sc-spinner type="component"></sc-spinner>`
            : html`<sc-icon
                name="${iconName}"
                size="${this.getNavIconSize()}"
              ></sc-icon>`}
        </a>
      </li>
    `;
  }

  private renderPageItem(page: number, disabled: boolean) {
    const isLoading = this.isTargetLoading(page);
    const isActive = this.selectedPage === page;

    const handleClick = () => {
      if (disabled || isLoading) return;
      if (!isActive) {
        this.handlePageClick(page);
      }
    };

    return html`
      <li
        title=${page}
        class=${classMap({
          'sc-pagination-item': true,
          active: isActive,
          disabled,
          loading: isLoading,
        })}
        tabindex=${disabled ? '-1' : '0'}
        role="button"
        aria-current=${isActive ? 'page' : 'false'}
        aria-disabled=${disabled ? 'true' : 'false'}
        @click=${handleClick}
      >
        <a class="sc-pagination-item-link">
          ${isLoading
            ? html`<sc-spinner type="component"></sc-spinner>`
            : html`<span class="sc-pagination-item-label">${page}</span>`}
        </a>
      </li>
    `;
  }

  private renderEllipsis(position: 'prev' | 'next') {
    const targetId = position === 'prev' ? 'jump-prev' : 'jump-next';
    const isLoading = this.isTargetLoading(targetId);
    const handleClick = () =>
      position === 'prev' ? this.jumpBackward() : this.jumpForward();
    const title =
      position === 'prev'
        ? msg('Jump backward', { id: 'sc-pagination-jump-backward' })
        : msg('Jump forward', { id: 'sc-pagination-jump-forward' });

    return html`
      <li
        class=${classMap({
          'sc-pagination-jump-prev': position === 'prev',
          'sc-pagination-jump-next': position === 'next',
          loading: isLoading,
        })}
        title=${title}
        tabindex="0"
        role="button"
        aria-label=${title}
        @click=${handleClick}
      >
        <a class="sc-pagination-item-link">
          ${isLoading
            ? html`<sc-spinner type="component"></sc-spinner>`
            : html`<sc-icon name="more-horizontal"></sc-icon>`}
        </a>
      </li>
    `;
  }

  renderDocument() {
    return html`
      <li class="document-info">
        ${msg('Document', { id: 'sc-pagination-document' })}
        ${this.selectedPage} ${msg('of', { id: 'sc-pagination-document-of' })}
        ${this.totalPages}
      </li>
    `;
  }

  /* ====== MAIN RENDER ====== */

  render() {
    const pageSize = this.selectedPageSize || this.pageSize;
    const totalItems = this.total;

    const startItem = (this.selectedPage - 1) * pageSize + 1;
    const endItem = Math.min(this.selectedPage * pageSize, totalItems);

    const maxPage = this.isDocument ? this.totalPages : this.calculatePage();

    const isPrevDisabled =
      this.selectedPage <= 1 ||
      (this.selectedPage === 2 && this.isPageDisabled(1));
    const isNextDisabled =
      this.selectedPage >= maxPage ||
      (this.selectedPage === maxPage - 1 && this.isPageDisabled(maxPage));

    return html`
      <div
        class=${classMap({
          'sc-pagination-container': true,
          [this.alignment]: true,
          'no-margin': this.noMargin,
        })}
        role="navigation"
        aria-label=${msg('Pagination', { id: 'sc-pagination-nav' })}
      >
        ${this.label
          ? html`
              <div
                class=${classMap({
                  'sc-pagination-label': true,
                  'size-changer-quick-jumper':
                    this.quickJumper || this.sizeChanger,
                  [this.size]: true,
                })}
              >
                ${startItem} - ${endItem} ${msg('of', { id: 'sc-pagination-label-of' })} ${this.total} ${msg('items', { id: 'sc-pagination-label-items' })}
              </div>
            `
          : ''}

        <ul class="sc-pagination ${this.size}">
          ${this.jumpFirstLastPage
            ? this.renderNavButton(
                msg('First Page', { id: 'sc-pagination-first-page' }),
                'sc-pagination-first',
                isPrevDisabled,
                () => this.goFirst(),
                'page-jump-first',
                'first'
              )
            : ''}
          ${this.renderNavButton(
            msg('Previous Page', { id: 'sc-pagination-previous-page' }),
            'sc-pagination-prev',
            isPrevDisabled,
            () => this.goPrev(),
            'arrow-ios-backward',
            'prev'
          )}
          ${this.isDocument
            ? this.renderDocument()
            : this.pages.map((item: PaginationItem) => {
                if ('ellipsis' in item) {
                  return this.renderEllipsis(item.ellipsis);
                }
                return this.renderPageItem(item.page, item.disabled);
              })}
          ${this.renderNavButton(
            msg('Next Page', { id: 'sc-pagination-next-page' }),
            'sc-pagination-next',
            isNextDisabled,
            () => this.goNext(),
            'arrow-ios-forward',
            'next'
          )}
          ${this.jumpFirstLastPage
            ? this.renderNavButton(
                msg('Last Page', { id: 'sc-pagination-last-page' }),
                'sc-pagination-last',
                isNextDisabled,
                () => this.goLast(),
                'page-jump-last',
                'last'
              )
            : ''}

          <li class="sc-pagination-options">
            ${this.sizeChanger
              ? html`
                  <div class="sc-pagination-options-size-changer ${this.size}">
                    <sc-dropdown-input
                      class="size-changer-dropdown"
                      .data=${this.getPageSizeData()}
                      .value=${String(this.selectedPageSize)}
                      hoist
                      size=${this.size}
                      border-type="box"
                      @sc-select=${this.handlePageSizeSelect}
                      @sc-input=${this.handleDropdownInput}
                      @keydown=${this.handleDropdownKeydown}
                    >
                    </sc-dropdown-input>
                  </div>
                `
              : null}
            ${this.quickJumper
              ? html`
                  <div class="sc-pagination-options-quick-jumper">
                    <span class="sc-pagination-go-to-text">
                      ${msg('Go to', { id: 'sc-pagination-go-to' })}
                    </span>
                    <input
                      class="sc-pagination-jump-to"
                      type="text"
                      .value=${this.inputValue}
                      @input=${this.onInput}
                      aria-label=${msg('Jump to page', {
                        id: 'sc-pagination-jump-to-label',
                      })}
                    />
                  </div>
                `
              : null}
          </li>
        </ul>
      </div>
    `;
  }
}
