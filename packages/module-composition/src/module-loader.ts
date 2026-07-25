import type { ComponentType } from 'react';
import { ModuleCompositionError } from './errors';
import type {
  ExposedModule,
  ModuleLoaderApi,
  ModuleReference,
  ModuleRuntimeAdapter,
} from './types';

const DEFAULT_EXPORT = 'default';

/**
 * Caches normalized component modules while keeping SystemJS and Module
 * Federation runtime integration behind injected adapters.
 */
export class ModuleLoader implements ModuleLoaderApi {
  private readonly adapters = new Map<ModuleReference['loader'], ModuleRuntimeAdapter>();
  private readonly loads = new Map<string, Promise<ExposedModule>>();

  constructor(adapters: readonly ModuleRuntimeAdapter[]) {
    for (const adapter of adapters) {
      this.adapters.set(adapter.loader, adapter);
    }
  }

  load<Props = Record<string, never>>(reference: ModuleReference): Promise<ExposedModule<Props>> {
    const key = JSON.stringify({
      ...reference,
      exportName: reference.exportName ?? DEFAULT_EXPORT,
    });
    const existing = this.loads.get(key);
    if (existing) {
      return existing as Promise<ExposedModule<Props>>;
    }

    const load = this.resolve(reference).catch((error: unknown) => {
      this.loads.delete(key);
      throw error;
    });
    this.loads.set(key, load);
    return load as Promise<ExposedModule<Props>>;
  }

  private async resolve(reference: ModuleReference): Promise<ExposedModule> {
    const adapter = this.adapters.get(reference.loader);
    if (!adapter) {
      throw new ModuleCompositionError(
        'UNSUPPORTED_LOADER',
        reference,
        `No ${reference.loader} module-composition adapter is registered.`,
      );
    }

    const namespace = await adapter.loadModule(reference.moduleId);
    const exportName = reference.exportName ?? DEFAULT_EXPORT;
    if (!(exportName in namespace)) {
      throw new ModuleCompositionError(
        'MISSING_COMPONENT_EXPORT',
        reference,
        `Module ${reference.moduleId} does not expose ${exportName}.`,
      );
    }

    const component = namespace[exportName];
    if (!isComponent(component)) {
      throw new ModuleCompositionError(
        'INVALID_COMPONENT_EXPORT',
        reference,
        `Module ${reference.moduleId} export ${exportName} is not a React component.`,
      );
    }

    return {
      Component: component,
      metadata: { ...reference, exportName },
    };
  }
}

function isComponent(value: unknown): value is ComponentType<Record<string, never>> {
  return (
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null && '$$typeof' in value)
  );
}

/** Used by hosts that have not enabled module composition yet. */
export class UnavailableModuleLoader implements ModuleLoaderApi {
  async load<Props = Record<string, never>>(
    reference: ModuleReference,
  ): Promise<ExposedModule<Props>> {
    throw new ModuleCompositionError(
      'MODULE_COMPOSITION_UNAVAILABLE',
      reference,
      'The host has not configured module composition.',
    );
  }
}
