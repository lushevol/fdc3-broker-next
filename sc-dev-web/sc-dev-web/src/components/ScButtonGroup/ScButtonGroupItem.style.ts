import { css } from 'lit';

export default css`
  :host {
    /* --icon-button-label-line-height-sm: 22px; */
    --sc-button-border-radius-md: 0;
    margin-right: -1px;
  }
  :host([truncate]) {
    flex: 1;
    min-width: 0;
    max-width: max-content;
  }
  :host(:first-of-type) {
    --sc-button-border-radius-md: .375rem 0 0 .375rem;
    margin-right: -1px;
  }
  :host(:last-of-type) {
    --sc-button-border-radius-md: 0 .375rem .375rem 0;
  }

  .sc-button-group-item {
    position: relative;
    z-index: 1;
    --sc-button-font-weight: 500;
    --sc-button-border-width: var(--sc-button-group-item-border-width, 1px);
    
    --sc-button-secondary-border-color: var(--sc-button-group-item-border-color, var(--sc-color-grey-300));
    --sc-button-secondary-hover-border-color: var(--sc-button-group-item-hover-border-color, var(--sc-color-blue-460));
    --sc-button-secondary-press-border-color: var(--sc-button-group-item-border-color, var(--sc-color-grey-300));
    --sc-button-secondary-background-color: var(--sc-button-group-item-background-color, var(--sc-color-white));
    
    --sc-button-secondary-text-color: var(--sc-button-group-item-text-color, var(--sc-color-blue-900));
    --sc-button-secondary-hover-text-color: var(--sc-button-group-item-hover-text-color, var(--sc-color-blue-460));
    --sc-button-secondary-press-text-color: var(--sc-button-group-item-text-color, var(--sc-color-blue-900));
    
    --sc-button-disabled-border-color: var(--sc-button-group-item-disabled-border-color, var(--sc-color-grey-150));
    --sc-button-disabled-background-color: var(
      --sc-button-group-item-disabled-background-color, 
      var(--sc-color-grey-50)
    );
    --sc-button-disabled-text-color: var(--sc-button-group-item-disabled-text-color, var(--sc-color-grey-300));
  }

  .sc-button-group-item.button-selected.button-disabled {
    --sc-button-primary-disabled-border-color: var(--sc-button-group-item-active-disabled-border-color, var(--sc-color-grey-150));
    --sc-button-primary-disabled-background-color: var(
      --sc-button-group-item-active-disabled-background-color, 
      var(--sc-color-grey-300)
    );
    --sc-button-primary-disabled-text-color: var(--sc-button-group-item-active-disabled-text-color, var(--sc-color-white));
  }

  .sc-button-group-item.button-disabled:not(.button-selected) {
    --sc-button-secondar-disabled-border-color: var(--sc-button-group-item-active-disabled-border-color, var(--sc-color-grey-150));
    --sc-button-secondary-disabled-background-color: transparent;
    --sc-button-secondar-disabled-text-color: var(--sc-button-group-item-active-disabled-text-color, var(--sc-color-white));
  }
  .sc-button-group-item:not(.button-disabled):not(.button-selected):hover,
  .sc-button-group-item:not(.button-disabled):not(.button-selected):focus {
    z-index: 100;
  }

  .sc-button-group-item.button-error,
  .sc-button-group-item.button-selected.button-error {
    --sc-button-primary-disabled-border-color: var(--sc-button-group-item-error-border-color, var(--sc-color-red-500));
    --sc-button-secondary-disabled-border-color: var(
      --sc-button-group-item-error-border-color,
      var(--sc-color-red-500)
    );
  }
`; 