import { css } from 'lit';

export default css`
  .sc-carousel::part(base) {
    gap: inherit;
  }

  .sc-carousel::part(scroll-container),
  .sc-carousel-item {
    // aspect-ratio: 0;
  }

  .sc-carousel-item {
    padding: 1px;
    height: var(--sc-carousel-item-height, auto);
    // width: fit-content;
  }

  // pagination
  .sc-carousel::part(pagination-item--active) {
    width: 8px;
    height: 8px;
    background-color: var(
      --sc-carousel-pagination-active-color,
      var(--sc-color-blue-500)
    );
    transform: none;
  }

  .sc-carousel::part(pagination-item) {
    width: 8px;
    height: 8px;
    float: left;
    margin-right: 0.75rem;
    background-color: var(
      --sc-carousel-pagination-color,
      var(--sc-color-grey-250)
    );
  }

  .sc-carousel::part(pagination-item--active) {
    background-color: var(
      --sc-carousel-pagination-active-color,
      var(--sc-color-blue-500)
    );
    transform: none;
  }

  .sc-carousel::part(pagination) {
    display: block;
    margin: 15px auto 0;
  }
  
  .sc-carousel.vertical::part(base) {
    max-height: var(--sc-carousel-item-height, none);
  }
  .sc-carousel.vertical::part(pagination) {
    display: block;
    transform: rotate(90deg);
    position: absolute;
    right: 1px;
    margin: unset;
    bottom: calc(var(--sc-carousel-item-height, 100%) / 2);
  }
  .sc-carousel::part(navigation-button) {
    border-radius: 50%;
    padding: 0.25rem;
    color: var(--sc-carousel-navigation-button-color, var(--sc-color-blue-500));
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0px 1px 3px 1px rgba(26, 26, 26, 0.15), 0px 1px 2px 0px rgba(26, 26, 26, 0.3);
  }

  .sc-carousel::part(navigation-button--previous) {
    margin-right: var(--sc-carousel-navigation-button-previous-margin-right, -0.75rem);
  }

  .sc-carousel::part(navigation-button--next) {
    margin-left: var(--sc-carousel-navigation-button-next-margin-left, -0.75rem);
  }
`;
