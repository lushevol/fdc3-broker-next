# FMO Post Trade Portal - Cashflow Blotter

## Design System Analysis Blueprint

**Source:** `original-websites/cashflowblotter-light/index.html`
**Generated:** 2026-03-09

---

## 1. Overall Page Layout

**Layout Type:** Enterprise Single-Page Application (SPA) with fixed header and scrollable content area.

**High-Level Structure:**

- **Fixed Header (App Bar):** 48px height, permanently visible at top
- **Workspace Tabs Bar:** Below header, horizontal tab navigation
- **Page Header:** Version info and action buttons
- **Search Section:** Collapsible search/filter panel
- **Data Grid:** Full-width AG Grid table (primary content area)
- **Footer Actions:** Row of action buttons below grid

**Layout Arrangement:**

- Uses flexbox column layout for vertical stacking
- Header uses `position: fixed` with body padding compensation
- Grid area uses CSS Grid with flexible height to fill remaining viewport
- Search section is collapsible with a divider toggle

---

## 2. Major Blocks / Sections

### Section A: App Bar (Header)

**Purpose:** Primary navigation, branding, and user controls. Always visible.

**Components:**
| Component | Description |
|-----------|-------------|
| Logo/Title Area | "FMO Post Trade Portal" text branding |
| New Tile Button | Quick action to add new workspace tiles (search icon + text) |
| Theme Toggle | Light/Dark mode switch with sun icon |
| Time Display | UTC time with toggle switch (e.g., "01:49 UTC") |
| User Avatar | Circular avatar with initials, dropdown trigger for profiles |
| Feedback Button | Icon button (RateReview icon) for user feedback/survey |

### Section B: Workspace Tabs

**Purpose:** Multi-workspace navigation allowing users to manage multiple views.

**Components:**
| Component | Description |
|-----------|-------------|
| Tab Items | Editable tab labels (currently "Cashflow Blotter") |
| Add Tab Button | "+" button to create new workspaces |
| Tab Indicator | Animated underline for active tab |

### Section C: Page Header

**Purpose:** Context information and page-level actions.

**Components:**
| Component | Description |
|-----------|-------------|
| Version Badge | Displays "Version: 1.40.0-v1.40.0-20260227.4" and "Env: UAT" |
| API Status Button | Outlined button with Adjust icon and status indicator |
| Refresh Page Button | Outlined button with Refresh icon |

### Section D: Search Section (Collapsible)

**Purpose:** Complex filtering interface for querying cashflow data.

#### D1: Quick Search Panel (Left - 75% width)

**Purpose:** Primary search inputs for common queries.

**Form Fields (Grid Layout - 2 columns):**

| Field                        | Type                | Notes                                               |
| ---------------------------- | ------------------- | --------------------------------------------------- |
| Cashflow ID                  | Text Input          | Multi-value support (comma-separated), clear button |
| Trade ID                     | Text Input          | Dropdown label selector for dynamic field switching |
| Value Date Range             | Date Range Picker   | Start/End date inputs with calendar popup           |
| Currency                     | Autocomplete Select | Searchable dropdown with type-ahead                 |
| Product Taxonomy             | Multi-Select        | Tag-based multiple selection                        |
| Counterparty FMCODE          | Text Input          | Multi-value support (comma-separated)               |
| SCB Booking Entity           | Select Dropdown     | Single selection with search                        |
| Beneficiary Name             | Text Input          | Free text entry                                     |
| Beneficiary Account BIC Code | Text Input          | Free text entry                                     |
| Amount Range (Is)            | Number Input        | Numeric filter with placeholder                     |

**Action Buttons:**

- **Clear Filters** - Outlined secondary, disabled when no filters applied
- **Search** - Contained primary, disabled when no input provided

#### D2: Preset Query Panel (Right - 25% width)

**Purpose:** Quick-access predefined queries with counts.

**Structure:**

```
┌─────────────────────────────┐
│ Value Today                 │
│ ─────────────────────────── │
│ Pending Operator      [1]   │  ← Warning badge (orange)
│ Pending Verification  [0]   │  ← Primary badge (blue)
├─────────────────────────────┤
│ Value till Monday           │
│ ─────────────────────────── │
│ Pending Operator     [21]   │  ← Warning badge (orange)
│ Pending Verification [0]    │  ← Primary badge (blue)
└─────────────────────────────┘
```

