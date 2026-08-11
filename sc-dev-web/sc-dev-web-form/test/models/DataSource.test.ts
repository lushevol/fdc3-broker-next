import { expect } from '@open-wc/testing';
import { DataSource } from '../../src/models/DataSource.js';

describe('DataSource model', () => {
  it('renders constructor properties', () => {
    const newDataSource = new DataSource('api', 'test');
    expect(newDataSource.type).to.equal('api');
    expect(newDataSource.name).to.equal('test');
  });

  it('creates DataSource from plain object', () => {
    const dataSource = DataSource.from({
      type: 'excel',
    } as any);

    expect(dataSource.id).not.equal(undefined);
    expect(dataSource.type).to.equal('excel');
  });

  it('keeps api namespace and dataset display names', () => {
    const dataSource = DataSource.from({
      type: 'api',
      apiNameSpaceName: 'Customer Service API',
      apiQueryNameLabel: 'Get Customer Profile',
    } as any);

    expect(dataSource.apiNameSpaceName).to.equal('Customer Service API');
    expect(dataSource.apiQueryNameLabel).to.equal('Get Customer Profile');
  });

  it('fills missing apiNameSpaceName from namespace id/name', () => {
    const dataSource = DataSource.from({
      type: 'api',
      apiNameSpace: 'customer_ns',
      apiNameSpaceId: 'customer-ns-id',
    } as any);

    expect(dataSource.apiNameSpaceName).to.equal('customer_ns');
  });

  it('fills missing apiNameSpaceLabel with empty string', () => {
    const dataSource = DataSource.from({
      type: 'api',
      apiNameSpace: 'customer_ns',
      apiNameSpaceId: 'customer-ns-id',
      apiNameSpaceLabel: undefined,
    } as any);

    expect(dataSource.apiNameSpaceLabel).to.equal('');
  });

  it('fills missing apiQueryNameLabel from endpoint summary or query name', () => {
    const withSummary = DataSource.from({
      type: 'api',
      apiEndpointSummary: 'Get Profile Summary',
      apiQueryName: '/profile',
      apiQueryNameLabel: undefined,
    } as any);

    const withQuery = DataSource.from({
      type: 'api',
      apiEndpointSummary: '',
      apiQueryName: '/profile-by-query',
      apiQueryNameLabel: undefined,
    } as any);

    expect(withSummary.apiQueryNameLabel).to.equal('Get Profile Summary');
    expect(withQuery.apiQueryNameLabel).to.equal('/profile-by-query');
  });

  it('normalizes api-process type to api with process apiType', () => {
    const source = DataSource.from({
      type: 'api-process',
      apiNameSpace: 'ns-name',
      apiNameSpaceId: 'ns-id',
      apiEndpointSummary: 'Summary Name',
      apiQueryName: 'Query Name',
    } as any);

    expect(source.type).to.equal('api');
    expect(source.apiType).to.equal('process');
    expect(source.apiNameSpaceName).to.equal('ns-name');
    expect(source.apiNameSpaceLabel).to.equal('');
    expect(source.apiQueryNameLabel).to.equal('Summary Name');
  });
});
