import { html, LitElement } from 'lit';
import SlCarouselItem from '@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.component.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import ScTheme from '../../styles/ScTheme.js';

export class ScCarouselItem extends ScopedElementsMixin(LitElement) {
  static styles = ScTheme.getStyles();

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'group');
  }

  static get scopedElements() {
    return {
      'sl-carousel-item': SlCarouselItem,
    };
  }

  render() {
    return html`<sl-carousel-item> <slot></slot> </sl-carousel-item>`;
  }
}