**Components:**
| Component | Description |
|-----------|-------------|
| Section Title | "Value Today", "Value till Monday" |
| Query Buttons | Text buttons with count badges |
| Badge (Warning) | Orange background for pending items requiring action |
| Badge (Primary) | Blue background for informational counts |

#### D3: Custom Search/View Panel

**Purpose:** Save and load custom filter configurations.

**Components:**
| Component | Description |
|-----------|-------------|
| Filters Dropdown | Select saved filter sets |
| Clear Button | Reset filters (outlined, disabled when no selection) |
| Create or Modify Button | Open filter builder (contained primary) |
| Views Dropdown | Select saved column views |
| View Management Buttons | Clear and Create/Modify for views |

#### D4: Hide Search Bar Toggle

**Purpose:** Collapsible divider to show/hide search section.

**Component:** Text button with double-arrow-up icon "Hide Search Bar"

### Section E: Quick Filters Bar

**Purpose:** Rapid-access filter dropdowns for common filters, always visible below search section.

**Filter Dropdowns (Horizontal Layout):**

| Filter             | Type         | Description             |
| ------------------ | ------------ | ----------------------- |
| Value Date Horizon | Autocomplete | Date range quick filter |
| Product Taxonomy   | Autocomplete | Product category filter |
| NSTP Exception     | Autocomplete | Exception status filter |
| Booking Entity     | Autocomplete | Entity selection        |
| Cashflow Status    | Autocomplete | Status filter           |

### Section F: Data Grid (AG Grid)

**Purpose:** Primary data display with sortable, filterable columns.

**Grid Features:**

- **Pinned Left Column:** Row selection checkbox (42px width)
- **Column Headers:** Sortable, resizable, filterable with menu
- **Column Menu:** Dropdown per column for sort/filter operations
- **Horizontal Scroll:** For 157 columns total
- **Vertical Scroll:** For data rows
- **Sort Indicators:** Ascending/descending icons in headers
- **Filter Indicators:** Funnel icon when column has filter applied

**Key Columns (first 8):**

| Column                        | Width  | Type      | Sortable |
| ----------------------------- | ------ | --------- | -------- |
| Select (checkbox)             | 42px   | Selection | No       |
| Cashflow ID                   | 130px  | Text      | Yes      |
| Cashflow Version              | 90px   | Text      | Yes      |
| Cashflow Major Version        | 90px   | Number    | Yes      |
| Cashflow Minor Version        | 80px   | Number    | Yes      |
| Cashflow Affirmation Status   | 115px  | Status    | Yes      |
| Cashflow Sub State Type       | 130px  | Status    | Yes      |
| ... (150+ additional columns) | varies | varies    | Yes      |

### Section G: Grid Footer Actions

**Purpose:** Bulk actions and data export.

**Components:**
| Button | Icon | Action |
|--------|------|--------|
| Resize | column-width | Auto-resize columns to fit content |
| Export File | file-excel | Export grid data to Excel file |

### Section H: Alert Banner

**Purpose:** Inform users of data limitations.

**Alert Message:** "If more than 1000 records are loaded, column filters below will be applied only within the first 1000 records."

**Components:**
| Component | Description |
|-----------|-------------|
| Alert Container | MUI Alert with info styling |
| Close Button | Icon button to dismiss alert |
| Divider | Vertical separator |
| Filter Tags | Applied filter display area |

---

## 3. Components & UI Elements

### 3.1 Buttons

| Variant            | Usage             | Styling                                | Examples                                        |
| ------------------ | ----------------- | -------------------------------------- | ----------------------------------------------- |
| Contained Primary  | Primary actions   | Solid blue background, white text      | Search, Create or Modify                        |
| Outlined Primary   | Secondary actions | Blue border, blue text, transparent bg | Clear, Export File, Resize, API Status, Refresh |
| Text Primary       | Tertiary actions  | No border, blue text                   | Preset query buttons                            |
| Icon Button        | Compact actions   | Circular, minimal padding              | Avatar, Feedback, Close                         |
| Icon + Text Button | Labeled actions   | Icon left, text right                  | New Tile, Resize, Export                        |

**Button Sizes:**

- `small` - Compact actions in dense areas (14px icon)
- `medium` - Default actions (14px icon)

### 3.2 Input Fields

