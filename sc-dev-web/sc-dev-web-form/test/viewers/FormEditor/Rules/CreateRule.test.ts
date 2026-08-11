import { expect } from '@open-wc/testing';
import CreateRule from '../../../../src/viewers/FormEditor/Rules/CreateRule.js';

describe('CreateRule', () => {
  it('reads process fields from processApiFieldsContext cache', () => {
    const createRule = new CreateRule();
    let getCachedFieldsCalls = 0;
    let getOrLoadFieldsCalls = 0;
    const getCachedFields = () => {
      getCachedFieldsCalls += 1;
      return ['fieldA', 'fieldB'];
    };
    const getOrLoadFields = async () => {
      getOrLoadFieldsCalls += 1;
      return ['fieldA', 'fieldB'];
    };

    createRule.processApiFieldsContext = {
      getCachedFields,
      getOrLoadFields,
      primeByDefinition: async () => {},
      invalidateByDataSourceId: () => {},
    } as any;

    createRule['_selectedDataSource'] = {
      id: 'process-ds',
      type: 'api',
      apiType: 'process',
      apiFields: [],
    } as any;

    const fields = createRule.selectedDataSourceFields;
    expect(fields).to.deep.equal(['fieldA', 'fieldB']);
    expect(getCachedFieldsCalls).to.equal(1);
    expect(getOrLoadFieldsCalls).to.equal(0);
  });

  it('triggers lazy loading when process fields cache is empty', async () => {
    const createRule = new CreateRule();
    let getOrLoadFieldsCalls = 0;
    let requestUpdateCalls = 0;
    const getCachedFields = () => [];
    const getOrLoadFields = async () => {
      getOrLoadFieldsCalls += 1;
      return ['fieldLoaded'];
    };
    createRule.requestUpdate = (() => {
      requestUpdateCalls += 1;
    }) as any;

    createRule.processApiFieldsContext = {
      getCachedFields,
      getOrLoadFields,
      primeByDefinition: async () => {},
      invalidateByDataSourceId: () => {},
    } as any;

    createRule['_selectedDataSource'] = {
      id: 'process-ds',
      type: 'api-process',
      apiFields: [],
    } as any;

    const fields = createRule.selectedDataSourceFields;
    expect(fields).to.deep.equal([]);
    expect(getOrLoadFieldsCalls).to.equal(1);

    await Promise.resolve();
    expect(requestUpdateCalls >= 1).to.equal(true);
  });
});
