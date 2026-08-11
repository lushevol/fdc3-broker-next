import { ScGaugeChart } from '../src/components/ScGaugeChart.js';
export * from '../src/components/ScGaugeChart.js';

window.customElements.define('sc-gauge-chart', ScGaugeChart);

declare global {
  interface HTMLElementTagNameMap {
    'sc-gauge-chart': ScGaugeChart
  }
}
