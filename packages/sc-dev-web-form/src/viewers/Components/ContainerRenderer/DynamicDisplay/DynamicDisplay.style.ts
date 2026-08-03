import { css } from 'lit';

export default css`
  .dynamic-display-container {
    box-shadow: 0 0.0625rem 0.25rem 0 rgba(6, 29, 51, 0.15);
    padding: 1.25rem 1rem;
    position: relative;
    margin-left: var(--sc-dynamic-display-margin-left, -0.75rem);
    margin-right: var(--sc-dynamic-display-margin-right, -0.75rem);
  }

  .dynamic-display-container.preview {
    margin-top: var(--sc-dynamic-display-margin-top, -0.625rem);
  }

  .dynamic-header {
    font-weight: 600;
    font-size: 1.75rem;
  }

  .round {
    display: flex;
    width: 2rem;
    height: 2rem;
    justify-content: center;
    align-items: center;
    border-radius: 6.25rem;
    border: 0.0625rem solid var(--sc-box-border-color, var(--sc-color-grey-150));
    background-color: var(--sc-box-default-background-color, var(--sc-color-white));;
    box-shadow: 0 0.0625rem 0.25rem 0 rgba(6, 29, 51, 0.15);
    position: absolute;
    left: calc(50% - 1rem);
    cursor: pointer;
  }

  .round:hover {
    box-shadow: 0 0.125rem 0.5rem 0 rgba(6, 29, 51, 0.15);
  }

  .sc-box-type-default {
    background-color: var(--sc-box-default-background-color, var(--sc-color-white));
    color: var(--sc-box-default-text-color, var(--sc-color-blue-900));
  }

  .sc-box-type-transparent {
    background-color: var(--sc-box-background-color, transparent);
    color: var(--sc-box-text-color, var(--sc-color-blue-900));
  }

  .sc-box-type-info {
    background-color: var(--sc-box-info-background-color, var(--sc-color-blue-100));
    color: var(--sc-box-info-text-color, var(--sc-color-blue-500-dark));
  }

  .sc-box-type-success {
    background-color: var(--sc-box-success-background-color, var(--sc-color-green-100));
    color: var(--sc-box-success-text-color, var(--sc-color-green-650));
  }

  .sc-box-type-warning {
    background-color: var(--sc-box-warning-background-color, var(--sc-color-amber-150));
    color: var(--sc-box-warning-text-color, var(--sc-color-amber-550));
  }

  .sc-box-type-error {
    background-color: var(--sc-box-error-background-color, var(--sc-color-red-50));
    color: var(--sc-box-error-text-color, var(--sc-color-red-550));
  }

  .sc-box-type-disabled {
    background-color: var(--sc-box-disabled-background-color, var(--sc-color-blue-900));
    color: var(--sc-box-disabled-text-color, var(--sc-color-blue-900));
  } 

  .dynamic-components {
    overflow: hidden;
    transition: height 0.3s;
  }
`;