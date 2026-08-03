import { css } from 'lit';

export default css`
  .sc-paragraph, .sc-paragraph.md {
    font-size: 0.875rem;
  }
  .sc-paragraph.xs {
    font-size: 0.625rem;
  }
  .sc-paragraph.xxs {
    font-size: 0.625rem;
  }
  .sc-paragraph.sm {
    font-size: 0.75rem
  }
  .sc-paragraph.lg {
    font-size: 1rem
  }
  .sc-paragraph.ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
`;