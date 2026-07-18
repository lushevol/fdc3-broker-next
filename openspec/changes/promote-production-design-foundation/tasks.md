## 1. Production contract packages

- [x] 1.1 Add failing `@fm/platform-contracts` tests for package identity, snapshot parsing, registry validation, typed compatibility success, and stable incompatibility failures
- [x] 1.2 Implement the production application/appearance schemas, capability types, compatibility result/error API, package exports, build, and coverage configuration
- [x] 1.3 Add failing `@fm/platform-sdk` tests for capability delegation, standalone controller updates, unsubscription, invalid snapshot rejection, and immutable reads
- [x] 1.4 Implement the production platform client and validated standalone appearance controller with package exports and build configuration

## 2. Production design tokens

- [ ] 2.1 Add failing tests for the scoped package identity, authoritative semantic token schema, light/dark completeness, density completeness, deterministic generation, and generated-artifact drift
- [ ] 2.2 Implement typed semantic token definitions, validation, deterministic CSS generation, and checked-in scoped CSS output
- [ ] 2.3 Add forbidden dependency/import tests covering Ant Design, AG Grid, federation runtimes, legacy loaders, and Ratan domain packages

## 3. Provider and foundational components

- [ ] 3.1 Add failing tests for independent provider roots, live appearance updates without state remount, direction, MUI adapter values, and restricted public exports
- [ ] 3.2 Implement the local `DesignSystemProvider`, semantic MUI adapter, and public appearance types
- [ ] 3.3 Add failing accessibility and behavior tests for Button, TextField, StatusBadge, variants, disabled states, labels, focus, schemes, and densities
- [ ] 3.4 Implement bounded Button, TextField, and StatusBadge APIs without raw MUI or arbitrary styling exports

## 4. Package reset and migration documentation

- [ ] 4.1 Replace the experimental `ratan-design@0.x` package metadata/build surface with `@fm/ratan-design@1.0.0`, peer dependencies, explicit exports, and private production-release metadata
- [ ] 4.2 Update Storybook stories, demo, README, architecture/rules docs, and changelog for the production API and removal of the experimental Ant surface
- [ ] 4.3 Remove obsolete Ant/Card/Input/token-generation implementation and dependencies after replacement tests pass
- [ ] 4.4 Document semver classification, rolling contract compatibility, POC separation, host/application responsibilities, and the next pilot migration

## 5. Release verification

- [ ] 5.1 Add an automated packed-consumer fixture that verifies JavaScript, declarations, CSS exports, documented imports, and blocked internal subpaths
- [ ] 5.2 Add root scripts for production foundation test, build, lint, dependency scan, and packed-consumer verification in dependency order
- [ ] 5.3 Run all production package tests with required coverage, lint, type declarations, deterministic builds, forbidden-dependency scans, packed-consumer verification, and strict OpenSpec validation
- [ ] 5.4 Record build sizes, compatibility guarantees, known deferred cohorts, and acceptance evidence for the host/application pilot
