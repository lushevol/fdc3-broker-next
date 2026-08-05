import { property } from 'lit/decorators.js';
import { Chart, BarController, LineController, LineElement, PointElement, BarElement, CategoryScale, LinearScale, TimeScale, LogarithmicScale, TimeSeriesScale, BubbleController  } from 'chart.js';
import '../shared/time-adapter.js';
import { ScBaseChart } from './common/ScBaseChart.js';

export class ScBarChart extends ScBaseChart {
  constructor() {
    super();

    Chart.register(BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, LogarithmicScale, TimeSeriesScale, BubbleController);
  }

  @property({ type: String, attribute: false }) type = 'bar';

  getData() {
    const data = JSON.parse(JSON.stringify(this.data));
    // override backgroundColor in data if has colors
    if (this.colors.length > 0 && data.datasets.length > 0) {
      if (data.datasets.length > 1) {
        data.datasets.forEach((dataset: any, index: number) => {
          dataset.backgroundColor = this.colors[index] || dataset.backgroundColor?.[0];
        });
      } else {
        const bgColors = data.datasets[0].backgroundColor;
        if (Array.isArray(bgColors)) {
          bgColors.forEach((color: string, index: number) => {
            bgColors[index] = this.colors[index] || color;
          });
        } else {
          data.datasets[0].backgroundColor = this.colors[0] || bgColors;
        }
      }
    }
    return data;
  }
}
