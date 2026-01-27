/**
 * @fileoverview TypeScript Module Declarations
 *
 * This file provides TypeScript type declarations for various file types
 * and extends the global Window interface with application-specific properties.
 * These declarations enable TypeScript to understand non-TypeScript imports
 * and custom global variables.
 *
 * @module declarations
 */

// =============================================================================
// Asset Module Declarations
// =============================================================================

/**
 * Declares HTML file imports as raw string content.
 * Allows importing .html files directly in TypeScript code.
 *
 * @example
 * import template from './template.html';
 * // template is a string containing the HTML content
 */
declare module '*.html' {
  const rawHtmlFile: string;
  export = rawHtmlFile;
}

/**
 * Declares BMP image imports.
 * Returns the resolved URL/path to the image asset.
 */
declare module '*.bmp' {
  const src: string;
  export default src;
}

/**
 * Declares GIF image imports.
 * Returns the resolved URL/path to the image asset.
 */
declare module '*.gif' {
  const src: string;
  export default src;
}

/**
 * Declares JPG image imports.
 * Returns the resolved URL/path to the image asset.
 */
declare module '*.jpg' {
  const src: string;
  export default src;
}

/**
 * Declares JPEG image imports.
 * Returns the resolved URL/path to the image asset.
 */
declare module '*.jpeg' {
  const src: string;
  export default src;
}

/**
 * Declares PNG image imports.
 * Returns the resolved URL/path to the image asset.
 */
declare module '*.png' {
  const src: string;
  export default src;
}

/**
 * Declares WebP image imports.
 * Returns the resolved URL/path to the image asset.
 */
declare module '*.webp' {
  const src: string;
  export default src;
}

/**
 * Declares SVG image imports.
 * Returns the resolved URL/path to the SVG asset.
 */
declare module '*.svg' {
  const src: string;
  export default src;
}

// =============================================================================
// Global Interface Extensions
// =============================================================================

/**
 * Extends the global Window interface with application-specific properties.
 *
 * @property localStorage - Browser's local storage API
 * @property token - JWT authentication token for API requests
 * @property ratanConfig - Application configuration object loaded at runtime
 * @property single_spa_container_id - DOM element ID for single-spa microfrontend mounting
 */
declare interface Window {
  /** Browser's local storage API */
  localStorage: Storage;
  /** JWT authentication token used for API authentication */
  token: string;
  /** Runtime application configuration object */
  ratanConfig: Record<string, unknown>;
  /** DOM element ID where single-spa mounts the microfrontend */
  single_spa_container_id: string;
}

/**
 * SystemJS module loader type declaration.
 * Used for dynamic module loading in the microfrontend architecture.
 * @todo Define proper SystemJS interface when needed
 */
declare type System = Record<string, unknown>;
