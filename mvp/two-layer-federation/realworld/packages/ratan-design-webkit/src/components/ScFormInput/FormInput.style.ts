import { html } from 'lit';

export const formGroupStyle = html`
  <style>
    :host {
      --sc-input-icon-top: 0.6875rem;
    }

    .box:not(.sc-form-group-readonly) {
      --sc-form-input-padding-top: 0.25rem;
      --sc-form-input-padding-bottom: 0.25rem;
      --sc-form-input-padding-left: 0.75rem;
      --sc-form-input-padding-right: 0.75rem;
      --sc-form-input-prefix-padding-left: 0.75rem;
      --sc-form-input-border: 1px solid var(--sc-form-input-border-color, var(--sc-color-grey-150));
      --sc-form-input-border-radius: 
        var(--sc-group-form-input-border-radius-size, 0.375rem);
      --sc-form-input-error-border: 1px solid
        var(--sc-form-input-error-border-color, var(--sc-color-red-500));
      --sc-form-input-success-border: 1px solid
        var(--sc-form-input-success-border-color, var(--sc-color-green-700));
    }
    
    .sc-form-group {
      color: var(--sc-form-input-color, var(--sc-color-grey-650));
      position: relative;
    }

    .sc-form-group-main-context.label-left {
      display: flex;
      position: relative;
    }

    .sc-form-group-main-context.label-right {
      display: flex;
      flex-direction: row-reverse;
      position: relative;
    }

    .sc-form-group-main-context.label-left .sc-form-group-label {
      margin-right: 0.625rem;
      margin-bottom: 0;
    }

    .sc-form-group:not(.no-label) .sc-form-group-main-context.label-right .sc-form-group-label {
      flex-grow: 1;
      margin-left: 0.625rem;
      margin-top: 1px;
      margin-bottom: 0;
    }
    .sc-form-group-main-context .sc-form-group-label {
      min-width: 0;
    }

    .sc-form-group-input {
      position: relative;
      /**min-height: var(--sc-form-group-input-min-height, 42px); */ 
    }

    .label-right .sc-form-group-input, .label-left .sc-form-group-input {
      position: initial;
      --sc-form-input-padding-right: -1.5625rem;
    }

    .sc-form-group-label {
      line-height: 1.25rem;
      font-family: inherit;
    }

    .sc-form-group-sm .sc-form-group-label {
      line-height: 1.125rem;
    }

    .sc-form-group-lg .sc-form-group-label {
      line-height: 1.375rem;
    }

    .sc-form-group-label .required {
      color: var(--sc-form-group-label-required-color, var(--sc-color-red-500));
      margin-left: 0.625rem;
    }

    .sc-form-control {
      outline: none;
      width: 100%;
      line-height: 1.375rem;
      /* padding: 0.25rem 0.75rem; */
      padding: var(--sc-form-input-padding-top, 0.25rem) 
        var(--sc-form-input-padding-right, 0) 
        var(--sc-form-input-padding-bottom, 0.25rem) 
        var(--sc-form-input-padding-left, 0);
      font-size: 0.875rem;
      border: 1px solid var(--sc-form-control-border-color, var(--sc-color-grey-150));
      background: var(
        --sc-form-control-background-color,
        var(--sc-color-white)
      );
      color: var(--sc-form-control-color, var(--sc-color-blue-900));
      caret-color: var(--sc-form-control-color, var(--sc-color-blue-900));
      font-family: var(--sc-form-control-font-family, inherit);      
      height: var(--sc-spacing-32, 2rem);
      box-sizing: border-box;
      border-radius: var(--sc-form-input-border-radius, 0.375rem);
    }

    :not(.sc-form-group-disabled) .sc-form-control,
    :not(.sc-form-group-readonly) .sc-form-control {
      border: var(--sc-form-input-border, 1px solid transparent);
      border-bottom: 1px solid
        var(--sc-form-input-border-color, var(--sc-color-grey-150));
      border-radius: var(--sc-form-input-border-radius, none);
      padding: var(--sc-form-input-padding-top, 0.25rem) 
        var(--sc-form-input-padding-right, 0) 
        var(--sc-form-input-padding-bottom, 0.25rem) 
        var(--sc-form-input-padding-left, 0);
    }
    
    .sc-form-group-right .sc-form-control {
      text-align: right;
    }

    .sc-form-group-sm .sc-form-control {
      height: var(--sc-spacing-24, 1.5rem);
      padding: 1px 0.75rem;
      font-size: 0.75rem;
      line-height: 1.25rem;
    }

    .sc-form-group-lg .sc-form-control {
      height: var(--sc-spacing-40, 2.5rem);
      padding: 0.43rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5rem;
    }

    .sc-form-control::-ms-reveal {
      display: none;
    }

    .box:not(.sc-form-group-disabled) .sc-form-control:focus {
      outline: none;
      border: var(--sc-form-input-border, 1px solid transparent);
      border-bottom: var(--sc-form-input-border, 
        1px solid var(--sc-form-input-focus-border-color, var(--sc-color-blue-500)));
      border-color: var(--sc-form-input-focus-border-color, var(--sc-color-blue-500));
    }
    
    .box.sc-form-group.focus:not(.sc-form-group-disabled) .sc-form-control:focus {
      outline: 2px solid var(--sc-form-input-focus-outline-color, var(--sc-color-blue-100));
    }

    .box .sc-form-group-input:hover .sc-form-control {
      border-color: var(--sc-form-input-focus-border-color, var(--sc-color-blue-500));
    }

    .box.sc-form-group-disabled .sc-form-group-input:hover .sc-form-control, .box.sc-form-group-readonly .sc-form-group-input:hover .sc-form-control {
      border-color: var(--sc-form-control-border-color, var(--sc-color-grey-150));
    }

    .line:not(.sc-form-group-disabled) .sc-form-control:focus {
      border: var(--sc-form-input-border, 1px solid transparent);
      border-bottom: var(--sc-form-input-border, 
        1px solid var(--sc-form-input-focus-border-color, var(--sc-color-blue-500)));
    }

    .sc-form-control:placeholder {
      color: var(--sc-form-control-placeholder-color, var(--sc-color-grey-50));
    }

    .sc-form-group-description {
      display: flex;
      /* Please don't move it, previosly the error message has 4px margin top even no content, now remove the error message marggin top but make sure there is still 4px spacing */
      min-height: var(--sc-form-group-description-min-height, var(--sc-form-group-help-margin-top, 0.25rem));
    }
      
    .help-message, .error-message, .success-message {
      margin-top: var(--sc-form-group-help-margin-top, 0.25rem);
      font-size: .625rem;
      color: var(--sc-form-group-help-color, var(--sc-color-grey-600));
      &.hide {
        display: none;
      }
    }

    .error-message {
      color: var(--sc-form-group-error-color, var(--sc-color-red-500));
    }

    .sc-form-group-lg .error-message, .sc-form-group-lg .help-message{
      font-size: 0.75rem;
    }

    .sc-form-group-error .sc-form-control {
      border: var(--sc-form-input-error-border, var(--sc-form-input-border, 1px solid transparent));
      border-bottom: 1px solid var(--sc-form-input-error-border-color, var(--sc-color-red-500));
    }

    :host-context(sc-input-group) .sc-form-group-error .sc-form-control {
      border-color: var(--sc-input-group-item-border-color, var(--sc-form-input-error-border-color, var(--sc-color-red-500)) var(--sc-form-control-border-color, var(--sc-color-grey-150)));
    }

    .sc-form-group-error .sc-form-group-icon {
      color: var(--sc-form-group-error-color, var(--sc-color-red-500));
    }

    [part='input-group'] {
      line-height: 1;
    }

    .success-message {
      color: var(--sc-form-group-success-color, var(--sc-color-green-700));
    }

    .sc-form-group-success .sc-form-control {
      border: var(--sc-form-input-success-border, var(--sc-form-input-border, 1px solid transparent));
      border-bottom: var(--sc-form-input-success-border, 
        var(--sc-form-input-border, 1px solid var(--sc-form-input-success-border-color, var(--sc-color-green-700))));
    }

    .sc-form-group-success .sc-form-group-icon {
      color: var(--sc-form-group-success-color, var(--sc-color-green-700));
    }

    .sc-form-group-readonly .sc-form-control {
      border: none;
      resize: none;
      background-color: transparent;
      line-height: 100%;
      padding-top: 1.5px;
    }

    .sc-form-group-readonly .sc-form-group-input {
      margin-left: var(--sc-form-readonly-margin-left, -0.75rem);
    }

    .sc-form-group-readonly-max-rows .sc-form-control {
      height: auto;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      white-space: normal;
      overflow-wrap: anywhere;
      word-break: break-word;
      text-overflow: ellipsis;
    }

    .expand-button {
      display: inline-block;
    }

    .sc-form-group-disabled .sc-form-control {
      cursor: not-allowed;
      color: var(--sc-form-disabled-input-text-color, var(--sc-color-grey-400));
      border-bottom: 1px solid var(--sc-form-disabled-input-border-color, var(var(--sc-color-grey-150)));
      background-color: var(--sc-form-disabled-input-background-color, var(--sc-color-grey-50));
    }    

    .sc-form-group-disabled .sc-form-control input::placeholder {
      color: var(--sc-form-disabled-input-text-color, var(--sc-color-grey-400));
    }

    .sc-form-group-icon, .sc-form-prefix-icon, .sc-form-more-icons {
      display: flex;
      position: absolute;
      right: var(--sc-form-input-padding-right, 0.75rem);
      top: 1px;
      height: calc(100% - 2px);
      z-index: 2;
    }
    .sc-form-more-icons .clear sc-icon {
      cursor: pointer;
    }
    .sc-form-more-icons > div {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .sc-form-more-icons .clear {
      display: flex;
      align-items: center;
      color: var(--sc-form-input-clear-icon-color, var(--sc-color-grey-150));
    }
    
    .sc-form-prefix-icon {
      color: var(--sc-form-input-prefix-icon, --sc-color-grey-500);
      width: max-content;
      left: var(--sc-form-input-prefix-padding-left, 0.75rem);
    } 
    .sc-form-more-icons {
      color: var(--sc-color-blue-500);
    }
    .sc-form-more-icons sc-icon {
      padding-left: 0.5rem;
      vertical-align: middle;
    }
    .sc-form-prefix-icon sc-icon {
      padding-right: 0.5rem;
      vertical-align: middle;
    }
    
    .sc-form-group-disabled .sc-form-prefix-icon {
      color: var(--sc-color-grey-400);
    } 
    .sc-form-group-disabled .sc-form-more-icons {
      color: var(--sc-color-grey-400);
    } 
    
    
    .sc-form-suffix-icon {
      color: var(--sc-card-number-suffix-icon-color, var(--sc-color-green-500));
    }

    .sc-form-group-success .sc-form-more-icons, .sc-form-group-error .sc-form-more-icons {
      /**right: calc(var(--sc-form-input-padding-right, 0.5rem) + 30px); */ 
      cursor: pointer;
    }
    
  </style>
`;

export const activeInputStyle = html`
  <style>
    .sc-form-group-input .form-control {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    .sc-form-group-input .form-control::after {
      content: '';
      display: none;
      position: absolute;
      width: 100%;
      bottom: -0.5px;
      height: 1px;
      background: var(
        --sc-form-input-active-shadow-color,
        rgba(0, 122, 255, 0.25)
      );
      left: 0;
      position: absolute;
      order: 2;
      box-shadow: 0px 1px 0px 1px
          var(--sc-form-input-active-shadow-color, rgba(0, 122, 255, 0.25)),
        0px -1px 0px 1px var(--sc-form-input-active-shadow-color, rgba(0, 122, 255, 0.25));
    }
  </style>
`;

export const focusInputStyle = html`
  <style>
    :host {
      --sc-form-input-color: var(--sc-form-input-focus-border-color, var(--sc-color-blue-500));
    }    
  </style>
`;
