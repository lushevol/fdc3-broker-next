import { css } from 'lit';

export default css`
  :host {
    box-sizing: border-box;
    display: block;
    
    --sc-focus-ring-color: var(--sc-switch-focus-ring-color, var(--sc-color-blue-250));
    --sc-focus-ring-style: solid;
    --sc-focus-ring-width: 0.1875rem;
    --sc-focus-ring: var(--sc-focus-ring-style) var(--sc-focus-ring-width) var(--sc-focus-ring-color);
    --sc-focus-ring-offset: 1px;
    
    --sc-input-required-content: "*";
    --sc-input-required-content-offset: 0.25rem;
    --sc-input-icon-top: 0.1875rem;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  .switch {
    --height: var(--sc-toggle-size);
    --thumb-size: calc(var(--sc-toggle-size) - 0.375rem);
    --width: calc(var(--height) * 1.5 + 0.25rem);
    position: relative;
    display: inline-flex;
    align-items: center;
    color: var(--sc-switch-label-color, var(--sc-color-blue-900));
    vertical-align: middle;
    cursor: pointer;
  }

  .switch__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    background-color: var(--sc-switch-background-color, var(--sc-color-grey-300));
    border: none;
    border-radius: calc(var(--height) / 2);
    transition:
      var(--sc-transition-fast) background-color;
  }

  .switch__control .switch__thumb {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--sc-switch-thumb-background-color, var(--sc-color-white));
    border-radius: 50%;
    border: none;
    translate: calc((var(--width) - var(--height)) / -2);
    transition:
      var(--sc-transition-fast) translate ease,
      var(--sc-transition-fast) background-color,
      var(--sc-transition-fast) box-shadow;
  }
  
  .switch:not(.switch--checked).switch--disabled .switch__control {
    background-color: var(--sc-switch-disabled-background-color, var(--sc-color-grey-150));
  }
  .switch:not(.switch--checked).switch--disabled .switch__control .switch__thumb {
    background-color: var(--sc-switch-thumb-disabled-background-color, var(--sc-color-white));
  }

  .switch__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Focus */
  .switch:not(.switch--checked):not(.switch--disabled) .switch__input:focus-visible ~ .switch__control {
    background-color: var(--sc-switch-background-color, var(--sc-color-grey-300));
    outline: 1px solid var(--sc-focus-ring-color, var(--sc-color-blue-250));
  }

  /* Checked */
  .switch--checked .switch__control {
    background-color: var(--sc-switch-checked-background-color, var(--sc-color-blue-500));
  }

  .switch--checked .switch__control .switch__thumb {
    background-color: var(--sc-switch-thumb-background-color, var(--sc-color-white));
    translate: calc((var(--width) - var(--height)) / 2);
  }

  /* Checked + focus */
  .switch.switch--checked:not(.switch--disabled) .switch__input:focus-visible ~ .switch__control {
    background-color: var(--sc-switch-focus-background-color, var(--sc-color-blue-500));
    outline: 1px solid var(--sc-focus-ring-color, var(--sc-color-blue-250));
  }

  /* Checked + loading */
  .switch.switch--checked.switch--loading .switch__control {
    background-color: var(--sc-switch-loading-checked-background-color, var(--sc-color-blue-200));
    .sc-switch-spinner {
      border-top-color: var(--sc-switch-loading-checked-spinner-color, var(--sc-color-blue-200));
    }
  }

  /* Checked + disabled */
  .switch.switch--checked.switch--disabled .switch__control {
    background-color: var(--sc-switch-checked-disabled-background-color, var(--sc-color-blue-200));
  }

  /* Disabled */
  .switch--disabled {
    cursor: not-allowed;
  }

  .sc-switch-label {
    font-size: 0.875rem;
    line-height: var(--height);
    user-select: none;
    -webkit-user-select: none;
  }

  .sc-switch-label.label-right {
    display: inline-block;
    margin-inline-start: 0.5em;
  }

  .sc-switch-label.label-top {
    display: block;
  }

  :host([required]) .sc-switch-label::after {
    content: var(--sc-input-required-content);
    margin-inline-start: var(--sc-input-required-content-offset);
    color: var(--sc-switch-required-content-color, var(--sc-color-red-500));
  }

  .sc-form-group .help-message {
    display:block;
  }

  .sc-form-group .help-message.label-right {
    margin-top: 0.25rem;
  }
  .sc-form-group .help-message.hide {
    margin-top: 0;
  }

  @media (forced-colors: active) {
    .switch.switch--checked:not(.switch--disabled) .switch__control:hover .switch__thumb,
    .switch--checked .switch__control .switch__thumb {
      background-color: ButtonText;
    }
  }

  .sc-switch-label {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    color: var(--sc-switch-text-label-color, var(--sc-color-white));
    pointer-events: none;
  }

  .sc-switch-label-text {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host([text-icon-label='text-label']) .switch {
    --width: 3rem;
  }

  .sc-switch-label-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
  }

  :host([text-icon-label='icon-label']) .switch {
    --width: 2.75rem;
  }
  
  .sc-switch-spinner {
    position: absolute;
    width: calc(var(--thumb-size, 1.5rem) - 0.125rem);
    height: calc(var(--thumb-size, 1.5rem) - 0.125rem);
    border: 1px solid transparent;
    border-top-color: var(--sc-switch-loading-spinner-color, var(--sc-color-grey-150));
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
    box-sizing: border-box;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
