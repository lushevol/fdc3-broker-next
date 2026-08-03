import { css } from 'lit';

export default css`
  :host {
    display: contents;
    margin: 0;
  }

  [hidden] {
    display: none !important;
  }

  .alert {
    display: flex;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.6;
    margin: inherit;
    border-radius: var(--sc-radius-md, 8px);
    align-items: stretch;
    flex-wrap: row nowrap;
    justify-content: space-between;
    position: fixed;
    z-index: 800;
    opacity: 0;
    pointer-events: none;
    transition: margin-top .25s ease-in-out, margin-bottom .25s ease-in-out;
    will-change: margin-top, margin-bottom, opacity, top, bottom, left, right;
  }

  .alert[data-state="open"],
  .alert[data-state="hiding"] {
    pointer-events: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    .alert {
      transition: none;
    }
  }

  /* ── Show animations ── */
  .alert.top[data-state="open"] {
    animation: sc-alert-top-show 250ms ease forwards;
  }
  .alert.bottom[data-state="open"] {
    animation: sc-alert-bottom-show 250ms ease forwards;
  }
  .alert.top-left[data-state="open"],
  .alert.bottom-left[data-state="open"] {
    animation: sc-alert-left-show 250ms ease forwards;
  }
  .alert.top-right[data-state="open"],
  .alert.bottom-right[data-state="open"] {
    animation: sc-alert-right-show 250ms ease forwards;
  }

  /* ── Hide animations ── */
  .alert.top[data-state="hiding"] {
    animation: sc-alert-top-hide 250ms ease forwards;
  }
  .alert.bottom[data-state="hiding"] {
    animation: sc-alert-bottom-hide 250ms ease forwards;
  }
  .alert.top-left[data-state="hiding"],
  .alert.top-right[data-state="hiding"],
  .alert.bottom-left[data-state="hiding"],
  .alert.bottom-right[data-state="hiding"] {
    animation: sc-alert-lr-hide 250ms ease forwards;
  }

  /* ── Keyframes ── */
  @keyframes sc-alert-top-show {
    from { top: var(--sc-top-offset, 0px); opacity: 0; }
    to   { top: calc(var(--sc-top-offset, 0px) + 32px); opacity: 1; }
  }
  @keyframes sc-alert-top-hide {
    from { top: calc(var(--sc-top-offset, 0px) + 32px); opacity: 1; }
    to   { top: var(--sc-top-offset, 0px); opacity: 0; }
  }
  @keyframes sc-alert-bottom-show {
    from { bottom: var(--sc-bottom-offset, 0px); opacity: 0; }
    to   { bottom: calc(var(--sc-bottom-offset, 0px) + 32px); opacity: 1; }
  }
  @keyframes sc-alert-bottom-hide {
    from { bottom: calc(var(--sc-bottom-offset, 0px) + 32px); opacity: 1; }
    to   { bottom: var(--sc-bottom-offset, 0px); opacity: 0; }
  }
  @keyframes sc-alert-left-show {
    from { left: var(--sc-left-offset, 0px); opacity: 1; }
    to   { left: calc(var(--sc-left-offset, 0px) + 20px); opacity: 1; }
  }
  @keyframes sc-alert-right-show {
    from { right: var(--sc-right-offset, 0px); opacity: 1; }
    to   { right: calc(var(--sc-right-offset, 0px) + 20px); opacity: 1; }
  }
  @keyframes sc-alert-lr-hide {
    from { opacity: 1; scale: 1; }
    to   { opacity: 0; scale: 0.7; }
  }

  /* Honour reduced-motion: keep animationend firing but use near-zero duration */
  @media (prefers-reduced-motion: reduce) {
    .alert[data-state="open"],
    .alert[data-state="hiding"] {
      animation-duration: 0.001ms;
    }
  }
  
  .alert.top-left { 
    top: calc(var(--sc-top-offset, 0px) + 32px);
    left: calc(var(--sc-left-offset, 0px) + 20px);
  }
  
  .alert.top {
    top: calc(var(--sc-top-offset, 0px) + 32px);
    /* workaround for browser bug that sometimes retains old bottom value when placement is changed */
    bottom: auto !important;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    -webkit-transform: translate3d(-50%, 0, 0);
    -moz-transform: translate3d(-50%, 0, 0);
    -ms-transform: translate3d(-50%, 0, 0);
  }
  
  .alert.top-right {
    top: calc(var(--sc-top-offset, 0px) + 32px);
    right: calc(var(--sc-left-offset, 0px) + 20px);
  }
  
  .alert.bottom-left {
    bottom: calc(var(--sc-bottom-offset, 0px) + 32px);
    left: calc(var(--sc-left-offset, 0px) + 20px);
  }
  
  .alert.bottom {
    /* workaround for browser bug that sometimes retains old top value when placement is changed */
    top: auto !important;
    bottom: calc(var(--sc-bottom-offset, 0px) + 32px);
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    -webkit-transform: translate3d(-50%, 0, 0);
    -moz-transform: translate3d(-50%, 0, 0);
    -ms-transform: translate3d(-50%, 0, 0);
  }
  
  .alert.bottom-right {
    bottom: calc(var(--sc-bottom-offset, 0px) + 32px);
    right: calc(var(--sc-right-offset, 0px) + 20px);
  }
  
  .alert-message {
    flex: 1 1 auto;
    align-self: center;
    display: block;
    overflow: hidden;
    line-height: 1.5rem;
  }
  
  .alert-icon, .close-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }
  
  .close-icon {
    cursor: pointer;
  }
`;
