## 1. Module-composition package

- [x] 1.1 Add the `ratan-module-composition` workspace package, public types, typed errors, and package exports
- [x] 1.2 Add failing tests for SystemJS and Module Federation adapter export resolution and error handling
- [x] 1.3 Implement injected SystemJS and Module Federation adapters plus deduplicating retry-safe loader service

## 2. FDC3 platform extension

- [x] 2.1 Add failing broker and scoped-agent tests for configured and unavailable module composition
- [x] 2.2 Add optional broker configuration and expose the non-FDC3 `modules` capability
- [x] 2.3 Extend `RatanDesktopAgent` and delegate the capability through `ScopedDesktopAgent`

## 3. Documentation and verification

- [x] 3.1 Document the non-FDC3 boundary, producer component contract, and React singleton host responsibility
- [x] 3.2 Run focused package tests, lint, and builds
- [x] 3.3 Validate the OpenSpec change and record completion status

## 4. Executable sample tiles and browser verification

- [x] 4.1 Add a SystemJS producer sample tile with an intentional named component export
- [x] 4.2 Add a consumer sample tile that renders the producer through `useFDC3().modules.load`
- [x] 4.3 Register both samples for local tile navigation and add automated component coverage
- [x] 4.4 Run live Playwright and Chrome verification against the local portal
