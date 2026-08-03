import { css } from 'lit';

export default css`
    .grid-container{
        border: 1px dashed var(--sc-color-grey-150);
    }
    sc-grid-column {
        border-right: 1px dashed var(--sc-color-grey-150);
        box-sizing: border-box;
    }
    sc-grid-column:last-of-type {
        border-right: none;
    }
`;