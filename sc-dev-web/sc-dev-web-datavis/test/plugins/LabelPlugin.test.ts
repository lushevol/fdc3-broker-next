import { expect } from '@open-wc/testing';
import { drawGaugeLabel } from '../../src/plugins/LabelPlugin.js';

jest.mock('chart.js');
jest.mock('chart.js/helpers', () => ({
  __esModule: true,
  resolve: () => ({
    size: 16,
  }),
  valueOrDefault: () => 16,
  toLineHeight: () => 1.2,
  isNullOrUndef: () => false,
}));

describe('LabelUtils', () => {
  it('drawGaugeLabel', async () => {
    const result = drawGaugeLabel(
      {
        ctx: {
          fillText: () => {},
          measureText: () => ({ width: 20 }),
        },
        chartArea: {
          left: 0,
          top: 0,
          right: 300,
          bottom: 300,
          width: 300,
          height: 300,
        },
        _metasets: [
          {
            data: [
              {
                innerRadius: 150,
              },
            ],
          },
        ],
      },
      {
        labels: [
          {
            text: 20,
            color: '--sc-color-grey-100',
            font: {
              size: 20,
              weight: 600,
            },
          },
          {
            text: 0,
            position: 'left',
            color: '--sc-color-grey-100',
            font: {
              size: 12,
            },
          },
          {
            text: 100,
            position: 'right',
            color: '--sc-color-grey-100',
            font: {
              size: 12,
            },
          },
        ],
      }
    );
    expect(result).to.equal(undefined);
  });
});
