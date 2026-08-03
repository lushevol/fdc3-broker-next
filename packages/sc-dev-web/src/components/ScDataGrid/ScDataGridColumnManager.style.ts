import { css } from 'lit';

export const classNamePrefix = 'sc-data-grid-column-manager-';

export default css`
  :host {
  }
  sl-popup::part(popup) {
    z-index: 3;
  }

  .sc-data-grid-column-manager-root {
    user-select: none;
    border-radius: 4px;
    border: 1px solid var(--sc-data-grid-basic-bg-color);
    box-sizing: border-box;
    background: var(--sc-data-grid-basic-bg-color);
    box-shadow: 0px 1px 4px 0px rgba(6, 29, 51, 0.15);
    max-height: var(--auto-size-available-height);
    width: 17.5rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .sc-data-grid-column-manager-columns-wrapper {
    padding: 0.5rem 1rem;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  .sc-data-grid-column-manager-menu-item {
    border-bottom: 1px solid var(--sc-data-grid-outline-color);
    padding-top: 0.25rem;

    /* borrowed variables from sc-dropdown-input */
    &:hover::part(base) {
      background-color: var(--sc-dropdown-item-background-hover-color, --sc-colors-blue-100);
    }
    &::part(label) {
      font-size: var(--sc-dropdown-item-font-size, .875rem);
      color: var(--sc-dropdown-retry-button-color, var(--sc-color-blue-500));
      font-family: var(--sc-font-family);
    }
    &::part(checked-icon) {
      width: 0.75rem;
    }
  }
  .sc-data-grid-column-manager-actions-wrapper {
    border-bottom: 1px solid var(--sc-data-grid-outline-color);
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem 0.5rem;
  }
  .sc-data-grid-column-manager-actions-wrapper sc-text-input {
    margin-left: 4px;
  }

  .sc-data-grid-column-manager-checkbox-content {
    border-color: transparent;
    border-top-style: solid;
    border-bottom-style: solid;
    border-top-width: 1px;
    border-bottom-width: 1px;
    display: flex;
    align-items: center;
  }
  .sc-data-grid-column-manager-drag-active {
    opacity: 0.4;
  }
  .sc-data-grid-column-manager-checkbox-content sc-checkbox {
    height: 1rem;
  }
  .sc-data-grid-column-manager-checkbox-content[placement="before"] {
    border-top-color: var(--sc-data-grid-outline-color);
  }
  .sc-data-grid-column-manager-checkbox-content[placement="after"] {
    border-bottom-color: var(--sc-data-grid-outline-color);
  }
  .sc-data-grid-column-manager-drag {
    cursor: grab;
    display: flex;
    align-items: center;
  }
  .sc-data-grid-column-manager-drag[disabled] {
    cursor: not-allowed;
  }
  .sc-data-grid-column-manager-column-label {
    color: var(--sc-data-grid-basic-text-color);
    font-family: var(--sc-font-family);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sc-data-grid-column-manager-no-result {
    color: var(--sc-data-grid-basic-text-color);
    font-family: var(--sc-font-family);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    text-align: center;
    padding: 0.5rem 0;
  }
  .sc-data-grid-column-manager-expanded {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-right: 6px;
  }
  .sc-data-grid-column-manager-expanded-active svg {
    transform: rotate(90deg);
  }
`;
