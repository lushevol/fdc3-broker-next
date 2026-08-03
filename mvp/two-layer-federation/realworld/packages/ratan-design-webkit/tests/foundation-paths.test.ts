import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LayerHierarchyMixin as canonicalLayerHierarchyMixin } from '../src/mixins/layer-hierarchy-mixin.js';
import { ObserverMxin as canonicalObserverMixin } from '../src/mixins/observer-mixin.js';
import { PopupHandledMixin as canonicalPopupHandledMixin } from '../src/mixins/popup-handled-mixin.js';
import { PopupMixin as canonicalPopupMixin } from '../src/mixins/popup-mixin.js';
import { RangeMixin as canonicalRangeMixin } from '../src/mixins/range-mixin.js';
import { ToolMixin as canonicalToolMixin } from '../src/mixins/tool-mixin.js';
import { LayerHierarchyMixin as styleLayerHierarchyMixin } from '../src/styles/layer-hierarchy-mixin.js';
import { ObserverMxin as styleObserverMixin } from '../src/styles/observer-mixin.js';
import { PopupHandledMixin as stylePopupHandledMixin } from '../src/styles/popup-handled-mixin.js';
import { PopupMixin as stylePopupMixin } from '../src/styles/popup-mixin.js';
import { RangeMixin as styleRangeMixin } from '../src/styles/range-mixin.js';
import { ToolMixin as styleToolMixin } from '../src/styles/tool-mixin.js';

describe('WebKit canonical foundation paths', () => {
  it('maps component mixin imports to the imported implementations', () => {
    expect(canonicalPopupMixin).toBe(stylePopupMixin);
    expect(canonicalToolMixin).toBe(styleToolMixin);
    expect(canonicalPopupHandledMixin).toBe(stylePopupHandledMixin);
    expect(canonicalLayerHierarchyMixin).toBe(styleLayerHierarchyMixin);
    expect(canonicalObserverMixin).toBe(styleObserverMixin);
    expect(canonicalRangeMixin).toBe(styleRangeMixin);
  });

  it('has no runtime dependency on the legacy design package', () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'),
    ) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
    const sourceFiles = [
      '../src/index.ts',
      '../src/wrapper/ReactWrapper.ts',
    ].map((file) => readFileSync(resolve(import.meta.dirname, file), 'utf8'));

    const removedRootComponents = [
      'provider.tsx',
      'dialog.tsx',
      'divider.tsx',
      'status-badge.tsx',
      'react-components.tsx',
    ];

    expect(packageJson.dependencies?.['@fm/ratan-design']).toBeUndefined();
    expect(packageJson.devDependencies?.['@fm/ratan-design']).toBeUndefined();
    expect(packageJson.peerDependencies?.['@fm/ratan-design']).toBeUndefined();
    expect(sourceFiles.join('\n')).not.toContain('@fm/ratan-design');
    expect(
      removedRootComponents.some((file) =>
        existsSync(resolve(import.meta.dirname, '..', 'src', file)),
      ),
    ).toBe(false);
  });
});
