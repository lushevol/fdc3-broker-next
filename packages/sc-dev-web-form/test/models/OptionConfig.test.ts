import { expect } from '@open-wc/testing';
import { OptionConfig } from '../../src/models/OptionConfig.js';

describe('OptionConfig model', () => {
  it('render the properties', () => {
    const newOptionConfig = new OptionConfig();
    expect(newOptionConfig.parameters.length).to.equal(1);
  });

  it('optionConfig from', () => {
    const optionConfig = OptionConfig.from({
      dataSource: {
        type: 'api',
      },
    } as any);
    expect(optionConfig.dataSource?.type).to.equal('api');
  });
});