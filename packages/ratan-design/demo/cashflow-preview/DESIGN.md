# Cashflow Blotter - UI Redesign Document

## Overview

This document outlines the redesign changes for the Cashflow Blotter scratch preview to optimize for 1920x1080 resolution and improve UX.

---

## Changes Summary

### 1. Header Simplification

**Before:** Header shows app name + UAT Environment + New Tile + Dark Toggle + Time + Avatar + Feedback
**After:**

- Remove UAT Environment indicator from header
- Keep: Logo, App Name, New Tile button, Dark/Light toggle, Time (UTC), User Avatar, Feedback
- Move environment info to workspace tab dropdown

### 2. Resolution Optimization (1920x1080)

- Design for fixed 1920x1080 viewport
- Use percentage-based widths where appropriate
- Grid layouts: 12-column system optimized for wide screens
- Horizontal space utilization: Side panels, wide tables
- Reduced vertical padding to fit more content

### 3. Workspace Tab - Seamless Design

**Before:** Separate tab bar with border, distinct from content
**After:**

- Tab integrated seamlessly with content body
- No visible border between tab and content
- Tab appears as part of the page header area
- Dropdown still accessible via chevron

### 4. Workspace Tab Dropdown

**New Component:** Workspace Application Tab Dropdown

- Trigger: Click on active tab or chevron
- Contains:
  - Environment: UAT/PROD indicator with color coding
  - App Version: v1.40.0-v1.40.0-20260227.4
  - API Status indicator
  - Refresh Page action
  - Last Updated timestamp

### 5. Statistics Dashboard (Mini)

**Before:** "Value Today" and "Value till Monday" as large cards taking significant space
**After:** Horizontal compact statistics bar

- Display as metric tiles: Label + Count + Status indicator
- Clickable to trigger search
- Position: Below search panel, above data grid
- Compact design: ~48px height

### 6. Quick Search Panel - Full Fields

**Updated Fields (10 total):**

| Field                        | Type                | Notes                                                    |
| ---------------------------- | ------------------- | -------------------------------------------------------- |
| Cashflow ID                  | Text Input          | Multi-value (comma-separated), clear button              |
| Trade ID                     | Text Input          | With dropdown label selector for dynamic field switching |
| Value Date Range             | Date Range Picker   | Start/End date inputs with calendar popup                |
| Currency                     | Autocomplete Select | Searchable dropdown with type-ahead                      |
| Product Taxonomy             | Multi-Select        | Tag-based multiple selection                             |
| Counterparty FMCODE          | Text Input          | Multi-value (comma-separated)                            |
| SCB Booking Entity           | Select Dropdown     | Single selection with search                             |
| Beneficiary Name             | Text Input          | Free text entry                                          |
| Beneficiary Account BIC Code | Text Input          | Free text entry                                          |
| Amount Range (Is)            | Number Input        | Numeric filter with placeholder                          |

**Layout:** 5 columns x 2 rows grid

### 7. Custom Search/View Panel

**New Component:** Save and load custom filter/view configurations

**Purpose:** When quick search fields aren't enough, users use custom filters. When grid fields aren't enough, users build custom views.

**Layout:** Side-by-side sections for Filters and Views

**Filters Section:**

- Dropdown: Select saved filter configuration
- Clear Button: Reset filters (outlined, disabled when no selection)
- Create or Modify Button: Open filter builder (contained primary)

**Views Section:**

- Dropdown: Select saved view configuration
- Clear Button: Reset views (outlined, disabled when no selection)
- Create or Modify Button: Open view builder (contained primary)

### 8. Grid Header with Results

**Before:** Footer with results, header with actions
**After:** All in header

- Left: Results count, selection count
- Center: Last updated timestamp
- Right: Actions (Resize, Export, Settings)

---

