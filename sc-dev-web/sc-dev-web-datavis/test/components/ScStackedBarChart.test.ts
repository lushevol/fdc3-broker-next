import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScStackedBarChart } from '../../src/components/ScStackedBarChart.js';
import '../../elements/sc-stacked-bar-chart.js';

jest.mock('chart.js');

describe('ScStackedBarChart', () => {
  it('renders ScStackedBarChart', async () => {
    const data = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
      ],
      datasets: [
        {
          label: 'Data1',
          data: [55, 59, 80, 45, 37, 60],
          backgroundColor: [
            '--sc-color-blue-dark',
          ],
          borderColor: '--sc-color-blue-dark',
        },
        {
          label: 'Data2',
          data: [71, 56, 32, 41, 65, 52],
          backgroundColor: [
            '--sc-color-blue-darker',
          ],
          borderColor: '--sc-color-blue-darker',
        },
        {
          label: 'Data3',
          data: [81, 26, 38, 57, 43, 30],
          backgroundColor: [
            '--sc-color-blue-light',
          ],
          borderColor: '--sc-color-blue-light',
        },
      ],
    };
    const el = await fixture<ScStackedBarChart>(
      html`<sc-stacked-bar-chart .data=${data}></sc-stacked-bar-chart>`
    );

    expect(el).shadowDom.to.be.accessible();
  });
});
