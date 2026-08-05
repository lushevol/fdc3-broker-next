import { css } from 'lit';

export default css`
  :host {
    width: fit-content;
    padding: var(--sc-breadcrumb-padding, 0.25rem 1rem);
  }

  :host(.sc-breadcrumb-wrap-fill) {
    background-color: var(--sc-breadcrumb-background-color, var(--sc-color-grey-100));
  }
  .sc-breadcrumb .sc-breadcrumb-item::part(separator) {
    color: var(--sc-breadcrumb-separator-color, var(--sc-color-grey-100));
  }
  .sc-breadcrumb .sc-menu-item::part(base) {
    font-size: 0.875rem;
  }
  .sc-breadcrumb .sc-menu-item::part(checked-icon),
  .sc-breadcrumb .sc-menu-item::part(submenu-icon) {
    display: none;
  }
  .sc-breadcrumb .sc-menu-item::part(label) {
    display: inline-flex;
    padding: 0 0.5rem;
  }
  .sc-breadcrumb .sc-dropdown,
  .sc-breadcrumb .sc-dropdown sc-link {
    display: flex;
  }
  .sc-menu {
    display: flex;
    flex-direction: column;
    border-radius: 0.375rem;
    min-width: 12.5rem;
    padding: 0.5rem;
  }
`;
