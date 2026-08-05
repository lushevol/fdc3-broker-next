import { expect } from '@open-wc/testing';
import FormDataSource from '../../../../src/viewers/FormEditor/DataSource/index.js';
import { FormDefinition } from '../../../../src/models/FormDefinition.js';

describe('FormDataSource', () => {
  it('persists API namespace and dataset labels into formDefinition on save', () => {
    const formDataSource = new FormDataSource();
    const formDefinition = new FormDefinition();

    formDataSource.formDefinition = formDefinition;
    formDataSource.data = [];

    formDataSource.selectedSourceType = 'api';
    formDataSource.sourceName = 'Customer API';
    formDataSource.APIType = 'process';
    formDataSource.APINameSpace = '_55313_customer_api';
    formDataSource.APINameSpaceId = 'namespace-id-1';
    formDataSource.APINameSpaceName = 'Customer Service API';
    formDataSource.APINameSpaceLabel = '55313-customer-api';
    formDataSource.APIQueryName = '/api/customer/v1/profile';
    formDataSource.APIQueryNameLabel = 'Get Customer Profile';
    formDataSource.APIEndpoint = '/api/customer/v1/profile';
    formDataSource.APIEndpointSummary = '/api/customer/v1/profile';
    formDataSource.APIMethod = 'GET';
    formDataSource.APIArguments = [];
    formDataSource.APIFields = [];

    formDataSource.onSave();

    expect(formDefinition.dataSources).to.have.length(1);
    expect(formDefinition.dataSources[0].apiNameSpaceName).to.equal('Customer Service API');
    expect(formDefinition.dataSources[0].apiNameSpaceLabel).to.equal('55313-customer-api');
    expect(formDefinition.dataSources[0].apiQueryNameLabel).to.equal('Get Customer Profile');
  });
});