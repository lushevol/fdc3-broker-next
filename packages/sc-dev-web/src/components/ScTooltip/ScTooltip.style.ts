import { css } from 'lit';

export const tooltipStyle = css`
  :host {
    display: inline-flex;
    --sc-tooltip-border: none;
  }
  .sc-tooltip {
    --sl-tooltip-background-color: var(
      --sc-tooltip-background-color,
      var(--sc-color-blue-900)
    );
  }
  .sc-tooltip .container {
    display: inline-flex;
    cursor: var(--sc-tooltip-container-cursor, pointer);
  }
  .sc-tooltip::part(body) {
    line-height: 1rem;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 400;
    border: var(--sc-tooltip-border);
    border-radius: 0.38rem;
    box-shadow: var(--sc-tooltip-box-shadow, 0px 2px 4px 0px rgba(82, 83, 85, 0.1));
    padding: 0.75rem;
    max-width: var(--max-width, 296px);
    word-break: break-word;
    user-select: text;
    pointer-events: auto;
  }
  .sc-tooltip::part(base) {
    border: var(--sc-tooltip-border);
  }
  .sc-tooltip .header {
    font-size: 0.875rem;
    line-height: 1rem;
    font-weight: 600;
    margin: 0px 0px 10px 0px;
  }
`;

export const lightModeStyle = css`
  .sc-tooltip {
    --sl-tooltip-background-color: var(
      --sc-tooltip-light-background-color,
      var(--sc-color-white)
    );
  }

  .sc-tooltip::part(body) {
    pointer-events: auto;
    color: 1px solid var(--sc-tooltip-light-color, var(--sc-color-blue-900));
  }
  .sc-tooltip::part(base) {
    --sc-tooltip-border: 1px solid
      var(--sc-tooltip-light-border-color, var(--sc-color-grey-50));
  }

  .sc-tooltip::part(base__arrow) {
    z-index: 1;
  }

  .sc-tooltip[data-current-placement='top']::part(base__arrow) {
    border-right: 1px solid
      var(--sc-tooltip-light-border-color, var(--sc-color-grey-50));
    border-bottom: 1px solid
      var(--sc-tooltip-light-border-color, var(--sc-color-grey-50));
  }

  .sc-tooltip[data-current-placement='bottom']::part(base__arrow) {
    border-top: 1px solid
      var(--sc-tooltip-light-border-color, var(--sc-color-grey-50));
    border-left: 1px solid
      var(--sc-tooltip-light-border-color, var(--sc-color-grey-50));
  }

  .sc-tooltip[data-current-placement='left']::part(base__arrow) {
    border-top: 1px solid
      var(--sc-tooltip-light-border-color, var(--sc-color-grey-50));
    border-right: 1px solid
      var(--sc-tooltip-light-border-color, var(--sc-color-grey-50));
  }

  .sc-tooltip[data-current-placement='right']::part(base__arrow) {
    border-bottom: 1px solid
      var(--sc-tooltip-light-border-color, var(--sc-color-grey-50));
    border-left: 1px solid
      var(--sc-tooltip-light-border-color, var(--sc-color-grey-50));
  }
`;

export const successModeStyle = css`
  .sc-tooltip {
    --sl-tooltip-background-color: var(
      --sc-tooltip-success-background-color,
      var(--sc-color-green-700)
    );
  }
`;

export const warningModeStyle = css`
  .sc-tooltip {
    --sl-tooltip-background-color: var(
      --sc-tooltip-warning-background-color,
      var(--sc-color-amber-500)
    );
  }

  .sc-tooltip::part(body) {
    pointer-events: auto;
    color: 1px solid var(--sc-tooltip-warning-color, var(--sc-color-blue-900));
  }
`;

export const errorModeStyle = css`
  .sc-tooltip {
    --sl-tooltip-background-color: var(
      --sc-tooltip-error-background-color,
      var(--sc-color-red-500)
    );
  }
`;

export const primaryModeStyle = css`
  .sc-tooltip {
    --sl-tooltip-background-color: var(
      --sc-tooltip-primary-background-color,
      var(--sc-color-blue-500)
    );
  }
`;

