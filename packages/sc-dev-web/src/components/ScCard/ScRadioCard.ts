import { html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ScCard } from './ScCard.js';
import ScTheme from '../../styles/ScTheme.js';
import '../../../elements/sc-card.js';
import '../../../elements/sc-radio.js';
import { LAYOUT_POSITION } from './util.js';

export class ScRadioCard extends ScCard {
  static radioStyle = css`
    .non-background-color sc-card::part(base) {
      background: var(--sc-card-background-color, var(--sc-color-white));
    }
    .card-radio-wrap {
      position: relative;
      margin-top: 0.5rem;
    }
    .radio-cover {
      position: absolute;
      top: 0;
      width: 20px;
      height: 20px;
      z-index: 2;
      cursor: pointer;
    }
  `;

  static styles = [...ScTheme.getStyles(), this.radioStyle];

  @property({ attribute: 'radio-position' }) layout: `${LAYOUT_POSITION}` = 'left';

  @property({ type: Boolean }) checked = false;

  @state() isHovering = false;

  get _isShowCardBackgroundColor() {
    return this.disabled || this.checked && !this.isHovering;
  }

  onRadioCardClick = (event: MouseEvent) => {
    event.preventDefault();

    if (this.disabled) {
      return;
    }

    // event.stopPropagation();
    if (this.clickable) {
      this.emit('sc-action', {
        detail: {
          checked: this.checked,
        },
      });
    }
    else {
      this.checked = !this.checked;
      this.emit('sc-change', {
        detail: {
          checked: this.checked,
        },
      });
    }
  };

  handleAction(event: CustomEvent): void {
    this.emit('sc-action', {
        detail: {
            target: event.detail.target,
            type: event.detail.type,
        },
    });
  }

  handleMouseEnter() {
    this.isHovering = true;
  }

  handleMouseLeave() {
    this.isHovering = false;
  }

  onRadioClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.clickable) {
      event.preventDefault();
      event.stopPropagation();
      this.checked = !this.checked;
  
      this.emit('sc-change', {
        detail: {
          checked: this.checked,
        },
      });
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mouseenter', this.handleMouseEnter);
    this.addEventListener('mouseleave', this.handleMouseLeave);
  }

  radioTemplate() {
    return html`
      <div
        class='card-radio-wrap'
        @mousedown=${this.onRadioClick}
      >
        <sc-radio
          class='sc-radio-card--radio'
          part='radio'
          .checked=${this.checked}
          .disabled=${this.disabled}
        ></sc-radio>
        <div class='radio-cover'></div>
      </div>
    `;
  }

  render() {
    return html`
      <div class=${classMap({
          'sc-radio-card': true,
          'non-background-color': !this._isShowCardBackgroundColor,
        })}
      >
        <sc-card
          part='card'
          direction=${this.direction}
          title=${this.title}
          title-size=${this.titleSize}
          sub-title=${this.subTitle}
          body=${this.body}
          body-size=${this.bodySize}
          space-size=${this.spaceSize}
          text-align=${this.textAlign}
          vertical-align=${this.verticalAlign}          
          width=${this.width}
          height=${this.height}
          ?hover-highlight=${this.hoverHighlight}
          ?disabled=${this.disabled}
          ?clickable=${true}
          ?no-border=${this.noBorder}
          ?selected=${this.checked}
          layout=${this.layout}
          icon=${this.icon}
          icon-size=${this.iconSize}
          icon-align=${this.iconAlign}
          icon-vertical-align=${this.iconVerticalAlign}
          .tagsGroup=${this.tagsGroup}
          .supplementaryDetails=${this.supplementaryDetails}
          @mousedown=${this.onRadioCardClick}
          @sc-action=${this.handleAction}  
          style='--sc-card-prefix-margin-top: 0.5rem'
        >
          ${this.layout === 'left' 
    ?  html`
        <div slot='prefix' class='radio'>
          ${this.radioTemplate()}
        </div>
      `
    : html`
      <slot slot="prefix" name='prefix'></slot>
    `
}          
    <slot slot="header" name='header'></slot>   
    <slot slot="title" name='title'></slot>
    <slot slot="sub-title" name='sub-title'></slot>
    <slot slot="body" name='body'></slot>
    <slot slot="footer" name='footer'></slot>           
    <slot></slot>
    ${this.layout === 'right' 
    ? html`
        <div slot='suffix'>
          ${this.radioTemplate()}
        </div>
      `
    : html`<slot slot="suffix" name='suffix'></slot>`
}         
      </sc-card>
    </div>
  `;
  }
}
