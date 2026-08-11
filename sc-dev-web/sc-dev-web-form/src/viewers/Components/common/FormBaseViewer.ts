import { consume } from '@lit/context';
import { PropertyValues, css, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Component } from '../../../models/Component.js';
import { FormDefinition } from '../../../models/FormDefinition.js';
import type { ValueChangeCallback, CommentsChangeCallback } from '../../../shared/formTypes.js';
import { callAPI } from '../../../shared/graphQLClient.js';
import type { PropertyItemType } from '../../FormEditor/DataSource/types.js';
import { actionContext } from '../../contexts/action-context.js';
import { dataContext } from '../../contexts/data-context.js';
import { formContext } from '../../contexts/form-context.js';
import { modeContext } from '../../contexts/mode-context.js';
import { pageContext } from '../../contexts/page-context.js';
import { commentContext, commentDataContext } from '../../contexts/comment-context.js';
import { predefinedContext } from '../../contexts/predefined-context.js';
import CommonStyle from '../../utils/common.style.js';
import { generateQuery } from '../../utils/graphql.js';
import { generateRestQuery, invokeProcessApiRaw, isProcessApiSource } from '../../utils/process-api.js';
import ScElement from '../../utils/sc-element.js';
import { evaluateCondition, generateConditions, directEvaluateCondition } from './FormEngine.js';
import type { COMMENT_DATA } from '../../types.js';
import { formInstanceContext } from '../../contexts/form-instance-context.js';

export class FormBaseViewer extends ScElement {

  static styles = css`
    .left, .right, .center {
      display: flex;
    }
    .left {
      justify-content: left;
    }
    .right {
      justify-content: end;
    }
    .center {
      justify-content: center;
    }
    p {
      margin-block-start: 0;
      margin-block-end: 0;
    }
    ${CommonStyle}
  `;
  // @ts-ignore
  @consume({ context: formContext, subscribe: true })
  @state() 
    formDefinition: FormDefinition;

  @consume({ context: formInstanceContext })
  @state() formInstance: any;

  @consume({ context: actionContext })
    _formAction: any;

  // @ts-ignore
  @consume({ context: pageContext, subscribe: true })
  @state()
    selectedPage = { id: '' };

  // @ts-ignore
  @consume({ context: predefinedContext })
  @property() 
    predefined: any;

  @property({ type: Object }) component: Component;

  @property({ type: String }) key: string;

  @property({ type: Boolean }) invalid: boolean;

  @property({ type: Boolean }) readonly: boolean;

  @property({ type: String, attribute: 'error-message' }) errorMessage: string;

  @property({ type: Function }) onValueChange: ValueChangeCallback | undefined;

  @property({ type: Function }) onCommentsChange: CommentsChangeCallback | undefined;

  @property({ type: Function }) onValueSelect: ValueChangeCallback = () => {};
 
  @property({ type: Function }) onBlur: ValueChangeCallback = () => {};
    
  //@ts-ignore
  @consume({ context: modeContext })
  @property({ type: String }) mode: string;

  @state() show: boolean;

  // @ts-ignore
  @consume({ context: dataContext })
  @state() 
    formData: any[];
  
  @state() showCommentModal = false;
  @state() _currentAllComments: COMMENT_DATA[]  = [];

  // @ts-ignore
  @consume({ context: commentContext })
  @state()
    _enableComments: boolean;

  //@ts-ignore
  @consume({ context: commentDataContext })
  @state()
    _commentsData: COMMENT_DATA[] = [];

  @state() documentViewerFile:any;

  get template() {
    return this.component?.template || {};
  }

  connectedCallback() {
    super.connectedCallback();

    this.getDynamicOptions();
    this.populateValue();
    this.calculateConditions();
  }

  updated(properties: PropertyValues) {
    const { type } = this.component;
    const shouldUpdateComponent = properties.has('component') && JSON.stringify(properties.get('component')) !== JSON.stringify(this.component);
    /*  Add shouldUpdateOnValueChange
        Fix: The select component can't trigger the getDynamicOptions method after obtaining data */
    const shouldUpdateOnValueChange = properties.has('onValueChange') && ['dropdown-multi-select'].includes(type) && JSON.stringify(properties.get('component')) !== JSON.stringify(this.component);
    if (shouldUpdateComponent || shouldUpdateOnValueChange) {
      this.getDynamicOptions();
      this.populateValue(); 
    }
    this.calculateConditions();
  }

  getValueByRealKey(obj: any, key: string) {
    const keyArr = key.split('.');
    let value = obj;
    if (keyArr.length > 1) {
      keyArr.forEach((key: string) => {
        value = value[key] || value;
      });
    } else {
      value = obj[keyArr[0]];
    }
    return value;
  }

