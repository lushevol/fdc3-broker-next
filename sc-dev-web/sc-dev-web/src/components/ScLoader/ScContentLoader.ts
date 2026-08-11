import { html } from 'lit';
import { property } from 'lit/decorators.js';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScContentLoaderStyle from './ScContentLoader.style.js';
import { SIZE } from '../../shared/util.js';

enum LOADER_TYPE {
  'circle' = 'circle',
  'line' = 'line',
  'square' = 'square',
  'rectangle' = 'rectangle',
}

export class ScContentLoader extends ScElement {
  static styles = ScTheme.getStyles().concat([ScContentLoaderStyle]);

  @property() type: `${LOADER_TYPE}` = LOADER_TYPE.line;

  @property() radius: `${SIZE}` = SIZE.sm;

  @property({ type: String }) height = '16px';

  private get radiusSize() {
    switch (this.radius) {
      case 'lg':
        return '24px';
      case 'md':
        return '20px';
      case 'xs':
        return '8px';
      case 'xxs':
        return '4px';
      case 'none':
        return '0';      
      default:
        return '16px';
    }
  }

  getStyleValues() {
    let radius, width;
    const height = this.height ? this.height : '16px';

    switch (this.type) {
      case 'circle':
        radius = height;
        width = height;
        break;
      case 'line':
        radius = this.radiusSize;
        width = '100%';
        break;
      case 'rectangle':
        radius = '0';
        width = '100%';
        break;
      case 'square':
        radius = this.radiusSize;
        width = height;
        break;  
      default:
        radius = this.radiusSize;
        width = '100%';
        break;      
    }
    return { height, radius, width };
  }

  render() {
    const { height, radius, width } = this.getStyleValues();
    return html`
      <div 
        class='sc-content-loader'
        style='
          --sc-content-loader-height: ${height};
          --sc-content-loader-width: ${width};
          --sc-content-loader-radius: ${radius};
        '
      >
        <div class='wrapper'>
          <div class='content'></div>
        </div>
      </div>
    `;
  }
}