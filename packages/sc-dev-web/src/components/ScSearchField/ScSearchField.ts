import { html, render } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { msg } from '@lit/localize';
import ScTheme from '../../styles/ScTheme.js';
import ScSearchFieldStyle from './ScSearchField.style.js';
import DropdownBase from '../ScDropdown/DropdownBase.js';
import '../../../elements/sc-text-input.js';
import { COMPACT_SIZE } from '../../shared/util.js';
import { watch } from '../../shared/watch.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import { ScTextInput } from '../ScFormInput/ScTextInput.js';
import { classMap } from 'lit/directives/class-map.js';
import { HasSlotController } from '../../shared/slot.js';

/**
 * @summary Autocompletes displays suggestions as you type.
 *
 * @dependency sl-dropdown
 * @dependency sl-menu
 *
 * @slot empty-text - The text or content that is displayed when there is no suggestion based on the input.
 *
 * @csspart empty-text - The empty text's wrapper.
 *
 */

/**
 * @interface SuggestionOption
 * Represents an option in the search field's suggestion list.
 *
 * @property {string} value - The value of the item.
 * @property {any} text - A custom text element or content for the dropdown options.
 * @property {any} displayValue - A custom label that will appear on the search-field when you select an option.
 */
interface SuggestionOption {
  value: string;
  text?: any;
  displayValue?: string;
}

export class ScSearchField extends DropdownBase {
  static styles = ScTheme.getStyles().concat([ScSearchFieldStyle]);

  @state() private hasFocus = false;

  @state() private loading = false;

  @state() private displayValue = '';

  @property({ type: String, reflect: true, attribute: 'empty-text' })
  emptyText = 'No data found';

  @property({ type: String, reflect: true }) placeholder = '';

  @property({ type: Boolean, reflect: true }) readonly = false;

  @property({ type: Boolean, reflect: true, attribute: 'show-suggestion' })
  showSuggestion = false;

