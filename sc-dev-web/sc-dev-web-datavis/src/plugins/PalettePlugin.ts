import {
  Chart,
  DoughnutController,
  BarController,
  LineController,
  PolarAreaController,
  ChartDataset,
  ElementChartOptions,
} from 'chart.js';
import { hexToRgb, hexToRgba } from '../shared/colors.js';
// @ts-ignore
import BasicDefinitions from '@scdevkit/webkit/styles/ScBasicDefinitions.js';

interface ColorsPluginOptions {
  enabled?: boolean;
  forceOverride?: boolean;
  theme?: keyof typeof COLORS;
  customColors?: string[];
}

interface ColorsDescriptor {
  backgroundColor?: unknown;
  borderColor?: unknown;
}

const DEFAULTS = [
  ['--sc-color-vis-graph-1', '#0E61CA'],
  ['--sc-color-vis-graph-2', '#086788'],
  ['--sc-color-vis-graph-3', '#00D1FF'],
  ['--sc-color-vis-graph-5', '#00E394'],
  ['--sc-color-vis-graph-6', '#13A092'],
  ['--sc-color-vis-graph-7', '#147165'],
  ['--sc-color-vis-graph-8', '#4848BD'],
] as const;

const COLORS = {
  default: {
    border: DEFAULTS.map(color => `${hexToRgb(BasicDefinitions.colorMapping[color[0]] ?? color[1])}`),
    // Border colors with 50% transparency
    bg: DEFAULTS.map(color => `${hexToRgba(BasicDefinitions.colorMapping[color[0]] ?? color[1], 0.5)}`),
  },
  risk: {
    border: [
      ['--sc-color-grey-950', '#0D0D0D'],
      ['--sc-color-red-500', '#E00A15'],
      ['--sc-color-amber-500', '#FAAD14'],
      ['--sc-color-green-500', '#38D200'],
      ['--sc-color-green-750', '#1A6900'],
      ['--sc-color-grey-150', '#D9D9D9'],
    ].map(color => `${hexToRgb(BasicDefinitions.colorMapping[color[0]] ?? color[1])}`),
    bg: null,
  },
  accessible: {
    border: [
      ['--sc-color-blue-500', '#0473EA'],
      ['--sc-color-green-500', '#38D200'],
      ['--sc-color-magenta-500', '#EE117B'],
      ['--sc-color-olive-500', '#B5C738'],
      ['--sc-color-violet-500', '#4848BD'],
      ['--sc-color-orange-500', '#EF6923'],
      ['--sc-color-maroon-500', '#AD225A'],
      ['--sc-color-teal-500', '#1AD3E5'],
      ['--sc-color-purple-500', '#7E1DFB'],
      ['--sc-color-amber-500', '#FAAD14'],
    ].map(color => `${hexToRgb(BasicDefinitions.colorMapping[color[0]] ?? color[1])}`),
    bg: null,
  },
  custom: {
    border: [],
    bg: null,
  },
};

