import { html, nothing } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import '../../../elements/sc-employee.js';
import { watch } from '../../shared/watch.js';
import { debounce, formatOpt } from '../../shared/util.js';
import { EmployeeInputStyle } from './ScEmployee.style.js';
import { ScEmployeeBase } from './ScEmployeeBase.js';
import { msg } from '../../i18n/localization.js';

export class ScEmployeeInput extends ScEmployeeBase {

  // @ts-ignore
  static styles = [EmployeeInputStyle];

  @property({ type: String }) placeholder: string;
  
  @property({ attribute: 'help-text' }) helpText = '';

  @property({ type: Boolean }) readonly = false;

  @property({ type: Boolean }) disabled = false;

  @property({ type: Boolean }) success = false;

  @property({ type: Boolean }) error = false;

  @property({ type: String, attribute: 'error-message' }) errorMessage = '';

  @property({ type: String, attribute: 'success-message' }) successMessage = '';  

  @property({ type: Boolean }) required = false;

  @property({ type: String }) label = '';

  @property({ type: String }) tooltip = '';

  @property({ type: String, attribute: 'tooltip-placement' }) tooltipPlacement = 'right';

  @property({ type: String, attribute: 'label-size' }) labelSize = 'md';

  @property({ type: String }) value: string;

  @property({ type: Boolean, attribute: 'show-card' }) showCard = false;

  @state() _value: string;

  @state() _valueName: string | undefined;

  @state() _loading = false;

  @state() _displayValue: string | undefined;

  @state() _options: any[];

  @state() _suggestionsLoaded = false;

  @state() _hasSearched = false;
  
  @state() debouncedOnSearch: (event: CustomEvent) => void;

  @query('sc-dropdown-input') dropdownInputEl: HTMLElement;

  constructor() {
    super();
    this.debouncedOnSearch = debounce(this.onSearch.bind(this), 800);
  }

  @watch('value')
  async onValueChange() {
    this._value = this.value;
    this._displayValue = this.value;
    if (this.value?.length > 0) {
      await this.onSearch(new CustomEvent('sc-input', {
        detail: {
          value: this.value,
        },
      }));
      this._displayValue = this.selectedOption?.value;
      const found = this._options?.find(o => o.value === this.value);
      if (found) this._valueName = found.name;
    }  else {
      this._options = [];
    } 
  }

  get selectedOption() {
    const option = this._options?.find(o => o.value === this._value);
    if (option) return formatOpt(option);
    const suggestion = this.suggestedPeople?.find(p => p.profile?.id === this._value);
    if (suggestion) {
      return formatOpt(suggestion.profile);
    }
    return undefined;
  }

  async handleDropdownOpen() {
    this._suggestionsLoaded = true;
    this._hasSearched = false;
    if (!this._suggestedPeopleFromUser) {
      const apiSuggestions = await this.fetchSuggestedPeople();
      this._suggestedPeopleInternal = Array.isArray(apiSuggestions) ? [...apiSuggestions] : [];
      this.requestUpdate('suggestedPeople');
    }
  }

  generateQuery(value? : string) {
    return `
      query profile @cached {
        ${this.expAPINamespace || '_55313_128_webkit_exp_api'} {
          get_employees(keyword: "${value || this.value}", ${this.filter ? `${this.filter},` : ''}includeLeavers:false,size:10) {
            businessTitle
            departmentEntity {
              description
            }
            address {
              city
            }
            email
            phone {
              phone
            }
            businessFunction {
              businessFunction {
                description
              }
            }
            id
            name
          }
        }
      }
    `;
  }

  async onSearch(event: CustomEvent) {
    if (event.detail.value.length <= 3) {
      return;
    }
    this._displayValue = event.detail.value;
    this._loading = true;
    this._hasSearched = true;
    if (this._displayValue) {
      try {
        const response = await this._graphQLClient?.query(this.generateQuery(event.detail.value));
        const jsonData = await response?.json?.();
        const result = jsonData?.data || jsonData;
        const data:any = [];
        const resEmployees = result?.[this.expAPINamespace || '_55313_128_webkit_exp_api']?.get_employees || [];
        resEmployees.forEach((employee:any) => {
          data.push(formatOpt(employee));
        });
        this._options = data;
        this._loading = false;
      } catch (e) {
        this._options = [];
        this._loading = false;
      }
    }
  }

