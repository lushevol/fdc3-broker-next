import { css } from 'lit';

export default css`
  .box {
    --sc-form-input-padding-right: 0.75rem;
    // --sc-form-input-focus-outline: 2px solid var(--sc-dropdown-focus-outline-color, var(--sc-color-blue-100));
    --sc-form-group-input-min-height: 0;
    --sc-form-input-error-message-margin-top: 4px;
    --sc-form-input-success-message-margin-top: 4px;
    --sc-form-input-help-message-margin-top: 4px;
    --sc-form-group-input-min-height: auto;
  }

  .box .sc-dropdown-input.sm {
    --sc-form-input-height: var(--sc-spacing-16, 1rem);
    --sc-form-input-font-size: var(--sc-font-size-sm, 0.75rem);
    --sc-dropdown-item-font-size: var(--sc-font-size-sm, 0.75rem);
    --sc-form-input-prefix-padding-top: 0.58rem;
    --sc-form-input-suffix-padding-top: 0.58rem;
    --sc-form-input-line-height: var(--sc-line-height-sm, 1.25rem);
    --sc-form-input-padding-top: .125rem;
    --sc-form-input-padding-bottom: .125rem;
  }

  .box .sc-dropdown-input.md {
    --sc-form-input-height: var(--sc-spacing-24, 1.5rem);
    --sc-form-input-font-size: var(--sc-font-size-md, 0.875rem);
    --sc-dropdown-item-font-size: var(--sc-font-size-md, 0.875rem);
    --sc-form-input-prefix-padding-top: 0.7rem;
    --sc-form-input-suffix-padding-top: 0.7rem;
    --sc-form-input-line-height: var(--sc-line-height-md, 1.375rem);
    --sc-form-input-padding-top: .3125rem;
    --sc-form-input-padding-bottom: .3125rem;
  }

  .box .sc-dropdown-input.lg {
    --sc-form-input-height: var(--sc-spacing-32, 2rem);
    --sc-form-input-font-size: var(--sc-font-size-lg, 1rem);
    --sc-dropdown-item-font-size: var(--sc-font-size-lg, 1rem);
    --sc-form-input-prefix-padding-top: 0.875rem;
    --sc-form-input-suffix-padding-top: 0.875rem;
    --sc-form-input-line-height: var(--sc-line-height-lg, 1.5rem);
    --sc-form-input-padding-top: 0.5rem;
    --sc-form-input-padding-bottom: 0.5rem;
  }
    
  .sc-dropdown-input {
    position: relative;
  }

  div.sc-dropdown-input > sl-dropdown.sc-dropdown-input {
    display: block;
  }

  .sc-dropdown-input [slot="suffix"] {
    color: var(--sc-dropdown-input-arrow-color, var(--sc-color-blue-500));
  }

  .sc-dropdown-input .arrow-icon {
    position: absolute;
    right: var(--sc-form-input-padding-right, 0);
    cursor: pointer;
    color: var(--sc-dropdown-input-arrow-color, var(--sc-color-blue-900));
  }
  
  .sc-dropdown-input.no-label .arrow-icon {
    top: .938rem;
  }

  .sc-dropdown-input sc-text-input::part(tips-icon) {
    right: 1.875rem;
  }
  
  .sc-dropdown-input sc-text-input::part(more-icons) {
    right: var(--sc-form-input-padding-right, 0);
  }

  // .sc-dropdown-input sc-text-input::part(help-message),
  // .sc-dropdown-input sc-text-input::part(error-message),
  // .sc-dropdown-input sc-text-input::part(success-message) {
  //   height: 0;
  // }

  .sc-dropdown-input sl-menu {
    padding: 0;
    border-radius: .5rem;
    border: 1px solid var(--sc-dropdown-border-color, var(--sc-color-grey-150));
    background: var(--sc-dropdown-background-color, var(--sc-color-white));
    box-shadow: 0px 2px 4px 0px rgba(82, 83, 85, 0.1);
    height: var(--sc-dropdown-height, 100%) !important;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden !important;
  }
  sl-dropdown > sl-menu {
    --auto-size-available-height: var(--sc-popup-max-height, unset);
  }

  .sc-dropdown-input .mobile {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .sc-dropdown-input .mobile sl-menu {
    border: none;
    box-shadow: none;
    visibility: visible;
  }

  .sc-dropdown-input .scrollable-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    white-space: nowrap;
  }

  .sc-dropdown-input[style*="--sc-dropdown-min-width"] .scrollable-content {
    overflow-x: auto;
  }

  .sc-dropdown-input.error-message sl-menu,
  .sc-dropdown-input.success-message sl-menu,
  .sc-dropdown-input.help-text sl-menu  {
    --sc-dropdown-menu-margin-top: 0;
  }

  .sc-dropdown-input .scrollable-content::-webkit-scrollbar {
    width: 0.25rem;
    height: 0.25rem;
    background-color: transparent;
  }

  .sc-dropdown-input .scrollable-content::-webkit-scrollbar-thumb {
    background-color: var(--sc-scrollbar-background-color, var(--sc-color-grey-500));
    border-radius: 0.25rem;
  }

  .sc-dropdown-input .virtual-list {
    padding: .5rem 0;
    /* used for virtual */
    width: var(--sc-dropdown-min-width);
  }
  .sc-dropdown-input .normal-list {
    height: auto !important;
  }
  .sc-dropdown-input sl-menu-item[hidden] {
      display: none!important;
  }
  
  .prefix-of-sl-menu-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1rem;
    margin: 0 0.5rem 0 0.25rem;
  }

  .expanded-menu-item .prefix-of-sl-menu-item .expand-children-icon {
    transform: rotate(90deg);
  }

  .prefix-of-sl-menu-item .expand-children-icon {
    display: none;
    color: var(--sc-dropdown-color, var(--sc-color-blue-900));
  }

  .hierarchical .prefix-of-sl-menu-item {
    width: 1rem;
  }

  .has-children .prefix-of-sl-menu-item .expand-children-icon {
    display: flex;
    color: var(--sc-dropdown-expand-icon-color, var(--sc-color-grey-400));
  }

  .sc-dropdown-input .dropdown-item::part(label) {
    font-size: var(--sc-dropdown-item-font-size, .875rem);
    color: var(--sc-dropdown-color, var(--sc-color-blue-900));
    font-family: var(--sc-font-family);
  }

  .sc-dropdown-input .dropdown-item::part(checked-icon) {
    display: none;
  }

  .sc-dropdown-input .dropdown-item::part(base) {
    padding-left: 0;
  }

  .sc-dropdown-input .dropdown-item {
    outline: none;

    &.selected {
      --sc-dropdown-item-background-color: var(
        --sc-dropdown-item-background-selected-color,
        var(--sc-color-blue-50)
      );
    }
    &[disabled] {
      --sc-dropdown-color: var(
        --sc-dropdown-disabled-color,
        var(--sc-color-grey-500-dark)
      ) !important;
      --sc-dropdown-item-background-color: transparent !important;
    }
    &:not([disabled]) {
      &:focus-within,
      &:hover {
        --sc-dropdown-item-background-color: var(
          --sc-dropdown-item-background-hover-color,
          var(--sc-color-grey-50)
        );
      }
      &:active {
        --sc-dropdown-item-background-color: var(
          --sc-dropdown-item-background-pressed-color,
          var(--sc-color-grey-100)
        );
      }
    }

    &::part(base) {
      opacity: 1;
      background: var(--sc-dropdown-item-background-color);
    }
    &::part(suffix) {
      min-width: 2rem;
    }
    .tick-mark {
      color: var(--sc-dropdown-item-tick-color, var(--sc-color-blue-650));
    }

    &:not(.selected) {
      .tick-mark {
        display: none;
      }
    }

    &::part(submenu-icon) {
      display: none;
    }
  }

  .sc-dropdown-input.hide-tick-mark .dropdown-item {
    &::part(suffix),
    .tick-mark {
      display: none;
    }
  }

  .sc-dropdown-input.error {
    --sc-dropdown-color: var(
      --sc-dropdown-error-color,
      var(--sc-color-red-550)
    );
    --sc-dropdown-item-background-color: var(
      --sc-dropdown-error-item-background-color,
      var(--sc-color-white)
    );
    --sc-dropdown-item-background-hover-color: var(
      --sc-dropdown-error-item-background-hover-color,
      var(--sc-color-grey-50)
    );
    --sc-dropdown-item-background-pressed-color: var(
      --sc-dropdown-error-item-background-pressed-color,
      var(--sc-color-red-100)
    );
    --sc-dropdown-item-background-selected-color: var(
      --sc-dropdown-error-item-background-selected-color,
      var(--sc-color-red-50)
    );
    --sc-dropdown-item-tick-color: var(
      --sc-dropdown-error-item-tick-color,
      var(--sc-color-red-700)
    );
  }

  .sc-dropdown-input .empty-text,
  .sc-dropdown-input .loading-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .5rem 1.5rem;
    font-size: .875rem;
    line-height: 1.25rem;
    gap: .625rem;
  }

  .advanced-search {
    flex-shrink: 0;
    background: white;
    z-index: 1;
    padding: .75rem .5rem;
    gap: .5rem;
    justify-content: center;
    align-items: center;
    font-size: .875rem;
    line-height: 1.375rem;
    border-radius: 0px 0px 6px 6px;
    border-top: 1px solid var(--sc-dropdown-advanced-search-border-color, var(--sc-color-grey-150));
    color: var(--sc-dropdown-advanced-search-color, var(--sc-color-blue-460));
    cursor: pointer;
  }

  .sc-dropdown-input .empty-text {
    color: var(--sc-dropdown-empty-text-color, var(--sc-brand-grey));
  }

  .sc-dropdown-input .spinner-text-container {
    display: flex;
    align-items: center;
    line-height: 1.25rem; 
    gap: .625rem;
  }

  .sc-dropdown-input .spinner {
    padding-top: 4px;
  }

  .sc-dropdown-input .loading-text {
    font-size: .875rem;
    line-height: 1.25rem; 
    color: var(--sc-dropdown-loading-text-color, var(--sc-brand-grey));
  }

  .sc-dropdown-input .dropdown-header {
    display: flex;
    padding: 1rem 1rem 0.5rem 0.5rem;
    margin-left: .5rem;
    gap: .625rem;
    color: var(--sc-dropdown-header-color, var(--sc-brand-grey));
    font-size: .75rem;
  }
  .sc-dropdown-input.sc-truncate .dropdown-header {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .sc-dropdown-input .retry-button {
    color: var(--sc-dropdown-retry-button-color, var(--sc-color-blue-460));
    cursor: pointer;
  }

  .sc-dropdown-input.sc-truncate {
    .advanced-search > .advanced-search-text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .empty-text > *,
    .loading-container > *,
    .spinner-text-container > * {
      flex: 1;
      min-width: 0;
      max-width: max-content;
    }
    
    .dropdown-header
    .loading-button,
    .loading-text,
    .empty-text-div,
    .retry-button {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`;
