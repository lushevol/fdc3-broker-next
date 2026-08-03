import { html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { ScCard } from './ScCard.js';
import ScTheme from '../../styles/ScTheme.js';
import '../../../elements/sc-card.js';
import '../../../elements/sc-checkbox.js';
import '../../../elements/sc-grid.js';

export enum IMAGE_POSITION {
    left = 'left',
    right = 'right',
    background = 'background',
  }

export class ScImageCard extends ScCard {
  static imageStyle = css`
    .sc-image-card {
        --sc-card-icon-container-margin-right: 0;
    }

    .card-image-grid-container {
        padding: 0px;
        overflow: hidden;
    }

    .card-image-grid-row {
        margin: 0;
    }
    
    .card-image {
        height: 100%;
        width: 100%;
        object-fit: contain;
    }
  `;
  static styles = [...ScTheme.getStyles(), this.imageStyle];

    @property({ attribute: 'image-position' }) layout: `${IMAGE_POSITION}` = IMAGE_POSITION.left;

    @property({ type: String, attribute: 'background-color' }) backgroundColor = '';

    @property({ type: String, attribute: 'background-position' }) backgroundPosition = '';

    @property({ type: String, attribute: 'background-repeat' }) backgroundRepeat = '';

    @property({ type: String, attribute: 'background-size' }) backgroundSize = '';

    @property({ type: String, attribute: 'src' }) imageSource = '';

    handleAction(event: CustomEvent): void {
        this.emit('sc-action', {
            detail: {
                target: event.detail.target,
                type: event.detail.type,
            },
        });
    }

    imageTemplate() {
        return this.imageSource && this.layout !== 'background'  ? html`
            <img
                slot="image"
                class='card-image ${this.direction}' 
                src=${this.imageSource}
            />
        ` : '';
    }

    slotTemplate() {
        const hasPrefix = this.hasSlotController.test('prefix');
        return html`
        ${  hasPrefix 
            ? html`<slot slot="prefix" name='prefix'></slot>`
            : ''
        }
            <slot slot="header" name='header'></slot>   
            <slot slot="title" name='title'></slot>
            <slot slot="sub-title" name='sub-title'></slot>
            <slot slot="body" name='body'></slot>
            <slot slot="footer" name='footer'></slot>
            <slot></slot>
            <slot slot="suffix" name='suffix'></slot>
        `;
    }

    render() {
      return html`
            <div class='sc-image-card' 
                style='
                    width: ${this.width}; 
                    height: ${this.height};
                '
          >
                <sc-card
                    part='card'
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
                    direction=${this.direction}
                    ?hover-highlight=${this.hoverHighlight}
                    ?no-border=${this.noBorder}
                    ?selected=${this.selected}
                    image-position=${this.layout}
                    ?disabled=${this.disabled}
                    icon=${this.icon}
                    icon-size=${this.iconSize}
                    icon-align=${this.iconAlign}
                    icon-vertical-align=${this.iconVerticalAlign}
                    ?clickable=${this.clickable}
                    button-text-left=${this.buttonTextLeft}
                    button-text-primary=${this.buttonTextPrimary}
                    button-text-secondary=${this.buttonTextSecondary}
                    ?button-truncate=${this.buttonTruncate}
                    .tagsGroup=${this.tagsGroup}
                    .supplementaryDetails=${this.supplementaryDetails}
                    style='${this.layout === 'background' && this.imageSource
                        ? `--sc-card-background:url(${this.imageSource}) 
                        ${this.backgroundColor} 
                        ${this.backgroundPosition} 
                        ${this.backgroundPosition && this.backgroundSize ? '/' : ''} 
                        ${this.backgroundSize} 
                        ${this.backgroundRepeat};
                    ` : ''}'      
                    @sc-action=${this.handleAction}              
                >
                    ${this.imageTemplate()}
                    ${this.slotTemplate()}
                </sc-card>
            </div>
        `;
    }
}
