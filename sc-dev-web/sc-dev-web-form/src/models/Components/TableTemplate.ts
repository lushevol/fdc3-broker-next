import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

const DefaultColumns = [
  { property: 'Column1', header: 'Column1' },
  { property: 'Column2', header: 'Column2' },
];

type COLUMN_TYPE = {
  property: string;
  header: any;
  config?: any;
}

export class TableTemplate extends FormMixin('Table') {
  conf: COLUMN_TYPE[] = JSON.parse(JSON.stringify(DefaultColumns));
  flex = false;
  pageSize = 10;
  pagination = false;
  display: string[];
  data: any[];
  labelSize = 'md';

  constructor() {
    super();
    if (!this.data) {
      this.data = this.value || [this.createEmptyValue()];
    }
  }

  static from(obj?: object) {
    if (!obj) return new TableTemplate();

    const newInstance = new TableTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return TableTemplate.from(obj);
  }

  getColumnProperties = () => {
    return this.conf.map((c: COLUMN_TYPE) => c.property);
  };

  columnHeaderRepeated = (header: string, index: number) => {
    const columnRepeated = this.conf.filter((item: any, _index: number) => {
      return _index !== index && item.property === header;
    });
    return columnRepeated;
  };

  createEmptyValue = () => {
    const properties = this.getColumnProperties();
    const emptyValue: any = {};
    properties.forEach((p, index) => {

      const currentConfig = this.conf[index]?.['config'];
      if (currentConfig) {
          emptyValue[p] = currentConfig?.defaultValue;
        } else {
          emptyValue[p] = '';
        }
    });
    return emptyValue;
  };

  addRow = () => {
    this.data = [...this.data, this.createEmptyValue()];
    return this.data;
  };

  deleteRow = (index: number) => {
    this.data.splice(index, 1);
    this.data = [...this.data];
    return this.data;
  };

  addColumn = () => {
    let index = this.conf.length + 1;
    let header = `Column${index}`;
    while (this.columnHeaderRepeated(header, -1).length > 0) {
      index++;
      header = `Column${index}`;
    }
    this.conf = [
      ...this.conf,
      {
        property: header,
        header,
      },
    ];
    return this.conf;
  };

  deleteColumn = (index: number) => {
    const property = this.conf[index]?.property;
    this.conf.splice(index, 1);
    this.data.map(d => {
      if (d) {
        delete d[property];
      }
    });

    this.conf = [...this.conf];
    this.data = [...this.data];
    return this.conf;
  };

  onHeaderChange = (value: any, index: number) => {
    const conf = this.conf[index];
    if (conf) {
      const oldProperty = conf.property;
      conf.header = value;
      conf.property = value;
      this.data.map(d => {
        if (d) {
          const value = d[oldProperty];
          delete d[oldProperty];
          d[conf.property] = value;
        }
      });
    }
  };

  onDataChange = (value: any, property: string, index: number) => {
    const changedData = this.data[index];
    if (changedData) {
      changedData[property] = value;
    } else if (index >= 0) {
      this.data[index] = {
        [property]: value,
      };
    }
  };

  onOptionsChange = (value: any) => {
    this.data = value;
  };
}
