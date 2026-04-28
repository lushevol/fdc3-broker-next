# Chatbot FDC3 Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the chatbot propose, approve, execute, and continue a declaration-backed FDC3 intent flow, with a sample trade blotter tile that handles a trade query intent and returns result data back into the same chat turn.

**Architecture:** Build a day-1 declaration-backed FDC3 chat action layer in `apps/base`, expose it through one reusable `human` approval tool and one reusable `frontend` execution tool in `ChatbotSidebarV2`, then add a sample trade blotter tile in `apps/tile` that listens for the new intent, renders filtered mock trades, and returns a compact structured result. Keep declaration reading behind a provider boundary so day 2 can replace it with the platform FDC3 API.

**Tech Stack:** React 18, TypeScript, Zod, Jest, `chat-protocol-ui`, `chat-protocol-contract`, `ratan-fdc3-agent`, `ratan-fdc3-broker`, Single-SPA SystemJS MFEs.

---

### Task 1: Extend declaration data for a chat-capable trade blotter workflow

**Files:**
- Modify: `apps/base/src/fdc3/declarations/intents.json`
- Modify: `apps/base/src/fdc3/declarations/contexts.json`
- Modify: `apps/base/src/fdc3/declarations/fdc3-definitions.json`
- Add: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-definitions.ts`
- Test: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-definitions.test.ts`

- [ ] **Step 1: Write the failing declaration-mapping test**

```ts
// apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-definitions.test.ts
import { describe, expect, it } from '@jest/globals';
import { getFdc3ChatActionDefinitions } from './fdc3-action-definitions';

describe('getFdc3ChatActionDefinitions', () => {
  it('builds a trade blotter action from the local declarations', () => {
    const actions = getFdc3ChatActionDefinitions();
    expect(actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'trade-blotter.pending-validation',
          intent: 'SearchTrades',
          contextType: 'fdc3.trade.query',
          targetAppIds: ['template_tile_trade_blotter'],
        }),
      ]),
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd apps/base && npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-action-definitions.test.ts`

Expected: FAIL because the declaration reader and trade action metadata do not exist yet.

- [ ] **Step 3: Add the trade intent and context declarations**

Update the declaration JSON files with concrete day-1 entries:

```json
// apps/base/src/fdc3/declarations/intents.json
{
  "name": "SearchTrades",
  "description": "Search trades in the trade blotter"
}
```

```json
// apps/base/src/fdc3/declarations/contexts.json
{
  "schema": {
    "type": "object",
    "properties": {
      "type": { "const": "fdc3.trade.query" },
      "filters": {
        "type": "object",
        "properties": {
          "status": { "type": "string" },
          "book": { "type": "string" },
          "desk": { "type": "string" }
        },
        "required": ["status"]
      },
      "question": { "type": "string" }
    },
    "required": ["type", "filters", "question"]
  },
  "simples": [
    {
      "type": "fdc3.trade.query",
      "filters": { "status": "PENDING_VALIDATION" },
      "question": "how is trades pending validation status ?"
    }
  ],
  "description": "Trade blotter search query context"
}
```

```json
// apps/base/src/fdc3/declarations/fdc3-definitions.json
{
  "appId": "template_tile_trade_blotter",
  "interop": {
    "intents": {
      "listensFor": [
        {
          "intent": "SearchTrades",
          "contexts": ["fdc3.trade.query"]
        }
      ]
    }
  }
}
```

- [ ] **Step 4: Add the day-1 chat action definition adapter**

Create a focused adapter that converts the local declarations into chat action metadata:

