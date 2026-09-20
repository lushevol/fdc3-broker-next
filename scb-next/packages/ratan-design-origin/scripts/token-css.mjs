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

function customPropertyReferences(value) {
  return [...value.matchAll(/var\(\s*(--[\w-]+)/g)].map((match) => match[1]);
}

export function validateCustomPropertyGraph(source, roots, selectors) {
  const definitions = new Map();
  const acceptedSelectors = selectors ? new Set(selectors) : undefined;
  source.walkDecls((declaration) => {
    if (!declaration.prop.startsWith('--')) return;
    if (
      acceptedSelectors &&
      (declaration.parent.type !== 'rule' ||
        !declaration.parent.selectors.some((selector) => acceptedSelectors.has(selector.trim())))
    )
      return;
    const values = definitions.get(declaration.prop) ?? [];
    values.push(declaration.value);
    definitions.set(declaration.prop, values);
  });

  const missing = new Set();
  const cycles = new Set();
  const visit = (name, path) => {
    const cycleStart = path.indexOf(name);
    if (cycleStart >= 0) {
      cycles.add([...path.slice(cycleStart), name].join(' -> '));
      return;
    }
    const values = definitions.get(name);
    if (!values) {
      missing.add(name);
      return;
    }
    for (const value of values)
      for (const reference of customPropertyReferences(value)) visit(reference, [...path, name]);
  };

  for (const root of roots) visit(root, []);
  return {
    missing: [...missing].sort(),
    cycles: [...cycles].sort(),
  };
}
