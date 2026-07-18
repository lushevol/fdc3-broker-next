import { IDENTITY_CONTRACT_VERSION } from '@fm/platform-contracts';
import { ANONYMOUS_IDENTITY_CAPABILITY, ANONYMOUS_IDENTITY_SNAPSHOT } from './identity';

describe('host anonymous identity fallback', () => {
  it('publishes one stable frozen versioned snapshot', () => {
    expect(ANONYMOUS_IDENTITY_SNAPSHOT).toEqual({
      state: 'anonymous', contractVersion: IDENTITY_CONTRACT_VERSION,
    });
    expect(Object.isFrozen(ANONYMOUS_IDENTITY_SNAPSHOT)).toBe(true);
    expect(ANONYMOUS_IDENTITY_CAPABILITY.getSnapshot()).toBe(ANONYMOUS_IDENTITY_SNAPSHOT);
    expect(ANONYMOUS_IDENTITY_CAPABILITY.getSnapshot()).toBe(
      ANONYMOUS_IDENTITY_CAPABILITY.getSnapshot(),
    );
    expect(Object.isFrozen(ANONYMOUS_IDENTITY_CAPABILITY)).toBe(true);
  });

  it('returns a no-op unsubscribe without publishing fabricated changes', () => {
    const listener = jest.fn();
    const unsubscribe = ANONYMOUS_IDENTITY_CAPABILITY.subscribe(listener);
    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
    expect(listener).not.toHaveBeenCalled();
  });
});
