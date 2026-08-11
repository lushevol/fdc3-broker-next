import { ScRadarChart } from '../src/components/ScRadarChart.js';
export * from '../src/components/ScRadarChart.js';

window.customElements.define('sc-radar-chart', ScRadarChart);

declare global {
  interface HTMLElementTagNameMap {
    'sc-radar-chart': ScRadarChart
  }
}
