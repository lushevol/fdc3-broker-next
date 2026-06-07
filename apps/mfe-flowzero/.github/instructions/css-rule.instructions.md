---
applyTo: "**"
---

**CSS Guidelines (Tailwind Priority)**


**Tailwind CSS must always be the first choice for all styling.**

Always group Tailwind class names using `cn()` for better readability. If `cn` is not imported, add:

When grouping, order Tailwind classes by property type (e.g., layout, spacing, color, interaction) for clarity and maintainability.

```tsx
import cn from "classnames";
```

```tsx
<div className={cn("flex-1 relative", "p-4")}>...</div>
```

- Use Tailwind CSS utility classes for all layout, spacing, color, and typography whenever possible.
- If a style cannot be achieved with Tailwind, use `@emotion/styled` as the preferred custom CSS-in-JS solution.

- Do not override Tailwind classes with custom CSS unless absolutely necessary.
- Use Ant Design theming only for Ant Design components. For all other UI, prefer Tailwind.
- Keep all style logic within components or their closest relevant files.
- Ensure all new styles are responsive and accessible.

**CSS Nesting for Hierarchical Relationships:**

When using custom CSS (including @emotion/styled), if elements have a hierarchical (parent-child) relationship, avoid repeating selectors. Use nested CSS to express hierarchy clearly and concisely.

**Example:**

```tsx
const Wrapper = styled("div")`
  .parent {
    color: #333;
    .child {
      color: #888;
    }
  }
`;
```

**@emotion/styled Example:**

If you cannot achieve a style with Tailwind, use `@emotion/styled` as shown below:

```tsx
import styled from "@emotion/styled";

const CustomButton = styled("button")`
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    border-color: #4f9df0;
    background: #e5f1fc;
  }
`;

// Usage in a React component:
export default function Example() {
  return <CustomButton>Click me</CustomButton>;
}
```

**Summary:**

> Tailwind CSS is the default and preferred method for all styling. Custom CSS is only allowed as a last resort.

---

**Ant Design Popup / Overlay Mounting (Required)**

Never mount Ant Design popup components to `document.body`. Always use `getPopupContainer` or `getContainer` to mount into a nearby ancestor.

- `getPopupContainer`: `Select`, `TreeSelect`, `Cascader`, `DatePicker`, `RangePicker`, `TimePicker`, `AutoComplete`, `Dropdown`, `Tooltip`, `Popover`, `Popconfirm`, `Mentions`, `ColorPicker`, `Tour`
- `getContainer`: `Modal`, `Drawer`

```tsx
// ✅ Correct
<Select getPopupContainer={(triggerNode) => triggerNode.parentElement!} />
```
