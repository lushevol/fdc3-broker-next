import { css } from 'lit';

export default css`
/* header  */
.sc-rte-ask-ai-modal-container{
    width: 50rem;
    box-shadow: 0rem .5rem 1.5rem 0rem #061D331F;
    background-color: var(--sc-rte-bg-color);
    border-radius: .375rem;
}

.sc-rte-ask-ai-modal-header{
    padding: .75rem 1.25rem;
    display: flex;
    align-items: center;
}
.header-left{
    display: flex;
    align-items: center;
    gap: .5rem;
    flex: 1;
}
.header-left-icon{
    color: var(--sc-rich-text-editor-active-bg-color);
}
.header-left-text{
    font-size: 1.125rem;
    line-height: 2.125rem;
    flex: 1;
}
.header-right-icon{
    color: var(--sc-rich-text-editor-icon-color);
    cursor: pointer;
}
/* main */
.sc-rte-ask-ai-modal-main{
    padding: 1.25rem;
}
.modal-main-content{
    position: relative;
    border-radius: .375rem;
}

.modal-main-content .bk{
  position: absolute;
  top: -0.125rem;
  left: -0.125rem;
  width: calc(100% + .25rem);
  height: calc(100% + .25rem);
  border-radius: .375rem;
  overflow: hidden;
  z-index: 0;
}
/** Flowing light */
.modal-main-content .bk::before {
  content: "";
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: repeating-conic-gradient(from var(--sc-rte-rotation-angle, 0deg),var(--sc-color-orange-500), var(--sc-color-olive-500), var(--sc-color-purple-500), var(--sc-color-violet-500), var(--sc-color-magenta-500), var(--sc-color-teal-500));
  transition: background 0.25s ease-in-out;
}

.modal-main-content .in{
    max-height: 17.5rem;
    text-align: justify;
    padding: 1rem;
    border-radius: .375rem;
    overflow-y: scroll;
    position: relative;
    z-index: 1;
    background-color: var(--sc-rte-bg-color);
    span{
        line-height: 1.5rem;
    }
}
.in-height{
    height: 17.5rem;
}
/* scrollbar  */
.modal-main-content .in::-webkit-scrollbar {
    width: 0.3125rem;
}
.modal-main-content .in::-webkit-scrollbar-thumb {
    background-color: var(--sc-scrollbar-background-color, var(--sc-color-grey-500));
    border-radius: .5rem; 
}
.modal-main-content .in::-webkit-scrollbar-button {
    background-color: transparent;
    border-radius: .5rem; 
}

.modal-main-footer{
    padding-top: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
}
.sc-rte-ask-ai-modal-footer{
    padding: 1.25rem 1.25rem 0.75rem 1.25rem;
}
.ai-agreement {
  --sc-ai-agreement-footer-padding: 0rem 1.25rem 0.75rem 1.25rem;
}
.sc-rte-ask-ai-modal-loading{
    padding-top: 1.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

`;