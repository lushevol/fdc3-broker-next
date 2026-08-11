import { css } from 'lit';

export default css`
    .sc-link-card {
        --sc-card-more-actions-background-color: rgba(255, 255, 255, 0.5);
        --sc-card-content-flex-basis: fit-content;
    }
    .card-image {
        width: var(--sc-link-card-image-width, 100%);
        height: var(--sc-link-card-image-height, 100%);
        object-fit: cover;
    }
    .card-image-slot.horizontal {
        width: 100%;
        height: 100%;
    }
    
    .card-image-grid-row {
        margin: 0;
    }
    .card-icon-container{
        margin-top: var(--sc-card-icon-container-margin-top, 0.125rem);
    }

    .card-icon-container,
    .card-link-container{
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-align: justify;
    }
    .card-body-container,
    .link-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: var(--sc-link-card-webkit-line-clamp, 2);
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .card-action{
        position: absolute;
        right: 0.75rem;
        top: 0.75rem;
    }
    
`;