# GDS Migration Analysis for MFE Platform

## Executive Summary

This document analyzes the effort and feasibility of migrating your MFE platform from MUI-based components to the Global Design System (GDS).

---

## Current State

### Your Platform Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| UI Library | Material-UI (MUI)                         |
| Styling    | Emotion (@emotion/react, @emotion/styled) |
| Theme      | Custom theme with light/dark modes        |
| Federation | Module Federation (baseContainer)         |
| Components | 40+ custom components wrapping MUI        |

### Components Currently Exposed by Base MFE

```
AppBar, Avatar, BuilderButton, Button, DatePicker, DateRangePicker,
DateTimePicker, Dialog, Drawer, Empty, ErrorBoundry, FallbackError,
Input, Label, Loader, LoadingButton, NewTile, Profile, ResetButton,
ScWebkit, SearchButton, SearchCondition, SearchConditionContainer,
SearchGrid, SearchInput, Select, Snackbar, Splash, Survey, SurveyButton,
Switch, SwitchTime, TabItem, TabPanel, Table, TableDetail, Tile, Time,
TimePicker, Timeout, ToggleButton, Version
```

---

## What GDS CAN Provide

### ✅ Direct Replacements (Drop-in Candidates)

| Your Component | GDS Equivalent      | Migration Complexity         |
| -------------- | ------------------- | ---------------------------- |
| Button         | Button              | Medium - different props     |
| Input          | TextInput           | Medium - different props     |
| Select         | DropdownInput       | Medium - different props     |
| DatePicker     | DatePicker          | Medium - different props     |
| TimePicker     | TimeInput           | Medium - different props     |
| Switch         | Switch              | Low - similar API            |
| Loader         | ProgressIndicator   | Low                          |
| Snackbar       | SnackbarToast       | Low                          |
| Dialog         | Modal               | Medium                       |
| Drawer         | SidePanelNavigation | High                         |
| TabPanel       | Tabs                | Medium                       |
| Checkbox       | -                   | High (use Radio for single?) |
| Avatar         | Avatar              | Low                          |

### ✅ New Components GDS Adds

| GDS Component  | Value                         |
| -------------- | ----------------------------- |
| Accordion      | Collapsible content sections  |
| Badge          | Status labels and alerts      |
| Breadcrumbs    | Navigation trails             |
| Card           | Content containers            |
| FileUploader   | File upload with drag-drop    |
| NumberInput    | Numeric input with validation |
| OtpPinInput    | One-time password entry       |
| Pagination     | Page navigation               |
| Popover        | Contextual overlays           |
| Rating         | Star ratings                  |
| RichTextEditor | WYSIWYG editor                |
| Slider         | Range selectors               |
| Stepper        | Multi-step workflows          |
| Status         | Status indicators             |

### ✅ Design System Benefits

| Benefit                   | Description                                         |
| ------------------------- | --------------------------------------------------- |
| **Semantic Color Tokens** | `--sc-color-semantic-{bg/fg/border}-{role}-{state}` |
| **Typography Scale**      | 12 levels from hero (56px) to helper (12px)         |
| **Icon Library**          | 1,400+ icons (1,093 @ 24px, 309 @ 16px)             |
| **UX Copy Guidelines**    | Brand voice, standard patterns, error messages      |
| **Accessibility**         | WCAG compliance built-in                            |
| **Brand Consistency**     | SC Prosper Sans font, brand colors                  |

---

## What GDS CANNOT Provide

### ❌ No Direct Equivalent

| Your Component               | Gap                         | Recommendation                             |
| ---------------------------- | --------------------------- | ------------------------------------------ |
| **AppBar**                   | No top navigation bar       | Build custom using GDS primitives          |
| **DateRangePicker**          | Only single DatePicker      | Build range selector using two DatePickers |
| **DateTimePicker**           | Separate Date + Time inputs | Combine DatePicker + TimeInput             |
| **SearchCondition**          | No search builder           | Build custom                               |
| **SearchConditionContainer** | No equivalent               | Build custom                               |
| **SearchGrid**               | No data grid                | Use external lib (AG Grid) or build custom |
| **Table**                    | No data table               | Use external lib or build custom           |
| **TableDetail**              | No detail view              | Build custom                               |
| **Tile**                     | No tile/card widget         | Use Card component                         |
| **Profile**                  | No profile component        | Build using Avatar + layout                |
| **ScWebkit**                 | No Smart Card integration   | Keep existing                              |
| **Version**                  | No version display          | Build custom (simple)                      |
| **Timeout**                  | No session timeout          | Build custom                               |
| **Survey**                   | No survey component         | Build custom                               |

### ❌ GDS Limitations

| Limitation                | Impact                               |
| ------------------------- | ------------------------------------ |
| **No Data Grid/Table**    | Critical for admin interfaces        |
| **No Date Range Picker**  | Common requirement for filters       |
| **No Search Builder**     | Complex search UIs need custom       |
| **No Layout Components**  | No grid system, flex utilities       |
| **No Form Library**       | No form validation, schemas          |
| **No Charting**           | No data visualization                |
| **No Virtualization**     | No virtual scrolling for lists       |
| **className Not Allowed** | Cannot override GDS component styles |

### ⚠️ Prop Incompatibility

```tsx
// Your current MUI Button
<Button variant="contained" color="primary" onClick={handler}>
  Click Me
</Button>

// GDS Button (different props)
<Button
  intent="neutral"
  style="primary"
  label="Click Me"
  onClick={handler}
/>
```

| Aspect       | MUI                     | GDS                        |
| ------------ | ----------------------- | -------------------------- |
| Variant prop | `variant="contained"`   | `style="primary"`          |
| Color prop   | `color="primary"`       | `intent="neutral"`         |
| Children     | `<Button>Text</Button>` | `label="Text"` or children |
| Styling      | sx prop, className      | `style` object only        |

