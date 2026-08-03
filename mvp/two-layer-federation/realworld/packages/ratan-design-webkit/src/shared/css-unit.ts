/**
 * Converts CSS unit to pixel relative to an element's property.
 * @param cssValue - eg '5rem' or '50%'
 * @param target - relative element, default to body
 * @param style  - the style property to measure from, default to 'width'
 * @returns number in pixels
 */
export function cssUnitToPx(cssValue: string, target = document.body, style = 'width') {
  const el = document.createElement('div');
  el.style.visibility = 'hidden';
  el.style.position = 'absolute';
  target.appendChild(el);
  el.style.setProperty(style, cssValue);
  const computedWidth = window.getComputedStyle(el).width;
  const pixelValue = parseFloat(computedWidth);
  target.removeChild(el);
  return pixelValue;
}
