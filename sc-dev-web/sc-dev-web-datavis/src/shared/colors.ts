export type Rgb = {
  r: number;
  g: number;
  b: number;
  toString(): string;
};
export type Rgba = Rgb & {
  a: number;
};

export function hexToRgb(hex: string): Rgb | null {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res
    ? {
      r: parseInt(res[1], 16),
      g: parseInt(res[2], 16),
      b: parseInt(res[3], 16),
      toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
      },
    }
    : null;
}

export function hexToRgba(hex: string, opacity: number): Rgba | null {
  const rgb = hexToRgb(hex);
  return rgb
    ? {
      ...rgb,
      a: opacity,
      toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
      },
    }
    : null;
}

export function rgbToRgba(rgb: Rgb | string, opacity: number): Rgba | null {
  if (typeof rgb === 'string') {
    const res = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\)$/i.exec(rgb);
    return res
      ? {
        r: parseInt(res[1]),
        g: parseInt(res[2]),
        b: parseInt(res[3]),
        a: opacity,
        toString() {
          return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
        },
      }
      : null;
  } else {
    return {
      ...rgb,
      a: opacity,
      toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
      },
    };
  }
}