import { css } from 'lit';

export default css`
  :host {
    --sc-input-icon-top: 0.625rem;
    --sc-checkbox-inner-display: inline-flex;
  }
  
  .sc-checkbox.horizontal {
    margin: 0 1.5rem 0.4rem 0rem;
  }

  .sc-checkbox-readonly {
    margin-left: 0.75rem;
    font-size: 0.875rem;
    padding: 0.5625rem 0;
  }

  .sc-checkbox::part(base) {
    font-family: inherit;
    vertical-align: top;
    width: 100%;
  }

  .sc-checkbox::part(label) {
    color: var(--sc-checkbox-font-color, var(--sc-color-blue-900));
    margin-top: -1px;
    line-height: 1rem;
    width: var(--sc-checkbox-label-width, auto);
    flex: 1;
    width: var(--sc-checkbox-label-width, auto);
  }
  .sc-checkbox.sc-truncate::part(label) {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sc-checkbox::part(control) {
    border: 1px solid
      var(--sc-checkbox-default-border-color, var(--sc-color-grey-300));
    background: var(
      --sc-checkbox-default-background-color,
      var(--sc-color-white)
    );
    border-radius: 3px;
    width: 1rem;
    height: 1rem;
    display: var(--sc-checkbox-inner-display)
  }

  .sc-checkbox::part(control--checked) {
    background: var(
      --sc-checkbox-checked-background-color,
      var(--sc-color-blue-500)
    );
    border: 1px solid
      var(--sc-checkbox-checked-border-color, var(--sc-color-blue-500));
  }
  

  .sc-checkbox[disabled]::part(control) {
    background: var(
      --sc-checkbox-disabled-background-color,
      var(--sc-color-grey-300)
    );
    border: 1px solid
      var(--sc-checkbox-disabled-border-color, var(--sc-color-grey-300));
  }

  .sc-checkbox[indeterminate]::part(control) {
    background: var(
      --sc-checkbox-indeterminate-background-color,
      var(--sc-color-blue-500)
    );
    border: 1px solid
      var(--sc-checkbox-indeterminate-border-color, var(--sc-color-blue-500));
  }
  
  .sc-checkbox::part(checked-icon), .sc-checkbox::part(indeterminate-icon) {
    display: none;
  }

  .sc-checkbox[checked]::part(control--checked) {
    background-image: var(--sc-checkbox-checked-icon);
    background-size: contain;
    background-position: center;
  }
  
  .sc-checkbox[indeterminate]::part(control--indeterminate) {
    background-image: var(--sc-checkbox-indeterminate-icon);
    background-size: contain;
    background-position: center;
  }

  .sc-checkbox.horizontal {
    margin-right: 1.5rem;
  }

 .sc-checkbox.horizontal.sc-checkbox-flex {
    display: block;
  }

  .sc-checkbox.has-message .sc-form-group-main-context {
    margin-bottom: 3px;
  }

  /* sl-checkbox::part(control) { */
  :host([error]) sl-checkbox::part(control) {
    border-color: var(--sc-color-red-400);
  }
`;