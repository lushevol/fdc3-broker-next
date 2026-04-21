import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import postcssNesting from 'postcss-nesting';
import prefixSelector from 'postcss-prefix-selector';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(root, 'src', 'styles.css');
const dest = resolve(root, 'dist', 'styles.css');

const css = readFileSync(src, 'utf8');

const twResult = await postcss([tailwindcss()]).process(css, { from: src, to: dest });

const nestedResult = await postcss([postcssNesting()]).process(twResult.css, { from: src, to: dest });

const SCOPE = '.cp-root';
const PORTAL = '[data-radix-popper-content-wrapper]';
const SCOPE_IS = `:is(${SCOPE}, ${PORTAL})`;

const result = await postcss([
  prefixSelector({
    prefix: SCOPE,
    transform(prefix, selector) {
      const sel = selector.trim();

      if (sel.startsWith('@')) {
        return sel;
      }

      if (sel === 'html.dark') {
        return `${SCOPE_IS}.dark`;
      }
      if (sel.startsWith('html.dark ')) {
        const rest = sel.slice('html.dark '.length);
        if (rest === '.cp-root') return `${SCOPE_IS}.dark`;
        if (rest.startsWith('.cp-root.')) return `${SCOPE_IS}.dark${rest.slice('.cp-root'.length)}`;
        if (rest.startsWith('.cp-root ')) return `${SCOPE_IS}.dark ${rest.slice('.cp-root '.length)}`;
        return `${SCOPE_IS}.dark ${rest}`;
      }

      if (sel === '.cp-root') {
        return SCOPE_IS;
      }
      if (sel.startsWith('.cp-root.')) {
        return `${SCOPE_IS}${sel.slice('.cp-root'.length)}`;
      }
      if (sel.startsWith('.cp-root ')) {
        return `${SCOPE_IS} ${sel.slice('.cp-root '.length)}`;
      }

      if (sel === ':root' || sel === 'html' || sel === ':host') {
        return SCOPE_IS;
      }
      if (sel.startsWith(':root ') || sel.startsWith('html ') || sel.startsWith(':host ')) {
        return `${SCOPE_IS} ${sel.slice(sel.indexOf(' ') + 1)}`;
      }
      if (sel === '*') {
        return `${SCOPE_IS} *`;
      }
      if (sel === 'body') {
        return SCOPE_IS;
      }
      if (sel.startsWith('body ')) {
        return selector.replace(/^body/, SCOPE_IS);
      }

      return `${SCOPE_IS} ${sel}`;
    },
  }),
]).process(nestedResult.css, { from: src, to: dest });

let output = result.css;

// Post-process: Custom property blocks set CSS variables (--*) that define
// light/dark theme colors. These MUST only target .cp-root, NOT
// [data-radix-popper-content-wrapper], because portal elements should INHERIT
// custom properties from .cp-root.dark rather than getting light-mode values
// set explicitly on them.
//
// We replace SCOPE_IS with .cp-root in blocks that ONLY set custom properties.
// This is done by finding the two specific blocks our source CSS produces:
//   1. The light-mode custom property block: SCOPE_IS { --background: ...; ... }
//   2. The dark-mode custom property block: SCOPE_IS.dark { --background: ...; ... }

// The light-mode block starts right after @layer base closes, as an unlayered block.
// We match the block that contains ONLY --variable: value declarations.

// Strategy: use PostCSS to parse and transform
const postProcessed = await postcss([
  {
    postcssPlugin: 'postcss-fix-custom-props',
    Once(root) {
      root.walkRules((rule) => {
        // Check if this rule only contains custom property declarations
        const onlyCustomProps = rule.nodes.every((node) => {
          if (node.type === 'comment') return true;
          if (node.type === 'decl') return node.prop.startsWith('--');
          return false;
        });

        if (!onlyCustomProps || rule.nodes.length === 0) return;

        // Replace SCOPE_IS with SCOPE in the selector
        rule.selector = rule.selector.replace(
          new RegExp(SCOPE_IS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          SCOPE
        );
      });
    },
  },
]).process(output, { from: src, to: dest });

mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, postProcessed.css, 'utf8');
