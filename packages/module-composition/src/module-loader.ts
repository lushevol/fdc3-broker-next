import type { ComponentType } from 'react';
import { ModuleCompositionError } from './errors';
import type {
  ExposedModule,
  ModuleLoadErrorContext,
  ModuleLoaderApi,
  ModuleLoaderOptions,
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

  constructor(
    adapters: readonly ModuleRuntimeAdapter[],
    private readonly options: ModuleLoaderOptions = {},
  ) {
    for (const adapter of adapters) {
      this.adapters.set(adapter.loader, adapter);
    }
  }

  async load<Props = Record<string, never>>(
    reference: ModuleReference,
  ): Promise<ExposedModule<Props>> {
    const normalizedReference: Required<ModuleReference> = {
      ...reference,
      exportName: reference.exportName ?? DEFAULT_EXPORT,
    };

    try {
      await this.options.lifecycle?.beforeLoad?.({ reference: normalizedReference });

      const key = JSON.stringify(normalizedReference);
      const existing = this.loads.get(key);
      const fromCache = Boolean(existing);
      const module = await (existing ?? this.startLoad(normalizedReference, key));

      await this.options.lifecycle?.afterLoad?.({
        reference: normalizedReference,
        module,
        fromCache,
      });
      return module as ExposedModule<Props>;
    } catch (error: unknown) {
      await this.notifyLoadError({ reference: normalizedReference, error });
      throw error;
    }
  }

  private startLoad(reference: Required<ModuleReference>, key: string): Promise<ExposedModule> {
    const load = this.resolve(reference).catch((error: unknown) => {
      this.loads.delete(key);
      throw error;
    });
    this.loads.set(key, load);
    return load;
  }

  private async notifyLoadError(context: ModuleLoadErrorContext): Promise<void> {
    try {
      await this.options.lifecycle?.onLoadError?.(context);
    } catch {
      // Error observers must not hide the original load or authorization failure.
    }
  }

  private async resolve(reference: Required<ModuleReference>): Promise<ExposedModule> {
    const adapter = this.adapters.get(reference.loader);
    if (!adapter) {
      throw new ModuleCompositionError(
        'UNSUPPORTED_LOADER',
        reference,
        `No ${reference.loader} module-composition adapter is registered.`,
      );
    }

    const namespace = await adapter.loadModule(reference.moduleId);
    const exportName = reference.exportName;
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
      metadata: reference,
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
