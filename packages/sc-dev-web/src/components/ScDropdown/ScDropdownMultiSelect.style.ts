import { css } from 'lit';

export default css`
  .box {
    --sc-form-input-padding-top: 0;
    --sc-form-input-padding-right: 0.75rem;
    --sc-form-input-padding-bottom: 0;
    --sc-form-input-padding-left: 0.75rem;
  }

  .sc-dropdown-input .input-cover {
    background: var(--sc-form-control-background-color, var(--sc-color-white));
  }

  .sc-dropdown-input .input-cover.mobile,
  .sc-dropdown-input.multiple .input-cover.mobile {
    border-radius: var(--sc-radius-lg, 1rem);
  }

  .sc-dropdown-input.multiple .input-cover {
    width: calc(100% - var(--sc-form-input-padding-right, 0px) - var(--sc-form-input-padding-left, 0px) - 2.1px);
    height: var(--sc-dropdown-multiple-height, 1.89rem);
    display: inline-grid;
    border: 1px solid var(--sc-dropdown-input-border-color, var(--sc-color-grey-150));
    border-radius: var(--sc-form-input-border-radius, none);
    padding: var(--sc-form-input-padding-top, 0) 
      var(--sc-form-input-padding-right, 0) 
      var(--sc-form-input-padding-bottom, 0) 
      var(--sc-form-input-padding-left, 0);

    &.clearable {
      width: calc(
        100% - var(--sc-form-input-padding-right, 0px) -
          var(--sc-form-input-padding-left, 0px) - 2.5rem - 2.1px
      );
      padding-right: calc(var(--sc-form-input-padding-right, 0) + 2.5rem);
    }
  }

  .sc-dropdown-input.multiple.line .input-cover {
    border: none;
    border-bottom: 1px solid var(--sc-dropdown-input-border-color, var(--sc-color-grey-150));
  }

  .sc-dropdown-input.multiple.disabled .input-cover {
    border-bottom: 1px solid var(--sc-form-disabled-input-border-color, var(--sc-color-grey-150));
    cursor: not-allowed;
    color: var(--sc-form-disabled-input-text-color, var(--sc-color-grey-50));
  }
  
  .sc-dropdown-input.multiple.disabled.box .input-cover {
    border: 1px solid var(--sc-form-disabled-input-border-color, var(--sc-color-grey-150));
    background: var(--sc-form-disabled-input-background-color, var(--sc-color-grey-150));
  }

  .sc-dropdown-input.multiple .input-cover ul {
    display: flex;
    align-items: center; 
    overflow: hidden; 
    white-space: nowrap;
    padding: var(--sc-dropdown-multiple-ul-padding, 0);
    margin: var(--sc-dropdown-multiple-ul-margin, 1px 1.25rem 1px 0);
    width: 100%;
  }

  .sc-dropdown-input.multiple .input-cover ul.multiple-rows {
    --sc-dropdown-multiple-ul-margin: 1px 1.25rem 1px 0;
    display: block;
  }
  .multiple-rows li {
    margin: 0.1875rem 0.25rem 0.1875rem 0;
  }

  .sc-dropdown-input.multiple .input-cover ul.error {
    --sc-dropdown-multiple-ul-margin: 0 2.75rem .125rem 0;
  }

  .sc-dropdown-input.multiple .input-cover ul.prefix-icon {
    padding-left: .25rem;
    --sc-dropdown-multiple-ul-margin: 0 1.25rem .125rem 1.75rem;
  }

  .sc-dropdown-input.multiple .input-cover ul.prefix-icon.error {
    --sc-dropdown-multiple-ul-margin: 0 2.75rem .125rem 1.75rem;
  }

  .sc-dropdown-input.multiple .input-cover ul li {
    list-style: none;
    margin-right: .25rem;
    float: left;
  }

  .sc-dropdown-input.multiple .input-cover input {
    border: none;
    background: transparent;
    width: auto;
    max-width: 100%;
    min-width: 0px;
    padding: 0; 
    min-height: 1.5rem;
    outline: none;
    font-size: 0.875rem;
    line-height: 1.375rem;
    background: var(--sc-form-control-background-color, --sc-color-white);
    color: var(--sc-form-control-color, var(--sc-color-blue-900));
    caret-color: var(--sc-form-control-color, var(--sc-color-blue-900));
    font-family: inherit;
    
    &.without-placeholder {
      min-width: 1.25rem;
    }
  }

  .sc-dropdown-input.multiple.sm .input-cover input {
    font-size: 0.75rem;
  }

  .sc-dropdown-input.multiple.lg .input-cover input {
    font-size: 1rem;
  }

  .sc-dropdown-input.multiple .input-cover input::-ms-reveal {
    display: none;
  }
  
  .sc-dropdown-input.multiple.disabled .input-cover input {
    color: var(--sc-form-disabled-input-text-color, var(--sc-color-grey-50));
    background:var(--sc-form-disabled-input-background-color, var(--sc-color-grey-50));
    cursor: not-allowed;
  }

  .sc-dropdown-input.multiple [slot='suffix'] {
    margin-left: 0.375rem;
  }

  .sc-dropdown-input.multiple .dropdown-menu {
    padding: 0;
    will-change: transform;
  }

  .sc-dropdown-input.multiple .dropdown-menu .scroll-element {
    display: flex;
    flex-direction: column;
    min-width: max-content;
  }

  .sc-dropdown-input.multiple .dropdown-menu .list-item {
    width: 100%;
    min-width: max-content;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    cursor: pointer;
    background: var(--sc-dropdown-item-background-color);
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
        var(--sc-color-grey-500)
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

    .tick-mark {
      color: var(--sc-dropdown-item-tick-color, var(--sc-color-blue-650));
      padding-right: 0.5rem;
    }
    &:not(.selected) .tick-mark {
      visibility: hidden;
    }
  }
  .sc-dropdown-input.multiple.hide-tick-mark {
    .dropdown-menu .scroll-element .list-item .tick-mark {
      display: none;
    }
  }

  .sc-dropdown-input.multiple.error {
    --sc-dropdown-color: var(
      --sc-dropdown-error-color,
      var(--sc-color-red-550)
    );
    --sc-checkbox-font-color: var(--sc-dropdown-color);
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

  .sc-dropdown-input.multiple
    .dropdown-menu
    .scroll-element
    .list-item[hidden] {
    display: none;
  }
  .sc-dropdown-input.multiple .dropdown-menu sc-checkbox {
    display: block;
    color: var(--sc-dropdown-color, var(--sc-color-blue-900));
    flex: 1;
    margin-right: 0.5rem;
  }

  .sc-dropdown-input.multiple .dropdown-menu sc-checkbox::part(selection) {
    width: 100%;
  }
  .sc-dropdown-input.multiple.sc-truncate .dropdown-menu sc-checkbox::part(label) {
    overflow: hidden;
    text-overflow: ellipsis;
  }


  .sc-dropdown-input.multiple.error .input-cover {
    border-color: var(--sc-form-input-error-border-color, var(--sc-color-red-500));
  }

  .sc-dropdown-input.multiple.success .input-cover {
    border-color: var(--sc-form-input-success-border-color, var(--sc-color-green-700));
  }

  .sc-dropdown-input.multiple .input-cover.focus {
    outline: 2px solid var(--sc-form-input-focus-outline-color, var(--sc-color-blue-100));
  }

  .sc-dropdown-input.multiple .input-cover:hover {
    border-color: var(--sc-form-input-focus-border-color, var(--sc-color-blue-500));
  }

  .sc-dropdown-input.multiple.line .input-cover:hover {
    border-color: none !important;
    box-shadow: none;
  }

  .sc-dropdown-input.multiple .input-cover .truncated-items-text {
    color: var(--sc-dropdown-truncated-items-text-color, var(--sc-color-blue-500));
    font-size: 0.875rem;
    line-height: 1.375rem;
  }

  .prefix-of-sl-menu-item {
    align-self: flex-start;
    padding: .625rem 0 .5rem 0;
    width: var(--sc-dropdown-prefix-width, 1rem);
  }

  .hierarchical .list-item:not(.has-children) .prefix-of-sl-menu-item {
    --sc-dropdown-prefix-width: 1rem;
  }

  .list-item:not(.has-children) .prefix-of-sl-menu-item {
    --sc-dropdown-prefix-width: 0;
  }

  .sc-dropdown-input.multiple .scrollable-content {
    overflow-x: auto;
  }
`;
