import { html, css } from 'lit';
import { state, property } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { consume } from '@lit/context';
import { repeat } from 'lit/directives/repeat.js';
import './ComponentConfig/Icon/ComponentIconLibrary.js';
import { COMPONENT_ITEM_TYPE, WebkitComponentsMapping, getComponentTypes } from '../../shared/webkitComponentsMapping.js';
import ScElement from '../utils/sc-element.js';
import { watch } from '../utils/watch.js';
import type { CUSTOM_COMPONENT } from '../types.js';
import { scrollbarStyle } from './style.js';
import { customComponentsContext } from '../contexts/custom-components-context.js';
// @ts-ignore
import GridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import Style from '../utils/common.style.js';
import { CustomComponentsList } from './MockData.js';

type CONTENT_TYPE = {
  id: string;
  path: string;
  pluginId: string;
  routeJson: string;
  routeDefinition: string;
}

type ROUTE_TYPE = {
  label?: string;
  component: string;
  icon?: string;
  element: string;
}
export class MoreComponentsContainer extends ScElement {
  static styles = css`
    ${Style}
    .label {
      font-size: 0.625rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 4.375rem;
      position: absolute;
      left: 0.125rem;
      top: 2.812rem;
    }
    sc-card {
      display: block;
      cursor: pointer;
    }
    icon-component {
      height: 2rem;
    }
    icon-component svg {
      width: 2rem;
      height: 2rem;
    }
    .component-container {
      height: 22.625rem;
      overflow-y: scroll;
      padding-right: 0.125rem;
      padding-top: 0.125rem;
    }
    .component-container .content {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1.2rem;
      padding: 0.125rem;
      margin-left: 1.562rem;
      padding-bottom: 1.2rem;
    }
    .component-box {
      display: flex;
      flex-direction: column;
      text-align: center;
    }
    .row {
      display: flex;
    }
    ${scrollbarStyle}
    ${GridStyle}
  `;

  @state() components: string[] = Object.keys(WebkitComponentsMapping);

  @property({ type: Array }) selectedComponents: any[] = [];

  // @ts-ignore
  @consume({ context: customComponentsContext, subscribe: true })
  @property({ type: Array })
    customComponents: CUSTOM_COMPONENT[] = [];

  @state() componentName: string;

  @state() _selectedComponents: any[] = [];

  @state() _selectedType = 'All';

  @state() _searchValue = '';

  @state() _customComponentsList: CUSTOM_COMPONENT[] = [];
  
  async firstUpdated() {
    await this.fetchCustomComponents();
    this.checkScrollBar();
  }

  async checkScrollBar() {
    await this.updateComplete;
    const componentContainer = this.renderRoot.querySelector('.component-container')!;
    const hasScrollBar = componentContainer.scrollHeight > componentContainer.clientHeight;
    this.emit('on-scroll-change', {
      detail: {
        scroll: hasScrollBar,
      },
    });
  }

  @watch('selectedComponents')
  updateSelectedComponents() {
    this._selectedComponents = this.selectedComponents;
  }

  fetchCustomComponents() {
    this._loadSchema();
  }

  async _loadSchema() {
    const response = await this._graphQLClient?.query(`query {
      _55313_128_webkit_exp_api {
        get_pluginRouteJson(pluginId:"", component:"", page:0, size:100) {
          totalPages
          size
          content {
            pluginId
            id
            routeJson
            routeDefinition
          }
        }
      }
    }`);
    const {
      data: {
        _55313_128_webkit_exp_api: { get_pluginRouteJson },
      },
    } = await response.json();
    get_pluginRouteJson.content?.forEach((content: CONTENT_TYPE) => {
      const { routes } = JSON.parse(content.routeJson);
      const paths = content.routeDefinition?.split('/');
      paths?.splice(3, 2);
      routes?.forEach((route: ROUTE_TYPE) => {
        this._customComponentsList.push({
          label: route.label || route.component,
          id: route.component,
          icon: route.icon,
          name: route.component,
          path: `${paths.join('/')  }/elements/${  route.element}`,
        });        
      });
    });
  }

  @watch('customComponents')
  updateCustomComponents() {
    const _cc: CUSTOM_COMPONENT[] | undefined = this.customComponents?.map(c => {
      c.name = c.element?.name;
      c.path = c.element?.path;
      return c; 
    });
    this._customComponentsList = this._customComponentsList.concat((_cc || []).filter(c => !this._customComponentsList?.find(_c => _c.name === c.name)));
  }

