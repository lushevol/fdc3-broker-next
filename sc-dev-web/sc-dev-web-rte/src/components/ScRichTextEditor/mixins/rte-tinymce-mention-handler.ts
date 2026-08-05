import { Editor } from 'hugerte';
import { html, render } from 'lit-html';

export class RteMentionHandler {
  private editor: Editor | null = null;
  private graphQLClient: any = null;
  private menu: HTMLElement | null = null;
  private activeIndex = 0;
  private items: any[] = [];
  private isOpen = false;
  private currentMentionRange: Range | null = null;
  private clickedChip: HTMLElement | null = null;

  initialize(editor: Editor, graphQLClient: any): void {
    this.editor = editor;
    this.graphQLClient = graphQLClient;
    this.createMenu();

    // @ts-ignore
    if (editor.initialized) {
      this.injectChipStyles();
    } else {
      editor.on('init', () => this.injectChipStyles());
    }

    editor.on('keyup', e => this.handleInput(e));
    editor.on('keydown', e => this.handleNavigation(e));
    editor.on('click', e => this.handleClick(e));
    editor.on('blur', () => this.closeMenu());
  }

  private createMenu(): void {
    if (document.getElementById('sc-rte-mention-menu')) {
      this.menu = document.getElementById('sc-rte-mention-menu') as HTMLElement;
      return;
    }

    this.menu = document.createElement('div');
    this.menu.id = 'sc-rte-mention-menu';
    Object.assign(this.menu.style, {
      position: 'absolute',
      display: 'none',
      zIndex: '9999',
      backgroundColor: 'var(--sc-color-white, #ffffff)',
      border: '0.0625rem solid var(--sc-color-grey-150, #D9D9D9)',
      borderRadius: '0.375rem',
      boxShadow: '0 0.25rem 0.625rem rgba(0, 0, 0, 0.12)',
      width: '17.5rem',
      maxHeight: '18.75rem',
      overflowY: 'auto',
      fontFamily: 'var(--sc-font-family, sans-serif)',
    });
    document.body.appendChild(this.menu);
  }

  private async handleClick(e: MouseEvent): Promise<void> {
    const target = e.target as HTMLElement;
    const chip = target.closest('.sc-mention') as HTMLElement;

    if (!chip) {
      this.closeMenu();
      return;
    }

    e.preventDefault();
    this.clickedChip = chip;

    const employeeId = chip.getAttribute('data-mention-id') || '';
    const employeeName = chip.getAttribute('data-mention-name') || '';

    let users: any[] = [];

    // Try exact ID lookup first
    if (employeeId) {
      const user = await this.getEmployeeById(employeeId);
      if (user) users = [user];
    }

    // Fallback: If exact ID lookup failed, search by name
    if (users.length === 0 && employeeName) {
      users = await this.searchEmployees(employeeName);
    }

    if (users.length > 0) {
      this.items = users;
      this.renderMenu(users);
      this.positionMenuAtChip(chip);
    }
  }

  private async handleInput(e: KeyboardEvent): Promise<void> {
    if (!this.editor) return;
    this.clickedChip = null;

    const rng = this.editor.selection.getRng();
    if (!rng.collapsed) return;

    const textContent = rng.startContainer.textContent || '';
    const caretPos = rng.startOffset;
    const textBeforeCaret = textContent.slice(0, caretPos);
    const lastAtPos = textBeforeCaret.lastIndexOf('@');

    if (
      lastAtPos === -1 ||
      (lastAtPos > 0 && /\S/.test(textBeforeCaret[lastAtPos - 1]))
    ) {
      this.closeMenu();
      return;
    }

    const keyword = textBeforeCaret.slice(lastAtPos + 1);

    this.currentMentionRange = document.createRange();
    this.currentMentionRange.setStart(rng.startContainer, lastAtPos);
    this.currentMentionRange.setEnd(rng.startContainer, caretPos);

    const users = await this.searchEmployees(keyword);
    if (users.length > 0) {
      this.items = users;
      this.createMenu();
      this.renderMenu(users);
      this.positionMenu(this.currentMentionRange);
    } else {
      this.closeMenu();
    }
  }

