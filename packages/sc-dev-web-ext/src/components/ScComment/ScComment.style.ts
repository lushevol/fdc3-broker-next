import { css } from 'lit';

export default css`
  :host {
    display: block;
  }
  :host > .reply-container {
    margin-left: -1rem;
  }
  sc-rich-text-editor-v2 {
    --sc-form-input-border-color: transparent;
    --sc-form-input-focus-border-color: transparent;
  }
  .left-icon-right-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .reply-username {
    color: var(--sc-comment-color, var(--sc-brand-grey));
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.25rem;
  }
  .reply-time {
    color: var(--sc-comment-reply-time-color, var(--sc-color-grey-700));
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.25rem;
    white-space: nowrap;
  }
  .action-button {
    color: var(--sc-comment-action-button-color, var(--sc-color-blue-500));
    cursor: pointer;
  }
  .action-button .left-icon-right-text span {
    color: var(--sc-comment-action-button-color, var(--sc-color-blue-500));
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem;
    white-space: nowrap;
  }
  .reply-container {
    padding: 0.5rem 0;
    margin-top: 0.5rem;
    border-radius: 0;
    border: none;
    background: var(--sc-comment-bg, var(--sc-color-bg));
    box-shadow: none;
    font-size: 0.875rem;
    transition: border-color 0.2s;

    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto;
    gap: 0.5rem;
  }
  .reply-children {
    padding-left: 3.5rem;
    grid-column: 1 / 4;
  }

  .reply-content-container {
    flex: 1;
    min-width: 0;
    font-size: 0.875rem;
    color: var(--sc-comment-content-color, var(--sc-color-grey-900));
  }
  
  :host > .reply-container >.reply-avatar-container {
    border-left-color: transparent;
  }
  .reply-avatar-container {
    border-left: 1px solid var(--sc-color-grey-100);
    padding-left: 1rem;
    box-sizing: border-box;
  }
  .reply-more-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.25rem;
    align-items: center;
    font-size: 0.875rem;
  }
  .reply-more-hide {
    /* display: none; */
    width: 0;
    opacity: 0;
  }
  .toggle-replies-button {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--sc-comment-action-button-color, var(--sc-color-blue-500));
    cursor: pointer;
    margin-top: 1rem;
  }
  .toggle-replies-button span {
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
  }
  .toggle-replies-button sc-icon {
    margin-top: 3px;
    margin-left: 2px;
  }
  .input-container {
    flex: 1;
  }
  .input-style {
    padding: 0 1rem;
    border-radius: 0.75rem;
    border: 1px solid var(--sc-comment-border-color, var(--sc-color-grey-150));
    background: #fff;
    font-size: 0.875rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .input-style sc-rich-text-editor-v2 {
    flex: 1;
    min-height: 80px;
    max-width: 100%;
    box-sizing: border-box;
  }
  .input-style .input-buttons {
    margin-top: 0.5rem;
    display: flex;
    gap: 0.5rem;
    padding-bottom: 0.5rem;
    justify-content: flex-end;
  }
  .reply-input,
  .root-input {
    display: flex;
    gap: 0.5rem;
    font-size: 0.875rem;
  }
  .reply-input {
    margin: 0.5rem 0;
    display: none;
  }
  .reply-input-active {
    display: flex;
  }
  .condition-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .condition-right {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  .condition-wrapper .poster {
    display: flex;
    align-items: baseline;
    align-self: flex-end;
    gap: 0.5rem;
  }
  .condition-wrapper .sorter {
    display: flex;
    align-items: baseline;
    align-self: flex-end;
    gap: 0.5rem;
  }
  .comments-count {
    margin-top: 2rem;
    color: var(--sc-comment-color, var(--sc-brand-grey));
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.75rem;
  }
  .trigger {
    width: 10rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .condition-wrapper .trigger span,
  .condition-wrapper .poster span,
  .condition-wrapper .sorter span {
    color: var(--sc-comment-color, var(--sc-brand-grey));
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5rem;
  }
  .trigger sc-icon {
    margin-top: 0.375rem;
  }

  /* File attachment styles */
  .input-style > sc-file-input {
    margin: 0.5rem 0 0 0;
    display: block; /* Show sc-file-input with its built-in file list */
  }

  .input-style > .attachment-list {
    margin: 0.5rem 0 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .attachment-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .attachment-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--sc-color-grey-50);
    border-radius: 0.25rem;
    border: 0.0625rem solid var(--sc-color-grey-200);
  }

  .attachment-item sc-icon:first-child {
    color: var(--sc-color-grey-600);
    flex-shrink: 0;
  }

  .attachment-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .attachment-name {
    color: var(--sc-color-grey-900);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .attachment-size {
    color: var(--sc-color-grey-600);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1rem;
  }

  .attachment-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .attachment-error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--sc-color-red-50);
    border-radius: 0.25rem;
    border: 0.0625rem solid var(--sc-color-red-200);
    color: var(--sc-color-red-700);
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .attachment-error sc-icon {
    color: var(--sc-color-red-500);
    flex-shrink: 0;
  }

  .input-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  [slot="add-button"] sc-button {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  /* Input container for proper layout */
  .input-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* File upload container */
  .file-upload-container {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    align-items: flex-start;
  }

  /* Custom upload zone styling */
  .custom-upload-zone {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    background-color: transparent;
    border-radius: 4px;
    max-width: fit-content;
  }

  .custom-upload-zone:hover:not([disabled]) {
    background-color: var(--sc-color-grey-50, #f9fafb);
  }

  .custom-upload-zone.drag-over {
    background-color: var(--sc-color-grey-100, #f2f4f7);
  }

  .custom-upload-zone[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .custom-upload-zone sc-icon {
    color: var(--sc-color-text-secondary, #667085);
    flex-shrink: 0;
  }

  .custom-upload-zone .upload-text {
    display: block;
    font-size: 13px;
    font-weight: 400;
    color: var(--sc-color-text-primary, #344054);
    line-height: 1.3;
    white-space: nowrap;
  }

  .custom-upload-zone .upload-format-hint {
    display: block;
    font-size: 11px;
    font-weight: 400;
    color: var(--sc-color-text-secondary, #667085);
    line-height: 1.3;
  }

  /* Draft attachment list */
  .draft-attachment-list {
    margin-top: 0.25rem;
  }

  .draft-attachment-list sc-file-list {
    width: 100%;
  }
  .reminder-time-list-header {
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    margin-top: 0.5rem;
    margin-bottom: 0.5rem; 
    font-size: 0.875rem;
    .first-line{
      width: 1.5rem;
    }
    .second-line{
      flex: 1;
    }
  }
  
  .reminder-time-list-container {
    max-height: 12.5rem;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .reminder-time-list-tags {
    display: flex; 
    align-items: center;
    flex-wrap: wrap; 
    gap: 0.5rem;
  }
`;
