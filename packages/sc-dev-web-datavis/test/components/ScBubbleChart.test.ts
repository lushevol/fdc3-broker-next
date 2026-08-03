import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScBubbleChart } from '../../src/components/ScBubbleChart.js';
import '../../elements/sc-bubble-chart.js';

jest.mock('chart.js');

describe('ScBubbleChart', () => {
  it('renders ScBubbleChart', async () => {
    const data = {
      datasets: [
        {
          label: 'Data1',
          data: [{
            x: 20,
            y: 30,
            r: 15,
          }, {
            x: 40,
            y: 10,
            r: 10,
          }],
          backgroundColor: '--sc-color-blue-dark',
        },
        {
          label: 'Data2',
          data: [{
            x: 35,
            y: 20,
            r: 12,
          }, {
            x: 26,
            y: 10,
            r: 10,
          }],
          backgroundColor: '--sc-color-blue-darker',
        },
        {
          label: 'Data3',
          data: [{
            x: 30,
            y: 20,
            r: 15,
          }, {
            x: 36,
            y: 15,
            r: 15,
          }],
          backgroundColor: '--sc-color-blue-lighter',
        },
      ],
    };
    const el = await fixture<ScBubbleChart>(
      html`<sc-bubble-chart .data=${data}></sc-bubble-chart>`
    );

    expect(el).shadowDom.to.be.accessible();
  });
});
