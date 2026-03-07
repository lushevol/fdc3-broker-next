## Why

The FDC3 packages have accumulated technical debt including duplicated code, overly complex functions, dead code, and verbose constructs. This increases maintenance burden, makes the codebase harder to understand, and slows development velocity. A focused refactoring effort will reduce code volume by an estimated 1,200+ lines while improving maintainability.

## What Changes

- **Consolidate ErrorBoundary implementations**: Merge three nearly identical ErrorBoundary components (fdc3-agent, fdc3-broker, fdc3-resolver-ui) into a single shared implementation
- **Extract duplicated type re-exports**: Deduplicate FDC3 type exports across multiple packages
- **Remove dead/commented code**: Delete commented code blocks and debug console statements
- **Simplify entitlement check pattern**: Extract repeated entitlement validation logic into a shared method
- **Consolidate inline styles**: Extract repeated inline styles in React components to shared style constants
- **Reduce Broker class complexity**: Break down the monolithic Broker class into focused modules
- **Fix TypeScript suppressions**: Address type issues that require `@ts-expect-error` comments

## Capabilities

### New Capabilities

None. This is a refactoring effort focused on code quality, not new functionality.

### Modified Capabilities

None. No spec-level behavior changes. All refactoring preserves existing functionality and API contracts.

## Impact

**Packages Affected:**

- `packages/fdc3-agent` - ErrorBoundary consolidation, hook patterns, type exports
- `packages/fdc3-broker` - Major refactoring: Broker class decomposition, ErrorBoundary, channel types, entitlements, dead code removal
- `packages/fdc3-app-directory` - Type file organization, client method simplification
- `packages/fdc3-resolver-ui` - ErrorBoundary consolidation, inline style extraction

**Estimated Impact:**

- ~1,200+ lines reduced
- Improved code maintainability
- Reduced duplication
- No breaking changes to public APIs
- All existing tests must remain passing
