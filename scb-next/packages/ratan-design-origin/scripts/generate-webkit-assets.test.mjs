import assert from 'node:assert/strict';
import test from 'node:test';
import postcss from 'postcss';
import { appendScopedTokenRules } from './token-css.mjs';

test('retains media and supports ancestry around scoped token declarations', () => {
  const source = postcss.parse(`
    :root { --sc-base: base; color: red; }
    @media screen and (max-width: 680px) {
      :root, :host { --sc-compact: compact; }
      @supports (display: grid) {
        :host { --sc-grid: grid; }
      }
    }
    .unrelated { --sc-leak: no; }
  `);
  const output = postcss.root();

  appendScopedTokenRules(source, output, 'Fixture.css');

  const directRules = output.nodes.filter((node) => node.type === 'rule');
  assert.equal(directRules.length, 1);
  assert.equal(directRules[0].nodes.length, 1);
  assert.equal(directRules[0].nodes[0].prop, '--sc-base');

  const mediaRules = output.nodes.filter((node) => node.type === 'atrule' && node.name === 'media');
  assert.equal(mediaRules.length, 2);
  assert.ok(mediaRules.every((rule) => rule.params === 'screen and (max-width: 680px)'));

  const compact = mediaRules[0].nodes[0];
  assert.equal(compact.selector, '.ratan-design-root[data-generation="webkit"]');
  assert.equal(compact.nodes[0].prop, '--sc-compact');

  const supports = mediaRules[1].nodes[0];
  assert.equal(supports.type, 'atrule');
  assert.equal(supports.name, 'supports');
  assert.equal(supports.params, '(display: grid)');
  assert.equal(supports.nodes[0].nodes[0].prop, '--sc-grid');
  assert.equal(output.toString().includes('--sc-leak'), false);
});
