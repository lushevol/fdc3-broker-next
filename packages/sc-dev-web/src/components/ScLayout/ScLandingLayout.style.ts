import { css } from 'lit';

export default css`
  .sc-landing-layout {
    background: var(--sc-layout-background-color, var(--sc-color-white));
    color: var(--sc-layout-text-color, var(--sc-color-blue-900));
    overflow-x: hidden;
    width: 100%;
  }
  
  .sc-landing-layout.height-cover {
    display: flex;
    flex-direction: column;
    height: calc(100vh - var(--sc-layout-top-navigation-offset, 0px) - var(--sc-bottom-offset, 0rem));
  }
  
  .title {
    height: calc(var(--sc-layout-header-offset, 100px) - var(--sc-layout-top-offset, 24px) - 24px);
    max-height: calc(var(--sc-layout-header-offset, 100px) - var(--sc-layout-top-offset, 24px) - 24px);
    padding: 0px 0px 24px;
    margin: 0px;
  }
  
  .sc-landing-layout.height-cover .content-wrapper {
    flex-grow: 1;
    display: flex;
    overflow-y: auto;
    width: 100%;
  }
  
  .content-wrapper .content-container {
    padding: 22px 0px 20px;
  }
  
  .sc-landing-layout.height-cover .content-wrapper .content-container {
    width: 100%;
  }
  
  .sc-landing-layout.height-cover .content-wrapper .content-container .content-slot {
    max-height: 100%;
    height: 100%;
    overflow-y: auto;
  }
  
  .sc-landing-layout .content-wrapper .content-container .content-slot {
    padding: 1px 24px;
  }

  .sc-landing-layout .landing-title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: .75rem;
    width: 100%;
  }

  .sc-landing-layout .landing-title-content {
    flex: 1;
    min-width: 0;
  }

  .sc-landing-layout .landing-title-content sc-title {
    display: block;
    max-width: 100%;
  }

  .sc-landing-layout .landing-header-actions {
    display: inline-flex;
    align-items: center;
    gap: var(--sc-spacing-12, 0.75rem);
    flex-shrink: 0;
  }

  .sc-landing-layout .landing-header-action-item {
    --sc-dropdown-menu-margin-top: .5rem;
  }

  .sc-landing-layout .landing-header-optional-actions {
    --sc-dropdown-min-width: 10rem;
  }

  .sc-landing-layout .landing-header-optional-actions sc-icon-button {
    display: inline-flex;
  }
  
  .sc-landing-layout.height-cover .content-wrapper .content-container .content-slot::-webkit-scrollbar {
    width: 0.3125rem;
    height: 0.3125rem;
    background-color: transparent;
  }
  
  .sc-landing-layout.height-cover .content-wrapper .content-container .content-slot::-webkit-scrollbar-thumb {
    background-color: var(--sc-scrollbar-background-color, var(--sc-color-grey-500));
    border-radius: 0.3125rem;
  }

  @media (max-width: 768px) {
    .sc-landing-layout .landing-title-row {
      flex-wrap: wrap;
      align-items: center;
    }

    .sc-landing-layout .landing-header-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
`;