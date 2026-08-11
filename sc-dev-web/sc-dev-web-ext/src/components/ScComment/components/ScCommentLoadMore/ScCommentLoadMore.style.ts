import { css } from 'lit';

export default css`
  .load-more-link {
    display: flex;
    align-items: center;
    gap: var(--sc-spacing-12);
  }

  .load-more-link--loading {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  .load-more-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;