import { ScDoughnutChart } from '../src/components/ScDoughnutChart.js';
export * from '../src/components/ScDoughnutChart.js';

window.customElements.define('sc-doughnut-chart', ScDoughnutChart);

declare global {
  interface HTMLElementTagNameMap {
    'sc-doughnut-chart': ScDoughnutChart
  }
}