  getKey(value: string, properties: PropertyItemType) {
    if (properties) {
      return Object.keys(properties).find(key => properties[key] === value);
    }
    return -1;
  }

  injectExtraFieldAndOptionItem(
    dataItem: any,
    options: any[],
    labelField: string,
    valueField: string,
    extraFieldMap?: Record<string, Record<string, any>>,
    extraFields?: string[]
  ) {
    const pk = this.getValueByRealKey(dataItem, valueField) || dataItem;

    options.push({
      label: this.getValueByRealKey(dataItem, labelField) || dataItem,
      value: pk,
    });

    if (extraFields) {
      extraFieldMap![pk] = extraFields.reduce((map, f) => {
        map[f] = this.getValueByRealKey(dataItem, f) || dataItem;
        return map;
      }, {} as Record<string, any>);
    }
  }

  injectExtraFieldAndColumnItem(
    dataItem: any,
    options: any[],
    dynamicColumns: object,
    extraFieldMap?: Record<string, Record<string, any>>,
    extraFields?: string[]
  ) {
    const pkArr =  Object.entries(dynamicColumns).reduce((acc, [key, value]:any) => {
      const pk = this.getValueByRealKey(dataItem, value) || dataItem;
      //@ts-ignore
      acc[key] = pk; 
      return acc;
    }, {});
    options.push(pkArr);
  }

  injectExtraFieldAndBindKeyItem(
    dataItem: any,
    options: any[],
    dynamicBindKey: object,
    extraFieldMap?: Record<string, Record<string, any>>,
    extraFields?: string[]
  ) {
    const pkArr =  Object.entries(dynamicBindKey).reduce((acc, [key, value]:any) => {
      const pk = this.getValueByRealKey(dataItem, value) || '';
      //@ts-ignore
      acc[key] = pk; 
      return acc;
    }, {});
    options.push(pkArr);
  }

  private extractKeys (optionConfig: any, filterKey?: string, removeKey?: string) {
    return Object.entries(optionConfig)
      .filter(([key]) => !filterKey || key.startsWith(filterKey))
      .reduce((acc, [key, value]) => {
        const processedKey = removeKey ? key.replace(removeKey, '') : key;
        acc[processedKey] = value as string;
        return acc;
      }, {} as { [key: string]: string });
  }

  private mapDynamicKeys(contents: any[], dynamicKeys: any, properties: any): any[] {
    return contents.map((c: any) => {
      const pkArr = Object.entries(dynamicKeys).reduce((acc, [key, value]: any) => {
        const pk = c[this.getKey(value, properties) as number];
        // @ts-ignore
        acc[key] = pk;
        return acc;
      }, {});
      return pkArr;
    }).filter((item: any) => 
      Object.keys(item).some(key => key && item[key] !== undefined)
    );
  }

