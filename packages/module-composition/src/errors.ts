import type { ModuleReference } from './types';

export type ModuleCompositionErrorCode =
  | 'UNSUPPORTED_LOADER'
  | 'MISSING_COMPONENT_EXPORT'
  | 'INVALID_COMPONENT_EXPORT'
  | 'MODULE_COMPOSITION_UNAVAILABLE';

export class ModuleCompositionError extends Error {
  readonly name = 'ModuleCompositionError';

  constructor(
    readonly code: ModuleCompositionErrorCode,
    readonly reference?: ModuleReference,
    message?: string,
  ) {
    super(message ?? code);
  }
}
