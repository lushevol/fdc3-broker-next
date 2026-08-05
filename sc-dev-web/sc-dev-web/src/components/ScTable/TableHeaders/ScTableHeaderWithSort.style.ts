import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .sc-table-header-with-sort {
    width: 90%;
    display: flex;
    justify-content: space-between;
  }

  .header-slot {
    display: flex;
  }

  sc-icon {
    cursor: pointer;
  }
  .sc-table-header-with-sort sl-menu {
    border-radius: 8px;
    border: 1px solid var(--sc-dropdown-border-color, var(--sc-color-grey-150));
    background: var(--sc-dropdown-background-color, var(--sc-color-white));
    box-shadow: 0px 2px 4px 0px rgba(82, 83, 85, 0.1);
  }

  .sc-table-header-with-sort .dropdown-item::part(label) {
    font-size: 1rem;
    color: var(--sc-dropdown-color, var(--sc-color-blue-900));
    margin-left: 1rem;
    font-family: var(--sc-font-family);
  }

  .sc-table-header-with-sort .dropdown-item::part(checked-icon) {
    display: none;
  }
  .sc-table-header-with-sort .dropdown::part(trigger) {
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: 8px;
  }

  .sc-table-header-with-sort .dropdown-item-active::part(base) {
    background: var(--sc-table-tr-hover-background-color);
  }
  .sc-table-header-with-sort .dropdown-item::part(base):hover {
    background: var(--sc-table-tr-hover-background-color);
  }
  .item-wrapper {
    display: flex;
  }
  .item-wrapper .item-text {
    color: var(--sc-dropdown-color, var(--sc-color-blue-900));
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
  }
  .item-wrapper sc-icon {
    margin-right: 8px;
  }
`;
