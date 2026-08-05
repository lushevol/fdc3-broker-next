import { css } from 'lit';

export default css`
  .sc-form-control::-webkit-outer-spin-button,
  .sc-form-control::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .sc-form-control {
    -moz-appearance: textfield;
  }
  .sc-form-group .arrows {
    display: flex;
    flex-direction: column;
    margin-right: calc(-0.75rem + 1px);
  }
  .arrow-up,
  .arrow-down {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    color: var(--sc-color-grey-250);
    border-left: 1px solid var(--sc-form-control-border-color, var(--sc-color-grey-150));
  }
  .sc-form-group .arrows:hover .arrow-up {
    border-bottom-color: var(--sc-form-input-focus-border-color, var(--sc-color-blue-500));
  }
  .arrow-up:hover,
  .arrow-down:hover {
    color: var(--sc-form-input-focus-border-color, var(--sc-color-blue-500));
    border-color: var(--sc-form-input-focus-border-color, var(--sc-color-blue-500));
  }
  .arrow-up {
    border-bottom: 1px solid var(--sc-form-control-border-color, var(--sc-color-grey-150));
  }
  .sc-form-group .arrows .arrow-up,
  .sc-form-group .arrows .arrow-down {
    height: 50%;
    line-height: 50%;
    cursor: pointer;
    user-select: none;
  }
  .sc-form-group .arrows sc-icon {
    padding-right: 0.375rem;
    padding-left: calc(0.375rem - 1px);
  }
  .sc-form-group-disabled .arrows {
    display: none;
  }
  .clear {
    margin-right: 0.5rem;
  }
`;

