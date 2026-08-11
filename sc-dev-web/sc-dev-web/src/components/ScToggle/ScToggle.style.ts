import { css } from 'lit';

export default css`
  .sc-toggle {
    border-radius: 24px;
    padding: 2px;
    cursor: pointer;
    border: 1px solid var(--sc-toggle-border-color, var(--sc-color-blue-500));
    background: var(--sc-toggle-background-color, var(--sc-color-white));
    width: fit-content;
    display: flex;
    position: relative;

    &.sc-truncate {
      width: auto;
      max-width: max-content;
    }
  }

  .sc-toggle.disabled {
    cursor: not-allowed;
    background: var(--sc-toggle-disabled-background-color, var(--sc-color-grey-50));
    border: 1px solid var(--sc-toggle-disabled-background-color, var(--sc-color-grey-50));
  }

  .background-cover {
    position: absolute;
    z-index: 1;
    border-radius: 24px;
    color: var(--sc-toggle-selected-color, var(--sc-color-white));
    background: var(
      --sc-toggle-selected-background-color,
      var(--sc-color-blue-500)
    );
    height: 100%;
    transition: var(--sc-transition-fast) all ease-in-out;
  }

  .slot-container {
    z-index: 2;
    display: flex;

    .sc-toggle.sc-truncate & {
      max-width: 100%;
    }
  }
`;