---

## Migration Effort Analysis

### Phase 1: Foundation (2-4 weeks)

| Task                          | Effort | Risk   |
| ----------------------------- | ------ | ------ |
| Install GDS package           | 1 day  | Low    |
| Set up GDS theme provider     | 2 days | Medium |
| Configure CSS variables       | 2 days | Medium |
| Map color tokens              | 3 days | Medium |
| Update typography             | 2 days | Low    |
| Create GDS wrapper components | 5 days | Medium |

### Phase 2: Core Components (4-6 weeks)

| Component            | Effort | Breaking Changes    |
| -------------------- | ------ | ------------------- |
| Button               | 2 days | Props API change    |
| Input/TextInput      | 3 days | Props API change    |
| Select/DropdownInput | 3 days | Props API change    |
| DatePicker           | 4 days | Props API change    |
| Modal/Dialog         | 3 days | Different structure |
| Toast/Snackbar       | 2 days | Minor changes       |
| Switch               | 1 day  | Minor changes       |
| Loader               | 1 day  | Minor changes       |
| Tabs                 | 3 days | Structure change    |

### Phase 3: Missing Components (4-8 weeks)

| Component                  | Effort  | Complexity |
| -------------------------- | ------- | ---------- |
| AppBar (custom)            | 3 days  | Medium     |
| DateRangePicker (custom)   | 5 days  | High       |
| Table (custom or external) | 10 days | High       |
| SearchCondition (custom)   | 5 days  | High       |
| Tile (use Card)            | 2 days  | Low        |

### Phase 4: Tenant Migration (Variable)

| Task                      | Effort per Tenant |
| ------------------------- | ----------------- |
| Update imports            | 1-2 days          |
| Fix prop mismatches       | 2-5 days          |
| Visual regression testing | 2-3 days          |
| Accessibility testing     | 1-2 days          |

---

## Total Effort Estimate

| Phase              | Duration         | Team Size | Risk Level  |
| ------------------ | ---------------- | --------- | ----------- |
| Foundation         | 2-4 weeks        | 2 devs    | Medium      |
| Core Components    | 4-6 weeks        | 2-3 devs  | Medium-High |
| Missing Components | 4-8 weeks        | 2 devs    | High        |
| Tenant Migration   | 1-2 weeks/tenant | 1-2 devs  | Medium      |

**Total: 3-5 months for full migration (depending on tenant count)**

---

## Recommendation: Hybrid Approach

### Option A: Full Migration (High Effort)

Replace all MUI components with GDS equivalents.

**Pros:**

- Full brand consistency
- No MUI dependency
- Future-proof

**Cons:**

- High effort (3-5 months)
- Breaking changes for tenants
- Gaps in data grid, date range

### Option B: Incremental Migration (Recommended)

1. **Keep MUI for complex components** (Table, DateRangePicker)
2. **Use GDS for new components**
3. **Create adapter layer** for gradual migration

**Pros:**

- Lower risk
- Tenant teams can migrate at their pace
- Fill gaps incrementally

**Cons:**

- Mixed codebase temporarily
- Two theme systems

### Option C: Wrapper Strategy (Lowest Risk)

Create GDS-styled wrappers around MUI components:

```tsx
// GDSButton wraps MUI Button with GDS styling
export const GDSButton = ({ intent, style, label, ...props }) => {
  const variantMap = {
    primary: 'contained',
    secondary: 'outlined',
    link: 'text',
  };

  return (
    <MuiButton variant={variantMap[style]} {...props}>
      {label}
    </MuiButton>
  );
};
```

**Pros:**

- Minimal breaking changes
- GDS visual identity
- Gradual migration path

**Cons:**

- Not true GDS components
- Mixed styling systems
- Technical debt

---

## Gap Mitigation Strategies

### Data Grid/Table

| Option                     | Effort | Quality   |
| -------------------------- | ------ | --------- |
| AG Grid (enterprise)       | $$     | Excellent |
| TanStack Table             | Free   | Excellent |
| Build custom with GDS Card | Medium | Basic     |

### Date Range Picker

| Option                    | Effort | Quality  |
| ------------------------- | ------ | -------- |
| Two GDS DatePickers       | Low    | Basic UX |
| Build custom range picker | Medium | Good     |
| Keep MUI DatePicker       | None   | Good     |

### Search Components

Build custom using:

- GDS TextInput
- GDS DropdownInput
- GDS Button
- Custom logic

---

## Migration Checklist

### Pre-Migration

- [ ] Audit all component usage across tenants
- [ ] Document custom props and extensions
- [ ] Create component mapping document
- [ ] Set up visual regression testing
- [ ] Establish design token mapping

### During Migration

- [ ] Create GDS provider wrapper
- [ ] Build adapter components for prop mapping
- [ ] Migrate one component at a time
- [ ] Update documentation
- [ ] Communicate breaking changes to tenants

### Post-Migration

- [ ] Remove MUI dependencies (if full migration)
- [ ] Update Storybook/docs
- [ ] Performance testing
- [ ] Accessibility audit
- [ ] Archive legacy components

---

## Conclusion

**GDS provides:** Strong foundation for brand consistency, 35+ well-designed components, design tokens, icons, and UX guidelines.

**GDS lacks:** Data grid, date range picker, complex search UI, layout utilities, and form validation.

**Recommended approach:** Incremental migration with adapter layer, keeping MUI for complex components that GDS doesn't provide.

**Estimated effort:** 3-5 months for full migration, or 1-2 months for hybrid approach with critical components only.
