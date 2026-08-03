import { css } from 'lit';

export default css`
* {
    /* margin: 0; */
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    background-color: #fff;
    overflow: hidden;
}

h1 {
    color: #323330;
}

.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1.25rem;
}

.drop-targets {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: 1.25rem 0;
}

.component-box {
    top: 30.562rem;
    left: 6.125rem;
    border-radius: 0.625rem;
    opacity: 0px;
    flex: 1;
    cursor: move;
}

icon-component {
    color: var(--sc-form-designer-drag-icon-color, var(--sc-color-blue-900));
}

.box {
    width: 4.437rem;
    height: 4.437rem;
    top: 30.562rem;
    left: 6.125rem;
    gap: 0px;
    border-radius: 1.25rem;
    opacity: 0px;
    background: #E7F1FD;
}

.label {
    text-align: center;
    width: 4.437rem;
    font-size: 0.625rem;  
}

.drag-over {
    border: dashed 0.187rem red;
}

.item {
    width: 2rem;
    height: 1.5rem;
    top: 45.25rem;
    left: 17.5rem;
    gap: 0px;
    opacity: 0px;
    display: block;
    margin: auto;
    text-align: center;
}

.hide {
    display: none;
}

.row {
    padding: 0.312rem 0;
}
`;

export const scrollbarStyle = css`
    ::-webkit-scrollbar {
        width: 0.312rem;
    }

    ::-webkit-scrollbar-thumb {
        background: var(--sc-color-grey-150);
        border-radius: 0.312rem;
    }
`;
export const modalStyle = css`
    .modal-container {
        height: 25.937rem;
        overflow-y: auto;
        overflow-x: hidden; 
    }
    ${scrollbarStyle}
`;