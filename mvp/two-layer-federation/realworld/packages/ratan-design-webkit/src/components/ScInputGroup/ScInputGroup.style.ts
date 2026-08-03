import { css } from 'lit';

export default css`
  .sc-input-group.error, .sc-input-group.success {
    --sc-input-group-icon-width: 32px;
  }

  .sc-input-group {
    width: var(--sc-input-group-width, 100%);
  }

  .sc-input-group [part="input-container"] {
    display: flex;
    width: calc(100% - var(--sc-input-group-icon-width, 0px));
  }
`;