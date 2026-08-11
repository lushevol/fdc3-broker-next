import { html, nothing } from 'lit';
import { SelectionBaseEditor } from '../../common/SelectionBaseEditor.js';

export class DataViewEditor extends SelectionBaseEditor {

  renderPrefillAnswer = () => {};

  renderOtherGeneral = () => {
    const { mode = 'table', helpText } = this.component.template;
    return html`
      <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Mode"
          value=${mode}
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.value, 'mode');
    this.requestUpdate();
  }}
        >
          <sc-radio value=table>Table</sc-radio>
          <sc-radio value=view>View</sc-radio>
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-label label='Description'></sc-label>
        <sc-rich-text-editor-v2
          .toolbar=${this.simpleToolbars}
          value=${helpText}
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.text, 'helpText');
    this.requestUpdate();
  }}
        >
        </sc-rich-text-editor-v2>
      </div>
    `;
  };

  renderBehavior = () => {
    const { compact } = this.component.template;
    return html`
      <div class=row>
        <sc-switch
          label=Compact
          ?checked=${compact}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'compact')}
        >
        </sc-switch>
      </div>
    `;
  };

  renderStyleAndLayout = () => {
    const { labelSize, columns = 1, horizontalAlign = 'left', verticalAlign = 'middle', mode } = this.component.template;
    return html`
      <div class=row>
        <sc-number-input
          label="Columns"
          value=${columns}
          min=1
          @sc-input=${
  (e: CustomEvent) => this.onChange(e.detail.value, 'columns')
}
        ></sc-number-input>
      </div>
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Label size"
          value=${labelSize}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'labelSize')}
        >
          <sc-radio value=sm>SM</sc-radio>
          <sc-radio value=md>MD</sc-radio>
          <sc-radio value=lg>LG</sc-radio>
        </sc-radio-group>
      </div>
      ${
  mode === 'table' ? html`
          <div class=row>
            <sc-radio-group
              columns=2
              direction=horizontal
              label="Horizontal alignment"
              value=${horizontalAlign}
              @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'horizontalAlign')}
            >
              <sc-radio value=left>Left</sc-radio>
              <sc-radio value=center>Center</sc-radio>
              <sc-radio value=right>Right</sc-radio>
            </sc-radio-group>
          </div>
          <div class=row>
            <sc-radio-group
              columns=2
              direction=horizontal
              label="Vertical alignment"
              value=${verticalAlign}
              @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'verticalAlign')}
            >
              <sc-radio value=top>Top</sc-radio>
              <sc-radio value=middle>Middle</sc-radio>
              <sc-radio value=bottom>Bottom</sc-radio>
            </sc-radio-group>
          </div>`
    : nothing
}
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-data-view .component=${this.component} .key=${this.key}>
      </form-data-view>
    `;
  };
}