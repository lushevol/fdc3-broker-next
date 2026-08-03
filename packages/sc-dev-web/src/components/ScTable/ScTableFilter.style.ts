import { css } from 'lit';

export default css`
  :host {
    --sc-form-group-input-min-height: auto;
  }
  .sc-table-filter .dropdown {
    width: 90%;
  }

  .sc-table-filter .dropdown-menu {
    padding: 8px 0;
    width: 90%;
    border-radius: 8px;
    border: 1px solid var(--sc-dropdown-border-color, var(--sc-color-grey-150));
    background: var(--sc-dropdown-background-color, var(--sc-color-white));
    box-shadow: 0px 2px 4px 0px rgba(82, 83, 85, 0.1);
    --auto-size-available-height: var(--sc-table-filter-max-height);
  }
  .trigger sc-text-input::part(input) {
    height: 28px;
    line-height: 1.75rem;
    padding-top: 2px;
    padding-bottom: 2px;
    font-size: 0.75rem;
    font-weight: 400;
  }
  .compact sc-text-input::part(input) {
    height: 20px;
    line-height: 1.25rem;
    padding-top: 2px;
    padding-bottom: 2px;
    font-size: 0.75rem;
    font-weight: 400;
  }

  .sc-table-filter .dropdown-menu sc-checkbox {
    display: block;
    padding: 4px 16px;
    color: var(--sc-dropdown-color, var(--sc-color-blue-900));
    box-sizing: border-box;
  }

  .sc-table-filter .dropdown-menu sc-checkbox:hover {
    background: var(--sc-table-tr-hover-background-color);
  }
  .empty-options {
    text-align: center;
    color: var(--sc-dropdown-color, var(--sc-color-blue-900));
    font-size: 1rem;
    padding: 20px 0;
  }
  .loading-text {
    text-align: center;
    padding: 20px 0;
    color: var(--sc-dropdown-color, var(--sc-color-blue-900));
  }
  .scroll-element div[hidden] {
    display: none;
  }
`;
