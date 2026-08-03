import { css } from 'lit';

export default css`
  
  :host {
    display: block;
  }

  .sc-menu-label {
    display: inline-block;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 600;
    line-height: 1rem;
    color: var(--sc-menu-label-color, var(--sc-color-grey-400));
    padding: 10px 24px;
    user-select: none;
    -webkit-user-select: none;
    height: 100%;
  }
`;