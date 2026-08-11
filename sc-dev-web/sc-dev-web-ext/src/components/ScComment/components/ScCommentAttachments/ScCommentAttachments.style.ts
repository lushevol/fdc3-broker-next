import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .attachment-list {
    margin-top: 0.5rem;
  }

    .attachment-image-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .attachment-image-button {
      border: none;
      background: transparent;
      padding: 0;
      cursor: pointer;
    }

    .attachment-image {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid var(--sc-color-border, #e0e0e0);
    }

  sc-file-list {
    --sc-file-list-gap: 0.5rem;
  }

  sc-file-item[status="error"] {
    opacity: 0.6;
  }
`;
