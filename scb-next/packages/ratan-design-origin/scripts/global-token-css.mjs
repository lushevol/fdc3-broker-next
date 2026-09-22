/** Reuse the scoped token artifact, including conditional rules and font faces. */
export function createGlobalTokenStylesheet(scoped) {
  const global = scoped.clone();
  global.walkRules((rule) => {
    const appearance = rule.selector
      .replace('.ratan-design-root[data-generation="webkit"]', ':not([data-generation="legacy"])')
      .replace('.ratan-design-root[data-generation="legacy"]', '[data-generation="legacy"]')
      .replace('[data-mode="light"]', ':not([data-mode="dark"])');
    rule.selector = `:root:where(${appearance})`;
  });
  return global;
}
