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

interface ScModalElement extends HTMLElement {
  open: boolean;
  updateComplete?: Promise<unknown>;
}

interface ScModalConfiguration {
  open: boolean;
  width: string;
}

/** Keep React 18 state synchronized with the upgraded custom element and its prototype-matched width. */
export const configureScModal = (
  modal: HTMLElement | null,
  { open, width }: ScModalConfiguration,
) => {
  if (!modal) return;

  const applyConfiguration = () => {
    const scModal = modal as ScModalElement;
    scModal.open = open;

    const applyWidth = () => {
      const dialog = modal.shadowRoot?.querySelector<HTMLElement>('sl-dialog');
      dialog?.style.setProperty('--width', width, 'important');
    };

    if (scModal.updateComplete) void scModal.updateComplete.then(applyWidth);
    else applyWidth();
  };

  applyConfiguration();
  if (!customElements.get('sc-modal')) {
    void customElements.whenDefined('sc-modal').then(applyConfiguration);
  }
};
