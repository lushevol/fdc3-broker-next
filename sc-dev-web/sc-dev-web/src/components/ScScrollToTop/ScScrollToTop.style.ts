import { css } from 'lit';

export default css`
  :host {
    transition: opacity 0.4s ease 0s, z-index 0s ease 0.4s;
    position: absolute;
    bottom: 32px;
    right: 32px;
    opacity: 1;
    z-index: 99999;
  }

  :host(.show) {
    transition: opacity 0.4s ease 0s, z-index 0s ease 0s;
    opacity: 1;
    z-index: 99999;
  }

  sc-icon-button {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    outline: none;
    border-width: 0;
    transition: var(--default-transition);
    z-index: 99999;
  }

  sc-icon {
    color: var(--sc-color-white);
  }

  sc-icon-button.show {
    display: block;
  }

  sc-icon-button:hover {
    cursor: pointer;
  }

  .hide {
    display: none;
  }

  .scrollableDiv {
    height: 300px;
    overflow-y: scroll;
  }
`;
