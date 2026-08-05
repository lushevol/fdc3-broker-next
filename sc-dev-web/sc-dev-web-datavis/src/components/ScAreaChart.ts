import { property } from 'lit/decorators.js';
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, LogarithmicScale, TimeSeriesScale } from 'chart.js';
import '../shared/time-adapter.js';
import { ScBaseChart } from './common/ScBaseChart.js';
import { replaceDataColors } from '../shared/util.js';

export class ScAreaChart extends ScBaseChart {
  constructor() {
    super();

    Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, LogarithmicScale, TimeSeriesScale);
  }

  @property({ type: String || Boolean || Object }) fill = 'origin';

  @property({ type: String, attribute: false }) type = 'line';

  getData() {
    const data = JSON.parse(JSON.stringify(this.data));
    // add fill to dataset
    if (data.datasets.length > 0) {
      data.datasets.forEach((dataset: any) => {
        dataset.fill = this.fill;
      });
    }

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
