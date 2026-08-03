import { css } from 'lit';

export default css`
  .sc-title {
    margin: 0;
    font-weight: normal;
  }

  .sc-title.ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .sc-title.level1 {
    line-height: 1.6;
    font-size: 2.1875rem;
  }

  .sc-title.level1.hero {
    font-size: 2.84375rem;
  }

  .sc-title.level2 {
    line-height: 1.35;
    font-size: 1.75rem;
  }

  .sc-title.level2.hero {
    font-size: 2.4rem;
  }

  .sc-title.level3 {
    line-height: 1.33;
    font-size: 1.3125rem;
  }

  .sc-title.level3.hero {
    font-size: 1.75rem;
  }

  .sc-title.level4 {
    line-height: 1.4;
    font-weight: 700;
    font-size: 1.09375rem;
  }

  .sc-title.level4.hero {
    font-size: 1.5rem;
  }

  .sc-title.level5 {
    line-height: 1.4;
    font-size: 1.09375rem;
  }

  .sc-title.level5.hero {
    font-size: 1.5rem;
  }

  .sc-title.level6 {
    font-size: 0.875rem;
  }

  .sc-title.level6.hero {
    font-size: 1rem;
  }
`;