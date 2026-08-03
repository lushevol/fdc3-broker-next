import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import LinkCardStyle from './ScLinkCard.style.js';
import { ScCardBase } from './ScCardBase.js';
import { msg } from '../../i18n/localization.js';
export class ScLinkCard extends ScCardBase {
  static styles = [LinkCardStyle];
    @property({ type: String, attribute: 'href' }) href = '';
    @property({ type: String, attribute: 'target' }) linkTarget = '_self';
    @property({ type: String, attribute: 'link-text' }) linkText = '';
    @property({ type: String, attribute: 'link-icon-name' }) linkIconName = 'link-alt';
    
    
    firstUpdated() {
      if (!this.actions) {
        this._actions = this.renderDefaultActions();
      }
    }
    renderDefaultActions() {
      if (this.overrideDefaultAction) return [];
      const _actionArr = [
        html`
            <div
              @click=${this.handleCardClick}
            >
             ${msg('View Link', { id: 'sc-view-link' })}
            </div>
          `,
      ];
      return _actionArr;
    }
    
    imageTemplate() {
      return this.imageSource ? html`
            <img
                slot="image"
                class='card-image ${this.direction}' 
                src=${this.imageSource}
            />
        ` : '';
    }

    linkTemplate() {
      return this.href ? html`
        <sc-link href=${this.href} target=${this.linkTarget}
        @click=${this.stopDefaultEvent}
        >
          <div class="card-link-container" 
          >
            <sc-icon name=${this.linkIconName}></sc-icon>
            <span class="link-text">${this.linkText || this.href}</span>
          </div>
        </sc-link>
      ` : html`<slot></slot>`;
    }

    iconTemplate() {
      return this.icon ? html`
        <div class="card-icon-container" slot="prefix">
          <sc-icon
            type="text"
            name=${this.icon}
            size=${this.iconSize}
          ></sc-icon> 
        </div>
      ` :
        html`<slot slot="prefix" name='prefix'></slot>`;
    }

    bodyTemplate() {
      return this.body ? html`
        <span class="card-body-container" slot="body">
          ${this.body}
        </span>
      ` :
        html`<slot slot="body" name='body'></slot>`;
    }

    prefixTemplate() {
      return html`<slot slot="prefix" name='prefix'></slot>`;
    }

    slotTemplate() {
      return html`
            <slot slot="header" name='header'></slot>   
            <slot slot="title" name='title'></slot>
            <slot slot="sub-title" name='sub-title'></slot>
            <slot slot="footer" name='footer'></slot>
            <slot slot="prefix" name='prefix'></slot>
            <slot slot="suffix" name='suffix'></slot>
        `;
    }

    handleCardClick = () => {
      if (this.href) {
        const regex = /^https?:\/\//;
        if (this.linkTarget === '_blank') {
          window.open(this.href, this.linkTarget);
        } else if (regex.test(this.href)) {
          window.open(this.href, '_self');
        } else {
          this._navigation?.go(this.href);
        }
      }
    };

    render() {
      return html`
              <div class='sc-link-card' 
                style='
                  width: ${this.width}; 
                  height: ${this.height};
                  ${
  this.icon ? '--sc-card-icon-container-margin-right: 1rem;' :
    '--sc-card-icon-container-margin-right: 0;'
}
                  ${this.direction === 'vertical' ? `
                    --sc-card-prefix-margin-top: 0rem;
                    --sc-card-top-container-margin-bottom: 0rem;
                  ` : ''}
                '
                @click=${this.handleCardClick}
              >
                  <sc-card
                      part='card'
                      title=${this.title}
                      title-size=${this.titleSize}
                      body-size=${this.bodySize}
                      space-size=${this.spaceSize}
                      text-align=${this.textAlign}
                      vertical-align=${this.verticalAlign}     
                      ?hover-highlight=${this.hoverHighlight}   
                      ?disabled=${this.disabled}  
                      ?clickable=${this.clickable}
                      width=${this.width}
                      height=${this.height}
                      direction=${this.direction}
                      .tagsGroup=${this.tagsGroup}
                      @sc-action=${this.handleAction}              
                  >
                      ${this.imageTemplate()}
                      ${this.linkTemplate()}
                      ${this.iconTemplate()}
                      ${this.bodyTemplate()}
                      ${this.prefixTemplate()}
                      ${!this.noActions ? this.cardActionTemplate() : nothing}
                      ${this.slotTemplate()}
                  </sc-card>
              </div>
          `;
    }
}