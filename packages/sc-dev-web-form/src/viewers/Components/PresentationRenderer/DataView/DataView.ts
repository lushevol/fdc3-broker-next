import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import type { OptionBase } from '../../../../models/base/OptionBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const DefaultData = [{
  value: 'value1',
  label: 'Value1',
}, {
  value: 'value2',
  label: 'Value2',
}];
export class DataView extends FormBaseViewer {
 
  renderElement() {
    const { columns, mode, compact, horizontalAlign, verticalAlign, options = DefaultData, label, labelSize, tooltip, helpText } = this.template;
    return html`
      <div style=" flex-direction: column; ">
        <sc-label
          label=${label}
          label-size=${labelSize}
          tooltip=${tooltip}
        ></sc-label>
        <sc-data-view
            .data=${options.map((o: OptionBase) => ({
              field: {
                value:　o.label,
              },
              value: {
                value: o.value,
              },
            }))}
          .columns=${columns}
          .mode=${mode}
          .compact=${compact}
          .horizontalAlign=${horizontalAlign}
          .verticalAlign=${verticalAlign}
        >
        </sc-data-view>
        <sc-label>
          <div slot="label" >
            <div class="sc-label-wrapper">
              <div class="sc-label-text" style='font-size: 0.625rem'>${ unsafeHTML(helpText) }</div>
            </div>
          </div>
        </sc-label>
      </div>
    `;
  }
 
}