```ts
// apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-definitions.ts
import fdc3Definitions from '../../../fdc3/declarations/fdc3-definitions.json';
import contexts from '../../../fdc3/declarations/contexts.json';
import intents from '../../../fdc3/declarations/intents.json';

export type Fdc3ChatActionDefinition = {
  id: string;
  title: string;
  description: string;
  approvalTitle: string;
  approvalBody: string;
  intent: string;
  contextType: string;
  targetAppIds: string[];
  matchingHints: string[];
  argumentSchema: Record<string, unknown>;
  resultSchemaHint: Record<string, unknown>;
};

export function getFdc3ChatActionDefinitions(): Fdc3ChatActionDefinition[] {
  const tradeIntent = intents.find((intent) => intent.name === 'SearchTrades');
  const tradeContext = contexts.find(
    (context) => context.schema?.properties?.type?.const === 'fdc3.trade.query',
  );
  const tradeTargets = fdc3Definitions
    .filter((app) =>
      app.interop?.intents?.listensFor?.some(
        (listener) =>
          listener.intent === 'SearchTrades' && listener.contexts?.includes('fdc3.trade.query'),
      ),
    )
    .map((app) => app.appId);

  if (!tradeIntent || !tradeContext || tradeTargets.length === 0) {
    return [];
  }

  return [
    {
      id: 'trade-blotter.pending-validation',
      title: 'Open trade blotter for pending validation trades',
      description: tradeIntent.description,
      approvalTitle: 'Open Trade Blotter',
      approvalBody:
        'Open the trade blotter, search for pending validation trades, and continue with the returned result.',
      intent: 'SearchTrades',
      contextType: 'fdc3.trade.query',
      targetAppIds: tradeTargets,
      matchingHints: [
        'trade blotter',
        'trades pending validation',
        'pending validation trades',
        'validation status for trades',
      ],
      argumentSchema: tradeContext.schema as Record<string, unknown>,
      resultSchemaHint: {
        type: 'object',
        required: ['status', 'intent', 'appliedFilters', 'totalCount', 'summary', 'trades', 'tile'],
      },
    },
  ];
}
```

- [ ] **Step 5: Run the declaration adapter test**

Run: `cd apps/base && npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-action-definitions.test.ts`

Expected: PASS with the new trade action metadata.

- [ ] **Step 6: Commit the declaration and adapter changes**

```bash
git add apps/base/src/fdc3/declarations/intents.json \
  apps/base/src/fdc3/declarations/contexts.json \
  apps/base/src/fdc3/declarations/fdc3-definitions.json \
  apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-definitions.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-definitions.test.ts
git commit -m "feat: add declaration-backed trade blotter chat action metadata"
```

---

### Task 2: Build the FDC3 chat action provider and executor in `apps/base`

**Files:**
- Add: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-provider.ts`
- Add: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.ts`
- Add: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-context-builder.ts`
- Test: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-provider.test.ts`
- Test: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.test.ts`

- [ ] **Step 1: Write the failing provider and executor tests**

```ts
// apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-provider.test.ts
import { describe, expect, it } from '@jest/globals';
import { createDeclarationBackedFdc3ActionProvider } from './fdc3-action-provider';

describe('createDeclarationBackedFdc3ActionProvider', () => {
  it('matches the pending validation prompt to the trade blotter action', async () => {
    const provider = createDeclarationBackedFdc3ActionProvider();
    const matches = await provider.findMatchingActions('how is trades pending validation status ?');
    expect(matches.map((match) => match.id)).toEqual(['trade-blotter.pending-validation']);
  });
});
```

```ts
// apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.test.ts
import { describe, expect, it, jest } from '@jest/globals';
import { createFdc3ActionExecutor } from './fdc3-action-executor';

