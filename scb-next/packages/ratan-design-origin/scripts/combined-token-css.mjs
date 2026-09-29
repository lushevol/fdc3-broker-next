import { createGlobalTokenStylesheet } from './global-token-css.mjs';

/** One declaration block per scope pair, with the original cascade and conditions. */
export function createCombinedTokenStylesheet(scoped) {
  const globalSelectors = [];
  createGlobalTokenStylesheet(scoped).walkRules((rule) => globalSelectors.push(rule.selector));
  const combined = scoped.clone();
  let index = 0;
  combined.walkRules((rule) => {
    rule.selector = `${rule.selector}, ${globalSelectors[index++]}`;
  });
  return combined;
}
