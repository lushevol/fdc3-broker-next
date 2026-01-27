# Tasks: FDC3 Interoperability for MFE Platform

**Input**: Design documents from `/specs/002-fdc3-interoperability/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/app-directory-api.yaml

**Tests**: Tests are included as per constitution requirements (unit test coverage >95%)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Packages**: `packages/fdc3-*/src/` for implementation, `packages/fdc3-*/test/` for tests
- **Base MFE**: `apps/base/src/hooks/fdc3/` for broker integration
- **Tile MFE**: `apps/mf_tile/src/` for agent integration examples

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for all four packages

- [x] T001 Create package directories for fdc3-broker, fdc3-agent, fdc3-app-directory, fdc3-resolver-ui in packages/
- [x] T002 Initialize package.json files for all four packages with dependencies (see research.md#L176-L190 for peer dependencies strategy)
- [x] T003 [P] Create tsup.config.ts in packages/fdc3-broker/ (see research.md#L127-L138 for configuration)
- [x] T004 [P] Create tsup.config.ts in packages/fdc3-agent/
- [x] T005 [P] Create tsup.config.ts in packages/fdc3-app-directory/
- [x] T006 [P] Create tsup.config.ts in packages/fdc3-resolver-ui/
- [x] T007 [P] Create vitest.config.ts in packages/fdc3-broker/ (see research.md#L154-L167 for configuration)
- [x] T008 [P] Create vitest.config.ts in packages/fdc3-agent/
- [x] T009 [P] Create vitest.config.ts in packages/fdc3-app-directory/
- [x] T010 [P] Create vitest.config.ts in packages/fdc3-resolver-ui/
- [x] T011 [P] Create tsconfig.json files for all four packages with strict mode enabled
- [x] T012 [P] Create test/setup.ts files for all packages (see research.md#L154-L167 for setup requirements)
- [x] T013 [P] Create .eslintrc.js files for all packages with TypeScript rules
- [x] T014 [P] Create README.md files for all four packages
- [x] T015 [P] Create Changesets configuration in repository root (.changeset/config.json)

**Checkpoint**: All packages have build, test, and linting infrastructure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T021 Create core type definitions in packages/fdc3-broker/src/types.ts (re-export @finos/fdc3 types - see data-model.md#L24-L66)
- [x] T022 [P] Create BrokerConfig interface in packages/fdc3-broker/src/types.ts (see data-model.md#L254-L282)
- [x] T023 [P] Create BrokerCallbacks interface in packages/fdc3-broker/src/types.ts (see data-model.md#L284-L338)
- [x] T024 [P] Create ResolverTarget interface in packages/fdc3-broker/src/types.ts (see data-model.md#L340-L361)
- [x] T025 [P] Create TileRegistry and TileInstance interfaces in packages/fdc3-broker/src/types.ts (see data-model.md#L518-L583)
- [x] T026 [P] Create IntentQueue interfaces in packages/fdc3-broker/src/types.ts (see data-model.md#L585-L635)
- [x] T027 [P] Create ChannelManager interface in packages/fdc3-broker/src/types.ts (see data-model.md#L637-L676)
- [x] T028 [P] Create AppDefinition types in packages/fdc3-app-directory/src/types.ts (see data-model.md#L99-L184)
- [x] T029 [P] Create AppDirectoryClient interface in packages/fdc3-app-directory/src/types.ts (see data-model.md#L187-L223)
- [x] T030 [P] Create AppDirectoryConfig interface in packages/fdc3-app-directory/src/types.ts (see data-model.md#L225-L244)
- [x] T031 Create structured logger in packages/fdc3-broker/src/logger.ts (see research.md#L790-L833 for Logger implementation)
- [x] T032 Create error types in packages/fdc3-broker/src/errors.ts (resolveError, channelError, FDC3Error from @finos/fdc3 - see data-model.md#L59-L65)
- [x] T033 Create environment detection utilities in packages/fdc3-broker/src/environment.ts (see research.md#L572-L587 for isOpenFinAvailable and getRuntimeEnvironment)
- [x] T034 Create performance tracker in packages/fdc3-broker/src/performance.ts (see research.md#L838-L863 for PerformanceTracker implementation)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 6 - App Directory and Entitlement-Based Discovery (Priority: P1) 🎯 MVP

**Goal**: Implement App Directory client with mock service for development so broker can discover available tiles filtered by user entitlements (see spec.md#L129-L147)

**Independent Test**:

1. Run mock service and register 3 tile apps (Chart, Order, Watchlist)
2. Query for apps that handle "ViewChart" intent → should return only Chart app
3. Query for apps by context type "fdc3.instrument" → should return all apps that handle instruments
4. Query with entitlement filter → should return only apps user is entitled to access

**References**:

- App Directory API contract: contracts/app-directory-api.yaml
- Data model: data-model.md#L99-L244
- Implementation pattern: research.md#L418-L560

### Implementation for US6

- [x] T041 [P] [US6] Create MockAppDirectoryService in packages/fdc3-app-directory/src/mock-service.ts (see research.md#L490-L515)
- [x] T042 [P] [US6] Create AppDirectoryClientImpl in packages/fdc3-app-directory/src/client.ts (see research.md#L456-L485 for HTTP client implementation)
- [x] T043 [US6] Implement getAllApps() in AppDirectoryClientImpl (GET /v2/apps endpoint - see contracts/app-directory-api.yaml#L32-L72)
- [x] T044 [US6] Implement getApp() in AppDirectoryClientImpl (GET /v2/apps/{appId} endpoint - see contracts/app-directory-api.yaml#L74-L101)
- [x] T045 [US6] Implement findByIntent() in AppDirectoryClientImpl (query parameter ?intent= - see contracts/app-directory-api.yaml#L48-L53)
- [x] T046 [US6] Implement findByContextType() in AppDirectoryClientImpl (query parameter ?contextType= - see contracts/app-directory-api.yaml#L54-L59)
- [x] T047 [US6] Implement findByCategory() in AppDirectoryClientImpl (query parameter ?category= - see contracts/app-directory-api.yaml#L42-L47)
- [x] T048 [US6] Add authentication token injection in AppDirectoryClientImpl (Bearer token header - see contracts/app-directory-api.yaml#L127-L131)
- [x] T049 [US6] Add error handling for 401, 404, 500 responses in AppDirectoryClientImpl (see contracts/app-directory-api.yaml#L305-L334)
- [x] T050 [US6] Export client and types from packages/fdc3-app-directory/src/index.ts

### Tests for US6

- [x] T051 [P] [US6] Unit test for MockAppDirectoryService in packages/fdc3-app-directory/test/mock-service.test.ts (test registerApp, getAllApps, findByIntent, findByContextType)
- [x] T052 [P] [US6] Unit test for AppDirectoryClientImpl in packages/fdc3-app-directory/test/client.test.ts (test HTTP requests, authentication, error handling)
- [x] T053 [US6] Integration test for App Directory client in packages/fdc3-app-directory/test/integration.test.ts (test client + mock service together)

**Checkpoint**: App Directory client complete - broker can now discover available tiles with entitlement filtering

---

## Phase 4: User Story 1 - Internal Intent Resolution (Priority: P1) 🎯 MVP

**Goal**: Enable tiles to send intents to each other with automatic target resolution, resolver UI for multiple targets, and intent queuing for unmounted tiles (see spec.md#L30-L48)

**Independent Test**:

1. Open Tile A (Order Management) and two instances of Tile B (Chart)
2. From Tile A, send "ViewChart" intent with instrument context
3. Resolver UI should appear showing both Chart tile instances
4. Select one Chart tile → intent should be delivered with correct context
5. Target tile should display the instrument data
6. If target tile is not mounted, intent should be queued and delivered on mount

**References**:

- FDC3 API surface: research.md#L25-L61
- Broker callbacks: data-model.md#L284-L338
- OpenFin architecture: plan.md#L247-L622
- Resolver UI types: data-model.md#L447-L510

### Implementation for US1

- [ ] T061 [P] [US1] Create IntentResolver class in packages/fdc3-broker/src/intent-resolver.ts (see plan.md#L451-L522 for resolver logic, reference research.md#L25-L61 for FDC3 API methods)
- [ ] T062 [P] [US1] Create TileRegistry class in packages/fdc3-broker/src/tile-registry.ts (see data-model.md#L518-L583 for TileRegistry interface, implement registerTile, unregisterTile, getTile, getAllTiles, getTilesByAppId)
- [ ] T063 [P] [US1] Create IntentQueue class in packages/fdc3-broker/src/intent-queue.ts (see data-model.md#L585-L635 for IntentQueue interface, see research.md#L676-L712 for queueIntent, deliverQueued, saveToPersistence, loadFromPersistence)
- [ ] T064 [US1] Implement DesktopAgent.raiseIntent() in packages/fdc3-broker/src/broker.ts (see research.md#L41 for raiseIntent signature, see plan.md#L484-L513 for bidirectional routing logic, reference data-model.md#L340-L361 for ResolverTarget)
- [ ] T065 [US1] Implement DesktopAgent.findIntent() in packages/fdc3-broker/src/broker.ts (see research.md#L39 for findIntent signature, use App Directory to find apps)
- [ ] T066 [US1] Implement DesktopAgent.findIntentsByContext() in packages/fdc3-broker/src/broker.ts (see research.md#L40 for findIntentsByContext signature)
- [ ] T067 [US1] Implement DesktopAgent.addIntentListener() in packages/fdc3-broker/src/broker.ts (see research.md#L43 for addIntentListener signature, validate intent type against tile's static manifest - see spec.md#L272-L273)
- [ ] T068 [US1] Implement DesktopAgent.raiseIntentForContext() in packages/fdc3-broker/src/broker.ts (see research.md#L42 for raiseIntentForContext signature)
- [ ] T069 [US1] Implement intent queuing for unmounted tiles in broker.ts (when tile not in TileRegistry, queue in IntentQueue - see research.md#L676-L712)
- [ ] T070 [US1] Implement intent delivery on tile mount in broker.ts (when tile registers, deliver queued intents - see research.md#L687-L695)
- [ ] T071 [US1] Add resolver UI callback invocation in IntentResolver (when multiple targets available, call onShowResolverUI callback - see data-model.md#L332-L337, reference plan.md#L484-L513)

### Resolver UI Components for US1

- [ ] T072 [P] [US1] Create ResolverDialog component in packages/fdc3-resolver-ui/src/ResolverDialog.tsx (see data-model.md#L447-L475 for ResolverDialogProps, use MUI Dialog component)
- [ ] T073 [P] [US1] Create AppCard component in packages/fdc3-resolver-ui/src/AppCard.tsx (see data-model.md#L477-L510 for AppCardProps, display app name, icon, current context)
- [ ] T074 [P] [US1] Create ContextPreview component in packages/fdc3-resolver-ui/src/ContextPreview.tsx (display context data in JSON format for user verification)
- [ ] T075 [P] [US1] Create useResolverKeyboard hook in packages/fdc3-resolver-ui/src/useResolverKeyboard.ts (handle arrow keys, Enter, Escape for accessibility)
- [ ] T076 [US1] Implement keyboard navigation in ResolverDialog (arrow keys to move between apps, Enter to select, Escape to cancel - see quickstart.md#L49-L52 for accessibility requirements)
- [ ] T077 [US1] Export resolver UI components from packages/fdc3-resolver-ui/src/index.ts

### Agent API for US1

- [ ] T078 [P] [US1] Create AgentAPI class in packages/fdc3-agent/src/agent.ts (thin wrapper that delegates to broker - see data-model.md#L369-L390 for getAgentApi signature)
- [ ] T079 [P] [US1] Create useFDC3 hook in packages/fdc3-agent/src/hooks.ts (return DesktopAgent instance - see data-model.md#L401-L406)
- [ ] T080 [P] [US1] Create useIntentListener hook in packages/fdc3-agent/src/hooks.ts (register intent listener on mount, cleanup on unmount - see data-model.md#L408-L415)
- [ ] T081 [US1] Export agent API and hooks from packages/fdc3-agent/src/index.ts (re-export @finos/fdc3 types - see data-model.md#L36-L66)

### Base MFE Integration for US1

- [ ] T082 [US1] Create BrokerProvider in apps/base/src/hooks/fdc3/BrokerProvider.tsx (see research.md#L209-L243 for Provider pattern, reference quickstart.md#L128-L243 for full integration example)
- [ ] T083 [US1] Create useBroker hook in apps/base/src/hooks/fdc3/useBroker.ts (expose broker instance from context)
- [ ] T084 [US1] Create broker config in apps/base/src/hooks/fdc3/config.ts (inject callbacks - onLoginStatusCheck, onTileOpen, onValidateEntitlements, onShowResolverUI, see data-model.md#L284-L338 for callback interfaces)
- [ ] T085 [US1] Integrate BrokerProvider with existing base MFE provider (see research.md#L369-L408 for integration strategy, wrap existing provider with BrokerProvider)
- [ ] T086 [US1] Add resolver UI state management in base MFE (see quickstart.md#L138-L193 for resolver state example)

### Tests for US1

- [x] T087 [P] [US1] Unit test for IntentResolver in packages/fdc3-broker/test/intent-resolver.test.ts (test single target, multiple targets, no target, target with instanceId)
- [x] T088 [P] [US1] Unit test for TileRegistry in packages/fdc3-broker/test/tile-registry.test.ts (test registerTile, unregisterTile, getTile, getAllTiles, getTilesByAppId)
- [x] T089 [P] [US1] Unit test for IntentQueue in packages/fdc3-broker/test/intent-queue.test.ts (test queueIntent, deliverQueued, saveToPersistence, loadFromPersistence)
- [x] T090 [P] [US1] Unit test for broker.raiseIntent() in packages/fdc3-broker/test/broker-raise-intent.test.ts (test intent delivery, resolver UI trigger, intent queuing for unmounted tiles)
- [x] T091 [P] [US1] Integration test for broker + App Directory in packages/fdc3-broker/test/broker-app-directory-integration.test.ts (test findIntent, findIntentsByContext with App Directory)
- [x] T092 [P] [US1] Component test for ResolverDialog in packages/fdc3-resolver-ui/test/ResolverDialog.test.tsx (test render, app selection, keyboard navigation, accessibility)
- [x] T093 [P] [US1] Component test for AppCard in packages/fdc3-resolver-ui/test/AppCard.test.tsx (test render, click handling, keyboard focus)
- [x] T094 [P] [US1] Unit test for useFDC3 hook in packages/fdc3-agent/test/useFDC3.test.ts (test hook returns DesktopAgent instance)
- [x] T095 [P] [US1] Unit test for useIntentListener hook in packages/fdc3-agent/test/useIntentListener.test.ts (test listener registration, cleanup on unmount)
- [x] T096 [US1] Integration test for broker + resolver UI in packages/fdc3-broker/test/broker-resolver-ui-integration.test.ts (test broker triggers resolver UI with correct targets)
- [x] T097 [US1] Contract test for FDC3 API compliance in packages/fdc3-broker/test/fdc3-api-compliance.test.ts (use FDC3 conformance test suite, verify all DesktopAgent methods comply)

**Checkpoint**: Internal intent resolution complete - tiles can send/receive intents with resolver UI and intent queuing

---

## Phase 5: User Story 2 - Channel Context Sharing (Priority: P1) 🎯 MVP

**Goal**: Enable tiles to join channels and broadcast context to all other tiles on the same channel (see spec.md#L52-L68)

**Independent Test**:

1. Open 3 tiles (Watchlist, Chart, Order Blotter)
2. All 3 tiles join the "red" channel
3. Select an instrument in Watchlist → broadcast context
4. Both Chart and Order Blotter tiles should receive and display the instrument
5. Watchlist should NOT receive context from a tile on "green" channel
6. Tile leaving channel should stop receiving context

**References**:

- FDC3 Channel API: research.md#L64-L76
- Channel Manager interface: data-model.md#L637-L676
- OpenFin channel sync: plan.md#L567-L583

### Implementation for US2

- [x] T101 [P] [US2] Create Channel class in packages/fdc3-broker/src/channel.ts (implement Channel interface from research.md#L64-L76, implement broadcast, getCurrentContext, addContextListener)
- [x] T102 [P] [US2] Create PrivateChannel class in packages/fdc3-broker/src/channel.ts (implement PrivateChannel interface, restrict access to only tiles that have the channel reference)
- [x] T103 [P] [US2] Create ChannelManager class in packages/fdc3-broker/src/channel-manager.ts (see data-model.md#L637-L676 for ChannelManager interface, implement createChannel, getChannel, getUserChannels, joinChannel, leaveChannel, broadcast, addContextListener, getTileChannel)
- [x] T104 [US2] Create UserChannelManager class in packages/fdc3-broker/src/channel-manager.ts (manage 8 standard user channels - red, green, blue, orange, yellow, cyan, magenta, purple)
- [x] T105 [US2] Implement DesktopAgent.getOrCreateChannel() in packages/fdc3-broker/src/broker.ts (see research.md#L45 for getOrCreateChannel signature, create app channel if not exists)
- [x] T106 [US2] Implement DesktopAgent.createPrivateChannel() in packages/fdc3-broker/src/broker.ts (see research.md#L46 for createPrivateChannel signature)
- [x] T107 [US2] Implement DesktopAgent.getUserChannels() in packages/fdc3-broker/src/broker.ts (see research.md#L47 for getUserChannels signature, return array of user channels)
- [x] T108 [US2] Implement DesktopAgent.joinUserChannel() in packages/fdc3-broker/src/broker.ts (see research.md#L57 for joinUserChannel signature, see plan.md#L517-L526 for OpenFin sync)
- [x] T109 [US2] Implement DesktopAgent.getCurrentChannel() in packages/fdc3-broker/src/broker.ts (see research.md#L58 for getCurrentChannel signature)
- [x] T110 [US2] Implement DesktopAgent.leaveCurrentChannel() in packages/fdc3-broker/src/broker.ts (see research.md#L59 for leaveCurrentChannel signature)
- [x] T111 [US2] Implement DesktopAgent.broadcast() in packages/fdc3-broker/src/broker.ts (see research.md#L35 for broadcast signature, see plan.md#L531-L540 for OpenFin sync)
- [x] T112 [US2] Implement DesktopAgent.addContextListener() in packages/fdc3-broker/src/broker.ts (see research.md#L36 for addContextListener signature, add listener to current channel)
- [x] T113 [US2] Implement channel membership tracking in ChannelManager (track which tiles are on which channels, see data-model.md#L637-L676)

### Agent Hooks for US2

- [x] T114 [P] [US2] Create useContextListener hook in packages/fdc3-agent/src/hooks.ts (register context listener on mount, cleanup on unmount - see data-model.md#L420-L425)
- [x] T115 [P] [US2] Create useCurrentChannel hook in packages/fdc3-agent/src/hooks.ts (return current channel or null - see data-model.md#L427-L431)
- [x] T116 [P] [US2] Create useUserChannels hook in packages/fdc3-agent/src/hooks.ts (return array of user channels - see data-model.md#L433-L437)
- [x] T117 [US2] Export new hooks from packages/fdc3-agent/src/index.ts

### Tests for US2

- [x] T118 [P] [US2] Unit test for Channel class in packages/fdc3-broker/test/channel.test.ts (test broadcast, getCurrentContext, addContextListener, context type filtering)
- [x] T119 [P] [US2] Unit test for PrivateChannel class in packages/fdc3-broker/test/channel.test.ts (test that only tiles with reference can participate)
- [x] T120 [P] [US2] Unit test for ChannelManager in packages/fdc3-broker/test/channel-manager.test.ts (test createChannel, getChannel, getUserChannels, joinChannel, leaveChannel, broadcast)
- [x] T121 [P] [US2] Unit test for broker channel methods in packages/fdc3-broker/test/broker-channel.test.ts (test getOrCreateChannel, createPrivateChannel, getUserChannels, joinUserChannel, getCurrentChannel, leaveCurrentChannel, broadcast, addContextListener)
- [x] T122 [P] [US2] Unit test for useContextListener hook in packages/fdc3-agent/test/channel-hooks.test.ts (test listener registration, context type filtering, cleanup)
- [x] T123 [P] [US2] Unit test for useCurrentChannel hook in packages/fdc3-agent/test/channel-hooks.test.ts (test returns current channel or null)
- [x] T124 [P] [US2] Unit test for useUserChannels hook in packages/fdc3-agent/test/channel-hooks.test.ts (test returns array of user channels)
- [x] T125 [US2] Integration test for channel context sharing in packages/fdc3-broker/test/integration/channel.test.ts (test 3 tiles join same channel, broadcast context, verify all tiles receive context)

**Checkpoint**: Channel context sharing complete - tiles can join channels and broadcast context to each other

---

## Phase 6: User Story 3 - Cross-Platform Interoperability (Priority: P2)

**Goal**: Enable bidirectional intent routing with OpenFin apps when MFE platform runs in OpenFin environment (see spec.md#L72-L88)

**Independent Test**:

1. Run MFE platform in OpenFin with external Order Management app
2. From Chart tile in MFE, send "ViewOrder" intent with instrument context
3. External Order Management app should receive intent and display order details
4. From external Order Management app, send "ViewChart" intent to MFE
5. MFE Chart tile should receive intent and display chart
6. Channel operations should sync between MFE and OpenFin apps

**References**:

- OpenFin bridge architecture: plan.md#L247-L622
- Environment detection: research.md#L572-L587
- OpenFin bridge implementation: research.md#L589-L653

### Implementation for US3

- [ ] T131 [P] [US3] Create OpenFinBridge class in packages/fdc3-broker/src/openfin-bridge.ts (see plan.md#L349-L446 for OpenFinBridge implementation, implement raiseIntentExternal, subscribeToIntents, joinUserChannel, broadcast, getCurrentChannel, getUserChannels, subscribeToContext)
- [ ] T132 [US3] Implement subscribeToIntents() in OpenFinBridge (subscribe to OpenFin intents for all intent types that internal tiles can handle - see plan.md#L374-L394)
- [ ] T133 [US3] Implement raiseIntentExternal() in OpenFinBridge (delegate to fin.desktop.fdc3.raiseIntent - see plan.md#L399-L405)
- [ ] T134 [US3] Implement joinUserChannel() in OpenFinBridge (call fin.desktop.fdc3.joinUserChannel to sync with OpenFin - see plan.md#L410-L412)
- [ ] T135 [US3] Implement broadcast() in OpenFinBridge (call fin.desktop.fdc3.broadcast to sync with OpenFin - see plan.md#L417-L419)
- [ ] T136 [US3] Implement getCurrentChannel() in OpenFinBridge (call fin.desktop.fdc3.getCurrentChannel - see plan.md#L424-L426)
- [ ] T137 [US3] Implement getUserChannels() in OpenFinBridge (call fin.desktop.fdc3.getUserChannels - see plan.md#L431-L433)
- [ ] T138 [US3] Implement subscribeToContext() in OpenFinBridge (subscribe to OpenFin channel broadcasts - see plan.md#L438-L444)
- [ ] T139 [US3] Integrate OpenFin bridge with broker in packages/fdc3-broker/src/broker.ts (see plan.md#L451-L565 for broker integration, detect OpenFin environment, instantiate bridge if available, subscribe to external intents on init)
- [ ] T140 [US3] Update broker.raiseIntent() to route externally when no internal target (see plan.md#L484-L513 for bidirectional routing logic)
- [ ] T141 [US3] Update broker.joinUserChannel() to sync with OpenFin (see plan.md#L517-L526 for channel sync)
- [ ] T142 [US3] Update broker.broadcast() to sync with OpenFin (see plan.md#L531-L540 for broadcast sync)
- [ ] T143 [US3] Update broker.getUserChannels() to merge OpenFin channels (see plan.md#L545-L561 for channel merging)

### Tests for US3

- [ ] T144 [P] [US3] Unit test for OpenFinBridge in packages/fdc3-broker/test/openfin-bridge.test.ts (test subscribeToIntents, raiseIntentExternal, joinUserChannel, broadcast, getCurrentChannel, getUserChannels, subscribeToContext - mock fin object as shown in research.md#L587-L620)
- [ ] T145 [P] [US3] Unit test for environment detection in packages/fdc3-broker/test/environment.test.ts (test isOpenFinAvailable returns true when fin available, false otherwise)
- [ ] T146 [P] [US3] Unit test for broker bidirectional routing in packages/fdc3-broker/test/broker-openfin.test.ts (test routes internally when internal target exists, routes externally when no internal target, see plan.md#L602-L620 for test example)
- [ ] T147 [US3] Unit test for broker channel sync in packages/fdc3-broker/test/broker-openfin.test.ts (test joinUserChannel calls both internal and OpenFin, broadcast calls both internal and OpenFin)
- [ ] T148 [US3] Integration test for external intent routing in packages/fdc3-broker/test/integration/openfin.test.ts (test broker delegates to OpenFin when no internal target)

**Checkpoint**: OpenFin integration complete - MFE tiles can communicate bidirectionally with external OpenFin apps

---

## Phase 7: User Story 4 - Security and Entitlement Validation (Priority: P2)

**Goal**: Validate entitlements before allowing intent sends, intent receives, channel joins, and tile launches (see spec.md#L93-L107)

**Independent Test**:

1. Configure Tile A to only send "ViewChart" intents
2. Try to send "PlaceOrder" intent from Tile A → should be denied with error
3. Configure Tile B to only receive intents from specific tile types
4. Try to send intent from unauthorized tile → should be denied
5. Configure channel "premium" to require premium access
6. Try to join channel without entitlement → should fail with error
7. Verify all security violations are logged with audit trail

**References**:

- Entitlement validation interfaces: data-model.md#L284-L338 (BrokerCallbacks: onValidateEntitlements)
- Security requirements: spec.md#L214-L220 (FR-025 to FR-030)
- Validation pattern: research.md#L869-L918

### Implementation for US4

- [ ] T151 [P] [US4] Create EntitlementValidator class in packages/fdc3-broker/src/entitlements.ts (implement canSendIntent, canReceiveIntent, canJoinChannel, canOpenTile - see research.md#L875-L880 for interface)
- [ ] T152 [US4] Add entitlement validation to broker.raiseIntent() (validate sender entitlements before routing - see research.md#L887-L918 for validation pattern, check onValidateEntitlements callback)
- [ ] T153 [US4] Add entitlement validation to broker.addIntentListener() (validate receiver entitlements when tile registers intent listener - check if tile is entitled to receive that intent type)
- [ ] T154 [US4] Add entitlement validation to broker.joinUserChannel() (validate tile is entitled to join channel before allowing join)
- [ ] T155 [US4] Add entitlement validation to broker.open() (validate tile is entitled to be launched before calling onTileOpen callback)
- [ ] T156 [US4] Add security event logging in packages/fdc3-broker/src/broker.ts (log all entitlement violations with full audit trail - see research.md#L895-L901 for logging pattern)
- [ ] T157 [US4] Add error messages for entitlement failures (return appropriate error messages without exposing sensitive system details - see spec.md#L220 FR-030)
- [ ] T158 [US4] Implement onValidateEntitlements callback in base MFE (call existing entitlement service in apps/base/src/hooks/fdc3/config.ts - see quickstart.md#L169-L178 for callback example)

### Tests for US4

- [ ] T159 [P] [US4] Unit test for EntitlementValidator in packages/fdc3-broker/test/entitlements.test.ts (test canSendIntent, canReceiveIntent, canJoinChannel, canOpenTile return true/false based on entitlements)
- [ ] T160 [P] [US4] Unit test for broker entitlement validation in packages/fdc3-broker/test/broker-entitlements.test.ts (test raiseIntent denied when sender not entitled, test addIntentListener denied when receiver not entitled, test joinUserChannel denied when not entitled to channel, test open denied when not entitled to tile)
- [ ] T161 [P] [US4] Unit test for security event logging in packages/fdc3-broker/test/broker-entitlements.test.ts (test entitlement violations are logged with full audit trail)

**Checkpoint**: Entitlement validation complete - all FDC3 operations check user permissions before execution

---

## Phase 8: User Story 5 - Observability and Diagnostics (Priority: P3)

**Goal**: Provide structured logging, debug mode, and performance metrics for all FDC3 operations (see spec.md#L110-L125)

**Independent Test**:

1. Enable debug mode (set FEDERATION_DEBUG=true or enableDebug: true)
2. Perform intent send → verify detailed log entry with intent type, context, source, target, outcome
3. Join channel → verify log entry with channel ID, participating tiles
4. Disable debug mode → verify only info/warn/error logs appear
5. Perform slow operation (>100ms) → verify performance warning logged

**References**:

- Logger implementation: research.md#L790-L833
- Performance tracker: research.md#L838-L863
- Logging requirements: spec.md#L231-L238 (FR-035 to FR-039)

### Implementation for US5

- [ ] T171 [P] [US5] Add debug logging to broker intent operations in packages/fdc3-broker/src/broker.ts (log raiseIntent, findIntent, addIntentListener with full context - use Logger from T031)
- [ ] T172 [P] [US5] Add debug logging to broker channel operations in packages/fdc3-broker/src/broker.ts (log joinUserChannel, leaveCurrentChannel, broadcast with channel ID and participants)
- [ ] T173 [P] [US5] Add debug logging to IntentResolver in packages/fdc3-broker/src/intent-resolver.ts (log target resolution decisions, App Directory queries, entitlement filtering - see spec.md#L233 FR-037)
- [ ] T174 [P] [US5] Add performance tracking to broker operations in packages/fdc3-broker/src/broker.ts (track intent resolution time, channel broadcast time, log if >100ms - use PerformanceTracker from T034)
- [ ] T175 [US5] Implement DesktopAgent.getInfo() in packages/fdc3-broker/src/broker.ts (return ImplementationMetadata with version, provider name - see research.md#L54 for getInfo signature)
- [ ] T176 [US5] Add security event logging for entitlement violations in packages/fdc3-broker/src/broker.ts (already implemented in US4, verify logging works)

### Tests for US5

- [ ] T177 [P] [US5] Unit test for debug logging in packages/fdc3-broker/test/broker-logging.test.ts (test debug mode logs detailed information, test non-debug mode logs only info/warn/error)
- [ ] T178 [P] [US5] Unit test for performance tracking in packages/fdc3-broker/test/broker-logging.test.ts (test performance warnings logged for operations >100ms)
- [ ] T179 [P] [US5] Unit test for getInfo() in packages/fdc3-broker/test/broker.test.ts (test returns correct implementation metadata)

**Checkpoint**: Observability complete - all FDC3 operations are logged with detailed context and performance metrics

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T181 [P] Create comprehensive README for @fm/fdc3-broker (include installation, usage, API reference, examples, OpenFin integration - reference quickstart.md)
- [ ] T182 [P] Create comprehensive README for @fm/fdc3-agent (include getAgentApi, hooks usage, examples - reference quickstart.md#L283-L447)
- [ ] T183 [P] Create comprehensive README for @fm/fdc3-app-directory (include client API, mock service usage, examples)
- [ ] T184 [P] Create comprehensive README for @fm/fdc3-resolver-ui (include ResolverDialog, AppCard customization, accessibility features)
- [ ] T185 [P] Add TSDoc comments to all public APIs in packages/fdc3-broker/src/ (ensure all exported functions, classes, interfaces have TSDoc documentation)
- [ ] T186 [P] Add TSDoc comments to all public APIs in packages/fdc3-agent/src/
- [ ] T187 [P] Add TSDoc comments to all public APIs in packages/fdc3-app-directory/src/
- [ ] T188 [P] Add TSDoc comments to all public APIs in packages/fdc3-resolver-ui/src/
- [ ] T189 [P] Verify ESLint passes for all packages (run eslint, fix any errors)
- [ ] T190 [P] Verify TypeScript compilation for all packages (run tsc --noEmit, fix any type errors)
- [ ] T191 [P] Measure bundle sizes for all packages (run build, verify gzipped sizes: broker <200KB, agent <100KB, app-directory <50KB - see research.md#L714-L717)
- [ ] T192 [P] Verify test coverage meets >95% threshold (run vitest --coverage, check line coverage and condition coverage)
- [ ] T193 Run all integration tests end-to-end (broker + app directory, broker + resolver UI, broker + agent)
- [ ] T194 Run FDC3 conformance test suite (verify all DesktopAgent methods comply with FDC3 2.2 spec)
- [ ] T195 [P] Add error boundaries for broker and agent in apps/base (wrap BrokerProvider and agent providers with error boundaries)
- [ ] T196 [P] Create example tile component in apps/mf_tile/src/components/ExampleFDC3Tile.tsx (demonstrate intent send, intent listen, context broadcast, context listen, channel join - reference quickstart.md#L563-L705)
- [ ] T197 [P] Create example integration in apps/base (demonstrate broker configuration with all callbacks - reference quickstart.md#L128-L243)
- [ ] T198 Verify quickstart.md examples work (follow quickstart guide step-by-step, verify all code examples execute correctly)
- [ ] T199 [P] Performance optimization: enable code splitting for resolver UI (lazy load only when needed - see research.md#L719-L722)
- [ ] T200 [P] Performance optimization: code split OpenFin bridge (separate chunk, loaded only in OpenFin - see research.md#L721)
- [ ] T201 Update root package.json with workspace dependencies (verify all four packages are listed in workspaces)
- [ ] T202 Update turbo.json with build tasks for all four packages (ensure build pipeline includes packages/)
- [ ] T203 Verify Module Federation configuration for packages (ensure peer dependencies are configured correctly)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User Story 6 (App Directory) - Must be done before US1 (broker uses App Directory to resolve intents)
  - User Story 1 (Intent Resolution) - Can start after US6
  - User Story 2 (Channel Sharing) - Can start after US6, independent of US1
  - User Story 3 (OpenFin) - Can start after US1, US2 (builds on internal intent and channel operations)
  - User Story 4 (Security) - Can start after US1, US2 (adds validation to existing operations)
  - User Story 5 (Observability) - Can start after US1, US2 (adds logging to existing operations)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 6 (App Directory - P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **Must be completed before US1**
- **User Story 1 (Intent Resolution - P1)**: Depends on US6 completion - No dependencies on other stories
- **User Story 2 (Channel Sharing - P1)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (OpenFin - P2)**: Depends on US1 (intent resolution) and US2 (channel operations)
- **User Story 4 (Security - P2)**: Depends on US1 (intent operations) and US2 (channel operations)
- **User Story 5 (Observability - P3)**: Depends on US1 (intent operations) and US2 (channel operations)

### Critical Path (MVP - P1 Stories Only)

1. Phase 1: Setup (T001-T015)
2. Phase 2: Foundational (T021-T034)
3. Phase 3: User Story 6 - App Directory (T041-T053)
4. Phase 4: User Story 1 - Intent Resolution (T061-T097)
5. Phase 5: User Story 2 - Channel Sharing (T101-T125)
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Deploy/demo MVP (Internal intent resolution + Channel sharing + App Directory)

### Parallel Opportunities

**Within Phase 1 (Setup)**:

- T003-T006: All tsup configs can be created in parallel
- T007-T010: All vitest configs can be created in parallel
- T011-T014: All tsconfig, eslint, README files can be created in parallel

**Within Phase 2 (Foundational)**:

- T022-T030: All type definitions can be created in parallel (different files)

**Within User Story 6 (App Directory)**:

- T041-T042: Mock service and client implementation can be done in parallel
- T051-T052: Mock service and client unit tests can be written in parallel

**Within User Story 1 (Intent Resolution)**:

- T061-T063: IntentResolver, TileRegistry, IntentQueue can be implemented in parallel
- T072-T075: All resolver UI components can be implemented in parallel
- T078-T080: Agent API and hooks can be implemented in parallel
- T087-T089: IntentResolver, TileRegistry, IntentQueue unit tests can be written in parallel
- T092-T094: Resolver UI component tests can be written in parallel

**Within User Story 2 (Channel Sharing)**:

- T101-T102: Channel and PrivateChannel classes can be implemented in parallel
- T114-T116: All agent hooks can be implemented in parallel
- T118-T119: Channel and PrivateChannel unit tests can be written in parallel

**After Phase 2 (Multiple User Stories)**:

- US2 (Channel Sharing) can proceed in parallel with US1 (Intent Resolution) once US6 is complete
- With multiple developers: Developer A works on US1, Developer B works on US2 simultaneously

**Within Phase 9 (Polish)**:

- T181-T184: All README files can be written in parallel
- T185-T188: All TSDoc comments can be added in parallel
- T189-T192: All linting, type checking, coverage, bundle size checks can run in parallel

---

## Parallel Example: User Story 1 (Intent Resolution)

```bash
# Launch all resolver UI components together:
Task: "Create ResolverDialog component in packages/fdc3-resolver-ui/src/ResolverDialog.tsx"
Task: "Create AppCard component in packages/fdc3-resolver-ui/src/AppCard.tsx"
Task: "Create ContextPreview component in packages/fdc3-resolver-ui/src/ContextPreview.tsx"
Task: "Create useResolverKeyboard hook in packages/fdc3-resolver-ui/src/useResolverKeyboard.ts"

