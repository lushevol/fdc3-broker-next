---
description: 'This custom agent handles API integration, mock data creation, and data binding for SC WebKit components.'
tools: []
---

# Step 3 - Integrate API

This agent guides you through creating API calls, mock data structures, and data bindings for SC WebKit components like `sc-data-grid` and dropdown lists.

## Usage
Invoke the agent and integrate the API as per design requirements:

```
@Step 3 Integrate API
```

### Input
Provide one or more of the following:
- Component requirements (e.g., "data grid needs customer data")
- Field specifications for API responses
- Dropdown options or list of values requirements
- Existing API endpoint information

### Output
The agent will:
1. Create an `src/api/api.ts` file with typed API calls if its not existing
2. Generate mock JSON files for development under `assets/mockdata/`
3. Set up data bindings for `sc-data-grid`
4. Configure dropdown/list of values data sources

---

## Implementation Protocol

### 1. Create API Service (`src/api/api.ts`)

**IMPORTANT**: All dropdowns, select elements, checkbox groups, and radio groups MUST use a single combined API call. Do NOT create separate JSON files for each dropdown, radio group, or checkbox group.

**Structure:**
```typescript
// src/api/api.ts

/**
 * Fetch all form options data (dropdowns, selects, checkbox groups, radio groups)
 * IMPORTANT: This is a single API call for ALL form option data
 */
export const fetchAjaxDataResponse = async() => {
    try {
        const response = await fetch('../assets/mockdata/ajax-data-response.json', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching ajax data response.', error);
        return null;
    }
}

/**
 * Fetch grid data for sc-data-grid components
 */
export const fetchGridData = async() => {
    try {
        const response = await fetch('../assets/mockdata/grid-data.json', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching grid data.', error);
        return null;
    }
}
```

---

### 2. Create Mock Data Files

**Directory Structure:**
```
assets/
  mockdata/
    ajax-data-response.json  (ALL dropdowns, selects, checkbox groups, radio groups)
    grid-data.json           (Grid/table data)
```

**CRITICAL RULE**: All `<sc-dropdown-input>`, `<sc-checkbox-group>`, and `<sc-radio-group>` options MUST be consolidated into `ajax-data-response.json`. This simulates a single AJAX call that returns all form options at once.

**Example: Combined Form Options (`assets/mockdata/ajax-data-response.json`)**
```json
{
  "statusOptions": [
    { "value": "active", "label": "Active" },
    { "value": "inactive", "label": "Inactive" },
    { "value": "pending", "label": "Pending" }
  ],
  "categoryOptions": [
    { "value": "cat1", "label": "Category 1" },
    { "value": "cat2", "label": "Category 2" },
    { "value": "cat3", "label": "Category 3" }
  ],
  "priorityOptions": [
    { "value": "low", "label": "Low" },
    { "value": "medium", "label": "Medium" },
    { "value": "high", "label": "High" },
    { "value": "critical", "label": "Critical" }
  ],
  "userRoleOptions": [
    { "value": "admin", "label": "Administrator" },
    { "value": "user", "label": "User" },
    { "value": "guest", "label": "Guest" }
  ],
  "yesNoOptions": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No" }
  ]
}
```

**Example: Grid Data (`assets/mockdata/grid-data.json`)**
```json
{
  "items": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "status": "Active",
      "createdDate": "2024-01-15"
    },
    {
      "id": "2",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "status": "Inactive",
      "createdDate": "2024-02-20"
    }
  ],
  "total": 2,
  "page": 1,
  "pageSize": 10
}
```

**Component Integration Example (`src/components/[filename].ts`)**
```typescript
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { fetchAjaxDataResponse, fetchGridData } from "../api/api.js";

@customElement('[filename]')
export class ExampleComponent extends LitElement {
  @state() ajaxData: any = {};
  @state() gridData: any = {};
  @state() loading: boolean = true;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
  }

  async loadData() {
    try {
      this.loading = true;
      // Single API call for all form options (dropdowns, selects, checkbox/radio groups)
      const [ajax, grid] = await Promise.all([
        fetchAjaxDataResponse(),
        fetchGridData()
      ]);
      
      // Provide fallback empty arrays for safe rendering
      this.ajaxData = ajax || {
        statusOptions: [],
        categoryOptions: [],
        priorityOptions: [],
        userRoleOptions: [],
        yesNoOptions: []
      };
      this.gridData = grid?.items || [];
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <!-- Dropdown using ajax-data-response.json -->
      <sc-dropdown-input ?disabled=${this.loading}>
        ${this.ajaxData?.statusOptions?.map((opt: any) => html`
          <sc-dropdown-option value=${opt.value}>${opt.label}</sc-dropdown-option>
        `)}
      </sc-dropdown-input>

      <!-- Radio Group using ajax-data-response.json -->
      <sc-radio-group ?disabled=${this.loading}>
        ${this.ajaxData?.priorityOptions?.map((opt: any) => html`
          <sc-radio value=${opt.value}>${opt.label}</sc-radio>
        `)}
      </sc-radio-group>

      <!-- Checkbox Group using ajax-data-response.json -->
      <sc-checkbox-group ?disabled=${this.loading}>
        ${this.ajaxData?.categoryOptions?.map((opt: any) => html`
          <sc-checkbox value=${opt.value}>${opt.label}</sc-checkbox>
        `)}
      </sc-checkbox-group>

      <!-- Data Grid using grid-data.json -->
      <sc-data-grid .data=${this.gridData}>
        <!-- Grid columns configuration -->
      </sc-data-grid>
    `;
  }
}
```

---

## Key Guidelines

1. **Single AJAX Call Rule**: ALL form option data (sc-dropdown-input, selects, checkbox groups, radio groups) MUST come from `ajax-data-response.json` via `fetchAjaxDataResponse()`
   
2. **Separate Grid Data**: Table/grid data should be in separate JSON files (e.g., `grid-data.json`) as they represent different data types

3. **Naming Convention**: 
   - Use descriptive keys ending with "Options" (e.g., `statusOptions`, `categoryOptions`)
   - Each option should have `value` and `label` properties minimum
   - Additional properties like `disabled`, `icon`, etc. can be added as needed

4. **Error Handling**: Always return `null` on error in API functions and provide fallback empty objects/arrays with proper structure in components (see example above)

5. **Loading States**: Use `?disabled=${this.loading}` on form elements during data fetch to prevent interaction

6. **TypeScript Types**: Consider defining interfaces for your data structures for better type safety:
   ```typescript
   interface DropdownOption {
     value: string;
     label: string;
     disabled?: boolean;
   }
   
   interface AjaxDataResponse {
     statusOptions: DropdownOption[];
     categoryOptions: DropdownOption[];
     priorityOptions: DropdownOption[];
     // ... other option arrays
   }
   ```

---