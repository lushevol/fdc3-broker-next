<!--
SYNC IMPACT REPORT
==================
Version: NEW → 1.0.0 (Initial ratification)
Ratification Date: 2025-12-26
Last Amended: 2025-12-26

Modified Principles:
  N/A (Initial version)

Added Sections:
  - Core Principles (5 principles)
  - Code Quality Standards
  - Testing Standards
  - User Experience Consistency
  - Performance Requirements
  - Governance

Removed Sections:
  N/A (Initial version)

Template Updates Status:
  ✅ plan-template.md - Verified alignment
  ✅ spec-template.md - Verified alignment
  ✅ tasks-template.md - Verified alignment
  ✅ checklist-template.md - Verified alignment

Follow-up TODOs:
  None - All placeholders resolved
-->

# MFE Next Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

All code MUST meet these quality standards before merge:

- **Type Safety**: TypeScript MUST be used with strict mode enabled. No `any` types
  without explicit justification in code comments.
- **Linting**: All code MUST pass ESLint with zero errors. Warnings MUST be
  justified or fixed.
- **Formatting**: Prettier MUST be used for consistent formatting. No manual
  formatting exceptions.
- **Code Review**: All PRs MUST undergo review by at least one other developer.
  Complex changes require two reviewers.
- **Documentation**: Public APIs MUST have JSDoc comments describing purpose,
  parameters, and return values.

**Rationale**: In a micro-frontend architecture, poor quality in one MFE
propagates to all consumers. Type safety prevents runtime federation errors,
and consistent formatting reduces cognitive load when working across multiple
codebases.

### II. Testing Standards (NON-NEGOTIABLE)

Testing discipline is mandatory with these requirements:

- **Unit Tests**: All business logic and utility functions MUST have unit tests
  with >80% code coverage threshold.
- **Integration Tests**: Module Federation boundaries, API integrations, and
  inter-MFE communication MUST have integration tests.
- **Component Tests**: React components MUST have tests verifying user
  interactions and state changes.
- **Test-First Preferred**: For new features, write tests BEFORE implementation
  (TDD). This is strongly preferred though not absolutely mandatory.
- **No Regressions**: All tests MUST pass before merge. Test failures block
  deployment entirely.

**Rationale**: Module Federation creates dynamic runtime dependencies that
cannot be caught by TypeScript alone. Integration tests at federation boundaries
prevent production failures when remotes change. Component tests ensure UX
consistency across MFEs.

### III. User Experience Consistency

All micro-frontends MUST provide a cohesive user experience:

- **Design System**: Components MUST use the shared design system from `@fm/base`.
  Custom component variants require approval.
- **Navigation**: All MFEs MUST integrate with Single-SPA routing. Deep linking
  MUST work for all application states.
- **Error Boundaries**: Every MFE MUST implement error boundaries that display
  user-friendly error messages and recovery options.
- **Loading States**: All async operations MUST show loading indicators. No
  silent loading that appears as "frozen" UI.
- **Responsive Design**: Components MUST work on desktop (1920px+), tablet
  (768px-1024px), and mobile (<768px) viewports.

**Rationale**: Users perceive the application as a single product, not separate
MFEs. Inconsistent UI/UX breaks this illusion and creates user distrust. Shared
design system and error handling ensure seamless experience.

### IV. Performance Requirements

All micro-frontends MUST meet these performance standards:

- **Bundle Size**: Individual MFE bundles MUST NOT exceed 500KB (gzipped).
  Use bundle analysis (`pnpm analyze`) to identify bloat.
- **Initial Load**: MFE initial render MUST complete within 2 seconds on 4G
  networks (measured via Lighthouse).
- **Runtime Performance**: Interactions MUST respond within 100ms (p95). No
  blocking main thread operations >50ms.
- **Shared Dependencies**: React, React-DOM, and other common libraries MUST use
  singleton sharing via Module Federation.
- **Lazy Loading**: Non-critical routes and components MUST use code splitting
  and lazy loading.

**Rationale**: Each MFE adds to the total application load. Without bundle size
limits, the aggregate application becomes unusable. Singleton sharing prevents
duplicate framework copies and memory bloat.

### V. Observability & Debugging

All micro-frontends MUST be observable and debuggable:

- **Logging**: Structured logging MUST be used for errors, warnings, and
  significant events. Logs include MFE name, timestamp, and context.
- **Error Tracking**: All unhandled errors MUST be reported to error tracking
  service with stack traces and user context.
- **Federation Debug**: Set `FEDERATION_DEBUG=true` in development for verbose
  Module Federation logs.
- **Performance Monitoring**: Core user journeys MUST have performance marks
  for monitoring.
- **Versioning**: All MFEs MUST expose their version via build banner and
  runtime-accessible metadata.

**Rationale**: Debugging distributed MFE systems is exponentially harder than
monoliths. Without structured logging and version tracking, reproducing
production issues becomes nearly impossible. Federation debug mode is essential
for development troubleshooting.

## Code Quality Standards

### TypeScript Configuration

- Strict mode MUST be enabled in all apps
- `noImplicitAny: true` - No implicit any types
- `strictNullChecks: true` - Catch null/undefined errors at compile time
- `esModuleInterop: true` - Consistent module imports

