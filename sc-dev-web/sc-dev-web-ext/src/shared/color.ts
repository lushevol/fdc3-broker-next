export function colorWithOpacity(color: string, opacity: number) {
  switch (true) {
    case /^#[0-9A-F]{6}$/i.test(color):
      return `${color}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0')}`;

    case /^rgb\((\s*\d+\s*){3}\/\s*\d+\%\s*\)$/.test(color):
      return color.replace(/\/\s*\d+\%/, `/ ${opacity * 100}%`);

    case /^rgb\((\s*\d+\s*){3}\/\s*\d+(\.\d+)?\s*\)$/.test(color):
      return color.replace(/\/.+?\)/, `/ ${opacity})`);

    case /^rgb\(\s*\d+,\s*\d+,\s*\d+\s*\)$/.test(color):
      return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);

    case /^rgba\(+/.test(color) || /^hsla\(/.test(color):
      return color.replace(/,[^,]+?\)$/, `, ${opacity})`);

    case /^hsl\(/.test(color):
      return color.replace('hsl', 'hsla').replace(')', `, ${opacity})`);

    default:
      console.warn(`colorWithOpacity: Unsupported color format "${color}"`);
      return color;
  }
}
