import { ScScatterChart } from '../src/components/ScScatterChart.js';
export * from '../src/components/ScScatterChart.js';

window.customElements.define('sc-scatter-chart', ScScatterChart);

declare global {
  interface HTMLElementTagNameMap {
    'sc-scatter-chart': ScScatterChart
  }
}
