import { css } from 'lit';

export default css`
  .sc-file-item {
    display: flex;
    align-items: center;
    margin: 0;
    border: 1px solid var(--sc-file-item-border-color, var(--sc-color-grey-150));
    border-radius: 0.375rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    box-sizing: border-box;
    max-width: 100%;

    &:hover {
      background-color: var(--sc-file-item-hover-background-color, var(--sc-color-grey-50));
    }
  }
  .sc-file-item.no-border {
    border: none;
    border-radius: none;
  }
  .file-icon-wrapper {
    margin: 0 0.5rem;
    align-self: center;
  }
  .sc-file-item.no-border .file-icon-wrapper {
    align-self: flex-start;
    margin: 0 0.5rem 0 0;
  }
  .file-info-wrapper {
    display: flex;
    flex-direction: row;
    overflow-wrap: break-word;
    word-break: break-word;
    flex-grow: 1;
  }
  .file-item-main {
    display: flex;
    flex-direction: row;
    flex: 1 1 auto;
    justify-content: space-between;
  }
  .file-item-body {
    display: flex;
    flex-direction: column;
  }
  .file-item-icon-loading, .file-item-icon-error, .file-item-icon-paper-clip {
    margin-right: 0.5rem;
    align-items: flex-start;
    color: var(--sc-file-icon-color);
  }
  .input-file-list > * {
    line-height: 1rem;
  }
  .file-name {
    color: var(--sc-file-item-file-name-color, var(--sc-color-blue-900));
    &.pending-text {
      color: var(--sc-file-item-pending-color, var(--sc-color-blue-250))
    }
  }
  .file-size {
    color: var(--sc-file-item-file-size-color, var(--sc-color-grey-50));
    font-size: 0.625rem;
    margin-top: 0.5rem;
  }
  .progress-bar-wrapper {
    margin: 0.25rem 0;
  }
  .file-item-extra {
    color: var(--sc-file-item-file-extra-color, var(--sc-color-grey-400));
    font-size: 0.625rem;
    margin-left: 1.5rem;
    overflow-wrap: break-word;
    word-break: break-word;
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    max-width: 50%;
  }
  [part~='delete'] {
    visibility: hidden;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: 0.5rem;
    color: var(--sc-file-item-close-icon-color, var(--sc-color-grey-600));
  }
  .danger-button {
    color: var(--sc-file-item-error-color, var(--sc-color-red-500))
  }
  .sc-file-item.no-border [part~='delete'] {
    align-items: flex-start;
  }
  .sc-file-item:hover [part~='delete'] {
    visibility: visible;
  }
  .sc-file-item.uploading-state [part~='delete'], .sc-file-item.error-state [part~='delete'] {
    visibility: visible;
  }
  .sc-file-item.error-state {
    background-color: var(--sc-file-item-error-background-color, var(--sc-color-red-50));
    color: var(--sc-file-item-error-color, var(--sc-color-red-500))
  }
  .error-state .file-name, .error-state .file-size, .error-state .file-item-extra {
    color: var(--sc-file-item-error-color, var(--sc-color-red-500))
  }
`;