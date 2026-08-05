import { css } from 'lit';

export default css`

  .sc-file-button {
    display: inline-block;
  }

  .sc-file-button-container {
    box-sizing: border-box;
    margin: 0px;
    vertical-align: baseline;
    appearance: none;
    cursor: pointer;
    text-align: start;
    inline-size: 100%;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5rem;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    justify-content: flex-start;
    align-self: stretch;
  }

  .sc-file-button-wrapper-disabled .sc-file-button-container {
    cursor: not-allowed;
  }

  .sc-file-button-container *, .sc-file-button-container ::before, .sc-file-button-container ::after {
    box-sizing: inherit;
  }

  .sc-file-button-container .file-input {
    position: absolute;
    overflow: hidden;
    padding: 0px;
    border: 0px;
    margin: -1px;
    block-size: 1px;
    clip: rect(0px, 0px, 0px, 0px);
    inline-size: 1px;
    visibility: inherit;
    white-space: nowrap;
    opacity: 0;
  }

  .sc-file-button-accept {
    color: var(--sc-file-button-accept-text-color, var(--sc-color-grey-400));
    text-align: center;
    font-family: var(--sc-font-family);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 157.143%;
  }
`;