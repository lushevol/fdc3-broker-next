import { css } from 'lit';

export default css`
  .sc-grid-row {
    display: flex;
    flex-wrap: wrap;
    margin-left: -15px;
    margin-right: -15px;
  }

  .sc-grid-row .no-gutters {
    margin-left: 0;
    margin-right: 0;
  }

  .sc-grid-row .no-gutters .col,
  .sc-grid-row .no-gutters [class*='col-'] {
    padding-left: 0;
    padding-right: 0;
  }
`;
