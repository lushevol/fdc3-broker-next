import { html } from 'lit';
import { property, state } from 'lit/decorators.js';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScSearchLayoutStyle from './ScSearchLayout.style.js';
import '../../../elements/sc-grid.js';
import '../../../elements/sc-search-field.js';
import '../../../elements/sc-link.js';
import '../../../elements/sc-button.js';
import '../../../elements/sc-spinner.js';
import '../../../elements/sc-landing-layout.js';
import { HasSlotController } from '../../shared/slot.js';
import { SearchImage } from './SearchImage.js';
import { watch } from '../../shared/watch.js';
import { mediaQuery } from '../../shared/mediaQuery.js';

type HeaderAction = {
  [s: string]: any;
  label: string;
  value: string;
};

export class ScSearchLayout extends ScElement {
  static styles = ScTheme.getStyles().concat([ScSearchLayoutStyle]);

  @property({ type: String }) height: 'cover' | 'auto' = 'auto';

  @property({ type: String }) title = '';

  @property({ type: String }) description = '';

  @property({ type: String, attribute: 'single-search-placeholder' }) singleSearchPlaceholder = '';

  @property({ type: Boolean, attribute: 'multiple-search' }) multipleSearch = false;

  @property({ type: Boolean, attribute: 'hide-image' }) hideImage = false;

  @property({ type: String, attribute: 'image-src' }) imageSrc = '';

  @property({ type: Boolean }) loading = false;

  @property({ type: Array, attribute: 'header-primary-actions' }) headerPrimaryActions: HeaderAction[] = [];

  @property({ type: Array, attribute: 'header-secondary-actions' }) headerSecondaryActions: HeaderAction[] = [];

  @property({ type: Array, attribute: 'header-optional-actions' }) headerOptionalActions: HeaderAction[] = [];

  normalizeHeaderActions(input: HeaderAction[] | HeaderAction | null | undefined): HeaderAction[] {
    if (!input) {
      return [];
    }
    if (Array.isArray(input)) {
      return input;
    }
    return [input];
  }

  @state() _showAdvanceSearch = false;

  @state() _searchValue = '';
  
  @mediaQuery(['desktop', 'tablet', 'mobileSm', 'mobileLg', 'portrait'] as any, { waitAfterUpdate: true })
  renderOnMobile() {
    this.requestUpdate();
  }

  readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'title',
    'description',
    'basic-search',
    'advance-search',
    'result',
    'empty-message',
    'header-action-slot',
  );

  get isPcModeLayout() {
    return this.isDesktop && !this.isPortrait;
  }

  get columnSize() {
    const res: any = {};
    if (this.isMobile && this.isPortrait) {
      res.xs = 12;
      res.md = 12;
    } else if (!this.isPcModeLayout) {
      res.xs = 12;
    }

    return res;
  }

  search(event: any) {
    this.emit('sc-search', {
      detail: {
        value: event?.detail?.value,
      },
    });
  }

  singleSearch() {
    this.emit('sc-search', {
      detail: {
        value: this._searchValue,
      },
    });
  }

  searchValueChange(event: any) {
    this._searchValue = event.detail.value;
  }

  @watch('multipleSearch', { waitUntilFirstUpdate: true })
  resetSingleSearch() {
    this._searchValue = '';
  }

  clearFields(event: Event) {
    this.emit('sc-clear', {
      detail: {
        target: event.target,
      },
    });
  }

  toggleAdvanceSearch() {
    this._showAdvanceSearch = !this._showAdvanceSearch;
    const eventName = this._showAdvanceSearch ? 'sc-advance-search-show' : 'sc-advance-search-hide';
    this.emit(eventName, {
      detail: {
        show: this._showAdvanceSearch,
      },
    });
  }

  render() {
    const hasBasicSearchSlot = this.hasSlotController.test('basic-search');
    const hasAdvanceSearchSlot = this.hasSlotController.test('advance-search');
    const hasEmptyMessageSlot = this.hasSlotController.test('empty-message');
    const normalizedHeaderPrimaryActions = this.normalizeHeaderActions(
      this.headerPrimaryActions as HeaderAction[] | HeaderAction
    );
    const normalizedHeaderSecondaryActions = this.normalizeHeaderActions(
      this.headerSecondaryActions as HeaderAction[] | HeaderAction
    );
    const normalizedHeaderOptionalActions = this.normalizeHeaderActions(
      this.headerOptionalActions as HeaderAction[] | HeaderAction
    );
    return html`
      <div class='sc-search-layout'>
        <sc-landing-layout
          height=${(this.loading || hasEmptyMessageSlot) ? 'cover' : this.height}
          .headerPrimaryActions=${normalizedHeaderPrimaryActions}
          .headerSecondaryActions=${normalizedHeaderSecondaryActions}
          .headerOptionalActions=${normalizedHeaderOptionalActions}
          banner-image-src=${this.hideImage ? '' : 
    this.imageSrc ? this.imageSrc : `data:image/svg+xml,${encodeURIComponent(SearchImage)}`}
        >
          <slot slot='header-action-slot' name='header-action-slot'></slot>
          ${this.title ? html`<div slot='banner-title'>
            <sc-title level="2">${this.title}</sc-title>
          </div>` : html`
            <div slot='banner-title'>
              <slot name='title'></slot>
            </div>
          `}
          <div slot='banner-body'>
            ${this.description ? html`
              <sc-paragraph size="md">${this.description}</sc-paragraph>
            ` : html`
              <slot
                name='description'
                part='description'
                class='banner-description-slot'
              ></slot>
            `}
            ${this.multipleSearch ? html`
              <div class='basic-search'>
                ${hasBasicSearchSlot ? html`
                  <sc-grid-row >
                    <sc-grid-column xs='${this.columnSize.xs || 9}' md='${this.columnSize.md || 9}' lg='9'>
                      <div class='basic-search-fields'><slot name='basic-search'></slot></div>
                    </sc-grid-column>
                    <sc-grid-column xs='${this.columnSize.xs || 3}' md='${this.columnSize.md || 3}' lg='3'>
                      <div class='search-buttons'>
                        <div class='clear-btn'>
                          <sc-button @click=${this.clearFields} type="secondary">Clear</sc-button>
                        </div>
                        <div class='search-btn'><sc-button fill @click=${this.search}>Search</sc-button></div>
                      </div>
                      ${hasAdvanceSearchSlot ? html`
                        <div class='advance-link-wrapper'>
                          <sc-link @sc-action=${this.toggleAdvanceSearch}>
                            <span class='advance-link'>
                              ${this._showAdvanceSearch ? 'Hide advanced search' : 'Show advanced search'}
                            </span>
                          </sc-link>
                        </div>
                      ` : null}
                    </sc-grid-column>
                  </sc-grid-row>
                  ${this._showAdvanceSearch ? html`
                    <sc-grid-row>
                    <sc-grid-column xs='12' md='11' lg='9' xl="8">
                      <div class='advance-search' slot='banner-additional-body'>
                        <div class='advance-search-title'>Advance settings</div>
                        <slot name='advance-search'></slot>
                      </div>
                    </sc-grid-column>
                    </sc-grid-row>
                  ` : null}
                ` : null}
              </div>
            ` : html`
              <sc-grid-row class='single-search'>
                <sc-grid-column xs='12' md='11' lg='9' xl="8">
                  <sc-search-field
                    placeholder='${this.singleSearchPlaceholder}' 
                    @sc-search=${this.search}
                    @sc-input=${this.searchValueChange}
                  ></sc-search-field>
                  <sc-button fill @click=${this.singleSearch}>Search</sc-button>
                </sc-grid-column>
              </sc-grid-row>
            `}
          </div>
          <div class='result-wrapper ${this.loading || hasEmptyMessageSlot ? 'cover' : ''}' slot='content'>
            ${this.loading ? html`
              <div class='no-result-wrapper'>
                <sc-spinner size='md'></sc-spinner>
                <div>Loading... please hold</div>
              </div>
            ` : hasEmptyMessageSlot ? html`
              <div class='no-result-wrapper'>
                <slot name='empty-message'></slot>
              </div>
            ` : html`<slot name='result'></slot>`
}
          </div>
        </sc-landing-layout>
      </div>
    `;
  }
}