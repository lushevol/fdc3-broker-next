import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScBarChart } from '../../src/components/ScBarChart.js';
import '../../elements/sc-bar-chart.js';

jest.mock('chart.js');

describe('ScBarChart', () => {
  it('renders ScBarChart', async () => {
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
    const colors = ['--sc-color-blue-dark'];
    const el = await fixture<ScBarChart>(
      html`<sc-bar-chart .data=${data} .colors=${colors}></sc-bar-chart>`
    );

    expect(el).shadowDom.to.be.accessible();
  });

  it('overrides dataset backgroundColor when multiple datasets', async () => {
    const data = {
      labels: ['January', 'February'],
      datasets: [
        {
          label: 'Data1',
          data: [10, 20],
          backgroundColor: ['--sc-color-blue-500'],
        },
        {
          label: 'Data2',
          data: [30, 40],
          backgroundColor: ['--sc-color-green-500'],
        },
        {
          label: 'Data3',
          data: [50, 60],
          backgroundColor: ['--sc-color-red-500'],
        },
      ],
    };
    const el = await fixture<ScBarChart>(
      html`<sc-bar-chart .data=${data}></sc-bar-chart>`
    );

    const resolved = el.getData();
    expect(resolved.datasets[0].backgroundColor[0]).to.equal('--sc-color-blue-500');
    expect(resolved.datasets[1].backgroundColor[0]).to.equal('--sc-color-green-500');
    expect(resolved.datasets[2].backgroundColor[0]).to.equal('--sc-color-red-500');
  });

  it('overrides array backgroundColor when a single dataset', async () => {
    const data = {
      labels: ['January', 'February', 'March'],
      datasets: [
        {
          label: 'Data1',
          data: [10, 20, 30],
          backgroundColor: ['--sc-color-blue-500', '--sc-color-green-500', '--sc-color-red-500'],
        },
      ],
    };
    const el = await fixture<ScBarChart>(
      html`<sc-bar-chart .data=${data}></sc-bar-chart>`
    );

    const resolved = el.getData();
    expect(resolved.datasets[0].backgroundColor).to.deep.equal([
      '--sc-color-blue-500',
      '--sc-color-green-500',
      '--sc-color-red-500',
    ]);
  });
});
