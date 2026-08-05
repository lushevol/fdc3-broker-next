import { ScPieChart } from '../src/components/ScPieChart.js';
export * from '../src/components/ScPieChart.js';

window.customElements.define('sc-pie-chart', ScPieChart);

declare global {
  interface HTMLElementTagNameMap {
    'sc-pie-chart': ScPieChart
  }
}
