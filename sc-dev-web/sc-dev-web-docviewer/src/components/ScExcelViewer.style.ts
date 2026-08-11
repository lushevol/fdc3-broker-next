import { css } from 'lit';
export default css`
  :host {
    display: block;
    width: 100%;
    height: calc(100% - 3.25rem);
    overflow: auto;
    position: relative;
    border-bottom: 1px solid var(--sc-color-grey-150);
  }
  .sheet-tabs {
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .excel-table-fixed {
    table-layout: fixed;
    min-width: max-content;
    width: auto;
  }
  .excel-table-bordered {
    border-collapse: collapse;
    border: 1px solid var(--sc-color-grey-150);
  }
  .excel-cell-bordered {
    border: 1px solid var(--sc-color-grey-150);
  }
  .excel-row-header {
    width: 40px;
    background: var(--sc-color-grey-50);
    font-weight: 400;
    color: var(--sc-color-grey-500);
    text-align: center;
    padding: 4px 6px;
    border-left-color: transparent;
    /* border moved to .excel-cell-bordered */
  }
  .excel-col-header {
    background: var(--sc-color-grey-50);
    font-weight: 400;
    color: var(--sc-color-grey-500);
    text-align: center;
    min-width: 150px;
    padding: 4px 6px;
    /* border moved to .excel-cell-bordered */
  }
  .excel-cell {
    min-width: 150px;
    padding: 4px 6px;
    /* border moved to .excel-cell-bordered */
  }
  .loading-indicator {
    width: 100%;
    height: 100%;
    text-align: center;
  }
  sc-button-group-item {
    --sc-button-border-radius-md: 0!important;
  }
`;
