import { provide } from '@lit/context';
import { property, state } from 'lit/decorators.js';
import type { Component } from '../../models/Component.js';
import type { Page } from '../../models/Page.js';
import type { StepOption, StepperTemplate } from '../../models/Components/index.js';
import { FormDefinition } from '../../models/FormDefinition.js';
import { Rule } from '../../models/Rule.js';
import { ComponentNames } from '../../shared/componentTypes.js';
import { callAPI } from '../../shared/graphQLClient.js';
import '../ComponentController.js';
import { OnLoad } from '../FormEditor/Rules/constants.js';
import { dataContext } from '../contexts/data-context.js';
import { formContext } from '../contexts/form-context.js';
import { pageContext } from '../contexts/page-context.js';
import { commentContext, commentDataContext } from '../contexts/comment-context.js';
import { formInstanceContext } from '../contexts/form-instance-context.js';
import { predefinedContext } from '../contexts/predefined-context.js';
import type { CUSTOM_COMPONENT, FORM_DATA_TYPE, INVALID_COMPONENT, COMMENT_DATA } from '../types.js';
import { generateQuery } from './graphql.js';
import { generateRestQuery, invokeProcessApiRaw, isProcessApiSource } from './process-api.js';
import { watch } from './watch.js';
import { directEvaluateCondition } from '../Components/common/FormEngine.js';
import { hasValue } from '../../shared/utils.js';

