import { Chart } from 'chart.js';
import { resolve } from 'chart.js/helpers';
// @ts-ignore
import BasicDefinitions from '@scdevkit/webkit/styles/ScBasicDefinitions.js';
import labelUtils from '../shared/labelUtils.js';

// @ts-ignore
Chart.defaults.plugins.doughnutlabel = {
  font: {
    family: BasicDefinitions.fontFamily,
    lineHeight: 1.2,
    size: undefined,
    style: undefined,
    weight: 400,
  },
};

export function drawGaugeLabel(chart: any, options: any) {
  if (options && options.labels && options.labels.length > 0) {
    const { ctx } = chart;
    const innerLabels:any = [];
    options.labels.forEach((label: any) => {
      const text = typeof(label.text) === 'function' ? label.text(chart) : String(label.text);
      const innerLabel = {
        text,
        font: labelUtils.parseFont(resolve([label.font, options.font, {}], ctx, 0)),
        position: label.position,
        color: resolve([label.color, options.color, BasicDefinitions.colorMapping['--sc-color-grey-650']], ctx, 0),
      };
      innerLabels.push(innerLabel);
    });

    const maxTextAreaSize = labelUtils.textSize(ctx, innerLabels[0]);
    // Calculate the adjustment ratio to fit the text area into the doughnut inner circle
    const hypotenuse = Math.sqrt(Math.pow(maxTextAreaSize.width, 2) + Math.pow(maxTextAreaSize.height, 2));
    const innerDiameter = chart._metasets[chart._metasets.length - 1].data[0].innerRadius * 2;
    const fitRatio = innerDiameter / hypotenuse;
    // Adjust the font if necessary and recalculate the text area after applying the fit ratio
    if (fitRatio < 1) {
      innerLabels.forEach((innerLabel:any) => {
        innerLabel.font.size = Math.floor(innerLabel.font.size * fitRatio);
        innerLabel.font.lineHeight = undefined;
        innerLabel.font = labelUtils.parseFont(resolve([innerLabel.font, {}], ctx, 0));
      });
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < innerLabels.length; ++i) {
      const textAreaSize = labelUtils.textSize(ctx, innerLabels[i]);
      let centerX;
      let centerY;
      const { top, bottom, left, right, width, height } = chart.chartArea;
      const gaugeWidth = width / 2 * 0.1;
      
      if (innerLabels[i].position === 'left') {
        centerX = (left + (gaugeWidth > textAreaSize.width ? gaugeWidth : textAreaSize.width)) / 2;
        centerY = width / 2 + (height - width / 2) / 2 + top + textAreaSize.height / 2 + 10;
      } else if (innerLabels[i].position === 'right') {
        centerX = right - (gaugeWidth > textAreaSize.width ? gaugeWidth : textAreaSize.width) / 2;
        centerY = width / 2 + (height - width / 2) / 2 + top + textAreaSize.height / 2 + 10;
      } else {
        centerX = (left + right) / 2;
        centerY = (top + (options.donut ? 0 : height / 2) + bottom) / 2;
      }

      // The top Y coordinate of the text area
      const topY = centerY - textAreaSize.height / 2;

      ctx.fillStyle = innerLabels[i].color;
      ctx.font = innerLabels[i].font.string;

      // The Y center of line
      const lineCenterY = topY + innerLabels[i].font.lineHeight / 2;

      // Draw text
      ctx.fillText(innerLabels[i].text, centerX, lineCenterY);
    }
  }
}

Chart.register({
  id: 'gaugelabel',
  beforeDatasetDraw(chart, args, options) {
    drawGaugeLabel(chart, options);
  },
});
