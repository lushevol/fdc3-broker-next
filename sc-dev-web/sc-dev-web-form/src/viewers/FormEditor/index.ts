import { html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { keyed } from 'lit/directives/keyed.js';
// @ts-ignore
import { MainIconLibrary } from '@scdevkit/icons/libraries/MainIconLibrary.js';
import { FormDefinition } from '../../models/FormDefinition.js';
import { Component } from '../../models/Component.js';
import ScElement from '../utils/sc-element.js';
import { ComponentTypes } from '../../shared/componentTypes.js';

import { dataSourceContext } from '../contexts/data-source-context.js';
import { stylesContext } from '../contexts/styles-context.js';
import { modeContext } from '../contexts/mode-context.js';
import { actionContext } from '../contexts/action-context.js';
import { activeComponentContext } from '../contexts/active-component-context.js';
import { customComponentsContext } from '../contexts/custom-components-context.js';
import { editPropertiesContext } from '../contexts/edit-properties-context.js';
import {
  createProcessApiContextValue,
  processApiContext,
} from '../contexts/process-api-context.js';
import type { CUSTOM_COMPONENT, STYLES } from '../types.js';
import { watch } from '../utils/watch.js';
import { generateUniqueId } from '../../shared/generateUniqueId.js';
import { FormMixin } from '../utils/form-mixin.js';
import './LeftPane.js';
import './RightPane.js';
import { COMPONENT_ITEM_TYPE, WebkitComponentsMapping } from '../../shared/webkitComponentsMapping.js';

export class FormEditor extends FormMixin(ScElement) {
  static styles = css`
    .container {
      text-align: left;
      margin-left: 1.75rem;
      margin-right: 1.75rem;
    }

    .preview-button {
      float: right;
    }

    sc-column-layout::part(middle-column) {
      position: relative;
      z-index: 10;
    }
  `;
  //@ts-ignore
  @provide({ context: dataSourceContext })
  @state()
    _dataSources: any[] = [];

  @state()
    _rules: any[] = [];

  @property({ type: Object })
    manifest: FormDefinition;
//@ts-ignore
  @provide({ context: customComponentsContext })
  @property({ type: Array })
    customComponents: CUSTOM_COMPONENT[] = [];
//@ts-ignore
  @provide({ context: activeComponentContext })
  @state()
    activeComponent = { id: '' };
//@ts-ignore
  @provide({ context: stylesContext })
  @property({ type: Object }) styles: STYLES;
//@ts-ignore
  @provide({ context: modeContext })
  @property({ type: String }) mode = 'edit';

  @property({ type: Boolean, attribute: 'hide-toggle' }) hideToggle = false;

  @property({ type: Boolean, attribute: 'hide-title' }) hideTitle = false;

  @property({ type: String, attribute: 'custom-header' }) customHeader = '';

  @property({ type: Boolean, attribute: 'disable-blank-click' }) disableBlankClick = false;

  @property({ type: Boolean, attribute: 'hide-description' }) hideDescription = false;

  @property({ type: Boolean, attribute: 'hide-datasource' }) hideDataSource = false;

  @property({ type: Boolean, attribute: 'hide-rule' }) hideRule = false;

  @property({ type: Boolean, attribute: 'single-page' }) singlePage = false;

  @property({ type: Boolean }) single = false;

  @property({ type: String, attribute: 'form-type' }) formType: 'default' | 'page' | 'email' = 'default';
//@ts-ignore
  @provide({ context: editPropertiesContext })
  @property({ type: Object }) editProperties = undefined;

  //@ts-ignore
  @provide({ context: processApiContext })
  @state()
    _processApi = createProcessApiContextValue(this._graphQLClient, () => this.requestUpdate());

  @property({ type: Array }) menuItems = undefined;

  @property({ attribute: false }) renderCustomEditingFields = () => {};

  @state() autofocus = false;

  @state() _selectedComponent: Component;
  
  @state() _selectedCustomComponent: CUSTOM_COMPONENT;

  @state() _blankClicked = true;

  @state() _pageClicked = false;
//@ts-ignore
  @provide({ context: actionContext })
    _formAction = {
      updateFormDefinition: () => {
        this.formUpdated();
        this.emitUpdateEvent();
      },
      onValueChange: (...args: any[]) => {
        void args;
      },
      onComponentEdit: (...args: any[]) => {
        void args;
      },
    };

  get selectedPageDetail() {
    return this._definition?.getPage(this.selectedPage?.id);
  }

  get selectedPageOrder() {
    return this._definition?.getPageIndex(this.selectedPage?.id);
  }

  manifestChangedCallback(event: CustomEvent) {
    this.updateStates(event.detail.value);
    this.updateFormAllData();
    this.loadCustomComponentsPath();
    void this._processApi.primeByDefinition(this._definition);
    this.emitUpdateEvent();
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();

    this._processApi = createProcessApiContextValue(this._graphQLClient, () => this.requestUpdate());

    this._formAction.onValueChange = this._onValueChange;
    this._formAction.onComponentEdit = this.onComponentEdit;
    
    document.body.addEventListener('manifest-changed', this.manifestChangedCallback.bind(this) as EventListener);
  }

  disconnectedCallback() {
    document.body.removeEventListener('manifest-changed', this.manifestChangedCallback.bind(this) as EventListener);
  }

  mappingCustomComponents(definition: FormDefinition) {
    const { customComponents = [] } = definition;
    const updatedComponents = customComponents.map(item => {
      const key = item.element?.name;
      const config = key ? WebkitComponentsMapping[key] : undefined;
      if (config) {
        const { type, icon, label, id, properties, settings } = config;
        return {
          ...item,
          type,
          icon,
          label,
          id,
          element: {
            name: key,
            properties,
          },
          settings,
          orgion: 'webkit',
        } as CUSTOM_COMPONENT;
      }
  
      return item;
    });
    definition.customComponents = updatedComponents;
  }

  firstUpdated() {
    this._definition = new FormDefinition(undefined, this.singlePage);
    this.updateDefaultSelectedPage();
    if (this.manifest || this.definition) {
      this.mappingCustomComponents(this.manifest || this.definition);
      this.updateStates(this.manifest || this.definition);
      this.updateFormAllData();
      this.loadCustomComponentsPath();
      void this._processApi.primeByDefinition(this._definition);
    }
    this.updateComplete.then(() => {
      const layoutRightColumn = this.shadowRoot?.querySelector('sc-column-layout');
      const contentContainer: any = layoutRightColumn?.shadowRoot?.querySelector(
        '.right-column .column-content-container',
      );
      contentContainer?.setAttribute('style', 'height: calc(100% - 4px);');
      const leftContainer: any = layoutRightColumn?.shadowRoot?.querySelector('.left-column .column-content-container');
      leftContainer?.setAttribute('style', 'height: auto;');
    });
  }

  get components() {
    return this._definition?.getPage(this.selectedPage?.id)?.components;
  }

  // @ts-ignore
  @watch('manifest', { waitUntilFirstUpdate: true })
  updateFormDefinition() {
    if (this.manifest) {
      this.updateStates(this.manifest);
      this.updateFormAllData();
      this.loadCustomComponentsPath();
      void this._processApi.primeByDefinition(this._definition);
    } else {
      this._definition = this._definition.clear();
    }
  }

  // @ts-ignore
  @watch('singlePage', { waitUntilFirstUpdate: true })
  initPages() {
    if (!this.singlePage) {
      if (!(this._definition?.pages?.length > 0)) {
        this._definition.initPages();
      }
    }
  }

  updateStates(definition: FormDefinition) {
    this._definition = this._definition.update(definition);
    this.updateCustomComponentsProvider();
    this.updateDefaultSelectedPage();
    this._dataSources = this._definition.dataSources;
    this._rules = this._definition.rules;
  }

  updateDefaultSelectedPage() {
    if (!this.selectedPage.id || !this._definition.getPage(this.selectedPage.id)) {
      this.selectedPage.id = this.defaultPage || this._definition.pages?.[0]?.id;
    }
  }

  compareValues() {
    if (!this.customComponents?.length) return;
    this.customComponents?.forEach((c: CUSTOM_COMPONENT, index) => {
      if (c?.name) {
        const { properties, settings } = WebkitComponentsMapping[c.name] || {};
        if (settings && this.customComponents[index]['settings']) {
          this.customComponents[index]['settings'] = settings;
        }
        if (properties && this.customComponents[index]['element']) {
          this.customComponents[index]['element'] = {
            name: this.customComponents[index]['element']?.name,
            properties,
          };
        }
      }
    });
  }

  updateCustomComponentsProvider() {
    if (this.customComponents?.length) {
      this._definition.customComponents?.forEach((c: CUSTOM_COMPONENT) => {
        if (!this.customComponents.find(cc => (cc.name || cc.element?.name) === (c.name || c.element?.name))) {
          this.customComponents.push(c);
        }
      });
    } else {
      if (Array.isArray(this.customComponents)) {
        this.customComponents.splice(0, 0, ...(this._definition.customComponents || []));
      } else {
        this.customComponents = this._definition.customComponents || [];
      }
    }
    this.compareValues();
  }

  updateCustomComponents(event: CustomEvent) {
    this._definition.updateCustomComponents(event.detail.customComponents);
    this.updateCustomComponentsProvider();
  }

  getComponentConfig(components: string[] = []) {
    components.forEach((c: string) => {
      const config: COMPONENT_ITEM_TYPE = WebkitComponentsMapping[c];
      const { type, icon, label, id, properties, settings } = config;
      this.customComponents.push({
        type,
        icon,
        label,
        id,
        element: {
          name: c,
          properties,
        },
        settings,
        orgion: 'webkit',
      } as CUSTOM_COMPONENT);
    });
  }

  updateSelectedPage(event: CustomEvent) {
    if (this.selectedPage) {
      this.selectedPage.id = event.detail.id;
      this._pageClicked = true;
      this.autofocus = !!event.detail?.newPage;
      this.requestUpdate();
    }
  }

  onSelectedPageChange(value: string, key: string) {
    if (key === 'order' && value && typeof +value === 'number') {
      this._definition.sortPage(+value - 1, this.selectedPage.id);
    } else {
      this.selectedPageDetail[key] = value;
    }
    this.requestUpdate();
  }

  formUpdated() {
    this.updateFormAllData();
    this.requestUpdate();
  }

  onLeftPaneFormUpdated(event: CustomEvent) {
    const definition = event.detail?.definition as FormDefinition | undefined;
    if (definition) {
      // Force a new context value reference so all consumers re-render with latest datasource fields.
      this._definition = FormDefinition.from(definition);
      this._dataSources = this._definition.dataSources;
      this._rules = this._definition.rules;
      void this._processApi.primeByDefinition(this._definition);
    }
    this.updateFormAllData();
    this.emitUpdateEvent();
    this.requestUpdate();
  }

  emitUpdateEvent() {
    this.emit('form-updated', {
      composed: true,
      bubbles: true,
      detail: {
        definition: this._definition,
      },
    });
  }

  removePage() {
    const { pages = [] } = this._definition;
    const currentIndex = pages.findIndex((page: any) => page.id === this.selectedPage.id);
    let resultPage = null;
    if (currentIndex < pages.length - 1) {
      resultPage = pages[currentIndex + 1];
    } else if (currentIndex > 0) {
      resultPage = pages[currentIndex - 1];
    }
    this._definition.removePage(this.selectedPage.id);
    this.selectedPage.id = resultPage.id;
    this._pageClicked = true;
    this.emit('page-updated', {
      detail: {
        id: resultPage.id, 
      },
    });
    this.requestUpdate();
  }

  renderPropertiesEditor() {
    if (this._pageClicked) {
      return html`
        <div slot=right style="height:100%;">
          <div class=box>
            <sc-text-input
              .autofocus=${this.autofocus}
              label='Name' 
              .value=${this.selectedPageDetail?.name}
              @sc-input=${(event: CustomEvent) => this.onSelectedPageChange(event.detail.value, 'name')}
            ></sc-text-input>
            <sc-text-input
              label='Order' 
              .value=${this.selectedPageOrder + 1}
              @sc-input=${(event: CustomEvent) => this.onSelectedPageChange(event.detail.value, 'order')}
            ></sc-text-input>
            <div style='margin-top:2rem; display:flex; justify-content:end; align-items:center;'>
              <sc-button type="secondary" state="error" .disabled=${this._definition.pages.length < 2} @click=${this.removePage}>
                Delete
              </sc-button>
            </div>
          </div>
        </div>
      `;
    }

    if (this._blankClicked && !this.disableBlankClick) {
      return html`
        <div slot=right>
          ${this.renderCustomEditingFields()}
        </div>
      `;
    }

    if (this.components?.length || this.customComponents?.length) {
      const firstComponent = this.components ? this.components[0] : this.customComponents[0];
      return html`
        <div slot=right>
          <div class=box>
            <component-properties-editor 
              .component=${this._selectedComponent || firstComponent}
              .customComponent=${this._selectedCustomComponent || firstComponent}
            ></component-properties-editor> 
          </div>
        </div>`;
    }
    return nothing;
  }

  onComponentEdit = (component: Component, customComponent: CUSTOM_COMPONENT) => {
    this._selectedComponent = component;
    this._selectedCustomComponent = customComponent;
    this.activeComponent.id = component?.id || customComponent?.id;
    this._blankClicked = false;
    this._pageClicked = false;
  };

  onBlankClicked() {
    if (this.disableBlankClick) {
      return;
    }
    this.activeComponent.id = '';
    this._blankClicked = true;
    this._pageClicked = false;
  }

  render() {
    const { template, type } = (this._selectedComponent || {});
    let showText, _type;
    if (type) {
      showText = ComponentTypes[type];
      _type = type?.split('-').map((a: string) => a[0].toUpperCase() + a.slice(1,a.length)).join(' ');
    }
    
    return html`
      <sc-icon-provider .iconLibraries=${[MainIconLibrary]}>
        <sc-column-layout
          layout="Main Content Middle" 
          style='--sc-layout-top-offset: 0px; --sc-layout-bottom-offset: 0px; height:auto'
          right-column-collapsible 
          height='cover' 
          unfloatable
        >
          <div slot=left>
            ${this.hideTitle ? nothing : html`
              <slot name=title>
                Design your form
              </slot>`
}
            ${keyed(JSON.stringify(this.customComponents), html`<form-builder-left-pane
              ?hideDataSource=${this.hideDataSource}
              ?hideRule=${this.hideRule}
              .formType=${this.formType}
              .dataSources=${this._dataSources}
              .rules=${this._rules}
              .menuItems=${this.menuItems}
              ?hideDescription=${this.hideDescription}
              @form-updated=${this.onLeftPaneFormUpdated}
              @custom-components-updated=${this.updateCustomComponents}
            > </form-builder-left-pane>`)}
          </div>
          <div slot=right-header>
            ${
  this._pageClicked ? html`<div>Edit page</div>` : 
    this._blankClicked ?
      html`<div>${this.customHeader}</div>` :
      html`<div style=${this.styles?.header}>${_type || showText || template?.label}</div>`
}
          </div>
          <div slot=middle style='height: 100%'>
            <form-builder-right-pane .key=${generateUniqueId()} 
              ?hide-toggle=${this.hideToggle}
              .onValueChange=${this._onValueChange}
              .formDefinition=${this._definition}
              ?singlePage=${this.singlePage}
              ?single=${this.single}
              @form-updated=${this.formUpdated}
              @component-edit=${this.onComponentEdit}
              @blank-clicked=${this.onBlankClicked}
              @page-updated=${this.updateSelectedPage}
            > </form-builder-right-pane>
          </div>
          ${this.renderPropertiesEditor()}
          
        </sc-column-layout>
      </sc-icon-provider>
    `;
  }
}

