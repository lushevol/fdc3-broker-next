import { css } from 'lit';

export default css`
  :host {
    min-height: var(--sc-form-group-input-min-height, auto);
  }
  sc-file-drop-zone {
    margin-top: 0.5rem;
  }
  
  .sc-file-input {
    width: var(--sc-file-input-width, 100%);
  }
`;