import { createComponent } from '@scdevkit/webkit/react';

// Keep the WebKit registration boundary in one place so Base surfaces never
// import the custom-element package directly.
export const ScAvatar = createComponent('sc-avatar');
export const ScBadge = createComponent('sc-badge');
export const ScButton = createComponent('sc-button');
export const ScCard = createComponent('sc-card');
export const ScDialog = createComponent('sc-dialog');
export const ScDivider = createComponent('sc-divider');
export const ScModal = createComponent('sc-modal');
export const ScMenu = createComponent('sc-menu');
export const ScMenuItem = createComponent('sc-menu-item');
export const ScParagraph = createComponent('sc-paragraph');
export const ScSpinner = createComponent('sc-spinner');
export const ScTextInput = createComponent('sc-text-input');
export const ScTitle = createComponent('sc-title');

/** ScModal exposes preset widths only; override its nested Shoelace panel for prototype-matched surfaces. */
export const setScModalWidth = (modal: HTMLElement | null, width: string) => {
  if (!modal) return;
  void customElements.whenDefined('sc-modal').then(() => {
    const dialog = modal.shadowRoot?.querySelector<HTMLElement>('sl-dialog');
    dialog?.style.setProperty('--width', width, 'important');
  });
};
