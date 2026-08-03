import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScAreaChart } from '../../src/components/ScAreaChart.js';
import '../../elements/sc-area-chart.js';

jest.mock('chart.js');

describe('ScAreaChart', () => {
  it('renders ScAreaChart', async () => {
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
          pointStyle: false,
          borderColor: '--sc-color-blue-darker',
          backgroundColor: '--sc-color-blue-darker,0.5',
          tension: 0.4,
        },
        {
          label: 'Data2',
          data: [71, 56, 32, 41, 65, 52],
          pointStyle: false,
          borderColor: '--sc-color-blue',
          backgroundColor: '--sc-color-blue,0.5',
          tension: 0.4,
        },
      ],
    };
    const el = await fixture<ScAreaChart>(
      html`<sc-area-chart .data=${data}></sc-area-chart>`
    );

    expect(el).shadowDom.to.be.accessible();
  });
});
