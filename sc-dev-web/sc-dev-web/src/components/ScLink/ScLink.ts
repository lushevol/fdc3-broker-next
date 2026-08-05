import { html } from 'lit';
import { property } from 'lit/decorators.js';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import { LINK_TARGET } from '../../shared/util.js';

export class ScLink extends ScElement {
  static styles = ScTheme.getStyles();

  @property() href?: string;

  @property({ type: Boolean }) block = false;

  @property({ type: Boolean }) inverse = false;

  @property({ type: Boolean, reflect: true }) disabled = false;
  
  @property() target: `${LINK_TARGET}` = LINK_TARGET._self;

  @property({ type: Boolean }) truncate = false;

  @property({ type: Boolean, attribute: 'prevent-default-link' }) preventDefaultLink = false;

  renderLinkStyle() {
    const linkStyle = html`
      <style>
        .sc-link {
          font-weight: var(--sc-link-font-weight, 600);
          text-decoration: none;
          display: flex;
          cursor: pointer;
          font-size: 0.875rem;

          .sc-truncate & {
            display: unset;
          }
        }
      </style>
    `;
    const primaryStyle = html`
      <style>
        .sc-link {
          color: var(--sc-link-content-color, var(--sc-link-primary-color, var(--sc-color-blue-500)));
        }
        .sc-link:hover {
          color: var(--sc-link-hover-color, var(--sc-color-blue-400));
        }
      </style>
    `;
    const inlineStyle = html`
      <style>
        .sc-link-wrapper {
          display: var(--sc-link-display, inline-flex);

          &.sc-truncate {
            display: inline;
          }
        }
        .sc-link {
          padding: 0;
          margin: 0;
        }
      </style>
    `;
    const blockStyle = html`
      <style>
        .sc-link {
          margin: 5px 0;
          padding: 10px 0;
        }
        .sc-link-wrapper.sc-truncate {
          display: block;
          .sc-link {
            
            display: block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin: 0.3125rem 0;
            padding: 0.625rem 0;
          }
        }
      </style>
    `;
    const inverseStyle = html`
      <style>
        .sc-link {
          color: var(--sc-link-inverse-color, var(--sc-color-white));
        }
      </style>
    `;
    const disabledStyle = html`
      <style>
        .sc-link {
          opacity: 0.5;
          cursor: not-allowed;
        }
      </style>
    `;

    return html`
      ${linkStyle} ${!this.inverse ? primaryStyle : ''}
      ${!this.block ? inlineStyle : blockStyle}
      ${this.inverse ? inverseStyle : ''} ${this.disabled ? disabledStyle : ''}
    `;
  }

  private handleClick = (event: MouseEvent): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    } else {
      event.preventDefault();
      this.emit('sc-action', {
        detail: {
          target: event.target,
        },
        bubbles: true,
        cancelable: false,
        composed: true,
      });
      if (this.href && !this.preventDefaultLink) {
        window.open(this.href, this.target);
      }
    }
  };

  render() {
    return html` ${this.renderLinkStyle()}
      <div class="sc-link-wrapper ${this.truncate ? 'sc-truncate' : ''}">
        ${this.href ? html`
          <a
            title=${this.title}
            class="sc-link"
            target=${this.target}
            href=${this.href}
            @click=${this.handleClick}
          >
            <slot></slot>
          </a>
        ` : html`
          ${this.href ? html`
          <a
            title=${this.title}
            class="sc-link"
            target=${this.target}
            href=${this.href}
            @click=${this.handleClick}
          >
            <slot></slot>
          </a>
        ` : html`
          <a
              title=${this.title}
              class="sc-link"
              target=${this.target}
              href=${this.href}
            @click=${this.handleClick}
            >
              <slot>Navigation Link</slot>
            </a>
        `}
        `}
      </div>`;
  }
}