export const glassyModeStyle = css`
  .sc-tooltip {
    --sc-tooltip-box-shadow: none;
    --sl-tooltip-background-color: transparent;
  }
  .glassy-tooltip-content-wrapper {
    pointer-events: auto;
    padding: var(--sc-glassy-tooltip-content-wrapper-padding,0.25rem);
    border-radius: var(--sc-glassy-tooltip-content-wrapper-border-radius,0.38rem);
    overflow-x: hidden;
    overflow-y: hidden;
    box-shadow: var(--sc-glassy-tooltip-content-wrapper-box-shadow, 0px 1px 0.25rem 0px rgba(0, 0, 0, 0.15));
  }
  
  .glassy-tooltip-content-wrapper.glassy-show {
    -webkit-animation: var(--sc-tooltip-animation-show-name) 250ms ease-in-out 0s 1 normal both;
    animation: var(--sc-tooltip-animation-show-name) 250ms ease-in-out 0s 1 normal both;
  }
  
  .glassy-tooltip-content-wrapper.glassy-hide {
    -webkit-animation: var(--sc-tooltip-animation-hide-name) 250ms ease-in-out 0s 1 normal both;
    animation: var(--sc-tooltip-animation-hide-name) 250ms ease-in-out 0s 1 normal both;
  }

  .glassy-tooltip-content-wrapper.blur {
    border: 1px solid var(--sc-glassy-tooltip-content-wrapper-border-color-blur, var(--sc-tooltip-glassy-border-color));
    background: var(--sc-glassy-tooltip-content-wrapper-background-color-blur, var(--sc-tooltip-glassy-background-color));
    backdrop-filter: blur(0.5rem);
    background-image: var(--sc-glassy-tooltip-content-wrapper-background-image-blur, var(--sc-tooltip-glassy-background-image-blur));
  }

  /**top */
  
  @-webkit-keyframes glassy-top-show {
    0% {
      height: 0px;
    }
    100% {
      height: var(--sc-tooltip-animation-height, 6.25rem);
    }
  }

  @keyframes glassy-top-show {
    0% {
      height: 0px;
    }
    100% {
      height: var(--sc-tooltip-animation-height, 6.25rem);
    }
  }
  
  @-webkit-keyframes glassy-top-hide {
    0% {
      height: var(--sc-tooltip-animation-height, 6.25rem);
    }
    100% {
      width: 0px;
    }
  }

  @keyframes glassy-top-hide {
    0% {
      height: var(--sc-tooltip-animation-height, 6.25rem);
    }
    100% {
      height: 0px;
    }
  }

  /* right  */
  @-webkit-keyframes glassy-right-show {
    0% {
      width: 0px;
    }
    100% {
      width: var(--sc-tooltip-animation-width, 6.25rem);
    }
  }

  @keyframes glassy-right-show {
    0% {
      width: 0px;
    }
    100% {
      width: var(--sc-tooltip-animation-width, 6.25rem);
    }
  }
  
  @-webkit-keyframes glassy-right-hide {
    0% {
      width: var(--sc-tooltip-animation-width, 6.25rem);
    }
    100% {
      width: 0px;
    }
  }

  @keyframes glassy-right-hide {
    0% {
      width: var(--sc-tooltip-animation-width, 6.25rem);
    }
    100% {
      width: 0px;
    }
  }

  /**bottom */
  
  @-webkit-keyframes glassy-bottom-show {
    0% {
      height: 0px;
    }
    100% {
      height: var(--sc-tooltip-animation-height, 6.25rem);
    }
  }

  @keyframes glassy-bottom-show {
    0% {
      height: 0px;
    }
    100% {
      height: var(--sc-tooltip-animation-height, 6.25rem);
    }
  }
  
  @-webkit-keyframes glassy-bottom-hide {
    0% {
      height: var(--sc-tooltip-animation-height, 6.25rem);
    }
    100% {
      width: 0px;
    }
  }

  @keyframes glassy-bottom-hide {
    0% {
      height: var(--sc-tooltip-animation-height, 6.25rem);
    }
    100% {
      height: 0px;
    }
  }

  /* left  */
  @-webkit-keyframes glassy-left-show {
    0% {
      width: 0px;
    }
    100% {
      width: var(--sc-tooltip-animation-width, 6.25rem);
    }
  }

  @keyframes glassy-left-show {
    0% {
      width: 0px;
    }
    100% {
      width: var(--sc-tooltip-animation-width, 6.25rem);
    }
  }
  
  @-webkit-keyframes glassy-left-hide {
    0% {
      width: var(--sc-tooltip-animation-width, 6.25rem);
    }
    100% {
      width: 0px;
    }
  }

  @keyframes glassy-left-hide {
    0% {
      width: var(--sc-tooltip-animation-width, 6.25rem);
    }
    100% {
      width: 0px;
    }
  }
`;
