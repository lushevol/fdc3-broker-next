import { css } from 'lit';

export default css`
    /* Basic */ 
  .sc-button {
    display: var(--sc-button-display, inline-block);
    border-radius: var(--sc-button-border-radius, 0.38rem);
    width: var(--sc-button-width, var(--sc-button-self-width, auto));
  }
  .sc-button.sc-button-pill::part(base) {
    border-radius: var(--sc-button-pill-border-radius, 6.25rem);    
    box-sizing: var(--sc-button-box-sizing, inherit);
  }
  .sc-button::part(base) {
    font-family: var(--sc-font-family);
    border-style: solid;
    border-width: var(--sc-button-border-width, 1px);
    border-radius: var(--sc-button-rounded-border-radius, 0.38rem);
    font-weight: var(--sc-button-font-weight, 500);
    transition: ease-in-out 250ms background-color, 
      ease-in-out 250ms border-color, 
      ease-in-out 250ms color, 
      ease-in-out 250ms box-shadow;
  }
  .sc-button.sc-button-no-border::part(base) {
    border-width: var(--sc-button-border-width, 0px);
  }
  .sc-button::part(label) {
    padding: 0;
    display: var(--sc-button-label-display, inline-block);
  }
  /* Maintain interaction state here. Use css variable to theme */
  .sc-button {
    &::part(base) {
      background-color: var(--default-background);
      border-color: var(--default-border);
      color: var(--default-text);
    }
    &:not(.sc-button-disabled) {
      &.sc-selected::part(base) {
        background-color: var(--select-background);
        border-color: var(--select-border);
        color: var(--select-text);
        box-shadow: none;
      }
      &::part(base):hover {
        background-color: var(--hover-background);
        border-color: var(--hover-border);
        color: var(--hover-text);
        box-shadow: var(--hover-shadow, none);
      }
      &::part(base):focus {
        outline: none;
      }
      &::part(base):focus-visible {
        outline: 2px solid var(--sc-button-focus-outline-color, var(--sc-color-blue-250));
        outline-offset: 2px;
        position: relative;
        z-index: 1;
      }
      &::part(base):active {
        background-color: var(--press-background);
        border-color: var(--press-border);
        color: var(--press-text);
        box-shadow: none;
        transition: none;
      }
    }

    &.sc-button-loading::part(base) {
      background-color: var(--press-background);
      border-color: var(--press-border);
      color: var(--press-text);
      box-shadow: none;
      transition: none;
    }
  }
  
  .sc-button.sc-truncate {
    &, &::part(base) {
      max-width: 100%;
    }

    &::part(label) {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .sc-button .sc-button-icon-right {
    margin-left: 0.5rem;
  }
  .sc-button .sc-button-icon-left {
    margin-right: 0.5rem;
  }
  .sc-button .sc-button-icon-left-wrap-with-loading {
    display: inline-block;
  }
  .sc-button.sc-button-size-xxs .sc-button-icon-right, .sc-button.sc-button-size-xs .sc-button-icon-right {
    margin-left: 0.25rem;
  }
  .sc-button.sc-button-size-xxs .sc-button-icon-left, .sc-button.sc-button-size-xs .sc-button-icon-left {
    margin-right: 0.25rem;
  }

  .sc-button-compact {
    --sc-button-padding-md: .25rem 0;
    --sc-button-padding-lg: .625rem 0;
    --sc-button-padding-sm: .125rem 0;
    --sc-button-padding-xs: .125rem 0;
    --sc-button-padding-xxs: .125rem 0;
  }

  .sc-button-spinner-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /** themes, only set colors to variables, no state logic */
  .sc-button {
    &.sc-button-primary {
      --default-background: var(--sc-button-primary-background-color, var(--sc-color-blue-500));
      --default-border: var(--sc-button-primary-border-color, var(--sc-color-blue-500));
      --default-text: var(--sc-button-primary-text-color, var(--sc-color-white));
      --hover-background: var(--sc-button-primary-hover-background-color, var(--sc-color-blue-400));
      --hover-border: var(--sc-button-primary-hover-border-color, var(--sc-color-blue-400));
      --hover-text: var(--sc-button-primary-hover-text-color, var(--sc-color-white));
      --press-background: var(--sc-button-primary-press-background-color, var(--sc-color-blue-600));
      --press-border: var(--sc-button-primary-press-border-color, var(--sc-color-blue-600));
      --press-text: var(--sc-button-primary-press-text-color, var(--sc-color-blue-100));
      --select-background: var(--sc-button-primary-select-background-color, var(--sc-color-blue-650));
      --select-border: var(--sc-button-primary-select-border-color, var(--sc-color-blue-650));
      --select-text: var(--sc-button-primary-select-text-color, var(--sc-color-white));
      --hover-shadow: 0px 1px 3px 1px rgba(26, 26, 26, 0.15), 0px 1px 2px 0px rgba(26, 26, 26, 0.3);

      &.sc-button-inverse { /* backward compatibility, should remove */
        --default-background: var(--sc-button-primary-inverse-background-color, transparent);
        --default-border: var(--sc-button-primary-inverse-border-color, var(--sc-color-blue-500));
        --default-text: var(--sc-button-primary-inverse-text-color, var(--sc-color-blue-500));
        --hover-background: var(--sc-button-primary-inverse-hover-background-color, var(--sc-color-blue-50));
        --hover-border: var(--sc-button-primary-inverse-hover-border-color, var(--sc-color-blue-500));
        --hover-text: var(--sc-button-primary-inverse-hover-text-color, var(--sc-color-blue-650));
        --press-background: var(--sc-button-primary-inverse-press-background-color, var(--sc-color-blue-650));
        --press-border: var(--sc-button-primary-inverse-press-border-color, var(--sc-color-blue-500));
        --press-text: var(--sc-button-primary-inverse-press-text-color, var(--sc-color-blue-50));
      }

      &.sc-button-state-error {
        --default-background: var(--sc-button-primary-error-background-color, var(--sc-color-red-650));
        --default-border: var(--sc-button-primary-error-border-color, var(--sc-color-red-650));
        --default-text: var(--sc-button-primary-error-text-color, var(--sc-color-white));
        --hover-background: var(--sc-button-primary-error-hover-background-color, var(--sc-color-red-700));
        --hover-border: var(--sc-button-primary-error-hover-border-color, var(--sc-color-red-700));
        --hover-text: var(--sc-button-primary-error-hover-text-color, var(--sc-color-white));
        --press-background: var(--sc-button-primary-error-press-background-color, var(--sc-color-red-750));
        --press-border: var(--sc-button-primary-error-press-border-color, var(--sc-color-red-750));
        --press-text: var(--sc-button-primary-error-press-text-color, var(--sc-color-white));
        --select-background: var(--sc-button-primary-error-select-background-color, var(--sc-color-red-800));
        --select-border: var(--sc-button-primary-error-select-border-color, var(--sc-color-red-800));
        --select-text: var(--sc-button-primary-error-select-text-color, var(--sc-color-white));
      }
      &.sc-button-state-alert {
        --default-background: var(--sc-button-primary-alert-background-color, var(--sc-color-amber-350));
        --default-border: var(--sc-button-primary-alert-border-color, var(--sc-color-amber-350));
        --default-text: var(--sc-button-primary-alert-text-color, var(--sc-color-black));
        --hover-background: var(--sc-button-primary-alert-hover-background-color, var(--sc-color-amber-450));
        --hover-border: var(--sc-button-primary-alert-hover-border-color, var(--sc-color-amber-450));
        --hover-text: var(--sc-button-primary-alert-hover-text-color, var(--sc-color-black));
        --press-background: var(--sc-button-primary-alert-press-background-color, var(--sc-color-amber-500));
        --press-border: var(--sc-button-primary-alert-press-border-color, var(--sc-color-amber-500));
        --press-text: var(--sc-button-primary-alert-press-text-color, var(--sc-color-black));
        --select-background: var(--sc-button-primary-alert-select-background-color, var(--sc-color-amber-550));
        --select-border: var(--sc-button-primary-alert-select-border-color, var(--sc-color-amber-550));
        --select-text: var(--sc-button-primary-alert-select-text-color, var(--sc-color-black));
      }
      &.sc-button-state-success {
        --default-background: var(--sc-button-primary-success-background-color, var(--sc-color-green-650));
        --default-border: var(--sc-button-primary-success-border-color, var(--sc-color-green-650));
        --default-text: var(--sc-button-primary-success-text-color, var(--sc-color-black));
        --hover-background: var(--sc-button-primary-success-hover-background-color, var(--sc-color-green-700));
        --hover-border: var(--sc-button-primary-success-hover-border-color, var(--sc-color-green-700));
        --hover-text: var(--sc-button-primary-success-hover-text-color, var(--sc-color-black));
        --press-background: var(--sc-button-primary-success-press-background-color, var(--sc-color-green-750));
        --press-border: var(--sc-button-primary-success-press-border-color, var(--sc-color-green-750));
        --press-text: var(--sc-button-primary-success-press-text-color, var(--sc-color-black));
        --select-background: var(--sc-button-primary-success-select-background-color, var(--sc-color-green-800));
        --select-border: var(--sc-button-primary-success-select-border-color, var(--sc-color-green-800));
        --select-text: var(--sc-button-primary-success-select-text-color, var(--sc-color-black));
      }
      &.sc-button-disabled {
        cursor: not-allowed;
        --default-background: var(--sc-button-primary-disabled-background-color, var(--sc-color-grey-100));
        --default-border: var(--sc-button-primary-disabled-border-color, var(--sc-color-grey-100));
        --default-text: var(--sc-button-primary-disabled-text-color, var(--sc-color-grey-500));
      }
    }
    &.sc-button-secondary {
      --default-background: var(--sc-button-secondary-background-color, var(--sc-color-white));
      --default-border: var(--sc-button-secondary-border-color, var(--sc-color-grey-200));
      --default-text: var(--sc-button-secondary-text-color, var(--sc-color-blue-900));
      --hover-background: var(--sc-button-secondary-hover-background-color, var(--sc-color-grey-50));
      --hover-border: var(--sc-button-secondary-hover-border-color, var(--sc-color-blue-450));
      --hover-text: var(--sc-button-secondary-hover-text-color, var(--sc-color-blue-450));
      --press-background: var(--sc-button-secondary-press-background-color, var(--sc-color-white));
      --press-border: var(--sc-button-secondary-press-border-color, var(--sc-color-blue-600));
      --press-text: var(--sc-button-secondary-press-text-color, var(--sc-color-blue-600));
      --select-background: var(--sc-button-secondary-select-background-color, var(--sc-color-blue-50));
      --select-border: var(--sc-button-secondary-select-border-color, var(--sc-color-blue-650));
      --select-text: var(--sc-button-secondary-select-text-color, var(--sc-color-blue-650));
      --hover-shadow: 0px 1px 3px 1px rgba(26, 26, 26, 0.15), 0px 1px 2px 0px rgba(26, 26, 26, 0.3);

      &.sc-button-inverse { /* backward compatibility, should remove */
        --default-background: var(--sc-button-secondary-inverse-background-color, transparent);
        --default-border: var(--sc-button-secondary-inverse-border-color, var(--sc-color-white));
        --default-text: var(--sc-button-secondary-inverse-text-color, var(--sc-color-white));
        --hover-background: var(--sc-button-secondary-inverse-hover-background-color, var(--sc-color-white));
        --hover-border: var(--sc-button-secondary-inverse-hover-border-color, var(--sc-color-white));
        --hover-text: var(--sc-button-secondary-inverse-hover-text-color, var(--sc-color-grey-400));
        --press-background: var(--sc-button-secondary-inverse-press-background-color, var(--sc-color-grey-100));
        --press-border: var(--sc-button-secondary-inverse-press-border-color, transparent);
        --press-text: var(--sc-button-secondary-inverse-press-text-color, var(--sc-color-grey-400));
      }

      &.sc-button-state-error {
        --default-background: var(--sc-button-secondary-error-background-color, var(--sc-color-white));
        --default-border: var(--sc-button-secondary-error-border-color, var(--sc-color-red-650));
        --default-text: var(--sc-button-secondary-error-text-color, var(--sc-color-red-650));
        --hover-background: var(--sc-button-secondary-error-hover-background-color, var(--sc-color-red-50));
        --hover-border: var(--sc-button-secondary-error-hover-border-color, var(--sc-color-red-600));
        --hover-text: var(--sc-button-secondary-error-hover-text-color, var(--sc-color-red-750));
        --press-background: var(--sc-button-secondary-error-press-background-color, var(--sc-color-white));
        --press-border: var(--sc-button-secondary-error-press-border-color, var(--sc-color-red-650));
        --press-text: var(--sc-button-secondary-error-press-text-color, var(--sc-color-amber-800));
        --select-background: var(--sc-button-secondary-error-select-background-color, var(--sc-color-red-50));
        --select-border: var(--sc-button-secondary-error-select-border-color, var(--sc-color-red-700));
        --select-text: var(--sc-button-secondary-error-select-text-color, var(--sc-color-red-800));
      }
      &.sc-button-state-alert {
        --default-background: var(--sc-button-secondary-alert-background-color, var(--sc-color-white));
        --default-border: var(--sc-button-secondary-alert-border-color, var(--sc-color-amber-400));
        --default-text: var(--sc-button-secondary-alert-text-color, var(--sc-color-amber-700));
        --hover-background: var(--sc-button-secondary-alert-hover-background-color, var(--sc-color-white));
        --hover-border: var(--sc-button-secondary-alert-hover-border-color, var(--sc-color-amber-450));
        --hover-text: var(--sc-button-secondary-alert-hover-text-color, var(--sc-color-amber-750));
        --press-background: var(--sc-button-secondary-alert-press-background-color, var(--sc-color-white));
        --press-border: var(--sc-button-secondary-alert-press-border-color, var(--sc-color-amber-500));
        --press-text: var(--sc-button-secondary-alert-press-text-color, var(--sc-color-amber-800));
        --select-background: var(--sc-button-secondary-alert-select-background-color, var(--sc-color-amber-50));
        --select-border: var(--sc-button-secondary-alert-select-border-color, var(--sc-color-amber-550));
        --select-text: var(--sc-button-secondary-alert-select-text-color, var(--sc-color-amber-850));
      }
      &.sc-button-state-success {
        --default-background: var(--sc-button-secondary-success-background-color, var(--sc-color-white));
        --default-border: var(--sc-button-secondary-success-border-color, var(--sc-color-green-700));
        --default-text: var(--sc-button-secondary-success-text-color, var(--sc-color-green-700));
        --hover-background: var(--sc-button-secondary-success-hover-background-color, var(--sc-color-white));
        --hover-border: var(--sc-button-secondary-success-hover-border-color, var(--sc-color-green-750));
        --hover-text: var(--sc-button-secondary-success-hover-text-color, var(--sc-color-green-750));
        --press-background: var(--sc-button-secondary-success-press-background-color, var(--sc-color-white));
        --press-border: var(--sc-button-secondary-success-press-border-color, var(--sc-color-green-800));
        --press-text: var(--sc-button-secondary-success-press-text-color, var(--sc-color-green-800));
        --select-background: var(--sc-button-secondary-success-select-background-color, var(--sc-color-green-50));
        --select-border: var(--sc-button-secondary-success-select-border-color, var(--sc-color-green-850));
        --select-text: var(--sc-button-secondary-success-select-text-color, var(--sc-color-green-850));
      }
      &.sc-button-disabled {
        cursor: not-allowed;
        --default-background: var(--sc-button-secondary-disabled-background-color, var(--sc-color-grey-100));
        --default-border: var(--sc-button-secondary-disabled-border-color, var(--sc-color-grey-200));
        --default-text: var(--sc-button-secondary-disabled-text-color, var(--sc-color-grey-500));
      }
    }
    &.sc-button-text {
      --default-background: var(--sc-button-text-background-color, transparent);
      --default-border: var(--sc-button-text-border-color, transparent);
      --default-text: var(--sc-button-text-text-color, var(--sc-color-blue-850));
      --hover-background: var(--sc-button-text-hover-background-color, var(--sc-color-blue-50));
      --hover-border: var(--sc-button-text-hover-border-color, transparent);
      --hover-text: var(--sc-button-text-hover-text-color, var(--sc-color-blue-450));
      --press-background: var(--sc-button-text-press-background-color, var(--sc-color-blue-100));
      --press-border: var(--sc-button-text-press-border-color, transparent);
      --press-text: var(--sc-button-text-press-text-color, var(--sc-color-blue-600));
      --select-background: var(--sc-button-text-select-background-color, var(--sc-color-blue-50));
      --select-border: var(--sc-button-text-select-border-color, transparent);
      --select-text: var(--sc-button-text-select-text-color, var(--sc-color-blue-650));

      &.sc-button-state-error {
        --default-background: var(--sc-button-text-error-background-color, transparent);
        --default-border: var(--sc-button-text-error-border-color, transparent);
        --default-text: var(--sc-button-text-error-text-color, var(--sc-color-red-650));
        --hover-background: var(--sc-button-text-error-hover-background-color, var(--sc-color-red-50));
        --hover-border: var(--sc-button-text-error-hover-border-color, transparent);
        --hover-text: var(--sc-button-text-error-hover-text-color, var(--sc-color-red-700));
        --press-background: var(--sc-button-text-error-press-background-color, var(--sc-color-red-100));
        --press-border: var(--sc-button-text-error-press-border-color, transparent);
        --press-text: var(--sc-button-text-error-press-text-color, var(--sc-color-red-750));
        --select-background: var(--sc-button-text-error-select-background-color, var(--sc-color-red-50));
        --select-border: var(--sc-button-text-error-select-border-color, transparent);
        --select-text: var(--sc-button-text-error-select-text-color, var(--sc-color-red-800));
      }
      &.sc-button-state-alert {
        --default-background: var(--sc-button-text-alert-background-color, transparent);
        --default-border: var(--sc-button-text-alert-border-color, transparent);
        --default-text: var(--sc-button-text-alert-text-color, var(--sc-color-amber-700));
        --hover-background: var(--sc-button-text-alert-hover-background-color, var(--sc-color-amber-50));
        --hover-border: var(--sc-button-text-alert-hover-border-color, transparent);
        --hover-text: var(--sc-button-text-alert-hover-text-color, var(--sc-color-amber-750));
        --press-background: var(--sc-button-text-alert-press-background-color, var(--sc-color-amber-100));
        --press-border: var(--sc-button-text-alert-press-border-color, transparent);
        --press-text: var(--sc-button-text-alert-press-text-color, var(--sc-color-amber-800));
        --select-background: var(--sc-button-text-alert-select-background-color, var(--sc-color-amber-50));
        --select-border: var(--sc-button-text-alert-select-border-color, transparent);
        --select-text: var(--sc-button-text-alert-select-text-color, var(--sc-color-amber-850));
      }
      &.sc-button-state-success {
        --default-background: var(--sc-button-text-success-background-color, transparent);
        --default-border: var(--sc-button-text-success-border-color, transparent);
        --default-text: var(--sc-button-text-success-text-color, var(--sc-color-green-700));
        --hover-background: var(--sc-button-text-success-hover-background-color, var(--sc-color-green-50));
        --hover-border: var(--sc-button-text-success-hover-border-color, transparent);
        --hover-text: var(--sc-button-text-success-hover-text-color, var(--sc-color-green-750));
        --press-background: var(--sc-button-text-success-press-background-color, var(--sc-color-green-100));
        --press-border: var(--sc-button-text-success-press-border-color, transparent);
        --press-text: var(--sc-button-text-success-press-text-color, var(--sc-color-green-850));
        --select-background: var(--sc-button-text-success-select-background-color, var(--sc-color-green-50));
        --select-border: var(--sc-button-text-success-select-border-color, transparent);
        --select-text: var(--sc-button-text-success-select-text-color, var(--sc-color-green-850));
      }
      &.sc-button-disabled {
        cursor: not-allowed;
        --default-background: var(--sc-button-text-disabled-background-color, transparent);
        --default-border: var(--sc-button-text-disabled-border-color, transparent);
        --default-text: var(--sc-button-text-disabled-text-color, var(--sc-color-grey-400));
      }
    }
    &.sc-button-link {
      --default-background: var(--sc-button-link-background-color, transparent);
      --default-border: var(--sc-button-link-border-color, transparent);
      --default-text: var(--sc-button-link-text-color, var(--sc-color-blue-500));
      --hover-background: var(--sc-button-link-hover-background-color, transparent);
      --hover-border: var(--sc-button-link-hover-border-color, transparent);
      --hover-text: var(--sc-button-link-hover-text-color, var(--sc-color-blue-450));
      --press-background: var(--sc-button-link-press-background-color, transparent);
      --press-border: var(--sc-button-link-press-border-color, transparent);
      --press-text: var(--sc-button-link-press-text-color, var(--sc-color-blue-600));
      --select-background: var(--sc-button-link-select-background-color, transparent);
      --select-border: var(--sc-button-link-select-border-color, transparent);
      --select-text: var(--sc-button-link-select-text-color, var(--sc-color-blue-650));

      &.sc-button-state-error {
        --default-background: var(--sc-button-link-error-background-color, transparent);
        --default-border: var(--sc-button-link-error-border-color, transparent);
        --default-text: var(--sc-button-link-error-text-color, var(--sc-color-red-650));
        --hover-background: var(--sc-button-link-error-hover-background-color, transparent);
        --hover-border: var(--sc-button-link-error-hover-border-color, transparent);
        --hover-text: var(--sc-button-link-error-hover-text-color, var(--sc-color-red-700));
        --press-background: var(--sc-button-link-error-press-background-color, transparent);
        --press-border: var(--sc-button-link-error-press-border-color, transparent);
        --press-text: var(--sc-button-link-error-press-text-color, var(--sc-color-red-750));
        --select-background: var(--sc-button-link-error-select-background-color, transparent);
        --select-border: var(--sc-button-link-error-select-border-color, transparent);
        --select-text: var(--sc-button-link-error-select-text-color, var(--sc-color-red-800));
      }
      &.sc-button-state-alert {
        --default-background: var(--sc-button-link-alert-background-color, transparent);
        --default-border: var(--sc-button-link-alert-border-color, transparent);
        --default-text: var(--sc-button-link-alert-text-color, var(--sc-color-amber-600));
        --hover-background: var(--sc-button-link-alert-hover-background-color, transparent);
        --hover-border: var(--sc-button-link-alert-hover-border-color, transparent);
        --hover-text: var(--sc-button-link-alert-hover-text-color, var(--sc-color-amber-750));
        --press-background: var(--sc-button-link-alert-press-background-color, transparent);
        --press-border: var(--sc-button-link-alert-press-border-color, transparent);
        --press-text: var(--sc-button-link-alert-press-text-color, var(--sc-color-amber-800));
        --select-background: var(--sc-button-link-alert-select-background-color, transparent);
        --select-border: var(--sc-button-link-alert-select-border-color, transparent);
        --select-text: var(--sc-button-link-alert-select-text-color, var(--sc-color-amber-850));
      }
      &.sc-button-state-success {
        --default-background: var(--sc-button-link-success-background-color, transparent);
        --default-border: var(--sc-button-link-success-border-color, transparent);
        --default-text: var(--sc-button-link-success-text-color, var(--sc-color-green-700));
        --hover-background: var(--sc-button-link-success-hover-background-color, transparent);
        --hover-border: var(--sc-button-link-success-hover-border-color, transparent);
        --hover-text: var(--sc-button-link-success-hover-text-color, var(--sc-color-green-750));
        --press-background: var(--sc-button-link-success-press-background-color, transparent);
        --press-border: var(--sc-button-link-success-press-border-color, transparent);
        --press-text: var(--sc-button-link-success-press-text-color, var(--sc-color-green-800));
        --select-background: var(--sc-button-link-success-select-background-color, transparent);
        --select-border: var(--sc-button-link-success-select-border-color, transparent);
        --select-text: var(--sc-button-link-success-select-text-color, var(--sc-color-green-850));
      }
      &.sc-button-disabled {
        cursor: not-allowed;
        --default-background: var(--sc-button-link-disabled-background-color, transparent);
        --default-border: var(--sc-button-link-disabled-border-color, transparent);
        --default-text: var(--sc-button-link-disabled-text-color, var(--sc-color-grey-400));
        --sc-spinner-indicator-color: var(--sc-button-primary-disabled-text-color, var(--sc-color-grey-250));
      }
    }
  }


  /* Basic padding */  
  .sc-button::part(base) {
    width: var(--sc-button-width, var(--sc-button-self-width, auto));
    margin-left: var(--sc-button-margin-left, 0px);
    margin-right: var(--sc-button-margin-right, 0px);
    font-family: inherit;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  .sc-button::part(base) {
    padding: var(--sc-button-padding-md, 0.25rem 1rem);
    height: var(--sc-button-height-md, 2.5rem);
    font-size: var(--sc-button-font-size-md, 1rem); 
    border-radius: var(--sc-button-border-radius-md, 0.38rem);
  }

  .sc-button.sc-button-size-lg::part(base) {
    padding: var(--sc-button-padding-lg, 0.5rem 1rem);
    height: var(--sc-button-height-lg, 3rem);
    min-height: inherit;
    font-size: var(--icon-button-font-size-lg, 1.375rem);
  }
  .sc-button.sc-icon-button.sc-button-size-lg::part(base) {
    padding: var(--icon-button-padding-lg, 0.25rem);
    width: var(--icon-button-width-lg, 3rem); 
    height: var(--icon-button-height-lg, 3rem); 
    min-height: inherit;
    font-size: var(--sc-button-font-size-lg, 1rem);  
  }

  .sc-button.sc-button-size-md::part(base) {
    padding: var(--sc-button-padding-md, 0.25rem 1rem);
    height: var(--sc-button-height-md, 2.5rem);
    min-height: inherit;
    font-size: var(--sc-button-font-size-md, 1rem);
  }
  .sc-button.sc-icon-button.sc-button-size-md::part(base) {
    padding: var(--icon-button-padding-md, 0.25rem);
    width: var(--icon-button-width-md, 2.5rem); 
    height: var(--icon-button-height-md, 2.5rem); 
    font-size: var(--sc-button-font-size-md, 1.25rem);  
  }

  .sc-button.sc-button-size-sm::part(base) {
    padding: var(--sc-button-padding-sm, 0.25rem 1rem);
    height: var(--sc-button-height-sm, 2rem);
    min-height: inherit;
    font-size: var(--icon-button-font-size-sm, 0.875rem);
  }

  .sc-button.sc-button-size-sm::part(prefix) {
    display: contents;
  }

  .sc-button.sc-icon-button.sc-button-size-sm::part(base) {
    padding: var(--icon-button-padding-sm, 0.25rem);
    width: var(--icon-button-width-sm, 2rem); 
    height: var(--icon-button-height-sm, 2rem); 
    min-height: inherit;
    font-size: var(--sc-button-font-size-sm, 1rem);  
  }

  .sc-button.sc-button-size-xs::part(base) {
    padding: var(--sc-button-padding-xs, 0.25rem 0.5rem);
    height: var(--sc-button-height-xs, 1.75rem);
    min-height: inherit;
    font-size: var(--icon-button-font-size-xs, 0.75rem);
  }
  .sc-button.sc-icon-button.sc-button-size-xs::part(base) {
    padding: var(--icon-button-padding-xs, 0.25rem);
    width: var(--icon-button-width-xs, 1.75rem); 
    height: var(--icon-button-height-xs, 1.75rem); 
    min-height: inherit;
    font-size: var(--sc-button-font-size-xs, 0.75rem);  
  }
  .sc-button.sc-button-size-xxs::part(base) {
    padding: var(--sc-button-padding-xxs, 0.25rem 0.5rem);
    height: var(--sc-button-height-xxs, 1.5rem);
    min-height: inherit;
    font-size: var(--icon-button-font-size-xxs, 0.75rem);
  }
  .sc-button.sc-icon-button.sc-button-size-xxs::part(base) {
    padding: var(--icon-button-padding-xxs, 0.25rem);
    width: var(--icon-button-width-xxs, 1.5rem); 
    height: var(--icon-button-height-xxs, 1.5rem); 
    min-height: inherit;
    font-size: var(--sc-button-font-size-xxs, 0.75rem);  
  }
  /*
  .sc-button,
  .sc-button::part(label) {
    line-height: var(--icon-button-label-line-height-md, 1.375rem);
  }
  .sc-button.sc-button-size-lg,
  .sc-button.sc-button-size-lg::part(label) {
    line-height: var(--icon-button-label-line-height-lg, 2.375rem);
  }
  .sc-button.sc-button-size-md,
  .sc-button.sc-button-size-md::part(label) {
    line-height: var(--icon-button-label-line-height-md, 1.375rem);
  }
  .sc-button.sc-button-size-sm,
  .sc-button.sc-button-size-sm::part(label) {
    line-height: var(--icon-button-label-line-height-sm, 1.375rem);
  }
  .sc-button.sc-button-size-xs,
  .sc-button.sc-button-size-xs::part(label) {
    line-height: var(--icon-button-label-line-height-xs, 1.25rem);
  }
  .sc-button.sc-button-size-xxs,
  .sc-button.sc-button-size-xxs::part(label) {
    line-height: var(--icon-button-label-line-height-xxs, 1rem);
  } */
  
  /* Add snack line */
  .sc-button.sc-button-snack, .sc-button.sc-button-snack::part(label) {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sc-button.sc-button-snack:not(.sc-button-disabled):not(.sc-button-inverse):not(.sc-button-fill)::part(base) {
    position: relative;
    border: none;
    color: var(--sc-color-blue-250);
    height: 100%;
    padding-left: 12px;
    padding-right: 0px;
  }
  .sc-button.sc-button-snack:not(.sc-button-disabled):not(.sc-button-inverse):not(.sc-button-fill)::part(base)::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 1px;
    background-color: white;
  };
`;