| Type              | Component Library            | Features                                         |
| ----------------- | ---------------------------- | ------------------------------------------------ |
| Text Input        | Ant Design Input             | Clear button (X), placeholder text, suffix icons |
| Number Input      | Ant Design InputNumber       | Step controls, placeholder, numeric validation   |
| Single Select     | Ant Design Select            | Searchable, dropdown arrow, clear option         |
| Multi-Select      | Ant Design Select (multiple) | Tag chips for selected items, type-ahead         |
| Autocomplete      | MUI Autocomplete             | Free text + suggestions, popup indicator         |
| Date Range Picker | Ant Design RangePicker       | Calendar popup, date range, separator arrow      |
| Switch            | MUI Switch                   | Toggle with label, track animation               |

**Input States:**

- `default` - Empty, ready for input
- `filled` - Has value
- `disabled` - Not editable (grayed out)
- `focused` - Active input with border highlight
- `error` - Validation failed (red border)

### 3.3 Data Display

| Component | Library                | Purpose                               |
| --------- | ---------------------- | ------------------------------------- |
| Data Grid | AG Grid (Alpine theme) | Main data table with 157 columns      |
| Badge     | MUI Badge              | Count indicators on buttons           |
| Alert     | MUI Alert (standard)   | Warning/info messages                 |
| Divider   | Ant Design Divider     | Section separators with optional text |
| Tag       | Custom filter tags     | Applied filter display                |
| Avatar    | MUI Avatar             | User profile circle with initials     |

### 3.4 Navigation

| Component   | Library     | Purpose                                 |
| ----------- | ----------- | --------------------------------------- |
| Tab Bar     | MUI Tabs    | Workspace switching with scroll buttons |
| App Bar     | MUI AppBar  | Fixed header with toolbar               |
| Breadcrumbs | Not present | Single-level workspace navigation       |

### 3.5 Icons

| Icon          | Source     | Usage                        |
| ------------- | ---------- | ---------------------------- |
| Search        | Custom SVG | New Tile button              |
| LightMode     | MUI        | Theme toggle                 |
| Adjust        | MUI        | API Status indicator         |
| Refresh       | MUI        | Refresh page button          |
| Add           | MUI        | Add workspace tab            |
| ArrowDropDown | MUI        | Dropdown indicators          |
| Close         | MUI        | Dismiss alerts, clear inputs |
| RateReview    | MUI        | Feedback button              |
| column-width  | Ant Design | Resize columns               |
| file-excel    | Ant Design | Export to Excel              |
| down          | Ant Design | Dropdown arrows              |
| calendar      | Ant Design | Date picker                  |
| swap-right    | Ant Design | Date range separator         |

---

## 4. Text Content & Hierarchy

### Heading Hierarchy:

1. **H1 (Implicit):** "FMO Post Trade Portal" - Application title
2. **H2 (Implicit):** "Cashflow Blotter" - Current workspace name
3. **Section Labels:** "Quick Search", "Custom Search/View", "Value Today", "Value till Monday"
4. **Field Labels:** Individual form field labels (right-aligned)
5. **Table Headers:** Column names in data grid

### Key Text Content:

**Branding & Navigation:**

- "FMO Post Trade Portal"
- "New Tile"
- "light" (theme indicator)

**Workspace:**

- "Cashflow Blotter" (editable tab name)
- "+ Add Workspace" (implied action)

**Version Information:**

- "Version: 1.40.0-v1.40.0-20260227.4"
- "Env: UAT"

**Actions:**

- "API Status"
- "Refresh Page"
- "Clear Filters"
- "Search"
- "Clear"
- "Create or Modify"
- "Hide Search Bar"
- "Resize"
- "Export File"

**Labels:**

- "Cashflow ID"
- "Trade ID"
- "Value Date Range"
- "Currency"
- "Product Taxonomy"
- "Counterparty FMCODE"
- "SCB Booking Entity"
- "Beneficiary Name"
- "Beneficiary Account BIC Code"
- "Amount Range (Is)"
- "Filters"
- "Views"
- "Value Date Horizon"
- "NSTP Exception"
- "Booking Entity"
- "Cashflow Status"

**Status Labels:**

- "Pending Operator"
- "Pending Verification"
- "Value Today"
- "Value till Monday"

### Typography Patterns:

