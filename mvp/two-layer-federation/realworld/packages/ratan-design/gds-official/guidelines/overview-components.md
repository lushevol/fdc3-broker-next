## Components

Always prefer components from the GDS package (imported from @GDS/components) if they are available. Each component has a guidelines file that contains helpful examples and additional context for you to use. You must follow all relevant instructions.

Here are the guidelines files and additional guidelines for the GDS components:

| Component | Overview                                             | Guidelines file                 |
| --------- | ---------------------------------------------------- | ------------------------------- |
| Badges    | Status alerts or labels                              | [badge.md](components/badge.md) |
| Banners   | Message bar with important information/announcements | [banner.md](/banner.md)         |
| Buttons   | Various clickable button components                  | [button.md](/button.md)         |

...
| Tab | Organizes multiple panels with panel selector | [tab.md](/tab.md) |
| TextArea | Simple text input component, used for longer form, multiline input | [textarea.md](/textarea.md) |
| Toast | Brief alert or notification component | [toast.md](/toast.md) |

IMPORTANT: do not specify a className property on any GDS components, as this will break the component. You should avoid overriding styling. Where strictly necessary (e.g. a button background color), use a style object property.

## General Component Usage and Best Practices

### Common Props

Most GDS components accept these common props:

- `recordingKey`: String for interaction testing
- `disabled`: Boolean to disable the component
- `className`: String for additional CSS classes (use sparingly)
- `data-*`: data attributes are always allowed
- Components always extend the types of their base element, e.g. Button accepts all button related props

### Controlled vs Uncontrolled

- **Controlled**: Component receives `value` and `onChange` props, parent manages state
- **Uncontrolled**: Component manages own state, use `defaultValue` for initial value
- Prefer controlled for most cases in modern React

### Sizing

- Most components support `size` prop: `"md"` (default), `"lg"`
- Buttons: Button (24px), ButtonLarge (32px), ButtonWide (full width)
- Inputs: `size="md"` (24px), `size="lg"` (32px)

### Select vs Input vs RadioInput

- Use `Select` for 4-20 predefined options
- Use `Input` for freeform values
- Use `RadioInput` for 2-4 mutually exclusive options
- Consider combobox for >20 options or dynamic data

### Popover vs Callout vs ToggleTip

- **Popover**: Steals focus, for important info requiring attention
- **Callout**: No focus steal, for supplementary info
- **ToggleTip**: Toggle to show/hide, for contextual help

`````

````md title="guidelines/overview-icons.md"
### Icon Library

GDS provides 1,093 Icon24* (24px) icons and 309 Icon16* (16px) icons. All icons are React components imported from `@GDS/icons`.

IMPORTANT: Always look in the node_modules directory to check which icons exist. You must confirm an icon exists before using it.

**Icon Sizes**:

- `Icon24*`: 24px icons for buttons, menus, and most UI elements
- `Icon16*`: 16px icons for badges, small indicators, and compact UI

**Usage Pattern**:

```typescript
import {
  Icon24Plus,
  Icon24Settings,
  Icon24Close,
  Icon24AiAssistant
  Icon16Warning
} from '@GDS/icons'

// In components
<IconButton aria-label="Add item">
  <Icon24Plus />
</IconButton>

<Badge variant="warningFilled" iconPrefix={<Icon16Warning />}>
  Warning
</Badge>
`````

- Many components have iconPrefix props which should be used for icons, rather than adding them as children (which will look broken). Check the component's props before using an icon.
- Never modify the strokeWidth of an icon as this looks bad

**Finding Icons**:

- Total available: 1,093 Icon24 icons, 309 Icon16 icons
- Icon names are kebab-case in files but PascalCase when imported. Example: `icon-24-arrow-up.tsx` → `Icon24ArrowUp`
- Check the icons directory for complete list
