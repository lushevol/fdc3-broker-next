# Layout Intent Technical Summary

Generated: 2026-03-07T16:20:21.867Z

## Grid System

**System**: Material UI
**Columns**: 12

### Breakpoints

- xs: 0px
- sm: 600px
- md: 960px
- lg: 1280px
- xl: 1920px

### Grid Classes Found

- `MuiGrid-container`
- `MuiGrid-grid-xs-3`
- `MuiGrid-grid-xs-9`
- `MuiGrid-item`
- `MuiGrid-root`

## Typography Hierarchy

| Class Name              | Level   |
| ----------------------- | ------- |
| `MuiTypography-body1`   | body1   |
| `MuiTypography-caption` | caption |

## Spacing Patterns

**Base Unit**: 8px

### Spacing Classes

- `MuiToolbar-root`: 8px base unit
- `MuiToolbar-gutters`: 8px base unit
- `MuiToolbar-dense`: 8px base unit
- `MuiBox-root`: 8px base unit

## Migration Guidance

### Component Mapping Suggestions

| Source Class        | Target Component                            |
| ------------------- | ------------------------------------------- |
| `MuiGrid-container` | `<Grid container>` or `<div class="grid">`  |
| `MuiGrid-item`      | `<Grid item>` or `<div class="col-span-*">` |
| `MuiButton-root`    | `<Button>`                                  |
| `MuiTypography-*`   | `<Typography variant="*">`                  |
| `MuiBox-root`       | `<Box>` or `<div>` with Tailwind spacing    |
