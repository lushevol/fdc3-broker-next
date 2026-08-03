/* eslint-disable indent */
import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ScElement from '../../shared/sc-element.js';
import { ToolMixin } from '../../mixins/tool-mixin.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('sc-rte-action-table')
export class RTEActionTable extends ToolMixin(ScElement) {
  static styles = css`
    :host {
      user-select: none;
    }
    .cell {
      width: 16px;
      height: 16px;
      margin: 2px;
      border: 1px solid var(--sc-rich-text-editor-table-cell-border-color);
      box-sizing: border-box;
      background-color: var(--sc-rich-text-editor-table-cell-bg-color);
      cursor: pointer;
    }
    .active-cell {
      background-color: var(--sc-rich-text-editor-table-cell-hover-bg-color);
      border-color: var(--sc-rich-text-editor-table-cell-hover-border-color);
    }

    sc-icon,
    .box {
      color: var(--sc-icon-color);
    }
    .box {
      border: 1px solid var(--sc-rte-border-color);
      background-color: var(--sc-rte-bg-color);
      padding: 6px;
      cursor: default;
    }
    .row {
      display: flex;
    }
    .selection-hint {
      text-align: center;
    }
  `;
  minRowCount = 5;
  minColCount = 5;
  maxRowCount = 10;
  maxColCount = 10;
  @state() rowCount = this.minRowCount;
  @state() colCount = this.minColCount;
  @state() coordinate = [-1, -1];
  
  @property({ type: Boolean })
  disable = false;

  @property({ type: String })
  icon = '';

  @property({ type: String })
  size = '';

  onLeaveCell() {
    this.coordinate = [0, 0];
  }
  onHoverCell(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    const coordinate = target.dataset.coordinate as string;
    const [x, y] = coordinate.split(',').map(Number);
    this.coordinate = [x, y];
    this.rowCount = this.clamp(x + 2, this.minRowCount, this.maxRowCount);
    this.colCount = this.clamp(y + 2, this.minColCount, this.maxColCount);
  }
  isActive(coordinate: string) {
    const cellCoordinate = coordinate.split(',');
    const cellX = +cellCoordinate[0];
    const cellY = +cellCoordinate[1];
    const x = this.coordinate[0];
    const y = this.coordinate[1];
    return cellX <= x && cellY <= y;
  }
  onCellClick() {
    const [rowCount, colCount] = this.coordinate;
    this.emit('sc-select', {
      detail: {
        rowCount: rowCount + 1,
        colCount: colCount + 1,
      },
    });
  }

  renderCell(rowIndex: number, colIndex: number) {
    const coordinate = `${rowIndex},${colIndex}`;
    return html`<div
      @mouseover=${this.onHoverCell}
      class=${classMap({
        cell: true,
        'active-cell': this.isActive(coordinate),
      })}
      data-coordinate=${coordinate}
      data-index=${colIndex}
      @click=${this.onCellClick}
    ></div>`;
  }
  renderRow(rowIndex: number) {
    return html`<div data-index=${rowIndex} class="row">
      ${map(range(this.colCount), (v, colIndex) =>
        this.renderCell(rowIndex, colIndex)
      )}
    </div>`;
  }
  render() {
    const [rowCount, colCount] = this.coordinate;
    return html`<sc-tooltip
      placement="top"
      distance="10"
      mode="light"
      .contentMaxWidth=${'1000px'}
      .open=${false}
      ?disabled=${this.disable}
    >
      <sc-icon
        style=${styleMap({
          cursor: this.disable ? 'not-allowed' : 'pointer',
        })}
        .size=${this.size}
        .name=${this.icon} 
      >
      </sc-icon>
      <div slot="content">
        <div class="box" @mouseleave=${this.onLeaveCell}>
          ${map(range(this.rowCount), (v, rowIndex) => this.renderRow(rowIndex))}
        </div>
        <div class="selection-hint">
          ${rowCount + 1}&nbsp;x&nbsp;${colCount + 1}
        </div>
      </div>
    </sc-tooltip>`;
  }
}
