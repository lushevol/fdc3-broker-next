import { css, LitElement } from 'lit';
import { safeMixin, TConstructor } from '../shared/mixin.js';
import { Enum } from '../shared/enum.js';

const LAYER = Enum([
  'low-ground',
  'low-floating',
  'low-sky',
  'medium-ground',
  'medium-floating',
  'medium-sky',
  'high-ground',
  'high-floating',
  'high-sky',
] as const);

type TMixin = {
  layer: {
    [K in keyof Omit<typeof LAYER, 'reverse'>]: (typeof LAYER.reverse)[K];
  };
};

export const LayerHierarchyMixin = safeMixin(
  <T extends TConstructor<LitElement>>(superClass: T): TConstructor<TMixin> & T => {
    class HierarchyMixin extends superClass {
      layer = LAYER.reverse;
    }
    return HierarchyMixin;
  },
);

export const layerStyle = css`
  .low-ground {
    z-index: 10 !important;
  }
  .low-floating {
    z-index: 11 !important;
  }
  .low-sky {
    z-index: 12 !important;
  }
  .medium-ground {
    z-index: 13 !important;
  }
  .medium-floating {
    z-index: 14 !important;
  }
  .medium-sky {
    z-index: 15 !important;
  }
  .high-ground {
    z-index: 16 !important;
  }
  .high-floating {
    z-index: 17 !important;
  }
  .high-sky {
    z-index: 18 !important;
  }
`;
