---
name: sb-plugin-ut
description: >
  Expert unit-testing guide for Service Bench plugin UI projects (LitElement + TypeScript + Jest).
  Use this skill whenever the user asks to: write unit tests, add UT, improve test coverage, fix failing
  tests, reach 85% coverage, mock GraphQL, mock service-bench-core contexts, test event dispatching,
  test @state/@property changes, test component rendering, set up Jest config, write describe/it blocks,
  or any request involving UT / unit test / jest / fixture / @open-wc/testing / jest.mock / coverage
  in a Service Bench plugin UI project. Also trigger when the user shares a component file and asks
  "write tests for this", "add tests", or "help me test". Trigger aggressively — if the user is
  working on a plugin component and mentions tests at all, use this skill.
---

# Service Bench — Plugin Unit Testing

This skill covers writing Jest + `@open-wc/testing` unit tests for LitElement/TypeScript components in any Service Bench plugin UI project.

## Test Stack

| Tool | Purpose |
|---|---|
| `jest` + `jest-environment-jsdom` | Test runner + DOM environment |
| `@open-wc/testing` (`fixture`, `expect`) | Render Lit components in tests |
| `@jest/globals` (`expect as jestExpect`) | Jest-style assertions (`.toHaveBeenCalledWith`, `.toEqual`, etc.) |
| `jest.mock()` | Mock API modules and `@scdevkit` context providers |

Two `expect` aliases are used together — keep them distinct:
- `expect` from `@open-wc/testing` → for DOM/element existence checks (Chai-style)
- `jestExpect` from `@jest/globals` → for mock call assertions and value equality

---

## Standard Test File Template

```typescript
import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { expect as jestExpect } from '@jest/globals';

// 1. Import element registration (triggers customElements.define)
import '../../elements/my-feature.js';
// 2. Import the component class for type access
import { MyFeaturePage } from '../../src/views/my-feature/MyFeaturePage';

// 3. Mock API modules BEFORE importing them
jest.mock('../../src/api/myFeatureQueries', () => ({
  getMyItems: jest.fn(),
}));
jest.mock('../../src/api/myFeatureMutations', () => ({
  putMyItem: jest.fn(),
}));

// 4. Import mocked functions (after jest.mock)
import { getMyItems } from '../../src/api/myFeatureQueries';
import { putMyItem } from '../../src/api/myFeatureMutations';

describe('MyFeaturePage', () => {
  let el: MyFeaturePage;

  const mockItems = [
    { id: '1', name: 'Item One' },
    { id: '2', name: 'Item Two' },
  ];

  beforeEach(async () => {
    (getMyItems as jest.Mock).mockResolvedValue(mockItems);
    // Use your plugin's custom element tag name (the one registered in elements/my-feature.js)
    el = await fixture(
      html`<sb-my-plugin-my-feature></sb-my-plugin-my-feature>`,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    expect(el).to.exist;
  });
});
```

---

## Mocking `@scdevkit/service-bench-core`

Copy this mock block into any test that uses `contexts` from `service-bench-core`:

```typescript
jest.mock('@scdevkit/service-bench-core', () => ({
  contexts: {
    NAVIGATION: 'navigation',
    USER: 'user',
    STORAGE_CLIENT: 'storage',
    APP: 'app',
    AUTHZ: 'authz',
  },
  createContext: (contextName: string) => {
    if (contextName === 'navigation') {
      return {
        createConsumer: () => ({
          value: {
            params: { id: '123' },
            go: jest.fn(),
          },
        }),
      };
    }
    if (contextName === 'user') {
      return {
        createConsumer: () => ({
          value: {
            name: 'Test User',
            psid: 'user-123',
            email: 'test@sc.com',
            firstName: 'Test',
            lastName: 'User',
            id: 'user-123',
          },
        }),
      };
    }
    if (contextName === 'storage') {
      return {
        createConsumer: () => ({
          value: { upload: jest.fn(), download: jest.fn() },
        }),
      };
    }
    return { createConsumer: () => ({ value: {} }) };
  },
}));
```

---

## Mocking `@scdevkit/data`

```typescript
jest.mock('@scdevkit/data', () => ({
  contexts: {
    GRAPHQL_CLIENT: 'graphql-client',
  },
  createContext: (contextName: string) => {
    if (contextName === 'graphql-client') {
      return {
        createConsumer: () => ({
          value: { query: jest.fn() },
        }),
      };
    }
    return { createConsumer: () => ({ value: {} }) };
  },
}));
```

---

## Common Test Patterns

### Test: component renders

```typescript
it('renders the component', () => {
  expect(el).to.exist;
});
```

### Test: API called on mount

```typescript
it('fetches data on connectedCallback', async () => {
  // Re-create element so connectedCallback fires fresh
  const newEl = await fixture(
    html`<sb-my-plugin-my-feature></sb-my-plugin-my-feature>`,
  );
  await newEl.updateComplete;
  jestExpect(getMyItems).toHaveBeenCalled();
});
```

