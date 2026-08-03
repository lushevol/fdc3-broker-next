import { html, nothing } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import '../../../elements/sc-employee.js';
import { watch } from '../../shared/watch.js';
import { debounce, formatOpt, uniqueOption } from '../../shared/util.js';
import { EmployeeInputStyle, EmployeeMultiInputStyle } from './ScEmployee.style.js';
import { ScEmployeeBase } from './ScEmployeeBase.js';
import { msg } from '../../i18n/localization.js';

export class ScEmployeeMultiInput extends ScEmployeeBase {

  // @ts-ignore
  static styles = [EmployeeInputStyle, EmployeeMultiInputStyle];

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

  @property({ type: Number, attribute: 'min-count' }) minCount?: number;

  @property({ type: Number, attribute: 'max-count' }) maxCount?: number;

  @property({ type: Array }) value: string[] = [];

  @property({ type: Boolean, attribute: 'show-card' }) showCard = false;

  @state() _value: string[] = [];

  @state() _displayValue: string[] = [];

  @state() _valueNames: string[] = [];

  @state() _loading = false;

  @state() _options: any[] = [];

  @state() _selectedValue: any[] = [];

  @state() debouncedOnSearch: (event: CustomEvent) => void;

  @state() _inputValue = '';

  @state() _suggestionsLoaded = false;

  @state() _hasSearched = false;

  @query('sc-dropdown-multi-select') dropdownMultiSelectEl: HTMLElement;

  constructor() {
    super();
    this.debouncedOnSearch = debounce(this.onSearch.bind(this), 800);
  }

  @watch('value')
  async onValueChange() {
    if (Array.isArray(this.value) && this.value.length && JSON.stringify(this.value) !== JSON.stringify(this._value)) {
      await this.renderDefaultValue();
    }
    let normalized = Array.isArray(this.value) ? this.value : (this.value ? [this.value] : []);
    if (Array.isArray(normalized) && typeof normalized[0] === 'object' && normalized[0] !== null) {
      normalized = normalized.map((item: any) => item.id || item.value || (item.profile && item.profile.id));
    }
    normalized = normalized.filter(v => typeof v === 'string' && v);
    this._value = normalized;
    
    this._valueNames = [...this._value];
    if (this._value.length === 0) {
      this._options = [];
      this._displayValue = [];
      this._valueNames = [];
    }
  }

  get selectedOption() {
    const selected = [];
    if (Array.isArray(this._value)) {
      for (const val of this._value) {
        const option = this._options?.find(o => o.id === val || o.value === val);
        if (option) {
          selected.push(formatOpt(option));
          continue;
        }
        const suggestion = this.suggestedPeople?.find(p => p.profile?.id === val);
        if (suggestion) {
          selected.push(formatOpt(suggestion.profile));
          continue;
        }
      }
    }
    return selected;
  }

  connectedCallback() {
    super.connectedCallback();
    if (Array.isArray(this.value)) {
      this.renderDefaultValue();
    }
  }

  async renderDefaultValue() {
    const employeeResponse = await this._graphQLClient?.query(`
      query profile @cached {
        ${this.expAPINamespace || '_55313_128_webkit_exp_api'} {
          ${this.value?.map((item, index) => `
            emp${index}: get_employee(id: "${item}") {
              businessTitle
              departmentEntity {
                description
              }
              email
              phone {
                phone
              }
              id
              name
            }`)}
        }
      }
    `);
    const employeeJsonData = await employeeResponse?.json?.();
    this._options = Object.values(employeeJsonData?.data?.[this.expAPINamespace || '_55313_128_webkit_exp_api'] || {}).map((item: any) => {
      return formatOpt(item);
    });

    const selectOpt = uniqueOption(
      this.value
        .map(val => this._options.find(opt => opt.id === val || opt.value === val))
        .filter(Boolean),
      'id'
    );

    this._displayValue = selectOpt.map(opt => opt.value);
    this._selectedValue = selectOpt;
    this._valueNames = selectOpt.map(opt => opt.id) || [];
  }

