import type { LoadRemote, ModuleNamespace, ModuleRuntimeAdapter, SystemImport } from './types';

export class SystemJsModuleAdapter implements ModuleRuntimeAdapter {
  readonly loader = 'systemjs' as const;

  constructor(private readonly systemImport: SystemImport) {}

  loadModule(moduleId: string): Promise<ModuleNamespace> {
    return this.systemImport(moduleId);
  }
}

export class ModuleFederationModuleAdapter implements ModuleRuntimeAdapter {
  readonly loader = 'module-federation' as const;

  constructor(private readonly loadRemote: LoadRemote) {}

  loadModule(moduleId: string): Promise<ModuleNamespace> {
    return this.loadRemote(moduleId);
  }
}
