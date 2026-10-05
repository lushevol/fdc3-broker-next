# What The User Sees, From Opening The Portal To Logging Out

## Read This First

This is a walkthrough of the existing frontend in `scb/web/mfe-base-origin` and `scb/web/mfe-root-config-origin`, preserved in the EMS3 worktree.

**Evidence level: source-inspected.** The steps and screen outcomes below follow the exact frontend code. They have not been checked in a browser connected to the new EMS3 BFF. Passing the BFF tests proves its response and token behavior; it does not by itself prove that the existing screen removes old tiles correctly.

**The existing frontend is not connected to the new fork yet.** Its normal development `/api/auth/` requests go to the corporate development endpoint. Its production Nginx configuration sends them to the existing API gateway. The new service listens on a different port and has a different service name. That route needs to be set up before someone can experience the new BFF through this original portal.

Source: [development auth route](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-root-config-origin/webpack.config.js:54), [development target](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-root-config-origin/webpack.config.js:65), [production auth route](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-root-config-origin/nginx/mfe.conf:785), [production target](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-root-config-origin/nginx/mfe.conf:793).

The localhost proxy block does not change this: its URL match is `/api/au_th/`, not the `/api/auth/` URL used by the screen. See [that URL match](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-root-config-origin/webpack.config.js:72).

## 1. Open The Portal

### A. First Visit, With No Saved Login

1. The browser opens the portal HTML.
2. The HTML loads the import map. This map tells the browser where each frontend application lives.
3. The browser imports `@fm/root-config`. Root-config loads `@fm/base`, the portal shell.
4. The shell reads saved browser values. With no saved login token, it does not call the session-validation API.
5. The opening spinner goes away and the login page appears.

Exact code: [import map](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-root-config-origin/src/index.ejs:22), [root import](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-root-config-origin/src/index.ejs:36), [application import](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-root-config-origin/src/root.ts:14), [base application](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-root-config-origin/src/microfrontend-layout.html:3), [saved state](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/model/root.ts:133), [session check](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/routing/common/useController.ts:40), [screen selection](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/routing/index.tsx:15).

At this point, the frontend has not requested the user's tile permissions or read a tile database record. Those happen through the BFF after login or a saved-session check.

### B. Reopen Or Reload, With A Saved Login

1. The shell reads the saved token, user and workspaces.
2. The user sees an opening spinner while the frontend sends `POST /api/auth/v2/sso/validate` with `singleUIAuthorization` in the request body.
3. The BFF checks the login and gets current permissions. This is a fresh request; the browser's old workspace list is not the answer to what the user may see.
4. On success, the frontend takes the response's drawers, entities, entitlement token, user and authorization header.
5. Home opens. Saved workspaces are checked against the current returned tile list and entities. Allowed ones survive; rejected ones are removed.
6. If nothing survives, the user gets a new empty `Workspace 1` and its `Find tile` button.

Source: [saved workspaces](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/model/root.ts:125), [validate request](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/services/index.ts:31), [wait for validation](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/routing/common/useController.ts:41), [success handling](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/util/succes.response.handler.ts:19), [workspace check](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/useController.ts:195), [fallback workspace](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/common.ts:313).

### C. Saved Login Is Invalid Or Its Permission Check Fails

The validation helper returns `false` both when the response says the login is invalid and when the API throws an error. The page then clears the saved login and shows the login screen. It treats an EMS outage at this initial check the same way as an unsuccessful validation.

The error handler can set an outage message, but the subsequent clear operation resets the message. Therefore the existing code can leave the user at the login page without the reason for the outage. This is one of the screen gaps listed later.

Source: [validation failure result](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/services/index.ts:42), [clear after failure](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/routing/common/useController.ts:43), [clear resets the message](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/reducer/root0.reducers.ts:36).

## 2. Choose How To Log In

### Username And Password

In production, the ordinary username/password form is normally hidden. The user can show it with `?show_normal_login=Y` or `?show_normal_login=y`. Other supported environments show the form normally.

