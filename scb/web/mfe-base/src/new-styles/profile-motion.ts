import React from 'react';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

/** Host policy stays local; shared presentation currently has no public media-query hook. */
export const useProfileReducedMotion = () => {
  const media = React.useMemo(
    () => (typeof window === 'undefined' ? undefined : window.matchMedia?.(reducedMotionQuery)),
    [],
  );
  const subscribe = React.useCallback(
    (notify: () => void) => {
      media?.addEventListener('change', notify);
      return () => media?.removeEventListener('change', notify);
    },
    [media],
  );
  return React.useSyncExternalStore(
    subscribe,
    () => media?.matches ?? false,
    () => false,
  );
};
