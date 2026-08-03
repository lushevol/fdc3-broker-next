import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import ScTheme from '../../styles/ScTheme.js';
import { watch } from '../../shared/watch.js';
import { ScToggleOption } from './ScToggleOption.js';
import ScToggleStyle from './ScToggle.style.js';
import { FormInputBase } from '../ScFormInput/FormInputBase.js';
import { TEXT_SIZE } from '../../shared/util.js';

/**
 * @dependency sc-toggle-option
 *
 * @slot - Used for grouping toggle options. Must be `<sc-toggle-option>` elements.
 *
 * @event {{ name: String }} select - Emitted when a option is selected.
 *
 * @csspart base - The component's base wrapper.
 * @csspart body - The container that wraps the options.
 *
 */
export class ScToggle extends FormInputBase {
  static styles = ScTheme.getStyles().concat([ScToggleStyle]);

  private options: ScToggleOption[] = [];

  private selectedOption: ScToggleOption;

  @property() size: `${TEXT_SIZE}` = TEXT_SIZE.xs;

  @property({ attribute: 'label-size' }) labelSize: `${TEXT_SIZE}` = TEXT_SIZE.md;

  @watch('size')
  handleSizeChange() {
    this.options.forEach(el => el.size = this.size);
  }

  @watch('value', { waitUntilFirstUpdate: true })
  handleValueChange() {
    const newOption = this.querySelector(`sc-toggle-option[value="${this.value}"]`);
    if (newOption) {
      this.setSelectedOption(newOption as ScToggleOption);
      this.setBgCoverStyle();
    }
  }

  updateSelectedOption () {
    const whenAllDefined = Promise.all([
      customElements.whenDefined('sc-toggle-option'),
    ]);
    // After the first update...
    this.syncOptions();
    // Wait for options to be registered
    whenAllDefined.then(async () => {
      // Set initial option state when the options become visible
      await this.setSelectedOption(this.getSelectedOption() ?? this.options[0], {
        emitEvents: false,
      });
      this.setBgCoverStyle();
    });
  }
  observer: IntersectionObserver;

  connectedCallback() {
    super.connectedCallback();

    this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      const toggle = entries[0];
      if (toggle.intersectionRatio > 0) {
        this.updateSelectedOption();
      }
    });
    this.observer.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer.unobserve(this);
    this.observer.disconnect();
  }

  private getAllOptions() {
    const slot = this.shadowRoot!.querySelector<HTMLSlotElement>('.sc-toggle slot')!; // eslint-disable-line

    if (!slot) return [];

    const size = this.size; 
    return [...(slot.assignedElements() as ScToggleOption[])].filter(
      el => {
        if (el.tagName.toLowerCase() === 'sc-toggle-option') {
          // sync size of options
          if (el.getAttribute('size') !== size) {
            el.setAttribute('size', size);
          }
          el.disabled = this.disabled;
          return true;
        }
        return false;
      }
    );
  }

  private getSelectedOption() {
    return this.options.find(el => el.selected || el.value === this.value);
  }

  private handleClick(event: MouseEvent) {
    if (this.disabled) return;
    const target = event.target as HTMLElement;
    const option = target.closest('sc-toggle-option') as ScToggleOption;
    const toggleGroup = option?.closest('sc-toggle');

    // Ensure the target option is in this toggle group
    if (toggleGroup !== this) {
      return;
    }

    if (option !== null) {
      this.setSelectedOption(option);
      this.setBgCoverStyle();
    }
  }

  private setBgCoverStyle() {
    const bgCover: any = this.shadowRoot?.querySelector('.background-cover');
    if (bgCover && this.selectedOption) {
      bgCover.style.width = `${this.selectedOption.clientWidth  }px`;
      bgCover.style.height = `${this.selectedOption.clientHeight  }px`;
      const { index } = this.selectedOption;
      const preOptions = this.querySelectorAll<ScToggleOption>('sc-toggle-option');

      if (preOptions) {
        let left = 0;
        Array.from(preOptions).forEach(option => {
          if (option.index && option.index < index) {
            left += option.clientWidth;
          }
        });
        bgCover.style.left = `${left + 2  }px`;
      } else {
        bgCover.style.left = 0;
      }
    }
  }

  private setSelectedOption(
    option: ScToggleOption,
    options?: {
      emitEvents?: boolean;
      scrollBehavior?: 'auto' | 'smooth';
    }
  ) {
    const config = {
      emitEvents: true,
      scrollBehavior: 'auto',
      ...options,
    };

    if (option !== this.selectedOption) {
      this.selectedOption = option;
      // Sync selected option
      this.options.forEach((el, index: number) => {
        el.selected = el === this.selectedOption;
        el.setAttribute('size', this.size);
        el.setAttribute('index', String(index));
      });

      // Emit events
      if (config.emitEvents) {
        this.emit('sc-select', {
          detail: { value: this.selectedOption.value },
        });
      }
    }
  }

  // This stores options so we can refer to a cache instead of calling querySelectorAll() multiple times.
  private syncOptions() {
    this.options = this.getAllOptions();
  }

  private _onSlotChange() {
    this.syncOptions();

    this.options.forEach(opt => {
      opt.toggleAttribute('truncate', this.truncate);
    });
  }

  @watch(['truncate', 'disabled'])
  handlePropertyChange() {
    this._onSlotChange();
  }

  // @ts-ignore
  @watch('readonly', { waitUntilFirstUpdate: true })
  handleReadonlyChange() {
    if (!this.readonly) {
      this.updateSelectedOption();
    }
  }

  renderFormControl() {
    if (this.readonly) {
      let text: string = this.value;
      const options = this.querySelectorAll<ScToggleOption>('sc-toggle-option');
      if (options) {
        const activeOption = Array.from(options).find(c => c.value == this.value); // eslint-disable-line
        if (activeOption) {
          text = activeOption.innerText;
        }
      }
      return html`
        <div class=sc-form-control>${text}</div>
      `;
    }
    return html`
      <div part='base' class=${classMap({
    'sc-toggle': true,
    disabled: this.disabled,
    'sc-truncate': this.truncate,
  })} 
        @click=${this.handleClick}
      >
        <div class='background-cover'></div>
        <div class='slot-container'>
          <slot part='body' @slotchange=${this._onSlotChange}></slot>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      ${this.renderBaseFormInput(false)}
    `;
  }
}
