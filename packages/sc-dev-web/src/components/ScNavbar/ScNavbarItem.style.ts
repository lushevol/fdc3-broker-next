import { css } from 'lit';

export default css`
  .navbar-item {
    height: 64px;
    min-width: 64px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-left: 4px;
    padding-right: 4px;
    color: var(--sc-navbar-item-text-color);
  }
  .navbar-item.active {
    color: var(--sc-navbar-item-active-text-color);
  }
  .navbar-item:not(.active) {
    cursor: pointer;
  }
  .navbar-item.hidden {
    display: none;
  }  
  .navbar-item:not(.active):hover {
    color: var(--sc-navbar-item-active-text-color);
  }
  .navbar-item sc-badge {
    position: absolute;
    top: -8px;
    left: 55%;
  }
  .navbar-item .nav-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
`;