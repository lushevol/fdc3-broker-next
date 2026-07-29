import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScLandingLayoutStyle from './ScLandingLayout.style.js';
import '../../../elements/sc-banner.js';
import '../../../elements/sc-scrollbar.js';
import '../../../elements/sc-button.js';
import '../../../elements/sc-dropdown-input.js';
import { HasSlotController } from '../../shared/slot.js';
import { mediaQuery } from '../../shared/mediaQuery.js';

type HeaderAction = {
  [s: string]: any;
  label: string;
  value: string;
};

type ActionType = 'primary' | 'secondary' | 'optional';

export class ScLandingLayout extends ScElement {
  static styles = ScTheme.getStyles().concat([ScLandingLayoutStyle]);

  @property({ type: String }) height: 'cover' | 'auto' = 'auto';

  @property({ type: String, attribute: 'banner-title' }) bannerTitle = '';

  @property({ type: String, attribute: 'banner-body' }) bannerBody = '';

  @property({ type: String, attribute: 'banner-text-alignment' })
    bannerTextAlignment : 'left' | 'center' | 'right'  = 'left';

  @property({ type: String, attribute: 'banner-image-src' }) bannerImageSrc = '';

  @property({ type: String, attribute: 'banner-image-position' }) bannerImagePosition: 'left' | 'right' = 'right';

  @property({ type: String, attribute: 'banner-background-color' })
    bannerBackgroundColor: 'white' | 'gradient-blue' = 'white';

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

  get normalizedHeaderPrimaryActions() {
    return this.normalizeHeaderActions(this.headerPrimaryActions as HeaderAction[] | HeaderAction);
  }

  get normalizedHeaderSecondaryActions() {
    return this.normalizeHeaderActions(this.headerSecondaryActions as HeaderAction[] | HeaderAction);
  }

  get normalizedHeaderOptionalActions() {
    return this.normalizeHeaderActions(this.headerOptionalActions as HeaderAction[] | HeaderAction);
  }

  @mediaQuery(['desktop', 'tablet', 'portrait'], { waitAfterUpdate: true })
  renderOnMobile() {
    this.requestUpdate();
  }

  get isPcModeLayout() {
    return this.isDesktop && !this.isPortrait;
  }

  readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'banner-title',
    'banner-body',
    'content',
  );

  get finalBgColor() {
    return !['white', 'gradient-blue'].includes(this.bannerBackgroundColor) ? 'white' : this.bannerBackgroundColor;
  }

  emitAction(actionType: ActionType, value: string) {
    this.emit('sc-action', {
      bubbles: true,
      composed: true,
      detail: {
        actionType,
        value,
      },
    });
  }

  hasHeaderActions() {
    return Boolean(
      this.normalizedHeaderPrimaryActions.length
      || this.normalizedHeaderSecondaryActions.length
      || this.normalizedHeaderOptionalActions.length
    );
  }

  handleHeaderActionSelect(actionType: ActionType, event: CustomEvent) {
    const value = event?.detail?.value;
    if (value === undefined || value === null) {
      return;
    }
    this.emitAction(actionType, value);
  }

  renderPrimaryAction() {
    if (!this.normalizedHeaderPrimaryActions.length) {
      return nothing;
    }

    if (this.normalizedHeaderPrimaryActions.length === 1) {
      const action = this.normalizedHeaderPrimaryActions[0];
      return html`
        <sc-button
          class='landing-header-action-item'
          type='primary'
          size='sm'
          @click=${() => this.emitAction('primary', action.value)}
        >${action.label}</sc-button>
      `;
    }

    return html`
      <sc-button-dropdown
        class='landing-header-action-item'
        type='primary'
        size='sm'
        button-text=${this.normalizedHeaderPrimaryActions[0].label}
        .data=${this.normalizedHeaderPrimaryActions}
        hoist
        @sc-select=${(event: CustomEvent) => this.handleHeaderActionSelect('primary', event)}
      ></sc-button-dropdown>
    `;
  }

  renderSecondaryAction() {
    if (!this.normalizedHeaderSecondaryActions.length) {
      return nothing;
    }

    if (this.normalizedHeaderSecondaryActions.length === 1) {
      const action = this.normalizedHeaderSecondaryActions[0];
      return html`
        <sc-button
          class='landing-header-action-item'
          type='secondary'
          size='sm'
          @click=${() => this.emitAction('secondary', action.value)}
        >${action.label}</sc-button>
      `;
    }

    return html`
      <sc-button-dropdown
        class='landing-header-action-item'
        type='secondary'
        size='sm'
        button-text=${this.normalizedHeaderSecondaryActions[0].label}
        hoist
        .data=${this.normalizedHeaderSecondaryActions}
        @sc-select=${(event: CustomEvent) => this.handleHeaderActionSelect('secondary', event)}
      ></sc-button-dropdown>
    `;
  }

  renderOptionalAction() {
    if (!this.normalizedHeaderOptionalActions.length) {
      return nothing;
    }

    return html`
      <sc-dropdown-input
        class='landing-header-action-item landing-header-optional-actions'
        .data=${this.normalizedHeaderOptionalActions}
        float='right'
        hide-tick-mark
        hoist
        @sc-select=${(event: CustomEvent) => this.handleHeaderActionSelect('optional', event)}
      >
        <sc-icon-button
          slot='trigger'
          type='secondary'
          size='sm'
          name='more-horizontal'
        ></sc-icon-button>
      </sc-dropdown-input>
    `;
  }

  renderHeaderActions() {
    if (this.hasHeaderActions()) {
      return html`
        <div class='landing-header-actions'>
          ${this.renderOptionalAction()}
          ${this.renderSecondaryAction()}
          ${this.renderPrimaryAction()}
        </div>
      `;
    }

    return html`<slot name='header-action-slot'></slot>`;
  }

  render() {
    const hasTitleSlot = this.hasSlotController.test('banner-title');
    const hasHeaderActionSlot = this.hasSlotController.test('header-action-slot');
    const hasActionContent = this.hasHeaderActions() || hasHeaderActionSlot;
    const shouldRenderTitleRow = hasTitleSlot
      || Boolean(this.bannerTitle)
      || this.hasHeaderActions()
      || hasHeaderActionSlot;
    const classes = classMap({
      'sc-landing-layout': true,
      [`height-${this.height}`]: true,
    });
    return html`
      <div class=${classes}>
        <div>
          <sc-banner
            background-color=${this.finalBgColor}
            text-alignment='${this.bannerTextAlignment}'
            image-position='${this.bannerImagePosition}' 
            image-src='${this.isPcModeLayout ? this.bannerImageSrc : ''}'
            ?title-full-width=${hasActionContent}
            no-border
            border-radius="none"
          >
            ${shouldRenderTitleRow ? html`
              <div slot='title' class='landing-banner-title-slot'>
                <div class='landing-title-row'>
                  <div class='landing-title-content'>
                    <sc-title level="2" ellipsis rows='2'>
                    ${this.bannerTitle ? html`${this.bannerTitle}` : html`
                      <slot name='banner-title'></slot>
                    `}
                    </sc-title>
                  </div>
                  ${this.renderHeaderActions()}
                </div>
              </div>
            ` : null}
            ${this.bannerBody ? html`<div slot='body'>${this.bannerBody}</div>` : html`
              <slot slot='body' name='banner-body'></slot>
            `}
            <slot slot='additional-body' name='banner-additional-body'></slot>
          </sc-banner>
        </div>
        <div class='content-wrapper'>
          <div class='content-container'>
            <sc-scrollbar selector=".content-slot"></sc-scrollbar>
            <div class='content-slot'>
              <slot name='content'></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}