  generateQuery() {
    return `
      query profile @cached {
        ${this.expAPINamespace || '_55313_128_webkit_exp_api'} {
          get_employees(keyword: "${this._inputValue}", ${this.filter ? `${this.filter},` : ''}includeLeavers:false,size:10) {
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

  async handleDropdownOpen() {
    if (!this._suggestedPeopleFromUser) {
      const apiSuggestions = await this.fetchSuggestedPeople();
      this._suggestedPeopleInternal = Array.isArray(apiSuggestions) ? [...apiSuggestions] : [];
      this.requestUpdate('suggestedPeople');
    }
    this._suggestionsLoaded = true;
    this._hasSearched = false;
    this._valueNames = [...(this._value || [])];
  }

  async onSearch(event: CustomEvent) {
    this._inputValue = event.detail.value;
    this._loading = true;

    if (this._inputValue) {
      try {
        const response = await this._graphQLClient?.query(this.generateQuery());
        const jsonData = await response?.json?.();
        const result = jsonData?.data || jsonData;
        const data: any = [];
        const resEmployees = result?.[this.expAPINamespace || '_55313_128_webkit_exp_api']?.get_employees || [];
        resEmployees.forEach((employee: any) => {
          data.push(formatOpt(employee));
        });
        this._options = uniqueOption(data.concat(this._selectedValue), 'id');
        this._loading = false;
        this._hasSearched = true;
        if (this._value?.length) {
          this._valueNames = [...this._value];
        }
      } catch (e) {
        this._options = this._selectedValue;
        this._loading = false;
        this._hasSearched = true;
      }
    } else {
      this._options = this._selectedValue;
      this._loading = false;
      this._hasSearched = false;
    }
  }

  handleTextInput(event: CustomEvent) {
    const { value } = event.detail;
    this.emit('sc-input', {
      detail: {
        value,
      },
    });
    this.debouncedOnSearch(event);
  }

  async onSelect(event: CustomEvent) {
    let allValues = event?.detail?.allValues;
    if (Array.isArray(allValues) && typeof allValues[0] === 'object' && allValues[0] !== null) {
      allValues = allValues.map((item: any) => item.id || item.value || (item.profile && item.profile.id));
    }
    if (typeof allValues === 'string') {
      allValues = [allValues];
    }
    allValues = (Array.isArray(allValues) ? allValues : []).filter(v => typeof v === 'string' && v);
    this._value = allValues;
    const selected = [];
    for (const val of this._value) {
      const option = this._options?.find(o => o.id === val || o.value === val);
      if (option) {
        selected.push(formatOpt(option));
        continue;
      }
      const suggestion = this.suggestedPeople?.find(p => p.profile?.id === val);
      if (suggestion) {
        selected.push(formatOpt(suggestion.profile));
        continue;
      }
    }
    //@ts-ignore
    const selectOpt = uniqueOption(selected, 'id');
    this._displayValue = selectOpt?.map((opt: { value: any; }) => opt.value);
    this._selectedValue = selectOpt;
    this._valueNames = [...(this._value || [])];
    this.emit('sc-select', {
      detail: {
        value: this._selectedValue,
      },
    });

    const dropdown = this.shadowRoot?.querySelector('sc-dropdown-multi-select');
    if (dropdown && typeof dropdown.hide === 'function') {
      dropdown.hide();
    }
    for (const bankId of this._value || []) {
      await this.addRecentSearchedPerson(bankId);
    }
  }

  onClear() {
    this._value = [];
    this._options = [];
    this._valueNames = [];
    this.emit('sc-clear');
  }

  getDropdownData() {
    const selectedHidden = this._selectedValue.map(option => ({
      value: option.value,
      displayValue: option.name,
      hideOption: true,
      label: () => this.renderDetails({
        mode: 'compact',
        data: option,
        hideActions: true,
        noTooltip: false,
        type: 'multi-input',
        stopEvent: true,
      }),
    }));

    if (this._hasSearched || (this._options?.length && !this._suggestionsLoaded)) {
      return this._options.map(option => ({
        value: option.value,
        displayValue: option.name,
        hideOption: this._valueNames.includes(option.id) || this._value.includes(option.value),
        label: () => this.renderDetails({
          mode: 'compact',
          data: option,
          hideActions: true,
          noTooltip: false,
          type: 'multi-input',
          stopEvent: true,
        }),
      }));
    } else if (!this._hasSearched && this._suggestionsLoaded && this.suggestedPeople?.length) {
      const suggestionIds = new Set(this.suggestedPeople.map((p: any) => p.profile?.id));
      return [
        ...this.suggestedPeople.map(person => ({
          value: person.profile?.id,
          displayValue: person.profile?.name,
          label: () => this.renderDetails({
            mode: 'compact',
            data: person.profile,
            hideActions: true,
            noTooltip: false,
            type: 'multi-input',
            stopEvent: true,
            suggestedPeople: true,
            suggestedId: person.id,
            suggestedPinned: person.type === 'pinned',
          }),
        })),
        ...selectedHidden.filter(s => !suggestionIds.has(s.value)),
      ];
    }
    return selectedHidden;
  }

  render() {
    const { disabled, required, error, success, readonly, placeholder, tooltip, tooltipPlacement, labelSize } = this;
    const hasCustomErrorSlot = !!this.querySelector('[slot="error"]');
    const shouldForwardErrorSlot = !!this.errorMessage || hasCustomErrorSlot;
    const _placeholder = placeholder || msg('Search employee', { id: 'sc-employee-search-placeholder' });
    return html`
        ${!readonly
    ? html`
              <sc-dropdown-multi-select
                ?disabled=${disabled}
                ?required=${required}
                ?error=${error}
                ?success=${success}
                clearable
                .placeholder=${_placeholder}
                tooltip=${tooltip}
                tooltip-placement=${tooltipPlacement}
                label-size=${labelSize}
                hoist
                hide-checkbox
                hide-tick-mark
                .loading=${this._loading}
                .minCount=${this.minCount}
                .maxCount=${this.maxCount}
                .value=${this._valueNames || this._displayValue || this._value}
                @sc-input=${this.handleTextInput}
                @sc-select=${this.onSelect}
                @sc-clear=${this.onClear}
                @sc-show=${this.handleDropdownOpen}
                .data=${this.getDropdownData()}
              >
                <slot name="label" slot="label">${this.label}</slot>
                <slot name="help" slot="help">${this.helpText}</slot>
                ${shouldForwardErrorSlot
    ? html`<slot name="error" slot="error">${this.errorMessage}</slot>`
    : nothing}
                <slot name="success" slot="success">${this.successMessage}</slot>
              </sc-dropdown-multi-select>
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
                value=${this._valueNames || this._displayValue || this._value}
              >
                <slot name="label" slot="label">${this.label}</slot>
                <slot name="help" slot="help">${this.helpText}</slot>
                ${shouldForwardErrorSlot
    ? html`<slot name="error" slot="error">${this.errorMessage}</slot>`
    : nothing}
                <slot name="success" slot="success">${this.successMessage}</slot>       
                <div slot="form-control" class="sc-employee-multi-input-readonly">
              ${this._value
    ?.map((value, index) => {
      const option = this._options?.find(opt => opt.value === value);
      return html`
                    <sc-employee-name .data=${option}></sc-employee-name>
                    ${index < this._value.length - 1
    ? html`<span class="sc-employee-multi-input-readonly-comma">,</span>`
    : nothing}
                  `;
    })}
                </div>     
              </sc-text-input>
            `}
        ${
  this.showCard && Array.isArray(this._displayValue)
    ? this._displayValue.map((employee, index) => {
      return html`
                  <div part="card" class="employee-card-container">
                    <sc-employee-card id=${employee} .data=${this.selectedOption[index]}></sc-employee-card>
                  </div>
                `;
    })
    : nothing
}
    `;
  }
}