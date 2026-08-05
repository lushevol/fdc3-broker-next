import { css } from 'lit';

export default css`
  .sc-menu {
    display: block;
    position: relative;
    background: var(--sc-menu-background-color, var(--sc-color-white));
    flex-shrink: 0;
    border-radius: 8px;
    box-shadow: 0px 2px 8px 0px rgba(33, 33, 33, 0.10);
    padding: 4px 0;
    overflow: auto;
    overscroll-behavior: none;
    display: inline-block;
    width: var(--menu-width, auto);
    margin-left: var(--menu-left-position, 0px);
  }
`;