export function getCssVariable(variableName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

export function getBorderColor(i: number, theme?: keyof typeof COLORS, customColors?: string[], followSubscript?: boolean) {
  const resolvedCustomColors = Array.isArray(customColors) ? customColors : [];

  const isCustomTheme = theme === 'custom' && resolvedCustomColors.length > 0;
  const list = isCustomTheme
    ? resolvedCustomColors.every(color => color.startsWith('--'))
      ? resolvedCustomColors.map(color => getCssVariable(color) || COLORS.default.border[i % COLORS.default.border.length])
      : COLORS.default.border
    : COLORS[theme ?? 'default']?.border || COLORS.default.border;

  if (theme === 'custom' && (resolvedCustomColors.length === 0 || !resolvedCustomColors.every(color => color.startsWith('--')))) {
    return COLORS.default.border[i % COLORS.default.border.length];
  }

  return followSubscript ? list[i] : list[i % list.length];
}

export function getBackgroundColor(i: number, theme?: keyof typeof COLORS, customColors?: string[]) {
  const borderColor = getBorderColor(i, theme, customColors);
  if (!borderColor) {
    return COLORS.default.bg[i % COLORS.default.bg.length];
  }

  let rgbColor: string = borderColor;
  if (rgbColor.startsWith('#')) {
    const rgb = hexToRgb(rgbColor);
    rgbColor = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : COLORS.default.border[i % COLORS.default.border.length];
  }
  if (rgbColor.startsWith('--')) {
    rgbColor = getCssVariable(rgbColor) || COLORS.default.border[i % COLORS.default.border.length];
  }

  const rgbaColor = rgbColor.replace('rgb(', 'rgba(').replace(')', ', 0.5)');
  return rgbaColor;
}

export function colorizeDefaultDataset(dataset: any, i: number, options: ColorsPluginOptions) {
  dataset.borderColor = getBorderColor(i, options.theme, options.customColors);
  dataset.backgroundColor = getBackgroundColor(i, options.theme, options.customColors);

  // eslint-disable-next-line
  return ++i;
}

export function colorizeDoughnutDataset(dataset: ChartDataset, i: number, options: ColorsPluginOptions) {
  // eslint-disable-next-line
  dataset.backgroundColor = dataset.data.map(() => getBorderColor(i++, options.theme, options.customColors));

  return i;
}

export function colorizePolarAreaDataset(dataset: ChartDataset, i: number, options: ColorsPluginOptions) {
  // eslint-disable-next-line
  dataset.backgroundColor = dataset.data.map(() => getBackgroundColor(i++, options.theme, options.customColors));

  return i;
}

export function colorizeBarDataset(dataset: ChartDataset, i: number, options: ColorsPluginOptions) {
  dataset.borderColor = getBorderColor(i, options.theme, options.customColors);
  const hasDatasetColors = Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor.some(color => color) : !!dataset.backgroundColor;
  if (hasDatasetColors && !options.customColors) {
    // @ts-ignore
    dataset.backgroundColor = dataset.data.map((data, j) => getBorderColor(j, options.theme, Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor ? [dataset.backgroundColor] : undefined, true));
  } else {
    dataset.backgroundColor = getBorderColor(i, options.theme, options.customColors);
  }
  // eslint-disable-next-line
  return ++i;
}

export function colorizeLineDataset(dataset: any, i: number, options: ColorsPluginOptions) {
  dataset.borderColor = getBorderColor(i, options.theme, options.customColors);
  if (dataset.fill) {
    dataset.backgroundColor = getBackgroundColor(i, options.theme, options.customColors);
  } else {
    dataset.backgroundColor = getBorderColor(i, options.theme, options.customColors);
  }

  // eslint-disable-next-line
  return ++i;
}

function getColorizer(chart: Chart, options: ColorsPluginOptions) {
  let i = 0;

  return (dataset: ChartDataset, datasetIndex: number) => {
    const { controller } = chart.getDatasetMeta(datasetIndex);

    if (controller instanceof DoughnutController) {
      i = colorizeDoughnutDataset(dataset, i, options);
    } else if (controller instanceof PolarAreaController) {
      i = colorizePolarAreaDataset(dataset, i, options);
    } else if (controller instanceof BarController) {
      i = colorizeBarDataset(dataset, i, options); 
    } else if ((controller as any) instanceof LineController) {
      i = colorizeLineDataset(dataset, i, options);
    } else if (controller) {
      i = colorizeDefaultDataset(dataset, i, options); 
    }
  };
}

function containsColorsDefinitions(descriptors: any) {
  let k: number | string;

  for (k in descriptors) {
    if (descriptors[k].borderColor || descriptors[k].backgroundColor) {
      return true;
    }
  }

  return false;
}

function containsColorsDefinition(descriptor: ColorsDescriptor) {
  return descriptor && (descriptor.borderColor || descriptor.backgroundColor);
}

export function chartColorizer(chart: Chart, options: ColorsPluginOptions) {
  if (!options.enabled) {
    return;
  }

  const {
    data: { datasets },
    options: chartOptions,
  } = chart.config;
  const { elements } = chartOptions as ElementChartOptions;

  if (
    !options.forceOverride &&
    (containsColorsDefinitions(datasets) ||
      containsColorsDefinition(chartOptions as ColorsDescriptor) ||
      (elements && containsColorsDefinitions(elements)))
  ) {
    return;
  }

  const colorizer = getColorizer(chart, options);
  datasets.forEach(colorizer);
}

Chart.register({
  id: 'palette',
  defaults: <ColorsPluginOptions>{
    enabled: true,
    forceOverride: false,
  },
  beforeLayout(chart: Chart, args, options: ColorsPluginOptions) {
    chartColorizer(chart, options);
  },
});
