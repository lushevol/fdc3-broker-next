import { css } from 'lit';

export default css`
  :host {
    display: block;
    --sc-table-row-height: 56px;
  }

  .data-view-container:not(.view) {
    border: 1px solid var(--sc-data-view-border-color, var(--sc-color-grey-100));
    border-radius: var(--sc-radius-sm);
  }

  .compact {
    --sc-table-row-height: 32px;
  }
  
  .row {
    display: flex;
  }

  .col {
    display: var(--sc-data-view-col-display, flex);
    align-items: center;
  }

  .col .field {
    background: var(--sc-data-view-field-background-color, var(--sc-color-grey-50));
  }

  .data-view-container:not(.view) .row:not(:last-child) .col .field {
    border-bottom: 1px solid var(--sc-data-view-border-color, var(--sc-color-grey-100));
  }

  .data-view-container:not(.view) .row:not(:last-child) .col .value {
    border-bottom: 1px solid var(--sc-data-view-border-color, var(--sc-color-grey-100));
  }

  .data-view-container:not(.view) .col .field {
    border-right: 1px solid var(--sc-data-view-border-color, var(--sc-color-grey-100));
  }

  .data-view-container:not(.view) .col .value {
    border-right: 1px solid var(--sc-data-view-border-color, var(--sc-color-grey-100));
  }

  .data-view-container:not(.view) .col:last-child .value {
    border-right: none;
  }
  
  .col .field, .col .value {
    width: var(--sc-data-view-col-child-width, 50%);
  }

  .col .content {
    padding: 0 15px;
    box-sizing: border-box;
    height: var(--sc-table-row-height, 56px);
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    color: var(--sc-data-view-view-mode-field-color, var(--sc-color-blue-darkest));
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: start;
  }

  .col .field .content > span,
  .col .value .content > span,
  .col .value .content > span > * {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }
  
  .col .value .content > span > * {
    max-height: calc(1.4em * 2);
  }

  @media (max-width: 576px) {
    .row {
      display: block;
    }
    .col {
      width: 100% !important;
    }
  }

  .data-view-container.view .col .field{
    background: none;
    text-align: right;
    color: var(--sc-data-view-view-mode-field-color, var(--sc-color-blue-darkest));
  }

  .data-view-container.view .col .field .content, .data-view-container.view .col .value .content {
    border: none;
    display: flex;
    flex-direction: column;
    height: max-content;
    min-height: var(--sc-table-row-height, 56px);
    overflow: visible;
    white-space: normal;
    line-height: normal;
  }

  .data-view-container.view .col .field .content {
    align-items: end;
  }

  .data-view-container.view .col .value .content {
    align-items: start;
  }

  .data-view-container.center:not(.view) .col .content,
  .data-view-container.center:not(.view) .col .content {
    justify-content: center;
  }

  .data-view-container.right:not(.view) .col .content,
  .data-view-container.right:not(.view) .col .content {
    justify-content: end;
  }

  .data-view-container.top:not(.view) .col .content,
  .data-view-container.top:not(.view) .col .content {
    align-items: start;
  }

  .data-view-container.bottom:not(.view) .col .content,
  .data-view-container.bottom:not(.view) .col .content {
    align-items: end;
  }
`;
