import { css } from 'lit';

export default css`
  :host {
    --sc-link-font-weight: 500;
    --sc-sheet-top: var(--sc-menu-bar-top, 52px);
    --sc-sheet-height: var(--sc-menu-bar-height, calc(100% - var(--sc-bottom-offset, 0px)));
    --sc-sheet-z-index: var(--sc-menubar-sidesheet-z-index, 700);
  }
  sc-side-sheet {
    --sc-sheet-header-spacing: 0;
    --sc-sheet-overlay-display: none;
    --sc-sheet-padding-bottom: var(--sc-sheet-top);
  }
  .sc-menu-bar {
    display: flex;
    position: relative;
  }
  .sc-menu-bar  sc-icon {
    cursor: pointer;
  }
  .sc-menu-bar > * {
    padding: 4px 12px;
  }
  .sc-menu-bar > sc-divider {
    padding: 4px 8px 5px;
  }
  .sc-menu-bar > .icon-wrapper {
    padding: 4px 8px;
    display: flex;
    align-items: center;
  }
  .sc-menu-bar > .icon-wrapper > sc-link {
    padding-top: 5px;
  }
  .sc-menu-bar > :first-child {
    padding-left: 0px;
  }
  .sc-menu-bar > :last-child {
    padding-right: 0px;
  }
  .bottom-line {
    position: absolute;
    bottom: calc(0px - var(--sc-menu-bottom-line-spacing, 2px));
    height: 2px;
    padding: 0;
    background: var(--sc-menu-item-hover-color, var(--sc-color-blue-500));
    transition: var(--sc-transition-fast) left ease-in-out;
  }
  .bottom-line.selected {
	  padding-right: 4px;
  }
  .menu-trigger {
    display: flex;
    font-weight: 500;
    line-height: 1.5rem;
    font-size: 0.875rem;
    text-align: right;
    color: var(--sc-menu-item-color, var(--sc-color-blue-900));
    cursor: pointer;
  }
  .menu-trigger:hover, .menu-trigger.active, .menu-trigger.selected {
    color: var(--sc-menu-item-hover-color, var(--sc-color-blue-500));
  }
  .menu-trigger sc-icon {
    margin-top: 6px;
    margin-left: 4px;
  }
  .label-content {
    display: flex;
  }
  .description-slot {
    margin-top: 4px;
  }
  // .prefix sc-icon, .suffix sc-icon {
  //   margin-top: 8px;
  // }
  @media(max-width: 576px) {
    sc-grid-column[xs="12"].label-cell, sc-grid-column[xs="12"].empty-cell {
      display: none;
    }
  }

  .category-container, .category-container sc-title {
    display: block;
    margin-bottom: 1rem;
  }
`;