# Launch all broker core components together:
Task: "Create IntentResolver class in packages/fdc3-broker/src/intent-resolver.ts"
Task: "Create TileRegistry class in packages/fdc3-broker/src/tile-registry.ts"
Task: "Create IntentQueue class in packages/fdc3-broker/src/intent-queue.ts"

# Launch all agent hooks together:
Task: "Create AgentAPI class in packages/fdc3-agent/src/agent.ts"
Task: "Create useFDC3 hook in packages/fdc3-agent/src/hooks.ts"
Task: "Create useIntentListener hook in packages/fdc3-agent/src/hooks.ts"
```

---

## Implementation Strategy

### MVP First (P1 Stories Only - Recommended for Initial Delivery)

1. Complete Phase 1: Setup (T001-T015)
2. Complete Phase 2: Foundational (T021-T034) - **CRITICAL**
3. Complete Phase 3: User Story 6 - App Directory (T041-T053)
4. Complete Phase 4: User Story 1 - Intent Resolution (T061-T097)
5. Complete Phase 5: User Story 2 - Channel Sharing (T101-T125)
6. **STOP and VALIDATE**: Test all P1 stories independently
   - App Directory: Can query for apps by intent/context type
   - Intent Resolution: Tiles can send/receive intents with resolver UI
   - Channel Sharing: Tiles can join channels and broadcast context
7. Deploy/demo MVP (Internal MFE interoperability working end-to-end)
8. Gather feedback, iterate on P1 stories
9. Add P2 stories (OpenFin, Security) based on feedback
10. Add P3 stories (Observability) for production readiness

### Incremental Delivery (Full Feature)

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 6 (App Directory) → Test independently → **Deliver** (App discovery working)
3. Add User Story 1 (Intent Resolution) → Test independently → **Deliver** (Tiles can communicate via intents)
4. Add User Story 2 (Channel Sharing) → Test independently → **Deliver** (Tiles can share context via channels)
5. **Milestone**: MVP complete - Internal MFE interoperability fully functional
6. Add User Story 3 (OpenFin) → Test independently → **Deliver** (External interoperability working)
7. Add User Story 4 (Security) → Test independently → **Deliver** (Production-ready security)
8. Add User Story 5 (Observability) → Test independently → **Deliver** (Production-ready operations)
9. Polish & cross-cutting improvements → **Final Release**

### Parallel Team Strategy (With Multiple Developers)

With 3 developers:

1. **Team completes Setup + Foundational together** (T001-T034)
2. Once Foundational is done, split into parallel tracks:
   - **Developer A**: User Story 6 (App Directory) - T041-T053
   - **Developer B**: User Story 1 (Intent Resolution) - blocked until US6 done, then T061-T097
   - **Developer C**: User Story 2 (Channel Sharing) - T101-T125 (can proceed in parallel with US1)
3. After P1 stories complete:
   - **Developer A**: User Story 3 (OpenFin) - T131-T148
   - **Developer B**: User Story 4 (Security) - T151-T161
   - **Developer C**: User Story 5 (Observability) - T171-T179
4. All developers converge on Phase 9 (Polish) - T181-T203

---

## Notes

- **[P] tasks** = different files, no dependencies, can run in parallel
- **[Story] label** = maps task to specific user story for traceability
- **Each user story** should be independently completable and testable
- **Tests are included** per constitution requirements (>95% coverage threshold)
- **Commit after each task** or logical group (e.g., after completing all parallel tasks in a story)
- **Stop at any checkpoint** to validate story independently
- **Reference documents provided**: Each task includes references to research.md, data-model.md, plan.md, contracts/, spec.md for implementation guidance
- **Follow constitution**: All tasks adhere to constitution requirements (code quality, testing standards, UX consistency, performance, observability)

---

## Task Summary

- **Total Tasks**: 203
- **Setup (Phase 1)**: 15 tasks
- **Foundational (Phase 2)**: 14 tasks
- **User Story 6 - App Directory**: 13 tasks (3 implementation, 3 tests)
- **User Story 1 - Intent Resolution**: 37 tasks (16 implementation, 11 tests, 10 integration)
- **User Story 2 - Channel Sharing**: 25 tasks (13 implementation, 8 tests, 4 integration)
- **User Story 3 - OpenFin**: 18 tasks (13 implementation, 5 tests)
- **User Story 4 - Security**: 11 tasks (8 implementation, 3 tests)
- **User Story 5 - Observability**: 9 tasks (6 implementation, 3 tests)
- **Polish (Phase 9)**: 23 tasks

**MVP Scope (P1 Stories Only)**: 114 tasks (Setup + Foundational + US6 + US1 + US2)
**Full Feature Scope**: 203 tasks (all stories + polish)

**Parallel Opportunities**: 67 tasks marked with [P] can run in parallel within their phases

**Independent Test Criteria**: Each user story phase includes explicit test criteria for independent validation
