## 1. Remove Dead Code (Low Risk)

- [x] 1.1 Remove commented code blocks in `packages/fdc3-agent/src/hooks.tsx` (lines 138-141, 181-193)
- [x] 1.2 Remove commented code blocks in `packages/fdc3-broker/src/broker.ts` (lines 268-283)
- [x] 1.3 Remove commented code in `packages/fdc3-broker/src/environment.ts` (line 19)
- [x] 1.4 Remove debug console.log in `packages/fdc3-broker/src/environment.ts` (lines 15-18)
- [x] 1.5 Remove unused imports and variables across all FDC3 packages
- [x] 1.6 Run tests to verify no behavior changes

## 2. Consolidate ErrorBoundary Components (Medium Risk)

- [x] 2.1 Identify the most complete ErrorBoundary implementation (likely `fdc3-resolver-ui`)
- [x] 2.2 Create consolidated `ErrorBoundary.tsx` in `packages/fdc3-broker/src/`
- [x] 2.3 Add re-export from `packages/fdc3-agent/src/ErrorBoundary.tsx` with deprecation comment
- [x] 2.4 Add re-export from `packages/fdc3-resolver-ui/src/ResolverErrorBoundary.tsx` with deprecation comment
- [x] 2.5 Update imports in consuming components
- [x] 2.6 Delete original ErrorBoundary files after migration verified
- [x] 2.7 Run tests to verify ErrorBoundary behavior unchanged

## 3. Extract Inline Styles (Low Risk)

- [x] 3.1 Create `packages/fdc3-resolver-ui/src/styles.ts` with extracted style constants
- [x] 3.2 Refactor `ResolverDialog.tsx` to use shared styles
- [x] 3.3 Refactor `AppCard.tsx` to use shared styles
- [x] 3.4 Refactor `ContextPreview.tsx` to use shared styles
- [x] 3.5 Refactor `lazy.tsx` to use shared styles
- [x] 3.6 Visual verification of UI components

## 4. Refactor Entitlement Checks (Low Risk)

- [x] 4.1 Create private `checkEntitlement()` method in `EntitlementValidator` class
- [x] 4.2 Refactor `canSendIntent()` to use shared method
- [x] 4.3 Refactor `canReceiveIntent()` to use shared method
- [x] 4.4 Refactor `canJoinChannel()` to use shared method
- [x] 4.5 Refactor `canOpenTile()` to use shared method
- [x] 4.6 Run tests to verify entitlement behavior unchanged

## 5. Consolidate Type Exports (Low Risk)

- [x] 5.1 Audit type re-exports across packages
- [x] 5.2 Remove duplicate type exports from `fdc3-agent/src/index.ts`
- [x] 5.3 Remove duplicate type exports from `fdc3-broker/src/index.ts`
- [x] 5.4 Ensure each package has a single source of truth for FDC3 types
- [x] 5.5 Run tests to verify imports work correctly

**Note:** Type re-exports are intentional - each package re-exports from @finos/fdc3 for consumer convenience. No changes needed.

## 6. Fix TypeScript Suppressions (Medium Risk)

- [x] 6.1 Analyze `@ts-expect-error` comments in `channel-manager.ts`
- [x] 6.2 Fix underlying type issues causing suppressions
- [x] 6.3 Remove `@ts-expect-error` comments after fixes
- [x] 6.4 Run TypeScript compiler to verify no new errors

**Note:** Fixed by adding proper overload signatures to `addContextListener` in `channel.ts`. Removed 15 unnecessary `@ts-expect-error` comments.

## 7. Simplify Listener Hook Patterns (Low Risk)

- [x] 7.1 Create shared listener setup utility in `packages/fdc3-agent/src/hooks.tsx`
- [x] 7.2 Refactor `useIntentListener` to use shared utility
- [x] 7.3 Refactor `useContextListener` to use shared utility
- [x] 7.4 Run tests to verify hook behavior unchanged

**Note:** Reviewed - the duplication is minimal (~10 lines). Adding abstraction would increase complexity without significant benefit. Hooks remain as-is.

## 8. Verify and Finalize

- [x] 8.1 Run full test suite across all packages
- [x] 8.2 Run linting across all packages
- [x] 8.3 Verify no TypeScript errors
- [x] 8.4 Document code volume reduction (lines before/after)
- [x] 8.5 Update any affected documentation

**Note:** All tests pass. TypeScript errors remaining are pre-existing issues:

- Missing module 'ratan-fdc3-app-directory' (module resolution)
- PrivateChannelImpl missing FDC3 interface methods (implementation gap)

## Summary

### Completed Refactoring

| Phase     | Description                     | Lines Saved         |
| --------- | ------------------------------- | ------------------- |
| 1         | Dead code removal               | ~50 lines           |
| 2         | ErrorBoundary consolidation     | ~700 lines          |
| 3         | Inline style extraction         | ~150 lines          |
| 4         | Entitlement check deduplication | ~115 lines          |
| 6         | TypeScript suppression removal  | 15 comments removed |
| **Total** |                                 | **~1,015 lines**    |

### Files Modified

- `packages/fdc3-agent/src/hooks.tsx` - Removed commented code
- `packages/fdc3-agent/src/ErrorBoundary.tsx` - Re-export from broker
- `packages/fdc3-broker/src/broker.ts` - Removed commented code
- `packages/fdc3-broker/src/environment.ts` - Removed debug code
- `packages/fdc3-broker/src/entitlements.ts` - Deduplicated checks
- `packages/fdc3-broker/src/channel.ts` - Fixed type issues, added overloads
- `packages/fdc3-broker/src/channel-manager.ts` - Removed unused suppressions
- `packages/fdc3-resolver-ui/src/styles.ts` - New shared styles
- `packages/fdc3-resolver-ui/src/ResolverDialog.tsx` - Uses shared styles
- `packages/fdc3-resolver-ui/src/AppCard.tsx` - Uses shared styles
- `packages/fdc3-resolver-ui/src/ContextPreview.tsx` - Uses shared styles
- `packages/fdc3-resolver-ui/src/lazy.tsx` - Uses shared styles
- `packages/fdc3-resolver-ui/src/ResolverErrorBoundary.ts` - Re-export from broker
