import { css } from 'lit';
export default css`
  :host {
    --primary-color: #3b82f6;
    /* blue-500 */
    --secondary-color: #64748b;
    /* slate-500 */
    --background-color: #f8fafc;
    /* slate-50 */
    --text-color: #0f172a;
    /* slate-900 */
    --border-radius: 1rem;
    /* equivalent to rounded-2xl */
    --scrller-color: transparent;

    --font-type: 'SC Prosper Sans', -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol';
    display: block;
    height: 100%;
  }
  .wrap {
    height: 100%; 
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1px;
    border: 1px solid var(--sc-color-grey-150);
    background: var(--sc-color-grey-150);
  }
  #viewer {
    transform-origin: top left;
  }
  .rotation-box {
    transform-origin: center center;
  }
  .loading-masker {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 10000;
  }
  .blur-masker {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(255, 255, 255, 0.3);
    filter: blue(6px);
  }
  #viewer-root {
    background-color: #f9f9f9;
    flex: 1;
    overflow: auto;
    display: flex;
    position: relative;
    overscroll-behavior: none;
  }
  .fullscreen-mode {
    background-color: #f9f9f9;
  }
  .fullscreen-mode-img-center .real-dimension-box {
    top: 50%;
    transform: translate(-50%, -50%) !important;
  }
  .fullscreen-mode-video-center .real-dimension-box {
    top: 50%;
    transform: translate(-50%, -50%) !important;
  }
  .fallback-title {
    margin-top: 10px;
    margin-bottom: 8px;
    color: #525355;
    text-align: center;
    font-family: 'SC Prosper Sans';
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 150% */
  }
  .fallback-desc {
    color: #525355;
    text-align: center;
    font-family: 'SC Prosper Sans';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 171.429% */
  }
  #viewer-root span,
  #viewer-root div,
  #viewer-root li,
  #viewer-root b,
  #viewer-root strong,
  #viewer-root p {
    font-family: var(--font-type) !important;
  }
  #viewer-root
    .viewer-container
    .real-dimension-box
    #viewer
    .pptx-preview-wrapper {
    height: unset !important;
    overflow: unset !important;
  }
  .viewer-container {
    position: relative;
  }
  
  .scriber-layer {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;

    &.highlights {
      mix-blend-mode: multiply;
      z-index: 5;
    }
    svg {
      max-width: 100%;
      max-height: 100%;
      min-width: 100%;
      min-height: 100%;
    }
  }
  sc-scriber {
    left: 50%;
    transform: translateX(-50%);
  }

  .overflowhidden {
    overflow: hidden;
  }
  .mouseover {
    --scrller-color: #808080;
  }
  .docx-wrapper {
    background-color: transparent;
  }
  .pptx-preview-wrapper {
    background: transparent !important;
    overflow-x: hidden;
  }

  .x-spreadsheet-bottombar {
    padding: 0 !important;
  }
  .x-spreadsheet-bottombar .x-spreadsheet-menu li:nth-child(1) {
    display: none;
  }
  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .message-title {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .relative {
    position: relative;
  }

  .isolate {
    isolation: isolate;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .ml-2 {
    margin-left: 0.5rem;
  }

  .mt-2 {
    margin-top: 0.5rem;
  }

  .mt-6 {
    margin-top: 1.5rem;
  }

  .flex {
    display: flex;
  }

  .h-10 {
    height: 2.5rem;
  }

  .h-5 {
    height: 1.25rem;
  }

  .h-6 {
    height: 1.5rem;
  }

  .w-10 {
    width: 2.5rem;
  }

  .w-5 {
    width: 1.25rem;
  }

  .w-6 {
    width: 1.5rem;
  }

  .min-w-\[250px\] {
    min-width: 250px;
  }

  .max-w-fit {
    max-width: -moz-fit-content;
    max-width: fit-content;
  }

  .max-w-none {
    max-width: none;
  }

  .flex-shrink-0 {
    flex-shrink: 0;
  }

  .flex-grow {
    flex-grow: 1;
  }

  .flex-wrap {
    flex-wrap: wrap;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .gap-2 {
    gap: 0.5rem;
  }

  .gap-4 {
    gap: 1rem;
  }

  .space-x-2 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(0.5rem * var(--tw-space-x-reverse));
    margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
  }

  .rounded {
    border-radius: 0.25rem;
  }

  .rounded-2xl {
    border-radius: 1rem;
  }

  .rounded-3xl {
    border-radius: 1.5rem;
  }

  .rounded-full {
    border-radius: 9999px;
  }

  .border {
    border-width: 1px;
  }

  .border-2 {
    border-width: 2px;
  }

  .border-t {
    border-top-width: 1px;
  }

  .border-solid {
    border-style: solid;
  }

  .border-gray-200 {
    --tw-border-opacity: 1;
    border-color: rgb(229 231 235 / var(--tw-border-opacity, 1));
  }

  .border-slate-300 {
    --tw-border-opacity: 1;
    border-color: rgb(203 213 225 / var(--tw-border-opacity, 1));
  }

  .bg-white {
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
  }

  .object-cover {
    -o-object-fit: cover;
    object-fit: cover;
  }

  .p-2 {
    padding: 0.5rem;
  }

  .p-6 {
    padding: 1.5rem;
  }

  .pl-6 {
    padding-left: 1.5rem;
  }

  .pr-4 {
    padding-right: 1rem;
  }

  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .text-gray-400 {
    --tw-text-opacity: 1;
    color: rgb(156 163 175 / var(--tw-text-opacity, 1));
  }

  .text-gray-500 {
    --tw-text-opacity: 1;
    color: rgb(107 114 128 / var(--tw-text-opacity, 1));
  }

  .text-gray-600 {
    --tw-text-opacity: 1;
    color: rgb(75 85 99 / var(--tw-text-opacity, 1));
  }

  .text-gray-800 {
    --tw-text-opacity: 1;
    color: rgb(31 41 55 / var(--tw-text-opacity, 1));
  }

  .no-underline {
    text-decoration-line: none;
  }

  .filter {
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast)
      var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert)
      var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }

  .transition-colors {
    transition-property: color, background-color, border-color,
      text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }

  .attachments {
  }
  .attachments a > div {
    border: 1px solid #e5e7eb;
  }
  .attachments a > div:hover {
    border-color: rgb(59 130 246 / var(--tw-border-opacity, 1));
    background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
  }
  .image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .video-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .video-wrapper video {
    width: 80%;
  }
  .text-wrapper {
    line-height: 1.375rem;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .empty-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
  }

  ::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--scrller-color);
    border-radius: 5px;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 5px;
  }
`;
