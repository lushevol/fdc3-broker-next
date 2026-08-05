import { css } from 'lit';

export default css`
  :host(:not(:last-of-type)) sl-breadcrumb-item::part(separator) {
    display: inline-flex;
  }
  :host(.sc-breadcrumb-dropdown) sl-breadcrumb-item::part(separator) {
    display: inline-flex;
  }
  :host([slot=compressed]) sl-breadcrumb-item::part(separator) {
    display: none;
  }
  :host([slot=compressed]) sl-breadcrumb-item {
    margin: 0 0.75rem;
  }
  :host([slot=compressed]) sl-breadcrumb-item::part(label) {
    color: var(--sc-breadcrumb-item-menu-text-color, var(--sc-color-blue-900));
    font-weight: 400;
  }
  
  :host([slot=compressed]:hover) {
    background-color: var(--sc-color-blue-50);
  }
  :host {
    display: flex;
  }
  :host([slot=compressed]) {
    align-items: center;
    padding: 0.25rem 0;
    height: 2.375rem;
    border-radius: 0.375rem;
    box-sizing: border-box;
  }
  .sc-breadcrumb-item::part(base) {
    font-family: inherit;
    height: 2rem;
    padding: 0.25rem 0;
  }
  .sc-breadcrumb-item::part(label) {
    color: var(--sc-breadcrumb-item-text-color, var(--sc-color-blue-500));
    font-weight: 500;
    line-height: 1.375rem;
  }
  .sc-breadcrumb-item::part(separator) {
    color: var(--sc-breadcrumb-separator-color, var(--sc-color-blue-900));
  }
  .sc-breadcrumb-item::part(prefix),
  .sc-breadcrumb-item::part(suffix) {
    color: var(--sc-breadcrumb-separator-color, var(--sc-color-blue-900));
  }
  :host(:last-of-type) .sc-breadcrumb-item::part(label),
  :host(:last-of-type) .sc-breadcrumb-item::part(prefix),
  :host(:last-of-type) .sc-breadcrumb-item::part(suffix) {
    color: var(--sc-breadcrumb-last-item-text-color, var(--sc-color-blue-900));
  }
`;
