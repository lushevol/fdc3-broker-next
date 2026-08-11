import { IGraphDataPoint } from 'chartjs-chart-graph';
import { PartialDeepObject } from '../../../shared/object.js';

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireBy<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;
export type CapitalizeKeys<T> = {
  [K in keyof T as K extends string ? Capitalize<K> : K]: T[K];
};
export type PrefixKeys<T, P extends string> = {
  [K in keyof T as K extends string ? `${P}${K}` : K]: T[K];
}

export const RelNodeSymbol = Symbol('RelNode');
export const RelLinkSymbol = Symbol('RelLink');

export type HexColor = string & { readonly CssColor: unique symbol };
export type ScColorPrefixed = `--sc-color-${string}` | `--sc-${string}`;
export type PlaceholderType = 'image' | 'icon' | 'initial' | 'initials' | 'none';
export type Actions = 'hover' | 'selected';
export type ActSffx = 'Hover' | 'Selected' | '';
export type SlotPostions = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
/** Rules to show: eg. 150% (zoom > 150%), x2 (line length is atleast twice the text width), 300 (line alteast 300px) */
export type ShowCondition = Actions | number | `${string}%` | `x${string}`;

export type RelProperty<R, V=R> = {
  default: V,
  selected?: V,
  hover?: V,
  custom?: Record<string, V>,
};

export type RelationshipFullConfig = {
  color: ScColorPrefixed;
  fontFamily?: string;
  fontSize?: string;
  animate: boolean;
  linkSelectThreshold: number,
  zoom: {
    max: number;
    min: number;
    offsetX?: number;
    offsetY?: number;
    speed: number;
  };
  nodeImageGetter?: (node: RelNode) => Promise<string | HTMLImageElement | undefined>;
  node: {
    color: RelProperty<HexColor, ScColorPrefixed>;
    size: RelProperty<number>;
    shape: RelProperty<NonNullable<RelNodeStyles['shape']>>;
    borderColor: RelProperty<HexColor, ScColorPrefixed>;
    borderWidth: RelProperty<number>;
    fontFamily?: RelProperty<string | undefined>;
    fontSize?: RelProperty<string | undefined>;
    fontColor?: RelProperty<HexColor, ScColorPrefixed>;
    placeholder: RelProperty<PlaceholderType>;
    icon?: RelProperty<string | undefined>;
    imageUrl?: RelProperty<string | undefined>;
    image?: RelProperty<HTMLImageElement | undefined>;
    maxChar?: RelProperty<number | undefined>;
    rescale?: RelProperty<number>;
    rescaleText?: RelProperty<number>;
  };
  link: {
    showText: RelProperty<boolean | ShowCondition | ShowCondition[]>;
    color: RelProperty<HexColor, ScColorPrefixed>;
    width: RelProperty<number>;
    line: RelProperty<NonNullable<RelLinkData['line']>>;
    head: RelProperty<NonNullable<RelLinkData['head']>>;
    tail: RelProperty<NonNullable<RelLinkData['tail']>>;
    size: RelProperty<number>;
    fontFamily?: RelProperty<string | undefined>;
    fontSize?: RelProperty<string | undefined>;
    fontColor?: RelProperty<HexColor, ScColorPrefixed>;
    maxChar?: RelProperty<number | undefined>;
    rescale?: RelProperty<number>;
    rescaleText?: RelProperty<number>;
  };
  sim?: {
    collideRadius?: number | (() => number);
    linkDistance?: number | (() => number);
  }
};
export type RelationshipConfig = PartialDeepObject<RelationshipFullConfig>;


export const RelType = {
  person: 'Person',
  entity: 'Entity',
} as const;

export const RelLinkType = {
  direct: 'Direct',
  indirect: 'Indirect',
} as const;

type RelTyped = {
  type?: string,
}

/** Obj type passed to `ScRelationship` and `ScRelationshipDiagram` */
export type RelItem = RelTyped & {
  id: string,
  $index: number,
  $original?: unknown,
};

export type RelNodeStyles = {
  shape: 'circle' | 'rect' | 'rectRounded' | 'star' | 'triangle';
  placeholder: PlaceholderType,
} & Record<
  `color${ActSffx}` | `borderColor${ActSffx}` | `fontColor${ActSffx}`,
  ScColorPrefixed | HexColor
> &
  Record<
    `size${ActSffx}` | `borderWidth${ActSffx}` | 'maxChar',
    number
  > &
  Record<`fontFamily${ActSffx}` | `fontSize${ActSffx}` | `icon${ActSffx}`, string> &
  Record<`image${ActSffx}`, HTMLImageElement> &
  Record<`rescale${ActSffx}` | `rescaleText${ActSffx}`, number>;

/** Node type passed to `ScRelationshipDiagram` */
export type RelNodeData = RelItem & Partial<RelNodeStyles> & IGraphDataPoint & {
  /** Display label */
  name: string,
  /** Graph group */
  group?: number,
  imageUrl?: string,
  $image?: HTMLImageElement,
  $width?: number,
  $height?: number,
  [RelNodeSymbol]?: true,
}
/** 
 * Node type used within `ScRelationshipDiagram`
 *
 * Keys beginning with `$$` are resolved values.
 *
 * Keys beginning with `$` are internal values used by the diagram.
*/
export type RelNode = RelNodeData & PrefixKeys<RelNodeStyles, '$$'>;


export type RelLinkStyles = Record<`size${ActSffx}`, number> &
  Record<`color${ActSffx}` | `fontColor${ActSffx}`, ScColorPrefixed | HexColor> &
  Record<`width${ActSffx}` | 'maxChar', number> &
  Record<`fontFamily${ActSffx}` | `fontSize${ActSffx}`, string> &
  Record<`line${ActSffx}`, 'solid' | 'dotted' | 'dashed' | number[]> &
  Record<`head${ActSffx}` | `tail${ActSffx}`, 'arrow' | 'none'> & {
    showText: boolean | ShowCondition | ShowCondition[],
  } &
  Record<`showText${ActSffx}`, boolean> &
  Record<`rescale${ActSffx}` | `rescaleText${ActSffx}`, number>;

export type Relationship = {
  /** Display label */
  relationship?: string,
  /** Force value */
  value?: number,
  source: string,
  target: string,
  [RelLinkSymbol]?: true
}

/** NodeLink type passed to `ScRelationshipDiagram` */
export type RelLinkData = RelItem & Relationship & Partial<RelLinkStyles> & {
  $target?: RelNodeData,
  $source?: RelNodeData,
};
/** NodeLink type used within `ScRelationshipDiagram` */
export type RelLink = RelItem & Required<Relationship> & PrefixKeys<RelLinkStyles, '$$'> & {
  $target?: RelNode,
  $source?: RelNode,
};


export type PanValue = {
  left: number,
  top: number,
  right: number,
  bottom: number,
  width: number,
  height: number,
}
export type ZoomValue = PanValue & {
  zoom: number,
}


export type RelData = PartialBy<RelNodeData, '$index'> & {
  links?: (Pick<RelItem, 'id'> &
    Pick<Relationship, 'relationship'> &
    Partial<RelLinkStyles>)[];
};


export type RelEmployeeData = RelData & {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  department?: string;
  businessTitle?: string;
}