  private handleNavigation(e: KeyboardEvent): void {
    if (!this.isOpen) return;

    switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % this.items.length;
      this.highlightItem();
      break;
    case 'ArrowUp':
      e.preventDefault();
      this.activeIndex =
          (this.activeIndex - 1 + this.items.length) % this.items.length;
      this.highlightItem();
      break;
    case 'Enter':
    case 'Tab':
      e.preventDefault();
      this.selectItem(this.items[this.activeIndex]);
      break;
    case 'Escape':
      this.closeMenu();
      break;
    }
  }

  private renderMenu(users: any[]): void {
    if (!this.menu) return;

    while (this.menu.firstChild) {
      this.menu.removeChild(this.menu.firstChild);
    }
    this.activeIndex = 0;

    users.forEach((user, index) => {
      const item = document.createElement('div');
      item.className = 'sc-mention-item';
      Object.assign(item.style, {
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 0.75rem',
        cursor: 'pointer',
        borderBottom:
          index < users.length - 1
            ? '0.0625rem solid var(--sc-color-grey-50, #F2F2F2)'
            : 'none',
        transition: 'background-color 0.15s',
      });

      item.onmouseenter = () => {
        this.activeIndex = index;
        this.highlightItem();
      };
      item.onmousedown = e => e.preventDefault();
      item.onclick = () => this.selectItem(user);

      // Create avatar container
      const avatarContainer = document.createElement('div');
      avatarContainer.className = 'sc-mention-item-avatar';
      avatarContainer.style.cssText = 'display: flex; align-items: center; margin-right: 0.75rem; flex-shrink: 0;';

      // Create and configure ScAvatar
      const avatar = document.createElement('sc-avatar') as any;
      avatar.size = 'md';
      avatar.src = `/_data/profile/pics/${user.id}/photo_lg.jpg`;
      avatarContainer.appendChild(avatar);

      // Create text container
      const textContainer = document.createElement('div');
      textContainer.className = 'sc-mention-item-text';
      textContainer.style.cssText = 'overflow: hidden; flex: 1;';

      render(html`
        <sc-paragraph
          class="sc-mention-item-name"
          size="md"
          ellipsis="true"
          rows="1"
          style="
            color: var(--sc-color-blue-900, #00172E);
          "
        >
          ${this.escapeHtml(user.name)}
        </sc-paragraph>

        <sc-paragraph
        class="sc-mention-item-details"
        size="sm"
        ellipsis="true"
        rows="1"
        style="
          color: var(--sc-color-grey-500, #808080);
          margin-top: 0.125rem;
        "
        >
          ${
  user.businessTitle
    ? `${this.escapeHtml(user.businessTitle)  } • `
    : ''
}${user.id}
        </sc-paragraph>
      `, textContainer);

      item.appendChild(avatarContainer);
      item.appendChild(textContainer);

      this.menu!.appendChild(item);
    });

    this.isOpen = true;
    this.menu.style.display = 'block';
    this.highlightItem();
  }

  private highlightItem(): void {
    if (!this.menu) return;
    Array.from(this.menu.children).forEach((child, i) => {
      (child as HTMLElement).style.backgroundColor =
        i === this.activeIndex
          ? 'var(--sc-color-blue-50, #E5F1FC)'
          : 'transparent';
    });
  }

  private positionMenu(rng: Range): void {
    if (!this.menu || !this.editor) return;
    const rect = rng.getClientRects()[0];
    if (!rect) return;
    const iframe = this.editor.getContainer()?.querySelector('iframe');
    const iframeRect = iframe?.getBoundingClientRect();
    if (!iframeRect) return;

    this.menu.style.top = `${
      iframeRect.top + rect.bottom + window.scrollY + 4
    }px`;
    this.menu.style.left = `${iframeRect.left + rect.left + window.scrollX}px`;
  }

  private positionMenuAtChip(chip: HTMLElement): void {
    if (!this.menu || !this.editor) return;
    const iframe = this.editor.getContainer()?.querySelector('iframe');
    const iframeRect = iframe?.getBoundingClientRect();
    if (!iframeRect) return;
    const chipRect = chip.getBoundingClientRect();

    this.menu.style.top = `${
      iframeRect.top + chipRect.bottom + window.scrollY + 4
    }px`;
    this.menu.style.left = `${
      iframeRect.left + chipRect.left + window.scrollX
    }px`;
  }

  private selectItem(user: any): void {
    if (!this.editor) return;

    const html = `<span class="sc-mention" data-mention-id="${
      user.id
    }" data-mention-name="${this.escapeHtml(
      user.name
    )}" contenteditable="false">@${this.escapeHtml(user.name)}</span>&nbsp;`;

    if (this.clickedChip) {
      this.clickedChip.outerHTML = html;
      this.clickedChip = null;
    } else if (this.currentMentionRange) {
      this.editor.selection.setRng(this.currentMentionRange);
      this.editor.insertContent(html);
      this.currentMentionRange = null;
    }

    this.editor.fire('sc-mention-insert', { user });
    this.closeMenu();
  }

  private closeMenu(): void {
    if (this.menu) {
      this.menu.style.display = 'none';
      this.isOpen = false;
      this.items = [];
    }
  }

  private async getEmployeeById(id: string): Promise<any | null> {
    if (!this.graphQLClient?.query) {
      console.warn('graphQLClient is required for mention handler');
      return null;
    }

    const query = `
      query profile @cached {
        _55313_128_webkit_exp_api {
          get_employee(id: "${id}") {
            id
            name
            businessTitle
            departmentEntity {
              description
              }
          }
        }
      }
    `;

    try {
      const response = await this.graphQLClient.query(query);
      const jsonData = await response?.json?.();
      const data = jsonData?.data || jsonData;
      return data?._55313_128_webkit_exp_api?.get_employee || null;
    } catch (error) {
      console.warn('Employee fetch failed', error);
      return null;
    }
  }

  private async searchEmployees(keyword: string): Promise<any[]> {
    if (!this.graphQLClient?.query) {
      console.warn('graphQLClient is required for mention handler');
      return [];
    }

    const query = `
      query profile @cached {
        _55313_128_webkit_exp_api {
          get_employees(keyword: "${keyword}", includeLeavers: false, size: 5) {
            id
            name
            businessTitle
            departmentEntity {
              description
            }
          }
        }
      }
    `;

    try {
      const response = await this.graphQLClient.query(query);
      const jsonData = await response?.json?.();
      const result = jsonData?.data || jsonData;
      return result?._55313_128_webkit_exp_api?.get_employees || [];
    } catch (error) {
      console.warn('Mention search failed', error);
      return [];
    }
  }

  private injectChipStyles(): void {
    const doc = this.editor?.getDoc();
    if (!doc || doc.getElementById('sc-mention-styles')) return;

    const style = doc.createElement('style');
    style.id = 'sc-mention-styles';
    style.textContent = `
      .sc-mention {
        display: inline-block;
        color: var(--sc-color-blue-650, #0250A3);
        background-color: var(--sc-color-blue-50, #E5F1FC);
        border: 0.0625rem solid var(--sc-color-blue-50, #E5F1FC);
        border-radius: 0.375rem;
        padding: 0 0.25rem;
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.4;
        cursor: pointer !important;
        user-select: none;
        white-space: nowrap;
        vertical-align: baseline;
        margin: 0 0.0625rem;
        transition: background-color 0.15s, border-color 0.15s;
      }

      .sc-mention:hover {
        background-color: var(--sc-color-blue-100, #CCE3FA);
        border-color: var(--sc-color-blue-650, #0250A3);
      }

      .sc-mention[data-mce-selected] {
        background-color: var(--sc-color-blue-150, #B3D5F8);
        border-color: var(--sc-color-blue-650, #0250A3);
      }
    `;

    doc.head.appendChild(style);
  }

  private escapeHtml(text: string): string {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  getMentions(): Array<{ id: string; name: string }> {
    if (!this.editor) return [];
    const spans = this.editor
      .getBody()
      .querySelectorAll('.sc-mention[data-mention-id]');
    const seen = new Set<string>();
    const list: Array<{ id: string; name: string }> = [];
    Array.from(spans).forEach(el => {
      const id = el.getAttribute('data-mention-id') || '';
      const name = el.getAttribute('data-mention-name') || '';
      // ensure unique id
      if (id && !seen.has(id)) {
        seen.add(id);
        list.push({ id, name });
      }
    });
    return list;
  }

  destroy(): void {
    this.menu?.remove();
    this.menu = null;
    this.editor = null;
    this.graphQLClient = null;
  }
}
