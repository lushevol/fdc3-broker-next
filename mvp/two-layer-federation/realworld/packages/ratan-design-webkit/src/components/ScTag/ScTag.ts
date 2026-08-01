import { html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

import SlTag from '@shoelace-style/shoelace/dist/components/tag/tag.component.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import ScTheme from '../../styles/ScTheme.js';
import '../../../elements/sc-tooltip.js';
import '../../../elements/sc-icon.js';
import { watch } from '../../shared/watch.js';
import { TAG_TYPE } from '../../shared/util.js';

enum TAG_MODE {
  default = 'default',
  filled = 'filled',
  link = 'link',
}

export class ScTag extends ScopedElementsMixin(LitElement) {
  static styles = ScTheme.getStyles();

  static get scopedElements() {
    return {
      'sl-tag': SlTag,
    };
  }

  @property() type: `${TAG_TYPE}` = TAG_TYPE.primary;

  @property() mode: `${TAG_MODE}` = TAG_MODE.default;

  @property({ type: Boolean }) disabled = false;

  @property({ attribute: 'max-width' }) maxWidth = '';

  @property({ attribute: 'icon-name' }) iconName = '';

  @state() isTruncated = false;

  textChangeObserver?: ResizeObserver;

  @watch(['maxWidth', 'iconName'])
  firstUpdated() {
    this.updateComplete.then(() => {
      this.checkTruncation();
    });
    const textElement = this.shadowRoot?.querySelector('.sc-tag-text');
    if (textElement) {
      this.textChangeObserver = new ResizeObserver(() => {
        this.checkTruncation();
      });
      this.textChangeObserver.observe(textElement);
    }
  }

  disconnectedCallback() {
    if (this.textChangeObserver) {
      const textElement = this.shadowRoot?.querySelector('.sc-tag-text');
      if (textElement) {
        this.textChangeObserver.unobserve(textElement);
      }
      this.textChangeObserver = undefined;
    }
    super.disconnectedCallback();
  }

  private async checkTruncation() { 
    this.isTruncated = this.isTextTruncatedAfterRender();
  }

  private isTextTruncatedAfterRender() {
    const textElement = this.shadowRoot?.querySelector('.sc-tag-text');
    if (!textElement) {
      return (false);
    }   
    return textElement.scrollWidth > textElement.clientWidth;
  }

  renderTagStyle() {
    const tagStyle = html`
      <style>
        sc-tooltip {
          --sc-tooltip-container-cursor: default;
        }
        .sc-tag::part(base) {
          padding: .125rem .5rem;
          height: 1.5rem;
          justify-content: center;
          align-items: center;
          border-radius: .25rem;
          line-height: 1.25rem;
          font-size: .75rem;
          font-weight: 400;
          max-width: var(--sc-tag-max-width);
        }
        .sc-tag-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sc-tag-icon {
          display: flex;
          align-items: center;
          width: .75rem;
          height: .75rem;
          padding-right: .5rem;
        }
      </style>
    `;

    let backgroundColor, borderColor, color;
    
    if (this.disabled) {
      switch (this.type) {
        case 'dark-blue':
          backgroundColor = 'var(--sc-tag-dark-blue-disabled-background-color, var(--sc-color-blue-200))';
          borderColor = 'var(--sc-tag-dark-blue-disabled-border-color, var(--sc-color-blue-200))';
          color = 'var(--sc-tag-dark-blue-disabled-text-color, var(--sc-color-white))';
          break;
        case 'green':
        case 'success':
          backgroundColor = 'var(--sc-tag-green-disabled-background-color, var(--sc-color-green-200))';
          borderColor = 'var(--sc-tag-green-disabled-border-color, var(--sc-color-green-200))';
          color = 'var(--sc-tag-green-disabled-text-color, var(--sc-color-white))';
          break;
        case 'amber':
        case 'warning':
          backgroundColor = 'var(--sc-tag-amber-disabled-background-color, var(--sc-color-amber-200))';
          borderColor = 'var(--sc-tag-amber-disabled-border-color, var(--sc-color-amber-200))';
          color = 'var(--sc-tag-amber-disabled-text-color, var(--sc-color-amber-700))';
          break;
        case 'red':
        case 'error':
          backgroundColor = 'var(--sc-tag-red-disabled-background-color, var(--sc-color-red-200))';
          borderColor = 'var(--sc-tag-red-disabled-border-color, (--sc-color-red-200))';
          color = 'var(--sc-tag-red-disabled-text-color, var(--sc-color-white))';
          break;
        case 'disabled':
        case 'grey':
          backgroundColor = 'var(--sc-tag-grey-disabled-background-color, var(--sc-color-grey-200))';
          borderColor = 'var(--sc-tag-grey-disabled-border-color, var(--sc-color-grey-200))';
          color = 'var(--sc-tag-grey-disabled-text-color, var(--sc-color-white))';
          break;
        case 'black':
          backgroundColor = 'var(--sc-tag-black-disabled-background-color, var(--sc-color-grey-400))';
          borderColor = 'var(--sc-tag-black-disabled-border-color, var(--sc-color-grey-400))';
          color = 'var(--sc-tag-black-disabled-text-color, var(--sc-color-white))';
          break;
        case 'white':
          backgroundColor = 'var(--sc-tag-white-disabled-background-color, var(--sc-color-white))';
          borderColor = 'var(--sc-tag-white-disabled-border-color, var(--sc-color-white))';
          color = 'var(--sc-tag-white-disabled-text-color, var(--sc-color-grey-450))';
          break;
        case 'transparent':
          backgroundColor = 'transparent';
          borderColor = 'var(--sc-tag-white-disabled-border-color, var(--sc-color-white))';
          color = 'var(--sc-tag-white-disabled-text-color, var(--sc-color-grey-450))';
          break;
        case 'grey-dash':
          backgroundColor = 'var(--sc-tag-grey-dash-disabled-background-color, var(--sc-color-grey-50))';
          borderColor = 'var(--sc-tag-grey-dash-disabled-border-color, var(--sc-color-grey-300))';
          color = 'var(--sc-tag-grey-dash-disabled-text-color, var(--sc-color-grey-450))';
          break;
        case 'primary':
        case 'blue':
        default:
          backgroundColor = 'var(--sc-tag-blue-disabled-background-color, var(--sc-color-blue-400))';
          borderColor = 'var(--sc-tag-blue-disabled-border-color, var(--sc-color-blue-400))';
          color = 'var(--sc-tag-blue-disabled-text-color, var(--sc-color-white))';
          break;
      }
    } else if (this.mode === 'link') {
      switch (this.type) {
        case 'dark-blue':
          backgroundColor = 'var(--sc-tag-dark-blue-link-background-color, var(--sc-color-white))';
          borderColor = 'var(--sc-tag-dark-blue-link-border-color, var(--sc-color-white))';
          color = 'var(--sc-tag-dark-blue-link-text-color, var(--sc-color-blue-500))';
          break;
        case 'red':
        case 'error':
          backgroundColor = 'var(--sc-tag-red-link-background-color, var(--sc-color-white))';
          borderColor = 'var(--sc-tag-red-link-border-color, var(--sc-color-white))';
          color = 'var(--sc-tag-red-link-text-color, var(--sc-color-red-500))';
          break;
        case 'amber':
        case 'warning':
          backgroundColor = 'var(--sc-tag-amber-link-background-color, var(--sc-color-white))';
          borderColor = 'var(--sc-tag-amber-link-border-color, var(--sc-color-white))';
          color = 'var(--sc-tag-amber-link-text-color, var(--sc-color-amber-850))';
          break;
        case 'green':
        case 'success':
          backgroundColor = 'var(--sc-tag-green-link-background-color, var(--sc-color-white))';
          borderColor = 'var(--sc-tag-green-link-border-color, var(--sc-color-white))';
          color = 'var(--sc-tag-green-link-text-color, var(--sc-color-green-700))';
          break;
        case 'disabled':
        case 'grey':
          backgroundColor = 'var(--sc-tag-grey-link-background-color, var(--sc-color-white))';
          borderColor = 'var(--sc-tag-grey-link-border-color, var(--sc-color-white))';
          color = 'var(--sc-tag-grey-link-text-color, var(--sc-color-grey-650))';
          break;
        case 'black':
          backgroundColor = 'var(--sc-tag-black-link-background-color, var(--sc-color-white))';
          borderColor = 'var(--sc-tag-black-link-border-color, var(--sc-color-white))';
          color = 'var(--sc-tag-black-link-text-color, var(--sc-color-black))';
          break;
        case 'transparent':
        case 'white':
          backgroundColor = 'var(--sc-tag-white-link-background-color, var(--sc-color-white))';
          borderColor = 'var(--sc-tag-white-link-border-color, var(--sc-color-white))';
          color = 'var(--sc-tag-white-link-text-color, var(--sc-color-blue-900))';
          break;
        case 'grey-dash':
          backgroundColor = 'var(--sc-tag-grey-dash-link-background-color, var(--sc-color-white))';
          borderColor = 'var(--sc-tag-grey-dash-link-border-color, var(--sc-color-grey-300))';
          color = 'var(--sc-tag-grey-dash-link-text-color, var(--sc-color-blue-900))';
          break;
        case 'primary':
        case 'blue':
        default:
          backgroundColor = 'var(--sc-tag-blue-link-background-color, var(--sc-color-white))';
          borderColor = 'var(--sc-tag-blue-link-border-color, var(--sc-color-white))';
          color = 'var(--sc-tag-blue-link-text-color, var(--sc-color-blue-460))';
          break;
      }
    } else if (this.mode === 'filled') {
      switch (this.type) {
        case 'dark-blue':
          backgroundColor = 'var(--sc-tag-dark-blue-fill-background-color, var(--sc-color-blue-650))';
          borderColor = 'var(--sc-tag-dark-blue-fill-border-color, var(--sc-color-blue-650))';
          color = 'var(--sc-tag-dark-blue-fill-text-color, var(--sc-color-white))';
          break;
        case 'red':
        case 'error':
          backgroundColor = 'var(--sc-tag-red-fill-background-color, var(--sc-color-red-500))';
          borderColor = 'var(--sc-tag-red-fill-border-color, var(--sc-color-red-500))';
          color = 'var(--sc-tag-red-fill-text-color, var(--sc-color-white))';
          break;
        case 'amber':
        case 'warning':
          backgroundColor = 'var(--sc-tag-amber-fill-background-color, var(--sc-color-amber-450))';
          borderColor = 'var(--sc-tag-amber-fill-border-color, var(--sc-color-amber-450))';
          color = 'var(--sc-tag-amber-fill-text-color, var(--sc-color-amber-850))';
          break;
        case 'green':
        case 'success':
          backgroundColor = 'var(--sc-tag-green-fill-background-color, var(--sc-color-green-700))';
          borderColor = 'var(--sc-tag-green-fill-border-color, var(--sc-color-green-700))';
          color = 'var(--sc-tag-green-fill-text-color, var(--sc-color-white))';
          break;
        case 'disabled':
        case 'grey':
          backgroundColor = 'var(--sc-tag-grey-fill-background-color, var(--sc-color-grey-600))';
          borderColor = 'var(--sc-tag-grey-fill-border-color, var(--sc-color-grey-600))';
          color = 'var(--sc-tag-grey-fill-text-color, var(--sc-color-white))';
          break;
        case 'black':
          backgroundColor = 'var(--sc-tag-black-fill-background-color, var(--sc-color-black))';
          borderColor = 'var(--sc-tag-black-fill-border-color, var(--sc-color-black))';
          color = 'var(--sc-tag-black-fill-text-color, var(--sc-color-white))';
          break;
        case 'white':
          backgroundColor = 'var(--sc-tag-white-fill-background-color, var(--sc-color-white))';
          borderColor = 'var(--sc-tag-white-fill-background-color, var(--sc-color-white))';
          color = 'var(--sc-tag-white-fill-text-color, var(--sc-color-black))';
          break;
        case 'transparent':
          backgroundColor = 'var(--sc-tag-white-fill-background-color, var(--sc-color-white))';
          borderColor = 'var(--sc-tag-white-fill-border-color, var(--sc-color-white))';
          color = 'var(--sc-tag-white-fill-text-color, var(--sc-color-black))';
          break;
        case 'grey-dash':
          backgroundColor = 'var(--sc-tag-grey-dash-fill-background-color, var(--sc-color-white))';
          borderColor = 'var(--sc-tag-grey-dash-fill-border-color, var(--sc-color-grey-300))';
          color = 'var(--sc-tag-grey-dash-fill-text-color, var(--sc-color-black))';
          break;
        case 'primary':
        case 'blue':
        default:
          backgroundColor = 'var(--sc-tag-blue-fill-background-color, var(--sc-color-blue-500))';
          borderColor = 'var(--sc-tag-blue-fill-border-color, var(--sc-color-blue-500))';
          color = 'var(--sc-tag-blue-fill-text-color, var(--sc-color-white))';
          break;
      }
    } else {
      switch (this.type) {
        case 'dark-blue':
          backgroundColor = 'var(--sc-tag-dark-blue-outline-background-color, var(--sc-color-blue-100))';
          borderColor = 'var(--sc-tag-dark-blue-outline-border-color, var(--sc-color-blue-light))';
          color = 'var(--sc-tag-dark-blue-outline-text-color, var(--sc-color-blue-650))';
          break;
        case 'red':
        case 'error':
          backgroundColor = 'var(--sc-tag-red-outline-background-color, var(--sc-color-red-50))';
          borderColor = 'var(--sc-tag-red-outline-border-color, var(--sc-color-red-500))';
          color = 'var(--sc-tag-red-outline-text-color, var(--sc-color-red-500))';
          break;
        case 'amber':
        case 'warning':
          backgroundColor = 'var(--sc-tag-amber-outline-background-color, var(--sc-color-amber-150))';
          borderColor = 'var(--sc-tag-amber-outline-border-color, var(--sc-color-amber-300))';
          color = 'var(--sc-tag-amber-outline-text-color, var(--sc-color-amber-750))';
          break;
        case 'green':
        case 'success':
          backgroundColor = 'var(--sc-tag-green-outline-background-color, var(--sc-color-green-50))';
          borderColor = 'var(--sc-tag-green-outline-border-color, var(--sc-color-green-light))';
          color = 'var(--sc-tag-green-outline-text-color, var(--sc-color-green-700))';
          break;
        case 'disabled':
        case 'grey':
          backgroundColor = 'var(--sc-tag-grey-outline-background-color, var(--sc-color-grey-100))';
          borderColor = 'var(--sc-tag-grey-outline-border-color, var(--sc-color-grey-300))';
          color = 'var(--sc-tag-grey-outline-text-color, var(--sc-color-grey-600))';
          break;
        case 'black':
          backgroundColor = 'var(--sc-tag-black-outline-background-color, var(--sc-color-grey-200))';
          borderColor = 'var(--sc-tag-black-outline-border-color, var(--sc-color-grey-500))';
          color = 'var(--sc-tag-black-outline-text-color, var(--sc-color-black))';
          break;
        case 'white':
          backgroundColor = 'var(--sc-tag-white-outline-background-color, var(--sc-color-grey-50))';
          borderColor = 'var(--sc-tag-white-outline-border-color, var(--sc-color-grey-300))';
          color = 'var(--sc-tag-white-outline-text-color, var(--sc-color-grey-600))';
          break;
        case 'transparent':
          backgroundColor = 'transparent';
          borderColor = 'var(--sc-tag-white-outline-border-color, var(--sc-color-grey-300))';
          color = 'var(--sc-tag-white-outline-text-color, var(--sc-color-grey-600))';
          break;
        case 'grey-dash':
          backgroundColor = 'var(--sc-tag-grey-dash-outline-background-color, var(--sc-color-grey-50))';
          borderColor = 'var(--sc-tag-grey-dash-outline-border-color, var(--sc-color-grey-300))';
          color = 'var(--sc-tag-grey-dash-outline-text-color, var(--sc-color-grey-600))';
          break;
        case 'primary':
        case 'blue':
        default:
          backgroundColor = 'var(--sc-tag-blue-outline-background-color, var(--sc-color-blue-lightest))';
          borderColor = 'var(--sc-tag-blue-outline-border-color, var(--sc-color-blue-light))';
          color = 'var(--sc-tag-blue-outline-text-color, var(--sc-color-blue-500))';
          break;
      }
    }

    const typeStyle = html`
      <style>
        .sc-tag::part(base) {
          background-color: ${backgroundColor};
          border: ${this.type === 'grey-dash' ? `1px dashed ${borderColor}` : `1px solid ${borderColor}`};
          color: ${color};
          max-width: ${!Number.isNaN(+this.maxWidth) ? `${this.maxWidth  }px` : this.maxWidth}
        }
        .sc-tag-icon {
          color: ${color};
        }
      </style>
    `;
    
    const truncatedStyle = html`
      <style>
        sc-tooltip {
          --sc-tooltip-container-cursor: inherit;
        }
      </style>
    `;
    return html` ${tagStyle}${typeStyle}${this.isTruncated ? truncatedStyle : '' }`;
  }  
 
  render() {
    const text = Array.from(this.childNodes)
      .map(node => (node.textContent || '').trim())
      .join('');   

    return html`
      <sc-tooltip trigger="hover" ?disabled="${!this.isTruncated}" mode="light" part=tooltip>
        <div slot="content">${text}</div>
        ${this.renderTagStyle()}
        <sl-tag class='sc-tag'>
        ${this.iconName ? html`
          <slot class='sc-tag-icon' name="icon">
            <sc-icon slot="icon" name='${this.iconName}' size='xs'></sc-icon>
          </slot>
        ` : ''}
          <span class='sc-tag-text'>
            <slot></slot>
          </span>
        </sl-tag>
      </sc-tooltip>
    `;
  }
}
