## 1. Controlled numeric form control

- [x] 1.1 Add failing NumberField tests for controlled number/null changes, label, required/disabled, min/max/step, helper/error association, invalid state, focus, and restricted props
- [x] 1.2 Implement the bounded NumberField API and semantic token styling without domain formatting or form-state ownership

## 2. Accessible overlay interactions

- [ ] 2.1 Add failing Dialog tests for title/description/actions, width, modal role, close button, Escape/backdrop dismissal, non-dismissible state, and focus restoration
- [ ] 2.2 Implement the compositional Dialog API with scoped MUI adapter styling and no global overlay state
- [ ] 2.3 Add failing ConfirmationDialog tests for default/danger tones, confirm/cancel callbacks, disabled/loading behavior, repeat prevention, and accessible progress copy
- [ ] 2.4 Implement ConfirmationDialog as a bounded Dialog composition with application-owned lifecycle and authorization

## 3. Local semantic feedback

- [ ] 3.1 Add failing InlineAlert tests for info/success/warning/error semantics, optional title, message, labeled action, and isolated rendering
- [ ] 3.2 Implement InlineAlert without global queues, portals, event buses, or request-state ownership

## 4. Additive release and documentation

- [ ] 4.1 Advance `@fm/ratan-design` to 1.1.0 and add restricted public component/type exports without breaking the 1.0.0 surface
- [ ] 4.2 Add dependency/public-export scans for Ant, AG Grid, federation, legacy Ratan/domain, raw MUI, `sx`, slots, form engines, and internal subpaths
- [ ] 4.3 Update Storybook stories, demo, README, changelog, architecture/rules, and acceptance guidance for interaction ownership boundaries
- [ ] 4.4 Extend the packed consumer fixture for NumberField, Dialog, ConfirmationDialog, InlineAlert, declarations, CSS, and blocked subpaths

## 5. Verification evidence

- [ ] 5.1 Run design coverage, lint, declaration/build, Storybook, deterministic CSS, dependency scans, packed consumption, production-pilot tests/builds, and strict OpenSpec validation
- [ ] 5.2 Record artifact sizes, accessibility evidence, additive compatibility, deliberately deferred controls, and mutation-cohort entry criteria