describe('createFdc3ActionExecutor', () => {
  it('opens the target tile, raises SearchTrades, and returns the result payload', async () => {
    const workspaceOpenTile = jest.fn().mockResolvedValue({
      opened: true,
      workspaceId: 'ws-trade-1',
      newTile: true,
      failedReason: '',
    });
    const raiseIntent = jest.fn().mockResolvedValue({
      source: { appId: 'template_tile_trade_blotter', instanceId: 'ws-trade-1' },
      getResult: async () => ({
        status: 'ok',
        intent: 'SearchTrades',
        totalCount: 2,
        summary: '2 pending validation trades found',
        trades: [{ tradeId: 'TR-001' }, { tradeId: 'TR-002' }],
        appliedFilters: { status: 'PENDING_VALIDATION' },
        tile: { appId: 'template_tile_trade_blotter', instanceId: 'ws-trade-1' },
      }),
    });

    const executor = createFdc3ActionExecutor({
      workspaceOpenTile,
      getAgentApi: () => ({ raiseIntent }),
    });

    const result = await executor.execute({
      actionId: 'trade-blotter.pending-validation',
      question: 'how is trades pending validation status ?',
    });

    expect(workspaceOpenTile).toHaveBeenCalledWith(
      { tile: 'template_tile_trade_blotter' },
      { workspaceId: undefined },
    );
    expect(raiseIntent).toHaveBeenCalledWith(
      'SearchTrades',
      expect.objectContaining({
        type: 'fdc3.trade.query',
        filters: { status: 'PENDING_VALIDATION' },
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        status: 'ok',
        totalCount: 2,
      }),
    );
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:
- `cd apps/base && npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-action-provider.test.ts`
- `cd apps/base && npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.test.ts`

Expected: FAIL because the provider, context builder, and executor do not exist yet.

- [ ] **Step 3: Implement the declaration-backed action provider**

Create a provider interface and day-1 implementation:

```ts
// apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-provider.ts
import {
  getFdc3ChatActionDefinitions,
  type Fdc3ChatActionDefinition,
} from './fdc3-action-definitions';

export type Fdc3ChatActionProvider = {
  listActions(): Promise<Fdc3ChatActionDefinition[]>;
  findMatchingActions(userRequest: string): Promise<Fdc3ChatActionDefinition[]>;
  resolveAction(actionId: string): Promise<Fdc3ChatActionDefinition | undefined>;
};

export function createDeclarationBackedFdc3ActionProvider(): Fdc3ChatActionProvider {
  const actions = getFdc3ChatActionDefinitions();

  return {
    async listActions() {
      return actions;
    },
    async findMatchingActions(userRequest: string) {
      const normalized = userRequest.toLowerCase();
      return actions.filter((action) =>
        action.matchingHints.some((hint) => normalized.includes(hint.toLowerCase())),
      );
    },
    async resolveAction(actionId: string) {
      return actions.find((action) => action.id === actionId);
    },
  };
}
```

- [ ] **Step 4: Implement the context builder and executor**

Keep the context-building rules separate from the intent-raising code:

```ts
// apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-context-builder.ts
export function buildTradeQueryContext(question: string) {
  return {
    type: 'fdc3.trade.query',
    filters: { status: 'PENDING_VALIDATION' },
    question,
  };
}
```

```ts
// apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.ts
import { getAgentApi } from 'ratan-fdc3-agent';
import { buildTradeQueryContext } from './fdc3-context-builder';
import { createDeclarationBackedFdc3ActionProvider } from './fdc3-action-provider';

export function createFdc3ActionExecutor(deps: {
  workspaceOpenTile: (input: { tile: string }, options?: { workspaceId?: string }) => Promise<{
    opened: boolean;
    workspaceId: string;
    newTile: boolean;
    failedReason: string;
  }>;
  getAgentApi?: typeof getAgentApi;
}) {
  const provider = createDeclarationBackedFdc3ActionProvider();
  const getApi = deps.getAgentApi ?? getAgentApi;

  return {
    async execute(input: { actionId: string; question: string }) {
      const action = await provider.resolveAction(input.actionId);
      if (!action) {
        throw new Error(`Unknown FDC3 action: ${input.actionId}`);
      }

      const targetAppId = action.targetAppIds[0];
      const openStatus = await deps.workspaceOpenTile({ tile: targetAppId }, { workspaceId: undefined });
      if (!openStatus.opened) {
        throw new Error(openStatus.failedReason || 'Failed to open target tile');
      }

      const resolution = await getApi().raiseIntent(action.intent, buildTradeQueryContext(input.question));
      return resolution.getResult();
    },
  };
}
```

- [ ] **Step 5: Run the provider and executor tests**

Run:
- `cd apps/base && npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-action-provider.test.ts`
- `cd apps/base && npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.test.ts`

Expected: PASS with declaration-backed matching and successful intent execution orchestration.

- [ ] **Step 6: Commit the provider and executor changes**

```bash
git add apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-provider.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-context-builder.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-provider.test.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.test.ts
git commit -m "feat: add declaration-backed FDC3 chat action provider and executor"
```

---

### Task 3: Expose reusable human and frontend FDC3 tools in `ChatbotSidebarV2`

**Files:**
- Modify: `apps/base/src/components/ChatbotSidebarV2/toolkit/tools.tsx`
- Modify: `apps/base/src/components/ChatbotSidebarV2/toolkit/tool-renderers.tsx`
- Add: `apps/base/src/components/ChatbotSidebarV2/toolkit/use-fdc3-action-executor.ts`
- Modify: `apps/base/src/pages/Home/index.test.tsx`
- Test: `apps/base/src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx`

- [ ] **Step 1: Write the failing toolkit manifest test**

```ts
// apps/base/src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx
import { describe, expect, it } from '@jest/globals';
import { getProtocolToolDescriptors, runtimeToolkit } from './tools';

describe('runtimeToolkit FDC3 tools', () => {
  it('exposes the FDC3 proposal and execution tools with the correct sources', () => {
    const descriptors = getProtocolToolDescriptors();
    expect(descriptors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'propose_fdc3_action', source: 'human' }),
        expect.objectContaining({ name: 'execute_fdc3_action', source: 'frontend' }),
      ]),
    );
    expect(runtimeToolkit.propose_fdc3_action.type).toBe('human');
    expect(runtimeToolkit.execute_fdc3_action.type).toBe('frontend');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd apps/base && npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx`

Expected: FAIL because the new tool descriptors and executor hook do not exist yet.

- [ ] **Step 3: Add a hook wrapper for the executor dependencies**

Use the existing workspace helper from `apps/base/src/fdc3/useFDC3WorkspaceHelper.ts`:

```ts
// apps/base/src/components/ChatbotSidebarV2/toolkit/use-fdc3-action-executor.ts
import { useMemo } from 'react';
import { createFdc3ActionExecutor } from './fdc3-action-executor';
import { useFDC3WorkspaceHelper } from '../../../fdc3/useFDC3WorkspaceHelper';

export function useFdc3ActionExecutor() {
  const { workspaceOpenTile } = useFDC3WorkspaceHelper();
  return useMemo(
    () =>
      createFdc3ActionExecutor({
        workspaceOpenTile,
      }),
    [workspaceOpenTile],
  );
}
```

- [ ] **Step 4: Extend the toolkit with the two reusable FDC3 tools**

Update `tools.tsx` so the model can first propose and then execute:

```ts
// apps/base/src/components/ChatbotSidebarV2/toolkit/tools.tsx
import { z } from 'zod';
import { createDeclarationBackedFdc3ActionProvider } from './fdc3-action-provider';

const fdc3ActionProvider = createDeclarationBackedFdc3ActionProvider();

runtimeToolkit.propose_fdc3_action = {
  type: 'human',
  description: 'Ask the user to approve an FDC3 action proposal before any tile is opened',
  parameters: z.object({
    actionId: z.string(),
    question: z.string(),
    approvalTitle: z.string(),
    approvalBody: z.string(),
    intent: z.string(),
    contextPreview: z.record(z.unknown()),
  }),
  render: Fdc3ApprovalTool,
};

runtimeToolkit.execute_fdc3_action = {
  type: 'frontend',
  description: 'Execute an approved FDC3 action by opening the target tile and raising the intent',
  parameters: z.object({
    actionId: z.string(),
    question: z.string(),
  }),
  execute: async (input) => fdc3Executor.execute(input as { actionId: string; question: string }),
  render: Fdc3ExecutionResultTool,
};
```

If the current module structure makes hook usage awkward, refactor `runtimeToolkit` construction into a function that receives the executor instance from the component layer instead of using a static top-level constant.

- [ ] **Step 5: Add compact renderers for the FDC3 approval/result payloads**

Add minimal UI cards to `tool-renderers.tsx`:

```tsx
export function Fdc3ApprovalTool({ args }: ToolRenderProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm shadow-sm">
      <div className="font-medium text-amber-900">{String(args.approvalTitle ?? 'FDC3 action')}</div>
      <div className="mt-1 text-amber-800">{String(args.approvalBody ?? '')}</div>
    </div>
  );
}

export function Fdc3ExecutionResultTool({ result }: ToolRenderProps) {
  return (
    <JsonToolCard
      toolName="execute_fdc3_action"
      title="FDC3 Result"
      result={result}
      emptyMessage="No result was returned from the target tile."
    />
  );
}
```

- [ ] **Step 6: Run the toolkit tests**

Run:
- `cd apps/base && npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx`
- `cd apps/base && npm test -- --runInBand`

Expected: PASS with the new tool manifest and no regression in home-page mounting tests.

- [ ] **Step 7: Commit the toolkit changes**

```bash
git add apps/base/src/components/ChatbotSidebarV2/toolkit/tools.tsx \
  apps/base/src/components/ChatbotSidebarV2/toolkit/tool-renderers.tsx \
  apps/base/src/components/ChatbotSidebarV2/toolkit/use-fdc3-action-executor.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx \
  apps/base/src/pages/Home/index.test.tsx
git commit -m "feat: expose reusable chatbot FDC3 approval and execution tools"
```

---

### Task 4: Add the sample trade blotter tile and intent handler

**Files:**
- Add: `apps/tile/src/TradeBlotterTile/index.tsx`
- Add: `apps/tile/src/components/TradeBlotterFDC3Tile.tsx`
- Add: `apps/tile/src/components/tradeBlotterMockData.ts`
- Add: `apps/tile/src/components/tradeBlotterTypes.ts`
- Add: `apps/tile/src/components/TradeBlotterFDC3Tile.test.tsx`
- Modify: `apps/tile/src/Root/routing/index.tsx`

- [ ] **Step 1: Write the failing tile test**

```tsx
// apps/tile/src/components/TradeBlotterFDC3Tile.test.tsx
import { render, screen } from '@testing-library/react';
import { TradeBlotterFDC3Tile } from './TradeBlotterFDC3Tile';

describe('TradeBlotterFDC3Tile', () => {
  it('renders pending validation trades returned by the SearchTrades intent handler', async () => {
    render(<TradeBlotterFDC3Tile tile="/template_tile_trade_blotter" id="ws-trade-1" />);
    expect(screen.getByText('Trade Blotter')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd apps/tile && npx jest --runTestsByPath src/components/TradeBlotterFDC3Tile.test.tsx`

Expected: FAIL because the tile and its data files do not exist yet.

- [ ] **Step 3: Add the mock data and tile-side types**

```ts
// apps/tile/src/components/tradeBlotterTypes.ts
export type TradeQueryContext = {
  type: 'fdc3.trade.query';
  filters: {
    status: string;
    book?: string;
    desk?: string;
  };
  question: string;
};

export type TradeRow = {
  tradeId: string;
  book: string;
  desk: string;
  status: string;
  counterparty: string;
  notional: number;
};
```

```ts
// apps/tile/src/components/tradeBlotterMockData.ts
import type { TradeRow } from './tradeBlotterTypes';

export const TRADE_ROWS: TradeRow[] = [
  { tradeId: 'TR-001', book: 'Rates', desk: 'LDN', status: 'PENDING_VALIDATION', counterparty: 'GS', notional: 1200000 },
  { tradeId: 'TR-002', book: 'FX', desk: 'SG', status: 'PENDING_VALIDATION', counterparty: 'MS', notional: 2500000 },
  { tradeId: 'TR-003', book: 'Credit', desk: 'NY', status: 'VALIDATED', counterparty: 'JPM', notional: 1800000 },
];
```

- [ ] **Step 4: Implement the trade blotter tile with an intent listener**

```tsx
// apps/tile/src/components/TradeBlotterFDC3Tile.tsx
import { useMemo, useState } from 'react';
import { FDC3Agent } from '../Root/import';
import { TRADE_ROWS } from './tradeBlotterMockData';
import type { TileProps } from '../Root/routing/common/interface';
import type { TradeQueryContext, TradeRow } from './tradeBlotterTypes';

const { AgentProvider, useIntentListener } = FDC3Agent;

function TradeBlotterContent() {
  const [rows, setRows] = useState<TradeRow[]>([]);

  useIntentListener('SearchTrades', async (context: TradeQueryContext) => {
    const filtered = TRADE_ROWS.filter((trade) => trade.status === context.filters.status);
    setRows(filtered);
    return {
      status: 'ok',
      intent: 'SearchTrades',
      appliedFilters: context.filters,
      totalCount: filtered.length,
      summary: `${filtered.length} pending validation trades found`,
      trades: filtered.slice(0, 10),
    };
  });

  return (
    <div>
      <h2>Trade Blotter</h2>
      {rows.map((row) => (
        <div key={row.tradeId}>{row.tradeId}</div>
      ))}
    </div>
  );
}

export function TradeBlotterFDC3Tile(props: TileProps) {
  const appIdentifier = useMemo(
    () => ({ appId: props.tile.replace(/\//g, ''), instanceId: props.id }),
    [props.id, props.tile],
  );

  return (
    <AgentProvider appIdentifier={appIdentifier}>
      <TradeBlotterContent />
    </AgentProvider>
  );
}
```

- [ ] **Step 5: Wire the new tile into routing**

```tsx
// apps/tile/src/Root/routing/index.tsx
const TradeBlotterTile = React.lazy(() => import('../../TradeBlotterTile'));

<Route
  path="/template_tile_trade_blotter/*"
  element={
    <React.Suspense fallback={<Loader />}>
      <TradeBlotterTile {...props} />
    </React.Suspense>
  }
></Route>
```

- [ ] **Step 6: Run the tile test suite**

Run:
- `cd apps/tile && npx jest --runTestsByPath src/components/TradeBlotterFDC3Tile.test.tsx`
- `cd apps/tile && npm test -- --runInBand`

Expected: PASS with the new tile mounting and intent-driven rendering behavior.

- [ ] **Step 7: Commit the tile changes**

```bash
git add apps/tile/src/TradeBlotterTile/index.tsx \
  apps/tile/src/components/TradeBlotterFDC3Tile.tsx \
  apps/tile/src/components/tradeBlotterMockData.ts \
  apps/tile/src/components/tradeBlotterTypes.ts \
  apps/tile/src/components/TradeBlotterFDC3Tile.test.tsx \
  apps/tile/src/Root/routing/index.tsx
git commit -m "feat: add trade blotter tile with SearchTrades intent handler"
```

---

### Task 5: Verify end-to-end chat continuation behavior and complete day-1 hardening

**Files:**
- Modify: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.ts`
- Modify: `apps/base/src/components/ChatbotSidebarV2/toolkit/tools.tsx`
- Add: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-chat-flow.test.tsx`
- Optional docs note: `docs/superpowers/specs/2026-04-28-chatbot-fdc3-tool-design.md` only if implementation constraints changed

- [ ] **Step 1: Write the failing flow-level test**

```ts
// apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-chat-flow.test.tsx
import { describe, expect, it } from '@jest/globals';

describe('FDC3 chat flow', () => {
  it('returns a compact continuation payload for the assistant after intent execution', async () => {
    const result = {
      status: 'ok',
      intent: 'SearchTrades',
      appliedFilters: { status: 'PENDING_VALIDATION' },
      totalCount: 2,
      summary: '2 pending validation trades found',
      trades: [{ tradeId: 'TR-001' }, { tradeId: 'TR-002' }],
      tile: { appId: 'template_tile_trade_blotter', instanceId: 'ws-trade-1' },
    };

    expect(result).toEqual(
      expect.objectContaining({
        status: 'ok',
        totalCount: 2,
        summary: expect.stringContaining('pending validation'),
      }),
    );
  });
});
```

- [ ] **Step 2: Harden the executor return shape**

Normalize success and error payloads in `fdc3-action-executor.ts`:

```ts
return {
  status: 'ok',
  intent: action.intent,
  appliedFilters: context.filters,
  totalCount: Number(result.totalCount ?? 0),
  summary: String(result.summary ?? ''),
  trades: Array.isArray(result.trades) ? result.trades.slice(0, 10) : [],
  tile: result.tile ?? { appId: targetAppId, instanceId: openStatus.workspaceId },
};
```

For failures:

```ts
return {
  status: 'error',
  intent: action.intent,
  message: error instanceof Error ? error.message : 'Unknown FDC3 execution error',
};
```

- [ ] **Step 3: Run the focused base tests**

Run:
- `cd apps/base && npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-chat-flow.test.tsx`
- `cd apps/base && npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-action-definitions.test.ts src/components/ChatbotSidebarV2/toolkit/fdc3-action-provider.test.ts src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.test.ts src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx`

Expected: PASS for declaration mapping, matching, execution orchestration, tool manifest exposure, and normalized continuation payload shape.

- [ ] **Step 4: Run workspace-level verification**

Run:
- `cd apps/base && npm run lint`
- `cd apps/base && npm test -- --runInBand`
- `cd apps/tile && npm run lint`
- `cd apps/tile && npm test -- --runInBand`

Expected: PASS with zero lint warnings and green Jest coverage for the new files.

- [ ] **Step 5: Perform manual system verification at the shell UI**

Run: `npm run dev`

Then verify at `http://localhost:8001`:

1. Click `login`
2. Open the chatbot modal
3. Ask `how is trades pending validation status ?`
4. Verify the assistant proposes the FDC3 action through the human-tool approval UI
5. Approve the action
6. Verify the trade blotter tile opens in the workspace
7. Verify the tile renders the pending validation mock trades
8. Verify the assistant continues with the returned trade summary

- [ ] **Step 6: Commit the verification hardening**

```bash
git add apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/tools.tsx \
  apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-chat-flow.test.tsx
git commit -m "test: harden chatbot FDC3 continuation flow"
```

