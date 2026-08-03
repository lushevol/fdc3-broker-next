import { html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { Condition } from '../../shared/conditions.js';
import type { StepperTemplate, StepOption } from '../../models/Components/index.js';
import { customComponentsContext } from '../contexts/custom-components-context.js';
import { modeContext } from '../contexts/mode-context.js';
import { invalidComponentsContext } from '../contexts/invalid-components-context.js';
import { errorMessagesContext } from '../contexts/error-messages-context.js';
import '../ComponentController.js';
import type { Component } from '../../models/Component.js';
import ScElement from '../utils/sc-element.js';
import type { FORM_DATA_TYPE, INVALID_COMPONENT, ERROR_MESSAGES, CUSTOM_COMPONENT } from '../types.js';
// @ts-ignore
import GridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import { watch } from '../utils/watch.js';
import { WebkitComponentsMapping } from '../../shared/webkitComponentsMapping.js';
import { FormMixin } from '../utils/form-mixin.js';
import { actionContext } from '../contexts/action-context.js';
import { evaluateCondition, generateConditions } from '../Components/common/FormEngine.js';
import { Page } from '../../models/Page.js';

export class FormViewer extends FormMixin(ScElement) {
  static styles = css`
    component-controller {
      display: block;
    }
    .footer {
      height: 2.5rem;
    }
    .footer .prev {
      float: left;
    }
    .footer .next {
      float: right;
    }
    ${GridStyle}
  `;
//@ts-ignore
  @provide({ context: customComponentsContext })
  @property({ type: Array }) customComponents: CUSTOM_COMPONENT[] = [];

  @property({ type: Boolean, attribute: 'show-pagination' }) showPagination = false;
  //@ts-ignore
  @provide({ context: errorMessagesContext })
  @property({ type: Object, attribute: 'error-messsages' }) errorMessages: ERROR_MESSAGES;
  //@ts-ignore
  @provide({ context: modeContext })
  @property({ type: String }) mode = 'view';
//@ts-ignore
  @provide({ context: invalidComponentsContext })
  @state()
  private _invalidComponents: INVALID_COMPONENT[] = [];
//@ts-ignore
  @provide({ context: actionContext })
    _formAction = {
      onValueChange: (e: any, type: string) => undefined,
      onCommentsChange: (type: string) => undefined,
      updateSelectedPage: (type: string) => undefined,
    };

  @property({ type: Boolean }) manually = false;

  _formDataWithConditions: FORM_DATA_TYPE[] = [];

  get page() {
    return this._definition?.getPage(this.selectedPage?.id);
  }

  get pageIndex() {
    return this._definition?.getPageIndex(this.selectedPage?.id);
  }

  // @ts-ignore
  @watch('customComponents')
  updateCustomComponents() {
    Object.keys(WebkitComponentsMapping).forEach(c => {
      const config = WebkitComponentsMapping[c];
      if (!this.customComponents.find(cc => cc.element?.name === c)) {
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
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._formAction.onValueChange = this._onValueChange;
    this._formAction.onCommentsChange = this._onCommentsChange;
    this._formAction.updateSelectedPage = this._updateSelectedPage;
  }

  public getAndHighlightTheInvalidComponents(errorMessages?: ERROR_MESSAGES) {
    const invalidComponents: INVALID_COMPONENT[] = this.getAllInvalidComponents();
    this._invalidComponents.splice(0, this._invalidComponents.length, ...invalidComponents);
    if (errorMessages) {
      this.errorMessages = errorMessages;
    }
    this.requestUpdate();
    return invalidComponents;
  }

  _updateSelectedPage = (id: string) => {
    if (this.selectedPage) {
      this.selectedPage.id = id;
      this.requestUpdate();
    }
    return undefined;
  };

  calculateConditions(template: any = {}) {
    const { conditions, hidden } = template;
    if (!conditions) return true;
    conditions.forEach((c: Condition) => {
      const { rule, value } = c;
      if (['<', '>', '<=', '>='].includes(rule)) {
        c.value = Number(value);
      }
    });
    const conditionStr = generateConditions(conditions, this._formData);
    if (!evaluateCondition(conditionStr, this._formData)) {
      return false;
    }
    if (hidden) {
      return false;
    }
    return true;
  }

  togglePage(action: string) {
    if (this.selectedPage) {
      const { pages } = this._definition;
      const index = pages.findIndex((page: Page) => page.id === this.selectedPage.id);
      if (index > -1) {
        if (action === 'next') {
          const page = pages[index + 1];
          if (page) {
            this._formAction.updateSelectedPage(page.id);
          }
        } else if (action === 'prev') {
          const page = pages[index - 1];
          if (page) {
            this._formAction.updateSelectedPage(page.id);
          }
        }
      }
    }
  }

  render() {
    if (!this._definition) return nothing;
    const rows = this.page?.getAllRowsComponents(this.page?.components);
    if (!rows) return nothing;
    const _key = Math.random();
    this._formDataWithConditions = this._formData;
    return html`
      ${
  Object.keys(rows).map((id: string) => {
    const rowData = rows[id];
    return html`
            <sc-grid-row data-row-id=${id}>
              ${
  rowData.map((c: Component) => {
    const { layout, customized, type, template, id } = c;
    let customComponent;
    const hidden = template?.hidden;
    if (customized && this.customComponents) {
      customComponent = this.customComponents.find((c: any) => c.id === type);
    }
    const res = this.calculateConditions(c.template);
    const dataIndex = this._formDataWithConditions.findIndex((data: FORM_DATA_TYPE) => data.id === id);
    if (dataIndex > -1 && !res) {
      this._formDataWithConditions[dataIndex].hidden = true;
    } else {
      delete this._formDataWithConditions?.[dataIndex]?.hidden;
    }
    const isEmpty = !!this._invalidComponents.find((d: any) => d.id === id);
    return html`
                    <sc-grid-column
                      class='grid-column'
                      style='display: ${(res && !hidden) ? 'block' : 'none'};'
                      xs=${layout?.column}
                    >
                      <component-controller 
                        mode=view
                        .key=${_key}
                        id=${c.id}
                        ?invalid=${isEmpty || !!this.errorMessages?.[c.id]}
                        error-message=${this.errorMessages?.[c.id] || (isEmpty ? 'This cannot be empty!' : '')}
                        ?readonly=${this.readonly}
                        .component=${c}
                        .customComponent=${customComponent}
                        .value=${this._formData?.find((d: any) => d.id === c.id)?.value}
                        @component-value-changed=${this._onValueChange}
                        @component-blur=${this._onBlur}
                        @component-value-selected=${this._onValueSelect}
                        @component-comments-changed=${this._onCommentsChange}
                      ></component-controller>
                    </sc-grid-column>
                  `;
  })
}
            </sc-grid-row>
          `;
  })
}
      ${this.showPagination ? html`
        <div class=footer>
          ${
  this.pageIndex <= 0 ? 
    nothing : 
    html`
              <sc-link class=prev @click=${() => this.togglePage('prev')}>
                <sc-icon name=arrow-ios-backward></sc-icon>Prev
              </sc-link>
            `
}
          ${
  this.pageIndex >= this._definition?.pages?.length - 1 ? 
    nothing : 
    html`
              <sc-link class=next @click=${() => this.togglePage('next')}>
                Next<sc-icon name=arrow-ios-forward></sc-icon>
              </sc-link>
            `
}
        </div>
      ` : nothing}
    `;
  }
}

