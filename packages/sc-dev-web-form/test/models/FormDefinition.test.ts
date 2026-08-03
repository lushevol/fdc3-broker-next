import { expect } from '@open-wc/testing';
import { FormDefinition } from '../../src/models/FormDefinition.js';
import { DataSource } from '../../src/models/DataSource.js';

const definition: any = {
  id: 'a97d1858-cb64-4bf9-8341-31c3a5ba9558',
  layout: {
    row: '4dfeb8cf-9937-44f7-a2cb-fb4be15136c7',
  },
  pages: [
    {
      id: 'e23df595-b29b-47e6-9ad8-ad5df1755084',
      layout: {
        row: '6fd70a5e-176c-40fc-a350-a478afa7d4c1',
      },
      components: [
        {
          id: 'b1420275-22c9-4900-8221-12f2c42ccbbf',
          layout: {
            row: '86486186-a4cb-4c53-891e-0c3be9552eaa',
          },
          type: 'text-field',
          template: {
            label: 'Text Field',
          },
        },
        {
          id: 'ac63579a-f112-4fe6-b225-a1471c9dae34',
          layout: {
            row: '135ac8cd-a75c-4ab6-95ee-79d1818b6412',
          },
          type: 'number-input',
          template: {
            label: 'Number Input',
          },
        },
      ],
    },
  ],
  version: '1',
};
describe('FormDefinition model', () => {
  it('render the properties', () => {
    const newFormDefinition = new FormDefinition();
    expect(newFormDefinition.version).to.equal('1');
    expect(newFormDefinition.pages.length).to.equal(3);
  });

  it('formDefinition from', () => {
    const formDefinition = FormDefinition.from(definition);
    expect(formDefinition.id).to.equal(definition.id);
    expect(formDefinition.layout.row).to.equal(definition.layout.row);
  });

  it('formDefinition update', () => {
    const formDefinition = new FormDefinition();
    formDefinition.update(definition);
    expect(formDefinition.id).to.equal(definition.id);
    expect(formDefinition.pages.length).to.equal(definition.pages.length);
  });

  it('formDefinition addPage', () => {
    const formDefinition = new FormDefinition();
    formDefinition.addPage();
    expect(formDefinition.pages.length).to.equal(4);
  });

  it('formDefinition removePage', () => {
    const formDefinition = FormDefinition.from(definition);
    formDefinition.removePage(definition.pages[0].id);
    expect(formDefinition.pages.length).to.equal(0);
  });

  it('formDefinition getPage', () => {
    const formDefinition = FormDefinition.from(definition);
    const page = formDefinition.getPage(definition.pages[0].id);
    expect(page?.id).to.equal(definition.pages[0].id);
    const page2 = formDefinition.getPage(definition.pages[0].id);
    expect(page2?.id).to.equal(definition.pages[0].id);
  });

  it('formDefinition updatePage', () => {
    const formDefinition = FormDefinition.from(definition);
    formDefinition.updatePage(definition.pages[0].id, { id: 'test-page' } as any);
    expect(formDefinition.pages[0].id).to.equal('test-page');
  });

  it('from rehydrates dataSources into DataSource instances', () => {
    const formDefinition = FormDefinition.from({
      ...definition,
      dataSources: [
        {
          id: 'ds-2',
          type: 'api',
          apiType: 'process',
          name: 'test-ds',
          apiNameSpace: 'ns',
          apiNameSpaceId: 'ns-id',
          apiQueryName: '/query',
          apiEndpoint: '/query',
          apiEndpointSummary: '/query',
          apiMethod: 'get',
          apiArguments: [],
          apiFields: [],
        },
      ],
    } as any);

    const firstDataSource = formDefinition.getDataSources()?.[0] as any;
    expect(firstDataSource instanceof DataSource).to.equal(true);
    expect(firstDataSource.apiNameSpaceLabel).to.equal('');
    expect(firstDataSource.apiQueryNameLabel).to.equal('/query');
  });
});