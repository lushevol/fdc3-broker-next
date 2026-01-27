/**
 * @fileoverview Hooks Module Entry Point
 *
 * Provides a global hooks manager for accessing and updating application state.
 * This module exports a singleton object that holds the root store and provides
 * a simple interface for state management.
 *
 * @module hooks
 */

import { initialData, type RootModel } from './model/root';

/**
 * Hooks interface defining the global state management structure.
 */
export interface Hooks {
  /** The current root store state */
  store: RootModel;
  /** Function to update the root store state */
  setStore: (store: RootModel) => void;
}

/**
 * Global hooks singleton object.
 *
 * Provides a simple state management pattern where the store can be
 * accessed and updated from anywhere in the application.
 *
 * @example
 * // Get current state
 * const currentStore = hooks.store;
 *
 * // Update state
 * hooks.setStore({ ...currentStore, newValue: 'updated' });
 */
export const hooks: Hooks = {
  store: initialData,
  /**
   * Updates the root store with a new state object.
   * @param store - The new store state
   */
  setStore(store: RootModel) {
    this.store = store;
  },
};

/**
 * Returns the hooks singleton.
 * Useful for accessing the hooks object from modules that can't import it directly.
 *
 * @returns The global hooks singleton
 */
export const getHooks = () => hooks;
