import { expect } from '@open-wc/testing';
import { TableTemplate } from '../../../src/models/Components/TableTemplate.js';

describe('TableTemplate model', () => {
  it('render the properties', () => {
    const tableTemplate = TableTemplate.from();
    expect(tableTemplate.label).to.equal('Table');
    expect(tableTemplate.flex).to.equal(false);
  });

  it('keeps provided flex value when cloning', () => {
    const tableTemplate = TableTemplate.from({ flex: true });
    expect(tableTemplate.flex).to.equal(true);
  });

  it('keeps column width config when cloning', () => {
    const tableTemplate = TableTemplate.from({
      conf: [
        { property: 'Column1', header: 'Column1', config: { width: 220 } },
      ],
    });

    expect(tableTemplate.conf[0].config.width).to.equal(220);
  });
});

describe('TableTemplate', () => {
  let table: any;

  beforeEach(() => {
    table = new TableTemplate();
    table.conf = [
      { property: 'col1', header: 'col1', config: { defaultValue: 'a' } },
      { property: 'col2', header: 'col2', config: { defaultValue: 'b' } },
    ];
    table.data = [];
    table.getColumnProperties = () => table.conf.map((c: any) => c.property);
  });

  it('columnHeaderRepeated returns repeated columns', () => {
    table.conf.push({ property: 'col1', header: 'col1' });
    const repeated = table.columnHeaderRepeated('col1', 0);
    expect(repeated.length).to.equal(1);
    expect(repeated[0].property).to.equal('col1');
  });

  it('createEmptyValue returns correct default values', () => {
    const empty = table.createEmptyValue();
    expect(empty).to.deep.equal({ col1: 'a', col2: 'b' });
  });

  it('addRow adds a new row with default values', () => {
    table.addRow();
    expect(table.data.length).to.equal(1);
    expect(table.data[0]).to.deep.equal({ col1: 'a', col2: 'b' });
  });

  it('deleteRow removes the row at given index', () => {
    table.data = [{ col1: 'a', col2: 'b' }, { col1: 'c', col2: 'd' }];
    table.deleteRow(0);
    expect(table.data.length).to.equal(1);
    expect(table.data[0]).to.deep.equal({ col1: 'c', col2: 'd' });
  });

  it('addColumn adds a new column with unique header', () => {
    table.addColumn();
    expect(table.conf.length).to.equal(3);
    expect(table.conf[2].property).to.match(/^Column\d+$/);
  });

  it('deleteColumn removes column and data property', () => {
    table.data = [{ col1: 'a', col2: 'b' }];
    table.deleteColumn(0);
    expect(table.conf.length).to.equal(1);
    expect(table.conf[0].property).to.equal('col2');
    expect(table.data[0]).to.not.have.property('col1');
  });

  it('onHeaderChange updates header and property, and data keys', () => {
    table.data = [{ col1: 'a', col2: 'b' }];
    table.onHeaderChange('newCol1', 0);
    expect(table.conf[0].property).to.equal('newCol1');
    expect(table.conf[0].header).to.equal('newCol1');
    expect(table.data[0]).to.have.property('newCol1', 'a');
    expect(table.data[0]).to.not.have.property('col1');
  });

  it('onDataChange updates data at index', () => {
    table.data = [{ col1: 'a', col2: 'b' }];
    table.onDataChange('x', 'col1', 0);
    expect(table.data[0].col1).to.equal('x');
  });

  it('onDataChange creates new row if not exists', () => {
    table.data = [];
    table.onDataChange('y', 'col1', 0);
    expect(table.data[0].col1).to.equal('y');
  });
});