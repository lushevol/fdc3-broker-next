import { css } from 'lit';

export default css`
  .draggable-side-sheet {
    height: 100%;
    border-left: 1px solid var(--sc-draggable-side-sheet-border-color, var(--sc-color-grey-150));
    background: var(--sc-draggable-side-sheet-background-color, var(--sc-color-white));
    position: relative;
  }
  .draggable-side-sheet.closed {
    width: 0 !important;
  }
  .draggable-side-sheet.fixed {
    position: absolute;
    right: 0;
    top: 0;
  }
  .draggable-side-sheet .content {
    padding: 1.25rem;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    overflow-x: hidden;
    height: calc(100% - 30px);
  }
  .draggable-icon-container {
    position: absolute;
    left: -1.8125rem;
    top: calc(50% - 2.5rem);
    padding: 1rem;
    cursor: move;
  }
  .draggable-icon-container .cover {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
  }
  .draggable-icon {
    display: flex;
    justify-content: center;
    width: 0.6875rem;
    padding: 0.375rem 0;
    border-radius: 0.75rem 0px 0px 0.75rem;
    border: 1px solid var(--sc-draggable-side-sheet-icon-border-color, var(--sc-color-grey-150));
    background: var(--sc-draggable-side-sheet-icon-background-color, var(--sc-color-white));
    box-shadow: -2px 2px 4px 0px rgba(0, 0, 0, 0.10);
  }
  .draggable-icon .divider {
    display: inline-block;
    width: 3px;
    border-left: 1px solid var(--sc-draggable-side-sheet-icon-border-color, var(--sc-color-grey-300));
    border-right: 1px solid var(--sc-draggable-side-sheet-icon-border-color, var(--sc-color-grey-300));
    height: 2rem;
  }
`;