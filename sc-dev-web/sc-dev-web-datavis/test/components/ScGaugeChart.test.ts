import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScGaugeChart } from '../../src/components/ScGaugeChart.js';
import '../../elements/sc-gauge-chart.js';

jest.mock('chart.js');
jest.mock('chart.js/helpers');

describe('ScGaugeChart', () => {
  it('renders ScGaugeChart', async () => {
    const min = 0;
    const max = 100;
    const value = 20;
    const el = await fixture<ScGaugeChart>(
      html`<sc-gauge-chart min=${min} max=${max} value=${value}></sc-gauge-chart>`
    );

    expect(el).shadowDom.to.be.accessible();
  });
});