- **Labels:** Right-aligned, consistent width (255px)
- **Input Placeholders:** "Select...", "Input Amount", "Multiple searches separated by commas"
- **Badge Text:** Numbers (counts) inside badges
- **Grid Headers:** Left-aligned, sortable column names

---

## 5. Design Purpose & User Experience

### Overall Purpose:

A professional financial operations dashboard for post-trade cashflow management. Operations users track, filter, and manage cashflow records through various stages of affirmation, verification, and settlement.

### Primary User Personas:

1. **Operations Analyst** - Daily monitoring and processing of cashflows
2. **Team Lead** - Oversight of pending items and team workload
3. **Compliance Officer** - Verification and approval of transactions

### User Journey:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. LAND ON DASHBOARD                                            │
│    → See current status counts (Pending Operator/Verification)  │
│    → View version and environment info                           │
├─────────────────────────────────────────────────────────────────┤
│ 2. QUICK FILTER                                                  │
│    → Click preset query buttons (e.g., "Pending Operator: 21")  │
│    → Or use quick filters bar for common filters                │
├─────────────────────────────────────────────────────────────────┤
│ 3. ADVANCED SEARCH (Optional)                                    │
│    → Expand search panel                                         │
│    → Fill in specific criteria (Cashflow ID, Trade ID, dates)   │
│    → Click Search button                                         │
├─────────────────────────────────────────────────────────────────┤
│ 4. REVIEW RESULTS                                                │
│    → Analyze data in AG Grid                                     │
│    → Sort/filter columns as needed                               │
│    → Select rows for bulk operations                             │
├─────────────────────────────────────────────────────────────────┤
│ 5. TAKE ACTION                                                   │
│    → Export data to Excel                                        │
│    → Resize columns for better viewing                           │
│    → Drill into specific records                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Design Intent:

| Goal               | Implementation                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **Efficiency**     | Dense information display with quick access to common filters; preset queries with one-click access |
| **Clarity**        | Clear visual hierarchy separating search from results; collapsible search to maximize data viewing  |
| **Flexibility**    | Multiple search methods (quick search, presets, custom filters, saved views)                        |
| **Responsiveness** | Collapsible search section maximizes grid viewing area; horizontal scrolling for many columns       |
| **User Control**   | Customizable column views; saved filter configurations; export capabilities                         |

### Information Density:

- **High density** - Optimized for power users who need to see many data points
- **Progressive disclosure** - Search panel can be collapsed to focus on data
- **Scannable** - Grid allows quick scanning of hundreds of records

---

## 6. Reusable Patterns

### Pattern 1: Field Label + Input Pair

```
┌──────────────────┬──────────────────┐
│     Label        │   [Input Field]  │
│  (255px wide)    │   (240px wide)   │
│  right-aligned   │   left-aligned   │
└──────────────────┴──────────────────┘
```

- Consistent width for labels and inputs
- Right-aligned labels for visual alignment
- Used throughout search panel
- Optional: Label can be dropdown trigger for dynamic field switching

### Pattern 2: Preset Query Button with Badge

```
┌────────────────────────┐
│ Pending Operator  [21] │
└────────────────────────┘
```

- Text button on left
- Badge on right showing count
- Color-coded badges:
  - **Warning (orange):** Items requiring action
  - **Primary (blue):** Informational counts
- Click triggers pre-defined query

### Pattern 3: Search Panel Section

```
┌────────────────────────────────────┐
│ Section Title                      │
│ ─────────────────────────────────  │
│                                    │
│  [Content Grid - 2 columns]        │
│                                    │
└────────────────────────────────────┘
```

- Bordered container with rounded corners
- Section title as header
- Horizontal divider below title
- Content in grid layout

### Pattern 4: Action Button Group

```
┌──────────────────┬──────────────────┐
│  Clear Filters   │     Search       │
│   (outlined)     │   (contained)    │
│     (left)       │     (right)      │
└──────────────────┴──────────────────┘
```

- Reset/clear actions on left (outlined)
- Primary/submit actions on right (contained)
- Both buttons same height
- Disabled state when no input/filters

### Pattern 5: Grid Footer Toolbar

```
┌────────────────────────────────────────────────┐
│  [Resize]  [Export File]  ...                  │
└────────────────────────────────────────────────┘
```

- Outlined buttons with icons (left-aligned)
- Icons at 14px size
- Actions apply to entire grid or selection
- Horizontal button group

### Pattern 6: Dropdown with Create/Modify