1. The user enters a username and password.
2. Clicking `Sign In`, or pressing Enter in either field, calls the same login function.
3. The username is trimmed. Empty credentials fail locally with `Enter valid login credentials.` No login API request is made.
4. Valid input starts the button's loading state and sends `POST /api/auth/v2/sso/login`.
5. A successful response is handled as described in section 3.
6. If authentication, the BFF or a selected entitlement provider fails, the page remains at login and shows `Login failed, please try again.` The loading state ends.

Source: [production form choice](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Login/common/useController.ts:78), [username input](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Login/index.tsx:69), [Sign In click](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Login/index.tsx:104), [Enter key](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Login/common/useController.ts:68), [input rules](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/auth/validation.ts:10), [local validation and loading](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Login/common/useController.ts:39), [v2 request](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/services/index.ts:15), [failure text](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Login/common/useController.ts:59).

The local validation also limits username length to 256 and password length to 4,096. It does not check whether the credentials are correct; that belongs to the server.

### Sign In With SSO: Entra

The checked-in `ENABLE_ENTRA_SSO` flag is enabled for local, development, UAT, pre-production and production. A URL flag can override it.

1. The user clicks `Sign In With SSO`.
2. The browser leaves the portal for the Microsoft login page. The tenant and client IDs depend on the environment.
3. The user completes the external login. Any external MFA prompts occur in that login system.
4. The external system returns the browser to `/mfa/callback?code=...`.
5. The portal reads the code automatically. If it has a code and no `iss` or `client_id`, it sends `POST /api/auth/v3/sso/login`.
6. A successful response goes through the common success path.
7. If that request fails, the portal login page shows `Login failed, please try again.`

Source: [SSO button](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Login/index.tsx:121), [flag values](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/feature-flags.json:2), [URL flag override](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/featureFlagController.ts:23), [Entra link](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/common.ts:172), [callback code](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Login/common/useController.ts:23), [automatic callback login](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Login/common/useController.ts:33), [v3 choice](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Login/common/useController.ts:51).

If SSO returns no usable code, this code does not start an automatic login. It also does not read an SSO `error` query parameter to show a special cancellation message. The external login screen's own behavior is outside this source trace.

### Sign In With SSO: OneMFA

1. With the Entra flag disabled, the same SSO button sends the user to the OneMFA authorization URL.
2. The user completes the external login/MFA process.
3. The portal reads the returned `code`, `iss` and `client_id`.
4. When `iss` or `client_id` is present, the portal sends the compatible v2 login request.
5. The success and failure screen behavior is otherwise the same as above.

Source: [SSO system selection](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/common.ts:136), [OneMFA URLs](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/common.ts:146), [callback fields](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Login/common/useController.ts:25), [legacy v2 choice](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Login/common/useController.ts:57).

### OpenFin Token In The URL

This special path is enabled only when the environment is local or development and `window.fin` exists.

1. The frontend reads `openfintoken` from the URL.
2. It checks that the value is nonblank, no more than 8,192 characters and has no control characters. This is a shape check, not proof that the token is signed or valid.
3. For a value that passes, it saves the token, waits one second, removes the parameter by navigating again, and then follows the saved-session validation path.
4. For an invalid value it sets `Invalid authentication token.` and runs the normal session check.

Source: [OpenFin environment choice](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/routing/common/useController.ts:68), [token flow](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/routing/common/useController.ts:49), [input rules](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/auth/validation.ts:3).

## 3. What A Successful Login Response Does

The frontend uses the same response handler for v2 login, v3 login, validation, background extension and relogin.

| Response part | What the frontend does | Exact code |
| --- | --- | --- |
| `drawers` | Saves the list of categories and tile cards in memory, if the array is nonempty | [drawer handler](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/login.ts:100) |
| `entities` | Saves the permission entities in memory, including an empty array | [entity handler](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/login.ts:89) |
| `entitlementsToken` | Saves the signed permission token in memory | [entitlement token handler](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/login.ts:133) |
| `userInfo` | Parses the user; decodes named permissions from the entitlement token; saves the user in memory and local/session storage | [user handler](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/login.ts:67), [saved user](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/login.ts:50) |
| `Single-UI-Authorization` header | Saves the login token; decodes its issue/expiry time for session timers | [auth header](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/login.ts:53), [saved token](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/login.ts:15) |