### Component Guidelines

- **Functional Components**: Use function components with hooks. Class components
  are deprecated.
- **Props Interface**: All component props MUST have defined TypeScript
  interfaces.
- **Default Props**: Use default parameter values instead of `defaultProps`.
- **Component Size**: Components should ideally be <200 lines. Larger components
  should be split.

### State Management

- **Local State First**: Use React hooks (useState, useReducer) for component-
  local state.
- **Shared State**: For cross-MFE state, use custom events or a shared state
  library from `@fm/base`.
- **Server State**: Use appropriate data fetching libraries (e.g., React Query,
  RxJS) with caching and invalidation.

## Testing Standards

### Test Structure

```
apps/<app-name>/tests/
├── unit/           # Isolated unit tests
├── integration/    # Cross-component/MFE integration tests
└── contract/       # API contract tests
```

### Unit Test Requirements

- **Coverage**: >80% statement coverage, >70% branch coverage
- **Frameworks**: Jest + React Testing Library
- **Assertions**: Test behavior, not implementation details
- **Mocking**: Mock external dependencies (APIs, third-party libs)

### Integration Test Requirements

- **Module Federation**: Test remote loading and shared dependencies
- **API Integration**: Test data fetching with mocked servers
- **Routing**: Test navigation between MFEs via Single-SPA
- **Error Scenarios**: Test failure modes (network errors, missing remotes)

### Component Test Requirements

- **User Interactions**: Test clicks, form inputs, keyboard navigation
- **State Changes**: Verify UI updates based on state changes
- **Accessibility**: Test ARIA attributes and keyboard navigation
- **Error Boundaries**: Test error recovery UI

## User Experience Consistency

### Design System Usage

- **Components**: Import shared components from `@fm/base` before creating custom
  ones
- **Theming**: Use the ThemeProvider from `@fm/base` for consistent styling
- **Icons**: Use the shared icon library (e.g., MUI icons) consistently
- **Typography**: Follow the typography scale defined in the design system

### Navigation & Routing

- **Deep Links**: Every MFE state MUST be addressable via URL
- **Browser History**: Use React Router DOM for navigation
- **Back Button**: The browser back button MUST work correctly
- **Route Parameters**: Document required route parameters in component JSDoc

### Error Handling

- **Error Boundaries**: Wrap each MFE root component in an error boundary
- **Error Messages**: Display user-friendly error messages (no stack traces to
  users)
- **Recovery**: Provide retry or recovery options when possible
- **Fallbacks**: Display fallback UI when remote MFEs fail to load

### Responsive Design

- **Breakpoints**: Mobile (<768px), Tablet (768px-1024px), Desktop (>1024px)
- **Touch Targets**: Minimum 44x44 pixels for touch targets
- **Readability**: Text size must be at least 16px on mobile
- **Layout**: Use flexbox/grid for adaptive layouts

## Performance Requirements

### Bundle Size Limits

- **Individual MFE**: Maximum 500KB gzipped
- **Shared Libs**: Maximum 300KB gzipped per shared library
- **Total Initial Load**: Maximum 2MB gzipped for the entire application

### Loading Performance

- **Time to Interactive**: <2 seconds on 4G networks
- **First Contentful Paint**: <1 second on 4G networks
- **Largest Contentful Paint**: <2.5 seconds on 4G networks

### Runtime Performance

- **Interaction Response**: <100ms for user interactions (p95)
- **Frame Rate**: Maintain 60fps during animations
- **Main Thread Blocking**: No tasks blocking main thread >50ms

### Code Splitting

- **Route-Based**: Split code at route boundaries
- **Component-Based**: Lazy load heavy components (modals, charts)
- **Library-Based**: Use dynamic imports for large libraries

## Governance

### Amendment Process

1. **Proposal**: Document proposed changes with rationale
2. **Review**: Technical lead team reviews impact on templates and workflows
3. **Approval**: Requires majority approval from technical leads
4. **Version Bump**: Update constitution version (semver)
5. **Template Sync**: Update all dependent templates to reflect changes
6. **Migration**: Provide migration guide for breaking changes

### Versioning

- **MAJOR**: Backward-incompatible governance/principle changes
- **MINOR**: New principle or section added
- **PATCH**: Clarifications, wording improvements

### Compliance Review

- **Pre-Merge**: All PRs MUST verify compliance with applicable principles
- **Quarterly Audit**: Review constitution effectiveness and compliance
- **Exception Process**: Temporary exceptions require documented justification
  and approval

### Complexity Justification

- **Default**: Simple solutions preferred over complex ones
- **Documentation**: Any complex solution MUST be documented with rationale
- **Alternatives**: Rejected simpler alternatives MUST be documented in PR
  description

### Runtime Guidance

For day-to-day development guidance, refer to:

- `.claude/CLAUDE.md` - Architecture overview and development commands
- Individual MFE README files - App-specific guidance
- Module Federation documentation - Remote/consumer setup

**Version**: 1.0.0 | **Ratified**: 2025-12-26 | **Last Amended**: 2025-12-26
