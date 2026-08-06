export type RatanPointerType = 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual';

/** Stable press callback detail independent of the interaction implementation. */
export interface RatanPressEvent {
  readonly type: 'pressstart' | 'pressend' | 'pressup' | 'press';
  readonly pointerType: RatanPointerType;
  readonly target: Element;
  readonly shiftKey: boolean;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly altKey: boolean;
  readonly x: number;
  readonly y: number;
  readonly key?: string;
  continuePropagation(): void;
}
