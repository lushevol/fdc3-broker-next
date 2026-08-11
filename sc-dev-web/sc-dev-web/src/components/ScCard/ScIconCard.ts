import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { ScCard } from './ScCard.js';
import ScTheme from '../../styles/ScTheme.js';
import '../../../elements/sc-card.js';
import '../../../elements/sc-icon.js';
import { MODE, TEXT_ALIGN } from '../../shared/util.js';
import { classMap } from 'lit/directives/class-map.js';

interface SizeMappingProps {
  [key: string]: SizeProps;
}

interface SizeProps {
  width: string;
}

const CardSizeMapping: SizeMappingProps = {
  full: {
    width: '100%',
  },
  half: {
    width: '50%',
  },
  'one-third': {
    width: '33%',
  },
  'one-fourth': {
    width: '25%',
  },
};

export class ScIconCard extends ScCard {
  static styles = ScTheme.getStyles();

  @property() mode: `${MODE}` = 'default';

  @property() src = '';

  @property({ attribute: 'image-align' }) 
  imageAlign: `${TEXT_ALIGN}` = TEXT_ALIGN.left;

  @property({ attribute: 'text-align' }) 
  textAlign: `${TEXT_ALIGN}` = TEXT_ALIGN.left;

  @property() 
  layout: 'title-in' | 'title-out' | 'content-cover' | '' = 'title-in';
  
  @property()
  size: 'full' | 'half' | 'one-third' | 'one-fourth'  | 'custom' = 'full';

  @property() width = '100%';

  renderCardStyle() {
    const cardStyle = html`
      <style>
        .sc-icon-card {
          --sc-card-header-display: contents; 
          --sc-card-prefix-margin-right: 0;
        }
        .icon-content {
          flex-direction: column;
        }
        .card-image {
          display: flex;
          flex-grow: 1;
          flex-direction: column;
          width: fit-content;
          max-width: 100%;
          align-self: center;
          margin-bottom: var(--sc-card-image-margin-bottom, 0rem);
        } 
        .sc-card:not(.title-out) .card-image {
          margin-bottom: var(--sc-card-image-margin-bottom, 1rem);
        }
        .title-out {
          margin-top: var(--sc-card-title-out-margin-top, 1rem);
        }        
        .image-left .card-image {
          align-self: flex-start;
        }
        .image-center .card-image {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        .image-right .card-image {
          align-self: flex-end;
        }
        .fixed-image-size {
          width: 1.5rem;
          height: 1.5rem;
        }
      </style>
    `;
    return html`
      ${cardStyle}
    `;
  }

  getCardSize () {
    const width = this.size === 'custom' ? this.width : CardSizeMapping[this.size]?.width;
    return { width };
  }

  handleAction(event: CustomEvent): void {
      this.emit('sc-action', {
          detail: {
              target: event.detail.target,
              type: event.detail.type,
          },
      });
  }

  render() {
    const { width } = this.getCardSize();

    return html`
      ${this.renderCardStyle()}    
      <div class='sc-icon-card'>
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
          width=${width}
          height=${this.height}
          ?hover-highlight=${this.hoverHighlight}
          ?no-border=${this.noBorder}
          ?selected=${this.selected}
          ?selected-on-click=${this.selectedOnClick}
          ?disabled=${this.disabled}
          layout=${this.layout}
          icon=${this.icon}
          icon-size=${this.iconSize}
          icon-align=${this.iconAlign}
          icon-vertical-align=${this.iconVerticalAlign} 
          action-button=${this.actionButton}
          ?draggable=${this.draggable}
          .tagsGroup=${this.tagsGroup}
          .supplementaryDetails=${this.supplementaryDetails}
          ?clickable=${this.clickable}
          ?button-no-pill=${this.buttonNoPill}
          button-state-primary=${this.buttonStatePrimary}
          button-state-secondary=${this.buttonStateSecondary}
          button-text-primary=${this.buttonTextPrimary}
          button-text-secondary=${this.buttonTextSecondary}
          button-text-left=${this.buttonTextLeft}
          ?button-truncate=${this.buttonTruncate}
          ?expandable=${this.expandable}
          @sc-action=${this.handleAction}  
          class=${classMap({
            'text-left': this.textAlign === 'left',
            'text-center': this.textAlign === 'center',
            'text-right': this.textAlign === 'right',
            'text-justify': this.textAlign === 'justify',
            'title-out': this.layout === 'title-out',
          })}               
        >
          ${this.imageAlign === 'left' || this.imageAlign === 'justify' ? html`
            <div slot="prefix">
              <div class='card-image image-left'>
                ${this.mode === MODE.default 
                  ? html`${this.src ? html`<img src=${this.src} class="fixed-image-size" />` : html`<slot name='image'></slot>`}`
                  : ''
                }
              </div>
            </div>
          ` : ''}
          ${this.imageAlign === 'center' ? html`
            <div slot="header">
              <div class='card-image image-center'>
                ${this.mode === MODE.default 
                  ? html`${this.src ? html`<img src=${this.src} class="fixed-image-size" />` : html`<slot name='image'></slot>`}`
                  : ''
                }
              </div>
            </div>
          ` : ''}
          ${this.imageAlign === 'right' ? html`
            <div slot="suffix">
              <div class='card-image image-right'>
                ${this.mode === MODE.default 
                  ? html`${this.src ? html`<img src=${this.src} class="fixed-image-size" />` : html`<slot name='image'></slot>`}`
                  : ''
                }
              </div>
            </div>
          ` : ''}
          ${this.layout === 'title-in' ? this.renderTitleBody() : ''}
          <slot name='icon' part='icon'></slot> 
          <slot name='header' part='header' class='card-header card-header-slot'></slot> 
          <slot slot="sub-title" name="sub-title"></slot>
          <slot slot="footer" name="footer"></slot>
          <slot></slot>
        </sc-card>
        ${this.layout === 'title-out' ? html`
          <div
            style='width: ${width};'
            class=${classMap({
              'card-with-body-slot': this.hasSlotController.test('body'),
              'text-left': this.textAlign === 'left',
              'text-center': this.textAlign === 'center',
              'text-right': this.textAlign === 'right',
              'text-justify': this.textAlign === 'justify',
              'title-out': this.layout === 'title-out',
            })}
          >
            ${this.renderTitleBody()}
          </div>
        ` : ''}
      </div>
    `;
  }
}