The call order is drawers, entities, entitlement token, user, authorization token. See [the common success handler](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/util/succes.response.handler.ts:22).

The screen then decides between Home and Login using `token && entities`. In JavaScript an empty array is still true in this check. Therefore `entities: []` alone does not keep the user at the login page. See [the screen choice](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/routing/index.tsx:15).

### The No-Permissions Difference Between Login Types

On an SSO callback with `?code=...`, Home runs an extra check. It compares returned entity names with entity names attached to the returned drawer tiles. If none match, it clears the login and shows `No entitlements found.` It also removes the callback query from the URL.

Username/password login does not run that extra check. A successful response with an authorization token and `entities: []` can therefore open Home. On a clean visit the menu will contain only whatever the BFF returned, which can include template tiles under the existing rules.

This difference is existing frontend behavior, not an EMS3-specific rule.

Source: [callback-only check](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/useController.ts:77), [entity-name comparison and logout](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/login.ts:143), [entity names collected from tiles](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/entities.ts:3).

## 4. From Permission Response To A Tile On Screen

The BFF chooses the permitted tiles. The normal New Tile menu renders its returned list. It does not call EMS2 or EMS3 itself and it does not run a new permission check when a user clicks New Tile.

For a concrete example, the small POC fixture contains production tile ID 54, `Trade Blotter`, with subject `RATAN_TRADE_BLOTTER`. That record is visible at [the tile fixture](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/poc/ems3-functions/fixtures/tiles.json:58). The primary database analysis explains when that record is selected by the BFF. The frontend steps after it is returned are:

1. The successful login/validation response includes the Trade Blotter card in a drawer category.
2. The drawer handler saves that category list.
3. Home appears. A new user initially sees an empty workspace, not all the available application panels opened at once.
4. The user clicks `New Tile` in the top bar, or `Find tile` in the empty workspace.
5. A drawer opens from the right with the heading `Tile Options`.
6. The menu prints each returned category label and each returned tile title/subtitle/image.
7. The user clicks Trade Blotter.
8. The frontend copies the tile's container, module, tile route, parameters and title into a workspace.
9. If the selected workspace was empty, the tile occupies it. If it already had a tile, a new workspace/tab is created.
10. The drawer closes.
11. The tile area shows a loading splash while SystemJS imports the named container application.
12. The imported application receives the module, tile route and parameters and renders its own screen.

Source: [New Tile click](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/NewTile/index.tsx:33), [Find tile click](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Empty/index.tsx:17), [drawer opens](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Drawer/index.tsx:19), [category list](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Drawer/Menu.tsx:13), [card title](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Drawer/MenuItem.tsx:12), [copied tile fields](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Drawer/common/MenuItem.useController.ts:11), [workspace selection](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/AppBar/common/useController.ts:36), [import and loading splash](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/Container.tsx:11), [application props](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/Container.tsx:26).

### Other Outcomes At This Step

| Condition | What the user sees |
| --- | --- |
| BFF does not return Trade Blotter | No Trade Blotter card to click in the current returned menu |
| BFF returns a disabled tile | Card is visible but greyed out; card/button cannot open it |
| Returned category has zero tiles | Category label can still render because the frontend maps the response as supplied |
| Returned drawer list is empty on a clean page | No category/tile cards; the existing drawer has no separate no-permissions explanation |
| Returned drawer list becomes empty later | Existing code can keep the old list, because it ignores an empty array; see gap 1 |
| Container is `@fm/base` | The tile loads the shell's internal Admin module |
| Import map lacks the container or its file is unavailable | The tile panel shows `There is a problem in this Tile.` and, where configured, `Contact PSS` |
| Container loads but its own data API fails | This is an application/API failure after opening; entitlement success does not prove its business data APIs work |

