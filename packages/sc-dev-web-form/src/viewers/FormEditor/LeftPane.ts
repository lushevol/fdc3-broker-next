import { html, css, PropertyValues, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { keyed } from 'lit/directives/keyed.js';
import { consume } from '@lit/context';
import styles1, { modalStyle } from './style.js';
import { dragStart } from '../utils/DragDropZone.js';
import './ComponentConfig/Icon/ComponentIconLibrary.js';
import { customComponentsContext } from '../contexts/custom-components-context.js';
import { pageContext } from '../contexts/page-context.js';
import ComponentsDefinition, { ComponentMenuType, Categories, EmailCategories } from '../../shared/componentsDefinition.js';
import { FormDefinition } from '../../models/FormDefinition.js';
import { formContext } from '../contexts/form-context.js';
import './DataSource/index.js';
import './Rules/index.js';
import type { CUSTOM_COMPONENT } from '../types.js';
import './MoreComponentsContainer.js';
import ScElement from '../utils/sc-element.js';
import { COMPONENT_ITEM_TYPE } from '../../shared/webkitComponentsMapping.js';
import { watch } from '../utils/watch.js';
import { FORM_PAGE_TYPE, EMAIL_TYPE } from '../../shared/constants.js';

export default class LeftPane extends ScElement {
  static styles = css`
    .lab {
      font-weight: 400;
      font-size: 1rem;
    }
    .sep {
      height: 0.625rem;
    }
    .add-link {
      margin-top: 1rem;
      padding-bottom: 1rem;
      display: block;
    }
    .flex-container {
      display:flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.625rem
    }
    ${styles1}
    ${modalStyle}
    sc-tooltip {
      margin-left: -0.437rem;
      margin-top: -0.5rem;
      display: block;
    }
    .label {
      margin: 0;
      /* width: auto; */
      /* margin-left: -0.562rem; */
      /* margin-right: -0.562rem; */
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      padding: 0 0.5rem;
    }
    sc-card::part(base) {
      background: var(--sc-card-selected-background);
    }
    .component-box svg{
      width:24px;
      height:24px;
    }
  `;

  @property({ type: Object }) componentsDefinition: any;

  @property({ type: Array, attribute: 'data-sources', reflect: true }) dataSources: any[] = [];
  
  @property({ type: Array }) rules: any[] = [];

  @property({ type: Boolean }) hideDescription = false;

  @property({ type: Boolean }) hideDataSource = false;

  @property({ type: Boolean }) hideRule = false;

  @property({ type: Boolean }) formType: 'default' | 'page' | 'email' = 'default';

  @property({ type: Array }) menuItems: string[] | undefined = undefined;

  @consume({ context: formContext, subscribe: true })
  @property({ attribute: false }) 
  private  formDefinition: FormDefinition;

  @consume({ context: customComponentsContext })
  @property() 
  private  customComponents: CUSTOM_COMPONENT[];

  @consume({ context: pageContext, subscribe: true })
  @state()
  private  selectedPage = { id: '' };

  @state() 
    _customComponents: CUSTOM_COMPONENT[];

  @state()
    _customComponentSettings: CUSTOM_COMPONENT[] | undefined[];

  @state() selectedTab = 'components';

  @state() loading = false;

  @state() importError = false;

  @state() openMoreComponentsModal = false;

  @state() moreComponents: CUSTOM_COMPONENT[];

  @state() moreComponentsCache: CUSTOM_COMPONENT[];

  @state() _searchValue = '';

  constructor() {
    super();
    this.componentsDefinition = Object.assign(ComponentsDefinition, this.componentsDefinition || {});
    if (this.customComponents) {
      this._customComponents = [...this.customComponents];
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateLeftPanel();
  }

  @watch('formDefinition')
  updateLeftPanel() {
    if (this.formDefinition?.customComponents) {
      this.moreComponents = (this.moreComponents ?? [])
        .concat(this.formDefinition?.customComponents.filter((c: CUSTOM_COMPONENT) => !this.moreComponents?.find(mc => mc.name === c.name)));
      this.moreComponentsCache = this.moreComponents;
    }
  }

  bindDragEvent() {
    const items = this.renderRoot.querySelectorAll('.component-box');
    items.forEach(item => {
      item.removeEventListener('dragstart', dragStart);
      item.addEventListener('dragstart', dragStart);
    });
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('componentsDefinition')) {
      this.componentsDefinition = Object.assign(ComponentsDefinition, this.componentsDefinition || {});      
    }
    if (changedProperties.has('selectedTab') || changedProperties.has('moreComponents') || changedProperties.has('_searchValue')) {
      this.bindDragEvent();
    }
  }

  onDataSourceAdded(event: CustomEvent) {
    this.dataSources = event.detail.data;
  }

  renderComponent(component: ComponentMenuType | CUSTOM_COMPONENT) {
    return html`
      <div class="component-box" draggable="true" id=${component.id}>
        ${keyed(component.icon, html`<icon-component class="item" .customStyle=${{ size: 'xl' }} .name=${component.icon}></icon-component>`)}
        <p class="label">${component.label}</p>
        <!-- <sc-tooltip trigger=hover placement=bottom hoist distance=0>      
          <p class="label">${component.label}</p>
          <div slot="content">
            ${component.label}
          </div>
        </sc-tooltip> -->
      </div>
    `;
  }

  async updateMoreComponent(event: CustomEvent) {
    const { components, customComponents } = event.detail;
    this.moreComponentsCache = (components ?? []).concat(customComponents);
    if (customComponents && customComponents.length > 0) {
      this._customComponentSettings = customComponents;
    }
  }

  cancelUpdate() {
    this.moreComponentsCache = this.moreComponents;
    this.openMoreComponentsModal = false;
  }

  async updateLeftComponents() {
    this.loading = true;
    if (this._customComponentSettings?.length) {
      this._customComponentSettings.forEach(async cc => {
        const { name, path } = (cc?.element ?? {}) as CUSTOM_COMPONENT;
        if (path && name) {
          try {
            await import(path);
          } catch (e) {
            this.importError = true;
          }
          const component: any = document.createElement(name);
          if (component.requestUpdate) {
            this.importError = false;
          }
        }
      });
      this._customComponentSettings = [];
    }

    this.moreComponents = this.moreComponentsCache;
    
    if (this.customComponents?.length) {
      this.moreComponents.forEach(c => {
        if (!this.customComponents.find(cc => cc.element?.name === c.element?.name)) {
          this.customComponents.push(c);
        }
      });
    } else {
      if (Array.isArray(this.customComponents)) {
        this.customComponents.splice(0, 0, ...this.moreComponents);
      } else {
        this.customComponents = [...(this.moreComponents || [])];
      }
    }
    this.openMoreComponentsModal = false;
    this.loading = false;
    this.emit('custom-components-updated', {
      detail: {
        customComponents: this.customComponents,
      },
    });
  }

  openComponentsAddedModal() {
    this.openMoreComponentsModal = true;
  }

  onSearch(event: CustomEvent) {
    const { value } = event.detail;
    this._searchValue = value;
  }

  @watch('openMoreComponentsModal', { waitUntilFirstUpdate: true }) 
  async changeOpenMoreComponentsModal() {
    if (!this.openMoreComponentsModal) {
      return;
    }
    await this.updateComplete;
    const scModalEl = this.shadowRoot
      ?.querySelector('sc-modal')
      ?.shadowRoot?.querySelector('sl-dialog')
      ?.querySelector('.default-slot') as HTMLElement;
    
    if (scModalEl) {
      scModalEl.style.paddingBottom = '0';
    }
  }

  render() {
    let type = FORM_PAGE_TYPE;
    const isEmail = this.formType === EMAIL_TYPE;
    if (this.selectedPage?.id) {
      type = this.formDefinition?.getPage(this.selectedPage.id)?.type || type;
    }
    let components = this.componentsDefinition?.components?.filter((component: ComponentMenuType) => {
      if (!this.menuItems) {
        return component?.display?.includes(this.formType);
      }
      return this.menuItems?.includes(component.id);
    });
    const categories = Categories;
    if (this.moreComponents?.filter((c: CUSTOM_COMPONENT) => (c.type === 'miscellaneous' || c.type === 'custom'))?.length > 0) {
      if (!categories.includes('Miscellaneous')) {
        categories.push('Miscellaneous');
      }
    }
    if (this.moreComponents?.filter((c: CUSTOM_COMPONENT) => (c.type === 'card'))?.length > 0) {
      if (!categories.includes('Card')) {
        categories.splice(2, 0, 'Card');
      }
    }
    if (this.moreComponents) {
      const copyComponents = [...this.moreComponents] as COMPONENT_ITEM_TYPE[];
      components = components.concat(copyComponents || []);
    }
    return html`
      <div className="container">
        <div class="component-container">
          ${this.hideDescription ? nothing : html`<slot name=description>
            <div class="lab">
              Drag and drop the components to the design panel on the right!
            </div>
          </slot>`}
          <sc-tab-group class="sc-tabs" value=${this.selectedTab} @sc-tab-select=${
  (event: CustomEvent) => {
    this.selectedTab = event.detail.name; 
  }
}>
            <sc-tab slot="nav" panel="components" active> Components </sc-tab>
            ${this.hideDataSource ? nothing : html`<sc-tab slot="nav" panel="data"> Data sources </sc-tab>`}
            ${this.hideRule ? nothing : html`<sc-tab slot="nav" panel="rules"> Data flows </sc-tab>`}
          </sc-tab-group>
          ${
  this.selectedTab === 'components' ? html`
              <div class="sep"></div>
              <sc-search-field 
                size=md
                placeholder='Search component'
                @sc-input=${this.onSearch}
              ></sc-search-field>
              <div class="sep"></div>
              <div class="sep"></div>
              ${
  this._searchValue ? html`
                <div class=flex-container>
                 ${repeat(components?.filter((c: ComponentMenuType) => {
    if (c.id.includes(this._searchValue.toLowerCase())) {
      return true;
    }
    return false;
  }), (component: ComponentMenuType) => {
    return html`
                      <sc-card 
                        width=3.75rem
                        height=3.75rem
                        space-size=xs
                        clickable 
                        style='--sc-card-border-radius: 0.625rem; float: left;' 
                      >
                        <div>${this.renderComponent(component)}</div>
                      </sc-card> 
                    `;
  })}
                </div>` : categories.map(category => {
    const renderComponents = components?.filter((component: ComponentMenuType) =>  {
      if (category.toLocaleLowerCase() === 'miscellaneous') {
        return (component.type === category.toLocaleLowerCase()) || (component.type === 'custom');
      }
      return component.type === category.toLocaleLowerCase();
    });
    if (!renderComponents || renderComponents.length <= 0) return nothing;
    return html`
                    <sc-accordion
                      open="true"
                      summary-line="0"
                      icon-position="right"
                    >
                      <div slot="summary">
                        ${category}
                      </div>
                      <div class=flex-container>
                        ${renderComponents?.map((component: ComponentMenuType) => {
    return html`
                            <sc-tooltip 
                              style=' margin-left:0; margin-top: -0.95rem; '
                              trigger=hover
                              placement=bottom
                              content-max-width=9.375rem
                              @mouseenter=${(e: MouseEvent) => { e.stopPropagation(); }} 
                              content=${component.label}>
                                <sc-card 
                                  width=3.15rem
                                  height=3.15rem
                                  space-size=xs 
                                  clickable
                                  style='--sc-card-border-radius: 0.625rem; float: left;' 
                                >
                                  <div>${this.renderComponent(component)}</div>
                                </sc-card> 
                            </sc-tooltip>
                          `;
  })}
                      </div>
                    </sc-accordion>
                  `;
  })
}
              ${isEmail ? null : html`<sc-link class='add-link' @click=${this.openComponentsAddedModal}>+ Add more components</sc-link>`}
            ` : this.selectedTab === 'data' ? 
    html`<form-data-source .data=${this.dataSources} @data-added=${this.onDataSourceAdded}></form-data-source>` :
    html`<form-rules .data=${this.rules}></form-rules>`
}
          
        </div>
        ${this.openMoreComponentsModal ? html`<sc-modal size=md 
          .open=${this.openMoreComponentsModal} 
          @sc-hide=${() => this.openMoreComponentsModal = false}
        >
          <div slot="header">
            Components
          </div>
          <div slot="footer">
            <sc-button size=sm width=6.875rem type=secondary @click=${this.cancelUpdate}>Cancel</sc-button>
            <sc-button size=sm width=6.875rem ?disabled=${this.loading} @click=${this.updateLeftComponents}>${when(this.loading, () => 'Add...', () => 'Add')}</sc-button>
          </div>
          <div style="min-height: 25.937rem;">
            <form-more-components-container
              @custom-components-updated=${this.updateMoreComponent}
              .selectedComponents=${this.moreComponentsCache?.map(c => c.element?.name)}
              @on-scroll-change=${(event: CustomEvent) => {
    const modalPanelDialog = this.shadowRoot
      ?.querySelector('sc-modal')
      ?.shadowRoot?.querySelector('sl-dialog') as HTMLElement;
    if (modalPanelDialog) {
      modalPanelDialog.classList.toggle('footer-divider', event.detail.scroll);
    }
  }}
            ></form-more-components-container>
          </div>

        </sc-modal>` : nothing}
      </div>
      <sc-toast type="error" placement="top-right" duration="3000" 
        title="Custom component import failed, please check your path"
        ?open=${this.importError}
      ></sc-toast>
    `;
  }
}

if (!window.customElements.get('form-builder-left-pane')) {
  window.customElements.define('form-builder-left-pane', LeftPane);
}
