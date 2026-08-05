import { html, css } from 'lit';


/* CSS Styles for the ScRichTextEditor component */
export const ScRichTextEditorStyle = html`
  <style>
    .sc-rte-container {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      font-family: var(--sc-font-family);
      --sc-rte-border-color: var(--sc-rich-text-editor-main-border-color);
      --sc-rte-bg-color: var(--sc-rich-text-editor-main-bg-color);
      --sc-rte-color: var(--sc-rich-text-editor-main-color);
      --sc-rte-drawer-panel-min-height: 700px;
    }
    .sc-rte-container > .sc-form-group-label + sc-rte-toolbar-v2 {
      margin-top: -0.5rem; /* cancels the gap between label and toolbar */
    }
    .sc-rte-container > .sc-form-group-label {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .sc-rte-container > .sc-form-group-label .sc-label-tooltip {
      display: inline-block;
      align-items: center;
      color: var(--sc-color-blue-500);
      margin-bottom: 0.25rem;
    }
    .sc-rte-content {
      display: flex;
      gap: 0.5rem;
    }
    .sc-rte-content .sc-form-group {
      flex: 1;
    }
    .sc-rte-content .sc-form-group .sc-form-group-label {
      display: none !important; /* hide label in content area */
    }
    .card-content-image-wrapper {
      width: 100%;
    }

    .drawer__panel {
      min-height: var(--sc-rte-drawer-panel-min-height);
    }

    .sc-rte-revision-bar {
      display: flex;
      width: 100%;
      gap: 0.5rem;
      justify-content: end;
    }
    .sc-rich-text-editor {
      padding: 0 !important;
      /* padding-right: 0.125rem !important; */
    }
    .sc-rich-text-editor [contenteditable='true']:focus {
      outline: 2px solid var(--sc-rte-focus-border-color);
    }
    .sc-rich-text-editor [contenteditable='true']:focus-visible {
      outline: 2px solid var(--sc-rte-focus-border-color);
    }
    .sc-rich-text-editor
      [contenteditable='true']
      blockquote:not(blockquote[style]) {
      padding-left: 20px;
      position: relative;
    }
    .sc-form-group-readonly .sc-rich-text-editor {
      padding: 0 0.75rem !important;
    }
    .sc-form-group-disabled .sc-rich-text-editor {
      cursor: not-allowed;
    }

    /* Override TinyMCE styles */
    .tox .tox-edit-area__iframe,
    .tox .tox-editor-container {
      background-color: transparent !important;
    }

    /* Snackbar positioning and styling */
    .sc-rte-container sc-snackbar::part(base) {
      background: var(--sc-color-white);
      color: var(--sc-color-grey-700);
      box-shadow: var(--sc-color-grey-500) 0px 1px 4px 0px;
      width: max-content;
      position: absolute;
      top: 0;
    }

    /* Hide TinyMCE notifications */
    .tox-notifications-container {
      display: none !important;
    }
    
    .tox .tox-statusbar__wordcount {
      display: none;
    }

    .character-count {
      order: 3;
      font-size: 0.625rem;
      margin-top: var(--sc-form-group-help-margin-top, 0.25rem);
      flex-shrink: 0;
    }

    .helpText-container{
      display:flex;
      justify-content: space-between;
      align-items: top;
      width: 100%;
      gap:0.625rem;
    }

    .sc-rte-fullscreen-link {
      display: flex;
      align-items: center;
      margin-top: -0.5rem;
    }

    .sc-ai-draggable-box {
      margin-top: -0.5rem;
    }
  </style>
`;


