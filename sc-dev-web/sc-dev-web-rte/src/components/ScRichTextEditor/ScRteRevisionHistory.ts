import { css } from 'lit';
import { property, queryAll } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';
import ScRteElement from '../../shared/sc-rte-element.js';
import { Revision } from './utils.js';
import { ScRteRevisionItem } from './ScRteRevisionItem.js';

export class ScRteRevisionHistory extends ScRteElement {
  static styles = css`
    .container {
      padding: 0.6125rem 1.25rem;
      border-radius: 0.375rem;
      border: 1px solid var(--sc-rte-border-color);
      background: var(--sc-rte-bg-color);
      width: 240px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.75rem;
      overflow-y: auto;
      overflow-x: hidden;
    }
  `;

  @property({ type: Array }) revisions: Revision[] = [];

  @property({ type: Object }) selected: Revision | null;

  @property({ type: String }) dateFormat = 'DD MMM YYYY, HH:mm (UTCZ)';

  @queryAll('sc-rte-revision-item') revisionItems: ScRteRevisionItem[];


  select(revision: Revision | null) {
    this.selected = revision ? this.revisions.find(r => r.id === revision.id) || null : null;
    this.emit('sc-select', { detail: { revision: this.selected } });
  }

  render() {
    return html`<div
      class="container"
      role="radiogroup"
      aria-label="Revision History"
    >
      <sc-link @click=${() => this.select(null)}>Current version</sc-link>
      ${this.revisions.map(
    item => html`<sc-rte-revision-item
          .value=${item}
          .selected=${this.selected === item}
          @sc-select=${() => this.select(item)}
        ></sc-rte-revision-item>`
  )}
    </div>`;
  }
}
