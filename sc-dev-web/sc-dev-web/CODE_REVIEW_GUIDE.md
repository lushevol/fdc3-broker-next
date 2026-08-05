# SC WebKit Code Review Guide

This guide consolidates the contributing guidelines and coding standards for SC WebKit. All contributors and reviewers should follow these conventions to ensure consistency and maintainability.

---

## Table of Contents

1. [Contributing](#contributing)
   - [Ways to Contribute](#ways-to-contribute)
   - [Feature Requests](#feature-requests)
   - [Bug Reports](#bug-reports)
   - [Pull Requests](#pull-requests)
2. [Developing](#developing)
   - [Setup](#setup)
   - [Demo Page](#demo-page)
   - [Storybook](#storybook)
   - [Creating a New Component](#creating-a-new-component)
3. [Documentation](#documentation)
4. [Best Practices](#best-practices)
   - [Accessibility](#accessibility)
   - [Composability](#composability)
   - [Component Structure](#component-structure)
   - [Custom Events](#custom-events)
   - [Change Events](#change-events)
   - [Property vs CSS Custom Property](#property-vs-css-custom-property)
   - [CSS Custom Property vs CSS Part](#css-custom-property-vs-css-part)
5. [Coding Guidelines](#coding-guidelines)
   - [Naming](#naming)
   - [Attributes](#attributes)
   - [JavaScript](#javascript)
   - [CSS](#css)
   - [Comments](#comments)
   - [ESLint Rules](#eslint-rules)

---

## Contributing

WebKit is an inner source project where all engineers can use it and contribute to its development. Join the WebKit [community](https://leap.standardchartered.com/tsp/profile/community/567) to discuss ideas and ask for feedback.

### Ways to Contribute

- Submitting well-written bug reports
- Submitting feature requests that are within the scope of the project
- Improving the documentation
- Responding to users that need help in the community
- Being a developer advocate for the project
- Writing tests
- Sharing ideas
- Contributing code

---

### Feature Requests

Feature requests can be added at [http://go/scwebkit-ideas](http://go/scwebkit-ideas).

- **Do** search for an existing request before suggesting a new feature.
- **Do** use the voting buttons to vote for a feature.
- **Do** share substantial use cases and perspective that support new features if they haven't already been mentioned.
- **Do not** bump, spam, or ping contributors to prioritize your own feature.

Feature requests are reviewed regularly. Requesters will be notified when a feature is prioritized and a work item is created.

---

### Bug Reports

A bug is *a demonstrable problem* caused by code in the library. **A minimal test case is critical to a successful bug report** — it demonstrates that the bug exists in the library and not in surrounding code.

- **Do not** paste in large blocks of irrelevant code.
- **Do** search for an existing issue before creating a new one.
- **Do** explain the bug clearly.
- **Do** provide a minimal test case that demonstrates the bug.
- **Do** provide additional information, when necessary, to replicate the bug.

---

### Pull Requests

To keep the project on track, follow these guidelines before submitting a PR:

- **Do not** submit a PR without opening an ADO work item first.
- **Do** make sure your PR clearly defines what you're changing. PRs without detailed descriptions are subject to closure pending more details.
- **Do** open your PR against the `release/candidate` branch.
- **Do** follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) standard in your commit log.
- **Don't** pull the develop branch into your feature branch. Your feature branch should always be created from `release/candidate`.

**Branch workflow for conflict resolution:**

When your feature branch has conflicts with the develop branch, use the following approach:
- Keep `feature/develop` consistent with `release/develop`.
- Merge your feature code into `feature/develop`, then raise a PR from `feature/develop` to `release/develop`.
- `feature/candidate` is optional — you can create a PR from your feature branch directly to `release/candidate`.

---

## Developing

### Setup

Clone the repository and install dependencies:

```bash
git clone https://sc-ado@dev.azure.com/sc-ado/TTOQPR/_git/51213-sc-dev-web
cd 51213-sc-dev-web
npm install
```

### Demo Page

Run the dev server and access the demo page:

```bash
npm start
```

### Storybook

Launch Storybook:

```bash
npm run storybook
```

### Creating a New Component

1. Create a new component class under `src/components/` folder.
2. Update the dark and light theme variables in `themes/ScDarkTheme.css` and `themes/ScLightTheme.css`.
3. Create a new file `sc-xxx.ts` under the `elements/` folder to register the custom element.
4. Run `npm run format` (to fix ESLint issues) and `npm run build`.
5. Import the related JS file from the `dist/` folder once the build succeeds.
6. Use the component in HTML: `<sc-xxx></sc-xxx>`.

---

## Documentation

Keep documentation up to date as changes occur. Edge cases and gotchas should be called out with tips or warnings. Show the most relevant information first; less common examples go towards the bottom.

---

## Best Practices

### Accessibility

WebKit is built with accessibility in mind. Always strive to follow a11y guidelines. Accessibility starts with foundational components but is everyone's responsibility throughout the application.

### Composability

Components should be composable — easily reused with and within other components. This reduces library size, expedites feature development, and maintains a consistent user experience.

### Component Structure

All components have a host element (the `<sc-*>` element itself). Always set the host's `display` property:

```css
:host {
  display: block;
}
```

Avoid setting other styles on the host element — styles applied to it are not encapsulated. Instead, create a base wrapper element for internal styles, which also makes BEM usage more natural.

**Class member ordering:**

1. Static properties/methods
2. Private/public properties (non-reactive)
3. `@query` decorators
4. `@state` decorators
5. `@property` decorators
6. Lifecycle methods (`connectedCallback()`, `disconnectedCallback()`, `firstUpdated()`, etc.)
7. Private methods
8. `@watch` decorators
9. Public methods
10. The `render()` method

> Avoid the `public` keyword for class fields — it is too verbose. **Do** add `private` to any property or method intended to be private.

### Custom Events

- Components must only emit custom events.
- All custom events must start with `sc-` as a namespace.
- Use lowercase, kebab-style names for compatibility with DOM-template frameworks.

```
// correct
sc-change

// incorrect
scChange
```

### Change Events

- Change events should be named `sc-change`.
- Only emit them as a result of **user input** — not programmatic changes (e.g., `el.value = '…'` should not trigger `sc-change`).

### Property vs CSS Custom Property

| Use | For |
|-----|-----|
| Standard property | Changing component **behavior** |
| CSS custom property (variable) | Changing component **appearance** |

> Properties cannot respond to media queries, but CSS variables can.

### CSS Custom Property vs CSS Part

| Mechanism | Use when |
|-----------|----------|
| CSS variable | Scoped to host element; reused throughout component (e.g., `--border-width`) |
| CSS part | Target a specific shadow DOM element for direct style customization |

> Parts only allow styling of the part itself — not its children or siblings.

---

## Coding Guidelines

### Naming

| Type | Rule | Example |
|------|------|---------|
| JS Variable / Function | `camelCase` (lowercase start) | `userName` |
| JS Constant | `CONSTANT_CASE` (all caps, underscores) | `MAX_SIZE` |
| JS Class / Interface / Component | `UpperCamelCase` | `GroupButton` |
| CSS class / HTML attribute | All lowercase with dashes | `w-100`, `mt-3` |
| JS file | `camelCase` (singular) | `roleService.js` |
| Component file | `UpperCamelCase` | `GroupButton.js` |
| Folder | All lowercase with dashes | `text-editor` |
| Image | All lowercase with dashes | `header-background.svg` |

---

### Attributes

To ensure consistency, follow these conventions for component attributes.

#### Common

Components that expose these attributes should support all listed values:

- `size` — `xxs`, `xs`, `sm`, `md`, `lg`
- `type` — `default`, `primary`, `success`, `warning`, `error`
- `text align` — `left`, `center`, `right`, `justify`
- `vertical align` — `top`, `middle`, `bottom`
- `direction` — `horizontal`, `vertical`

#### User Input Components

Include these attributes where applicable:

`label`, `required`, `error`, `success`, `readonly`, `disabled`, `help text`, `placeholder`, `error message`, `success message`, `tooltip`, `border type`

#### Card Components

`title size`, `space size`, `layout`, `text align`, `vertical align`, `width`, `height`, `checked`, `disabled`, `title`, `body`, `sub-title`

#### Tag Components

`type` (`default`, `primary`, `success`, `warning`, `error`), `text align`, `fill`, `disabled`

#### Action Button Components

`type` (`default`, `warning`, `error`), `primary`, `disable`, `size` (`xxs`, `xs`, `sm`, `md`, `lg`), `width`, `loading`, `pill`

#### Overlay Components

`close when click outside`

---

### JavaScript

#### References

- Use `const` for all references; avoid `var`. ([prefer-const](https://eslint.org/docs/rules/prefer-const), [no-const-assign](https://eslint.org/docs/rules/no-const-assign))
- Use `let` only when you must reassign. ([no-var](https://eslint.org/docs/rules/no-var))
- Disallow unused variables. ([no-unused-vars](https://eslint.org/docs/rules/no-unused-vars))
- Define variables, classes, and functions before use. ([no-use-before-define](https://eslint.org/docs/latest/rules/no-use-before-define))

```js
// bad
var a = 1;

// good
const a = 1;
let count = 1; // only when reassignment is needed
```

#### Objects

- Use literal syntax for object creation. ([no-new-object](https://eslint.org/docs/rules/no-new-object))
- Use property value shorthand. ([object-shorthand](https://eslint.org/docs/rules/object-shorthand))
- Group shorthand properties at the beginning of object declarations.
- Only quote properties that are invalid identifiers. ([quote-props](https://eslint.org/docs/rules/quote-props))
- Prefer object spread over `Object.assign`. ([prefer-object-spread](https://eslint.org/docs/rules/prefer-object-spread))

```js
// bad
const item = new Object();
const obj = { lukeSkywalker: lukeSkywalker };
const copy = Object.assign({}, original, { c: 3 });

// good
const item = {};
const obj = { lukeSkywalker };
const copy = { ...original, c: 3 };
```

#### Arrays

- Use literal syntax for array creation. ([no-array-constructor](https://eslint.org/docs/rules/no-array-constructor))
- Use spread `...` to copy arrays.
- Use spread `...` to convert iterables to arrays (preferred over `Array.from`).
- Use line breaks after opening and before closing brackets in multiline arrays.

```js
// bad
const items = new Array();

// good
const items = [];
const itemsCopy = [...items];
```

#### Destructuring

- Use object destructuring when accessing multiple properties. ([prefer-destructuring](https://eslint.org/docs/rules/prefer-destructuring))
- Use array destructuring.

```js
// good
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}

const [first, second] = arr;
```

#### Strings

- Use single quotes `''` for strings. ([quotes](https://eslint.org/docs/rules/quotes))
- Use template strings for programmatic string building. ([prefer-template](https://eslint.org/docs/rules/prefer-template))

```js
// bad
const name = "Capt. Janeway";
return 'How are you, ' + name + '?';

// good
const name = 'Capt. Janeway';
return `How are you, ${name}?`;
```

#### Functions

- Use rest syntax `...` instead of `arguments`. ([prefer-rest-params](https://eslint.org/docs/rules/prefer-rest-params))
- Use default parameter syntax instead of mutating function arguments.
- Never reassign parameters. ([no-param-reassign](https://eslint.org/docs/rules/no-param-reassign))

```js
// bad
function concatenateAll() {
  const args = Array.prototype.slice.call(arguments);
  return args.join('');
}

// good
function concatenateAll(...args) {
  return args.join('');
}

// good — default params
function handleThings(opts = {}) { }
```

#### Modules

- Do not use wildcard imports.
- Only import from a path in one place. ([no-duplicate-imports](https://eslint.org/docs/rules/no-duplicate-imports))
- Do not export mutable bindings. ([import/no-mutable-exports](https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-mutable-exports.md))
- Put all imports at the top, above non-import statements. ([import/first](https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/first.md))
- Indent multiline imports like multiline arrays/objects. ([object-curly-newline](https://eslint.org/docs/rules/object-curly-newline))
- Do not include filename extensions in imports. ([import/extensions](https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/extensions.md))

```js
// bad
import * as Guide from './Guide';
import foo from './foo.js';

// good
import Guide from './Guide';
import foo from './foo';
```

#### Comparison Operators & Equality

- Use `===` and `!==` over `==` and `!=`. ([eqeqeq](https://eslint.org/docs/rules/eqeqeq))
- Use blocks `{}` in `case`/`default` clauses with lexical declarations. ([no-case-declarations](https://eslint.org/docs/rules/no-case-declarations))

```js
// bad
switch (foo) {
  case 1:
    const x = 1;
    break;
}

// good
switch (foo) {
  case 1: {
    const x = 1;
    break;
  }
}
```

#### Whitespace

- Use soft tabs set to **2 spaces**. ([indent](https://eslint.org/docs/rules/indent))
- Lines must not exceed **100 characters** (excluding long strings). ([max-len](https://eslint.org/docs/rules/max-len))
- Place 1 space before the leading brace. ([space-before-blocks](https://eslint.org/docs/rules/space-before-blocks))
- Place 1 space before `(` in control statements; no space between function name and `(`. ([keyword-spacing](https://eslint.org/docs/rules/keyword-spacing))
- Set off operators with spaces. ([space-infix-ops](https://eslint.org/docs/rules/space-infix-ops))
- No spaces inside parentheses. ([space-in-parens](https://eslint.org/docs/rules/space-in-parens))
- No spaces inside brackets. ([array-bracket-spacing](https://eslint.org/docs/rules/array-bracket-spacing))
- Spaces inside curly braces. ([object-curly-spacing](https://eslint.org/docs/rules/object-curly-spacing))
- Consistent spacing inside block tokens. ([block-spacing](https://eslint.org/docs/rules/block-spacing))
- No spaces inside computed property brackets. ([computed-property-spacing](https://eslint.org/docs/rules/computed-property-spacing))
- No spaces between functions and their invocations. ([func-call-spacing](https://eslint.org/docs/rules/func-call-spacing))
- Spaces between keys and values in object literals. ([key-spacing](https://eslint.org/docs/rules/key-spacing))

```js
// bad
const x=y+5;
function test(){ }
if(isJedi) { fight (); }

// good
const x = y + 5;
function test() { }
if (isJedi) { fight(); }
```

#### Commas

- Use trailing commas. ([comma-dangle](https://eslint.org/docs/rules/comma-dangle))

```js
// good
const hero = {
  firstName: 'Dana',
  lastName: 'Scully',
};
```

#### Semicolons

- Always use semicolons. ([semi](https://eslint.org/docs/rules/semi))

```js
// bad — ASI can misinterpret this
function foo() {
  return
    'value'
}

// good
function foo() {
  return 'value';
}
```

#### Chaining

- `no-unsafe-optional-chaining` — Do not use optional chaining in contexts where `undefined` is not allowed.

---

### CSS

| Rule | Details | Good | Bad |
|------|---------|------|-----|
| Use Sass | — | — | — |
| Flexible/relative units | Use `em`, `rem`, `%`, viewport units | — | — |
| `!important` | Last resort only — when there is no other way to override | — | — |
| CSS comments | `/* This is a CSS-style comment */` | — | — |
| Double quotes around values | Use `"` in attribute selectors and `url()` | `url("img.png")` | `url('img.png')` |
| Selectors | Do not use ID selectors | `.editorial-summary { }` | `#editorial-summary { }` |
| Turning off properties | Use `0` rather than `none` | `border: 0;` | `border: none;` |

---

### Comments

#### Implementation Code

| Type | Format | Notes |
|------|--------|-------|
| Multi-line | `/* \n * This is \n * okay. \n */` | Start all comments with a space |
| Single-line | `// This is for testing` | Start all comments with a space |
| TODO | `// TODO: to annotate solutions to problems` | — |
| FIXME | `// FIXME: to annotate problems` | — |
| Class / Function / Params / Modules / Interface | `/** This is JSDoc comment */` | Must start with `/**` |

#### Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) standard:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

| Type | Description |
|------|-------------|
| `build` | Changes affecting the build system or external dependencies |
| `ci` | Changes to CI configuration files and scripts |
| `docs` | Documentation-only changes |
| `feat` | A new feature |
| `fix` | A bug fix |
| `perf` | A code change that improves performance |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `style` | Changes that do not affect code meaning (whitespace, formatting, etc.) |
| `test` | Adding or correcting tests |
| `chore` | Files outside `src/` and `test/` folders |
| `feat!` / `<type>!` | Breaking change — use `!` to draw attention |

**Example:**
```
feat!: send an email to the customer when a product is shipped
```

---

### ESLint Rules

The following ESLint rules are enforced in this project:

| Rule | Notes / Example |
|------|-----------------|
| `for-direction` | — |
| `getter-return` | — |
| `no-async-promise-executor` | — |
| `no-await-in-loop` | — |
| `no-compare-neg-zero` | — |
| `no-cond-assign` | Bad: `if(user.jobTitle = 'manager'){}` |
| `no-console` | — |
| `no-constant-condition` | Bad: `if(false) {}` |
| `no-control-regex` | — |
| `no-debugger` | — |
| `no-dupe-args` | — |
| `no-dupe-keys` | — |
| `no-duplicate-case` | — |
| `no-empty` | Bad: `if(foo){}` |
| `no-empty-character-class` | — |
| `no-ex-assign` | — |
| `no-extra-boolean-cast` | — |
| `no-extra-semi` | Bad: `field;;` |
| `no-func-assign` | — |
| `no-inner-declarations` | Bad: `if(foo){ function f() {} }` |
| `no-invalid-regexp` | — |
| `no-irregular-whitespace` | — |
| `no-unexpected-multiline` | Good: `var foo = bar;` `(1 \|\| 2).baz()` — Bad: `var foo = bar` `(1 \|\| 2).baz()` |
| `no-unreachable` | Bad: code after `return` |
| `no-unsafe-negation` | Good: `if(!(key in object)){}` — Bad: `if(!key in object){}` |
| `use-isnan` | — |
| `valid-typeof` | — |
| `no-case-declarations` | Use `{}` blocks in `switch` cases |
| `default-case` | — |
| `eqeqeq` | Good: `a === 12` — Bad: `a == 12` |
| `no-const-assign` | — |
| `prefer-const` | — |
| `no-var` | — |
| `no-unused-vars` | — |
| `no-use-before-define` | — |
| `spaced-comment` | — |
| `space-infix-ops` | Good: `const x = y + 5;` — Bad: `const x=y+5;` |
| `space-in-parens` | No spaces inside parens |
| `quote-props` | — |
| `prefer-object-spread` | — |
| `no-array-constructor` | — |
| `prefer-destructuring` | — |
| `quotes` | — |
| `prefer-template` | — |
| `template-curly-spacing` | — |
| `prefer-rest-params` | — |
| `no-param-reassign` | — |
| `no-duplicate-imports` | — |
| `import/no-mutable-exports` | — |
| `import/first` | — |
| `object-curly-newline` | — |
| `import/extensions` | — |
| `indent` | 2 spaces |
| `max-len` | 100 characters |
| `space-before-blocks` | — |
| `keyword-spacing` | — |
| `array-bracket-spacing` | — |
| `object-curly-spacing` | — |
| `block-spacing` | — |
| `computed-property-spacing` | — |
| `func-call-spacing` | — |
| `key-spacing` | — |
| `comma-dangle` | — |
| `semi` | — |
| `no-unsafe-optional-chaining` | — |

---

*Sources: [SC WebKit Contributing](https://confluence.global.standardchartered.com/display/TSDIGITAL/SC+WebKit+Contributing) · [SC WebKit Coding Guidelines](https://confluence.global.standardchartered.com/display/TSDIGITAL/SC+WebKit+Coding+Guidelines)*
