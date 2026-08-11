import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScPieChart } from '../../src/components/ScPieChart.js';
import '../../elements/sc-pie-chart.js';

jest.mock('chart.js');

describe('ScPieChart', () => {
  it('renders ScPieChart', async () => {
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
    const el = await fixture<ScPieChart>(
      html`<sc-pie-chart .data=${data} .colors=${colors}></sc-pie-chart>`
    );

    expect(el).shadowDom.to.be.accessible();
  });
});
