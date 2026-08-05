import { expect } from '@open-wc/testing';
import { 
  chartColorizer, 
  getCssVariable, 
  getBorderColor, 
  colorizeDefaultDataset,
  colorizeDoughnutDataset,
  colorizePolarAreaDataset,
  colorizeBarDataset,
  colorizeLineDataset,
  getBackgroundColor,
} from '../../src/plugins/PalettePlugin.js';
import { hexToRgb } from '../../src/shared/colors.js';
jest.mock('chart.js');

const COLORS = {
  default: {
    border: ['#0E61CA', '#086788', '#00D1FF', '#00E394', '#13A092', '#147165', '#4848BD'], 
  },
};

describe('Palette Plugin', () => {
  it('Palette disabled', async () => {
    const result = chartColorizer(
      {
        config: {
          data: {},
        },
      } as any,
      {
        enabled: false,
      }
    );
    expect(result).to.equal(undefined);
  });

  it('Already has color definitions', async () => {
    const result = chartColorizer(
      {
        config: {
          data: {
            datasets: [
              {
                data: [30, 70],
                backgroundColor: '#0E61CA',
              },
            ],
          },
          options: {},
        },
      } as any,
      {
        enabled: true,
      }
    );
    expect(result).to.equal(undefined);
  });

  it('chartColorizer', async () => {
    const result = chartColorizer(
      {
        config: {
          data: {
            datasets: [
              {
                data: [30, 70],
              },
            ],
          },
          options: {},
        },
        getDatasetMeta: () => {
          return { controller: {} };
        },
      } as any,
      {
        enabled: true,
      }
    );
    expect(result).to.equal(undefined);
  });
  
  it('should return the value of a CSS variable', () => {
    document.documentElement.style.setProperty('--test-color', '#123456');
    const result = getCssVariable('--test-color');
    expect(result).to.equal('#123456');
  });

  it('should return an empty string if the CSS variable is not defined', () => {
    const result = getCssVariable('--undefined-color');
    expect(result).to.equal('');
  });

  it('should use custom colors if the theme is "custom" and customColors are provided', () => {
    const customColors = ['--custom-color-1', '--custom-color-2'];
    document.documentElement.style.setProperty('--custom-color-1', '#FF0000');
    document.documentElement.style.setProperty('--custom-color-2', '#00FF00');
    const result = getBorderColor(0, 'custom', customColors);
    expect(result).to.equal('#FF0000');
  });

  it('should colorize the default dataset correctly', () => {
    const dataset = { borderColor: '', backgroundColor: '', fill: false } as any;
    const options = { theme: 'custom', customColors: ['--color1', '--color2'] } as any;

    const result = colorizeDefaultDataset(dataset, 0, options);
    expect(dataset.borderColor).to.equal(getBorderColor(0, options.theme, options.customColors));
    expect(dataset.backgroundColor).to.equal(getBackgroundColor(0, options.theme, options.customColors));
    expect(result).to.equal(1);
  });

  it('should colorize the doughnut dataset correctly', () => {
    const dataset = { data: [1, 2, 3], backgroundColor: [] } as any;
    const options = { theme: 'custom', customColors: ['--color1', '--color2'] } as any;
    const result = colorizeDoughnutDataset(dataset, 0, options);
  
    expect(dataset.backgroundColor).to.deep.equal([
      getBorderColor(0, options.theme, options.customColors),
      getBorderColor(1, options.theme, options.customColors),
      getBorderColor(2, options.theme, options.customColors),
    ]);
    expect(result).to.equal(3);
  });

  it('should colorize the polar area dataset correctly', () => {
    const dataset = { data: [1, 2, 3], backgroundColor: [] } as any;
    const options = { theme: 'custom', customColors: ['--color1', '--color2'] } as any;
    const result = colorizePolarAreaDataset(dataset, 0, options);
  
    expect(dataset.backgroundColor).to.deep.equal([
      getBackgroundColor(0, options.theme, options.customColors),
      getBackgroundColor(1, options.theme, options.customColors),
      getBackgroundColor(2, options.theme, options.customColors),
    ]);
    expect(result).to.equal(3);
  });

  it('should colorize the bar dataset correctly', () => {
    const dataset = { borderColor: '', backgroundColor: '' } as any;
    const options = { theme: 'custom', customColors: ['--color1', '--color2'] } as any;
    const result = colorizeBarDataset(dataset, 0, options);
  
    expect(dataset.borderColor).to.equal(getBorderColor(0, options.theme, options.customColors));
    expect(dataset.backgroundColor).to.equal(getBorderColor(0, options.theme, options.customColors));
    expect(result).to.equal(1);
  });

  it('should use dataset backgroundColor array for bar charts when customColors are not provided', () => {
    document.documentElement.style.setProperty('--bar-color-1', '#111111');
    document.documentElement.style.setProperty('--bar-color-2', '#222222');

    const dataset = {
      data: [1, 2],
      backgroundColor: ['--bar-color-1', '--bar-color-2'],
      borderColor: '',
    } as any;
    const options = { theme: 'custom' } as any;
    const result = colorizeBarDataset(dataset, 0, options);

    expect(dataset.backgroundColor).to.deep.equal(['#111111', '#222222']);
    expect(result).to.equal(1);
  });

  it('should colorize the line dataset correctly', () => {
    const dataset = { borderColor: '', backgroundColor: '', fill: true } as any;
    const options = { theme: 'custom', customColors: ['--color1', '--color2'] } as any;
    const result = colorizeLineDataset(dataset, 0, options);
  
    expect(dataset.borderColor).to.equal(getBorderColor(0, options.theme, options.customColors));
    expect(dataset.backgroundColor).to.equal(getBackgroundColor(0, options.theme, options.customColors));
    expect(result).to.equal(1);
  });

  it('should colorize the line dataset correctly', () => {
    const dataset = { borderColor: '', backgroundColor: '', fill: false } as any;
    const options = { theme: 'custom', customColors: ['--color1', '--color2'] } as any;
    const result = colorizeLineDataset(dataset, 0, options);
  
    expect(dataset.borderColor).to.equal(getBorderColor(0, options.theme, options.customColors));
    expect(result).to.equal(1);
  });

  it('should return default border color when theme is custom and customColors is empty or invalid', () => {
    const i = 1;
    const theme = 'custom';

    let customColors: string[] = [];
    let result = getBorderColor(i, theme, customColors);
    let rgb = hexToRgb(COLORS.default.border[i % COLORS.default.border.length]);
    let rgbColor = `rgb(${rgb?.r}, ${rgb?.g}, ${rgb?.b})`;
    expect(result).to.equal(rgbColor);

    customColors = ['invalidColor1', 'invalidColor2'];
    result = getBorderColor(i, theme, customColors);
    rgb = hexToRgb(COLORS.default.border[i % COLORS.default.border.length]);
    rgbColor = `rgb(${rgb?.r}, ${rgb?.g}, ${rgb?.b})`;
    expect(result).to.equal(rgbColor);

    customColors = ['--validColor', 'invalidColor'];
    result = getBorderColor(i, theme, customColors);
    rgb = hexToRgb(COLORS.default.border[i % COLORS.default.border.length]);
    rgbColor = `rgb(${rgb?.r}, ${rgb?.g}, ${rgb?.b})`;
    expect(result).to.equal(rgbColor);
  });


});