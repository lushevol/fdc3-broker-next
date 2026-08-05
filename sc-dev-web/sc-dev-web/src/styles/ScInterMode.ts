import { css } from 'lit';

export default css`
/* Inter mode component definition */
  :host,
  .sc-mode-inter {
    --sc-font-family: "Inter", "SC Prosper Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    --sl-font-sans: var(--sc-font-family);
    --sl-font-mono: var(--sc-font-family);
    --sl-font-serif: var(--sc-font-family);
    font-family: var(--sc-font-family);
  }

`;
  