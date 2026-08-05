import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import SlBadge from '@shoelace-style/shoelace/dist/components/badge/badge.component.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import ScTheme from '../../styles/ScTheme.js';
import { COLOR, BADGE_TYPE, COMPACT_SIZE } from '../../shared/util.js';

export class ScBadge extends ScopedElementsMixin(LitElement) {
  static styles = ScTheme.getStyles();

  static get scopedElements() {
    return {
      'sl-badge': SlBadge,
    };
  }

  @property() type: `${BADGE_TYPE}` = BADGE_TYPE.number;
  
  @property() color: `${COLOR}` = COLOR.blue;

  @property({ type: Number }) number?: number;

  @property() text?: string;

  @property() label?: string;

  @property({ type: Boolean, reflect: true }) outlined = false;

  @property() size: `${COMPACT_SIZE}` = COMPACT_SIZE.md;

  getBadgeSize() {
    const number = this.number ?? 0; 
    
    // Set dot hight value and text hight value according to "size" attribute.
    let dotHightValue;
    let textHightValue;
    switch (this.size) {
      case COMPACT_SIZE.sm:
        dotHightValue = '0.375rem';
        textHightValue = '1.125rem';
        break;
      case COMPACT_SIZE.md:
        dotHightValue = '0.5rem';
        textHightValue = '1.25rem';
        break;
      case COMPACT_SIZE.lg:
        dotHightValue = '0.75rem';
        textHightValue = '1.375rem';
        break;
      default:
        // make default width/height to MD's value.
        dotHightValue = '0.5rem';
        textHightValue = '1.25rem';
        break;
    }

    const height = this.type === BADGE_TYPE.text || this.type === BADGE_TYPE.dot
      ? this.label === '' || this.type === 'dot'
        ? dotHightValue 
        : textHightValue // text badge
      : this.number === null // here and down are for number badge
        ? dotHightValue 
        : textHightValue;
    const width = this.type === BADGE_TYPE.text || this.type === BADGE_TYPE.dot
      ? this.label === '' || this.type === 'dot'
        ? dotHightValue  // Set width same to height so the badge could be circle
        : 'auto'  // text badge
      : this.number === null 
        ? dotHightValue // Set width same to height so the badge could be circle
        : this.outlined && number < 10 // here and down are for number badge
          ? '1.0625rem' 
          : number < 10 
            ? '1.375rem' 
            : number < 100 
              ? '1.75rem' 
              : '2.5rem';
    return { width , height };
  }

  getFontSize() {
    let fontSize;
    switch (this.size) {
      case COMPACT_SIZE.sm:
        fontSize = '0.625rem';
        break;
      case COMPACT_SIZE.md:
        fontSize = '0.75rem';
        break;
      case COMPACT_SIZE.lg:
        fontSize = '0.875rem';
        break;
      default:
        fontSize = '0.75rem';  // default is md's value
        break;
    }
    return fontSize;
  }

