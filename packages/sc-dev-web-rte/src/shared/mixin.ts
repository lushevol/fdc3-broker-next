import { LitElement } from 'lit';

// Only can be use with element for now.
export type TConstructor<T> = new (...args: any[]) => T;

const appliedClassMixins = new WeakMap();

function ifMixinOnSuperClass(
  mixin: any,
  superClass: TConstructor<LitElement>
) {
  let klass = superClass;
  while (klass) {
    if (appliedClassMixins.get(klass) === mixin) {
      return true;
    }
    klass = Object.getPrototypeOf(klass);
  }
  return false;
}

export function safeMixin<
  SubInstance extends NonNullable<any>,
  SuperClass extends TConstructor<LitElement>
>(mixin: (superClass: SuperClass) => SuperClass & TConstructor<SubInstance>) {
  return (superClass: SuperClass) => {
    if (ifMixinOnSuperClass(mixin, superClass)) {
      return superClass as unknown as SuperClass & TConstructor<SubInstance>;
    }
    const mixedClass = mixin(superClass);
    appliedClassMixins.set(mixedClass, mixin);
    return mixedClass;
  };
}