export const FormMixin = (
  superClass: any
) => {
  class FormMixinClass extends superClass {
    //@ts-ignore
    @provide({ context: formContext })
    @state()
    private _definition: FormDefinition;

    @property({ type: Object }) definition: FormDefinition;

    @property({ type: Array }) data: any[];

    @property({ type: Array }) commentsData: any[];

    @property({ type: Boolean, attribute: 'enable-comments' }) enableComments: boolean;
    
    @property({ type: Number, reflect: true }) threshold = 3;

    @property({ type: String, attribute: 'default-page' }) defaultPage: string;

    @property({ type: Boolean }) readonly: boolean;

    @property({ type: Array })
    //@ts-ignore
    @provide({ context: predefinedContext })
    //@ts-ignore
    predefined: any[] | object;
    
    //@ts-ignore
    @provide({ context: dataContext })
    @state()
    private _formAllData: FORM_DATA_TYPE[] = [];
//@ts-ignore
    @provide({ context: pageContext })
    @state()
      selectedPage = { id: '' };

    //@ts-ignore
    @provide({ context: commentContext })
    @state()
      _enableComments = false;

    //@ts-ignore
    @provide({ context: commentDataContext })
    @state()
    _commentsData: COMMENT_DATA[] = [];
    
    //@ts-ignore
    @provide({ context: formInstanceContext })
    @state()
      formInstance: HTMLElement;

    @state() private _formData: FORM_DATA_TYPE[] = [];

    private _ruleRequestMap = new Map<string, {
      inFlight?: Promise<any>;
      lastResult?: any;
      lastTime?: number;
    }>();

    private _ruleRequestDedupeWindowMs = 300;

    get page() {
      return this._definition?.getPage(this.selectedPage?.id);
    }
    get components() {
      return this.page?.getAllComponentsWithParents() || [];
    }
    get componentsInAllPages() {
      let _components: Component[] = [];
      this._definition?.pages?.forEach((page: Page) => {
        _components = _components.concat(page.getAllComponentsWithParents());
      });
      return _components;
    }
    
    // @ts-ignore
    @watch(['definition'])
    async updateDefinition() {
      if (!this.definition) {
        // @ts-ignore
        this.definition = window.definition;
      }
      if (this._definition) {
        // @ts-ignore
        this._definition = null;
        await this.updateComplete;
      }
      this._definition = new FormDefinition().update(this.definition || this.manifest);
      if (this._definition?.customComponents) {
        this._definition.customComponents?.forEach((c: any) => {
          this.customComponents?.push(c);
        });
      }
      // update selected page
      if ((this._definition.pages?.length > 1 && this.mode === 'view' && !this.defaultPage) || !this.selectedPage.id) {
        this.selectedPage.id = this._definition.pages[0].id;
        this.requestUpdate();
      }
      this.updateDefaultSelectedPage?.();
      this.updateStepper();
      this.executeRules();
      this.updateFormAllData();
      this.loadCustomComponentsPath();
      // @ts-ignore
      this.formInstance = this;
      this.emit('load', {
        detail: {
          invalidComponents: this.getAllInvalidComponents(),
        },
      });
    }

    // @ts-ignore
    @watch('data')
    updateData() {
      if (this.data) {
        this._formData.length = 0;
        this.data.forEach(d => {
          this._formData.push(d);
        });
        this.updateFormAllData();
      }
    }

    // @ts-ignore
    @watch(['commentsData', 'enableComments'])
    updateCommentsData() {
      this._enableComments = this.enableComments;
      if (this.commentsData) {
        this._commentsData.length = 0;
        this.commentsData.forEach(d => {
          this._commentsData.push(d);
        });
        this.updateFormAllData();
      }
    }

    // @ts-ignore
    @watch(['defaultPage'])
    defaultPageUpdate() {
      if (this.selectedPage && this.defaultPage) {
        this.selectedPage.id = this.defaultPage;
        this.requestUpdate();
      }
    }

    loadCustomComponentsPath() {
      if (this.customComponents?.length) {
        this.customComponents.forEach(async (cc: CUSTOM_COMPONENT) => {
          const { name, path } = (cc?.element ?? {}) as CUSTOM_COMPONENT;
          if (path && name) {
            const component: any = document.createElement(name);
            if (component.requestUpdate) {
              return;
            }
            try {
              await import(path);
            } catch (e) {
              // Nothing
            }
          }
        });
      }
    }

    updateFormAllData() {
      this._formAllData.splice(0, this._formAllData.length);
      this.componentsInAllPages?.forEach((c: any) => {
        const { id, template, type, value } = c;
        const existData = this._formData.find(d => d.id === id);
        if (existData) {
          this._formAllData.push(existData);
          return;
        }
        const newValue = {
          id,
          value,
          type,
          label: template?.label,
        };
        this._formAllData.push(newValue);
      });
    }

    updateStepper() {
      const steppers = this.components?.filter((c: Component) => c.type === ComponentNames.STEPPER);
      if (!steppers?.length) return;
      const invalidComponents = this.getAllInvalidComponents();
      steppers?.forEach((stepper: any) => {
        const { template } = stepper;
        if (!template.conditional) return;
        const { steps } = template;
        const invalidSteps: string[] = [];
        steps.forEach((step: StepOption) => {
          const { id } = step;
          const invalidComponentsInCurrentStep = invalidComponents.filter(c => c.stepId === id);
          if (invalidComponentsInCurrentStep.length) {
            invalidSteps.push(id);
          }
        });
        template.updateConditionalStatus(invalidSteps);
      });
    }

    executeRules() {
      const rules = this._definition?.rules;
      if (rules && Array.isArray(rules)) {
        rules.forEach((rule: Rule) => {
          if (rule.type === OnLoad) {
            this.triggerRule(rule);
          }
        });
      }
    }

    _buildMetadataExtraField(
      value: string,
      extraFieldsOptions: Record<string, Record<string, any>>,
      extraFields: string[]
    ) {
      return extraFields.reduce<Record<string, any>>((result, key) => {
        result[key] = extraFieldsOptions[value][key];
        return result;
      }, {});
    }

    _onValueChange = async (e: CustomEvent) => {
      if (this._formDataWithConditions) {
        this._formData = this._formDataWithConditions;
      }
      const { value, component, manuallyUpdate, updateInvalid } = e.detail;
      const { id, template, type } = component;
      const targetId = (e.target as HTMLElement)?.id;
      const extraFields = template.optionConfig?.extraFields;
      if (id) {
        const newValue = {
          id,
          value,
          type,
          label: template?.label,
        };
        if (extraFields) {
          const { extraFieldsOptions } = template;
          const { options } = template;
          if (extraFieldsOptions && options) {
            if (Array.isArray(value) && value.length > 0) {
              const list = value.map(item => this._buildMetadataExtraField(
                item,
                extraFieldsOptions,
                extraFields
              ));
              // @ts-ignore
              newValue.metadata = { extraFields: list };
            } else if (extraFieldsOptions[value]) {
              const list = [this._buildMetadataExtraField(value, extraFieldsOptions, extraFields)];
              // @ts-ignore
              newValue.metadata = { extraFields: list };
            }
          }
        }
        const index = this._formData?.findIndex(d => d.id === id);
        const indexInAll = this._formAllData?.findIndex(d => d.id === id);
        let invalidChanged = false;
        if (index > -1) {
          if (hasValue(value, component)) {
            this._formData[index] = newValue;
            if (targetId === id) {
              this.deleteInvalidComponent(id);
              invalidChanged = true;
            }
          } else {
            this._formData.splice(index, 1);
            if (template?.required && !this._invalidComponents.find((d: any) => d.id === id)) {
              this._invalidComponents.push({
                label: template.label,
                type,
                id,
              });
              invalidChanged = true;
            }
          }
        } else {
          this._formData.push(newValue);
          if (targetId === id) {
            this.deleteInvalidComponent(id);

            // if the first time to set value for the component, check if it's required and valid
            if (!hasValue(value, component) && template?.required) {
              this._invalidComponents.push({
                label: template.label,
                type,
                id,
              });
            }
            invalidChanged = true;
          }
        }
        if (indexInAll > -1) {
          this._formAllData[indexInAll] = newValue;
        } else {
          this._formAllData.push(newValue);
        }
        this.updateStepper();
        !manuallyUpdate && this.requestUpdate();
        invalidChanged && updateInvalid && this.requestUpdate();
        this.emit('value-changed', {
          detail: {
            data: this._formData,
            allData: this._formAllData,
            activeData: newValue,
            invalidComponents: this.getAllInvalidComponents(),
          },
        });
        if (component.referrers) {
          component.referrers.forEach((ref: any) => {
            const parents = this._definition?.pages?.[0]?.getComponentParents(ref);
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let parentEle: any = this;
            parents?.forEach((p: any) => {
              parentEle = parentEle?.shadowRoot?.querySelector(`component-controller[id="${p.id}"]`)?.shadowRoot?.querySelector(`[id='${p.id}']`);
            });

            const dependedEle = parentEle?.shadowRoot?.querySelector(`component-controller[id="${ref}"]`)?.shadowRoot?.querySelector(`[id='${ref}']`);
            
            if (dependedEle) {
              // @ts-ignore
              dependedEle.getDynamicOptions();
            }
          });
        }
        if (component.populators) {
          component.populators.forEach((ref: any) => {
            const parents = this._definition?.pages?.[0]?.getComponentParents(ref);
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let parentEle: any = this;
            parents?.forEach((p: any) => {
              parentEle = parentEle?.shadowRoot?.querySelector(`component-controller[id="${p.id}"]`)?.shadowRoot?.querySelector(`[id='${p.id}']`);
            });

            const dependedEle = parentEle?.shadowRoot?.querySelector(`component-controller[id="${ref}"]`)?.shadowRoot?.querySelector(`[id='${ref}']`);
            if (dependedEle) {
              // @ts-ignore
              dependedEle.populateValue(value);
              const index = this._formData?.findIndex(d => d.id === dependedEle.id);
              const newValue = {
                id: dependedEle.id,
                value,
                label: dependedEle.template.label,
              };
              if (index > -1) {
                this._formData[index] = newValue;
              } else {
                this._formData.push(newValue);
              }
            }
          });
        }

        const hasRuleValue = hasValue(value);
        if (component.rules && hasRuleValue) {
          component.rules.forEach((rule: string) => {
            const ruleConfig = this._definition?.getRule(rule);
            if (ruleConfig) {
              this.triggerRule(ruleConfig, component);
            }
          });
        }
        !manuallyUpdate && this.requestUpdate();
      }
    };

    _onCommentsChange(e: CustomEvent) {
      const { value } = e.detail;
      this.emit('comments-changed', {
        detail: {
          commentsData: value,
        },
      });
      this.requestUpdate();
    }

    private _toRuleRequestKey(source: any, config: Rule, pValues: any) {
      const normalize = (value: any): any => {
        if (Array.isArray(value)) {
          return value.map(normalize);
        }
        if (value && typeof value === 'object') {
          return Object.keys(value)
            .sort()
            .reduce((acc: Record<string, any>, key: string) => {
              acc[key] = normalize(value[key]);
              return acc;
            }, {});
        }
        return value;
      };

      return JSON.stringify({
        dataSource: config?.dataSource,
        sourceType: source?.type,
        apiNameSpace: source?.apiNameSpace,
        apiQueryName: source?.apiQueryName,
        apiEndpoint: source?.apiEndpoint,
        apiMethod: source?.apiMethod,
        responseAttribute: config?.responseAttribute,
        params: normalize(pValues),
      });
    }

    private _getOrCreateRuleRequest(
      key: string,
      fetcher: () => Promise<any>,
    ) {
      const now = Date.now();
      const current = this._ruleRequestMap.get(key);

      if (current?.inFlight) {
        return current.inFlight;
      }

      if (
        current &&
        current.lastTime &&
        now - current.lastTime <= this._ruleRequestDedupeWindowMs
      ) {
        return Promise.resolve(current.lastResult);
      }

      const inFlight = fetcher()
        .then((result: any) => {
          this._ruleRequestMap.set(key, {
            lastResult: result,
            lastTime: Date.now(),
          });
          return result;
        }, (error: any) => {
          const latest = this._ruleRequestMap.get(key);
          if (latest?.inFlight) {
            delete latest.inFlight;
            this._ruleRequestMap.set(key, latest);
          }
          throw error;
        })
        .then((result: any) => {
          const latest = this._ruleRequestMap.get(key);
          if (latest?.inFlight) {
            delete latest.inFlight;
            this._ruleRequestMap.set(key, latest);
          }
          return result;
        });

      this._ruleRequestMap.set(key, {
        ...(current || {}),
        inFlight,
      });

      return inFlight;
    }
    
    async triggerRule(config: Rule, bindComponent?: Component) {
      if (this.readonly && config?.disableTriggerInReadonly) return;
      const source = this._definition.getDataSource(config.dataSource);
      if (!source) return;
      const { parameters, responseAttribute, fields } = config;
      const pValues: any = {};
      
      if (parameters && Array.isArray(parameters)) {
        parameters.forEach((p: any) => {
          const apiArgument: any = source.apiArguments?.find((arg: any) => arg.value === p.name);
          if (p?.source === 'text') {
            pValues[p.name] = {
              value: p.value,
              type: apiArgument?.type,
            };
          } else if (p?.source === 'component') {
            const v: any = this._formData?.find((d: any) => d.id === p.value);
            const hasParamValue = hasValue(v?.value);
            if (hasParamValue) {
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

      const requestKey = this._toRuleRequestKey(source, config, pValues);
      const resultPromise = this._getOrCreateRuleRequest(requestKey, () =>
        isProcessSource
          ? invokeProcessApiRaw(
            this._restClient,
            generateRestQuery({
              apiNameSpace,
              apiEndpoint,
              apiMethod,
              filters: pValues,
              apiArguments: source.apiArguments,
            }),
          ).then((response: any) => response?.json())
          : callAPI(generateQuery({
            namespace: apiNameSpace,
            name: apiQueryName,
            filters: pValues,
            fields: apiFields,
          }), this._graphQLClient)
      );

      resultPromise.then((result: any) => {
        let _errorMessage: string;
        try {
          _errorMessage = directEvaluateCondition(errorMessageParameter, result);
        } catch (error) {
        }

        const defaultResult = isProcessSource
          ? result
          : result?.[apiNameSpace]?.[apiQueryName];
        const dataList = responseAttribute ? result?.[responseAttribute] : defaultResult;
        if (fields) {
          Object.keys(fields).forEach(f => {
            let value: any;
            if (f.includes('.')) {
              value = dataList;
              f.split('.').forEach(i => {
                value = value?.[i];
              });
            } else {
              value = dataList?.[f];
            }
            // @ts-ignore
            const componentId = fields[f];
            const component: Component = this.page?.getComponent(componentId) as Component;
            const bindComponentId = bindComponent?.id || componentId;
            if (showErrorMessage && !_errorMessage) {
              this.deleteInvalidComponent(bindComponentId);
              if (this.errorMessages?.[bindComponentId]) {
                delete this.errorMessages[bindComponentId];
              }
            }
            if (showErrorMessage && _errorMessage) {
              this.errorMessages = this.errorMessages || [];
              this.errorMessages[bindComponentId] = _errorMessage;
              const invalidField = this._invalidComponents.findIndex((c: INVALID_COMPONENT) => c.id === bindComponentId);
  
              if (invalidField <= -1) {
                this._invalidComponents.push({
                  label: (bindComponent || component).template?.label,
                  type: (bindComponent || component).type,
                  id: bindComponentId,
                });
              }
              return;
            }
            if (component) {
              const currentValue = this._formData?.find(d => d.id === componentId)?.value;
              const isUnchanged = (() => {
                if (currentValue === value) {
                  return true;
                }
                if (
                  currentValue &&
                  value &&
                  typeof currentValue === 'object' &&
                  typeof value === 'object'
                ) {
                  try {
                    return JSON.stringify(currentValue) === JSON.stringify(value);
                  } catch (error) {
                    return false;
                  }
                }
                return currentValue === value;
              })();

              if (isUnchanged) {
                return;
              }

              this._onValueChange({
                detail: {
                  value,
                  component,
                  manuallyUpdate: true,
                  updateInvalid: true,
                },
                target: {
                  id: componentId,
                },
              } as unknown as CustomEvent);
            }
          });
          this.updateFormAllData();
          this.requestUpdate();
        }
        this.emit('rule-triggered', {
          detail: {
            rule: config,
          },
        });
      });
      
    }

    _onBlur(e: CustomEvent) {
      const { value, component } = e.detail;
      this.emit('form-blur', {
        detail: {
          activeComponent: {
            id: component.id,
            value,
            type: component.type,
            label: component.template?.label,
          },
        },
      });
    }

    _onValueSelect(e: CustomEvent) {
      const { value, component } = e.detail;
      this.emit('value-selected', {
        detail: {
          activeComponent: {
            id: component.id,
            value,
            type: component.type,
            label: component.template?.label,
          },
        },
      });
    }

    deleteInvalidComponent(id: string) {
      if (this._invalidComponents) {
        const index = this._invalidComponents.findIndex((c: INVALID_COMPONENT) => c.id === id);
        if (index > -1) {
          this._invalidComponents.splice(index, 1);
        }
      }
    }

    getAllInvalidComponents() {
      const components = this.page?.getAllComponents() || [];
      const invalidComponents: INVALID_COMPONENT[] = [];
      components.forEach((c: Component) => {
        if (!c || !c.template) return;
        const parents = this.page?.getComponentParents(c.id) || [];
        const tabs = parents.filter((p: Component) => p.type === ComponentNames.TABS).map((p: Component) => p.template.tabs).flat() || [];
        const show = this.calculateConditions?.(c.template);
        const parentShow = parents.every((parent: Component) => {
          // If the parent component is in a tab, return false if the tab not exist
          if (parent.tabId && !tabs.find((t: any) => t.id === parent.tabId)) {
            return false;
          }
          return this.calculateConditions?.(parent.template);
        });
        if (!show || !parentShow) return;
        // If the component is in a tab, check if the tab is still exist
        if (c.tabId && !tabs.find((t: any) => t.id === c.tabId)) return;
        const { required, label } = c.template;
        const existedData = this._formData.find(d => d.id === c.id);
        if ((required && !hasValue(existedData?.value, c))) {
          invalidComponents.push({
            label,
            type: c.type,
            id: c.id,
            stepId: c.stepId,
          });
        }
      });
      return invalidComponents;
    }

    getHiddenFormData() {
      return this._formData.filter(d => d.hidden);
    }

    public updateStepperStatus(stepperId: string, steps: StepOption[]) {
      const stepper: Component = this.components.find((c: Component) => c.id === stepperId);
      if (stepper?.type !== ComponentNames.STEPPER) return;
      (stepper.template as StepperTemplate).manuallyUpdateStatus(steps);
      this.requestUpdate();
    }

  }

  return FormMixinClass as any;
};
