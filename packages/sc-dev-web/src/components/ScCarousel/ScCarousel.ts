import { html, LitElement, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import SlCarousel from '@shoelace-style/shoelace/dist/components/carousel/carousel.component.js';
import SlCarouselItem from '@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.component.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import ScTheme from '../../styles/ScTheme.js';
import ScCarouselStyle from './ScCarousel.style.js';
import { ScIcon } from '../ScIcon/ScIcon.js';

export class ScCarousel extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
  }

  get items() {
    const slots = this.querySelectorAll('sc-carousel-item') as any;
    return slots || [];
  }

  @property({ type: Boolean }) pagination = false;

  @property({ type: Boolean }) navigation = false;

  @property({ attribute: 'scroll-hint' }) scrollHint = '10%';

  @property({ attribute: 'aspect-ratio' }) aspectRatio = '16/9';

  @property({ attribute: 'orientation' }) orientation = 'horizontal';

  @property({ type: Boolean }) autoplay = false;

  @property({ type: Boolean }) loop = false;

  @property({ type: Number, attribute: 'autoplay-interval' }) autoplayInterval = 3000;

  static styles = ScTheme.getStyles().concat([ScCarouselStyle]);

  static get scopedElements() {
    return {
      'sl-carousel': SlCarousel,
      'sl-carousel-item': SlCarouselItem,
      'sc-icon': ScIcon,
    };
  }

  render() {
    return html`
      <sl-carousel
        .navigation=${this.navigation}
        .pagination=${this.pagination}
        .autoplay=${this.autoplay}
        .loop=${this.loop}
        .autoplayInterval=${this.autoplayInterval}
        class='sc-carousel ${this.orientation}'
        orientation=${this.orientation}
        .style='
          ${this.scrollHint !== '0'
    ? `--scroll-hint: ${this.scrollHint};`
    : ''}; 
          --aspect-ratio: ${this.aspectRatio}'
      >
        <sc-icon slot="previous-icon" name="arrow-ios-backward"></sc-icon>
        <sc-icon slot="next-icon" name="arrow-ios-forward"></sc-icon>
        ${Array.from(this.items).map((tab: any) => {
    return html`
            ${html` <sl-carousel-item class='sc-carousel-item'>
              ${html`${Array.from(tab.children).map(
    child => html` ${child} `
  )}`}
            </sl-carousel-item>`}
          `;
  })}
      </sl-carousel>
    `;
  }
}
