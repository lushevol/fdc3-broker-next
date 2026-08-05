import { expect } from '@open-wc/testing';
import { createProcessApiContextValue } from '../../../src/viewers/contexts/process-api-context.js';

describe('process-api-context', () => {
  it('falls back to apiFields for non-process data source', async () => {
    const contextValue = createProcessApiContextValue(undefined);
    const nonProcessSource = {
      id: 'ds-rest',
      type: 'api',
      apiType: 'exp',
      apiFields: ['fallbackA', 'fallbackB'],
    } as any;

    const fields = await contextValue.getOrLoadFields(nonProcessSource);
    expect(fields).to.deep.equal(['fallbackA', 'fallbackB']);
    expect(contextValue.getCachedFields(nonProcessSource)).to.deep.equal(['fallbackA', 'fallbackB']);
  });

  it('returns empty list when process source has no namespace/client', async () => {
    let updateCalls = 0;
    const contextValue = createProcessApiContextValue(undefined, () => {
      updateCalls += 1;
    });

    const processSource = {
      id: 'ds-process',
      type: 'api',
      apiType: 'process',
      apiNameSpaceId: '',
      apiFields: [],
    } as any;

    const fields = await contextValue.getOrLoadFields(processSource);
    expect(fields).to.deep.equal([]);
    expect(contextValue.getCachedFields(processSource)).to.deep.equal([]);
    expect(updateCalls).to.equal(1);
  });

  it('primes process dataSources and supports invalidate', async () => {
    const contextValue = createProcessApiContextValue(undefined);

    const processSource = {
      id: 'ds-process',
      type: 'api-process',
      apiNameSpaceId: '',
      apiFields: [],
    } as any;
    const nonProcessSource = {
      id: 'ds-rest',
      type: 'api',
      apiType: 'exp',
      apiFields: ['restField'],
    } as any;

    const definition = {
      getDataSources: () => [processSource, nonProcessSource],
    } as any;

    await contextValue.primeByDefinition(definition);

    expect(contextValue.getCachedFields(processSource)).to.deep.equal([]);
    expect(contextValue.getCachedFields(nonProcessSource)).to.deep.equal(['restField']);

    contextValue.invalidateByDataSourceId('ds-process');
    expect(contextValue.getCachedFields(processSource)).to.deep.equal([]);
  });
});
