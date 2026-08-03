import { css } from 'lit';

export default css`
.cell-container {
  color: red
}
  sc-data-grid sc-data-grid-cell{
    overflow: auto;
    max-height: var(--form-table-max-height, 25rem);
  }

  sc-data-grid sc-data-grid-cell::part(header-container), sc-data-grid sc-data-grid-cell::part(cell-container) {
    display: flex;
  }

  sc-data-grid sc-data-grid-cell::part(input), sc-data-grid sc-data-grid-cell::part(header-input) {
    height: 3.5rem;
    border: none;
    background: transparent;
    min-width: 6.25rem;
    outline: none;
    font-family: var(--sc-font-family);
    flex: 1;
    font-size: 1rem;
    color: inherit;
  }

  sc-data-grid sc-data-grid-cell.compact::part(input), sc-data-grid sc-data-grid-cell.compact::part(header-input) {
    height: 2rem;
  }

  sc-data-grid sc-data-grid-cell::part(header-input) {
    font-weight: 600;
  }

  sc-data-grid sc-data-grid-cell::part(header-delete-icon) {
    color: var(--sc-color-red-500);
    margin-right: 1rem;
  }
`;