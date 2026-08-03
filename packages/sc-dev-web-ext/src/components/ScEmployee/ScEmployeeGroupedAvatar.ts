import { html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { EmployeeGroupedAvatarStyle } from './ScEmployee.style.js';
import ScExtElement from '../../shared/sc-ext-element.js';
import { ScEmployeeAvatar } from './ScEmployeeAvatar.js';
import type { ScAvatar } from '@scdevkit/webkit';

export class ScEmployeeGroupedAvatar extends ScExtElement {

  static styles = [EmployeeGroupedAvatarStyle];

  @property({ type: Array }) ids: string[] = [];

  @property({ type: String, attribute: 'size' }) size = 'lg';

  @property({ type: String, attribute: false }) avatarSize = '3rem';

  @property({ type: Number, attribute: 'max-number' }) maxNumber = 5;
  
  @property({ type: Boolean, attribute: 'prevent-default-action' }) preventDefaultAction = false;

  @property({ type: String, attribute: 'modal-header' }) modalHeader = '';

  @query('.sc-employee-grouped-avatar') private groupedAvatarContainer!: HTMLDivElement;

  @state() private maxVisibleAvatars = 1;
  @state() private showModal = false;

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    
    this.checkForAvatarResize();
  }
  
  async checkForAvatarResize(): Promise<void> {
    const scEmployeeAvatar = this.getScEmployeeAvatarElement();
    await scEmployeeAvatar?.updateComplete;

    const scAvatar = this.getScAvatarElement();
    await scAvatar?.updateComplete;

    this.calculateMaxVisibleAvatars();
  }

  connectedCallback() {
    super.connectedCallback();
    this.calculateMaxVisibleAvatars();
    window.addEventListener('resize', this.calculateMaxVisibleAvatars.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.calculateMaxVisibleAvatars.bind(this));
  }

  getScAvatarElement() {
    const scEmployeeAvatar = this.getScEmployeeAvatarElement();
    let scAvatar = null;
    if (scEmployeeAvatar) {
      scAvatar = scEmployeeAvatar?.shadowRoot?.querySelector<ScAvatar>('sc-avatar');
    }
    return scAvatar;
  }

  getScEmployeeAvatarElement() {
    const container = this.groupedAvatarContainer;
    let scEmployeeAvatar = null;
    if (container) {
      scEmployeeAvatar = container.querySelector<ScEmployeeAvatar>('sc-employee-avatar');
    }
    return scEmployeeAvatar;
  }

  findSiblingGroupedAvatars(currentAvatar: ScEmployeeGroupedAvatar): { siblingIdsCount: number; rowIndex: number } {
    let parentContainer: HTMLElement | null = currentAvatar.parentElement;

    while (parentContainer) {
      const allGroupedAvatars = Array.from(
        parentContainer.querySelectorAll('sc-employee-grouped-avatar')
      ) as ScEmployeeGroupedAvatar[];

      if (allGroupedAvatars.length > 1) {
        const siblingRows = allGroupedAvatars.filter(avatar => avatar !== currentAvatar);
        const siblingIdsCount = siblingRows.reduce((totalIds, avatar) => {
          const ids = JSON.parse(avatar.getAttribute('ids') || '[]');
          return totalIds + ids.length;
        }, 0) - this.ids.length; 
        const rowIndex = siblingRows.indexOf(currentAvatar);
        return { siblingIdsCount: siblingIdsCount * 2, rowIndex: rowIndex === -1 ? allGroupedAvatars.indexOf(currentAvatar) : rowIndex };
      }
      parentContainer = parentContainer.parentElement;
    }

    const rootNode = currentAvatar.getRootNode();
    if (rootNode instanceof ShadowRoot) {
      const shadowHost = rootNode.host as HTMLElement;
      parentContainer = shadowHost.parentElement;

      while (parentContainer) {
        const allGroupedAvatars = Array.from(
          parentContainer.querySelectorAll('sc-employee-grouped-avatar')
        ) as ScEmployeeGroupedAvatar[];

        if (allGroupedAvatars.length > 1) {
          const siblingRows = allGroupedAvatars.filter(avatar => avatar !== currentAvatar);
          const siblingIdsCount = siblingRows.reduce((totalIds, avatar) => {
            const ids = JSON.parse(avatar.getAttribute('ids') || '[]');
            return totalIds + ids.length;
          }, 0) - this.ids.length; 
          const rowIndex = siblingRows.indexOf(currentAvatar);
          return { siblingIdsCount: siblingIdsCount * 2, rowIndex: rowIndex === -1 ? allGroupedAvatars.indexOf(currentAvatar) : rowIndex };
        }
        parentContainer = parentContainer.parentElement;
      }
    }

    return { siblingIdsCount: 0, rowIndex: -1 };
  }

  calculateMaxVisibleAvatars() {
    const container = this.groupedAvatarContainer;
    const scAvatar = this.getScAvatarElement();

    if (scAvatar && 'avatarSize' in scAvatar) {
      this.avatarSize = scAvatar.avatarSize as string;
    } else if (scAvatar) {
      const scAvatarDimension = scAvatar.getBoundingClientRect();
      const avatarSizeInRem = this.convertPxToRem(scAvatarDimension.width);
      if (scAvatarDimension.width) {
        this.avatarSize = avatarSizeInRem;
      }
    }

    const containerWidth = container?.clientWidth || 0;
    const avatarSize = this.getAvatarSizeInPixels();
    const newMaxVisibleAvatars = Math.floor((containerWidth - avatarSize.actualViewableSize) / avatarSize.offsetSize);

    if (newMaxVisibleAvatars !== this.maxVisibleAvatars) {
      this.maxVisibleAvatars = newMaxVisibleAvatars;
    }

    if (!container) {
      return;
    }

    const { siblingIdsCount, rowIndex } = this.findSiblingGroupedAvatars(container as unknown as ScEmployeeGroupedAvatar);
    const allRows = [container];
    const sortedRows = allRows.sort((a, b) => {
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    let maxZIndex = 0;

    sortedRows.forEach((row, currentRowIndex) => {
      const avatars = Array.from(row.children);
      avatars.forEach((avatar, index) => {
        const zIndex = maxZIndex + siblingIdsCount + index + 1;
        (avatar as HTMLElement).style.zIndex = zIndex.toString();
      });

      if (avatars.length > 0) {
        maxZIndex += avatars.length;
      }
    });
  }

  convertRemToPx(remValue: string | number, rootFontSize = 16): number {
    const numericValue = typeof remValue === 'number' ? remValue : parseFloat(remValue.replace('rem', ''));
    return numericValue * rootFontSize;
  }
  
  convertPxToRem(pxValue: number, rootFontSize = 16): string {
    const remValue = pxValue / rootFontSize;
    return `${remValue}rem`;
  }

  getAvatarSizeInPixels(): { actualViewableSize: number, offsetSize: number, offset: number } {
    const rootFontSize = 16;

    const actualAvatarSize = parseFloat(this.avatarSize.replace('rem', ''));

    const actualBorderSize = (Math.floor((actualAvatarSize * rootFontSize) * 0.0834) / rootFontSize) * 2;
    const actualViewableSize = actualAvatarSize + actualBorderSize;
    const offset = actualAvatarSize * 0.25;
    return { actualViewableSize: this.convertRemToPx(actualViewableSize), offsetSize: this.convertRemToPx(actualViewableSize - offset), offset: this.convertRemToPx(offset) };
  }

  renderCustomStyle() {
    const { avatarSize } = this;
    const variableStyle = html`
    <style>
      :host {
        --sc-avatar-size: ${avatarSize};
        --sc-employee-grouped-avatar-offset: calc(var(--sc-avatar-size) * 0.25);
        --sc-employee-grouped-avatar-border-width: calc(var(--sc-avatar-size) * 0.0834);
        --sc-employee-grouped-avatar-font-size: calc(var(--sc-avatar-size) * 0.5833);
      }

      .modal-body {
        min-height: 8.125rem;
        margin: -1rem 0.5rem 0;
      }
      
      .modal-avatar-container {
        display: flex;
        flex-direction: column;
        gap: var(--sc-spacing-12);
        padding-top: var(--sc-spacing-12);
      }
      
      .modal-avatar-item {
        display: flex;
        gap: var(--sc-spacing-8);
      }
    </style>`;
    return variableStyle;
  }

  comptuteOverflowCount(): number {
    const renderAvatarNum = Math.min(this.maxVisibleAvatars, this.maxNumber);
    return (this.ids.length - renderAvatarNum) || 0;
  }

  private handleClick = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    this.emit('sc-action', {
      detail: {
        target: event.target,
        ids: this.ids,
        maxVisibleAvatars: this.maxVisibleAvatars,
        avatarSize: this.avatarSize,
      },
    });
    if (this.preventDefaultAction) return;
    this.showModal = !this.showModal;
  };

  renderShowAllAvatarModal() {
    return html`
      <sc-modal
        ?open=${this.showModal}
        size="sm"
        footer-type="button"
        .header=${this.modalHeader || `View all (${this.ids.length})`}
        @sc-hide=${() => this.showModal = false}
      >
        <div class="modal-body">
          <div class='modal-avatar-container'>
            ${this.ids.map(item => html`
              <div class='modal-avatar-item'>
                <sc-employee-avatar id="${item}" avatar-size="sm"></sc-employee-avatar>
                <sc-employee-name id="${item}"></sc-employee-name>
              </div>
            `)}
          </div>
        </div>
        <div slot="footer-button">
          <sc-button type="secondary" size="sm" @click=${() => this.showModal = false}>Close</sc-button>
        </div>
      </sc-modal>
    `;
  }

  render() {
    const maxVisibleAvatars = this.comptuteOverflowCount() === 1 ? this.maxVisibleAvatars + 1 : this.maxVisibleAvatars;
    const renderAvatarNum = Math.min(maxVisibleAvatars, this.maxNumber);
    return html`
      ${this.renderCustomStyle()}
      ${this.showModal ? this.renderShowAllAvatarModal() : nothing}
      <div class='sc-employee-grouped-avatar'>
      ${(this.ids || [])
    .slice(0, renderAvatarNum)
    .map((id, index) => 
      index < renderAvatarNum ? html`
          <div class="avatar" style="z-index: ${index + 1}">
            <sc-employee-avatar id="${id}" avatar-size="${this.size}"></sc-employee-avatar>
          </div>
        ` : nothing)}
        
        ${this.comptuteOverflowCount() > 1 ? html`
        <div
          class="avatar"
          style="z-index: ${this.maxVisibleAvatars + 1}"
        >
          <a
            @click=${this.handleClick}
            class="avatar-overflow-count"
          >
            <div>+${this.comptuteOverflowCount()}</div>
          </a>
        </div>
        ` : null}
      </div>
    `;
  }
}
