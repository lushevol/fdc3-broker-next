import { configuration } from './configuration.js';
import { MAPPING_TOOLBAR_COMMAND } from './constant.js';
import list from './core/list.js';
import type { RTEToolbar } from './ScRteToolbar.js';
import type { RTEViewer } from './ScRteViewer.js';

type TModules = typeof configuration.modules;
type TModuleKey = keyof TModules;

type TInstances<T extends TModuleKey> = {
  [key in T]: InstanceType<TModules[key]>;
};
type TConf = Omit<typeof configuration, 'modules'>;
export type TDom = {
  /**
   * viewer element
   */
  viewer: RTEViewer;
  /**
   * toolbar element
   */
  toolbar: RTEToolbar;
}

// TODO: better ts support
// ANA: custom Range object for more operation. like table
export type TOptions = {
  /**
   * toolbar config
   */
  toolbarConf: Array<keyof typeof MAPPING_TOOLBAR_COMMAND>;
} & TConf;

type TCombinedOpt = TOptions & TDom;

// ANA: do we need automatic inject dependencied?
export class Context {
  /**
   *  all useful modules. like editor, shortcurt etc
   */
  modules: TInstances<TModuleKey> = {} as TInstances<TModuleKey>;
  private defaultModule = 'editor';
  option: TCombinedOpt;
  constructor(opt: TOptions, doms: TDom) {
    const { modules, ...restConf } = configuration;
    this.option = doms as TCombinedOpt;
    Object.assign(this.option, restConf);
    Object.assign(this.option, opt);
    Object.entries(modules).forEach(([key, module]) => {
      (this.modules[<TModuleKey>key] as (typeof this.modules)[TModuleKey]) =
        new module(this);
    });
  }
  updateOption(key: keyof TOptions, value: unknown) {
    if (typeof value === 'function') {
      Object.defineProperty(this.option, key, {
        get: () => {
          return value();
        },
        configurable: true,
      });
    } else {
      this.option[key] = value as any;
    }
  }
  /**
   * trigger module.method with some arguments
   * @param namespace module.method
   * @param args arguments of particular methed
   * @returns void
   */
  invoke(namespace: string, ...args: Array<any>) {
    // ANA: need enhance ts support to show which method can use, include return type
    const splits = namespace.split('.');
    const hasSeparator = splits.length > 1;
    const moduleName: TModuleKey = hasSeparator && list.first(splits);
    const methodName = hasSeparator ? list.last(splits) : list.first(splits);

    const module = this.modules[moduleName || this.defaultModule];

    if (!moduleName && this[<keyof this>methodName]) {
      return (
        this[<keyof this>methodName] as (...args: any[]) => unknown
      ).apply(this, args);
    } else if (module && (<any>module)[methodName]) {
      return (<any>module)[methodName].apply(module, args);
    }
  }
  /**
   * trigger specified method of all module if exist. or skip it.
   * @param name method name of particular module
   * @param args arguments of particular methed
   */
  invokeHook(name: string, ...args: Array<any>) {
    Object.values(this.modules).forEach(module => {
      if (name in module) {
        (<any>module)[name].apply(module, args);
      }
    });
  }
}
