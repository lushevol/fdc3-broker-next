/**
 * @fileoverview Admin Module Interface Definitions
 *
 * Contains TypeScript interface definitions for the admin module components
 * and hooks.
 *
 * @module admin/common/interface
 */

/**
 * Props interface for admin module components.
 *
 * Defines the configuration props passed to admin module components
 * for identifying the context in which they're rendered.
 *
 * @property children - Optional child components to render
 * @property module - The admin sub-module path (e.g., '/tile', '/category', '/importmap', '/fdc3')
 * @property tile - The tile identifier where this admin module is rendered
 * @property panelId - The panel identifier for multi-panel layouts
 * @property tabId - The tab identifier for tabbed interfaces
 * @property parameters - Optional additional parameters for the module
 */
export interface AdminModuleProps {
  /** Optional child components to render within the admin module */
  children?: React.ReactNode;

  /** The admin sub-module to display (e.g., '/tile', '/category') */
  module: string;

  /** Identifier of the tile hosting this admin module */
  tile: string;

  /** Identifier of the panel within the layout */
  panelId: string;

  /** Identifier of the tab in a tabbed interface */
  tabId: string;

  /** Optional parameters passed to the admin module */
  // biome-ignore lint: Using any for flexible parameter types
  parameters?: any;
}
