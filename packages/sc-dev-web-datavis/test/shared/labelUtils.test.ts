import { expect } from '@open-wc/testing';
import LabelUtils from '../../src/shared/labelUtils.js';

jest.mock('chart.js');

describe('LabelUtils', () => {
  it('call parseFont', async () => {
    const result = LabelUtils.parseFont({ size: 16 });
    expect(result.size).to.equal(16);
  });

  it('call toFontString', async () => {
    const result = LabelUtils.toFontString({});
    expect(result).to.equal(null);
    const result1 = LabelUtils.toFontString({ size: 16, family: 'Arial' });
    expect(result1?.length).to.equal(10);
  });

  it('call textSize', async () => {
    const result = LabelUtils.textSize(
      {
        font: {
        },
        measureText: () => ({ width: 20 }),
      },
      { 
        font: {
          lineHeight: 1.2,
          string: '',
        },
        text: '0',
      }
    );

    expect(result.width).to.equal(20);
  });
});
