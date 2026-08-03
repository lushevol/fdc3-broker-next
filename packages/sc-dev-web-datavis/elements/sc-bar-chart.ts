import { ScBarChart } from '../src/components/ScBarChart.js';
export * from '../src/components/ScBarChart.js';

window.customElements.define('sc-bar-chart', ScBarChart);

declare global {
  interface HTMLElementTagNameMap {
    'sc-bar-chart': ScBarChart
  }
}