### Test: internal `@state` updated after event

```typescript
it('updates state after successful mutation', async () => {
  (putMyItem as jest.Mock).mockResolvedValue({ id: '3', name: 'New Item' });

  // Set initial state by directly assigning private field
  (el as any)._items = mockItems;
  await el.updateComplete;

  const onSuccess = jest.fn();
  const onError = jest.fn();

  // Use your plugin's event name (matches the prefix defined in src/constants/app.ts)
  const event = new CustomEvent('sb-my-plugin-save-item', {
    detail: { item: { id: '3', name: 'New Item' }, onSuccess, onError },
  });

  await (el as any)._handleSaveItem(event);
  await el.updateComplete;

  jestExpect(putMyItem).toHaveBeenCalledWith(
    (el as any)._graphQLClient,
    { id: '3', name: 'New Item' },
  );
  jestExpect(onSuccess).toHaveBeenCalled();
  jestExpect(onError).not.toHaveBeenCalled();
});
```

### Test: API error → onError called

```typescript
it('calls onError when mutation fails', async () => {
  (putMyItem as jest.Mock).mockRejectedValue(new Error('Network error'));

  const onSuccess = jest.fn();
  const onError = jest.fn();

  const event = new CustomEvent('sb-my-plugin-save-item', {
    detail: { item: { id: '1', name: 'X' }, onSuccess, onError },
  });

  await (el as any)._handleSaveItem(event);

  jestExpect(onError).toHaveBeenCalledWith('Network error');
  jestExpect(onSuccess).not.toHaveBeenCalled();
});
```

### Test: shadow DOM element presence

```typescript
it('renders empty state when no data', async () => {
  (el as any)._items = [];
  await el.updateComplete;

  // Use your plugin's empty-state component tag name
  const emptyState = el.shadowRoot?.querySelector('sb-my-plugin-empty-state');
  expect(emptyState).to.exist;
});

it('hides empty state when data present', async () => {
  (el as any)._items = mockItems;
  await el.updateComplete;

  const emptyState = el.shadowRoot?.querySelector('sb-my-plugin-empty-state');
  expect(emptyState).to.not.exist;
});
```

### Test: shadow DOM text content

```typescript
it('displays item name', async () => {
  // Use your plugin's tag name for the item component
  const el = await fixture(
    html`<sb-my-plugin-my-item .data=${mockItems[0]}></sb-my-plugin-my-item>`,
  );
  expect(el.shadowRoot?.textContent).to.include('Item One');
});
```

### Test: `window.location` manipulation

```typescript
it('navigates to home on back click', async () => {
  const mockLocation = {
    pathname: '/admin/my-feature/detail',
    origin: 'http://localhost',
    href: '',
  };
  Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
  });

  (el as any)._handleBackToMain();

  expect(mockLocation.href).to.include('/home');
});
```

### Test: child component with `@property` input

```typescript
it('renders with provided data', async () => {
  const data = { title: 'My Title', status: 'Open' };
  // Use your plugin's tag name for the header component
  const child = await fixture(
    html`<sb-my-plugin-my-header .data=${data}></sb-my-plugin-my-header>`,
  );
  expect(child.shadowRoot?.textContent).to.include('My Title');
  expect(child.shadowRoot?.textContent).to.include('Open');
});
```

### Test: event dispatched from child

```typescript
it('dispatches refresh event on button click', async () => {
  let eventFired = false;
  // Use your plugin's event name (matches the prefix defined in src/constants/app.ts)
  el.addEventListener('sb-my-plugin-refresh', () => { eventFired = true; });

  const btn = el.shadowRoot?.querySelector('sc-button[data-testid="refresh"]');
  btn?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

  expect(eventFired).to.be.true;
});
```

---

## Testing sc-table Column Configuration

`sc-data-grid` and `sc-table` components receive a `conf: Conf[]` array where each entry has
`property`, `header()`, and `cell()` render functions. Since these are functions (not DOM), test
by calling them directly — never try to query rendered table cells in shadow DOM.

