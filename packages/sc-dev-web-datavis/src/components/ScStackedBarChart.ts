import { property } from 'lit/decorators.js';
import { ScBarChart } from './ScBarChart.js';

export class ScStackedBarChart extends ScBarChart {
  constructor() {
    super();
  }

  @property({ type: Boolean, attribute: false }) stacked = true;
}
