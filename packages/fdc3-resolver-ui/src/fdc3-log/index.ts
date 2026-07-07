/**
 * FDC3 Log — logging and debug console for FDC3 interop
 */

export type { FDC3LogEntry, LogEntryCallback, TileIdentity } from './types';
export { LOG_CATEGORY_ICONS, LOG_LEVEL_COLORS } from './types';

export {
  initFDC3LogService,
  destroyFDC3LogService,
  subscribeToFDC3Logs,
  getFDC3LogEntries,
  clearFDC3Logs,
  pushFDC3Log,
} from './fdc3LogService';

export {
  default as FDC3ConsoleWidget,
} from './FDC3ConsoleWidget';
export type { FDC3ConsoleWidgetProps } from './FDC3ConsoleWidget';
