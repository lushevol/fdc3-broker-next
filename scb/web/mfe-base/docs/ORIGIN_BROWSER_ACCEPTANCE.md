# Built SystemJS browser acceptance

Verified on 9 October 2026 against the copied application's local proof host at
`http://localhost:8001` with Playwright Chromium.

```sh
PORTAL_URL=http://localhost:8001 npm run verify:browser
```

All seven scenarios passed with zero browser runtime exceptions and zero console
errors. The script verifies HTTP loading and SystemJS resolution of the emitted
Base artifact, and checks its lifecycle and retained Provider/Service namespaces
before exercising the UI. Development uses `/base/base.js`; production uses
`/base-production/base.js` from the production proof host at `/production-proof/`.
Both production scenarios use a matching production React runtime.

| Scenario | Result |
| --- | --- |
| `development-systemjs-journey` | Passed; no runtime or console errors |
| `responsive-profile-switches-320` | Passed; no runtime or console errors |
| `responsive-profile-switches-390` | Passed; no runtime or console errors |
| `responsive-profile-switches-768` | Passed; no runtime or console errors |
| `responsive-profile-switches-1440` | Passed; no runtime or console errors |
| `production-systemjs-webkit` | Passed; no runtime or console errors |
| `production-systemjs-legacy` | Passed; no runtime or console errors |

The development journey signs in with the local login fixture, opens New Tile,
launches an import-map fixture tile, verifies explicit light/dark and live
Legacy/WebKit appearance in the independent remote, checks saved authentication
and workspace state across switching, applies/resets the styling console, adds a
workspace, and removes the tile tab.

Responsive scenarios at 320, 390, 768, and 1440 pixels check compact menu text and
width, profile/portrait/artwork containment in both themes, no horizontal overflow,
and unchanged off-toggle track/thumb geometry and background across 12 hover
animation frames. Production verifies login and absent local development
controls in both WebKit and Legacy, plus a WebKit remote launch.

The proof host uses local API and SystemJS remote fixtures so the checks remain
reproducible without internal services. The fixture remote proves host appearance
forwarding; independently deployed business applications require their own
acceptance checks. Screenshots, all geometry samples, loaded artifact URLs, and
error records are saved in `/tmp/mfe-base-styled-browser/report.json` and the
neighboring PNG files. That directory is reproducible output, not committed
source.
