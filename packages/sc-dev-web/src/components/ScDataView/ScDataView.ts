import { html, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { property } from 'lit/decorators.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import ScDataViewStyle from './ScDataView.style.js';

interface CONF {
  value: any;
  style: string;
}
export interface DATA {
  field: CONF;
  value: CONF;
}

export class ScDataView extends ScElement {
  static styles = ScTheme.getStyles().concat([ScDataViewStyle]);

  @property({ type: Array }) data: Array<DATA> = [];

  @property({ type: Number }) columns = 1;

  @property({ type: String }) mode: 'view' | 'table' = 'table';

  @property({ type: Boolean }) compact = false;

  @property({ type: String, attribute: 'horizontal-align' }) horizontalAlign:
    | 'left'
    | 'center'
    | 'right' = 'center';

  @property({ type: String, attribute: 'vertical-align' }) verticalAlign:
    | 'top'
    | 'middle'
    | 'bottom' = 'middle';

  getTheLastOneWidth(data: Array<DATA>[]) {
    const lastLength = data[data.length - 1].length;
    if (lastLength === this.columns) {
      return null;
    }
    const eachWidth = Math.floor(100 / this.columns);
    return {
      column: eachWidth + eachWidth * (this.columns - lastLength),
      cell: 50 + 100 * (this.columns - lastLength),
    };
  }

  render() {
    if (this.data?.length <= 0) return nothing;

    const copyData = [...this.data];
    const renderData: DATA[][] = [];

    while (copyData.length > 0) {
      renderData.push(copyData.splice(0, this.columns > 0 ? this.columns : 1));
    }

    const width = this.getTheLastOneWidth(renderData);

    return html`
      <div
        class=${classMap({
          'data-view-container': true,
          [this.mode]: true,
          compact: this.compact,
          [this.horizontalAlign]: true,
          [this.verticalAlign]: true,
        })}
      >
        ${renderData.map((row: DATA[], i: number) => {
          return html`
            <div class="row">
              ${row?.map((data: DATA, j: number) => {
                let cellWidthStyle, colWidthStyle;
                if (i === renderData.length - 1 && j === row.length - 1) {
                  // Last cell in last row
                  cellWidthStyle = width ? `width: ${width.cell}%;` : '';
                  colWidthStyle = width?.column;
                }
                return html`
                  <div
                    class="col"
                    style=${`width: ${
                      colWidthStyle || Math.floor(100 / this.columns)
                    }%`}
                  >
                    ${data.field || data.value
                      ? html`
                          <div class="field">
                            <div
                              class="content"
                              style=${data.field?.style || ''}
                            > 
                              <span>
                              ${typeof data.field?.value === 'function'
                                ? data.field.value(i + 1, j + 1, row)
                                : data.field?.value}
                              </span>
                            </div>
                          </div>
                          <div
                            class="value"
                            style=${`${cellWidthStyle || ''} ${
                              data.value?.style || ''
                            }`}
                          >
                            <div
                              class="content"
                              style=${data.value?.style || ''}
                            >
                              <span>
                              ${typeof data.value?.value === 'function'
                                ? data.value.value(i + 1, j + 1, row)
                                : data.value?.value}
                                </span>
                            </div>
                          </div>
                        `
                      : nothing}
                  </div>
                `;
              })}
            </div>
          `;
        })}
      </div>
    `;
  }
}