  renderCustomStyle() {
    const { width, height } = this.getBadgeSize();
    const fontSize = this.getFontSize();
    const baseStyle = html`
      <style>
        .sc-badge::part(base) {
          text-align: center;
          border-radius: ${this.outlined ? '.375rem' : '6.25rem'};
          line-height: 1.375rem;
          font-size: ${fontSize};
          font-weight: 400;
          width: ${width};
          height: ${this.type === BADGE_TYPE.dot ? height : 
                            this.outlined ? '1.375rem' : height};
          padding: ${this.type === BADGE_TYPE.text && this.label !== '' ? '0 .25rem' : 0};
          border: none;
        }
      </style>
    `;

    let backgroundColor, borderColor, color;
    switch (this.color) {
      case COLOR.blue:
        if (this.outlined) {
          backgroundColor = 'var(--sc-badge-blue-outlined-background-color, var(--sc-color-white));';
          borderColor = 'var(--sc-badge-blue-outlined-border-color, var(--sc-color-blue-500))';
          color = 'var(--sc-badge-blue-outlined-text-color, var(--sc-color-blue-500));';
        }
        else {
          backgroundColor = 'var(--sc-badge-blue-fill-background-color, var(--sc-color-blue-500));';
          borderColor = 'var(--sc-badge-blue-fill-border-color, var(--sc-color-blue-500))';
          color = 'var(--sc-badge-blue-fill-text-color, var(--sc-color-white));';
        }
        break;
      case COLOR['dark-blue']:
        if (this.outlined) {
          backgroundColor = 'var(--sc-badge-dark-blue-outlined-background-color, var(--sc-color-white));';
          borderColor = 'var(--sc-badge-dark-blue-outlined-border-color, var(--sc-color-blue-650))';
          color = 'var(--sc-badge-dark-blue-outlined-text-color, var(--sc-color-blue-650));';
        }
        else {
          backgroundColor = 'var(--sc-badge-dark-blue-fill-background-color, var(--sc-color-blue-650));';
          borderColor = 'var(--sc-badge-dark-blue-fill-border-color, var(--sc-color-blue-650))';
          color = 'var(--sc-badge-dark-blue-fill-text-color, var(--sc-color-white));';
        }
        break;
      case COLOR.amber:
        if (this.outlined) {
          backgroundColor = 'var(--sc-badge-amber-outlined-background-color, var(--sc-color-white));';
          borderColor = 'var(--sc-badge-amber-outlined-border-color, var(--sc-color-amber-500))';
          color = 'var(--sc-badge-amber-outlined-text-color, var(--sc-color-amber-750));';
        }
        else {
          backgroundColor = 'var(--sc-badge-amber-fill-background-color, var(--sc-color-amber-500));';
          borderColor = 'var(--sc-badge-amber-fill-border-color, var(--sc-color-amber-500))';
          color = 'var(--sc-badge-amber-fill-text-color, var(--sc-color-blue-900));';
        }
        break;
      case COLOR.green:
        if (this.outlined) {
          backgroundColor = 'var(--sc-badge-green-outlined-background-color, var(--sc-color-white));';
          borderColor = 'var(--sc-badge-green-outlined-border-color, var(--sc-color-green-300))';
          color = 'var(--sc-badge-green-outlined-text-color, var(--sc-color-green-700));';
        }
        else {
          backgroundColor = 'var(--sc-badge-green-fill-background-color, var(--sc-color-green-700));';
          borderColor = 'var(--sc-badge-green-fill-border-color, var(--sc-color-green-700))';
          color = 'var(--sc-badge-green-fill-text-color, var(--sc-color-white));';
        }
        break;
      case COLOR.red:
        if (this.outlined) {
          backgroundColor = 'var(--sc-badge-red-outlined-background-color, var(--sc-color-white));';
          borderColor = 'var(--sc-badge-red-outlined-border-color, var(--sc-color-red-200))';
          color = 'var(--sc-badge-red-outlined-text-color, var(--sc-color-red-500));';
        }
        else {
          backgroundColor = 'var(--sc-badge-red-fill-background-color, var(--sc-color-red-500));';
          borderColor = 'var(--sc-badge-red-fill-border-color, var(--sc-color-red-500))';
          color = 'var(--sc-badge-red-fill-text-color, var(--sc-color-white));';
        }
        break;
      case COLOR.grey:
        if (this.outlined) {
          backgroundColor = 'var(--sc-badge-red-outlined-background-color, var(--sc-color-white));';
          borderColor = 'var(--sc-badge-grey-outlined-border-color, var(--sc-color-grey-650))';
          color = 'var(--sc-badge-grey-outlined-text-color, var(--sc-color-grey-650));';
        }
        else {
          backgroundColor = 'var(--sc-badge-grey-fill-background-color, var(--sc-color-grey-650));';
          borderColor = 'var(--sc-badge-grey-fill-border-color, var(--sc-color-grey-650))';
          color = 'var(--sc-badge-grey-fill-text-color, var(--sc-color-white));';
        }
        break;
      case COLOR.transparent:
        if (this.outlined) {
          backgroundColor = 'transparent';
          borderColor = 'var(--sc-badge-transparent-outlined-border-color, var(--sc-color-grey-650))';
          color = 'var(--sc-badge-transparent-outlined-text-color, var(--sc-color-grey-650));';
        }
        else {
          backgroundColor = 'var(--sc-badge-transparent-fill-background-color, var(--sc-color-grey-650));';
          borderColor = 'var(--sc-badge-transparent-fill-border-color, var(--sc-color-grey-650))';
          color = 'var(--sc-badge-transparent-fill-text-color, var(--sc-color-white));';
        }
        break;
    }
    
    const colorStyle = html`
      <style>
        .sc-badge::part(base) {
          background-color: ${backgroundColor};
          border: ${this.type === BADGE_TYPE.dot ? 'none' : `1px solid ${borderColor}`};
          color: ${color};
        }
      </style>
    `;
    return html` ${baseStyle} ${colorStyle} `;
  }

  render() {
    let content = '';
    if (this.type === BADGE_TYPE.number) {
      const { number: _number } = this;
      if (_number !== null) {
        const number = Number(_number);
        if (isNaN(number)) {
          content = '-'; 
        } else {
          const kilo = Math.floor(number / 1000);
          if (kilo === 0) {
            content = `${parseInt(number.toString())}`;
          } else if (kilo < 10) {
            content = `${kilo}K+`;
          } else {
            const kilo10 = Math.min(Math.floor(number / 10000), 9);
            content = `${kilo10}0K`;
          }
        }
      }
    } else {
      const { label } = this;
      if (label && /^[0-9]+$/.test(label)) {
        const labelNum = Number(label);
        const kilo = Math.floor(labelNum / 1000);
        if (kilo === 0) {
          content = `${parseInt(label)}`;
        } else if (kilo < 10) {
          content = `${kilo}K+`;
        } else {
          const kilo10 = Math.min(Math.floor(labelNum / 10000), 9);
          content = `${kilo10}0K`;
        }
      } else if (this.label) {
        content = this.label;
      }
    } 
    return html`
      ${this.renderCustomStyle()}
      <sl-badge class='sc-badge' pill='true'> ${content} </sl-badge>
    `;
  }
}
