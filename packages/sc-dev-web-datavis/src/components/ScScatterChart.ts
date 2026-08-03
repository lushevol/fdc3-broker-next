import { property } from 'lit/decorators.js';
import { Chart, ScatterController, PointElement, LinearScale } from 'chart.js';
import { ScBaseChart } from './common/ScBaseChart.js';
import { replaceDataColors } from '../shared/util.js';

export class ScScatterChart extends ScBaseChart {
  constructor() {
    super();

    Chart.register(ScatterController, PointElement, LinearScale);
  }

  @property({ type: String, attribute: false }) type = 'scatter';

  @property() xAxis = { type: 'linear', position: 'bottom' };

  getData() {
    const data = JSON.parse(JSON.stringify(this.data));
    // override and backgroundColor in data if has colors
    if (this.colors.length > 0 && data.datasets.length > 0) {
      data.datasets.forEach((dataset: any, index: number) => {
        dataset.backgroundColor = this.colors[index] || dataset.backgroundColor;
      });
    }
    return replaceDataColors(data);
  }
}
