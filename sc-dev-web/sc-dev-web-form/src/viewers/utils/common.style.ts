import { css } from 'lit';

export default css`
  .editicon {
    position: absolute;
    right: 0;
    text-align: end;
    margin: auto;
    cursor: pointer;
  }
  .editiconrow {
    position: absolute;
    right: 0;
    text-align: end;
    margin-left: 0.312rem;
    margin-top: 0;
    cursor: pointer;
  }
  .box-body .editiconrow {
    margin-top: -1.875rem;
    margin-right: 1.25rem;
  }
  .w-half {
    width: 45%;
    display: inline-block;
  }
  .row {
    padding: 0 0 0.937rem 0;
    width: 100%;
    display: block;
  }
  .row-min-space {
    padding: 0 0 0.2rem 0;
  }
  .row-none-space {
    padding: 0;
  }
  .col {
    margin: 0.937rem 0;
    width: 100%;
    display: flex;
  }
  .header {
    padding: 1rem 0;
    margin: 0;
  }
  .condition-row {
    margin-bottom: 0.5rem;
  }
  .add-condition {
    margin-top: 0.937rem;
  }
  .text-capitalize {
    text-transform: capitalize;
  }
  .text-uppercase {
    text-transform: uppercase;
  }
  .error-message {
    font-size: .625rem;
    color: var(--sc-form-group-error-color, var(--sc-color-red-500));
    margin-top: var(--sc-form-group-help-margin-top, 0.25rem);
  }
`;