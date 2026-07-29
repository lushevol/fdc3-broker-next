import { css } from 'lit';

export default css`
  .sc-banner {
    background: var(--sc-banner-background, var(--sc-banner-white-background-color, var(--sc-color-white)));
    color: var(--sc-banner-white-text-color, var(--sc-color-blue-900));
    border: 1px solid var(--sc-banner-border-color, var(--sc-color-grey-150));
    align-items: center;
    overflow: hidden;
    position: relative;
    display: flex;
    width: calc(100% - 1px * 2);
    border-radius: .375rem;

    &.mobile-view {
      flex-direction: column;
    }
  }

  .sc-banner.no-border {
    border: none;
    width: 100%;
  }

  .sc-banner .basic {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
  }

  .sc-banner.light-blue {
    background: var(--sc-banner-background, var(--sc-banner-light-blue-background-color, var(--sc-color-blue-100)));
    color: var(--sc-banner-light-blue-text-color, var(--sc-color-blue-900));
  }

  .sc-banner.alt-blue {
    background: var(--sc-banner-background, var(--sc-banner-alt-blue-background-color, var(--sc-color-blue-650)));
    color: var(--sc-banner-alt-blue-text-color, var(--sc-color-white));
  }
  
  .sc-banner.prosper-blue {
    background: var(--sc-banner-background, var(--sc-banner-prosper-blue-background-color, var(--sc-color-prosper-blue)));
    color: var(--sc-banner-prosper-blue-text-color, var(--sc-color-white));
  }

  .sc-banner.light-grey {
    background: var(--sc-banner-background, var(--sc-banner-light-grey-background-color, var(--sc-color-grey-100)));
    color: var(--sc-banner-light-grey-text-color, var(--sc-color-blue-900));
  }
  
  .sc-banner.white {
    background: var(--sc-banner-background, var(--sc-banner-white-background-color, var(--sc-color-white)));
    color: var(--sc-banner-white-text-color, var(--sc-color-blue-900));
  }

  .sc-banner.tablet-view.is-background.light-blue {
    background: var(--sc-banner-background-image, var(--sc-banner-background));
    background-color: var(--sc-banner-light-blue-background-color, var(--sc-color-blue-100));
  }

  .sc-banner.tablet-view.is-background.alt-blue {
    background: var(--sc-banner-background-image, var(--sc-banner-background));
    background-color: var(--sc-banner-alt-blue-background-color, var(--sc-color-blue-650));
  }

  .sc-banner.tablet-view.is-background.prosper-blue {
    background: var(--sc-banner-background-image, var(--sc-banner-background));
    background-color: var(--sc-banner-prosper-blue-background-color, var(--sc-color-prosper-blue));
  }

  .sc-banner.tablet-view.is-background.light-grey {
    background: var(--sc-banner-background-image, var(--sc-banner-background));
    background-color: var(--sc-banner-light-grey-background-color, var(--sc-color-grey-100));
  }

  .sc-banner.tablet-view.is-background.white {
    background: var(--sc-banner-background-image, var(--sc-banner-background));
    background-color: var(--sc-banner-white-background-color, var(--sc-color-white));
  }

  .sc-banner .banner-info {
    flex-grow: 1;
  }

  .sc-banner .banner-info.center {
    text-align: center;
  }

  .sc-banner .banner-info.right {
    text-align: right;
  }

  .sc-banner .banner-info.justify {
    text-align: justify;
  }

  .sc-banner .banner-body, .sc-banner ::slotted([slot='body']) {
    font-size: var(--sc-banner-body-font-size, 1rem);
    margin-top: .5rem;
  }

  .banner-title-wrapper {
    display: inline-flex;
    align-items: center;
    font-size: var(--sc-banner-title-font-size, 1rem);
  }

  .sc-banner.title-full-width .banner-info {
    width: 100%;
  }

  .sc-banner.title-full-width .banner-title-wrapper {
    display: flex;
    width: 100%;
  }

  .sc-banner.title-full-width .banner-title {
    width: 100%;
  }

  .sc-banner .banner-title, .sc-banner ::slotted([slot='title']) {
    font-size: var(--sc-banner-title-font-size, 1rem);
  }

  .sc-banner.trustpoint .banner-title-wrapper:before {
    color: var(--sc-color-blue-500);
    content: "[[";
    margin-left: var(--sc-banner-trustpoint-margin, 0px);
  }
  .sc-banner.trustpoint .banner-title-wrapper:after {
    color: var(--sc-color-green-500);
    content: "]]";
    margin-right: var(--sc-banner-trustpoint-margin, 0px);
  }

  .sc-banner img {
    align-self: center;
    max-width: 25%;
    height: 100%;
  }

  .sc-banner img.left-img {
    padding: var(--sc-banner-img-position, '0 0 0 1.5rem');
  }

  .sc-banner img.right-img {
    padding: var(--sc-banner-img-position, '0 1.5rem 0 0');
  }

  @media (max-width: 992px) {
    .sc-banner img {
      max-width: 33%;
    }
  }
  
  @media (max-width: 768px) {
    .sc-banner img {
      display: none;
    }
  }

  .sc-banner-close-button {
    position: absolute;
    top: .5rem;
    right: 1.5rem;
    --sc-button-secondary-background-color: var(--sc-banner-button-background-color, var(--sc-color-white));
    --sc-button-secondary-border-color: var(--sc-banner-button-border-color, var(--sc-color-grey-150));
    --sc-button-secondary-text-color: var(--sc-banner-button-color, var(--sc-color-blue-900));
  }
`;
