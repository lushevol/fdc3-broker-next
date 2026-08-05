import { LitElement, html } from 'lit';

class BaseElement extends LitElement {
  trigger(ev, detail) {
    this.dispatchEvent(
      new CustomEvent(ev, {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }
}

class SortableList extends BaseElement {
  static get properties() {
    return {
      currentSource: { type: Number },
      currentTarget: { type: Number },
      childList: { type: Array, Reflect: true },
      reorderForm: { type: Function },
    };
  }

  firstUpdated() {
    this.addEventListener('dragover', ev => ev.preventDefault());
    this.addEventListener('dragleave', ev => ev.preventDefault());
    this.addEventListener('currentTarget', ev => this.setCurrentTarget(ev));
    this.addEventListener('currentSource', ev => this.setCurrentSource(ev));
    this.addEventListener('complete', ev => this.setComplete(ev));
    this.items = [...this.querySelectorAll('sortable-item')];
    this.items.map((e, i) => {
      e.index = e.originalIndex = i;
      e.currentSource = null;
      return e;
    });
  }

  updated(changedProperties) {
    if (changedProperties.has('childList')) {
      this.items = [...this.querySelectorAll('sortable-item')];
      this.items.map((e, i) => {
        e.index = e.originalIndex = i;
        e.currentSource = null;
        return e;
      });
      this.requestUpdate();
    }
  }

  get arrangement() {
    const arrangement = this.items.map((item, id) => {
      return { id, oid: item.originalIndex };
    });
    this.reorderForm(arrangement);
    return arrangement;
  }

  reindex() {
    this.items.map((e, i) => (e.index = i));
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
    `;
  }

  sortArray(arr, start, end) {
    const value = arr[end];
    arr.splice(start, 0, value);
    if (start < end) {
      arr.splice(end + 1, 1);
    } else {
      arr.splice(end, 1);
    }
    return arr;
  }

  sort() {
    const reduceIndex = (item, i) => {
      item.index = i;
      return item;
    };
    this.items = this.sortArray(
      [...this.items],
      this.currentTarget,
      this.currentSource
    );
    this.items = this.items.map(reduceIndex);
  }

  setCurrentTarget(ev) {
    this.currentTarget = ev.detail.index;
  }

  setCurrentSource(ev) {
    this.items.map(i => {
      i.currentSource = ev.detail.index;
    });
    this.currentSource = ev.detail.index;
  }

  setComplete(ev) {
    this.sort();
    this.trigger('sorted', { items: this.arrangement });
  }
}

class SortableItem extends BaseElement {
  _over = false;

  static get properties() {
    return {
      index: { type: Number },
      originalIndex: { type: Number },
      currentIndex: { type: Number },
      currentSource: { type: Number },
      html: { type: String },
    };
  }

  firstUpdated() {
    this.setAttribute('draggable', 'true');
    const events = ['dragstart', 'dragover', 'dragleave', 'dragend'];
    events.map(e => this.addEventListener(e, ev => this[e](ev), false));
  }

  render() {
    const isSource =
      this.currentIndex &&
      this.currentSource &&
      this.currentSource === this.currentIndex
        ? true
        : false;
    const highlight = '#e7f1fd';

    return html`
      <style>
        :host {
          display: block;
          border: 0.0625rem dashed var(--sc-color-grey-150);
          border-radius: 0.625rem;
          cursor: grab;
          margin: 0.312rem 0;
          transition: background-color 0.3s;
          ${isSource ? html` background-color: ${highlight};` : html``}
        }
        // .over {
        //   background: var(--sc-color-blue-50);
        // }
      </style>
      <div class=${this._over ? 'over' : ''}><slot></slot></div>
    `;
  }

  dragstart(ev) {
    this._over = false;
    this.requestUpdate();
    this.trigger('currentSource', { index: this.index });
  }

  dragleave() {
    this._over = false;
    this.requestUpdate();
  }

  // both direction
  dragover(ev) {
    ev.preventDefault();
    this._over = true;
    this.requestUpdate();
    this.trigger('currentTarget', { index: this.index });
  }

  dragend(ev) {
    ev.preventDefault();
    this._over = false;
    this.requestUpdate();
    this.trigger('complete');
  }
}

if (!window.customElements.get('sortable-item')) {
  window.customElements.define('sortable-item', SortableItem);
}
if (!window.customElements.get('sortable-list')) {
  window.customElements.define('sortable-list', SortableList);
}
