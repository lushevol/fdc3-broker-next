import { ScPolarAreaChart } from '../src/components/ScPolarAreaChart.js';
export * from '../src/components/ScPolarAreaChart.js';

window.customElements.define('sc-polar-area-chart', ScPolarAreaChart);

declare global {
  interface HTMLElementTagNameMap {
    'sc-polar-area-chart': ScPolarAreaChart
  }
}
