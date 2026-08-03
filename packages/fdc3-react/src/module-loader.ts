import {
  ModuleFederationModuleAdapter,
  ModuleLoader,
  SystemJsModuleAdapter,
  UnavailableModuleLoader,
  type LoadRemote,
  type ModuleLoadLifecycleHooks,
  type ModuleLoaderApi,
  type SystemImport,
} from 'ratan-module-composition';

export const MODULE_LOAD_ENTITLEMENT_ACTION = 'load-module';

export interface FDC3ModuleLoaderOptions {
  /** Optional SystemJS importer. Defaults to the host's global System.import when available. */
  systemImport?: SystemImport;
  /** Optional Module Federation runtime loader. */
  loadRemote?: LoadRemote;
  /** Host-owned controls and observers applied to every module-load request. */
  lifecycle?: ModuleLoadLifecycleHooks;
}

type SystemRuntime = {
  import: SystemImport;
};

const getGlobalSystemImport = (): SystemImport | undefined => {
  const runtime = globalThis as typeof globalThis & { System?: SystemRuntime };
  return runtime.System?.import.bind(runtime.System);
};

/**
 * Creates the module-composition runtime exposed through the FDC3 agent.
 *
 * Runtime discovery is infrastructure-only: SystemJS is detected automatically,
 * while Module Federation can be supplied by hosts that use it.
 */
export const createFDC3ModuleLoader = (options: FDC3ModuleLoaderOptions = {}): ModuleLoaderApi => {
  const adapters = [];
  const systemImport = options.systemImport ?? getGlobalSystemImport();

  if (systemImport) {
    adapters.push(new SystemJsModuleAdapter(systemImport));
  }
  if (options.loadRemote) {
    adapters.push(new ModuleFederationModuleAdapter(options.loadRemote));
  }

  return adapters.length > 0
    ? new ModuleLoader(adapters, { lifecycle: options.lifecycle })
    : new UnavailableModuleLoader();
};
