# FMO Post Trade Portal - Cashflow Blotter

## Business Requirements Document

---

## 1. Overview

**Product Name:** FMO Post Trade Portal - Cashflow Blotter

**Purpose:** A professional financial operations dashboard for post-trade cashflow management. Operations users track, filter, and manage cashflow records through various stages of affirmation, verification, and settlement.

**Core Value:** Enables operations teams to efficiently monitor cashflow status, identify pending items requiring action, and manage high volumes of financial transaction data.

---

## 2. User Roles

| Role                   | Responsibilities                             |
| ---------------------- | -------------------------------------------- |
| **Operations Analyst** | Daily monitoring and processing of cashflows |
| **Team Lead**          | Oversight of pending items and team workload |
| **Compliance Officer** | Verification and approval of transactions    |

---

## 3. Core Functional Areas

### 3.1 Application Header

- **Application branding:** "FMO Post Trade Portal"
- **Quick action:** Add new workspace tiles
- **User preferences:** Light/Dark theme toggle
- **Time display:** UTC time with toggle control
- **User profile:** Avatar with dropdown for profile management
- **Feedback mechanism:** User feedback/survey access

### 3.2 Workspace Management

- Multi-workspace support with tabbed navigation
- Editable workspace names (default: "Cashflow Blotter")
- Ability to add new workspaces

### 3.3 System Information

- **Version display:** "Version: 1.40.0-v1.40.0-20260227.4"
- **Environment indicator:** "Env: UAT"
- **API status monitoring**
- **Page refresh capability**

---

## 4. Search & Filter Functionality

### 4.1 Quick Search Panel

**Searchable Fields:**
| Field | Input Type | Features |
|-------|-----------|----------|
| Cashflow ID | Text | Multi-value support (comma-separated) |
| Trade ID | Text | Dynamic field switching |
| Value Date Range | Date Range | Start/End date selection |
| Currency | Autocomplete | Searchable with type-ahead |
| Product Taxonomy | Multi-Select | Tag-based multiple selection |
| Counterparty FMCODE | Text | Multi-value support |
| SCB Booking Entity | Dropdown | Single selection with search |
| Beneficiary Name | Text | Free text entry |
| Beneficiary Account BIC Code | Text | Free text entry |
| Amount Range (Is) | Number | Numeric filter |

**Actions:**

- Clear Filters (disabled when no filters applied)
- Search (disabled when no input provided)

### 4.2 Preset Query Panel

**Quick-access predefined queries with real-time counts:**

**Value Today Section:**

- Pending Operator [count]
- Pending Verification [count]

**Value till Monday Section:**

- Pending Operator [count]
- Pending Verification [count]

_Note: Counts indicate items requiring attention (high counts = action needed)._

### 4.3 Custom Search/View Management

**Saved Filters:**

- Dropdown to select saved filter configurations
- Clear button to reset filter selection
- Create or Modify button to open filter builder

**Saved Views:**

- Dropdown to select saved column views
- Clear and Create/Modify buttons for view management

### 4.4 Quick Filters Bar

Always-visible rapid filtering options:

- Value Date Horizon
- Product Taxonomy
- NSTP Exception
- Booking Entity
- Cashflow Status

---

## 5. Data Display (Cashflow Grid)

### 5.1 Core Data Table

**Primary display area** showing cashflow records with extensive column support (150+ columns).

**Key Columns:**

- Select (row selection checkbox)
- Cashflow ID
- Cashflow Version
- Cashflow Major Version
- Cashflow Minor Version
- Cashflow Affirmation Status
- Cashflow Sub State Type
- (Additional columns as needed)

### 5.2 Data Interaction Capabilities

- **Row selection:** Multi-select via checkboxes
- **Column sorting:** Click headers to sort ascending/descending
- **Column filtering:** Per-column filter menus
- **Column resizing:** Adjustable column widths
- **Horizontal scrolling:** Navigate extensive column sets
- **Vertical scrolling:** Browse data rows

### 5.3 Grid Actions

| Action      | Purpose                            |
| ----------- | ---------------------------------- |
| Resize      | Auto-resize columns to fit content |
| Export File | Export grid data to Excel format   |

### 5.4 Data Limitations Notice

**Alert Message:** "If more than 1000 records are loaded, column filters below will be applied only within the first 1000 records."

Features:

- Dismissible alert banner
- Applied filter tags display

---

## 6. User Flows

### Primary User Journey

1. **Land on Dashboard**
   - View current status counts (Pending Operator/Verification)
   - See version and environment information

2. **Quick Filter**
   - Click preset query buttons (e.g., "Pending Operator")
   - Use quick filters bar for common filters

3. **Advanced Search (Optional)**
   - Expand search panel
   - Fill in specific criteria (Cashflow ID, Trade ID, dates)
   - Execute search

4. **Review Results**
   - Analyze data in the grid
   - Sort/filter columns as needed
   - Select rows for bulk operations

5. **Take Action**
   - Export data to Excel
   - Resize columns for better viewing
   - Drill into specific records

---

## 7. Content Elements

### 7.1 Application Labels & Text

**Branding:**

- "FMO Post Trade Portal"

**Actions:**

- "New Tile"
- "API Status"
- "Refresh Page"
- "Clear Filters"
- "Search"
- "Clear"
- "Create or Modify"
- "Hide Search Bar"
- "Resize"
- "Export File"

**Field Labels:**

- Cashflow ID
- Trade ID
- Value Date Range
- Currency
- Product Taxonomy
- Counterparty FMCODE
- SCB Booking Entity
- Beneficiary Name
- Beneficiary Account BIC Code
- Amount Range (Is)
- Filters
- Views
- Value Date Horizon
- NSTP Exception
- Booking Entity
- Cashflow Status

**Status Labels:**

- Pending Operator
- Pending Verification
- Value Today
- Value till Monday

**Input Placeholders:**

- "Select..."
- "Input Amount"
- "Multiple searches separated by commas"

---

## 8. Functional Requirements Summary

| Requirement             | Description                                         |
| ----------------------- | --------------------------------------------------- |
| Multi-workspace support | Users can create and manage multiple workspace tabs |
| Advanced search         | 10+ searchable fields with various input types      |
| Preset queries          | One-click access to common queries with live counts |
| Saved configurations    | Persist custom filters and column views             |
| Data export             | Excel export capability                             |
| Real-time counts        | Live pending item counts for workload monitoring    |
| Collapsible search      | Show/hide search panel to maximize data viewing     |
| Bulk operations         | Row selection for batch actions                     |
| Theme support           | Light/Dark mode preference                          |
| User feedback           | Built-in feedback mechanism                         |

---

_This document describes the functional requirements of the FMO Post Trade Portal - Cashflow Blotter application, focusing on what the product does and what users can accomplish, without prescribing specific visual design or implementation approaches._
