## ADDED Requirements

### Requirement: Preserve the SC token contract
Ratan SHALL preserve every required public `--sc-*` name and resolved value from the frozen GDS, styleguide, theme, typography, utility, and component assets and SHALL NOT replace them with a new namespace.

#### Scenario: Token snapshots are generated
- **WHEN** frozen and Ratan token values are compared for a supported mode
- **THEN** every required name and resolved value SHALL match exactly

### Requirement: Support frozen themes and font modes
Ratan MUST reproduce light, dark, CPBB, Inter, Roboto Mono, Dyslexic, follow-system, and every manifest-recorded typography or component mode.

#### Scenario: A fixture switches document-global mode
- **WHEN** the approved selector is applied to `html` or `body`
- **THEN** the Ratan fixture SHALL resolve the corresponding frozen token set

### Requirement: Isolate component styles
Ratan SHALL use static CSS Modules, cascade layers, stable Ratan `data-*` states, and scoped resets without global element selectors that alter tenant content.

#### Scenario: WebKit and Ratan coexist
- **WHEN** both systems render in one document with tenant CSS
- **THEN** neither system SHALL override the other's internal classes and Ratan resets SHALL NOT leak into tenant elements

### Requirement: Package CSS by subpath
Every component subpath MUST declare its required static CSS side effects, and root imports MUST NOT load DataGrid or unrelated component CSS.

#### Scenario: CSS bundle composition is inspected
- **WHEN** a consumer imports one component subpath
- **THEN** only shared foundations and that component's required CSS SHALL be included

### Requirement: Deliver local built-in icons and fonts
Built-in icon libraries and required font assets SHALL be packaged or internally hosted according to the frozen contract and MUST NOT cause public network requests.

#### Scenario: A fixture renders offline under CSP
- **WHEN** external network access is unavailable
- **THEN** icons, fonts, themes, and component visuals SHALL remain functional

