import type { ComponentType } from 'react';

export type ModuleLoaderKind = 'systemjs' | 'module-federation';

/** Identifies a deliberately exposed, embeddable component module. */
export interface ModuleReference {
  loader: ModuleLoaderKind;
  moduleId: string;
  exportName?: string;
}

/** The normalized result returned regardless of the underlying module runtime. */
export interface ExposedModule<Props = Record<string, never>> {
  Component: ComponentType<Props>;
  metadata: Required<ModuleReference>;
}

export interface ModuleLoadContext {
  reference: Required<ModuleReference>;
}

export interface ModuleLoadSuccessContext extends ModuleLoadContext {
  module: ExposedModule;
  fromCache: boolean;
}

export interface ModuleLoadErrorContext extends ModuleLoadContext {
  error: unknown;
}

export interface ModuleLoadLifecycleHooks {
  /** Runs before cache reuse or runtime resolution. Throw or reject to stop the load. */
  beforeLoad?(context: ModuleLoadContext): void | Promise<void>;
  /** Runs after a module has been normalized successfully. */
  afterLoad?(context: ModuleLoadSuccessContext): void | Promise<void>;
  /** Observes failures without replacing the original error. */
  onLoadError?(context: ModuleLoadErrorContext): void | Promise<void>;
}

export interface ModuleLoaderOptions {
  lifecycle?: ModuleLoadLifecycleHooks;
}

/** Platform extension; this is intentionally not an FDC3 API. */
export interface ModuleLoaderApi {
  load<Props = Record<string, never>>(reference: ModuleReference): Promise<ExposedModule<Props>>;
}

export type ModuleNamespace = Record<string, unknown>;

export interface ModuleRuntimeAdapter {
  readonly loader: ModuleLoaderKind;
  loadModule(moduleId: string): Promise<ModuleNamespace>;
}

export type SystemImport = (moduleId: string) => Promise<ModuleNamespace>;
export type LoadRemote = (moduleId: string) => Promise<ModuleNamespace>;