```
┌──────────────────┬────────┬──────────────────┐
│ [Select...]      │ Clear  │ Create or Modify │
│ (dropdown)       │(outline)│  (contained)    │
└──────────────────┴────────┴──────────────────┘
```

- Select dropdown for choosing existing items
- Clear button to reset selection
- Create or Modify button for customization
- Used for Filters and Views

### Pattern 7: Collapsible Divider

```
──────────────── [▲ Hide Search Bar] ────────────────
```

- Horizontal divider across full width
- Centered text button with arrow icon
- Toggles visibility of section above/below

### Pattern 8: Quick Filter Bar

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ [Dropdown1] │ [Dropdown2] │ [Dropdown3] │ [Dropdown4] │ [Dropdown5] │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

- Horizontal row of autocomplete dropdowns
- Equal-width inputs
- Always visible below search section
- Rapid filtering without expanding full search

---

## 7. Component Variations for Standardization

### Button Variants:

| Variant             | Background      | Border    | Text      | Use Case           |
| ------------------- | --------------- | --------- | --------- | ------------------ |
| Contained Primary   | Primary color   | None      | White     | Primary actions    |
| Contained Secondary | Secondary color | None      | White     | Secondary actions  |
| Outlined Primary    | Transparent     | Primary   | Primary   | Tertiary actions   |
| Outlined Secondary  | Transparent     | Secondary | Secondary | Quaternary actions |
| Text Primary        | Transparent     | None      | Primary   | Inline actions     |
| Text Secondary      | Transparent     | None      | Secondary | Subtle actions     |

### Button Sizes:

| Size   | Padding  | Font Size | Icon Size |
| ------ | -------- | --------- | --------- |
| Small  | 4px 8px  | 0.8125rem | 14px      |
| Medium | 6px 16px | 0.875rem  | 14px      |
| Large  | 8px 22px | 0.9375rem | 18px      |

### Badge Variants:

| Variant | Background Color | Use Case                  |
| ------- | ---------------- | ------------------------- |
| Primary | Blue             | Informational counts      |
| Warning | Orange/Amber     | Items requiring attention |
| Error   | Red              | Errors or critical items  |
| Success | Green            | Completed items           |

### Badge Sizes:

| Size     | Min Width | Height | Font Size |
| -------- | --------- | ------ | --------- |
| Standard | 20px      | 20px   | 0.75rem   |
| Small    | 18px      | 18px   | 0.625rem  |

### Input Sizes:

| Size   | Height | Padding    | Font Size |
| ------ | ------ | ---------- | --------- |
| Small  | 32px   | 8.5px 14px | 0.875rem  |
| Medium | 40px   | 10px 14px  | 1rem      |

### Select Variants:

| Variant      | Features                      | Use Case           |
| ------------ | ----------------------------- | ------------------ |
| Single       | Searchable, clear button      | Single selection   |
| Multiple     | Tags for selected, type-ahead | Multiple selection |
| Autocomplete | Free text + suggestions       | Mixed input        |

### Grid Column Types:

| Type     | Alignment | Features                     |
| -------- | --------- | ---------------------------- |
| Checkbox | Center    | Row selection                |
| Text     | Left      | Default text display         |
| Number   | Right     | Numeric values               |
| Currency | Right     | Money values with formatting |
| Date     | Left      | Date formatting              |
| Status   | Center    | Color-coded status chips     |
| Action   | Center    | Icon buttons                 |

---

## 8. Technical Implementation Notes

### CSS Frameworks Used:

| Framework                  | Components                                                                    |
| -------------------------- | ----------------------------------------------------------------------------- |
| **Material-UI (MUI) v5**   | Buttons, Inputs, Badges, Switches, Alerts, Tabs, AppBar, Avatar, Autocomplete |
| **Ant Design v5**          | Select, DatePicker, Divider, Input, InputNumber, Grid wrapper                 |
| **AG Grid (Alpine theme)** | Data table, column headers, row selection, sorting, filtering                 |
| **Custom CSS**             | Component overrides, utility classes, layout                                  |

### CSS Architecture:

```
css/
├── tokens.css      # Design tokens (colors, spacing, typography)
├── fonts.css       # Font-face declarations
├── antd.css        # Ant Design overrides
├── mui.css         # Material-UI overrides
├── components.css  # Custom component styles
└── utilities.css   # Utility classes
```

