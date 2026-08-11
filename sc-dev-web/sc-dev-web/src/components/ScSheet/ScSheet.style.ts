import { css } from 'lit';

export default css`
  :host {
    --sl-z-index-drawer: var(--sc-sheet-z-index, 700);
    /* Spacing */
    --sc-sheet-spacing-1: 0.5rem;
    --sc-sheet-spacing-2: 0.65rem;
    --sc-sheet-spacing-3: 1rem;
    --sc-sheet-spacing-4: 1.25rem;
    --sc-sheet-spacing-5: 2.215rem;

    --sc-sheet-title-font-size: 1.125rem;
    --sc-sheet-header-spacing: 0.65rem;
    
  }

  .sc-side-sheet::part(base) {
    top: var(--sc-sheet-top, 0);
    height: var(--sc-sheet-height, 100%);
  }
`;
