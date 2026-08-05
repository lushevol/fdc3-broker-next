import { css } from 'lit';

export default css`
  pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 1rem;
  }
  code.hljs {
    padding: 3px 5px;
  }
  pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 1rem;
  }
  code.hljs {
    padding: 3px 5px;
  }
  /* end baseline CSS */
  .text-wrapper {
    --font-type: monospace;
    min-height: 100%;
    background: var(--sc-color-grey-50);
    color: var(--sc-color-grey-700);
  }
  /* Base color: saturation 0; */
  .hljs-subst {
    /* default */
  }
  /* purposely ignored */
  .hljs-formula,
  .hljs-attr,
  .hljs-property,
  .hljs-params {
  }
  .hljs-comment {
    color: var(--sc-color-grey-650);
  }
  .hljs-tag,
  .hljs-punctuation {
    color: var(--sc-color-grey-700);
  }
  .hljs-tag .hljs-name,
  .hljs-tag .hljs-attr {
    color: var(--sc-color-grey-700);
  }
  .hljs-keyword,
  .hljs-attribute,
  .hljs-selector-tag,
  .hljs-meta .hljs-keyword,
  .hljs-doctag,
  .hljs-name {
    font-weight: 400;
  }
  /* User color: hue: 0 */
  .hljs-type,
  .hljs-string,
  .hljs-number,
  .hljs-selector-id,
  .hljs-selector-class,
  .hljs-quote,
  .hljs-template-tag,
  .hljs-deletion {
    color: var(--sc-color-red-700);
  }
  .hljs-title,
  .hljs-section {
    color: var(--sc-color-red-700);
    font-weight: 400;
  }
  .hljs-regexp,
  .hljs-symbol,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-link,
  .hljs-selector-attr,
  .hljs-operator,
  .hljs-selector-pseudo {
    color: var(--sc-color-maroon-500);
  }
  /* Language color: hue: 90; */
  .hljs-literal {
    color: var(--sc-color-grey-650);
  }
  .hljs-built_in,
  .hljs-bullet,
  .hljs-code,
  .hljs-addition {
    color: var(--sc-color-green-650);
  }
  /* Meta color: hue: 200 */
  .hljs-meta {
    color: var(--sc-color-blue-450);
  }
  .hljs-meta .hljs-string {
    color: var(--sc-color-blue-400);
  }
  /* Misc effects */
  .hljs-emphasis {
    font-style: italic;
  }
  .hljs-strong {
    font-weight: 400;
  }

  .hljs-ln-numbers {
    text-align: center;
    color: var(--sc-color-grey-200);
    border-right: 1px solid var(--sc-color-grey-400);
    vertical-align: top;
    padding-right: 5px;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .hljs-ln-code {
    padding-left: 10px;
  }
  .hljs-ln-n::before {
    content: attr(data-line-number);
    color: var(--sc-color-grey-400);
  }

  .hljs-variable {
    color: var(--sc-color-orange-400);
  }
  .hljs-title {
    color: var(--sc-color-orange-400);
  }
  .hljs-variable + .hljs-title {
    color: var(--sc-color-green-500);
  }
  .hljs-string {
    color: var(--sc-color-blue-400);
  }
  .hljs-keyword {
    color: var(--sc-color-magenta-400);
  }
  .hljs-keyword + .hljs-title {
    color: var(--sc-color-purple-400);
  }
  .hljs-params {
    color: var(--sc-color-purple-400);
  }
  .hljs-property {
    color: var(--sc-color-green-500);
  }
  .hljs-literal {
    color: var(--sc-color-magenta-400);
  }
`;
