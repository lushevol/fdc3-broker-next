import { css } from 'lit';

export default css`

.annotation{
    transform-origin: top left;
    position:absolute; 
    background-color:#133b4a57; 
}
.annotation:active:after {
    content: attr(title);
    padding: 5px;
    border: 1px solid var(--sc-image-viewer-annotation-border-color);
    border-radius: 4px;
    display: inline-block;
    top: 100%;
    font-size: .7rem;
    position: relative;
    background: var(--sc-image-viewer-annotation-background-color);
    color: white;
}
`;