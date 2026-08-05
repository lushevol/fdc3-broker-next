import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import ScElement from '../../shared/sc-element.js';
import { TEXT_SIZE, FontSizeMapping, SIZE, SizeMapping } from '../../shared/util.js';
import ScTheme from '../../styles/ScTheme.js';
import ScBannerStyle from './ScBanner.style.js';
import { property, state } from 'lit/decorators.js';
import '../../../elements/sc-icon-button.js';
import { mediaQuery } from '../../shared/mediaQuery.js';

enum BACKGROUNDS {
  'prosper-blue' = 'prosper-blue',
  'alt-blue' = 'alt-blue',
  'light-blue' = 'light-blue',
  'light-grey' = 'light-grey',
  'white' = 'white',
}

const BACKGROUNDS_COLOR = {
  'prosper-blue': 'var(--sc-banner-prosper-blue-background-color, var(--sc-color-prosper-blue))',
  'alt-blue': 'var(--sc-banner-alt-blue-background-color, var(--sc-color-blue-650))',
  'light-blue': 'var(--sc-banner-light-blue-background-color, var(--sc-color-blue-100))',
  'light-grey': 'var(--sc-banner-light-grey-background-color, var(--sc-color-grey-100))',
  white: 'var(--sc-banner-white-background-color, var(--sc-color-white))',
} as const;

type BackgroundColorKey = keyof typeof BACKGROUNDS_COLOR;

export class ScBanner extends ScElement {
  static styles = ScTheme.getStyles().concat([ScBannerStyle]);

  @property({ attribute: 'title-size' }) titleSize: `${TEXT_SIZE}` = TEXT_SIZE.xl;

  @property({ attribute: 'body-size' }) bodySize: `${TEXT_SIZE}` = TEXT_SIZE.sm;

  @property({ attribute: 'space-size' }) spaceSize: `${SIZE}` = SIZE.md;

  @property({ attribute: 'text-alignment' }) textAlignment: 'left' | 'center' | 'right' | 'justify' = 'left';

  @property({ type: String, attribute: 'image-src' }) imageSrc = '';

  @property({ type: String, attribute: 'image-position' }) imagePosition: 'left' | 'right' | 'background' = 'right';

  @property({ type: Boolean }) trustpoint = false;

  @property({ type: String }) title = '';

  @property({ type: Boolean, attribute: 'title-full-width' }) titleFullWidth = false;

  @property({ type: String }) body = '';

  @property({ type: Boolean, attribute: 'closable' }) closable = false;

  @property({ type: String, attribute: 'border-radius' }) borderRadius: 'none' | 'sm' = 'sm';

  @property({ type: String, attribute: 'background-position' }) backgroundPosition = '';

  @property({ type: String, attribute: 'background-repeat' }) backgroundRepeat = '';

  @property({ type: String, attribute: 'background-size' }) backgroundSize = '';

  // This property is not supposed to expose in the storybook and is to determine if the banner should be displayed with
  // no border. When set to true, the banner will not have a border and will take up the full width of its container.
  @property({ type: Boolean, attribute: 'no-border' }) noBorder = false;

  @state() show = true;

  @mediaQuery(['mobileSm', 'mobileLg', 'tablet', 'desktop', 'portrait'], { waitAfterUpdate: true })
  renderOnMobile() {
      this.requestUpdate();
  }

  private _backgroundColor: BACKGROUNDS = BACKGROUNDS['prosper-blue'];

  @property({ type: String, attribute: 'background-color' })
  get backgroundColor() {
    return this._backgroundColor;
  }
  set backgroundColor(val: string) {
    if (
      val === BACKGROUNDS['prosper-blue'] ||
      val === BACKGROUNDS['alt-blue'] ||
      val === BACKGROUNDS['light-blue'] ||
      val === BACKGROUNDS['light-grey'] ||
      val === BACKGROUNDS['white']
    ) {
      this._backgroundColor = val as BACKGROUNDS;
    } else {
      this._backgroundColor = BACKGROUNDS['prosper-blue'];
    }
    this.requestUpdate('backgroundColor');
  }

  get isMobileOrTabletPortrait() {
    return this.isMobile || (this.isTablet && this.isPortrait);
  }

  hasTrustPoint() {
    const sizes = ['sm'];
    return this.trustpoint && sizes.includes(this.titleSize);
  }

  getTrustPointMargin() {
    const spaceSizes = ['xxs', 'xs', 'sm'];
    return spaceSizes.includes(this.spaceSize) ? '14px' : '0px';
  }

  closeBanner() {
    this.show = false;
  }

  render() {
    if (!this.show) {
      return null;
    }
    const titleSize = FontSizeMapping[this.titleSize];
    const bodySize = FontSizeMapping[this.bodySize];
    const padding = SizeMapping[this.spaceSize];
    const margin = this.getTrustPointMargin();
    return html`
    <div 
      class=${classMap({
    'sc-banner': true,
    trustpoint: this.hasTrustPoint(),
    'no-border': this.noBorder,
    'title-full-width': this.titleFullWidth,
    [this.backgroundColor]: true,
    'mobile-view': this.isMobileOrTabletPortrait,
    'tablet-view': this.isTablet,
    'is-background': this.imagePosition === 'background',
  })}   
    style='
      border-radius: ${this.borderRadius === 'none' ? 0 : 0.375}rem;   
      ${this.imagePosition === 'background' && this.imageSrc
          ? `--sc-banner-background:url(${this.imageSrc}) 
            ${BACKGROUNDS_COLOR[this.backgroundColor as BackgroundColorKey]} 
            ${this.backgroundPosition} 
            ${this.backgroundPosition && this.backgroundSize ? '/' : ''} 
            ${this.backgroundSize} 
            ${this.backgroundRepeat};` 
          : ''};'  
    >
      ${this.closable ? html`
        <sc-icon-button 
          class="sc-banner-close-button"
          type="default" 
          size="xxs" 
          name="cross" 
          no-pill
          @click=${this.closeBanner}
          >
        </sc-icon-button>
      ` : null}
      <div class='basic'>
        ${this.imageSrc && this.imagePosition === 'left' ? html`
          <img class='banner-img left-img' src=${this.imageSrc} alt='' />
          ` : null}
        <div class='banner-info ${this.textAlignment}'
        style='padding: ${padding}rem;'>
          <div 
            class='banner-title-wrapper'
            style="--sc-banner-title-font-size: ${titleSize}; --sc-banner-trustpoint-margin: ${margin}"
          >
          <div
            class='banner-title'
          >
            ${this.title
    ? html`
              ${this.title}
          ` : html`
            <slot
              name='title'
              part='title'
              class='banner-title-slot'
            ></slot>
          `
}
          </div>
          </div>
          ${this.body
    ? html`
            <div
              class='banner-body'
              style="--sc-banner-body-font-size: ${bodySize}"
            >
              ${this.body}
            </div>
          ` : html`
            <slot
              name='body'
              part='body'
              class='banner-body-slot'
              style="--sc-banner-body-font-size: ${bodySize}"
            ></slot>
          `
}
        </div>
        ${this.imageSrc && this.imagePosition === 'right' ? html`
          <img class='banner-img right-img' src=${this.imageSrc} alt='' />
          ` : null}
      </div>
      <slot name='additional-body'>

      </slot>
    </div>
    `;
  }
}