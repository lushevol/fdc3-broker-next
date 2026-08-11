import { ScStackedBarChart } from '../src/components/ScStackedBarChart.js';
export * from '../src/components/ScStackedBarChart.js';

window.customElements.define('sc-stacked-bar-chart', ScStackedBarChart);

declare global {
  interface HTMLElementTagNameMap {
    'sc-stacked-bar-chart': ScStackedBarChart
  }
}