  handleTextInput(event: CustomEvent) {
    const { value } = event.detail;
    this.emit('sc-input', {
      detail: {
        value,
      },
    });
    this._hasSearched = !!value;
    this.debouncedOnSearch(event);
  }

  async onSelect(event: CustomEvent) {
    const value = event.detail.value;
    if (!value) return;
    this._value = value;
    const selected = this.selectedOption;
    this._valueName = selected?.name;
    this._displayValue = value;
    this.emit('sc-select', {
      detail: {
        value: selected,
      },
    });
    const bankId = value;
    await this.addRecentSearchedPerson(bankId);
  }

  onClear() {
    this._value = '';
    this._options = [];
    this._hasSearched = false;
    this.emit('sc-clear');
  }

  render() {
    const { disabled, required, error, success, readonly, placeholder, tooltip, tooltipPlacement, labelSize } = this;

    let dropdownData: any[] = [];

    if (this._hasSearched && this._options?.length) {
      dropdownData = this._options.map(option => ({
        value: option.value,
        displayValue: option.name,
        label: () => this.renderDetails({
          mode: 'compact',
          data: option,
          hideActions: true,
          noTooltip: false,
          type: 'input',
          stopEvent: true,
        }),
      }));
    } else if (!this._hasSearched && this._suggestionsLoaded && this.suggestedPeople?.length) {
      dropdownData = this.suggestedPeople.map(person => ({
        value: person.profile?.id,
        displayValue: person.profile?.name,
        label: () => this.renderDetails({
          mode: 'compact',
          data: person.profile,
          hideActions: true,
          noTooltip: false,
          type: 'input',
          stopEvent: true,
          suggestedPeople: true,
          suggestedId: person.id,
          suggestedPinned: person.type === 'pinned',
        }),
      }));
    }

    return html`
      ${!readonly
    ? html`
            <sc-dropdown-input
              ?disabled=${disabled}
              ?required=${required}
              ?error=${error}
              ?success=${success}
              ?readonly=${readonly}
              clearable
              .placeholder=${placeholder || msg('Search employee', { id: 'sc-employee-search-placeholder' })}
              tooltip=${tooltip}
              tooltip-placement=${tooltipPlacement}
              label-size=${labelSize}
              display-raw-value
              hide-tick-mark
              hoist
              .loading=${this._loading}
              value=${this._valueName || this._displayValue || this._value}
              @sc-input=${this.handleTextInput}
              @sc-select=${this.onSelect}
              @sc-clear=${this.onClear}
              @sc-show=${this.handleDropdownOpen}
              .data=${dropdownData}
            >
              <slot name="label" slot="label">${this.label}</slot>
              <slot name="help" slot="help">${this.helpText}</slot>
              <slot name="error" slot="error">${this.errorMessage}</slot>
              <slot name="success" slot="success">${this.successMessage}</slot>
            </sc-dropdown-input>
          `
    : html`
            <sc-text-input 
              ?disabled=${disabled}
              ?required=${required}
              ?error=${error}
              ?success=${success}
              readonly
              clearable
              .placeholder=${placeholder || msg('Search employee', { id: 'sc-employee-search-placeholder' })}
              tooltip=${tooltip}
              tooltip-placement=${tooltipPlacement}
              label-size=${labelSize}
              display-raw-value
              hoist
              .loading=${this._loading}
              value=${this._displayValue || this._value}
            >
              <slot name="label" slot="label">${this.label}</slot>
              <slot name="help" slot="help">${this.helpText}</slot>
              <slot name="error" slot="error">${this.errorMessage}</slot>
              <slot name="success" slot="success">${this.successMessage}</slot>       
              <div slot="form-control" class="readonly-names">
                ${this._value
    ? html`<sc-employee-name .id=${this._value}></sc-employee-name>`
    : nothing}
              </div>     
            </sc-text-input>
          `}
      ${
  this.selectedOption && this.showCard
    ? html`
              <div part="card" class="employee-card-container">
                <sc-employee-card .data=${this.selectedOption} id=${this.selectedOption?.id}></sc-employee-card>
              </div>
            `
    : nothing
}
    `;
  }
}