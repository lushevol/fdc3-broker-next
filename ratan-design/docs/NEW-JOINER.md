# New Joiner Guide — ratan-design (30 minutes)

Welcome. This guide gets you from zero to productive on the Ratan Design v2 workspace. Read it top to bottom once, then keep it as a reference.

---

## 1. What is this? (2 min)

`ratan-design/` is a self-contained monorepo that produces **`@fm/ratan-design`** — a React design system that is a pixel-and-behavior-faithful reimplementation of the SC WebKit design system, but in modern typed React instead of Web Components.

The one sentence to remember:

> **Ratan reproduces the frozen SC WebKit 2.0.5 contract (`--sc-*` tokens, variants, states, behavior) in React, with React Aria for interaction, static CSS for styling, and no provider/runtime required.**

Key documents in priority order:

1. **`ratan-design/plan.md`** — the authoritative plan (read §0 decisions first; §0.1 reconciles every prior plan item)
2. **`ratan-design/docs/`** — these docs (start here, this file)
3. **`manifests/parity-manifest.json`** — what must be implemented and how each WebKit export maps
4. **`decisions/foundation-approval.md`** — approved scope + open governance questions

---

## 2. The mental model (5 min)

```
SC WebKit 2.0.5 (frozen baseline, @a8398ea6)   ← DESIGN AUTHORITY
        │  observed at runtime > tests > storybook > docs
        ▼
manifests/parity-manifest.json                 ← WHAT must map (136 exports; 113 in scope)
        ▼
packages/*  (private source boundaries)        ← HOW it's built
        ▼
packages/react → @fm/ratan-design              ← THE ONLY PUBLIC PACKAGE
        ├─ tree-shakable subpaths (button, dialog, …)
        ├─ exact --sc-* tokens & frozen CSS
        └─ machine-readable manifests shipped inside
```

Three invariants that explain 90% of the "why" in this repo:

| Invariant | Why |
|---|---|
| **No provider, no runtime** | MFEs mount independently in one document; Ratan is bundled per-app; only `react`/`react-dom` are shared |
| **`--sc-*` tokens are frozen and public** | WebKit and Ratan must coexist during migration — same tokens, different implementations |
| **React Aria is mandatory for interaction** | Keyboard/focus/overlay/screen-reader behavior is hard; one foundation means it's done right once |

---

## 3. Workspace map (3 min)

```
ratan-design/
├── packages/
│   ├── react/         ← PUBLIC PACKAGE @fm/ratan-design (tsup build, ships everything)
│   │   ├── src/       ← barrel + per-subpath entries + component sources + frozen styles
│   │   └── tests/     ← contract tests (button, text-input, dialog, date-picker, tabs, data-grid)
│   ├── components/    ← proof-cohort component sources (button/, dialog/, …)
│   ├── data-grid/     ← DataGrid (TanStack Table + Virtual), private
│   ├── foundation/    ← React Aria adapters + useControllableState + press events
│   ├── tokens/        ← --sc-* metadata
│   ├── styles/        ← scoped component CSS
│   ├── icons/         ← frozen icon libraries
│   ├── patterns/      ← shared compositions (post-parity)
│   ├── testing/       ← test helpers (renderRatanFixture, runKeyboardSequence, overlayQueries…)
│   ├── vitest/        ← shared vitest config + axe assertions (assertNoAxeViolations)
│   ├── standard/      ← lint/boundary standard
│   └── storybook/     ← Storybook workbench (port 6006)
├── apps/
│   ├── docs/          ← per-component docs pages (content/proof/*.md, verified at build)
│   ├── playground/    ← real MFE scenarios + packed-consumer verification
│   └── parity-lab/    ← WebKit-vs-Ratan evidence, fixtures, benchmarks
├── manifests/         ← parity-manifest.json, migration-map.json, deviations.json
├── migration/         ← codemods + mappings (webkit/legacy-ratan/mui/ant-design) + playbook
├── tooling/           ← release verification (boundaries, interaction foundation)
├── decisions/         ← ADRs (foundation-approval.md)
└── plan.md            ← THE authoritative plan
```

**Biggest gotcha:** `packages/react` is the *public* package — private packages (`components`, `data-grid`, `foundation`, …) are build-time boundaries whose outputs get bundled into it. Don't publish anything else, don't add runtime deps to `packages/react`, and never import across package boundaries in production code (a verify script enforces this).

---

## 4. First run (5 min)

From the **repo root** (`fdc3-broker-next/`):

```bash
npm install
npm run ratan:build          # turbo build for all ratan-design/** workspaces
npm run ratan:test           # unit + contract tests
npm run ratan:lint
```

From **inside `ratan-design/`** the same works via its own turbo config:

```bash
npm run build
npm run test
npm run verify:foundation    # the full release gate (boundaries + interactions + tests + workbenches)
```

If build fails on `generate`/parity steps, the parity lab baseline is out of sync — run `npm --workspace @fm/ratan-design-parity-lab run generate` (or `check:drift`) first.

To *use* the design system, see `packages/react/README.md` — it has the canonical consumer example:

