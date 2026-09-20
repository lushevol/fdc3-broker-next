import postcss from 'postcss';

const tokenSelectors = new Set([':root', ':host', '.sc-mode-light', '.sc-mode-dark']);
const conditionalAtRules = new Set(['media', 'supports']);

function retainConditionalAncestry(rule, node) {
  let result = node;
  for (
    let ancestor = rule.parent;
    ancestor && ancestor.type !== 'root';
    ancestor = ancestor.parent
  ) {
    if (ancestor.type === 'atrule' && conditionalAtRules.has(ancestor.name.toLowerCase())) {
      result = postcss.atRule({ name: ancestor.name, params: ancestor.params }).append(result);
    }
  }
  return result;
}

export function appendScopedTokenRules(source, output, name) {
  source.walkRules((rule) => {
    if (!rule.selectors.every((selector) => tokenSelectors.has(selector.trim()))) return;
    const declarations = rule.nodes.filter(
      (node) => node.type === 'decl' && node.prop.startsWith('--sc-'),
    );
    if (!declarations.length) return;
    const mode =
      name === 'ScDarkMode.css'
        ? '[data-mode="dark"]'
        : name === 'ScLightMode.css'
          ? '[data-mode="light"]'
          : '';
    const scoped = postcss.rule({
      selector: `.ratan-design-root[data-generation="webkit"]${mode}`,
    });
    scoped.append(declarations.map((declaration) => declaration.clone()));
    output.append(retainConditionalAncestry(rule, scoped));
  });
}
