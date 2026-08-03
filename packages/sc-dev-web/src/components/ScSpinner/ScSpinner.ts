import { html } from 'lit';
import { property } from 'lit/decorators.js';
import SlSpinner from '@shoelace-style/shoelace/dist/components/spinner/spinner.component.js';
import '@shoelace-style/localize';
import ScTheme from '../../styles/ScTheme.js';
import { IconBase } from '../ScIcon/IconBase.js';
import { classMap } from 'lit/directives/class-map.js';

enum SPINNER_TYPE {
  page = 'page',
  component = 'component',
}

enum COLOR {
  blue = 'blue',
  white = 'white',
  deepBlue = 'deepBlue',
}

export class ScSpinner extends IconBase {
  static styles = ScTheme.getStyles();

  static get scopedElements() {
    return {
      'sl-spinner': SlSpinner,
    };
  }

  @property() type: `${SPINNER_TYPE}` = SPINNER_TYPE.component;

  @property() color: `${COLOR}` = COLOR.blue;

  @property({ type: String }) message = '';

  getPageTypeStyle() {
    let width;
    let height;
    switch (this.size) {
      case 'sm':
        width = '1.75rem';
        height = '1.75rem';
        break;
      case 'md':
        width = '2.5rem';
        height = '2.5rem';
        break;
      case 'lg':
        width = '3rem';
        height = '3rem';
        break;
      default:
        width = '1.75rem';
        height = '1.75rem';
        break;
    }
    this.style.setProperty('--spinner-page-type-width', `${width}`);
    this.style.setProperty('--spinner-page-type-height', `${height}`);
  }
  renderSpinnerStyle() {
    const baseStyle = html`
      <style>
        .spinner-container {
          font-size: ${this.getIconSize()};
          --track-width: 1px;
          --track-color: ${this.color === 'white' ? html`var(--sc-spinner-track-white-color, var(--sc-color-white))`
        : this.color === 'blue' ? html`var(--sc-spinner-track-blue-color, var(--sc-color-blue-500))`
        : html`var(--sc-spinner-track-deep-blue-color, var(--sc-color-blue-650))`};
          --indicator-color: ${this.color === 'white' ? html`var(--sc-spinner-indicator-white-color, var(--sc-color-white))`
        : this.color === 'blue' ? html`var(--sc-spinner-indicator-blue-color, var(--sc-color-blue-500))`
        : html`var(--sc-spinner-track-deep-blue-color, var(--sc-color-blue-650))`};
          --speed: 1.1s;
          display: inline-flex;
          width: 1em;
          height: 1em;
          flex: none;
          vertical-align: middle;
          align-items: center;
        }

        .no-message {
          display: flex;
          margin: 0 auto;
        }

        .spinner {
          flex: 1 1 auto;
          height: 100%;
          width: 100%;
        }

        .spinner__track,
        .spinner__indicator {
          fill: none;
          stroke-width: var(--track-width);
          r: calc(0.5em - var(--track-width) / 2);
          cx: 0.5em;
          cy: 0.5em;
          transform-origin: 50% 50%;
        }

        .spinner__track {
          stroke: var(--track-color);
          transform-origin: 0% 0%;
          stroke-opacity: 0.3;
        }

        .spinner__indicator {
          stroke: var(--indicator-color);
          stroke-linecap: round;
          stroke-dasharray: 75% 300%;
          animation: spin var(--speed) linear infinite;
        }

        .message {
          font-size: 0.875rem;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      </style>
    `;
    return html` ${baseStyle} `;
  }

  renderPageSpinnerStyle() {
    this.getPageTypeStyle();
    const baseStyle = html`
      <style>
        @keyframes rotate-clockwise {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(90deg);
          }
          50% {
            transform: rotate(180deg);
          }
          75% {
            transform: rotate(270deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes spinner-rotate {
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes spinner-dash {
          0% {
            stroke-dasharray: 1, 100;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 30, 100;
            stroke-dashoffset: -0.9375rem;
          }
          100% {
            stroke-dashoffset: -3.0625rem;
          }
        }
        .sc-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          width: 100%;
          height: 100%;
        }
        .spinner-page {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15%;
          animation: spinner-rotate 1.1s infinite;
          width: var(--spinner-page-type-width, 6.75rem);
          height: var(--spinner-page-type-width, 6.75rem);
        }
        .spinner-page-dot {
          display: flex;
          align-items: center;
        }
      </style>
    `;
    return html` ${baseStyle} `;
  }

  renderMessage() {
    return this.message
      ? html`<slot name="message">${this.message}</slot>`
      : null;
  }

  render() {
    return this.type === 'page'
      ? html`
          ${this.renderPageSpinnerStyle()}
          <div class='sc-spinner'>
            <div
              class='spinner-page'
            >
              <div class='spinner-page-dot'>
                <svg
                  width='100%'
                  height='100%'
                  viewBox='0 0 42 29'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M0.00256904 14.5004C-0.0708173 10.6476 1.43072 6.92987 4.16391 4.19719C6.89709
                   1.46451 10.6283 -0.0495126 14.5044 0.00123588C18.0484 0.110735 21.4844 1.23958
                   24.3961 3.25099L42 14.5004L24.3961 25.7498C21.4845 27.7613 18.0485 28.8903
                   14.5044 29C6.45705 29 0.254011 22.5833 0.00256904 14.5004Z'
                    fill='var(--sc-spinner-indicator-color, var(--sc-color-blue-500))'
                  />
                </svg>
              </div>
              <div class='spinner-page-dot'>
                <svg
                  width='100%'
                  height='100%'
                  viewBox='0 0 42 29'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M17.6039 25.7498L0 14.5004L17.6039 3.25099C20.5155 1.23958 23.9516
                  0.110734 27.4956 0.00123628C31.3717 -0.0495205 35.1029 1.4645 37.8361
                  4.19718C40.5693 6.92986 42.0708 10.6476 41.9974 14.5004C41.746 22.5834
                  35.543 29 27.4956 29C23.9515 28.8903 20.5155 27.7613 17.6039 25.7498Z'
                    fill='var(--sc-spinner-indicator-alt-color, var(--sc-color-green-500))'
                  />
                </svg>
              </div>
            </div>
          </div>
          ${this.renderMessage()}
        `
      : html`
          ${this.renderSpinnerStyle()}
          <div class=class=${classMap({
            'spinner-container': true,
            'no-message': !this.message,
          })}>
            <svg part="base" class="spinner" role="progressbar" aria-label='loading'>
              <circle class="spinner__track"></circle>
              <circle class="spinner__indicator"></circle>
            </svg>
          </div>
          ${this.renderMessage()}
        `;
  }
}
