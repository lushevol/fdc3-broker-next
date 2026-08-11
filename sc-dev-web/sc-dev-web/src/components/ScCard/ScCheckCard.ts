import { html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ScCard } from './ScCard.js';
import ScTheme from '../../styles/ScTheme.js';
import '../../../elements/sc-card.js';
import '../../../elements/sc-checkbox.js';
import { LAYOUT_POSITION } from './util.js';

export class ScCheckCard extends ScCard {
  static checkboxStyle = css`
    :host {
      display: block;
    }
    .sc-check-card {
      height: var(--sc-check-card-height, 100%);
    }
    .non-background-color sc-card::part(base) {
      background: var(--sc-card-background-color, var(--sc-color-white));
    }
  `;
  static styles = [...ScTheme.getStyles(), this.checkboxStyle];

  @property({ attribute: 'checkbox-position' }) 
  layout: `${LAYOUT_POSITION}` = 'left';

  @property({ type: Boolean }) checked = false;

  @state() isHovering = false;

  get _isShowCardBackgroundColor() {
    return this.disabled || this.checked && !this.isHovering;
  }

  onChange = (event: CustomEvent) => {
    const checked = event.detail?.checked;
    this.checked = checked;
    this.requestUpdate();
    this.emit('sc-change', {
      detail: {
        checked,
      },
    });
  };

  onCheckCardClick = () => {
    if (this.disabled) {
      return;
    }

    if (this.clickable) {
      this.requestUpdate();
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

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mouseenter', this.handleMouseEnter);
    this.addEventListener('mouseleave', this.handleMouseLeave);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this.handleMouseEnter);
    this.removeEventListener('mouseleave', this.handleMouseLeave);
  }

  checkboxTemplate() {
    return html`
      <div class="card-checkbox-wrap">
        <sc-checkbox
          part="checkbox"
          @sc-change=${this.onChange}
          @mousedown=${this.stopDefaultEvent}
          .checked=${this.checked}
          .disabled=${this.disabled}
        >
        </sc-checkbox>
      </div>
    `;
  }

  render() {
    return html`
      <div class="sc-check-card ${!this._isShowCardBackgroundColor ? 'non-background-color' : ''}">
        <sc-card
          part="card"
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
          @mousedown=${this.onCheckCardClick}
          @sc-action=${this.handleAction}   
        >
          ${this.layout === 'left'
            ? html`
                <div slot="prefix" class="checkbox">
                  ${this.checkboxTemplate()}
                </div>
              `
            : html` <slot slot="prefix" name="prefix"></slot> `}
          <slot slot="header" name="header"></slot>
          <slot slot="title" name="title"></slot>
          <slot slot="sub-title" name="sub-title"></slot>
          <slot slot="body" name="body"></slot>
          <slot slot="footer" name="footer"></slot>
          <slot slot="card-action-button" name="card-action-button"></slot>
          <slot></slot>
          ${this.layout === 'right'
            ? html`
                <div slot="suffix" class="checkbox">
                  ${this.checkboxTemplate()}
                </div>
              `
            : html` <slot slot="suffix" name="suffix"></slot> `}
        </sc-card>
      </div>
    `;
  }
}
