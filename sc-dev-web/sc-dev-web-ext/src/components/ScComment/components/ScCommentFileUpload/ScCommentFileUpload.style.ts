import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .file-upload-container {
    margin-top: 0.5rem;
  }

  .custom-upload-zone {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border: 1px dashed var(--sc-color-grey-300);
    border-radius: 0.25rem;
    background: var(--sc-color-bg);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .custom-upload-zone:hover:not([disabled]) {
    border-color: var(--sc-color-blue-500);
    background: var(--sc-color-blue-50);
  }

  .custom-upload-zone.drag-over {
    border-color: var(--sc-color-blue-500);
    background: var(--sc-color-blue-50);
    border-style: solid;
  }

  .custom-upload-zone[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .upload-text {
    color: var(--sc-comment-content-color, var(--sc-color-grey-900));
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
  }

  .upload-format-hint {
    color: var(--sc-comment-reply-time-color, var(--sc-color-grey-700));
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .draft-attachment-list {
    margin-top: 0.75rem;
  }

  .draft-image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .draft-image-button {
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
  }

  .draft-image {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid var(--sc-color-border, #e0e0e0);
  }

  sc-file-list {
    --sc-file-list-gap: 0.5rem;
  }
`;
