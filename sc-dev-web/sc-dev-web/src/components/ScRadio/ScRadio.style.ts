import { css } from 'lit';

export default css`
  :host {
    --sl-input-font-size-medium: 0.875rem;
    --sl-toggle-size-medium: 1rem;
  }
  .radio-wrapper {
    position: relative;
  }

  .radio-wrapper.horizontal {
    margin: 0 1.5rem 0.5rem 0rem;
  }

  .radio-wrapper.horizontal.sc-radio-flex {
    margin: 0 0 0.25rem 0;
  }

  .horizontal slot {
    display: flex;
    flex-wrap: wrap;
  }

  .radio-wrapper .background-cover {
    left: -0.625rem;
    padding-right: 1.25rem;
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: .625rem;
    background: var(
      --sc-radio-before-highlighted-background-color,
      var(--sc-color-blue-lightest)
    );
  }

  .sc-radio::part(base) {
    font-family: inherit;
    display: flex;
    align-items: center;
  }

  .sc-radio::part(label) {
    color: var(--sc-radio-font-color, var(--sc-color-blue-900));
  }

  .sc-radio[disabled]::part(base) {
    opacity: 1;
  }

  .sc-radio::part(control) {
    border: 1px solid var(
      --sc-radio-default-border-color, 
      var(--sc-color-grey-150)
    );
    background: var(
      --sc-radio-highlighted-default-background-color,
      var(--sc-color-white)
    );
    outline: none;
    box-shadow: none; 
  }

  .sc-radio:focus-visible::part(control) {
    box-shadow: 0 0 0 1px var(--sc-radio-inner-focused-color, var(--sc-color-white)),
    0 0 0 .25rem var(--sc-radio-outer-focused-color, var(--sc-color-blue-light));
  }

  .sc-radio::part(control--checked) {
    background: var(
      --sc-radio-highlighted-checked-background-color,
      var(--sc-color-white)
    );
    border: 1px solid var(--sc-radio-checked-border-color, var(--sc-color-blue-500));
  }
  
  .sc-radio::part(control--checked)::before {
    content: ''; 
    position: absolute;
    width: 50%; 
    height: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); 
    background-color: var(--sc-radio-checked-background-color, var(--sc-color-blue-500));
    border-radius: 50%; 
  }
  
  .sc-radio[error]::part(control) {
    border: 1px solid var(--sc-radio-error-color, var(--sc-color-red-300));
  }
  
  .sc-radio[error]::part(control--checked) {
    border: 1px solid var(--sc-radio-error-color, var(--sc-color-red-300)); 
  }
  
  .sc-radio[error]::part(control--checked)::before {
    content: ''; 
    position: absolute;
    width: 50%; 
    height: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); 
    background-color: var(--sc-radio-error-background-color, var(--sc-color-red-300));
    border-radius: 50%; 
  }
  
  .sc-radio[disabled]::part(label) {
    color: var(--sc-radio-disabled-font-color, var(--sc-color-grey-150));
  }

  .sc-radio[disabled]::part(control) {
    background: var(
      --sc-radio-disabled-background-color,
      var(--sc-color-grey-100)
    );
    border: 1px solid
      var(--sc-radio-disabled-border-color, var(--sc-color-grey-150));
  }
  
  .sc-radio[disabled]::part(control--checked)::before {
    content: ''; 
    position: absolute;
    width: 50%; 
    height: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); 
    background-color: var(--sc-radio-before-disabled-background-color, 
      var(--sc-color-grey-300));
    border-radius: 50%; 
  }

  .sc-radio {
    z-index: 2;
    position: relative;
    display: flex;
  }

  .sc-radio-help-text {
    font-size: .625rem;
    line-height: 0.75rem;
    color: var(--sc-radio-help-text-color, var(--sc-color-grey-600));
  }

  .sc-radio-help-text.horizontal {
    position: absolute; 
    margin-top: 4px;
  }

  .sc-radio-help-text.error {
    font-size: .625rem;
    color: var(--sc-radio-help-text-error-color, var(--sc-color-red-300));
  }
  
  .sc-form-group .help-message {
    color: var(--sc-radio-group-help-text-color, var(--sc-color-grey-600)) !important;
  }

  .sc-form-group-icon {
    display: none;
  }

  .sc-radio-group:not(.horizontal) ::slotted(sc-radio:not(:last-child)) {
    display: block;
    margin-bottom: 0.5rem;
  }

  .box.sc-form-group-readonly .sc-form-control{
    line-height:1rem;
    padding:0;
  }
`;
