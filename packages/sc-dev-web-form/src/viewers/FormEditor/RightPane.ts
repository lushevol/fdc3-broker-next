import { html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { keyed } from 'lit/directives/keyed.js';
import { pageContext } from '../contexts/page-context.js';
import { FormDefinition } from '../../models/FormDefinition.js';
import { Page } from '../../models/Page.js';
import ScElement from '../utils/sc-element.js';
import styles1, { scrollbarStyle } from './style.js';
import { COVER_PAGE_TYPE, FORM_PAGE_TYPE, CONFIRMATION_PAGE_TYPE } from '../../shared/constants.js';

import { generateUniqueId } from '../../shared/generateUniqueId.js';
import type { ValueChangeFunction, CommentsChangeFunction } from '../../shared/formTypes.js';
import './FormRender.js';

const PageOptions = [
  {
    label: 'Cover page',
    value: COVER_PAGE_TYPE,
  }, {
    label: 'Form page',
    value: FORM_PAGE_TYPE,
  }, {
    label: 'Confirmation page',
    value: CONFIRMATION_PAGE_TYPE,
  },
];
export default class RightPane extends ScElement {
  static styles = css`
    :host {
      height: 100%;
      display: block;
    }
    .form-container {
      height: 100%;
      flex: 1;
      display: flex;
    }
    .action-container {
      position: absolute;
      top: 1.562rem;
      right: 1.875rem;
    }
    .sc-tabs {
      width: calc(100% + 4 *  0.75rem);
      margin-left: calc(2 *  -0.75rem);
      display: flex;
      align-items: center;
      position: sticky;
      bottom: 0;
      z-index: 2;
      background-color: var(--sc-card-disabled-background, var(--sc-color-grey-100))
    }
    .sc-tabs .actions {
      position: absolute;
      right: 0.625rem;
      top: 0.35rem;
    }
    .sc-tabs sc-tab-group {
      --sc-tab-group-filled-background: transparent; 
      --sc-tab-color-filled: --sc-color-blue-900; 
      --sc-tab-filled-active-border-radius: 0 0 0.25rem 0.25rem;
      --sc-tab-active-color: transparent;
      flex: 1;
      margin-top: -0.625rem;
      width: calc(100% - 10rem);
      margin-right: 9.5rem;
    }
    .sc-tabs sc-tab-group::part(scroll-button) {
      top: 0.625rem;
    }
    .sc-tabs sc-tab::part(base) {
      padding: 0.35rem 1rem;
    }
    .plus-wrapper {
      display: flex;
      font-size: 0.875rem;
      cursor: pointer;
    }
    .right-panel-container {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }
    ${styles1}
    ${scrollbarStyle}
  `;

  @property({ type: Boolean, attribute: 'hide-toggle' }) hideToggle = false;

  @property({ type: Function }) onValueChange: ValueChangeFunction;
  
  @property({ type: Function }) onCommentsChange: CommentsChangeFunction;

  @property({ type: Number }) key: number;

  @property({ type: Boolean }) singlePage = false;

  @property({ type: Boolean }) single = false;

  @consume({ context: pageContext, subscribe: true })
  @state()
  private selectedPage = { id: '' };

  // @consume({ context: formContext })
  @property({ attribute: false }) 
  private formDefinition: FormDefinition;

  onMouseDown(event: MouseEvent) {
    this.emit('blank-clicked');
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('mousedown', this.onMouseDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mousedown', this.onMouseDown);
  }

  renderPagesTab() {
    return html`
      <div class="sc-tabs">
        <sc-tab-group
          type=filled
          @sc-tab-select=${
  (event: CustomEvent) => {
    this.emit('page-updated', {
      detail: {
        id: event.detail.name, 
      },
    });
    this.requestUpdate();
  }}
          @sc-close=${this.removePage}
        >
          ${
  keyed(this.formDefinition?.pages, this.formDefinition?.pages?.map((page: Page) => html`
              <sc-tab 
                slot="nav" 
                panel=${page.id} 
                ?active=${this.selectedPage?.id === page.id || this.formDefinition.pages.length === 1}
              >${page.name}</sc-tab>
            `))
}
        </sc-tab-group>
        ${this.renderNewPageIcon()}
      </div>
    `;
  }

  renderNewPageIcon() {
    if (this.singlePage) {
      return html`
        <div class="actions" @click=${(event: Event) => {
    this.addNewPage(FORM_PAGE_TYPE);
  }}>
          <span class=plus-wrapper>
            <sc-icon
              name="plus"
              size=sm
              style='cursor: pointer'
              
            ></sc-icon>
            Add page
          </span>
        </div>
      `;
    }
    return html`
      <sc-dropdown-input
        style="--sc-dropdown-min-width: var(--sc-actions-width, 12.5rem)"
        @sc-select=${(event: CustomEvent) => this.addNewPage(event.detail.value)}
        class="actions"
        hoist
        .data=${PageOptions}
      >
        <span slot="trigger" class=plus-wrapper>
          <sc-icon
            name="plus"
            size=sm
            style='cursor: pointer'
          ></sc-icon>
          Add page
        </span>
        ${
  PageOptions.map(page => html`
            <sc-dropdown-option value=${page.value}>${page.label}</sc-dropdown-option>
          `)
}
      </sc-dropdown-input>`;
  }

  addNewPage(type: string) {
    const newPage = this.formDefinition.addPage({}, type);
    this.emit('page-updated', {
      detail: {
        id: newPage.id,
        newPage: true,
      },
    });
    this.requestUpdate();
  }

  removePage(event: CustomEvent) {
    const index = this.formDefinition.getPageIndex(event.detail.name);
    this.formDefinition.removePage(event.detail.name);
    this.emit('page-updated', {
      detail: {
        id: this.formDefinition.pages[index]?.id || this.selectedPage.id,
      },
    });
    this.requestUpdate();
  }

  render() {
    return html`
      <div class='right-panel-container'>
        <div class="form-container">
          <form-render .key=${generateUniqueId()} ?hide-toggle=${this.hideToggle}  .onValueChange=${this.onValueChange} .onCommentsChange=${this.onCommentsChange}></form-render>
        </div>
        ${this.single ? nothing : this.renderPagesTab()}
      </div>

    `;
  }
}

if (!window.customElements.get('form-builder-right-pane')) {
  window.customElements.define('form-builder-right-pane', RightPane);
}