Source: [disabled card](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Tile/index.tsx:15), [disabled button](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Tile/index.tsx:26), [internal Admin module](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/Container.tsx:17), [tile error boundary](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/ErrorBoundry/index.tsx:24), [visible tile error](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/FallbackError/index.tsx:17).

There is no search field in this original New Tile drawer. The search-shaped New Tile icon opens the drawer; the drawer menu directly renders categories and tiles. Do not interpret it as an implemented search operation.

## 5. Saved Workspaces And Already Open Tiles

The portal saves workspace changes in local and session storage. It keeps those workspace records when the user logs out, so it can try to restore them on the next login.

At Home startup it checks each saved workspace:

| Saved workspace | Startup result |
| --- | --- |
| Empty workspace | Keep it |
| Its container/module/tile tuple is no longer in the returned menu | Remove it |
| Its tile is a template | Keep it |
| Its tile has a matching entity and subject | Keep it, subject to the multiple-role issue below |
| Its tile lacks a matching entity or subject | Remove it |
| No workspaces survive | Create empty `Workspace 1` |

Source: [workspace persistence](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/reducer/workspaces.reducers.ts:8), [startup filtering](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/common.ts:294), [tuple lookup](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/drawer.ts:21), [entity/subject check](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/common.ts:261).

The browser check accepts subject `name` or `longName`. It selects the first matching entity record. If a user has two roles for the same entity and the needed subject exists only in the second role, this startup check can reject a tile that the BFF correctly returned. This requires a browser correction before multi-role saved-workspace parity can be claimed.

This cleanup runs when Home becomes ready. It does not automatically run every time the user's permissions change during a background extension or relogin. Therefore a permitted tile that was already open can stay on screen after its card is removed from the menu. The BFF's new response and the existing open panel are separate pieces of state.

