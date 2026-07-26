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
