import { css } from 'lit';

export default css`
    body{
      position: relative;
    }
    .action-bar-container {
      min-width: fit-content;
      padding: 0.625rem var(--sc-action-bar-container-padding, 1.5rem);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--sc-action-bar-container-gap, 0.625rem);
      background: var(--sc-custom-action-bar-background-color, var(--sc-action-bar-background-color));
      height: calc(var(--sc-column-action-bar-sticky-bar-height, 3.25rem) - 1.25rem);
      border-left: var(--sc-action-bar-border-left, none);
    }

    .action-bar-container-sticky{
      position: sticky;
      left: calc(var(--sc-action-bar-sticky-left-offset, 0px) + 0px);
      right: calc(var(--sc-action-bar-sticky-right-offset, 0px) + 0px);
      top: var(--sc-action-bar-top-navigation-offset, 0px);
    }

    .bottom-border {
      border-bottom: var(--sc-action-bar-border-bottom, 1px solid var(--sc-custom-action-bar-border-color, var(--sc-action-bar-border-color)));
    }

    .bottom-shadow{
      box-shadow: rgba(33, 33, 33, 0.15) 0px 2px 0.5rem 0px;
    }

    .action-bar-left{
      display: flex;
      align-items: center;
      gap: var(--sc-action-bar-left-bar, 0.625rem);
    }

    .action-bar-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--sc-action-bar-right-bar, 0.625rem);
      padding-right: var(--sc-action-bar-right-padding, 0);
    }

    .right-helper-container{
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }

    .left-actions {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }
    
    .action-label {
      white-space: nowrap;
    }

    .right-groups {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }

    .left-actions-item-height{
      --sc-button-height-sm: auto;
    }
    
    .left-actions::part(menu-item):hover {
      background: var(--sc-dropdown-item-background-hover-color, var(--sc-color-blue-lightest));
    }

    sl-dropdown sc-menu {
      display: block;
      height: 0;
    }
`;