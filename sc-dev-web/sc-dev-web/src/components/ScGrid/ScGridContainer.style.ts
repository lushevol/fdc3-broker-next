import { css } from 'lit';

export default css`
  @media (min-width: 1200px) {
    .sc-grid-container {
      max-width: var(--sc-screen-xl, 1140px);
    }
  }

  @media (min-width: 992px) {
    .sc-grid-container {
      max-width: var(--sc-screen-lg, 960px);
    }
  }

  @media (min-width: 768px) {
    .sc-grid-container {
      max-width: var(--sc-screen-md, 720px);
    }
  }

  @media (min-width: 576px) {
    .sc-grid-container {
      max-width: var(--sc-screen-sm, 540px);
    }
  }

  .sc-grid-container {
    margin-left: auto;
    margin-right: auto;
    padding-left: 15px;
    padding-right: 15px;
    width: 100%;
  }

  .sc-grid-container-fluid {
    margin-left: auto;
    margin-right: auto;
    padding-left: 15px;
    padding-right: 15px;
    width: 100%;
  }
`;
