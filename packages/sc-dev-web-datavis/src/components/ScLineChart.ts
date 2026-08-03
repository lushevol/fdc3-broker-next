import { property } from 'lit/decorators.js';
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, LogarithmicScale, TimeSeriesScale, BubbleController } from 'chart.js';
import '../shared/time-adapter.js';
import { ScBaseChart } from './common/ScBaseChart.js';
import { replaceDataColors } from '../shared/util.js';

export class ScLineChart extends ScBaseChart {
  constructor() {
    super();

    Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, LogarithmicScale, TimeSeriesScale, BubbleController);
  }

  @property({ type: String, attribute: false }) type = 'line';

  getData() {
    const data = JSON.parse(JSON.stringify(this.data));
    // override borderColor and backgroundColor in data if has colors
    if (this.colors.length > 0 && data.datasets.length > 0) {
      data.datasets.forEach((dataset: any, index: number) => {
        dataset.borderColor = this.colors[index] || dataset.borderColor;
        dataset.backgroundColor = this.colors[index] || dataset.backgroundColor;
      });
    }
    return replaceDataColors(data);
  }
}
