import { html } from 'lit';
import { property } from 'lit/decorators.js';
import ScTheme from '../../styles/ScTheme.js';
import ScScrollToTopStyle from './ScScrollToTop.style.js';
import ScElement from '../../shared/sc-element.js';
import '../../../elements/sc-badge.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-icon-button.js';

export class ScScrollToTop extends ScElement {
  static styles = ScTheme.getStyles().concat([ScScrollToTopStyle]);

  @property({ attribute: 'scroll-duration', type: Number }) scrollDuration = 400;

  @property({ attribute: 'help-text' }) helpText = 'Go to top';

  @property({ attribute: 'ref-element-id' }) refEleId: string;

  @property({ attribute: 'scroll-threshold', type: Number }) scrollThreshold = 400;

  private scrolledElement: HTMLElement | null;

  private scrollListener() {
    const yScroll = this.refEleId
      ? document.getElementById(this.refEleId)?.scrollTop
      : window.scrollY;
    const button = this.shadowRoot?.querySelector('sc-icon-button');

    if (yScroll !== undefined && yScroll > this.scrollThreshold) {
      button?.classList.remove('hide');
    } else {
      button?.classList.add('hide');
    }
  }

  private handleClick = () => {
    if (this.refEleId) {
      const scrolledElement = document.getElementById(this.refEleId);

      if (scrolledElement) {
        scrolledElement.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    } else {
      const cosParameter: number = window.scrollY / 2;
      let scrollCount = 0;
      let oldTimestamp: number = performance.now();

      const step = (newTimestamp: number) => {
        scrollCount +=
          Math.PI / (this.scrollDuration / (newTimestamp - oldTimestamp));
        if (scrollCount >= Math.PI) {
          window.scrollTo(0, 0);
        }
        if (window.scrollY === 0) {
          return;
        }
        window.scrollTo(
          0,
          Math.round(cosParameter + cosParameter * Math.cos(scrollCount))
        );
        oldTimestamp = newTimestamp;

        window.requestAnimationFrame(step);
      };
      if (this.scrolledElement) {
        this.scrolledElement.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      } else {
        window.requestAnimationFrame(step);
      }
    }
  };

  firstUpdated() {
    requestAnimationFrame(() => {
      const button = this.shadowRoot?.querySelector('sc-icon-button');
      button?.classList.add('hide');

      if (!this.refEleId) {
        window.addEventListener('scroll', () => this.scrollListener());
      } else {
        const scrolledElement = document.getElementById(this.refEleId);
        if (scrolledElement) {
          scrolledElement.onscroll = () => {
            this.scrollListener();
          };

          scrolledElement.addEventListener('scroll', this.scrollListener);
        }
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (!this.refEleId) {
      window.removeEventListener('scroll', this.scrollListener);
    } else {
      const scrolledElement = document.getElementById(this.refEleId);
      if (scrolledElement) {
        scrolledElement.removeEventListener('scroll', this.scrollListener);
      }
    }
  }

  render() {
    return html`
      <Host>
        <sc-icon-button
          @click=${this.handleClick}
          title=${this.helpText}
          type="default"
          size="md"
          name="arrow-ios-upward"
          fill=""
        >
        </sc-icon-button>
      </Host>
    `;
  }
}
