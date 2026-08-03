import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScScatterChart } from '../../src/components/ScScatterChart.js';
import '../../elements/sc-scatter-chart.js';

jest.mock('chart.js');

describe('ScScatterChart', () => {
  it('renders ScScatterChart', async () => {
    const data = {
      datasets: [
        {
          label: 'Data1',
          data: [{
            x: -10,
            y: 0,
          }, {
            x: 0,
            y: 10,
          }, {
            x: 10,
            y: 5,
          }, {
            x: 0.5,
            y: 5.5,
          }],
          backgroundColor: '--sc-color-blue-dark',
        },
        {
          label: 'Data2',
          data: [{
            x: -6,
            y: 4,
          }, {
            x: 5,
            y: 8,
          }, {
            x: 7,
            y: 5,
          }, {
            x: 0.9,
            y: 6.5,
          }],
          backgroundColor: '--sc-color-green',
        },
      ],
    };
    const el = await fixture<ScScatterChart>(
      html`<sc-scatter-chart .data=${data}></sc-scatter-chart>`
    );

    expect(el).shadowDom.to.be.accessible();
  });
});
