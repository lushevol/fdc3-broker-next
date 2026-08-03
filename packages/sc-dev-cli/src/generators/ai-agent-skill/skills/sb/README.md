# Service Bench Skills

Copilot skill files for Service Bench plugin UI development (LitElement + TypeScript + `@scdevkit`). Each skill is loaded on demand by the [SB Plugin UI Developer agent](../../agents/sb-plugin-ui/build/) and provides authoritative code patterns for a specific domain.

> Skills are located in [skills/sb-plugin-ui/](../sb-plugin-ui/).

## Skills

| Skill | Trigger keywords | What it covers |
|---|---|---|
| [sb-api-integration](../sb-plugin-ui/sb-api-integration/SKILL) | GraphQL, query, mutation, fetch data, load data, GRAPHQL_CLIENT, STORAGE_CLIENT, REST_CLIENT, SSE, file upload | GraphQL queries & mutations, file upload/download via Storage client, SSE streams via REST client, loading/error states |
| [sb-context-provider](../sb-plugin-ui/sb-context-provider/SKILL) | createContext, contexts.USER, contexts.NAVIGATION, contexts.LOCALE, contexts.AUTHZ, shell context, context consumer | Consuming Service Bench Shell contexts (user, navigation, locale, authz, view, event bus, etc.) in LitElement components |
| [sb-i18n](../sb-plugin-ui/sb-i18n/SKILL) | i18n, internationalisation, translations, locale, msg(), language file, zh-CN, Chinese, multi-language | Setting up locale-aware text with `createLocaleContext()` and `msg()`, language file structure, adding new languages |
| [sb-plugin-dev](../sb-plugin-ui/sb-plugin-dev/SKILL) | new page, new component, new route, fix bug, sc-data-grid, sc-column-layout, SbElement, GraphQL, vibe coding | Full feature development — page orchestrators, child components, routing, API wiring, event dispatching, code conventions |
| [sb-plugin-header](../sb-plugin-ui/sb-plugin-header/SKILL) | plugin header, headerDefinition, routes.json header, title, menu bar, menuItems, dropdown menu, showHeader | Configuring the plugin top navigation bar, menus, and per-route header overrides via `routes.json` |
| [sb-plugin-state](../sb-plugin-ui/sb-plugin-state/SKILL) | plugin state, plugin store, storeContext, contexts.STORE, createStore, cross-component state | Plugin-scoped global state store — creation, registration, consumption, and lifecycle |
| [sb-plugin-styling](../sb-plugin-ui/sb-plugin-styling/SKILL) | styles, CSS, rem, layout, color token, --sc-color, spacing, flexbox, SbElement, empty state | CSS units, design system color tokens, layout patterns, hover/loading/empty states |
| [sb-plugin-ut](../sb-plugin-ui/sb-plugin-ut/SKILL) | unit test, UT, jest, fixture, @open-wc/testing, coverage, mock GraphQL, mock context | Jest + `@open-wc/testing` tests for LitElement components — mocking, fixtures, coverage patterns |
| [sb-protect-plugin](../sb-plugin-ui/sb-protect-plugin/SKILL) | protect plugin, authorization, SC-IDP, authStoreId, sb-content-guard, secure route, role-based access | SC-IDP plugin access control, authorization store setup, route/menu/content protection |
| [sb-routing-navigation](../sb-plugin-ui/sb-routing-navigation/SKILL) | routes.json, new route, navigate, navigation.go(), path parameter, setPageTitle, defaultRoute | Route manifest (`routes.json`), in-plugin and cross-plugin navigation, URL params, browser title |

## Usage

Skills are automatically loaded by the [SB Plugin UI Developer agent](../../agents/sb-plugin-ui/build/build-ui.agent) when a matching task type is detected. You can also reference a skill directly:

```
@workspace /skills/sb/sb-api-integration/SKILL.md
How do I fetch data with GraphQL in my plugin?
```
