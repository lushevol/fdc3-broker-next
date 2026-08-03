import { ScBubbleChart } from '../src/components/ScBubbleChart.js';
export * from '../src/components/ScBubbleChart.js';

window.customElements.define('sc-bubble-chart', ScBubbleChart);

declare global {
  interface HTMLElementTagNameMap {
    'sc-bubble-chart': ScBubbleChart
  }
}
