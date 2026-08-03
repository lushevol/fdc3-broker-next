---
name: coding-standards
description: Coding standards and formatting rules for SC WebKit component code generation. Use when generating or reviewing TypeScript/Lit component code in SC WebKit projects. Covers naming conventions (camelCase/PascalCase/ALL_CAPS), formatting rules (4-space indentation, 80-120 char line length, brace placement), tag alignment for HTML/XML elements, error handling patterns, and documentation requirements.
compatibility: Designed for VS Code Copilot agent mode
---

# SC WebKit — Coding Standards

## General Guidelines
- Use descriptive variable, function, and class names. Avoid abbreviations.
- Follow consistent casing: camelCase for variables/functions, PascalCase for classes, ALL_CAPS for constants.
- Avoid magic numbers and strings; define them as constants.
- Write small, single-purpose functions and classes.
- Place imports at the top of the file, grouped logically.
- Write modular and reusable code.

Refactor code as you go to keep code clean and maintainable.

## Formatting
- Use 4 spaces per indentation level.
- **MANDATORY**: Use tab spaces for ALL code indentation - NEVER use actual tab characters or mixed indentation
- Limit lines to a reasonable length (80-120 characters).
- Place opening curly braces on the same line as the statement.
- Use consistent whitespace and formatting.
- Avoid deeply nested code. Break down logic into smaller functions.
- **Tag Alignment**: Ensure opening and closing HTML/XML tags are properly aligned at the same indentation level for improved readability.

### Tag Alignment Examples
```html
<!-- ✅ GOOD: Properly aligned tags -->
<sc-tab-group>
    <sc-tab slot="nav" panel="tab1">Tab 1</sc-tab>
    <sc-tab slot="nav" panel="tab2">Tab 2</sc-tab>
    <sc-tab-panel name="tab1">
        Content for tab 1
    </sc-tab-panel>
    <sc-tab-panel name="tab2">
        Content for tab 2
    </sc-tab-panel>
</sc-tab-group>

<!-- ❌ BAD: Misaligned closing tags -->
<sc-tab-group>
    <sc-tab slot="nav" panel="tab1">Tab 1</sc-tab>
    <sc-tab-panel name="tab1">
        Content
        </sc-tab-panel>
    </sc-tab-group>
```

## Error Handling
- Always catch specific exceptions, not generic ones.
- Log error messages and stack traces for debugging.
- Clean up resources properly in all cases (success, error, early return).

## Documentation
- Add comments/docstrings to all public classes, functions, and methods.
- Document parameters, return values, and exceptions.
- Use comments to explain complex logic or business rules.

## Security
- Never hardcode sensitive information (passwords, API keys).
- Validate and sanitize all external input.
- Use parameterized queries for database access.

## Windows Compatibility
- Use cross-platform path handling (e.g., os.path, path module).
- Avoid hardcoding file separators or drive letters.
- Ensure CLI commands work in Windows environments.

## Additional Guidelines

Refer to the appropriate file in .github/instructions/ for specific language guidelines and avoid repeating instructions across files.