import { html } from 'lit';
import { property } from 'lit/decorators.js';
import SlRating from '@shoelace-style/shoelace/dist/components/rating/rating.component.js';
import ScTheme from '../styles/ScTheme.js';
import { FormInputBase } from './ScFormInput/FormInputBase.js';
import { UTIL_SIZE_TYPE, OPTION_TYPE } from '../shared/util.js';
import '../../elements/sc-button-group.js';

export class ScRating extends FormInputBase {
  constructor() {
    super();
  }

  static styles = ScTheme.getStyles();

  static get scopedElements() {
    return {
      'sl-rating': SlRating,
    };
  }

  // @ts-ignore
  @property({ type: Number }) value = 0;

  @property({ type: Array }) options: OPTION_TYPE[] = [];

  @property({ type: Number }) max = 5;

  @property({ type: Boolean }) readonly = false;

  @property({ type: Boolean }) inline = false;

  @property() size: `${UTIL_SIZE_TYPE}` = UTIL_SIZE_TYPE.lg;

  @property({ attribute: 'label-size' }) labelSize: `${UTIL_SIZE_TYPE}` = UTIL_SIZE_TYPE.md;

  @property({ type: String, attribute: 'first-lower-text' }) firstLowerText = '';

  @property({ type: String, attribute: 'last-lower-text' }) lastLowerText = '';

  @property({ type: String }) mode: 'default' | 'button' = 'default';

  @property({ type: Number, state: true }) hoverValue = 0;

  @property({ type: Boolean, state: true }) isHovering = false;

  connectedCallback(): void {
    super.connectedCallback();
    if (this.mode === 'button') {
      this.firstLowerText = this.firstLowerText || 'Least likely';
      this.lastLowerText = this.lastLowerText || 'Most likely';
    }
  }
  getIconSize() {
    let space = '0px';
    let vMargin = '0px';
    switch (this.size) {
      case 'xxs':
        space = '0.5px';
        vMargin = '1.5px';
        break;
      case 'xs':
        space = '1px';
        vMargin = '1px';
        break;
      case 'sm':
        space = '1.5px';
        vMargin = '0.5px';
        break;
      case 'md':
        space = '2px';
        vMargin = '0px';
        break;
      default:
        space = '3px';
        vMargin = '-1px';
        break;
    }
    return { space, vMargin };
  }

  renderRatingStyle() {
    const { space, vMargin } = this.getIconSize();
    const controlStyle = html`
      <style>
        .sc-rating {
          display: ${this.inline ? 'inline-block' : 'block'};
          margin: ${vMargin} -${space};
        }
      </style>
    `;

    return html`${controlStyle}`;
  }

  protected firstUpdated(): void {
    const SlRating: SlRating | null = this.renderRoot.querySelector('sl-rating');
    if (SlRating) {
      SlRating.addEventListener('sl-change', () => {
        this.emit('sc-change', {
          detail: {
            value: SlRating.value,
          },
        });
      });
    }
  }
  protected getSymbol(value: number, _this: any): string {
    let iconSize = 0;
    switch (_this.size) {
      case 'xxs':
        iconSize = 16;
        break;
      case 'xs':
        iconSize = 20;
        break;
      case 'sm':
        iconSize = 24;
        break;
      case 'md':
        iconSize = 32;
        break;
      default:
        iconSize = 40;
        break;
    }
    const childThis = _this.shadowRoot.querySelector('sl-rating');
    const compareValue =
      !childThis.readonly && childThis.isHovering && !this.disabled
        ? childThis.hoverValue
        : childThis.value;
    const fillStar = `<svg width='${iconSize}' height='${iconSize}' viewBox='0 0 24 25' 
        fill='none' xmlns='http://www.w3.org/2000/svg'>
     <g clip-path='url(#clip0_293_6570_${value})'>
      <path d="M10.4889 1.25195C10.9646 -0.167318 13.0354 -0.167317 13.5111 1.25195L15.2104 6.32293C15.4231 6.95765 16.0331 7.38738 
      16.7214 7.38738H22.2206C23.7598 7.38738 24.3997 9.297 23.1545 10.1742L18.7056 13.3082C18.1487 13.7005 17.9157 14.3958 18.1284 
      15.0305L19.8278 20.1015C20.3034 21.5208 18.628 22.701 17.3828 21.8238L12.9339 18.6898C12.377 18.2975 11.623 18.2975 11.0661 
      18.6898L6.61718 21.8238C5.372 22.701 3.69663 21.5208 4.17225 20.1015L5.87159 15.0305C6.08429 14.3958 5.85128 13.7005 5.29442 
      13.3082L0.845477 10.1742C-0.399697 9.297 0.240238 7.38738 1.77936 7.38738H7.27855C7.96687 7.38738 8.5769 6.95765 8.7896 
      6.32293L10.4889 1.25195Z" fill='currentColor'/>
      </g>
      <defs>
      <clipPath id='clip0_293_6570_${value}'>
      <rect width='32' height='32' fill='white'/>
      </clipPath>
      </defs>
      </svg>`;
    const lineStar = `<svg width='${iconSize}' height='${iconSize}' viewBox='0 0 24 25' 
        fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g clip-path='url(#clip0_293_6572_${value})'>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.8599 2.44526C10.5335 0.372411 13.466 0.372418 14.1396 2.44526L15.8483 
      7.7034L21.3771 7.70361C23.5567 7.70369 24.4628 10.4927 22.6996 11.7739L18.2268 15.0238L19.9351 20.282C20.6086 22.3549 18.2361 
      24.0786 16.4728 22.7976L11.9997 19.548L7.52672 22.7976C5.76339 24.0786 3.39094 22.3549 4.06437 20.282L5.77267 15.0238L1.29989 
      11.7738C-0.463348 10.4927 0.442854 7.70369 2.62239 7.70361L8.1512 7.7034L9.8599 2.44526ZM11.9997 3.14062L10.2911 8.39877C9.98982 
      9.32575 9.12598 9.95337 8.15129 9.9534L2.62248 9.95361L7.09526 13.2035C7.88378 13.7765 8.21374 14.792 7.91257 15.719L6.20428 
      20.9773L10.6773 17.7277C11.4659 17.1548 12.5336 17.1548 13.3222 17.7277L17.7952 20.9773L16.0869 15.719C15.7858 14.792 16.1157 
      13.7765 16.9042 13.2035L21.377 9.95361L15.8482 9.9534C14.8735 9.95337 14.0097 9.32575 13.7084 8.39877L11.9997 3.14062Z" fill='currentColor'/>
      </g>
      <defs>
      <clipPath id='clip0_293_6572_${value}'>
      <rect width='32' height='32' fill='white'/>
      </clipPath>
      </defs>
      </svg>`;
    const icon = this.readonly || this.disabled ? fillStar : value > compareValue ? lineStar : fillStar;
    // return `<!--<sc-icon compact inline name='${value > compareValue ? 'star--line' : 'star--fill'}'><sc-icon>-->`;
    return `<span class='sc-icon' style='width:auto; height:auto; display:inline; align-items:center;'>${icon}</span>`;
  }

