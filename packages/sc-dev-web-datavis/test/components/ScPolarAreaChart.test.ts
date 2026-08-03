import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScPolarAreaChart } from '../../src/components/ScPolarAreaChart.js';
import '../../elements/sc-polar-area-chart.js';

jest.mock('chart.js');

describe('ScPolarAreaChart', () => {
  it('renders ScPolarAreaChart', async () => {
    const data = {
      labels: ['App1', 'App2', 'App3', 'App4', 'App5'],
      datasets: [
        {
          label: 'Apps Dataset',
          data: [11, 16, 7, 3, 14],
          backgroundColor: [
            '--sc-color-blue-dark',
            '--sc-color-blue-darker',
            '--sc-color-green-dark',
            '--sc-color-grey-70',
            '--sc-color-blue-light',
          ],
        },
      ],
    };
    const colors = ['--sc-color-blue-dark'];
    const el = await fixture<ScPolarAreaChart>(
      html`<sc-polar-area-chart .data=${data} .colors=${colors}></sc-polar-area-chart>`
    );

    expect(el).shadowDom.to.be.accessible();
  });
});
