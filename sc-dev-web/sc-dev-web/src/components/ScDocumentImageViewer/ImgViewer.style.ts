import { css } from 'lit';

export default css`

.doc-image,
doc-annotation::part(highlight) {
    transition: width 50ms, height 50ms, left 50ms, top 50ms;
}

.center-align {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
}

.flex-column{
    flex-direction: column;
    gap: 16px;
    font-weight: bold;
}

.wrapper {
    position: relative;
    overflow: clip;
}

.grab {
    position: absolute;
    overflow: clip;
    cursor: grab;
    height: 100%;
    width: 100%;
    top: 0;
}
`;