```typescript
import { Conf } from '@scdevkit/webkit/dist/elements/sc-table.js';

const mockTableData = [
  { id: '1', case_number: 'CASE-001', subject: 'HR Question' },
  { id: '2', case_number: 'CASE-002', subject: 'Compliance' },
];

it('includes expected columns', async () => {
  const el: any = await fixture(
    html`<sb-my-plugin-case-table .data=${mockTableData}></sb-my-plugin-case-table>`
  );
  await el.updateComplete;
  const table = el.shadowRoot?.querySelector('sc-table');
  const properties = table.conf.map((c: Conf) => c.property);
  expect(properties).to.include('case_number');
  expect(properties).to.include('subject');
});

it('renders cell text content', async () => {
  const el: any = await fixture(
    html`<sb-my-plugin-case-table .data=${mockTableData}></sb-my-plugin-case-table>`
  );
  await el.updateComplete;
  const table = el.shadowRoot?.querySelector('sc-table');
  const col = table.conf.find((c: Conf) => c.property === 'case_number');

  let cellText: string | undefined;
  col.cell('', mockTableData[0]).values.forEach((v: any) => {
    if (v) cellText = v;
  });
  expect(cellText).to.equal('CASE-001');
});

it('hides columns listed in hiddenColumns', async () => {
  const el: any = await fixture(
    html`<sb-my-plugin-case-table .hiddenColumns=${['subject']}></sb-my-plugin-case-table>`
  );
  await el.updateComplete;
  // If the component exposes _buildColumns(), call it directly
  const columns = el._buildColumns?.() ?? el.shadowRoot?.querySelector('sc-table')?.conf;
  const subjectCol = columns?.find((c: any) => c.property === 'subject');
  expect(subjectCol?.hide).to.be.true;
});

it('icon cell click handler fires correctly', async () => {
  const el: any = await fixture(
    html`<sb-my-plugin-case-table .data=${mockTableData}></sb-my-plugin-case-table>`
  );
  await el.updateComplete;
  const table = el.shadowRoot?.querySelector('sc-table');
  const col = table.conf.find((c: Conf) => c.property === 'actions');
  // cell().values returns metadata array: [iconName, color, clickHandler, ...]
  const clickFn = col.cell('', mockTableData[0]).values[2];
  clickFn(); // Should not throw; assert side effects as needed
});
```

---

## Coverage Strategy — Reaching 85%+

Coverage is measured from `src/**/*.{js,jsx,ts,tsx}`. Think of coverage as exercising every
decision branch at least once.

**Per-component checklist:**

| Layer | What to test |
|---|---|
| **Render** | Default render + each conditional branch (`open=true/false`, `data=[]` vs populated) |
| **@property defaults** | Every `@property` at its default value |
| **@state mutations** | Set state directly, `await updateComplete`, assert DOM change |
| **Every `_handle*` method** | Call it; verify the state/event it produces |
| **Event dispatching** | Every `dispatchEvent()` call — assert it fires with correct `detail` |
| **Lifecycle methods** | `connectedCallback` (API calls), `updated()` (reset logic), `disconnectedCallback` (cleanup) |
| **Error paths** | Mock rejection → assert `onError` called, `onSuccess` not called |
| **Edge cases** | Empty arrays, null values, missing optional props |

**How to find uncovered lines:**
After `npm run test`, open `coverage/index.html` in a browser. Click into a file to see
exactly which lines/branches have no coverage. Write targeted tests for each red line.

**Typical coverage killers to watch for:**
- `if/else` branches in `_buildColumns()` or conditional renders (test both sides)
- Error handling (`try/catch` in async methods — mock the rejection)
- `updated()` lifecycle with `changedProperties.has(...)` guards — set the property to trigger it

---

## Test Organization

Follow the same folder structure as `src/views/`:

```
test/
  <domain-a>/               ← mirrors src/views/<domain-a>/
    DomainAPage.test.ts
    DomainAHeader.test.ts
    DomainALeftPanel.test.ts
  <domain-b>/
    DomainBPage.test.ts
    DomainBHeader.test.ts
  home/
    HomePage.test.ts
  api/
    domainAQueries.test.ts
```

---

## Checklist for a Complete Test Suite

For each **page orchestrator**, cover:
- [ ] Component renders
- [ ] API called on mount (`connectedCallback`)
- [ ] State updates correctly after successful mutation
- [ ] Error path: API rejects → `onError` called, `onSuccess` not called
- [ ] Empty state shown when no data
- [ ] Loading state shown while fetching (if applicable)
- [ ] Navigation (back to home, etc.)

For each **child component**, cover:
- [ ] Component renders with mock `@property` data
- [ ] Displays key text content
- [ ] Dispatches correct custom event on user interaction
- [ ] Conditional rendering (e.g., shows/hides based on prop)

For each **API module** (optional but recommended):
- [ ] Returns correct shape when GraphQL query resolves
- [ ] Handles error response

---

## Running Tests

```bash
# Run all tests
npm run test:unit

# Run specific test file pattern
npx jest --testPathPattern="FeatureName" --env=jsdom --runInBand

# Run with coverage
npx jest --coverage --env=jsdom --runInBand
```

---

## Common Pitfalls

| ❌ Wrong | ✅ Right |
|---|---|
| Importing mocked module before `jest.mock()` | Always `jest.mock()` before importing |
| Using `expect` from jest for DOM checks | Use `expect` from `@open-wc/testing` for DOM, `jestExpect` for mock calls |
| Forgetting `await el.updateComplete` after setting `@state` | Always `await el.updateComplete` after changing state |
| Accessing private methods without cast | Use `(el as any)._privateMethod()` |
| Not calling `jest.clearAllMocks()` in `afterEach` | Always clear mocks between tests |
| Using `querySelector` on `el` (not shadow root) | Use `el.shadowRoot?.querySelector(...)` |
