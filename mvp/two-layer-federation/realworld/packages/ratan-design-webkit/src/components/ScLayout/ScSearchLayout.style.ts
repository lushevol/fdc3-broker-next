import { css } from 'lit';

export default css`
  .description {
    margin-top: 8px;
    font-size: 0.875rem;
    line-height: 1.125rem;
  }
  
  .basic-search {
    margin-top: 24px;
  }
  
  .single-search {
    margin-top: 20px;
  }
  
  .single-search sc-grid-column {
    display: flex;
    align-items: center;
  }
  
  .single-search sc-grid-column sc-search-field {
    margin-right: 12px;
    flex-grow: 1;
  }
  
  .search-buttons {
    display: flex;
    flex-wrap: nowrap;
    align-items: start;
    gap: 1rem;
    padding-top: 1.5rem;
  }
  
  .search-btn {
    margin-bottom: 8px;
  }
  
  .clear-btn {
    margin-bottom: 8px;
  }
  
  .advance-link-wrapper {
    margin-top: 8px;
  }
  
  .advance-search-title {
    font-weight: 500;
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
  }
  
  .result-wrapper {
    height: 100%;
  }
  
  .result-wrapper.cover {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .no-result-wrapper {
    text-align: center;
  }
`;