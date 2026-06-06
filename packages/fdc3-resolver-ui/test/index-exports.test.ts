import { describe, expect, it } from 'vitest';
import * as resolverUi from '../src/index';

describe('fdc3-resolver-ui public exports', () => {
  it('should expose resolver components and hooks', () => {
    expect(resolverUi.ResolverDialog).toBeTypeOf('function');
    expect(resolverUi.AppCard).toBeTypeOf('function');
    expect(resolverUi.ContextPreview).toBeTypeOf('function');
    expect(resolverUi.useResolverKeyboard).toBeTypeOf('function');
  });

  it('should expose lazy loading helpers and error boundaries', () => {
    expect(resolverUi.lazyResolverDialog).toBeTypeOf('function');
    expect(resolverUi.lazyAppCard).toBeTypeOf('function');
    expect(resolverUi.lazyContextPreview).toBeTypeOf('function');
    expect(resolverUi.preloadResolver).toBeTypeOf('function');
    expect(resolverUi.ResolverSuspense).toBeTypeOf('function');
    expect(resolverUi.ErrorBoundary).toBeTypeOf('function');
    expect(resolverUi.ResolverErrorBoundary).toBeTypeOf('function');
  });
});
