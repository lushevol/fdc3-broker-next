import { css } from 'lit';

export default css`
  .container {
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: var(--date-padding, .75rem 1rem);
    box-sizing: border-box;
  }

  .time {
    flex-shrink: 0;
    color: inherit;
    text-align: inherit;
  }

  .container.sm span{
    font-size: 0.75rem;
  }

  .container.md span{
    font-size: 0.875rem;
  }

  .container.lg span{
    font-size: 1rem;
  }
`;