```tsx
import { Button } from '@fm/ratan-design/button';
import '@fm/ratan-design/styles.css';

<Button variant="primary" tone="default" size="sm">Confirm</Button>;
```

---

## 5. Component anatomy (10 min) — using Button as the template

Proof cohort: **Button, TextInput, Dialog, DatePicker, Tabs, DataGrid**. If you learn Button, you've learned the pattern.

1. **Source:** `packages/components/button/button.tsx`
   - `ButtonProps` extends native button attributes (minus `color`/`type`), then adds Ratan props: `variant`/`tone`/`size`, `loading`/`loadingLabel`, `selectable`/`selected`, `onPress`, icons, plus parity-only legacy props (`fill`, `inverse`, `iconButton`, `snack`, `pill`, `border`, `compact`, `truncate`) — kept only to map the WebKit surface.
   - Constants + exported types: `BUTTON_VARIANTS`, `BUTTON_TONES`, `BUTTON_SIZES`.
2. **Styles:** `button.css` + generated `button-states.css` — consume only `--sc-*` variables (`--sc-button-primary-background-color`, …). No color literals.
3. **Interaction:** uses the foundation's `AriaButtonAdapter`/`useAriaButtonAdapter` + `RatanPressEvent`. Never hand-roll press/focus/keyboard logic.
4. **State contract:** controlled/uncontrolled via `useControllableState` (`value`/`defaultValue` + change callback with a `reason`).
5. **Public entry:** `packages/react/src/button.ts` — imports the component CSS, exports types + component.
6. **Tests:** `packages/react/tests/button.contract.test.tsx` (props/events/a11y) + `button.styles.test.ts` (frozen token consumption).
7. **Docs page:** `apps/docs/content/proof/button.md` — must contain the six enforced sections: `## Purpose`, `## Guidance`, `## API`, `## Tokens`, `## WebKit mapping`, `## Deviations` (the docs build fails otherwise).
8. **Evidence:** parity-lab fixtures/observations in `apps/parity-lab/evidence/proof-cohort/`.

### Adding a new component (checklist)

1. Update the parity manifest mapping for the WebKit tag (`manifests/parity-manifest.json` + `migration-map.json`) — do this **first**, it's the contract.
2. Implement in `packages/components/<name>/` on the foundation (Aria adapters + `useControllableState`).
3. Wire the subpath entry in `packages/react/src/<name>.ts` + `tsup.config.ts` exports + `package.json` `exports`.
4. Write contract + style tests (axe assertions via `@fm/ratan-design-vitest`).
5. Add Storybook stories, the docs page (all six sections + compilable example in `apps/docs/src/examples/proof.tsx`), playground scenario, and parity-lab fixtures.
6. Record any deviation in `manifests/deviations.json` with rationale + linked test + approval.
7. Run `npm run verify:foundation`.

**A component is NOT done until manifest, docs, stories, tests, a11y, evidence, and packed-consumer verification all pass.**

---

## 6. Where the truth lives (3 min)

| Question | Source of truth |
|---|---|
| "Should this component exist?" | `manifests/parity-manifest.json` (classification: included / supporting-only / excluded) |
| "How does WebKit actually behave?" | `apps/parity-lab` runtime observations (precedence #1) |
| "What props map to what?" | `manifests/migration-map.json` |
| "Is this visual change allowed?" | `--sc-*` tokens + `manifests/deviations.json` (corrections need approval) |
| "Why is the architecture like this?" | `plan.md` §0 decisions, then `docs/ARCHITECTURE.md` |
| "Can I hand-roll this interaction?" | Only with an entry in `packages/foundation/exceptions/interaction-exceptions.json` — practically, no |

**If WebKit behavior contradicts what you read anywhere else, trust what the running WebKit shows** — that is the design authority by design.

---

## 7. Glossary (2 min)

| Term | Meaning |
|---|---|
| **Parity** | Exact visual + behavioral equivalence with frozen WebKit; the core mission |
| **`--sc-*` tokens** | The frozen WebKit CSS variables; permanent public contract |
| **Proof cohort** | First approved component set (Button, TextInput, Dialog, DatePicker, Tabs, DataGrid) |
| **Subpath** | `@fm/ratan-design/<name>` import entry; tree-shakable, own CSS side effect |
| **Foundation** | `packages/foundation` — React Aria adapter layer + shared state utilities |
| **Parity lab** | Evidence pipeline comparing WebKit vs Ratan (screenshots, a11y, performance) |
| **Deviations** | Approved, tested corrections to frozen behavior (accessibility fixes etc.) |
| **Supporting-only** | WebKit export required internally but not directly consumable |
| **`verify:foundation`** | The full release gate for the workspace |

## 8. First tasks to try

- Run the build + tests (above) and fix anything broken.
- Read `apps/docs/content/proof/button.md`, then read the Button source — map each doc claim to code.
- Open the parity manifest, pick the next un-implemented included component, and follow the checklist in §5.
- Run `npm run ratan:verify:boundaries` and `npm run ratan:verify:interactions` to see the guards in action.
- Read `decisions/foundation-approval.md` for the open governance questions you may be asked to help close.

When in doubt, read `plan.md` — every architectural decision in this repo traces back to it.
