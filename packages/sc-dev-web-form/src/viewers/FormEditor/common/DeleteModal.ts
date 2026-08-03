import { html } from 'lit';

export const DeleteModal = (title: string, onDelete: () => void, onClose: () => void) => {
  return html`
    <sc-modal 
      size=sm 
      open
      header='Delete this ${title}?'
    >
      Once deleted, your ${title} cannot be recovered!
      <div slot=footer>
        <div>
          <sc-button size=sm @click=${onClose} width=6.25rem type=secondary>Cancel</sc-button>
          <sc-button size=sm @click=${onDelete} state=error width=6.25rem>Confirm</sc-button>
        </div>
      </div>
    </sc-modal>
  `;
};