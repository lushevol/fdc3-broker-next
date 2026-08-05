import { html, nothing, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import type { ValueChangeFunction } from '../../../shared/formTypes.js';
import type { STYLES, EDIT_PROPERTIES, COMMENT_DATA } from '../../types.js';
import { Component } from '../../../models/Component.js';
import { OptionBase } from '../../../models/base/OptionBase.js';
import { FormDefinition } from '../../../models/FormDefinition.js';
import CommonStyle from '../../utils/common.style.js';
import { componentContext } from '../../contexts/component-context.js';
import { stylesContext } from '../../contexts/styles-context.js';
import { formContext } from '../../contexts/form-context.js';
import { actionContext } from '../../contexts/action-context.js';
import { editPropertiesContext } from '../../contexts/edit-properties-context.js';
import { pageContext } from '../../contexts/page-context.js';
import ScElement from '../../utils/sc-element.js';
import { conditionOptions, OptionType, Condition } from '../../../shared/conditions.js';
import { ComponentNames, InputAndSelectionComponentTypes } from '../../../shared/componentTypes.js';
import { PropertyCategories, PropertiesMapping, CommonPropertyCategories } from '../../../shared/propertyTypes.js';
import { commentContext, commentDataContext } from '../../contexts/comment-context.js';

// @ts-ignore
import GridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';

export class BaseEditor extends ScElement {
  
  static styles = css`
    ${GridStyle}
  `;

  public simpleToolbars = [
    'undo',
    'redo',
    'separate',
    'fontstyle',
    'separate',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'backcolor',
    'forecolor',
    'clear',
    'addlink',
    'unlink',
  ];
  // @ts-ignore
  @consume({ context: componentContext })
  @property({ type: Object }) component: Component;

  // @ts-ignore
  @consume({ context: formContext, subscribe: true })
  @property({ attribute: false }) 
    formDefinition: FormDefinition;

  // @ts-ignore    
  @consume({ context: actionContext })
    _formAction: any;

  // @ts-ignore    
  @consume({ context: editPropertiesContext })
    _editProperties: EDIT_PROPERTIES;
  
  // @ts-ignore
  @consume({ context: stylesContext })
  @property() styles: STYLES;

  // @ts-ignore
  @consume({ context: pageContext, subscribe: true })
  @state()
    _selectedPage = { id: '' };
  
  @state()
    _idErrorMessage = '';

  @property({ type: String }) title: string;

  @property({ type: Number }) key: number;

  @property({ type: Boolean, attribute: 'show-properties' }) showProperties = false;

  @property({ type: Function, attribute: false }) onPropertiesChange: ValueChangeFunction;

  @state() _conditions = false;

  @state() _comments = false;

  @state() showCommentModal = false;

  // @ts-ignore
  @consume({ context: commentContext })
  @state()
    _enableComments: boolean;

  //@ts-ignore
  @consume({ context: commentDataContext })
  @state()
    _commentsData: COMMENT_DATA[] = [];

  get page() {
    return this.formDefinition.getPage(this._selectedPage?.id);
  }
  get components() {
    return (this.page?.getAllComponents() || []).filter((c: Component) => c.id !== this.component.id);
  }
  onChange = async (value: any, key: string) => {
    await this.component.updateTemplate(key, value);
    this.page?.updateComponent(this.component.id, this.component);
    this._formAction.updateFormDefinition();
  };
  changeId = async (event: CustomEvent) => {
    if (!this.checkIdWhenInput(event)) {
      return;
    }
    const { value } = event.detail;
    const oldComponentID = this.component.id;
    this.component.updateId(value);
    this.page?.updateComponent(oldComponentID, this.component);
    this._formAction.updateFormDefinition();
    this._idErrorMessage = '';
  };
  checkId(event: KeyboardEvent) {
    const charCode = event.charCode || event.keyCode;
    if (!/[a-zA-Z0-9]/.test(String.fromCharCode(charCode))) {
      this._idErrorMessage = 'Only support letters and numbers';
      event.preventDefault();
    }
  }
  checkIdWhenInput(event: CustomEvent) {
    if (!/^[a-zA-Z0-9]+$/.test(event.detail.value)) {
      this._idErrorMessage = 'Only support letters and numbers';
      event.preventDefault();
      return false;
    }
    return true;
  }
  renderLabel: any = () => {
    const { label } = this.component?.template ?? {};
    return html`
      <div class=row>
        <sc-text-input
          label="Label"
          value=${label}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'label')}
        >
        </sc-text-input>
      </div>
    `;
  };

  renderId: any = () => {
    const { id } = this.component;
    return html`
      <div class=row>
        <sc-text-input
          label="Id"
          value=${id}
          border-type="box"
          @sc-input=${this.changeId}
          @keypress=${this.checkId}
          @input=${this.checkIdWhenInput}
          ?error=${!!this._idErrorMessage}
          error-message=${this._idErrorMessage}
        >
        </sc-text-input>
      </div>
    `;
  };

  renderTooltip: any = () => {
    return nothing;
  };
  
  renderOtherGeneral: any = () => {
    return nothing;
  };

  renderBehavior: any = () => {
    return nothing;
  };

  renderOtherBehavior: any = () => {
    return nothing;
  };

  renderPrefillAnswer: any = () => {
    return nothing;
  };

  renderDataOptions: any = () => {
    return nothing;
  };

  renderValidation: any = () => {
    return nothing;
  };

  renderStyleAndLayout: any = () => {
    return nothing; 
  };

  renderAllStyleAndLayout: any = () => {
    return html`
      <div>
        ${this.renderStyleAndLayout()}
        ${this.renderAlignment()}
      </div>
    `;
  };

  renderAlignment: any = () => {
    const alignment = this.component?.alignment || 'default';
    return html`
      <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label=Alignment
          value=${alignment}
          @sc-change=${(e: CustomEvent) => {
    this.component.updateAlignment(e.detail.value);
            this.page?.updateComponent(this.component.id, this.component);
    this._formAction.updateFormDefinition();
    this.requestUpdate();
  }}
        >
          <sc-radio value=default>Default</sc-radio>
          <sc-radio value=left>Left</sc-radio>
          <sc-radio value=center>Center</sc-radio>
          <sc-radio value=right>Right</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderProperty: any = (category: string) => {
    switch (category) {
    case PropertyCategories.GENERAL:
      return html`
          ${this.renderId()}
          ${this.renderLabel()}
          ${this.renderTooltip()}
          ${this.renderOtherGeneral()}
        `;
    case PropertyCategories.BEHAVIOR:
      return html`
          ${this.renderBehavior()}
          ${this.renderOtherBehavior()}
        `;
    case PropertyCategories.DATABINDING:
      return html`
          ${this.renderDataOptions()}
          ${this.renderPrefillAnswer()}
        `;
    case PropertyCategories.VALIDATION:
      return html`
          ${this.renderValidation()}
        `;
    case 'Conditions':
      return html`
          ${this.renderConditions()}
        `;
    case PropertyCategories.STYLINGLAYOUT:
      return html`
          ${this.renderAllStyleAndLayout()}
        `;
    case PropertyCategories.ADDINTIONALSETTINGS:
      return html`
          ${this.renderComments()}
        `;
    default:
      return '';
    }
  };

  renderProperties: any = () => {
    const { type } = this.component;
    const order = [
      PropertyCategories.GENERAL,
      PropertyCategories.BEHAVIOR,
      PropertyCategories.DATABINDING,
      PropertyCategories.STYLINGLAYOUT,
      PropertyCategories.VALIDATION,
      PropertyCategories.CONDITIONS,
      PropertyCategories.ADDINTIONALSETTINGS,
    ];
    let categories = this._editProperties?.[type] || PropertiesMapping[type] || CommonPropertyCategories;
    categories = categories.sort((a,b) => {
      return order.indexOf(a) - order.indexOf(b);
    });
    return html`
      <div>
        ${repeat(categories, (property, index) => html`
          <sc-accordion ?open=${index === 0}>
            <div slot="summary">${property}</div>
            ${this.renderProperty(property)}
          </sc-accordion>
        `)}
      </div>
    `;
  };

  renderPropertiesByType: any = () => {
    return nothing;
  };

  renderBasicComponent: any = () => {
    return nothing;
  };


  needConditionValue = (rule: string) => {
    return rule !== 'isEmpty' && rule !== 'isNotEmpty';
  };

  addNewCondition() {
    let { conditions } = this.component?.template ?? {};
    conditions = (conditions || []).concat({});
    this.onChange(conditions, 'conditions');
    this.requestUpdate();
  }
  
  deleteCondition(index: number) {
    const { conditions } = this.component?.template ?? {};
    if (conditions?.[index]) {
      conditions.splice(index, 1);
      this.onChange(conditions, 'conditions');
      this.requestUpdate();
    }
  }

  renderConditions: any = () => {
    const { conditions } = this.component?.template ?? {};

    return html`
      <div>
        <div class=row>
          <sc-checkbox 
            ?checked=${!!conditions}
            @sc-change=${(e: CustomEvent) => {
    this._conditions = e.detail.checked;
    this.onChange(e.detail.checked ? [{}] : undefined, 'conditions');
    this.requestUpdate();
  }}
          >
            Show when the condition is met
          </sc-checkbox>
        </div>
        ${
  (this._conditions || !!conditions) ? conditions?.map((c: Condition, index: number) => {
    const selectedComponent = this.components.find((data: Component) => data.id === c.component);
    const type = selectedComponent?.type;
    const options = selectedComponent?.template?.options;
    const ruleOptions = conditionOptions.filter(
      c =>
        c.types.includes(type)
    );
    const isMultiSelect = [ComponentNames.DROPDOWNMULTISELECT, ComponentNames.CHECKBOX].includes(type);
    const componentOptions = this.components.filter((c: Component) => Object.keys(InputAndSelectionComponentTypes).includes(c.type));
    return html`
              ${
  index > 0 ? html`
                  <div style='display: flex; margin: margin:0.75rem 0 0.5rem'>
                    <sc-button-group style='flex: 1' value=${JSON.stringify([c.condition])} single-select @sc-select=${(event: CustomEvent) => {
  this.updateCondition(event.detail.value[0], 'condition', index);
}}>
                      <sc-button-group-item value=&&>AND</sc-button-group-item>
                      <sc-button-group-item value=||>OR</sc-button-group-item>
                    </sc-button-group>
                    <span @click=${() => this.deleteCondition(index)} style='display: flex;cursor: pointer;color: var(--sc-color-red-500)'>
                      <sc-icon name="trash--line" size="sm"></sc-icon>
                    </span>
                  </div>
                ` : null
}
              <div class="condition-row">
                <sc-dropdown-input 
                  hoist
                  placeholder=Component
                  value=${c.component}
                  border-type=box
                  @sc-select=${(event: CustomEvent) => {
                    const c_type = componentOptions.find((c: Component) => c.id === event.detail.value)?.type;
                    this.updateCondition(event.detail.value, 'component', index);
                    this.updateCondition(c_type, 'type', index);
  }}
                >
                  ${
                    componentOptions.map((c: Component) => {
    return html`
                        <sc-dropdown-option value=${c.id}>${c.template.label || c.id}</sc-dropdown-option>
                      `;
  })
}
                </sc-dropdown-input>
              </div>
              <div class="condition-row">
                <sc-dropdown-input 
                  hoist
                  placeholder=Rule
                  value=${c.rule}
                  border-type=box
                  @sc-select=${(event: CustomEvent) => {
    this.updateCondition(event.detail.value, 'rule', index);
  }}
                >
                  ${
  ruleOptions.map((rule: OptionType) => {
    return html`
                        <sc-dropdown-option value=${rule.value}>${rule.label}</sc-dropdown-option>
                      `;
  })
}
                </sc-dropdown-input>
              </div>
              <div class="condition-row">
                ${!this.needConditionValue(c.rule) 
    ? null 
    : options?.map((o: OptionBase) => o.value).join('') 
      ? isMultiSelect ? html`
                    <sc-dropdown-multi-select
                      label=""
                      hoist
                      placeholder="Values"
                      border-type="box"
                      .value=${c.value}
                      @sc-select=${(event: CustomEvent) => {
    this.updateCondition(event.detail.value, 'value', index);
  }}
                    >
                      ${options.map(
    (item: OptionBase) => html`
                          <sc-dropdown-option value=${item.value}
                            >${item.label}</sc-dropdown-option
                          >
                        `
  )}
                    </sc-dropdown-multi-select>`
        : html`
                      <sc-dropdown-input
                        hoist
                        label=""
                        placeholder="Value"
                        border-type="box"
                        .value=${c.value}
                        @sc-select=${(event: CustomEvent) => {
    this.updateCondition(event.detail.value, 'value', index);
  }}
                      >
                        ${options.map(
    (item: OptionBase) => html`
                            <sc-dropdown-option value=${item.value}
                              >${item.label}</sc-dropdown-option
                            >
                          `
  )}
                      </sc-dropdown-input>`
      : ['<', '>', '<=', '>='].includes(c.rule)
        ? html`
            <sc-number-input
              label=""
              placeholder="Values"
              value=${c.value}
              border-type="box"
              @sc-input=${(event: CustomEvent)=> {
                  if (event.detail?.value) {
                    event.detail.value = Number(event.detail.value);
                  }
                  this.updateCondition(event.detail.value, 'value', index);
              }}
            ></sc-number-input>`
        : html`
            <sc-text-input
            label=""
            placeholder="Values"
            value=${c.value}
            border-type="box"
            @sc-input=${(event: CustomEvent) => this.updateCondition(event.detail.value, 'value', index)}
          >
          </sc-text-input>`
}
            </div>
            `;
  }) : nothing
}
        <div class="row add-condition">
          <sc-link @click=${this.addNewCondition}>+ Add new condition</sc-link>
        </div>    
      </div>
    `;
  };

  updateCondition(value: string, type: string, index: number) {
    let { conditions } = this.component.template;
    if (conditions?.[index]) {
      conditions[index] = {
        ...conditions[index],
        [type]: value,
      };
    } else {
      conditions = (conditions || [])[index] = {
        [type]: value,
      };
    }
    this.onChange(conditions, 'conditions');
    this.requestUpdate();
  }

  renderConditionIcon() {
    const { conditions } = this.component?.template ?? {};
    if (conditions) {
      return html`<div style='margin-top:0.25rem'><sc-tooltip 
        style='color: var(--sc-color-blue-500); cursor: pointer;'
        trigger=hover
        content-max-width=9.375rem
        @mouseenter=${(e: MouseEvent) => { e.stopPropagation(); }} 
        content='Conditions enabled'>
          <sc-icon name=link-alt></sc-icon>
        </sc-tooltip><div>`;
    }
  }

  renderHiddenIcon() {
    const { hidden } = this.component?.template ?? {};
    if (hidden) {
      return html`<div><sc-tooltip 
        style='color: var(--sc-color-blue-500); cursor: pointer'
        trigger=hover
        content-max-width=9.375rem
        @mouseenter=${(e: MouseEvent) => { e.stopPropagation(); }} 
        content='Hidden'>
          <sc-icon name=eye-off-alt></sc-icon>
        </sc-tooltip></div>`;
    }
  }

  removeSpaces(value: string) {
    if (value) { return value.replace(/\s+/g, ''); }
    return value;
  }
  

  uploadFile = async (key:string, file: any) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result;
        this.onChange(base64String, key);
        this.onChange([{
          id: file.id,
          name: file.name,
          type: file.type,
          size: file.size,
        }], 'files');
        this.requestUpdate();
      };
      reader.onerror = () => {
        console.error('Error reading file:', reader.error);
      };
    } else {
      this.onChange('', key);
    }
  };

  downloadFile = (base64Image: any, filaName: string) => {
    if (!base64Image) {
      console.error('No file provided for download.');
      return;
    }
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = filaName || 'image';
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  base64ToFile(base64Image: any, fileName: string) {
    const [header, base64] = base64Image.split(',');
    const mimeMatch = header.match(/:(.*?)[;,]/);
    if (!mimeMatch) return;
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const bstr = atob(base64);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], fileName, { type: mime });
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    return { id, file };
  }

  renderComments: any = () => {
    const { comments } = this.component?.template ?? {};

    return html`
      <div>
        <div class=row>
          <sc-checkbox 
            ?checked=${!!comments}
            @sc-change=${(e: CustomEvent) => {
              this.onChange(e.detail.checked, 'comments');
              this.requestUpdate();
            }}
          >
            Add comments.
          </sc-checkbox>
        </div>
       `;
  };

  renderCommentsIcon() {
    const { comments } = this.component?.template ?? {};
    if (this._enableComments || comments) {
      return html`
        <div style='margin-top:0.25rem; color: var(--sc-color-blue-500); 
        cursor: pointer;'>
          <sc-icon name="message-circle--line" @click=${() => {
            this.showCommentModal = true;
         }}></sc-icon>
        <div>
        ${this.renderCommentsModal()}
      `;
    }
  }

  renderCommentsModal() {
    const { comments } = this.component?.template ?? {};
    const userInfo = {
      bankdid: this._user?.id,
      name: `${this._user?.firstName} ${this._user?.lastName}`,
    };
    const commentsData = this._commentsData.filter(d => d.cid === this.component.id);
    if ((this._enableComments || comments) && this.showCommentModal) {
      return html`
      <style>
      .modal-container{
        min-height: 22rem;  
      }
      </style>
        <sc-modal size=md open=${this.showCommentModal} 
          @sc-hide=${() => { 
            this.showCommentModal = false;
          }} 
          disable-outside-click
          header="Edit comments">
          <div>
            <sc-comment
              .userInfo=${userInfo}
              .comments=${commentsData}
              .actions=${[]}
              .maxRepliesdepth=3
              .maxVisibleReplies=2
            ></sc-comment>
          </div>
        </sc-modal>
      `;
    }
    return nothing;
  }

  render() {
    if (this.showProperties) {
      return html`
        <style>${CommonStyle}</style>
        ${this.renderProperties()}
      `;
    }
    return html`${this.renderBasicComponent()}`;
  }
}