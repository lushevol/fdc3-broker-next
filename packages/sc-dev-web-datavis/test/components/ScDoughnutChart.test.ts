import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScDoughnutChart } from '../../src/components/ScDoughnutChart.js';
import '../../elements/sc-doughnut-chart.js';

jest.mock('chart.js');

describe('ScDoughnutChart', () => {
  it('renders ScDoughnutChart', async () => {
    const data = {
      labels: [
        'Red',
        'Blue',
        'Yellow',
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 4,
      }],
    };
    const colors = ['--sc-color-blue-dark'];
    const el = await fixture<ScDoughnutChart>(
      html`<sc-doughnut-chart .data=${data} .colors=${colors}></sc-doughnut-chart>`
    );

    expect(el).shadowDom.to.be.accessible();
  });
});