  @property({ type: Number, reflect: true }) threshold = 3;

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: Boolean, attribute: 'display-raw-value' }) displayRawValue =
    false;

  @property({ type: Boolean }) hoist = false;

  @property({ type: String }) value = '';

  @property() size: `${COMPACT_SIZE}` = COMPACT_SIZE.lg;
  
  @property({ type: Boolean }) clearable = false;

  @query('sl-dropdown')
  dropdown: SlDropdown;
  @query('sc-text-input')
  textInput: ScTextInput;

  @watch('value')
  handleValueChange() {
    let selectedValue;
    
    this.options.some(option => {
      let optionMeta;
      const value = option.getAttribute('value') as string;
      if (this.isValidJSON(value)) {
        optionMeta = JSON.parse(value);
      } else {
        optionMeta = { value };
      }
      if (optionMeta.value === this.value) {
        selectedValue = optionMeta;
      }
    });

    if (selectedValue) {
      this.displayValue = this.getDisplayText(selectedValue as any);
    } else {
      this.displayValue = this.value;
    }
  }

  
  protected readonly hasSlotController = new HasSlotController(
      this,
      'form-control',
  );

  connectedCallback() {
    super.connectedCallback();
    if (this.showSuggestion) {
      this.updateStyle();
    }
  }

  isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  handleInput(event: CustomEvent) {
    const { value } = event.detail;
    this.emit('sc-input', {
      detail: {
        value,
      },
    });
    if (this.showSuggestion && value.length >= this.threshold) {
      this.loading = true;
      this.updateComplete.then(() => {
        this.updateStyle();
      });
      this.requestUpdate();
    }

    this.hasFocus = true;
    this.value = value;
    this.displayValue = value;
  }

  handleSlAfterHide() {
    this.hasFocus = false;
  }

  handleKeydown(event: KeyboardEvent) {
    event.stopPropagation();
    if (event.code === 'Enter') {
      this.displayValue = this.value;
      this.emit('sc-search', {
        detail: {
          value: this.value,
        },
      });
    }
  }

  public updateSuggestion(suggestions: SuggestionOption[]) {
    this.options.forEach(option => {
      option.remove();
    });
    suggestions.forEach((suggestion: SuggestionOption) => {
      const dropdownOption = document.createElement('sc-dropdown-option');
      dropdownOption.setAttribute('value', JSON.stringify(suggestion));
      dropdownOption.classList.add('dropdown-item-option');
      this.appendChild(dropdownOption);

      if (typeof suggestion.text === 'function') {
        render(suggestion.text(), dropdownOption);
      } else {
        render(
          html`<div class="item-text">
            ${suggestion.text ?? suggestion.value}
          </div>`,
          dropdownOption
        );
      }
    });
    this.loading = false;
    this.requestUpdate();
  }

  get visibleOptions() {
    return this.options.filter(option => option.style.display !== 'none');
  }

  get hasResults() {
    return this.visibleOptions.length > 0;
  }

  get shouldDisplayLoadingText() {
    return this.loading;
  }

  get shouldDisplayEmptyText() {
    return !this.shouldDisplayLoadingText && !this.hasResults && this.emptyText;
  }

  getDisplayText(selectedValue: SuggestionOption) {
    const { value, displayValue = null, text = null } = selectedValue;
    if (this.displayRawValue) {
      return value;
    }
    if (displayValue) {
      return displayValue;
    }
    if (text && typeof text !== 'function') {
      return text;
    }
    return value;
  }

  get shouldDisplaySuggestion() {
    return (
      this.hasFocus &&
      this.value.length >= this.threshold &&
      (this.hasResults ||
        this.shouldDisplayLoadingText ||
        this.shouldDisplayEmptyText)
    );
  }

  handleMenuItemSelect(e: CustomEvent) {
    const selectedValue = e.detail?.item?.value;
    const parsedValue = JSON.parse(selectedValue);
    const isValidJson = this.isValidJSON(selectedValue); // We set the value as JSON string in `updateSuggestions`
    this.displayValue = this.getDisplayText(parsedValue);
    this.value =
      isValidJson && parsedValue?.value
        ? parsedValue?.value
        : selectedValue.value;
    this.emit('sc-search', {
      detail: {
        value: this.value,
      },
    });
  }

  onSearch() {
    this.emit('sc-search', {
      detail: {
        value: this.value,
      },
    });
  }

  onClear() {
    this.emit('sc-clear');
  }
  
  getCurrentIconSize() {
    switch (this.size) {
      case 'sm':
        return 'xxs';
      case 'lg':
        return 'md';
      case 'md':
      default:
        return 'sm';
    }
  }

  renderDisabledStyle() {
    const style = html`
      <style>
        .sc-search-field.disabled sc-text-input::part(input) {
          border: 1px solid var(--sc-search-field-disabled-input-border-color, var(--sc-color-grey-150));
          background: var(--sc-search-field-disabled-input-background-color, var(--sc-color-grey-150));
          color: var(--sc-search-field-disabled-input-text-color, var(--sc-color-grey-400));
          cursor: not-allowed;
        }

        .sc-search-field.disabled .arrow-icon {
          color: var(
            --sc-search-field-disabled-input-suffix-color,
            var(--sc-color-grey-50)
          );
          cursor: default;
        }

        .sc-search-field.disabled sc-text-input::part(input):placeholder {
          color: var(
            --sc-search-field-disabled-input-placeholder-color,
            var(--sc-color-grey-50)
          );
        }
      </style>
    `;

    return html`${style}`;
  }

  render() {
    const { shouldDisplayLoadingText } = this;
    return html`
      ${this.renderDisabledStyle()}
      <div class=${classMap({
        'sc-search-field': true,
        disabled: this.disabled,
        'sc-truncate': this.truncate,
        [`sc-search-field-${this.size}`]: Boolean(this.size),
      })}>
        <sl-dropdown
          style='width: 100%'
          ?open=${this.shouldDisplaySuggestion}
          @sl-after-hide=${this.handleSlAfterHide}
          ?hoist=${this.hoist}
          @sl-hide=${this.stopDefaultEvent}
          @sl-show=${this.stopDefaultEvent}
        >
          <div slot='trigger'>
            <sc-text-input
              @keydown=${this.handleKeydown}
              @sc-input=${this.handleInput}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?max-rows=${this.maxRows} 
              readonly-rows=${this.readonlyRows} 
              ?clearable=${this.clearable}
              .placeholder=${
                this.placeholder
                  ? this.placeholder
                  : msg('Type to search', {
                      id: 'sc-search-field-type-to-search',
                    })
              }
              .value=${this.displayValue}
              .size=${this.size}
              ?error=${this.error}
              .errorMessage=${this.errorMessage}
              @sc-clear=${this.onClear}
            >
              <sc-icon
                slot="suffix"
                name="search"
                size=${this.getCurrentIconSize()}
                @click=${this.onSearch}
              ></sc-icon>
              ${this.hasSlotController.test('form-control') ? html`<div slot="form-control">
                <slot name="form-control"></slot>
              </div>` : null}
              <div slot="error">
                <slot name="error">${this.errorMessage}</slot>
              </div>
            </sc-text-input>
          </div>
          ${
            this.showSuggestion && this.value.length >= this.threshold
              ? html`<sl-menu @sl-select=${this.handleMenuItemSelect}>
                  <div
                    aria-hidden=${shouldDisplayLoadingText ? 'true' : 'false'}
                    style="${styleMap({
                      display: shouldDisplayLoadingText ? 'none' : 'block',
                    })}"
                  >
                    ${repeat(
                      this.options,
                      el => el.getAttribute('value'),
                      el => {
                        const value = el.getAttribute('value');
                        return html`
                          <sl-menu-item
                            style="display: ${el.style.display}"
                            value=${value}
                            data-id=${value}
                            class="dropdown-item"
                          >
                            ${html`${el}`}
                          </sl-menu-item>
                        `;
                      }
                    )}
                  </div>
                  <div
                    part="loading-text"
                    id="loading-text"
                    class="loading-text"
                    aria-hidden=${shouldDisplayLoadingText ? 'false' : 'true'}
                    style="${styleMap({
                      display: shouldDisplayLoadingText ? 'block' : 'none',
                    })}"
                  >
                    <sc-spinner size="md" />
                  </div>
                  <div
                    part="empty-text"
                    id="empty-text"
                    class="empty-text"
                    aria-hidden=${this.shouldDisplayEmptyText
                      ? 'false'
                      : 'true'}
                    style="${styleMap({
                      display: this.shouldDisplayEmptyText ? 'block' : 'none',
                    })}"
                  >
                    <slot name="empty-text"
                      >${this.emptyText
                        ? this.emptyText
                        : msg('No suggestions', {
                            id: 'sc-search-field-no-suggestion',
                          })}</slot
                    >
                  </div>
                  <div
                    aria-hidden="true"
                    style=${styleMap({ width: `${this.clientWidth}px` })}
                  ></div>
                </sl-menu>`
              : ''
          }
        </sl-dropdown>
        ${this.renderDefaultSlot()}
      </div>
    `;
  }
}
