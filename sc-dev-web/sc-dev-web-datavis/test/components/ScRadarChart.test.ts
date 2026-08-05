import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScRadarChart } from '../../src/components/ScRadarChart.js';
import '../../elements/sc-radar-chart.js';

jest.mock('chart.js');

describe('ScRadarChart', () => {
  it('renders ScRadarChart', async () => {
    const data = {
      labels: ['App1', 'App2', 'App3', 'App4', 'App5', 'App6'],
      datasets: [
        {
          label: 'Data1',
          data: [65, 59, 90, 81, 56, 55],
          fill: true,
          backgroundColor: '--sc-color-blue-light,0.3',
          borderColor: '--sc-color-blue',
        }, {
          label: 'Data2',
          data: [28, 48, 40, 19, 96, 27],
          fill: true,
          backgroundColor: '--sc-color-green,0.3',
          borderColor: '--sc-color-green-dark',
        },
      ],
    };
    const colors = ['--sc-color-blue-dark'];
    const el = await fixture<ScRadarChart>(
      html`<sc-radar-chart .data=${data} .colors=${colors}></sc-radar-chart>`
    );

    expect(el).shadowDom.to.be.accessible();
  });
});