Source: [first matching entity](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/common.ts:267), [that entity's subjects](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/common.ts:271), [cleanup effect depends only on ready](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/useController.ts:195).

### Closing, Switching Or Refreshing A Tab

- Switching tabs selects the workspace and clears the current error message.
- Removing a tab removes its workspace and saves the remaining list. The remove control is shown only when more than one workspace exists.
- The tab's refresh control calls the application's registered refresh callback. It is not a fresh portal permission lookup.

Source: [select workspace](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/useController.ts:32), [remove workspace](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/useController.ts:145), [remove visibility](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/index.tsx:123), [application refresh callback](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/util.ts:21).

## 6. While The User Keeps Working

### More Saved-Workspace Differences

A permitted blank-subject tile can fail restoration. For example, an assigned
Ratan user can open tile 193, Exception Auto Recover, because the BFF requires
only its matching entity. On reopening, `validateTile` requires a truthy subject
before checking anything, so this saved panel can disappear even while its
menu entry remains available. Templates have a separate restore bypass.

Restoration also compares subject name/path with exact case. The BFF menu filter
ignores subject case, so a case variant can be offered in the menu but removed
from saved workspaces. Its legacy `entity === "X_RATANONE"` fallback does not
match the ordinary array-valued entity field returned in BFF drawers.

Source: [restore subject guard and comparisons](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/common.ts:266),
[template restore bypass](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/common.ts:305).

The session timers use the expiry time from the login token. They are not hard-coded to one fixed duration in this frontend.

### User Moves The Mouse

1. Mouse movement resets a five-second timer.
2. Five seconds after the last movement, the frontend tries `POST /api/auth/v2/sso/extend` with its login token.
3. It skips the call if logout is in progress or fewer than 25 seconds remain before expiry.
4. The background call does not show the full-page loading overlay.
5. On success, the access token and expiry update. This endpoint does not return
   replacement drawers, entities or an entitlement token; the existing menu and
   entitlement token remain.
6. On failure, the error handler can show an alert. The extension helper logs the failure. It does not clear old menu cards, panels or tokens merely because the response is `503`.

Source: [mouse timer](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/useController.ts:56), [skip rule and extend request](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/util/extend.ts:16), [no full-page loader for extend](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/util/success.request.handler.ts:32), [failure catch](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/util/extend.ts:29).

### Twenty-Five Seconds Before Expiry

The frontend requests `POST /api/auth/v2/sso/refreshtoken`. The response's `Single-UI-Refresh` header is saved for the later Extend button. The refresh-token response handler saves that header; it does not apply drawers/entities from this endpoint.

Source: [refresh timing](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/useController.ts:95), [refresh request](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/index.ts:16), [header handling](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/util/succes.response.handler.ts:28), [saved refresh token](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/login.ts:119).

If this request fails, the frontend shows the ordinary API alert and logs the failure. It has no special screen explaining that session renewal is unavailable. If there is no refresh token, the timeout popup's refresh-token-based automatic logout timer is not installed.

### At Expiry: Extend Or Logout Popup

The user sees `Your session has been expired` and `Do you want to logout or extend the session?` with two buttons.

| User action/result | Current code behavior |
| --- | --- |
| Click Extend | Send `POST /api/auth/v2/sso/relogin` with `Single-UI-Refresh` header |
| Relogin succeeds | Apply the fresh menu/entities/token through the common success handler |
| Relogin fails | Ordinary error alert; old state can remain |
| Click Logout | Wait one second, call logout, close popup |
| Refresh token approaches expiry | Automatically call logout, two seconds before that token's expiry |
| No refresh token exists | No automatic logout timer is installed by the popup |

There is a timing bug in the existing Extend button: `relogin()` does not return its request promise. The popup's `await relogin()` therefore does not wait for the request. It clears its timer and closes immediately, even if the request later fails.

Source: [popup text/buttons](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Timeout/index.tsx:21), [Extend button action](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Timeout/common/useController.ts:58), [relogin without returning promise](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/index.ts:35), [refresh header](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/util/success.request.handler.ts:18), [automatic logout timer](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Timeout/common/useController.ts:29).

## 7. Logout, Then Another Login

1. The user clicks their avatar and `Logout`.
2. The portal shows its logout-confirmation dialog.
3. Confirming logout starts the logout flow; cancelling closes that dialog.
4. The frontend sends v2 SSO logout with the login token and also tries SSI logout.
5. It clears its local login immediately, without waiting for both remote requests to succeed.
6. The user sees the login page. A failure from a URL containing `/logout` does not produce the normal API error alert.
7. The workspace list stays saved. The next Home startup tries to filter and restore it.

Source: [avatar Logout](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Avatar/index.tsx:76), [confirmation opens](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Avatar/common/useController.ts:22), [confirm/cancel](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Survey/common/useController.ts:21), [logout requests and immediate local clear](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/services/index.ts:19), [storage keys cleared](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/common.ts:73), [logout errors excluded](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/util/error.response.handler.ts:8).

However, the reducer does not clear in-memory `drawers`, `entities`, `entitlementsToken` or workspaces on logout. The screen hides Home because its token is gone. If another user logs in without reloading the page and the new response has an empty drawer array, the old menu can survive. This needs to be fixed; hiding Home during logout is not proof that all old permission state has been removed.

Source: [actual CLEAR fields](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/reducer/root0.reducers.ts:36).

## 8. Opening A Tile From Somewhere Else

### FDC3/OpenFin Request

A supported external intent can ask the portal to open a trade, cashflow or general target tile. The helper looks in the current drawer list for the requested tile route. If no matching tile exists, it creates no workspace and shows `Tile ... is unauthorized or does not exist`.

This check depends on the current in-memory drawer list. The stale-menu issues described here therefore also matter for external tile requests.

Source: [external intent handling](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/useOpenfin.ts:50), [current drawer lookup](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/dispathcer/index.ts:168), [unauthorized message](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/dispathcer/index.ts:179).

### Tile Parameters In The Page URL

There is a `useParameters` helper that could read `container`, `module`, `tile` and `parameters` from the page URL. But the production Home component does not call it. The references that call it are in its tests. Therefore this walkthrough does not claim that a URL containing those parameters opens a tile in the current production component.

Source: [helper](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/useParameters.ts:96), [production Home imports](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/index.tsx:1), [test invocation](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/index.test.tsx:103).

## 9. Failure Screen Summary

This table describes the existing frontend's handling when the BFF or network returns a failure. For malformed or partial EMS3 responses, the strict BFF converts the failed authorization attempt to a failed API response; the browser only sees that response.

| When the failure happens | Visible result | Old permission state removed? |
| --- | --- | --- |
| First password/SSO login | Login page; generic `Login failed, please try again.` | No new token/menu from a failed request; old in-memory state is not explicitly cleared by the login catch |
| Saved-token validation on opening page | Login page after local clear | Auth token/user cleared; permission fields remain in memory, although Home is hidden |
| Background extend | Error alert on the current screen | No, unless error text includes the special expiry marker |
| Automatic refresh-token request | Error alert on the current screen | No general clearing rule |
| Click Extend in timeout popup | Popup closes before request completes; error alert if it fails | No general clearing rule |
| Any API error containing `TOKEN_INVALID_EXPIRED` | Clear login; message becomes `Expired Session, please login again.` | Same incomplete CLEAR behavior |
| Ordinary business API failure after tile opens | Error alert or application's own handling | No general logout rule |
| Container import/render failure | Tile error panel | No logout; other tabs may remain usable |
| Logout request fails | Login page because local clear already happened | Same incomplete CLEAR behavior; logout errors suppressed |

Source: [shared error handler](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/util/error.response.handler.ts:6), [error-message fallback](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/util/error.response.handler.ts:20), [expiry marker](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/util/error.response.handler.ts:29), [screen error alert](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/routing/index.tsx:32).

The shared Axios client has a 60-second timeout. Network errors and HTTP errors enter the same error handler. See [the client setup](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/config.ts:15).

## 10. Ten Screen Gaps, With Concrete User Sequences

These are source-inspected issues or unconnected paths. They are not claims of browser executions. They explain why a successful backend test is insufficient for the final statement, "the user sees everything the same and loses access strictly when the provider fails."

### Gap 1: An Empty New Menu Can Leave The Old Menu

- Before: Alice has Trade Blotter in her current menu.
- Change: Her grants are removed and a successful permission recheck returns `drawers: []`.
- After, current code: `handleDrawers` ignores the empty array. Alice can still see the old menu cards.
- Needed for strict behavior: Apply an empty array as the new menu, then check open workspaces against it.

Source: [nonempty-array guard](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/login.ts:101).

### Gap 2: Removed Grants Do Not Close Already Open Panels During Renewal

- Before: Alice has Trade Blotter open and another permitted card in the menu.
- Change: A successful extension removes Trade Blotter from the returned menu but leaves another tile.
- After, current code: The nonempty menu updates. Her already open Trade Blotter panel stays because workspace cleanup is not rerun.
- Needed: Recheck open workspaces when the permission/menu response changes. Downstream API enforcement must also continue to protect access.

Source: [cleanup effect and dependency](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/useController.ts:195).

### Gap 3: Permission Provider Failure During Renewal Leaves Old State

- Before: Alice is logged in and can open a tile.
- Change: Her selected EMS3 provider times out during background extension; the BFF returns `503` and issues no new tokens.
- After, current code: Alice sees an error alert but old menu cards, open panels and tokens remain in memory.
- Needed: Explicitly decide and implement the required blocked screen on failed authorization rechecks. BFF denial of new tokens does not revoke previously issued tokens automatically.

Source: [shared error handler](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/util/error.response.handler.ts:29), [extension failure catch](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/service/util/extend.ts:29).

### Gap 4: Logout Does Not Remove All In-Memory Permission State

- Before: Alice has privileged menu cards.
- Action: Alice logs out. Bob logs in on the same page without a full reload.
- Change: Bob's successful response has zero drawer categories.
- After, current code: Alice's old drawers survive CLEAR and Bob's empty response does not replace them. His screen can show her old cards.
- Needed: Clear every user permission/token field on logout and always apply the new drawer list.

Source: [CLEAR fields](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/reducer/root0.reducers.ts:36), [empty response ignored](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/login.ts:101).

### Gap 5: No-Grants Users See Different Outcomes By Login Method

- Before: Two synthetic test users have the same zero effective grants.
- Action: One uses a code-based SSO callback; the other uses username/password.
- After, current code: The SSO user can be logged out with `No entitlements found.` The password user can reach Home with an empty entity array and the returned template menu.
- Needed: One explicit no-grants screen policy shared by the login paths.

Source: [SSO-only extra check](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/useController.ts:78), [Home accepts an empty array](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/routing/index.tsx:15).

### Gap 6: A Subject From A Second Role Can Lose Its Saved Workspace

- Before: Alice's saved Trade Blotter workspace is allowed through her second role for the same entity.
- Action: She reloads; the BFF returns both roles and the permitted card.
- After, current code: The saved-workspace checker reads only the first matching entity's subjects and can remove the panel. The menu card may still exist and be clickable.
- Needed: Check all matching roles/entities when restoring a workspace.

Source: [first entity selection](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/common.ts:267).

### Gap 7: Reopening During An Outage Can Hide The Reason

- Before: Alice has a saved login.
- Action: She reloads while EMS3 is unavailable.
- After, current code: Validation fails, an error can be set, then CLEAR removes the error. She lands at login without a lasting outage explanation.
- Needed: Preserve the failed-session reason when showing login or a blocked screen.

Source: [clear after failed session check](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/routing/common/useController.ts:43), [error cleared](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/hooks/reducer/root0.reducers.ts:43).

### Gap 8: The Existing Portal Route Has Not Been Switched To The Fork

- Before: The new EMS3 fork passes local integration tests.
- Action: A developer opens the original portal and clicks Sign In using its unchanged proxy.
- After, current configuration: The request goes to the existing remote route, not this fork. That click is not an EMS3-fork browser test.
- Needed: A separate local/demo route and, later, an approved deployment route for `single-ui-bff-ems3`.

Source: [normal local auth proxy](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-root-config-origin/webpack.config.js:54), [its target](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-root-config-origin/webpack.config.js:65).

### Gap 9: A Tile URL Helper Exists But Is Not Connected To Home

- Before: A tester expects `?container=...&module=...&tile=...` to open a tile.
- Action: They open that URL in the production Home component.
- After, inspected code: Home does not call the helper that reads those fields. There is no connected path proving the tile opens.
- Needed: Define whether this path belongs in the supported user journeys, then wire it and test it if required.

Source: [URL helper](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/useParameters.ts:96), [Home](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/index.tsx:1).

### Gap 10: Logout In One Browser Tab Does Not Clear Another Tab Immediately

- Before: Alice has the portal open in tabs A and B.
- Action: Alice logs out in A; the local-storage token is removed.
- After, current code: B's storage listener handles only theme changes. Its in-memory login/menu remains until a later request or other event changes it.
- Needed: Handle logout/token removal across tabs, and test the intended timing of the second tab's blocked state.

Source: [storage listener handles only theme](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/routing/common/useController.ts:29).

The timeout Extend promise issue described in section 6 is another concrete failure-path problem to verify when the browser is connected.

## 11. What Is And Is Not Proved By This Appendix

This appendix proves, by source inspection, which existing frontend functions a user's click reaches and which response fields they use. It identifies the predicted visible outcomes and the gaps that could make those outcomes differ from the BFF's permission decision.

It does not prove the corporate SSO page, the live EMS3 API, every application's own rendering/data requests, import-map availability, or the browser result after wiring to the fork. No real user-role assignment source was supplied, so actual people's tile lists cannot be inferred here; the accompanying backend/database scenarios use synthetic account assignments.

For the BFF request path, schema, provider selection and database evidence, see [BFF integration details](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/docs/ems3-bff-integration.md).