  handleSelect(event: CustomEvent) {
    const { value } = event.detail;
    this.emit('sc-change', {
      detail: {
        value,
      },
    });
  }

  renderFormControl() {
    if (this.mode === 'default') {
      return html`
        ${this.renderDefaultMode()}
      `;
    } else if (this.mode === 'button') {
      return html`
        ${this.renderButtonMode()}
      `;
    }
  }

  renderButtonMode() {
    if (this.options?.length > 0) {
      return html`
        <style>
        .sc-rating-button-group::part(input-group) {
          display: inline-block;
        }
        </style>
        <sc-button-group
          style='--sc-button-group-container-width: fit-content;'
          size='md'
          .value=${`${this.value}`}
          single-select
          .readonly=${this.readonly}
          .disabled=${this.disabled}
          .error=${this.error}
          .truncate=${this.truncate}
          @sc-select=${this.handleSelect}
          first-lower-text=${this.firstLowerText}
          last-lower-text=${this.lastLowerText}
          class='sc-rating-button-group'
        >
        ${
this.options.map((option: OPTION_TYPE) => {
  return html`
              <sc-button-group-item value=${option.value}>${option.label}</sc-button-group-item>
            `;
})
}
        </sc-button-group>
      `;
    }
    const minWidth = this.max < 10 ? '5.625rem' : '5rem';
    const arr = [];
    for (let i = 1; i <= this.max; i++) {
      arr.push(i);
    }
    return html`
      <sc-button-group
        style='--sc-button-group-container-width: fit-content;'
        size='md'
        .value=${`${this.value }`}
        single-select
        .readonly=${this.readonly}
        .disabled=${this.disabled}
        .error=${this.error}
        .truncate=${this.truncate}
        @sc-select=${this.handleSelect}
        first-lower-text=${this.firstLowerText}
        last-lower-text=${this.lastLowerText}
        class='sc-rating-button-group'
      >
        ${
  arr.map((value: any) => {
    return html`
              <sc-button-group-item .width=${minWidth} value=${value}>${value}</sc-button-group-item>
            `;
  })
}
      </sc-button-group>
    `;
  }

  renderDefaultMode() {
    const scRating = this.shadowRoot?.querySelector('.sc-rating');
    const ratingSymbols = scRating?.shadowRoot?.querySelectorAll('.rating__symbol:not(.rating__symbol--active)');
    const displayStyle = this.readonly ? 'none' : '';
    ratingSymbols?.forEach((span: any) => {
      span.style.display = displayStyle;
    });
    const { space } = this.getIconSize();
    const value = this.value > this.max ? 0 : this.value;
    return html`
      ${this.renderRatingStyle()}
      <div class='sc-rating-default-wrapper'>
        <sl-rating
          class='sc-rating'
          .value=${this.value}
          .max=${this.max}
          .label=${this.label}
          .readonly=${this.readonly}
          .disabled=${this.disabled}
          .error=${this.error}
          .getSymbol=${(value: number) => this.getSymbol(value, this)}
          style='
            --symbol-spacing: ${space};
            --symbol-color: ${this.readonly || this.disabled ? 'var(--sc-rating-readonly-inactive-color, var(--sc-color-blue-250))' 
            : 'var(--sc-rating-inactive-color, var(--sc-color-blue-500))'};
            --symbol-color-active: ${this.readonly || this.disabled ? 'var(--sc-rating-readonly-active-color, var(--sc-color-grey-150))' 
            : 'var(--sc-rating-active-color, var(--sc-color-blue-500))'};
          '
        >
          <slot></slot>
        </sl-rating>
        ${this.firstLowerText || this.lastLowerText ? html`
          <div class='sc-rating-lower-text'>
            <span>${this.firstLowerText}</span>
            <span>${this.lastLowerText}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderStyles() {
    return html`
      <style>
        .sc-form-group-readonly .sc-form-group-input {
          margin-left:0 !important;
        }
        .sc-rating-default-wrapper {
          display: inline-block;
        }
        .sc-rating-lower-text {
          display: flex;
          justify-content: space-between;
          margin-top: .5rem;
          font-size: .625rem;
          line-height: 1.125rem;
        }
      </style>
    `;
  }

  render() {
    return html`
      ${this.renderStyles()}
      ${this.renderBaseFormInput(false)}
    `;
  }
}
