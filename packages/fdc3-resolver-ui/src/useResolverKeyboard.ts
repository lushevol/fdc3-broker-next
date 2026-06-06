/**
 * useResolverKeyboard Hook
 *
 * A custom React hook that manages keyboard navigation for the FDC3 resolver dialog.
 * Provides WCAG 2.1 AA compliant keyboard navigation with focus management.
 *
 * ## Features
 *
 * - **Arrow Key Navigation**: Up/Down arrows move focus through items
 * - **Cyclic Navigation**: Wraps from bottom to top and vice versa
 * - **Home/End Support**: Jump to first or last item
 * - **Selection Keys**: Enter or Space to select focused item
 * - **Escape Key**: Cancel the operation
 * - **Auto-reset**: Resets focus to first item when dialog opens
 * - **Event Cleanup**: Properly removes event listeners on unmount
 *
 * ## Supported Keyboard Shortcuts
 *
 * | Key | Action |
 * |-----|--------|
 * | `ArrowUp` | Move focus to previous item (wraps to bottom) |
 * | `ArrowDown` | Move focus to next item (wraps to top) |
 * | `Home` | Jump to first item |
 * | `End` | Jump to last item |
 * | `Enter` | Select the focused item |
 * | `Space` | Select the focused item |
 * | `Escape` | Cancel and close dialog |
 *
 * ## WCAG 2.1 AA Compliance
 *
 * This hook implements the following WCAG 2.1 Level AA criteria:
 *
 * - **2.1.1 Keyboard**: All functionality is operable through keyboard interface
 * - **2.1.2 No Keyboard Trap**: Keyboard focus can be moved away from the component
 * - **2.4.3 Focus Order**: Focus order follows a logical sequence
 * - **3.2.1 On Focus**: Focus changes don't cause context changes (only user activation)
 * - **3.3.1 Error Identification**: Clear feedback for user actions
 *
 * ## Usage
 *
 * Use this hook in the resolver dialog component to manage keyboard focus:
 *
 * ```typescript
 * function ResolverDialog({ targets, onSelect, onCancel, open }: Props) {
 *   const focusedIndex = useResolverKeyboard({
 *     itemCount: targets.length,
 *     onSelect: (index) => {
 *       const target = targets[index];
 *       onSelect(target);
 *     },
 *     onCancel,
 *     isOpen: open
 *   });
 *
 *   return (
 *     <div>
 *       {targets.map((target, index) => (
 *         <AppCard
 *           focused={focusedIndex === index}
 *           tabIndex={focusedIndex === index ? 0 : -1}
 *           {...otherProps}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * ## Return Value
 *
 * The hook returns a `number` representing the currently focused item index (0-based).
 * This value should be used to:
 *
 * 1. Determine which card has `focused={true}`
 * 2. Set `tabIndex={0}` on the focused card and `-1` on others
 * 3. Apply visual focus indicators
 *
 * ## Lifecycle Behavior
 *
 * - **Mount**: Adds `keydown` event listener to `document`
 * - **Unmount**: Removes event listener to prevent memory leaks
 * - **Dialog Opens**: Resets `focusedIndex` to `0` when `isOpen` becomes `true`
 * - **Dialog Closes**: Does nothing, index resets on next open
 *
 * ## Cyclic Navigation
 *
 * The arrow key navigation wraps around:
 *
 * - Pressing `ArrowDown` on the last item jumps to the first item
 * - Pressing `ArrowUp` on the first item jumps to the last item
 *
 * This is consistent with standard listbox behavior and improves usability.
 *
 * ## Event Propagation
 *
 * The hook calls `event.preventDefault()` for all handled keys to prevent
 * default browser behavior (e.g., page scrolling with arrow keys).
 *
 * ## Example Implementation
 *
 * @example
 * ```typescript
 * import { useResolverKeyboard } from '@fm/fdc3-resolver-ui';
 *
 * function MyResolver() {
 *   const [open, setOpen] = useState(false);
 *   const targets = [target1, target2, target3];
 *
 *   const focusedIndex = useResolverKeyboard({
 *     itemCount: targets.length,
 *     onSelect: (index) => {
 *       console.log('Selected:', targets[index].appId);
 *       // Handle selection
 *     },
 *     onCancel: () => {
 *       console.log('Cancelled');
 *       setOpen(false);
 *     },
 *     isOpen: open
 *   });
 *
 *   return (
 *     <div>
 *       {targets.map((target, index) => (
 *         <div
 *           key={target.appId}
 *           className={focusedIndex === index ? 'focused' : ''}
 *           tabIndex={focusedIndex === index ? 0 : -1}
 *         >
 *           {target.appId}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link ResolverDialog} - Component that uses this hook
 * @see {@link AppCard} - Component that receives the focus state
 */

import { useCallback, useEffect } from 'react';

/**
 * Options for the keyboard navigation hook.
 */
interface UseResolverKeyboardOptions {
  /**
   * Total number of items in the resolver list.
   *
   * Used to calculate focus bounds and implement cyclic navigation.
   */
  itemCount: number;

  /**
   * Callback fired when user selects an item.
   *
   * Called when user presses Enter or Space while an item is focused.
   * Receives the index of the selected item.
   *
   * @param index - The index of the selected item (0-based)
   */
  onSelect: (index: number) => void;

  /**
   * Callback fired when user cancels the operation.
   *
   * Called when user presses Escape. Typically used to close the dialog.
   */
  onCancel: () => void;

  /**
   * Whether the dialog is currently open.
   *
   * When `true`, keyboard navigation is active. When `false`, keyboard events
   * are ignored. The focused index is reset to 0 when this changes from `false` to `true`.
   */
  isOpen: boolean;
}

/**
 * Keyboard navigation hook for resolver UI
 *
 * @param options - Keyboard navigation options
 * @returns The index of the currently focused item (0-based)
 *
 * @example
 * ```typescript
 * const focusedIndex = useResolverKeyboard({
 *   itemCount: targets.length,
 *   onSelect: (index) => handleSelect(targets[index]),
 *   onCancel: () => handleClose(),
 *   isOpen: isDialogOpen
 * });
 * ```
 */
export const useResolverKeyboard = (options: UseResolverKeyboardOptions) => {
  const { itemCount, onSelect, onCancel, isOpen } = options;
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (itemCount > 0) {
            setFocusedIndex((prev) => (prev + 1) % itemCount);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (itemCount > 0) {
            setFocusedIndex((prev) => (prev - 1 + itemCount) % itemCount);
          }
          break;
        case 'Home':
          event.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setFocusedIndex(Math.max(0, itemCount - 1));
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (itemCount > 0 && focusedIndex >= 0 && focusedIndex < itemCount) {
            onSelect(focusedIndex);
          }
          break;
        case 'Escape':
          event.preventDefault();
          onCancel();
          break;
      }
    },
    [isOpen, itemCount, focusedIndex, onSelect, onCancel],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Reset focused index when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(0);
    }
  }, [isOpen, itemCount]);

  return focusedIndex;
};

import React from 'react';
