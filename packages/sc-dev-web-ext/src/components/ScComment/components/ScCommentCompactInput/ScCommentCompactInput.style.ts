import { css } from 'lit';

export default css`
  :host {
    display: block;
    container-type: inline-size;
  }

  .compact-input {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  sc-rich-text-editor-v2 {
    flex: 1 1 auto;
    min-width: 0;
  }

  .compact-input-actions {
    display: flex;
    flex-shrink: 0;
    gap: 0.5rem;
    align-items: center;
    sc-button{
      height: 2.125rem;
    }
  }

  .left-icon-right-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  @container (max-width: 420px) {
    .compact-input {
      align-items: flex-end;
      gap: 0.5rem;
    }

    .compact-input-actions {
      align-self: center;
    }

    .left-icon-right-text {
      gap: 0;
    }

    .left-icon-right-text span {
      display: none;
    }
  }
`;
