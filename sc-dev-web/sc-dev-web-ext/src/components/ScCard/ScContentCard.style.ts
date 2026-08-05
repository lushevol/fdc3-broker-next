import { css } from 'lit';

export default css`
.sc-link-card {
    --sc-card-more-actions-background-color: rgba(255, 255, 255, 0.5);
}

.card-icon-container{
    margin-top: var(--sc-card-icon-container-margin-top, 0.125rem);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-align: justify;
}
.card-body-container {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--sc-content-card-webkit-line-clamp, 2);
    overflow: hidden;
    text-overflow: ellipsis;
}
.card-action{
    position: absolute;
    right: 0.75rem;
    top: 0.75rem;
}
.supplementary-container {
    display: flex;
    flex-wrap: wrap; /* Allow wrapping */
    margin-top: 1rem;
    flex-wrap: wrap;
}
.supplementary-detail {
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    color: var(--sc-card-supplementary-detail-color, var(--sc-color-blue-750));
    font-size: var(--sc-card-supplementary-detail-font-size, 0.75rem);
    line-height: var(--sc-card-supplementary-detail-line-height, 1.5em);
}

.supplementary-detail sc-icon {
    margin-right: 0.25rem;
}
.separator {
    margin: 0 0.5rem;
    font-weight: 500;
    font-size: var(
      --sc-card-supplementary-detail-separator-font-size,
      0.875rem
    );
}
`;