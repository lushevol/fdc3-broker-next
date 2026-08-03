import { IronListAdapter } from './adapter.js';
import { TConfig } from './typeutils.js';

export class Virtualizer {
  private __adapter: IronListAdapter;
  constructor(config: TConfig) {
    this.__adapter = new IronListAdapter(config);
  }

  get firstVisibleIndex(): number {
    return this.__adapter.adjustedFirstVisibleIndex;
  }

  get lastVisibleIndex(): number {
    return this.__adapter.adjustedLastVisibleIndex;
  }

  get size(): number {
    return this.__adapter.size;
  }

  set size(size) {
    this.__adapter.size = size;
  }

  scrollToIndex(index?: number) {
    this.__adapter.scrollToIndex(index);
  }

  /**
   * Update if currently in the DOM
   */
  update(startIndex = 0, endIndex = this.size - 1) {
    this.__adapter.update(startIndex, endIndex);
  }

  /**
   * Flushes active asynchronous tasks so that the component and the DOM end up in a stable state
   */
  flush() {
    this.__adapter.flush();
  }
}