/* CSS Styles for editor box component inside the ScRichTextEditor */
export const editorContentStyles = css`
  :root {
    --sc-font-family-mono: "Roboto Mono", -apple-system, BlinkMacSystemFont, sans;

    /** bit difference is intentional for color matching */
    --sc-rte-color: var(--sc-rich-text-editor-main-color, #000001);
    --sc-rte-bg-color: var(--sc-rich-text-editor-main-bg-color, #fffffe);
    --sc-rte-border-color: var(--sc-color-grey-200, #CCCCCC);

    background-color: var(--sc-rte-bg-color);
    color: var(--sc-rte-color);
    --is-dark: ;
    
    &.sc-mode-dark {
      --is-dark: initial;
      --is-light: ;
      --sc-rte-color: var(--sc-rich-text-editor-main-color, #fffffe);
      --sc-rte-bg-color: var(--sc-rich-text-editor-main-bg-color, #000001);
      --sc-rte-border-color: var(--sc-color-grey-200-dark, #333333);
    }
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  body {
    overflow: auto;
    position: relative;
  }

  /* Block elements reset */
  html, body, div,
  dl, dt, dd, ol, ul, li,
  fieldset, form, legend,
  caption, tbody, tfoot, thead,
  article, aside, canvas, details,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, section, summary {
    margin: 0;
    padding: 0;
    border: 0;
    box-sizing: border-box;
  }

  /* Inline elements reset */
  a, abbr, acronym, address, cite, code,
  dfn, img, kbd, q, s, samp,
  time, mark, audio, video, embed,
  ruby, label, applet, object, iframe, center {
    margin: 0;
    padding: 0;
    border: 0;
  }

  /* Text formatting preserve semantic styles */
  b, strong { font-weight: bold !important; }
  i, em { font-style: italic !important; }
  u { text-decoration: underline !important; }
  sub { vertical-align: sub; font-size: smaller; }
  sup { vertical-align: super; font-size: smaller; }

  /* Span must inherit formatting from parent */
  span {
    font-weight: inherit;
    font-style: inherit;
    text-decoration: inherit;
  }

  pre, code {
    &, &[class*=language-] {
      font-family: var(--sc-font-family-mono, monospace);
      font-size: 0.875rem;
      text-shadow: none;
    }
  }
  code {
    background-color: var(--is-dark, var(--sc-color-grey-50-dark)) 
      var(--is-light, var(--sc-color-grey-50, #F2F2F2));
  }
  :root.sc-rte-disabled,
  .mce-content-body.sc-rte-disabled {
    cursor: not-allowed;
    color: var(--is-dark, var(--sc-color-grey-400-dark)) 
      var(--is-light, var(--sc-color-grey-400));
  }
  .mce-content-body {
    font-family: var(--sc-font-family);
    margin: 0;
    padding: 0.5rem 0.75rem;
  }
  .mce-content-body [data-mce-selected=inline-boundary] {
    background-color: inherit;
  }
  /* placeholder styling */
  .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
    left: 0.75rem !important;
  }
  /*.mce-content-body::-webkit-scrollbar {
    width: 0.3125rem;
    height: 0.3125rem;
  }
  .mce-content-body::-webkit-scrollbar-track {
    margin: 0.5rem 0.75rem;
  }
  .mce-content-body::-webkit-scrollbar-thumb {
    background: var(--sc-color-grey-500);
    border-radius: 0.5rem;
  }
  .mce-content-body::-webkit-scrollbar-button {
    background-color: transparent;
    border-radius: 0.5rem;
    height: 0.5rem;
  }*/
  .mce-content-body > :first-child {
    margin-top: 0;
  }

  ins,
  ins * {
    background: var(--is-dark, var(--sc-color-green-50-dark)) 
      var(--is-light, var(--sc-color-green-50));
  }
  del,
  del * {
    background: var(--is-dark, var(--sc-color-red-50-dark)) 
      var(--is-light, var(--sc-color-red-50));
    color: var(--is-dark, var(--sc-color-grey-400-dark)) 
      var(--is-light, var(--sc-color-grey-400));
  }
  h1 {
    line-height: 1.6;
    font-size: 2.1875rem;
    font-weight: normal;
  }
  h2 {
    line-height: 1.35;
    font-size: 1.75rem;
    font-weight: normal;
  }
  h3 {
    line-height: 1.33;
    font-size: 1.3125rem;
    font-weight: normal;
  }
  h4 {
    line-height: 1.4;
    font-weight: 700;
    font-size: 1.09375rem;
  }
  h5 {
    line-height: 1.4;
    font-size: 1.09375rem;
    font-weight: normal;
  }
  h6,
  div,
  p,
  aside,
  section {
    font-weight: 400;
  }
  h6 {
    font-size: 0.875rem;
    font-weight: normal;
  }
  div {
    font-size: 1rem;
  }
  p {
    font-size: 0.875rem;
  }
  span {
    font-size: inherit;
  }
  aside {
    font-size: 0.75rem;
  }
  section {
    font-size: 0.625rem;
  }

  blockquote:not(blockquote[style]) {
    padding-left: 20px;
    position: relative;
  }

  blockquote:not(blockquote[style]):before {
    content: '';
    position: absolute;
    width: 5px;
    height: 100%;
    left: 0px;
    top: 0px;
    background-color: var(--is-dark, var(--sc-color-grey-200-dark)) 
      var(--is-light, var(--sc-color-grey-200));
  }

  /* List styles */
  ul, ol,  dl {
    padding-left: 2em;
  }

  ul ul,
  ol ol,
  ul ol,
  ol ul {
    margin: 0.5em 0;
  }

  li {
    line-height: 1.4;
  }

  dt {
    font-weight: bold;
    margin-left: -2em;
  }

  details[data-mce-selected] summary {
    outline: none;
  }

  [style^='color:windowtext' i],
  [style^='color: windowtext' i],
  [style*=';color:windowtext' i],
  [style*='; color:windowtext' i],
  [style*=';color: windowtext' i],
  [style*='; color: windowtext' i] {
    color: var(--sc-rte-color, var(--sc-color-black)) !important;
  }

  hr {
    border-color: var(--sc-rte-border-color);
  }

  /* Table styles */
  table {
    border-spacing: 0px;
    outline: unset !important;
  }

  /*table[data-mce-selected] {
    outline: 1px solid var(--sc-color-grey-600) !important;
  }*/

  th, thead td {
    text-align: left;
    white-space: nowrap;
    font-weight: normal;
    font-size: 0.875rem;
    box-sizing: border-box;
    color: var(--is-dark, var(--sc-color-blue-900-dark)) 
      var(--is-light, var(--sc-color-blue-900));

    table[border]:not([border="0"]):not([style*=border-style]) & {
      border-bottom-width: 2px;
    }
  }

  tbody tr {
    background-color: transparent;
  }

  td {
    font-size: 0.875rem;
    font-weight: normal;
    cursor: inherit;
    padding-left: 5px;
    padding-right: 0;
    box-sizing: border-box;
  }

  /* Target only cells without Excel border styling */
  /* tbody tr:not(:first-child)
    td:not([style*='border-top']):not([style*='border-right']):not(
      [style*='border-bottom']
    ):not([style*='border-left']):not([style*='border:']) {
    border-top: 1px solid;
    border-color: var(--sc-color-grey-150) !important;
  }

  tbody
    td:not([style*='border-top']):not([style*='border-right']):not(
      [style*='border-bottom']
    ):not([style*='border-left']):not([style*='border:']) {
    border-width: 1px !important;
    border-style: solid !important;
    border-color: var(--sc-color-grey-150) !important;
  } */

  /* Apply general cell styling with !important for TinyMCE override */
  tbody td {
    padding-left: 8px !important;
    padding-right: 8px !important;
    box-sizing: border-box !important;
  }

  /* Override TinyMCE's default table borders only when no Excel borders exist */
  /* table:not([style*='border']) tbody td:not([style*='border']) {
    border: 1px solid var(--sc-color-grey-150) !important;
  } */
  
  /** override tinymce dotted border placeholder */
  table[style*="border-width: 0px"], table[border="0"], table:not([border]) {
    &, &.mce-item-table {
      &, caption, td, th {
        border: 1px solid transparent;
      }
    }
    &.mce-item-table[data-mce-selected="1"], &:hover {
      &, caption, td, th {
        border: 1px solid transparent;
        outline-width: 1px;
        outline-style: dashed;
        outline-color: var(--is-dark, var(--sc-color-grey-150-dark)) 
          var(--is-light, var(--sc-color-grey-150));
      }
    }
  }
  table[border]:not([border="0"]):not([style*=border-color]) {
    td, th {
      border-color: var(--sc-rte-border-color);
    }
  }
  
  /* Ensure Excel inline border styles take precedence by using higher specificity */
  tbody td[style*='border-top'],
  tbody td[style*='border-right'],
  tbody td[style*='border-bottom'],
  tbody td[style*='border-left'],
  tbody td[style*='border:'] {
    border-image: initial !important;
  }

  /* Ensure hover doesn't override custom background colors */
  /*table[data-mce-selected] tbody tr:hover td:not([style*='background-color']) {
    background: var(--sc-rich-text-editor-table-cell-hover-bg-color, var(--sc-color-blue-lightest));
  }

  tbody tr:hover td[style*='background-color'] {
    filter: brightness(0.95);
  }*/
`;