import { css } from 'lit';

export default css`
  .sc-basic-layout {
    padding: 0px 24px var(--sc-layout-bottom-offset, 24px);
    background: var(--sc-layout-background-color, var(--sc-color-white));
    color: var(--sc-layout-text-color, var(--sc-color-blue-900));
    width: calc(100% - 24px * 2);
  }
  
  .title {
    height: calc(var(--sc-layout-header-offset, 100px) - var(--sc-layout-top-offset, 24px) - 24px);
    max-height: calc(var(--sc-layout-header-offset, 100px) - var(--sc-layout-top-offset, 24px) - 24px);
    padding: 24px 0px;
    margin: 0px;
  }
  
  @media (min-width: 1800px) {
    .sc-basic-layout.part-width {
      width: calc(75% - 24px * 2);
    }
  }
`;