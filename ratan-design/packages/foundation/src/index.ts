export {
  Button as AriaButtonAdapter,
  Calendar as AriaCalendarAdapter,
  CalendarCell as AriaCalendarCellAdapter,
  CalendarGrid as AriaCalendarGridAdapter,
  DateInput as AriaDateInputAdapter,
  DatePicker as AriaDatePickerAdapter,
  DateSegment as AriaDateSegmentAdapter,
  Dialog as AriaDialogAdapter,
  FieldError as AriaFieldErrorAdapter,
  Heading as AriaHeadingAdapter,
  I18nProvider as AriaI18nProviderAdapter,
  Input as AriaInputAdapter,
  Label as AriaLabelAdapter,
  Modal as AriaModalAdapter,
  ModalOverlay as AriaModalOverlayAdapter,
  Group as AriaGroupAdapter,
  Popover as AriaPopoverAdapter,
  Separator as AriaSeparatorAdapter,
  Tab as AriaTabAdapter,
  TabList as AriaTabListAdapter,
  TabPanel as AriaTabPanelAdapter,
  Tabs as AriaTabsAdapter,
  Text as AriaTextAdapter,
  TextArea as AriaTextAreaAdapter,
  TextField as AriaTextFieldAdapter,
  type ButtonProps as AriaButtonAdapterProps,
} from 'react-aria-components';
export { parseDate as parseCalendarDateAdapter } from '@internationalized/date';
export {
  useButton as useAriaButtonAdapter,
  useDialog as useAriaDialogAdapter,
  useFocusRing as useAriaFocusRingAdapter,
  useOverlay as useAriaOverlayAdapter,
  useTextField as useAriaTextFieldAdapter,
} from 'react-aria';

export type RatanPointerType = 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual';

/** Stable Ratan press callback detail; React Aria's event type remains private. */
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

export {
  createRatanChangeDetail,
  useControllableState,
  type ControllableState,
  type ControllableStateOptions,
  type RatanChangeDetail,
  type RatanChangeReason,
  type RatanStateUpdater,
  type SetControllableState,
} from './controllable-state.js';