## Layout Structure (New)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER (56px)                                                               │
│ [Logo] FMO Post Trade Portal    [New Tile] [Dark] [21:36 UTC] [A] [Feedback]│
├─────────────────────────────────────────────────────────────────────────────┤
│ MAIN CONTENT (Seamless with tab)                                            │
│ ┌─────────────────────────────────────────────────────────────────────┐    │
│ │ [Cashflow Blotter ▼] [+]           [Env UAT | Version | API Online] │    │
│ │    └── Dropdown: Refresh | Last Updated                             │    │
│ ├─────────────────────────────────────────────────────────────────────┤    │
│ │ QUICK SEARCH PANEL (Collapsible)                                    │    │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │    │
│ │ │ Cashflow ID    | Trade ID       | Value Date Range | Currency   | │    │
│ │ │ Product Tax.   | Counterparty   | Booking Entity   | Beneficiary| │    │
│ │ │ BIC Code       | Amount Range   |                                    │    │
│ │ └─────────────────────────────────────────────────────────────────┘ │    │
│ │                                          [Clear Filters] [Search]   │    │
│ └─────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│ ┌─────────────────────────────────────────────────────────────────────┐    │
│ │ CUSTOM SEARCH/VIEW PANEL                                            │    │
│ │ Filters: [Select... ▼] [Clear] [Create or Modify]                   │    │
│ │ Views:   [Select... ▼] [Clear] [Create or Modify]                   │    │
│ └─────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│ ┌─────────────────────────────────────────────────────────────────────┐    │
│ │ STATISTICS BAR (Compact)                                            │    │
│ │ Value Today: [Pending Op 12] [Pending Verif 5] | Value Mon: [...]   │    │
│ └─────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│ ┌─────────────────────────────────────────────────────────────────────┐    │
│ │ INFO ALERT                                                          │    │
│ │ ℹ If more than 1000 records are loaded...                           │    │
│ └─────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│ ┌─────────────────────────────────────────────────────────────────────┐    │
│ │ DATA GRID HEADER                                                    │    │
│ │ Results: 50 total | 5 selected        Last updated: ...    [R][E][⚙]│    │
│ ├─────────────────────────────────────────────────────────────────────┤    │
│ │ [ ] Cashflow ID  Trade ID  Value Date  CCY  Amount  ...             │    │
│ │ ...                                                                 │    │
│ └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Statistics Bar

- **Height:** 48px
- **Background:** Slate-800/50 with subtle border
- **Layout:** Flex row with gap-4
- **Metric Tile:**
  - Label: text-slate-400, text-xs
  - Value: text-white, text-sm font-semibold
  - Badge: Color-coded (warning amber, info blue)
  - Hover: Light background highlight

### Workspace Tab (Seamless)

- **Background:** Same as page background (slate-950)
- **Tab Style:** Bordered pill with primary color accent
- **Integration:** No separator between tab and content
- **Dropdown:** Same as before

### Custom Search/View Panel

- **Layout:** 2-column grid (Filters | Views)
- **Each Section:**
  - Label: text-slate-400, text-xs uppercase
  - Dropdown: flex-1
  - Buttons: Clear (outlined, sm), Create/Modify (primary, sm)
- **Background:** Slate-900/40 with border

### Quick Search Fields

- **Grid:** 5 columns for field layout
- **Row 1:** Cashflow ID, Trade ID, Value Date Range, Currency, Product Taxonomy
- **Row 2:** Counterparty FMCODE, SCB Booking Entity, Beneficiary Name, BIC Code, Amount Range
- **Multi-select:** Tag-based chips for Product Taxonomy
- **Date Range:** Dual input with calendar icons

### Grid Header

- **Height:** 44px
- **Background:** Slate-900/50 border-b
- **Left:** Results text (xs, slate-400) + count (xs, slate-300)
- **Center:** Last updated (xs, slate-500)
- **Right:** Action buttons (ghost, sm)

---

## Responsive Behavior

- **Min-width:** 1280px (no mobile support for this preview)
- **Target:** 1920x1080 fixed
- **Max-width:** Content constrained to reasonable limits
- **Table:** Horizontal scroll for many columns

---

## Color Palette (Maintained)

- Background: Slate-950 (#020617)
- Cards: Slate-900/50 with glass effect
- Primary: Blue-500 (#0473ea)
- Success: Emerald-500 (#10b981)
- Warning: Amber-500 (#f59e0b)
- Danger: Red-500 (#ef4444)

---

## Typography

- **Font Family:** Plus Jakarta Sans (sans), JetBrains Mono (mono)
- **Hierarchy:**
  - Page Title: 18px, font-weight 700
  - Card Titles: 14px, font-weight 600
  - Table Headers: 11px, uppercase, slate-400
  - Body: 13px, slate-300
  - Mono (IDs, Amounts): 13px, font-weight 500

---

## Spacing

- **Page Padding:** 24px (px-6)
- **Card Padding:** 20px (p-5)
- **Section Gap:** 16px (mb-4)
- **Inner Gap:** 12px-16px
- **Table Cell Padding:** 12px (p-3)

---

## Animation

- Search expand/collapse: 200ms ease
- Dropdown: 150ms fade + slide
- Hover transitions: 150ms ease
- Row hover: 100ms background change
