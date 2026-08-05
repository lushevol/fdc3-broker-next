import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { watch } from '../../../shared/watch.js';
import { Queries } from './queries.js';
import { Fields, FIELD_TYPE, FIELD_ITEM_TYPE } from './fields.js';
import ScExtElement from '../../../shared/sc-ext-element.js';
import dayjs from 'dayjs/esm/index.js';
import { dateDefaultFormat } from '../../../shared/date-format.js';
import { _get } from '../../../shared/object-chain-operations.js';

export class ScCustomerDetail extends ScExtElement {

  @property({ type: String, attribute: 'reference-id' }) referenceId = '';

  @property({ type: String, attribute: 'country-code' }) countryCode = '';

  @property({ type: String, attribute: 'name-space' }) nameSpace = '';

  @property({ type: Object, attribute: 'queries' }) queries = Queries;

  @property({ type: Array }) fields: FIELD_TYPE[] = Fields;

  @property({ type: Number }) columns = 1;

  @property({ type: Object }) data: object;

  @state() customerDetail: any;

  @watch(['referenceId', 'country-code', 'data'])
  async getCustomerInformation() {
    if (this.data) {
      this.customerDetail = this.data;
      return;
    }
    if (this.referenceId && this.countryCode) {
      const response = await this._graphQLClient?.query(this.generateQuery());
      const jsonData = await response?.json?.();
      const result = jsonData?.data || jsonData;
      this.customerDetail = result?.[this.nameSpace || '_18107_crm_exp'];
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.emit('sc-loaded', {
      detail: {
        fields: this.fields,
        queries: this.queries,
      },
    });
  }
  generateKeys(query: any, str?: string) {
    let _str = str || '';
    if (typeof query === 'object') {
      const keys = Object.keys(query);
      keys.forEach(key => {
        _str += `
        ${key} {
        `;
        const value = query[key];
        if (Array.isArray(value)) {
          value.forEach((v: any, index: number) => {
            if (typeof v === 'object') {
              _str = this.generateKeys(v, _str);
            } else if (typeof v === 'string') {
              _str += `
              ${v  }`;
            }
            if (index === value.length - 1) {
              _str += `
              }`;
            }
          });
        }
        
      });
    }
    return _str;
  }

  generateQuery() {
    return `query {
      ${this.nameSpace || '_18107_crm_exp'} {
        get_customerProfile(referenceId: "${this.referenceId}", countryCode: "${this.countryCode}") {
          ${this.generateKeys(this.queries)}
        }
      }
    }`;
  }

  dataAdapter(data: FIELD_ITEM_TYPE[]) {
    if (!this.customerDetail) return [];
    const style = 'text-align: left';

    return data.map(d => {
      const value = _get(this.customerDetail.get_customerProfile, d.key);
      if (d.type === 'date') {
        return {
          field: {
            style,
            value: d.label,
          },
          value: {
            value: value ? dayjs(value).format(dateDefaultFormat) : '-',
          },
        };
      } else if (d.type === 'employee') {
        return {
          field: {
            style,
            value: d.label,
          },
          value: {
            value: value ? () => html`
              <sc-employee-name id=${value}></sc-employee-name>
            ` : '-',
          },
        };
      }
      return {
        field: {
          style,
          value: d.label,
        },
        value: {
          value: value || '-',
        },
      };
    });
  }

  renderItems(data: FIELD_ITEM_TYPE[]) {
    if (!data) return nothing;
    
    return html`
      <sc-data-view
        mode=view
        .columns=${this.columns}
        .data=${this.dataAdapter(data)}
      ></sc-data-view>
    `;
  }

  render() {
    return html`
      ${
  repeat(this.fields, (field: FIELD_TYPE) => field.category, field => {
    return html`
          <sc-accordion open>
            <div slot="summary">
              <strong>${field.category}</strong>
            </div>
            ${this.renderItems(field.fields)}
          </sc-accordion>
        `; })
}
    `;
  }
}