  get componentList() {
    const customList: string[] = this._customComponentsList?.map((c: CUSTOM_COMPONENT) => c.name ?? c.element?.name ?? '')?.filter((c: string) => !WebkitComponentsMapping[c]);
    if (this._selectedType === 'All') return Object.keys(WebkitComponentsMapping).concat(customList);
    if (this._selectedType === 'Miscellaneous') return customList;
    return Object.keys(WebkitComponentsMapping).filter((key: string) => WebkitComponentsMapping[key].type === this._selectedType.toLowerCase());
  }

  emitEvent() {
    const _components: CUSTOM_COMPONENT[] = [];
    const _customComponents: CUSTOM_COMPONENT[] = [];
    this._selectedComponents.map(c => {
      const config: COMPONENT_ITEM_TYPE = WebkitComponentsMapping[c];
      const customConfig = this._customComponentsList.find(component => (component.name || component.element?.name) === c);
      if (config) {
        const { type, icon, label, id, properties, settings } = config;
        _components.push({
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
      } else if (customConfig) {
        const { label, id, icon, name, path } = customConfig as CUSTOM_COMPONENT;
        _customComponents.push({
          type: 'miscellaneous',
          label,
          id,
          icon,
          element: {
            name,
            path,
          },
        });
      }
    });
    this.emit('custom-components-updated', {
      detail: {
        components: _components,
        customComponents: _customComponents,
      },
    });
  }

  onTypeSelect(event: CustomEvent) {
    this._selectedType = event.detail.selectedKeys[0];
    this._searchValue = '';
    this.checkScrollBar();
  }

  onSearch(event: CustomEvent) {
    const { value } = event.detail;
    this._searchValue = value;
  }

  renderComponent(component: COMPONENT_ITEM_TYPE) {
    return html`
      <div class="component-box" id=${component.id}>
        ${keyed(component.icon, html`<icon-component class="item" .customStyle=${{ size: 'xl' }} .name=${component.icon}></icon-component>`)}
        <div slot=footer class="label">${component.label}</div>
      </div>
    `;
  }

  generateListItems() {
    const types = ['All'].concat(getComponentTypes()).concat('Miscellaneous');
    return types.map(type => ({
      key: type,
      title: type,
      selected: this._selectedType === type,
    }));
  }

  selectCard(item: string) {
    const existIndex = this._selectedComponents.findIndex(c => c === item);
    if (existIndex > -1) {
      this._selectedComponents.splice(existIndex, 1);
    } else {
      this._selectedComponents.push(item);
    }
    this.requestUpdate();
    this.emitEvent();
  }

  getComponentDetail(name: string) {
    return WebkitComponentsMapping[name] || this._customComponentsList.find(c => (c.name === name) || (c.element?.name === name));
  }

  renderComponentCategories() {
    return html`
      <div>
        <sc-grid-row class=row no-gutters>
          <sc-grid-column xs=5>
            <sc-search-field 
              size=md
              placeholder='Search component'
              @sc-input=${this.onSearch}
            ></sc-search-field>
          </sc-grid-column>
        </sc-grid-row>
        <sc-grid-row no-gutters>
          <sc-grid-column xs=6 md=4 style='height: 21.875rem; overflow-y: scroll; overflow-x: hidden'>
            <div style="padding-right:0.8rem">  
              <sc-list-navigation
                  space-size=none
                  .items=${this.generateListItems()}
                  no-border=${true}
                  @sc-select=${this.onTypeSelect}
                >
              </sc-list-navigation>
            </div>
          </sc-grid-column>
          <sc-grid-column xs=6 md=8 class=component-container>
            <div class=content>
              ${
  repeat(this.componentList.filter(c => {
    if (this._searchValue) {
      if (c.includes(this._searchValue.toLowerCase())) {
        return true;
      }
      return false;
    }
    return true;
  }), item => html`
                  <div>
                    <sc-card 
                      width=4.75rem
                      height=4.75rem
                      space-size=xs 
                      clickable
                      style='--sc-card-border-radius: 0.625rem; float: left' 
                      @click=${() => this.selectCard(item)}
                      ?selected=${this._selectedComponents.includes(item)}
                    >
                      <div>${this.renderComponent(this.getComponentDetail(item))}</div>
                    </sc-card>            
                  </div>
                `)
}
            </div>
          </sc-grid-column>
        </sc-grid-row>
      </div>
    `;
  }

  render() {
    return this.renderComponentCategories();
  }
}

if (!window.customElements.get('form-more-components-container')) {
  window.customElements.define('form-more-components-container', MoreComponentsContainer);
}