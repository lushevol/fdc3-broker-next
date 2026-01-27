import type { DeclaredIntent } from './interfaces/types';

export const filterDuplicateDeclaredIntents = () => {
  const intentContextSet = new Set<string>();
  return (di: DeclaredIntent) => {
    const key = `${di.intent}|${di.contextType}`;
    if (intentContextSet.has(key)) {
      return false;
    } else {
      intentContextSet.add(key);
      return true;
    }
  };
};
