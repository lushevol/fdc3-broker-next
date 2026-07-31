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
});
