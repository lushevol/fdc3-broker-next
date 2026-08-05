import { css } from 'lit';
export default css`
  :host {
    pointer-events: none;
    display: none;
  }
  :host([active]) {
    display: block;
    width: var(--sc-scale-width, 100%);
    height: var(--sc-scale-height, 100%);
    position: absolute;
    top: 0;
    left: var(--sc-scale-left, 0);
    z-index: 100;
    overflow: hidden;
    transform-origin: 0 0;
  }
  :host([active-tool]) {
    pointer-events: auto;
  }
  :host([rotate='90']) {
    transform: rotate(90deg) translateY(-100%);
  }
  :host([rotate='180']) {
    transform: rotate(180deg) translateX(-100%) translateY(-100%);
  }
  :host([rotate='270']) {
    transform: rotate(270deg) translateX(-100%);
  }

  .scriber-root {
    width: 100%;
    height: 100%;
  }
  .canvas-wrap {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: center center;
    width: 100%;
    height: 100%;
    background-color: transparent;

    svg {
      width: 100%;
      height: 100%;
    }
    &.drawing * {
      pointer-events: none;
    }
  }
  .canvas-wrap.eraser {
    cursor: none;
  }
  div.eraser:not(.canvas-wrap) {
    display: none;
    position: absolute;
    pointer-events: none;
    border-radius: 50%;
    background-color: rgba(255, 0, 0, 0.3);
    box-sizing: border-box;
    z-index: 99;
    transform: translate(-50%, -50%);
  }
  .text-maker {
    padding: 4px;
    display: none;
    position: absolute;
    z-index: 99;
    transform: translate(-50%, -50%);
    --sc-form-group-help-margin-top: 0;
  }
  .text-maker sc-icon {
    display: none;
    cursor: pointer;
    margin-left: 4px;
  }
  .text-maker .movement {
    display: none;
    width: 16px;
    height: 100%;
    cursor: pointer;
    margin-right: 4px;
  }
  .text-maker-active .movement {
    height: 1rem;
    display: block;
  }
  .text-maker-active sc-icon {
    display: inline-flex;
  }
  .text-maker-active .movement sc-icon {
    cursor: move;
  }

  .text-maker-active {
    border: 2px dashed #000;
  }
  .text-maker-box {
    user-select: none;
    display: flex;
    align-items: center;
  }
`;
