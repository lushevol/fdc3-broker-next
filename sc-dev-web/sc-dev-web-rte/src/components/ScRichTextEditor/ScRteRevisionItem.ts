import dayjs from 'dayjs/esm/index.js';
import { css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ScRteElement from '../../shared/sc-rte-element.js';
import { Revision } from './utils.js';
import { watch } from '../../shared/watch.js';

export class ScRteRevisionItem extends ScRteElement {
  static styles = css`
    :host {
      border-radius: 0.375rem;
    }
    :host(:focus) {
      outline: none;
    }
    :host(:focus-visible) {
      outline: 2px solid
        var(--sc-rte-revision-focus-outline-color, var(--sc-color-blue-250));
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      border-radius: 0.375rem;
      border: 1px solid var(--sc-rte-revision-border-color, transparent);
      background-color: var(
        --sc-rte-revision-background-color,
        var(--sc-rte-bg-color, var(--sc-color-white))
      );
      color: var(
        --sc-rte-revision-color,
        var(--sc-rte-color, var(--sc-color-grey-50))
      );
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      transition: border-color 0.2s ease-in-out, background 0.2s ease-in-out;
    }

    .container.selected {
      --sc-rte-revision-border-color: var(
        --sc-rte-revision-selected-border-color,
        var(--sc-color-blue-900)
      );
      --sc-rte-revision-background-color: var(
        --sc-rte-revision-selected-background-color,
        var(--sc-color-blue-50)
      );
    }

    .title {
      font-size: 0.875rem;
      color: var(
        --sc-rte-revision-title-color,
        var(--sc-rte-color, var(--sc-color-blue-900))
      );
    }
    .author {
      display: flex;
      flex-direction: row;
      gap: 0.2rem;
    }
  `;

  @property({ type: Boolean }) selected = false;
  @property({ type: Object }) value: Revision;
  @property({ type: String }) dateFormat = 'DD MMM YYYY, HH:mm (UTCZ)';

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.handleClick);
    this.addEventListener('keydown', this.handleKeydown);
    this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'radio');
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this.handleClick);
    this.removeEventListener('keydown', this.handleKeydown);
  }

  @watch('selected', { waitUntilFirstUpdate: true })
  onSelectedChange() {
    this.setAttribute('aria-checked', `${this.selected}`);
  }

  handleClick(e: Event) {
    if (!this.selected) {
      this.selected = true;
      this.emit('sc-select', { detail: { revision: this.value } });
    }
    e.stopPropagation();
    e.preventDefault();
  }

  handleKeydown(e: KeyboardEvent) {
    if (['Space', 'Enter'].includes(e.code)) {
      this.emit('sc-select', { detail: { revision: this.value } });
      e.stopPropagation();
      e.preventDefault();
    }
  }

  render() {
    return html`<div
      class=${classMap({
    container: true,
    selected: this.selected,
  })}
    >
      <div class="title" id=${`revision-label_${this.value.id}`}>
        ${dayjs(this.value.dateCreated).format(this.dateFormat)}
      </div>
      <div class="author">
        <sc-employee-avatar
          .id=${this.value.authorId}
          avatar-size="sm"
          disabled
        ></sc-employee-avatar>
        <sc-employee-name
          .id=${this.value.authorId}
          disabled
        ></sc-employee-name>
      </div>
    </div>`;
  }
}