import { css } from 'lit';

export default css`
  .sc-search-field {
    position: relative;
  }
  .sc-search-field sc-text-input::part(input) {
    border-radius: var(--sc-radius-lg, 1rem);
    border: 1px solid
      var(--sc-search-field-input-border-color, var(--sc-color-grey-150));
    background: var(
      --sc-search-field-input-background-color,
      var(--sc-color-white)
    );
    color: var(--sc-search-field-input-color, var(--sc-color-blue-900));
  }

  .sc-search-field.sc-search-field-lg sc-text-input::part(input) {
    border-radius: var(--sc-radius-xl, 2rem);
  }

  .sc-search-field sc-text-input::part(input):placeholder {
    color: var(
      --sc-search-field-input-placeholder-color,
      var(--sc-color-grey-70)
    );
  }

  .sc-search-field sc-text-input::part(input):focus {
    box-shadow: none;
    border: 1px solid
      var(--sc-search-field-input-focus-border-color, var(--sc-color-blue-500)) !important;
  }

  .sc-search-field sc-text-input::part(input-group)::after {
    content: none;
  }

  .sc-search-field sc-text-input::part(help-message),
  .sc-search-field sc-text-input::part(error-message),
  .sc-search-field sc-text-input::part(success-message) {
    height: 0;
  }

  .sc-search-field sc-text-input sc-icon[name="search"] {
    cursor: pointer;
    padding-left: 0.5rem;
  }

  .sc-search-field .arrow-icon {
    color: var(--sc-search-field-input-suffix-color, var(--sc-color-blue-500));
    cursor: pointer;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }

  .sc-search-field sl-menu {
    border-radius: 8px;
    border: 1px solid var(--sc-dropdown-border-color, var(--sc-color-grey-150));
    background: var(--sc-dropdown-background-color, var(--sc-color-white));
    --auto-size-available-height: var(--sc-dropdown-height, 300px) !important;
    box-shadow: 0px 2px 4px 0px rgba(82, 83, 85, 0.1);
  }

  .sc-search-field sl-menu::-webkit-scrollbar {
    width: 0.25rem;
  }

  .sc-search-field sl-menu::-webkit-scrollbar-thumb {
    background-color: var(--sc-scrollbar-background-color, var(--sc-color-grey-500));
    border-radius: 0.25rem;
  }

  .sc-search-field .dropdown-item::part(label) {
    font-size: 1rem;
    color: var(--sc-dropdown-color, var(--sc-color-grey-150));
    margin-left: 1rem;
  }

  .sc-search-field .dropdown-item::part(checked-icon) {
    display: none;
  }

  .sc-search-field .dropdown-item::part(base) {
    font-family: inherit;
  }

  .sc-search-field .dropdown-item::part(base):hover {
    background: var(
      --sc-dropdown-item-background-hover-color,
      var(--sc-color-blue-100)
    );
  }

  .sc-search-field.sc-truncate .dropdown-item .dropdown-item-option .item-text {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sc-search-field .empty-text,
  .sc-search-field .loading-text {
    text-align: center;
    padding: 20px 0;
    color: var(--sc-dropdown-color, var(--sc-color-grey-150));
  }
`;
