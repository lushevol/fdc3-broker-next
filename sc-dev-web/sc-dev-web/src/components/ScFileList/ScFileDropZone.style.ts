import { css } from 'lit';

export default css`

  .sc-file-drop-zone {
    display: inline-block;
    inline-size: 100%;
    max-inline-size: var(--sc-file-input-drop-zone-width, 100%);
  }
  
  .sc-file-drop-zone-wrapper {
    display: inline-block;
    color: var(--sc-file-input-drop-zone-text-color, var(--sc-color-grey-50));
    cursor: pointer;
    inline-size: 100%;
    outline: rgba(0, 0, 0, 0) solid 0.125rem;
    outline-offset: -0.125rem;
    transition: all 110ms cubic-bezier(0.2, 0, 0.38, 0.9) 0s;
  }

  .sc-file-drop-zone-wrapper-disabled {
    color: var(--sc-file-input-drop-zone-disabled-text-color, var(--sc-color-grey-50));
    cursor: not-allowed;
  }

  .sc-file-drop-zone-container {
    box-sizing: border-box;
    margin: 0px;
    vertical-align: baseline;
    appearance: none;
    background-color: var(--sc-file-input-drop-container-background-color, transparent);
    cursor: pointer;
    text-align: start;
    inline-size: 100%;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5rem;
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    border: 1.5px dashed var(--sc-file-input-drop-container-border-color, var( --sc-color-grey-150));
    border-radius: var(--sc-radius-md, 0.5rem);
    min-height: 2.625rem;
    flex-direction: column;
    gap: 0.5rem;
    align-self: stretch;
  }

  .sc-file-drop-zone-container-bg-gray {
    background-color: var(--sc-file-input-drop-container-gray-background-color, var(--sc-color-grey-50));
  }

  .sc-file-drop-zone-container:hover {
    border-color: var(--sc-file-input-drop-container-active-border-color,  var(--sc-color-blue-500));
    transition: all 0.3s ease-in-out;
  }

  .sc-file-drop-zone-container-drag-over {
    //background-color: var(--sc-file-input-drop-container-active-background-color, var(--sc-color-blue-lightest));
    border: 1.5px dashed var(--sc-file-input-drop-container-active-border-color, var(--sc-color-blue-500));
    color: var(--sc-file-input-drop-zone-active-text-color, var(--sc-color-grey-50));
  }

  .sc-file-drop-zone-wrapper-disabled .sc-file-drop-zone-container {
    background-color: var(--sc-file-input-drop-container-disabled-background-color, var(--sc-color-grey-50));
    border: 1.5px dashed var(--sc-file-input-drop-container-disabled-border-color, var(--sc-color-grey-50));
    cursor: not-allowed;
    // opacity: 0.5;
  }

  .sc-file-drop-zone-container *, .sc-file-drop-zone-container ::before, .sc-file-drop-zone-container ::after {
    box-sizing: inherit;
  }

  .sc-file-drop-zone-container .file-input {
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
  }

  .sc-file-drop-zone-accept {
    color: var(--sc-file-drop-zone-accept-text-color, var(--sc-color-grey-400));
    text-align: center;
    font-family: var(--sc-font-family);
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 157.143%;
  }

  .sc-file-drop-zone-placeholder {
    color: var(--sc-file-input-drop-zone-placeholder-color, var(--sc-color-blue-darkest));
    text-align: center;
    font-feature-settings: 'liga' off, 'clig' off;
    font-family: var(--sc-font-family);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
  }

  .sc-file-drop-zone-placeholder-active {
    color: var(--sc-file-input-drop-zone-placeholder-brw-color, var(--sc-color-blue-500));
  }

  .sc-file-drop-zone-container-err {
    border-color: var(--sc-file-input-drop-container-error-border-color,  var(--sc-color-red-500));
  }

  .sc-file-drop-zone-placeholder-brw {
    color: var(--sc-file-input-drop-zone-placeholder-brw-color,  var(--sc-color-blue-500));
    text-decoration-style: solid;
    text-decoration-skip-ink: none;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
  }
`;