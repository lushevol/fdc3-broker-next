import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

export function renderSort(para: { asc?: boolean; desc?: boolean }) {
  return html`<sc-icon
    name="col-sort${para.asc ? '-up' : para.desc ? '-down' : ''}"
    size="sm"
    style=${styleMap({
      color: para.asc
        ? 'var(--sc-sort-asc)'
        : para.desc
        ? 'var(--sc-sort-desc)'
        : undefined,
    })}
  ></sc-icon>`;
}

export function renderExpand() {
  return html`<sc-icon
    class="icon"
    name="chevron-right"
    size="sm"
  ></sc-icon>`;
}

export function renderFilter() {
  return html`
    <div
      style=${styleMap({
        color: 'var(--sc-filter-active-color)',
        position: 'relative',
        height: '16px',
        display: 'grid',
        placeContent: 'center',
      })}
    >
      <div
        style=${styleMap({
          width: '6px',
          height: '6px',
          position: 'absolute',
          right: '0',
          top: '0',
          borderRadius: '50%',
          backgroundColor: 'var(--sc-filter-active-color)',
        })}
      ></div>
      <sc-icon
        name="funnel--line"
        size="sm"
      ></sc-icon>
    </div>
  `;
}

export function columnVisibility() {
  return html`<sc-icon
    name="view-columns"
    size="sm"
  ></sc-icon>`;
}

export function dragHandler() {
  return html`<sc-icon
    name="drag-handle"
    size="sm"
  ></sc-icon>`;
}