  async getDynamicOptions() {
    const { optionConfig } = this.template;
    if (!optionConfig) { return; }
    const { type, id, parameters, labelField, valueField, extraFields, keys } = optionConfig;
    const dynamicColumns = this.extractKeys(optionConfig, 'Column');
    const optionKey: string = this.component.type === 'table' ? 'data' : 'options';
    if (type === 'dataSource') {
      const dataSources = this.formDefinition.getDataSources();
      let source: any, pValues: any;
      if (dataSources && Array.isArray(dataSources)) {
        source = dataSources.find(d => d.id === id);
        if (!source) return;
        if (source.type === 'excel' && source.parsedData) {
          const { properties, contents } = source.parsedData;
          if (dynamicColumns?.Column1) {
            const options = this.mapDynamicKeys(contents, dynamicColumns, properties);
            this.component.updateTemplate(optionKey, options);
          }
          else if (keys && Object.keys(keys).length > 0) {
            const options = this.mapDynamicKeys(contents, keys, properties);
            this.component.updateTemplate(optionKey, options);
          }
          else {
            this.component.updateTemplate(optionKey, contents?.map((c: any) => ({
              label: c[this.getKey(labelField, properties) as number],
              value: c[this.getKey(valueField, properties) as number],
            })).filter((item: any) => item.label !== undefined));
          }
          this.requestUpdate();
          return;
        }
        if (parameters && Array.isArray(parameters)) {
          pValues = {};
          parameters.forEach(p => {
            const apiArgument = source.apiArguments?.find((arg: any) => arg.value === p.name);
            if (p?.source === 'text') {
              pValues[p.name] = {
                value: p.value,
                type: apiArgument?.type,
              };
            } else if (p?.source === 'component') {
              const v: any = this.formData?.find((d: any) => d.id === p.value);
              if (v) {
                pValues[p.name] = {
                  value: v.value,
                  type: apiArgument?.type,
                };
              }
            }
          });
        }
                
        const {
          apiNameSpace,
          apiQueryName,
          apiFields,
          showErrorMessage,
          errorMessageParameter,
          apiEndpoint,
          apiMethod,
        } = source;
        const isProcessSource = isProcessApiSource(source);
        let result: any;
        if (isProcessSource) {
          const processResult = await invokeProcessApiRaw(
            this._restClient,
            generateRestQuery({
              apiNameSpace,
              apiEndpoint,
              apiMethod,
              filters: pValues,
              apiArguments: source.apiArguments,
            }),
          );
          result = await processResult.json();
        } else {
          const query = generateQuery({
            namespace: apiNameSpace,
            name: apiQueryName,
            filters: pValues,
            fields: apiFields,
          });
          result = await callAPI(query, this._graphQLClient);
        }
        let _errorMessage = '';
        try {
          _errorMessage = directEvaluateCondition(errorMessageParameter, result);
        } catch (error) {
          
        }
        if (showErrorMessage && !_errorMessage) {
          this.errorMessage = '';
        }
        if (showErrorMessage && _errorMessage) {
          this.errorMessage = _errorMessage;
          return;
        }
        let dataList = isProcessSource
          ? (result?.data || result?.result || result)
          : result?.[apiNameSpace]?.[apiQueryName];
        const options: any = [];
        const extraFieldsObj: Record<string, Record<string, any>> = {};
        if (dynamicColumns?.Column1 && dataList) {
          const processDataList = (data: any) => {
            if (Array.isArray(data)) {
              data.forEach((item: any) => {
                this.injectExtraFieldAndColumnItem(item, options, dynamicColumns, extraFieldsObj, extraFields);
              });
            } else {
              this.injectExtraFieldAndColumnItem(data, options, dynamicColumns, extraFieldsObj, extraFields);
            }
          };
        
          if (!Array.isArray(dataList)) {
            Object.entries(dynamicColumns).forEach(([key, value]) => {
              if (value?.includes('.')) {
                dataList = dataList[value.split('.')[0]];
              }
            });
          }
        
          processDataList(dataList);
        } 
        else if (keys && Object.keys(keys).length > 0 && dataList) {
          const processDataList = (data: any) => {
            const processItem = (item: any) => {
              this.injectExtraFieldAndBindKeyItem(item, options, keys, extraFieldsObj, extraFields);
            };
            if (Array.isArray(data)) {
              data.forEach(processItem);
            } else {
              processItem(data);
            }
          };

          processDataList(dataList);
        }
        else if (dataList) {
          if (Array.isArray(dataList)) {
            dataList.forEach((item: any) => {
              this.injectExtraFieldAndOptionItem(item, options, labelField, valueField, extraFieldsObj, extraFields);
            });
          } else {
            if (labelField?.includes('.') || valueField?.includes('.')) {
              dataList = dataList[valueField.split('.')[0]];
            }
            if (Array.isArray(dataList)) {
              dataList.forEach((item: any) => {
                this.injectExtraFieldAndOptionItem(item, options, labelField, valueField, extraFieldsObj, extraFields);
              });
            } else {
              this.injectExtraFieldAndOptionItem(dataList, options, labelField, valueField, extraFieldsObj, extraFields);
            }
          }
        }
        this.component.updateTemplate(optionKey, options);
        this.component.updateTemplate('extraFieldsOptions', extraFieldsObj);
        this.requestUpdate();
      }
    }

  }

  getContextValue() {
    const { populateType, contextType, contextField, contextFieldChild, options } = this.template;
    //@ts-ignore
    const _contextSource: any = this[`_${contextType}`];
    if (populateType !== 'context' || !contextField) return;
    switch (contextType) {
      case 'locale':
        let localeData = _contextSource?.[contextField]();
        localeData = Array.isArray(localeData) && localeData.length > 0 ? localeData.map((item: any) => ({ label: item.name, value: item.id })) : [{ label: localeData, value: localeData }];
        if (options) {
          return localeData;
        }
        return localeData[0]?.label;
      case 'navigation':
        if (contextField === 'params' && contextFieldChild) {
          const v = _contextSource?.[contextField]?.[contextFieldChild];
          if (options) {
            return [{ label: v, value: v }];
          }
          return v;
        }
        const value_ = _contextSource?.[contextField];
        if (options) {
          return [{ label: value_, value: value_ }];
        }
        return value_;
      default:
        const v = _contextSource?.[contextField];
        if (options) {
          return [{ label: v, value: v }];
        }
        return v;
    }
  }

