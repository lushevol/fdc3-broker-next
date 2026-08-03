import { RelationshipFullConfig } from './types.js';

export const defaultFullConfig: RelationshipFullConfig = {
  fontSize: '0.875rem',
  fontFamily: '"SC Prosper Sans"',
  color: '--sc-relationship-color',
  animate: false,
  linkSelectThreshold: 10,
  zoom: {
    min: 1,
    max: 8,
    offsetX: 0,
    offsetY: 0,
    speed: 0.125,
  },
  node: {
    color: {
      default: '--sc-relationship-node-color',
      selected: '--sc-relationship-node-selected-color',
      hover: '--sc-relationship-node-hover-color',
      custom: {
        // person: '--sc-color-blue-500',
        // personSelected: '--sc-color-blue-600',
      },
    },
    size: { default: 32 },
    shape: { default: 'circle' },
    borderColor: {
      default: '--sc-relationship-node-border-color',
      selected: '--sc-relationship-node-border-selected-color',
      hover: '--sc-relationship-node-border-hover-color',
    },
    borderWidth: { default: 2 },
    fontColor: {
      default: '--sc-relationship-node-font-color',
      selected: '--sc-relationship-node-font-selected-color',
    },
    placeholder: { default: 'none' },
    imageUrl: { default: undefined },
    image: { default: undefined },
    maxChar: { default: undefined },
    rescale: { default: 0 },
    rescaleText: { default: 0 },
  },
  link: {
    showText: { default: true },
    fontSize: { default: '0.875rem' },
    fontColor: {
      default: '--sc-relationship-link-font-color',
      selected: '--sc-relationship-link-font-selected-color',
    },
    color: {
      default: '--sc-relationship-link-color',
      selected: '--sc-relationship-link-selected-color',
      hover: '--sc-relationship-link-hover-color',
      custom: {
        // entity: '--sc-color-grey-650',
      },
    },
    width: { default: 1 },
    line: { default: 'solid' },
    head: { default: 'arrow' },
    tail: { default: 'none' },
    size: { default: 3 },
    maxChar: { default: undefined },
    rescale: { default: 0 },
    rescaleText: { default: 0 },
  },
} as const;
