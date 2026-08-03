import { ScAreaChart } from '../src/components/ScAreaChart.js';
export * from '../src/components/ScAreaChart.js';

window.customElements.define('sc-area-chart', ScAreaChart);

declare global {
  interface HTMLElementTagNameMap {
    'sc-area-chart': ScAreaChart
  }
}
