// @ts-ignore
import BasicDefinitions from '@scdevkit/webkit/styles/ScBasicDefinitions.js';

const chartColorMapping : any = {
  '#00E394': '#00E394',
  '#00D1FF': '#00D1FF',
  '#086788': '#086788',
  '#0E61CA': '#0E61CA',
  '#13A092': '#13A092',
  '#147165': '#147165',
  '#4848BD': '#4848BD',
};

export function replaceDataColors(chartData: any) {
  const data = chartData;

  data.datasets.forEach((dataset: any) => {
    const colorFields = Object.keys(dataset).filter(key => key.toLocaleLowerCase().includes('color'));
    colorFields.forEach(field => {
      const colorData = dataset[field];
      if (typeof colorData === 'string') {
        dataset[field] = revertColor(colorData);
      } else if (Array.isArray(colorData)) {
        colorData.forEach((color, index) => {
          colorData.splice(index, 1, revertColor(color));
        });
      }
    });
  });

  return data;
}

export function replaceTooltipColors(tooltipData: any) {
  const tooltip = JSON.parse(JSON.stringify({ ...tooltipData, callbacks: undefined }));
  const colorFields = Object.keys(tooltip).filter(key => key.toLocaleLowerCase().includes('color'));
  colorFields.forEach(field => {
    const colorData = tooltip[field];
    tooltip[field] = revertColor(colorData);
  });

  return tooltip;
}

export function revertColor(color: string) {
  const colorVal = color.split(',');
  if (colorVal.length > 1) {
    const mappingColor = BasicDefinitions.colorMapping[colorVal[0]] || chartColorMapping[colorVal[0]] || BasicDefinitions.defaultBlueColor;
    let hex = mappingColor.trim().replace(/#/g, '');
    const alpha = colorVal[1].trim();
    if (hex.length === 3) {
      hex = hex.split('').map((hex: string) => hex + hex).join('');
    }
    // validate hex format
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(hex);
    if (result && alpha) {
      const red = parseInt(result[1], 16);
      const green = parseInt(result[2], 16);
      const blue = parseInt(result[3], 16);

      return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }
    return hex;
  }
  return BasicDefinitions.colorMapping[color] || chartColorMapping[color] || BasicDefinitions.defaultBlueColor;
}

export function propertyConverter(value:any) {
  return typeof value === 'string' ? JSON.parse(value.replace(/\\"/g, '"')) : value;
}
