/**
 * Retrieves all parent elements including shadowDom (open) hosts and assigned slots.
 * @param element The element for which to find ancestors.
 **/
export function* getAncestorsOf(element: Element): Generator<Element> {
  let parent: Element | null = element;
  while (parent) {
    if (parent.assignedSlot || parent.parentElement) {
      parent = parent.assignedSlot ?? parent.parentElement;
    } else {
      const root = parent.getRootNode();
      if (root instanceof ShadowRoot) {
        parent = root.host;
      } else {
        break;
      }
    }
    if (parent) yield parent;
  }
}

/**
 * Finds the first ancestor of an element that matches a given predicate.
 * @param element The element for which to find an ancestor.
 * @param predicate A function that takes an element.
 * @returns The first ancestor element that matches the predicate, or null if none is found.
 */
export function findAncestor(
  element: Element,
  predicate: (el: Element) => boolean,
): Element | null {
  for (const parent of getAncestorsOf(element)) {
    if (predicate(parent)) return parent;
  }
  return null;
}
