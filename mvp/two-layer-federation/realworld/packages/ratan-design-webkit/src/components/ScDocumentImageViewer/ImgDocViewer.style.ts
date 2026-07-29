import { css } from 'lit';

export default css`
:host { 
    display: block;
    width: var(--sc-image-doc-viewer-width, 500px);
    height: 700px;
    }
.container {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
}

.top-section {
    display: flex;
    align-items: center;
    width: 100%;
    height: 1.2rem;
    margin-bottom: 7px;
    padding: 10px 0px;
    background: var(--sc-image-viewer-top-section-background-color);
    justify-content: center;
    font-size: 0.7em;
}

.viewer-template {
    display: flex;
    align-items: center;
    background: var(--sc-image-viewer-template-background-color);
    width: 100%;
    height: inherit;
    padding: 25px 0px;
}

.viewer {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.nav-icon {
    margin: 0;
    padding: 0;
    width: 25px;
    height: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.top-left-section {
    width: 40%;
    display: flex;
    justify-content: space-between;
    padding: 10px;
}

.zoom-section {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}
`;