## Context

The FDC3 packages (`fdc3-agent`, `fdc3-broker`, `fdc3-app-directory`, `fdc3-resolver-ui`) have grown organically, accumulating technical debt. Key issues identified:

- **3 duplicate ErrorBoundary implementations** (~1,000 lines total, ~700 lines savings potential)
- **Duplicated type re-exports** across packages
- **Dead code**: Commented blocks, debug console.log statements
- **Verbose inline styles** in React components (~500 lines)
- **Monolithic Broker class** with 20+ methods in a single file
- **Repeated entitlement check patterns** across 4 methods
- **TypeScript suppressions** (`@ts-expect-error`) indicating underlying type issues

## Goals / Non-Goals

**Goals:**

- Reduce overall code volume by ~1,200+ lines
- Improve code maintainability and readability
- Eliminate code duplication across packages
- Remove dead/unused code
- Simplify complex functions
- All existing tests remain passing

**Non-Goals:**

- No new features or capabilities
- No API changes or breaking changes
- No performance optimization (unless incidental to refactoring)
- No dependency updates

## Decisions

### D1: ErrorBoundary Consolidation Strategy

**Decision:** Create a shared `ErrorBoundary` in `packages/fdc3-broker/src/ErrorBoundary.tsx` and re-export from other packages.

**Rationale:**

- `fdc3-broker` is the core package with no React component dependencies
- Both `fdc3-agent` and `fdc3-resolver-ui` already depend on `fdc3-broker`
- Avoids creating a new shared package for a single component

**Alternative considered:** Create new `@fm/shared-components` package. Rejected because it adds package complexity for a single component.

### D2: Inline Style Extraction Strategy

**Decision:** Extract inline styles to a `styles.ts` file in each package that needs them, using a `Styles` object pattern.

**Example:**

```typescript
// styles.ts
export const Styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  dialog: { ... },
  // ...
};
```

**Rationale:** Simple, no new dependencies, easy to maintain.

**Alternative considered:** CSS-in-JS library (styled-components, emotion). Rejected to avoid adding runtime dependencies.

### D3: Broker Class Decomposition

**Decision:** Keep `Broker` class as facade, extract logic to focused internal modules:

```
src/
├── broker.ts              # Facade, delegates to managers
├── broker/
│   ├── intent-handler.ts  # Intent raising/resolution
│   ├── channel-ops.ts     # Channel operations (not channel-manager)
│   └── bridge-setup.ts    # OpenFin/PostMessage bridge setup
```

**Rationale:** Preserves public API while improving internal organization.

**Alternative considered:** Split into multiple classes with composition. Rejected to maintain backward compatibility.

### D4: Entitlement Check Refactoring

**Decision:** Create a private `checkEntitlement()` method that handles the common pattern:

```typescript
private async checkEntitlement(
  tileId: string,
  action: string,
  logContext: Record<string, unknown>
): Promise<EntitlementCheckResult> {
  if (!this.config.callbacks.onValidateEntitlements) {
    this.logger.warn('No entitlement validation configured, allowing by default');
    return { allowed: true };
  }
  try {
    const entitled = await this.config.callbacks.onValidateEntitlements(tileId, action);
    if (!entitled) {
      this.logger.security(`${action} denied due to entitlements`, logContext);
      return { allowed: false, reason: `Not entitled for ${action}`, errorCode: 'ENTITLEMENT_DENIED' };
    }
    return { allowed: true };
  } catch (error) {
    this.logger.error(`Error checking ${action} entitlements`, error as Error);
    return { allowed: false, reason: 'Error validating entitlements', errorCode: 'ENTITLEMENT_ERROR' };
  }
}
```

**Rationale:** Eliminates ~100 lines of duplicated code while maintaining the same API.

### D5: Type Export Consolidation

**Decision:** Each package keeps its own `types.ts` but imports from a single source within the package. Remove duplicate re-exports from `index.ts` files.

**Rationale:** Maintains package independence while reducing duplication.

## Risks / Trade-offs

| Risk                                               | Mitigation                                                       |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| Breaking imports when consolidating ErrorBoundary  | Re-export from original locations with deprecation comments      |
| Missing test coverage for refactored code          | Run full test suite before/after each change                     |
| Introducing bugs during Broker decomposition       | Keep methods small, refactor incrementally, test after each step |
| TypeScript errors when removing `@ts-expect-error` | Fix underlying type issues, don't just remove suppressions       |
| Inline style extraction breaking React rendering   | Verify visual behavior unchanged after extraction                |

## Migration Plan

1. **Phase 1: Remove dead code** (lowest risk)
   - Delete commented code blocks
   - Remove debug console.log statements
   - Remove unused imports

2. **Phase 2: Consolidate ErrorBoundary** (medium risk)
   - Move to fdc3-broker
   - Update imports in fdc3-agent, fdc3-resolver-ui
   - Verify tests pass

3. **Phase 3: Extract inline styles** (low risk)
   - Create styles.ts files
   - Update component imports
   - Visual verification

4. **Phase 4: Refactor entitlement checks** (low risk)
   - Add shared method
   - Update callers
   - Verify tests pass

5. **Phase 5: Decompose Broker class** (higher risk)
   - Extract methods to focused modules
   - Keep Broker as facade
   - Incremental testing

## Open Questions

None. All technical decisions are resolved.
