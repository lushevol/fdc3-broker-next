import { getAncestorsOf } from './ancestor.js';

/**
 * Retrieves the first ancestor element that has stacking context for position:fixed element.
 * @param el
 * @returns
 */
export const getPositionFixedContainer = function (el: HTMLElement): Element | null {
  for (const parent of getAncestorsOf(el)) {
    if (parent.tagName === 'BODY') return parent;
    const style = getComputedStyle(parent);
    if (props.find((prop) => style[prop] !== 'none')) {
      return parent;
    }
  }
  return null;
};

const props = [
  'transform',
  'scale',
  'rotate',
  'translate',
  'filter',
  'backdropFilter',
  'perspective',
] as const;

getPositionFixedContainer.props = props;
