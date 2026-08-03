---
tools: ['edit/editFiles', 'execute/runInTerminal', 'execute/getTerminalOutput', 'read/readFile', 'search', 'search/codebase']
description: 'Step 6 of leapkit-to-sb-plugin migration — Converts unit tests from Enzyme/React to @open-wc/testing, achieves ≥ 80% coverage, and produces a final migration report.'
---

# Step 6 — Unit Tests & Final Report

## Role

You are writing unit tests for all migrated pages and services, verifying coverage, and producing the final migration report.  
After this step the plugin should be fully validated with ≥ 80% test coverage.

Load the skills below before writing tests:

| Task | Skill |
|---|---|
| Unit tests | `sb-plugin-ut` |

---

## Autonomous Execution Rules

- ✅ Execute all terminal commands immediately without asking
- ✅ Load the `sb-plugin-ut` skill before writing tests
- ✅ Run tests at the end — fix any failures before reporting success
- ❌ NEVER report "complete" if `npm test` fails
- ❌ NEVER skip test generation — every page and every service method must have test coverage
- ❌ NEVER use `@sc-sb-project/` in any source file — it is only allowed in `package.json` and azure-pipeline yaml files

---

## Section 1 — Unit Test Conversion

### 1A. Strategy

| Original (leap-kit) | SB Plugin |
|---|---|
| Jest + Enzyme (shallow/mount) | Jest + `@open-wc/testing` (fixture / html) |
| `wrapper.find(Component)` | `el.shadowRoot.querySelector('sc-...')` |
| `wrapper.simulate('click')` | `btn.click()` / `btn.dispatchEvent(new Event('click'))` |
| `expect(wrapper.state('key'))` | `expect(el._key)` (access private state via direct property) |
| Service mock with `jest.mock` | Sinon stub / `stub(ApiService.prototype, 'get')` |

### 1B. Per-Component Test Template

```typescript
// test/views/[feature]/[Feature]Page.test.ts
import { fixture, html as testHtml, expect, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import { ApiService } from '../../../src/api/ApiService';
import '../../../elements/[feature].js';

describe('[Feature]Page', () => {
  let apiGetStub: sinon.SinonStub;

  beforeEach(() => {
    apiGetStub = sinon.stub(ApiService.prototype, 'get').resolves([
      { id: '1', name: 'Test Item' },
    ]);
  });

  afterEach(() => sinon.restore());

  it('renders items after fetch', async () => {
    const el = await fixture(testHtml`<[prefix]-[feature]></ [prefix]-[feature]>`);
    await aTimeout(50); // allow connectedCallback to settle

    const grid = el.shadowRoot!.querySelector('sc-data-grid');
    expect(grid).to.exist;
    expect(apiGetStub.calledOnce).to.be.true;
  });

  it('shows error alert on fetch failure', async () => {
    apiGetStub.rejects(new Error('Network error'));
    const el = await fixture(testHtml`<[prefix]-[feature]></ [prefix]-[feature]>`);
    await aTimeout(50);

    const alert = el.shadowRoot!.querySelector('sc-alert[type="error"]');
    expect(alert).to.exist;
  });

  it('shows spinner while loading', async () => {
    // Make get hang
    apiGetStub.returns(new Promise(() => {}));
    const el = await fixture(testHtml`<[prefix]-[feature]></ [prefix]-[feature]>`);

    const spinner = el.shadowRoot!.querySelector('sc-spinner');
    expect(spinner).to.exist;
  });
});
```

### 1C. Per-Service Test Template

```typescript
// test/api/[feature]Api.test.ts
import sinon from 'sinon';
import { ApiService } from '../../src/api/ApiService';
import { get[Entities], create[Entity] } from '../../src/api/[feature]Api';

describe('[feature]Api', () => {
  let api: ApiService;
  let getStub: sinon.SinonStub;

  beforeEach(() => {
    api = Object.create(ApiService.prototype);
    getStub = sinon.stub(api, 'get');
  });

  afterEach(() => sinon.restore());

  it('get[Entities] calls correct endpoint', async () => {
    getStub.resolves([{ id: '1', name: 'Test' }]);
    const result = await get[Entities](api);
    expect(getStub.calledWith('/api/[namespace]/v1/[resource]')).to.be.true;
    expect(result).to.have.length(1);
  });
});
```

### 1D. Target Coverage

Run tests and check coverage. Target: **≥ 80% lines and branches** across all migrated files.

```bash
npm test
```

If coverage is below target, add tests for missing branches (error paths, empty states, permission denied states).

---

## Section 2 — Migration Report

After all sections pass, output the full migration report:

```markdown
## ✅ Migration Complete: [Plugin Name]

### Summary
- Pages migrated: [N]
- Components migrated: [N]
- Services migrated: [N] ([N] REST endpoints wrapped)
- Tests generated: [N] test files, [N] assertions
- Test coverage: [X]% lines / [Y]% branches
- Security scan: ✅ No issues

### File Map

| Original (leap-kit) | Migrated (SB plugin) |
|---|---|
| src/pages/Create.js | src/views/create/CreatePage.ts |
| src/components/LinkCard.js | src/views/create/components/LinkCard.ts |
| src/services/CreateService.js | src/api/createApi.ts |
| ... | ... |

### Remaining Manual Steps

List anything that could not be fully automated:
- ⚠️ [item] — reason + recommended action

### How to Run

\`\`\`bash
npm install
npm run build
npm test
\`\`\`
```
