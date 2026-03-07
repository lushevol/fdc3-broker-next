import type { DomSignature } from './types.js';

/**
 * Checks if a CSS selector could potentially match an element in the DOM signature.
 * Uses conservative matching - when uncertain, returns true to keep the rule.
 *
 * @param selector - The CSS selector to check
 * @param signature - The DOM signature to match against
 * @returns true if the selector could match, false if it definitely cannot match
 */
export function selectorMatchesSignature(
  selector: string,
  signature: DomSignature,
): boolean {
  const trimmedSelector = selector.trim();

  // Empty selector - keep it
  if (!trimmedSelector) {
    return true;
  }

  // Check for pseudo-elements (::before, ::after) - always keep
  if (trimmedSelector.includes('::')) {
    return true;
  }

  // Check for complex pseudo-classes that are hard to analyze - keep them
  const complexPseudoClasses = [':not(', ':has(', ':where(', ':is('];
  for (const pseudo of complexPseudoClasses) {
    if (trimmedSelector.toLowerCase().includes(pseudo)) {
      return true;
    }
  }

  // Check for :root selector - always keep (CSS variables)
  if (trimmedSelector === ':root' || trimmedSelector.startsWith(':root')) {
    return true;
  }

  // Split by combinators (space, >, +, ~) to check individual components
  // We use a conservative approach: if all class/id/tag/attribute components exist, keep it
  const components = extractSelectorComponents(trimmedSelector);

  // Check each component
  for (const component of components) {
    if (!componentMatchesSignature(component, signature)) {
      return false;
    }
  }

  return true;
}

/**
 * Extracts individual components from a selector (removing combinators).
 */
function extractSelectorComponents(selector: string): string[] {
  // Remove pseudo-classes (but keep the base selector)
  let cleaned = selector.replace(/:[a-zA-Z-]+(\([^)]*\))?/g, '');

  // Split by combinators: space, >, +, ~
  // Also split by :where, :is, :not content (but we already handle these above)
  const components: string[] = [];

  // Simple split approach - get all class, id, tag, and attribute selectors
  const parts = cleaned.split(/[\s>+~]+/).filter(Boolean);

  for (const part of parts) {
    // Skip empty parts
    if (!part.trim()) continue;

    // Extract all class names, IDs, tags, and attributes from this part
    const extracts = extractIdentifiers(part);
    if (extracts.length > 0) {
      components.push(...extracts);
    } else {
      // If we can't extract anything, it might be a universal selector or complex case
      // Keep it to be safe
      components.push(part);
    }
  }

  return components;
}

/**
 * Extracts identifiers (class names, IDs, tags, attributes) from a selector part.
 */
function extractIdentifiers(part: string): string[] {
  const identifiers: string[] = [];

  // Extract class names (.classname)
  const classMatches = part.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g);
  if (classMatches) {
    for (const match of classMatches) {
      identifiers.push(`class:${match.slice(1)}`);
    }
  }

  // Extract IDs (#idname)
  const idMatches = part.match(/#([a-zA-Z_-][a-zA-Z0-9_-]*)/g);
  if (idMatches) {
    for (const match of idMatches) {
      identifiers.push(`id:${match.slice(1)}`);
    }
  }

  // Extract attribute selectors ([attr] or [attr=value])
  const attrMatches = part.match(/\[([^\]]+)\]/g);
  if (attrMatches) {
    for (const match of attrMatches) {
      const content = match.slice(1, -1); // Remove [ and ]

      // Check if it's an attribute=value pair
      if (content.includes('=')) {
        const [attrName] = content.split('=');
        identifiers.push(`attr:${attrName.trim()}`);
      } else {
        identifiers.push(`attr:${content.trim()}`);
      }
    }
  }

  // Extract tag name (word at the start or after combinators, not starting with .#[:*)
  // This is a simplified approach
  const tagMatch = part.match(/^[a-zA-Z][a-zA-Z0-9-]*/);
  if (tagMatch) {
    identifiers.push(`tag:${tagMatch[0]}`);
  }

  return identifiers;
}

/**
 * Checks if a single selector component matches the DOM signature.
 */
function componentMatchesSignature(
  component: string,
  signature: DomSignature,
): boolean {
  // Handle prefixed identifiers
  if (component.startsWith('class:')) {
    const className = component.slice(6);
    return signature.classes.has(className);
  }

  if (component.startsWith('id:')) {
    const idName = component.slice(3);
    return signature.ids.has(idName);
  }

  if (component.startsWith('attr:')) {
    const attrName = component.slice(5);
    return signature.attributes.has(attrName);
  }

  if (component.startsWith('tag:')) {
    const tagName = component.slice(4).toLowerCase();
    return signature.tags.has(tagName);
  }

  // Universal selector (*) or complex case - keep it
  if (component === '*' || component.includes('*')) {
    return true;
  }

  // Unknown format - keep it to be safe
  return true;
}

/**
 * Checks if any selector in a comma-separated list matches the DOM signature.
 *
 * @param selectorList - Comma-separated selector string
 * @param signature - The DOM signature to match against
 * @returns true if any selector matches
 */
export function anySelectorMatches(
  selectorList: string,
  signature: DomSignature,
): boolean {
  const selectors = selectorList.split(',');

  for (const selector of selectors) {
    if (selectorMatchesSignature(selector, signature)) {
      return true;
    }
  }

  return false;
}
