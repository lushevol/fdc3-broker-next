import { html } from 'lit';
import { property } from 'lit/decorators.js';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import { ICON_SIZE } from '../ScIcon/IconBase.js';
import ScFileIconNames from './ScFileIconNames.js';
import '../../../elements/sc-icon.js';

export class ScFileIcon extends ScElement {

  static styles = ScTheme.getStyles();

  @property() name = '';

  @property() ext = '';

  @property() size: `${ICON_SIZE}` = ICON_SIZE.xl;

  get iconInfo() {
    let data;
    if (this.ext && this.ext.toLowerCase() in ScFileIconNames) {
      // @ts-ignore
      data = ScFileIconNames[this.ext.toLowerCase()];
    } else if (
      this.name &&
      this.name.lastIndexOf('.') > -1 &&
      this.name.lastIndexOf('.') < this.name.length - 1
    ) {
      const fileExt = this.name
        .substring(this.name.lastIndexOf('.') + 1)
        .toLowerCase();
      if (fileExt in ScFileIconNames) {
        // @ts-ignore
        data = ScFileIconNames[fileExt];
      }
    }
    return data && data.name ? data : { name: 'file--line' };
  }

  render() {
    const { name, color } = this.iconInfo;
    return html`
      <span 
        class='sc-file-icon'
        style='color: ${color ? color : 'var(--sc-file-icon-color, var(--sc-color-blue-900))'};'
      >
        <sc-icon 
          name=${name}
          size=${this.size}
        ></sc-icon>
      </span>
    `;
  }
}