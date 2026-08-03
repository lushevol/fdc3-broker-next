import { html, nothing } from 'lit';
import { ScCardBase } from './ScCardBase.js';
import ContentCardStyle from './ScContentCard.style.js';
import { property } from 'lit/decorators.js';
import { openNewWindow } from '../../shared/open-window.js';
import { msg } from '../../i18n/localization.js';
import { CARD_SUPPLEMENTARY_ATTRIBUTES } from '../../shared/util.js';

export class ScContentCard extends ScCardBase {
  static styles = [ContentCardStyle];
    
    @property({ type: String, attribute: 'href' }) href = '';
    @property({ type: Array, attribute: 'supplementary-details' }) supplementaryDetails: CARD_SUPPLEMENTARY_ATTRIBUTES[] = [];
    firstUpdated() {
      if (!this.actions) {
        this._actions = this.renderDefaultActions();
      }
    }

    openSplitView(link: string) {
      if (!link || !this._shellClient) return;
      this._shellClient?.openInSplitView(link);
    }

    openViewLink(link: any) {
      if (!link) return;
      openNewWindow(link);
    }

    renderDefaultActions() {
      if (this.overrideDefaultAction) return [];
      const _actionArr = [
        html`
            <div @click=${()=>{ this.openViewLink(this.href); }}>
             ${msg('Open view link', { id: 'sc-view-link' })}
            </div>
          `,
      ];
      if (this._shellClient) {
        _actionArr.push(html`
            <div
            @click=${() => {
    this.openSplitView(this.href);
  }}
            >
                ${msg('Open split view', { id: 'sc-open-split-view' })}
            </div>
          `);
      }
      return _actionArr;
    }

    supplementaryDetailsTemplate() {
      return this.supplementaryDetails.length ? html`
      ${
  this.supplementaryDetails.length > 0
    ? html`
              <div class="supplementary-container">
                ${this.supplementaryDetails.map(
    (detail, index) => html`
                    <div class="supplementary-detail">
                      <sc-icon
                        name="${detail.iconName}"
                        size="sm"
                      ></sc-icon>
                      ${detail.details}
                      ${index < this.supplementaryDetails.length - 1
    ? html`<span class="separator"> • </span>`
    : ''}
                    </div>
                  `
  )}
              </div>
            `
    : ''
}
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

    render() {
      return html`
        <div class='sc-content-card' 
        style='
            width: ${this.width}; 
            height: ${this.height};
            --sc-card-top-container-margin-bottom: 0rem;
            ${
  this.icon ? '--sc-card-icon-container-margin-right: 1rem;' :
    '--sc-card-icon-container-margin-right: 0;'
}
        '
        >
            <sc-card
                part='card'
                title=${this.title}
                sub-title=${this.subTitle}
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
                ${this.supplementaryDetailsTemplate()}
                ${this.iconTemplate()}
                ${this.bodyTemplate()}
                ${this.prefixTemplate()}
                ${!this.noActions ? this.cardActionTemplate() : nothing}
                ${this.slotTemplate()}
            </sc-card>
        </div>`;
    }
}