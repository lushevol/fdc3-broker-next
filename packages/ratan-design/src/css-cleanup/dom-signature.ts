import * as cheerio from 'cheerio';
import type { DomSignature } from './types.js';

/**
 * Extracts a DOM signature from HTML containing all tags, classes, IDs, and attributes.
 *
 * @param html - The HTML string to analyze
 * @returns DomSignature object with Sets of all extracted data
 */
export function extractDomSignature(html: string): DomSignature {
  const $ = cheerio.load(html);

  const tags = new Set<string>();
  const classes = new Set<string>();
  const ids = new Set<string>();
  const attributes = new Set<string>();
  const attributePairs = new Set<string>();

  // Iterate over all elements
  $('*').each((_, element) => {
    // Extract tag name (lowercase)
    const tagName = element.tagName?.toLowerCase();
    if (tagName) {
      tags.add(tagName);
    }

    // Extract classes
    const classAttr = $(element).attr('class');
    if (classAttr) {
      // Split by whitespace to handle multiple classes
      const classList = classAttr.split(/\s+/).filter(Boolean);
      for (const className of classList) {
        classes.add(className);
      }
    }

    // Extract ID
    const idAttr = $(element).attr('id');
    if (idAttr) {
      ids.add(idAttr);
    }

    // Extract all attributes
    if (element.attribs) {
      for (const [name, value] of Object.entries(element.attribs)) {
        // Skip class and id as they're handled separately
        if (name === 'class' || name === 'id') continue;

        // Add attribute name
        attributes.add(name);

        // Add attribute pair if value exists
        if (value !== undefined && value !== '') {
          attributePairs.add(`${name}=${value}`);
        }
      }
    }
  });

  return {
    tags,
    classes,
    ids,
    attributes,
    attributePairs,
  };
}
