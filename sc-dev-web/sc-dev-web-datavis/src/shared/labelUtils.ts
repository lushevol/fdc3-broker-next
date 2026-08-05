import { Chart } from 'chart.js';
import { valueOrDefault, toLineHeight, isNullOrUndef } from 'chart.js/helpers';

const utils = {
  parseFont(value: any) {
    const globalFont = Chart.defaults.font;
    const size = valueOrDefault(value.size, globalFont.size);
    const font:any = {
      family: valueOrDefault(value.family, globalFont.family),
      lineHeight: toLineHeight(value.lineHeight, size),
      size,
      style: valueOrDefault(value.style, globalFont.style),
      weight: valueOrDefault(value.weight, null),
      string: '',
    };
    font.string = utils.toFontString(font);

    return font;
  },

  toFontString(font: any) {
    if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
      return null;
    }

    return `${(font.style ? `${font.style  } ` : '')
      + (font.weight ? `${font.weight  } ` : '')
      + font.size  }px ${
      font.family}`;
  },

  textSize(ctx: any, data: any) {
    const len = Array.isArray(data) ? data.length : 1;
    const prev = ctx.font;
    let width = 0;
    let height = 0;

    for (let i = 0; i < len; ++i) {
      const label = Array.isArray(data) ? data[i] : data;
      ctx.font = label.font.string;
      width = Math.max(ctx.measureText(label.text).width, width);
      height = label.font.lineHeight;
    }
    ctx.font = prev;

    return { width, height };
  },
};

export default utils;
