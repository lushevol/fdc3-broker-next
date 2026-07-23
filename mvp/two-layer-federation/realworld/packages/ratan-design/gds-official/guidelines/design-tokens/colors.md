# Color design tokens

## Naming pattern

GDS uses semantic color tokens following this pattern: `--sc-color-{type}-{category}-{subcategory}-{role}-{state}`
'type' and 'category' are required; the remaining parts are optional. For instance, --sc-color-semantic-fg-link-primary-hover has all.

Use borders or background colors to separate sections.

### Quick Decision Tree to find a token

**Need a primitive color?**  
→ Start with `--sc-color-primitive-`  
→ E.g `--sc-color-primitive-grey-GDS-white`

**Need a base color?**  
→ Start with `--sc-color-foundation-basic-`
→ This includes background-base color, container-layer color, divider-base color, brand color
→ Use a `inverse` when on a darker surface
→ E.g `--sc-color-foundation-basic-divider-base-inverse`

**Need a foundation content color?**  
→ Start with `--sc-color-foundation-content-`  
→ This includes colors for header, title, body, label-text, input-text, placeholder-text, eyebrow-hint-text, disabled-text, helper-text, information-text, error-text, warning-text,success-text
→ Use a `inverse` when on a darker surface
→ E.g `--sc-color-foundation-content-header-inverse`

**Need a foreground link/text color?**  
→ Start with `--sc-color-semantic-fg-link-` or `--sc-color-semantic-fg-text-`
→ {role} can be either `primary`, `secondary`,'destructive',`warning` or `success`
→ {state} can be either `rest`, `hover`,'pressed',`selected` or `disabled`
→ Use `subtle` or `emphasis` for varied on a darker surface
→ E.g `--sc-semantic-fg-link-primary-hover-subtle`

**Need a background color?**  
→ Start with `--sc-color-semantic-bg-`  
→ {role} can be either `primary`, `secondary`,'destructive',`warning` or `success`
→ {state} can be either `rest`, `hover`,'pressed',`selected` or `disabled`
→ Use `subtle` or `emphasis` for varied on a darker surface
→ E.g `--sc-semantic-bg-primary-hover-emphasis`

**Need a border color?**  
→ Start with `--sc-color-semantic-border-`  
→ {role} can be either `primary`, `secondary`,'destructive',`warning` or `success`
→ {state} can be either `rest`, `hover`,'pressed',`selected` or `disabled`
→ E.g `--sc-semantic-border-primary-hover`

## Categories

- **bg**: Anytime you need a background or background-color
- **fg**: Anytime you need a color property for text or link
- **border**: For border, outline, border-color properties
