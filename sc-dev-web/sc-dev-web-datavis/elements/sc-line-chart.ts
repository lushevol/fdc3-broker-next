import { ScLineChart } from '../src/components/ScLineChart.js';
export * from '../src/components/ScLineChart.js';

window.customElements.define('sc-line-chart', ScLineChart);

declare global {
  interface HTMLElementTagNameMap {
    'sc-line-chart': ScLineChart
  }
}