  async getDocumentViewerValue() {
    const { optionConfig } = this.template;
    if (!optionConfig) { return; }
    const { id, parameters } = optionConfig;
    const dataSources = this.formDefinition.getDataSources();
    let source: any, pValues: any;
    if (dataSources && Array.isArray(dataSources)) {
      source = dataSources.find(d => d.id === id);
      if (!source || source?.type === 'excel') return;
      if (parameters && Array.isArray(parameters)) {
        pValues = {};
        parameters.forEach(p => {
          const apiArgument = source.apiArguments?.find((arg: any) => arg.value === p.name);
          if (p?.source === 'text') {
            pValues[p.name] = {
              value: p.value,
              type: apiArgument?.type,
            };
          } else if (p?.source === 'component') {
            const v: any = this.formData?.find((d: any) => d.id === p.value);
            if (v) {
              pValues[p.name] = {
                value: v.value,
                type: apiArgument?.type,
              };
            }
          }
        });
      }
      const { apiNameSpace, apiQueryName } = source;
      try {
        const res = await this._restClient.request(
          apiNameSpace,
          apiQueryName,
          'POST',
          pValues,
          { 'Content-Type': 'application/json' },
        );
        const blobData = await res?.blob();
        if (blobData) {
          const contentDisposition = res.headers.get('Content-Disposition') || '';
          const contentType = res.headers.get('Content-Type') || '';
          let filename = '';
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            filename = decodeURIComponent(match[1]);
          }
          const blob = new Blob([blobData]);
          const file = new File([blob], filename, { type: contentType });
          this.documentViewerFile = file;
        }
      } catch (error) {
        console.error('Error fetching document viewer value:', error);
      }
    }
  }

  populateValue(value?: any) {
    const { populate, populateType, populateSource, defaultValue } = this.template;
    if (!populate) { return; }
    const existingValue = this.formData?.find((d: any) => d.id === this.component.id)?.value;
    const populateValue = populateType === 'predefined'
      ? this.predefined?.values?.[populateSource]
      : populateType === 'component'
      ? this.formData?.find((d: any) => d.id === populateSource)?.value
      : '';
    const v: any = value || populateValue;
    this.component?.updateTemplate('value', v);

    // emit value change if pre-fill value is free text 
    if (populateType === 'text' && defaultValue) {
      this._onValueChange(new CustomEvent('value-changed', {
        detail: {
          value: existingValue || defaultValue,
        },
      }));
    }
    this.requestUpdate();
  }

  calculateConditions() {
    if (this.mode === 'edit') return true;
    const { conditions, hidden } = this.template;
    if (!conditions || !this.formData) return true;
    const conditionStr = generateConditions(conditions, this.formData);
    if (!evaluateCondition(conditionStr, this.formData)) {
      return false;
    }
    if (hidden) {
      this.show = false;
      return false;
    }
    this.show = true;
    return true;
  }

  _onValueChange(e: CustomEvent) {
    const nextValue = e.detail.value ?? e.detail.text;
    if (this.onValueChange) {
      this.onValueChange(nextValue);
    } else if (this._formAction?.onValueChange) {
      this._formAction?.onValueChange({ detail: {
        value: nextValue,
        component: this.component,
      } });
    }
  }

  _onBlur(e: CustomEvent) {
    this.onBlur(e.detail.value);
  }

  renderElement() {}

  renderConditionIcon() {
    const { conditions } = this.template;
    if (this.mode === 'edit' && conditions) {
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
    const { hidden } = this.template;
    if (this.mode === 'edit' && hidden) {
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
              .maxRepliesdepth=3
              .maxVisibleReplies=2
              @sc-change=${(e: any) => { 
                this._currentAllComments = e.detail.allComments;
                this.emitUpdateComments();
              }}
            ></sc-comment>
          </div>
        </sc-modal>
      `;
    }
    return nothing;
  }

  addCidToComments(comments: any[]): any[] {
    return comments.length > 0 ? comments.map(comment => ({ ...comment, cid: this.component.id })) : [];
  }

  emitUpdateComments() {
    if (this.mode === 'view') {
      const currentAllComments = this.addCidToComments(this._currentAllComments);
      const filteredCommentsData = this._commentsData.filter(item => item.cid !== this.component.id);
      if (this._formAction?.onCommentsChange) {
        if (this.onCommentsChange) {
          this.onCommentsChange([...currentAllComments, ...filteredCommentsData]);
        } else if (this._formAction?.onCommentsChange) {
          this._formAction?.onCommentsChange({ detail: {
            value: [...currentAllComments, ...filteredCommentsData],
            component: this.component,
          } });
        }
      }
    }
  }

  render() {
    if (!this.calculateConditions()) {
      return nothing;
    }
    return html`
      <div class=${this.component?.alignment}>
       ${this.renderElement()}
       ${this.renderConditionIcon()}
       ${this.renderHiddenIcon()}
       ${this.renderCommentsIcon()}
      </div>
    `;
  }

  getFilterOption(_options: any) {
    const filteredOptions = _options.filter((option: any) => ((option.id || option.name) || (option.id || option.title)  || (option.label || option.value)));
    if (filteredOptions.length !== _options.length) {
      return filteredOptions;
    }
    return _options;
  }
}