### Responsive Considerations:

| Feature            | Implementation                                          |
| ------------------ | ------------------------------------------------------- |
| Fixed Header       | `position: fixed` with body padding compensation (48px) |
| Collapsible Search | Toggle button to maximize grid viewing area             |
| Column Scrolling   | Horizontal scroll for 157 columns                       |
| Tab Scrolling      | Arrow buttons for workspace tabs overflow               |
| Grid Height        | Flexible height fills remaining viewport                |

### Accessibility Features:

| Feature               | Implementation                                              |
| --------------------- | ----------------------------------------------------------- |
| ARIA Labels           | All interactive elements have aria-label or aria-labelledby |
| Roles                 | Grid uses `treegrid` role, proper row/column roles          |
| Keyboard Navigation   | Full keyboard support for grid and forms                    |
| Focus Management      | Visible focus indicators, logical tab order                 |
| Screen Reader Support | Proper labeling, announcements for dynamic content          |

### Performance Considerations:

| Concern            | Mitigation                                               |
| ------------------ | -------------------------------------------------------- |
| Large Data Sets    | Grid virtualization, pagination warning at 1000+ records |
| Many Columns       | Column virtualization, horizontal scroll                 |
| Search Performance | Debounced input, server-side filtering                   |
| Initial Load       | Lazy loading of non-critical components                  |

---

## 9. Color System (Reference Only)

> Note: Specific hex values are for reference. Use design tokens in actual implementation.

### Semantic Colors:

| Token      | Usage                       | Example Value        |
| ---------- | --------------------------- | -------------------- |
| Primary    | Main brand, primary actions | Blue (#0250a3)       |
| Secondary  | Secondary actions           | Gray                 |
| Warning    | Attention required          | Orange/Amber         |
| Success    | Completed, verified         | Green                |
| Error      | Errors, critical            | Red                  |
| Background | Page background             | Light gray (#f7f9fd) |

### Component-Specific:

| Component          | Light Mode    |
| ------------------ | ------------- |
| App Bar Background | Primary color |
| Badge (Warning)    | Amber         |
| Badge (Primary)    | Blue          |
| Divider            | Light gray    |
| Input Border       | Gray          |
| Input Focus Border | Primary       |

---

## 10. Spacing System (Reference Only)

| Token | Value | Usage           |
| ----- | ----- | --------------- |
| xs    | 4px   | Compact spacing |
| sm    | 8px   | Small spacing   |
| md    | 16px  | Default spacing |
| lg    | 24px  | Section spacing |
| xl    | 32px  | Large spacing   |

### Specific Measurements:

| Element               | Measurement |
| --------------------- | ----------- |
| App Bar Height        | 48px        |
| Tab Height            | 48px        |
| Grid Header Row       | 48px        |
| Field Label Width     | 255px       |
| Field Input Width     | 240px       |
| Grid Selection Column | 42px        |

---

## Appendix: Component Mapping to Design System

When implementing this design with a new design system, map components as follows:

### Buttons:

- Primary Action → `{DesignSystem}.Button` (variant="contained", color="primary")
- Secondary Action → `{DesignSystem}.Button` (variant="outlined", color="primary")
- Text Action → `{DesignSystem}.Button` (variant="text", color="primary")
- Icon Button → `{DesignSystem}.IconButton`

### Inputs:

- Text Input → `{DesignSystem}.TextField` or `{DesignSystem}.Input`
- Select → `{DesignSystem}.Select`
- Multi-Select → `{DesignSystem}.Select` (multiple)
- Autocomplete → `{DesignSystem}.Autocomplete`
- Date Picker → `{DesignSystem}.DatePicker` or `{DesignSystem}.DateRangePicker`
- Switch → `{DesignSystem}.Switch`

### Data Display:

- Data Grid → `AG Grid` (recommended) or custom table component
- Badge → `{DesignSystem}.Badge`
- Alert → `{DesignSystem}.Alert`
- Avatar → `{DesignSystem}.Avatar`
- Divider → `{DesignSystem}.Divider`

### Navigation:

- Tabs → `{DesignSystem}.Tabs`
- App Bar → `{DesignSystem}.AppBar` + `{DesignSystem}.Toolbar`

---

_This design blueprint provides a comprehensive foundation for recreating the Cashflow Blotter interface using a new design system while preserving the original layout, functionality, and user experience patterns._
