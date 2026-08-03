import { html } from 'lit';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import ScBoxStyle from './ScBox.style.js';
import { property } from 'lit/decorators.js';
import { SIZE, SizeMapping } from '../../shared/util.js';

enum TYPE {
  'transparent' = 'transparent',
  'info' = 'info',
  'success' = 'success',
  'warning' = 'warning',
  'error' = 'error',
  'disabled' = 'disabled',
  'default' = 'default',
}

export class ScBox extends ScElement {
  static styles = ScTheme.getStyles().concat([ScBoxStyle]);

  @property({ attribute: 'space-size' }) spaceSize: `${SIZE}` = 'sm';

  @property() radius: `${SIZE}` = 'sm';

  @property() view: 'default' | 'outline' = 'default';

  @property() type: `${TYPE}` = 'default';

  @property() height = 'auto';

  render() {
    const padding = SizeMapping[this.spaceSize];
    const radius = SizeMapping[this.radius];
    return html`
      <div class='sc-box sc-box-view-${this.view}'
        style='
          height: ${this.height === 'auto' ? this.height : `calc(${this.height} - 4px)`};
        '
      >
        <div 
          class='sc-box-content sc-box-type-${this.type}'
          style='
            padding: ${padding}rem;
            border-radius:${radius}rem;
            height: ${`calc(100% - ${padding * 2}rem)`};
          '
        >
            <slot></slot>
        </div>
      </div>
    `;
  }
}
