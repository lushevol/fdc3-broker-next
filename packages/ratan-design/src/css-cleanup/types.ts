/**
 * Options for the cleanUnusedCss function.
 */
export interface CleanUnusedCssOptions {
  /** The HTML string to process */
  html: string;
  /** Preserve :root CSS variables (default: true) */
  preserveVariables?: boolean;
  /** Preserve @keyframes rules (default: true) */
  preserveKeyframes?: boolean;
  /** Preserve @media queries (default: true) */
  preserveMediaQueries?: boolean;
}

/**
 * Statistics about the CSS cleanup operation.
 */
export interface CleanupStats {
  /** Total number of CSS rules before cleanup */
  originalRules: number;
  /** Number of CSS rules kept after cleanup */
  keptRules: number;
  /** Number of CSS rules removed */
  removedRules: number;
  /** Size of original HTML in bytes */
  originalSize: number;
  /** Size of cleaned HTML in bytes */
  newSize: number;
}

/**
 * Result of the cleanUnusedCss function.
 */
export interface CleanUnusedCssResult {
  /** The cleaned HTML string */
  html: string;
  /** Statistics about the cleanup operation */
  stats: CleanupStats;
}

/**
 * DOM signature containing all elements, classes, IDs, and attributes found in HTML.
 */
export interface DomSignature {
  /** All element tag names found (lowercase) */
  tags: Set<string>;
  /** All class names found */
  classes: Set<string>;
  /** All IDs found */
  ids: Set<string>;
  /** All attribute names found */
  attributes: Set<string>;
  /** All attribute pairs in format "name=value" */
  attributePairs: Set<string>;
}
