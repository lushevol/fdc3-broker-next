# ScTree Component — Manual Test Cases

Demo page: `demo/pageT.html` → **Tree** section  
Storybook: `Components/Tree`

---

## Component Properties Reference

| Property | Type | Default | Description |
|---|---|---|---|
| `data` | `TreeItem[]` | `[]` | Tree data array |
| `selection` | `'single' \| 'multiple'` | `'single'` | Selection mode |
| `selected` | `string` | `undefined` | Selected value (single mode) |
| `selectedItems` | `string[]` | `[]` | Selected values (multiple mode) |
| `show-indent-lines` | `boolean` | `false` | Show vertical indent guide lines |
| `draggable` | `boolean` | `false` | Enable drag-and-drop reordering |
| `loadChildren` | `Function` | `undefined` | Async function to load child nodes |
| `refresh` | `boolean` | `false` | Force refresh on lazy load |
| `actionRenderer` | `(context: ActionsContext) => TemplateResult \| string` | `undefined` | Per-node action buttons rendered flush-right |
| `show-actions` | `'hover' \| 'always'` | `'hover'` | When to reveal per-node action buttons |

## Events

| Event | Detail | Description |
|---|---|---|
| `sc-select` | `{ value: string \| string[] }` | Fired when selection changes |
| `sc-drop` | `{ sourceValue, targetValue, position, data }` | Fired after a successful drop |
| `sc-loaded` | `{ value, children }` | Fired after lazy children load |
| `sc-error` | `{ value, error }` | Fired when lazy load fails |
| `sc-edit-save` | `{ currentNode, newLabel, cancel() }` | Fired when user confirms inline edit (Enter / blur) |
| `sc-edit-cancel` | `{ value }` | Fired when user cancels inline edit (Escape / empty label) |

## Public Methods

| Method | Description |
|---|---|
| `startEditing(value: string)` | Opens the inline edit input for the node with the given value |

---

## TC-01 — Basic Rendering

### TC-01-1: Renders flat tree with string labels

**Preconditions:** None  
**Steps:**
1. Render `<sc-tree>` with a flat array of nodes, each having `value` and `label` (string)

**Expected:**
- Each node label is visible
- No expand/collapse arrows (no children)
- No indent guide lines

---

### TC-01-2: Renders nested tree with children

**Preconditions:** Data has parent nodes with `children` arrays  
**Steps:**
1. Render `<sc-tree>` with nested data (depth ≥ 2)
2. Observe initial render

**Expected:**
- Parent nodes show expand/collapse toggle
- Child nodes are visible when `expanded: true` on parent
- Child nodes are hidden when `expanded: false` on parent

---

### TC-01-3: Renders prefix icons

**Preconditions:** Nodes have `prefixIcon` set (e.g. `'folder--line'`, `'file-text--line'`)  
**Steps:**
1. Render tree with nodes that have `prefixIcon` values

**Expected:**
- Icons appear to the left of the label for each node that has `prefixIcon`
- Nodes without `prefixIcon` show no icon

---

### TC-01-4: Renders with `show-indent-lines`

**Preconditions:** Nested tree data  
**Steps:**
1. Render `<sc-tree show-indent-lines>` with nested data

**Expected:**
- Vertical indent guide lines are visible connecting parent to children
- Lines align with child node indentation

---

### TC-01-5: Renders function labels

**Preconditions:** Some nodes have `label` as a function returning a template  
**Steps:**
1. Render tree where some nodes have `label: (ctx) => html\`<strong>${ctx.item.value}</strong>\``

**Expected:**
- Custom HTML renders correctly inside the tree item row
- The render context `ctx.tree` is the ScTree instance
- The render context `ctx.selected` reflects whether the node is selected

---

### TC-01-6: Renders disabled nodes

**Preconditions:** One or more nodes have `disabled: true`  
**Steps:**
1. Render tree with a disabled node
2. Click the disabled node

**Expected:**
- Disabled node appears visually greyed out
- Clicking a disabled node does not change selection
- `sc-select` event is not fired

---

## TC-02 — Single Selection

### TC-02-1: Selects a node on click

**Preconditions:** `selection="single"`, no initial `selected` value  
**Steps:**
1. Click any visible leaf node

**Expected:**
- Node becomes visually highlighted / selected
- `sc-select` event fires with `detail.value === node.value`
- `el.selected` property equals the clicked node's `value`

---

### TC-02-2: Switches selection on second click

**Preconditions:** One node already selected  
**Steps:**
1. Click a different node

**Expected:**
- First node is deselected
- New node is selected
- `sc-select` fires with new value

---

### TC-02-3: Reflects initial `selected` property

**Preconditions:** Tree rendered with `selected="node-1"`  
**Steps:**
1. Observe initial render

**Expected:**
- Node with `value === 'node-1'` appears selected on load
- No `sc-select` event fires during initial render

---

### TC-02-4: Deselects when clicking selected node

**Preconditions:** One node selected  
**Steps:**
1. Click the currently selected node

**Expected:**
- Node is deselected
- `sc-select` fires with `detail.value === null` (or empty)
- `el.selected` becomes `null` / `undefined`

---

## TC-03 — Multiple Selection

### TC-03-1: Selects multiple nodes via checkbox

**Preconditions:** `selection="multiple"`  
**Steps:**
1. Click checkbox on Node A
2. Click checkbox on Node B

**Expected:**
- Both nodes show checked checkboxes
- `sc-select` fires after each click
- `el.selectedItems` contains both values

---

### TC-03-2: Parent auto-checks when all children selected

**Preconditions:** `selection="multiple"`, parent has 3 children  
**Steps:**
1. Check all 3 children individually

**Expected:**
- Parent checkbox becomes fully checked (not indeterminate)

---

### TC-03-3: Parent shows indeterminate when some children selected

**Preconditions:** `selection="multiple"`, parent has 3 children  
**Steps:**
1. Check only 1 or 2 of the children

**Expected:**
- Parent checkbox shows indeterminate state (dash icon)

---

### TC-03-4: Checking parent selects all children

**Preconditions:** `selection="multiple"`, parent with children  
**Steps:**
1. Click the parent node's checkbox

**Expected:**
- All children become checked
- Parent is fully checked
- `el.selectedItems` contains parent + all children values

---

### TC-03-5: Reflects initial `selectedItems` property

**Preconditions:** Tree rendered with `.selectedItems=${['node-1', 'node-3']}`  
**Steps:**
1. Observe initial render

**Expected:**
- Nodes `node-1` and `node-3` show checked checkboxes on load

---

## TC-04 — Expand / Collapse

### TC-04-1: Expands a collapsed node

**Preconditions:** Tree has a parent node with `expanded: false`  
**Steps:**
1. Click the expand toggle (arrow) on the collapsed parent

**Expected:**
- Children slide into view (animated)
- Arrow rotates to "expanded" state
- Children are rendered in the DOM

---

### TC-04-2: Collapses an expanded node

**Preconditions:** Tree has a parent node with `expanded: true`  
**Steps:**
1. Click the collapse toggle on the expanded parent

**Expected:**
- Children slide out of view
- Arrow rotates to "collapsed" state

---

## TC-05 — Lazy Loading

### TC-05-1: Shows lazy indicator for unloaded children

**Preconditions:** Node has `hasChildren: true` and `childrenLoaded: false`, no `children` array  
**Steps:**
1. Render the tree
2. Observe the node

**Expected:**
- Node shows expand arrow without any children rendered
- Node is in "lazy" state (no children in DOM yet)

---

### TC-05-2: Loads children on expand

**Preconditions:** `loadChildren` function is provided, node has `hasChildren: true, childrenLoaded: false`  
**Steps:**
1. Click the expand toggle on a lazy node

**Expected:**
- `loadChildren` is called with the node's data
- A loading indicator may appear while loading
- After promise resolves, children appear under the node
- `sc-loaded` event fires with `detail.value` and `detail.children`
- Node `childrenLoaded` becomes `true` (not re-fetched on second expand)

---

### TC-05-3: Does not re-fetch already loaded children

**Preconditions:** Node was previously expanded and children loaded  
**Steps:**
1. Collapse the node
2. Expand the node again

**Expected:**
- `loadChildren` is NOT called a second time
- Existing children render immediately

---

### TC-05-4: Emits `sc-error` when load fails

**Preconditions:** `loadChildren` rejects with an error  
**Steps:**
1. Click expand on a lazy node

**Expected:**
- `sc-error` event fires with `detail.error`
- Tree remains in a usable state (no crash)

---

### TC-05-5: No crash when `loadChildren` is not provided

**Preconditions:** Node has `hasChildren: true` but no `loadChildren` prop  
**Steps:**
1. Click expand on the lazy node

**Expected:**
- No JavaScript error thrown
- Tree remains in a usable state

---

## TC-06 — Drag and Drop (`draggable`)

> All TC-06 tests require `draggable` attribute set on `<sc-tree>`.

### TC-06-1: Drag cursor appears on hover

**Preconditions:** `draggable` is set  
**Steps:**
1. Hover over any tree item

**Expected:**
- Cursor changes to `grab` / `move`
- No visual change until drag starts

---

### TC-06-2: Dragging a node — visual feedback

**Preconditions:** `draggable` is set  
**Steps:**
1. Click and hold a node, begin dragging it

**Expected:**
- Dragged node gets a `.dragging` visual style (slightly faded)
- A drag ghost image follows the cursor

---

### TC-06-3: Drop indicator — "before" position

**Preconditions:** `draggable` is set  
**Steps:**
1. Start dragging Node A
2. Hover over the TOP 30% of Node B

**Expected:**
- A horizontal line indicator appears **above** Node B
- Indicator is labelled/styled as `drag-over-before`

---

### TC-06-4: Drop indicator — "inside" position

**Preconditions:** `draggable` is set  
**Steps:**
1. Start dragging Node A
2. Hover over the MIDDLE zone of Node B (between 30%–70% of its height)

**Expected:**
- Node B gets a highlighted "inside" style (`drag-over-inside`)
- Indicator shows intent to make Node A a child of Node B

---

### TC-06-5: Drop indicator — "after" position

**Preconditions:** `draggable` is set  
**Steps:**
1. Start dragging Node A
2. Hover over the BOTTOM 30% of Node B

**Expected:**
- A horizontal line indicator appears **below** Node B
- Indicator is labelled/styled as `drag-over-after`

---

### TC-06-6: Drop indicator hysteresis (no flicker)

**Preconditions:** `draggable` is set  
**Steps:**
1. Start dragging a node
2. Hover slowly across a boundary (e.g. from "before" zone toward "inside" zone)

**Expected:**
- The indicator does NOT flicker between "before" and "inside" at the boundary
- It commits to the new zone only after moving ~6 px past the boundary

---

### TC-06-7: Drop "before" — moves node before target

**Preconditions:** `draggable`, tree has siblings `[A, B, C]` at same level  
**Steps:**
1. Drag Node C to the "before" zone of Node A

**Expected:**
- `sc-drop` fires with `position: 'before'`
- Tree reorders to `[C, A, B]`
- `sc-drop` detail contains `data` reflecting the updated tree

---

### TC-06-8: Drop "after" — moves node after target

**Preconditions:** `draggable`, tree has siblings `[A, B, C]`  
**Steps:**
1. Drag Node A to the "after" zone of Node C

**Expected:**
- `sc-drop` fires with `position: 'after'`
- Tree reorders to `[B, C, A]`

---

### TC-06-9: Drop "inside" — makes node a child

**Preconditions:** `draggable`, Node B has existing children  
**Steps:**
1. Drag Node A to the "inside" zone of Node B

**Expected:**
- `sc-drop` fires with `position: 'inside'`
- Node A is appended as the **last** child of Node B
- Node B is auto-expanded if it was collapsed

---

### TC-06-10: Cannot drop a node onto itself

**Preconditions:** `draggable`  
**Steps:**
1. Drag Node A
2. Hover back over Node A itself

**Expected:**
- No drop indicator is shown on Node A
- Releasing the mouse does nothing; `sc-drop` is NOT fired

---

### TC-06-11: Cannot drop parent into its own descendant

**Preconditions:** `draggable`, Node A has child Node A-1  
**Steps:**
1. Drag Node A
2. Hover over Node A-1 ("inside" zone)
3. Release

**Expected:**
- `sc-drop` is NOT fired
- Tree is unchanged

---

### TC-06-12: Drag indicator clears on drag leave

**Preconditions:** `draggable`  
**Steps:**
1. Drag a node and hover over Node B (indicator appears)
2. Move the cursor away from Node B (not onto another node)

**Expected:**
- The drop indicator on Node B disappears
- No indicator is shown anywhere

---

### TC-06-13: Drag state resets on drag end (drop outside)

**Preconditions:** `draggable`  
**Steps:**
1. Start dragging a node
2. Release outside the tree (no valid drop target)

**Expected:**
- `.dragging` class is removed from the dragged node
- No indicator remains on any node
- Tree data is unchanged
- `sc-drop` is NOT fired

---

### TC-06-14: Auto-expand on "inside" hover

**Preconditions:** `draggable`, Node B is collapsed and has children  
**Steps:**
1. Drag any node
2. Hover over the "inside" zone of collapsed Node B
3. Hold for ≥ 600 ms without moving

**Expected:**
- Node B automatically expands
- Children become visible
- Drop indicator remains on Node B

---

### TC-06-15: Auto-expand cancels on cursor leave

**Preconditions:** `draggable`, hovering "inside" collapsed node (expand timer running)  
**Steps:**
1. Hover over "inside" zone of Node B (timer starts)
2. Move cursor away before 600 ms

**Expected:**
- Node B does NOT expand
- No side effect from the cancelled timer

---

### TC-06-16: Drag-and-drop with `selection="multiple"` — selection preserved

**Preconditions:** `draggable`, `selection="multiple"`, some nodes are selected  
**Steps:**
1. Note which nodes are checked
2. Drag one node to a new position
3. Drop it

**Expected:**
- `sc-drop` fires
- Previously checked nodes remain checked after the drop
- `sc-select` fires with updated `selectedItems` reflecting the moved structure

---

### TC-06-17: Lazy node only allows "before"/"after" (not "inside")

**Preconditions:** `draggable`, Node B has `hasChildren: true, childrenLoaded: false`  
**Steps:**
1. Drag any node
2. Hover over the middle zone of Node B (lazy node)

**Expected:**
- Indicator shows "before" or "after" only — never "inside"
- The "inside" zone is not available for lazy nodes

---

## TC-07 — Edge Cases

### TC-07-1: Empty data renders nothing

**Preconditions:** None  
**Steps:**
1. Render `<sc-tree .data=${[]}>`

**Expected:**
- Tree renders without error
- No items visible
- No JavaScript errors in console

---

### TC-07-2: Updating `data` prop re-renders tree

**Preconditions:** Tree is rendered with initial data  
**Steps:**
1. Change the `data` property to a new array

**Expected:**
- Tree re-renders with the new data
- Selection state resets / reflects new `selected` / `selectedItems`

---

### TC-07-3: Changing `selected` prop updates highlighted node

**Preconditions:** Tree rendered with `selection="single"`  
**Steps:**
1. Change `el.selected = 'other-node'` programmatically

**Expected:**
- New node becomes highlighted
- Previous node is deselected

---

### TC-07-4: Changing `selectedItems` prop updates checkboxes

**Preconditions:** Tree rendered with `selection="multiple"`  
**Steps:**
1. Change `el.selectedItems = ['node-2', 'node-3']` programmatically

**Expected:**
- Node-2 and Node-3 show checked checkboxes
- Previously checked nodes (if any) are unchecked

---

### TC-07-5: Label function that throws does not crash tree

**Preconditions:** One node has `label: () => { throw new Error('oops') }`  
**Steps:**
1. Render the tree

**Expected:**
- Console shows an error message
- Tree renders the other nodes normally (no complete crash)

---

### TC-07-6: Deep nesting (5+ levels) renders correctly

**Preconditions:** Data with 5+ levels of nesting  
**Steps:**
1. Render tree
2. Expand all levels one by one

**Expected:**
- Each level indents correctly
- Expand/collapse works at every level
- No layout overflow or wrapping issues

---

## TC-08 — Accessibility

### TC-08-1: Keyboard navigation — arrow keys

**Preconditions:** Tree is rendered with multiple nodes  
**Steps:**
1. Focus the tree (Tab key)
2. Press `ArrowDown` / `ArrowUp`

**Expected:**
- Focus moves between tree items
- Focused item is visually indicated

---

### TC-08-2: Keyboard expand/collapse — arrow keys

**Preconditions:** Focus is on a collapsed parent node  
**Steps:**
1. Press `ArrowRight` to expand
2. Press `ArrowLeft` to collapse

**Expected:**
- Node expands/collapses accordingly

---

### TC-08-3: Keyboard selection — Enter / Space

**Preconditions:** `selection="single"`, focus on a node  
**Steps:**
1. Press `Enter` or `Space`

**Expected:**
- Node is selected
- `sc-select` event fires

---

### TC-08-4: ARIA roles are set correctly

**Preconditions:** Tree is rendered  
**Steps:**
1. Inspect the DOM using browser DevTools or accessibility tools

**Expected:**
- Tree container has `role="tree"`
- Each item has `role="treeitem"`
- `aria-expanded` is present on expandable nodes
- `aria-selected` reflects the selection state

---

## TC-09 — `actionRenderer` — Hover Actions

> All TC-09 tests require `actionRenderer` to be set on the tree.

### TC-09-1: Actions hidden by default (`show-actions="hover"`)

**Preconditions:** `actionRenderer` is set, `show-actions` is default (`hover`)  
**Steps:**
1. Render the tree and observe without moving the mouse

**Expected:**
- No action buttons are visible on any row

---

### TC-09-2: Actions appear only on the directly hovered row

**Preconditions:** `actionRenderer` is set, nested tree  
**Steps:**
1. Hover over a leaf node

**Expected:**
- Action buttons appear on the hovered leaf row only
- Parent and grandparent rows do NOT show their action buttons

---

### TC-09-3: Parent hover does not show child actions

**Preconditions:** `actionRenderer` is set, nested tree  
**Steps:**
1. Hover over a parent node (without hovering any of its children)

**Expected:**
- Action buttons appear on the parent row only
- Child rows remain without visible action buttons

---

### TC-09-4: Actions stay visible while focused (dropdown open)

**Preconditions:** `actionRenderer` renders a dropdown; `show-actions="hover"`  
**Steps:**
1. Hover over a row to reveal action buttons
2. Click to open a dropdown inside the actions area
3. Move the mouse off the row

**Expected:**
- Action buttons remain visible while focus is inside the actions area (focus-within)
- Actions hide once the dropdown closes and focus leaves the row

---

### TC-09-5: `show-actions="always"` keeps all actions visible

**Preconditions:** `show-actions="always"` attribute set on the tree  
**Steps:**
1. Render the tree without hovering

**Expected:**
- All rows show their action buttons without any hover
- Buttons are visually fully opaque AND clickable (pointer-events active)

---

### TC-09-6: Action click does not select the node

**Preconditions:** `actionRenderer` is set, `selection="single"`  
**Steps:**
1. Hover a row to reveal actions
2. Click an action button (e.g. `+` or `···`)

**Expected:**
- `sc-select` is NOT fired
- Tree selection does not change

---

### TC-09-7: `actionRenderer` receives correct context

**Preconditions:** `actionRenderer` logs `currentNode`, `parentNode`, `tree` to console  
**Steps:**
1. Render tree with nested data
2. Open browser console and hover / inspect rendered actions

**Expected:**
- `currentNode.value` matches the hovered node
- `parentNode` is `null` for root nodes; the parent node object for nested nodes
- `tree` is the `<sc-tree>` element instance

---

## TC-10 — Inline Editing (`startEditing` / `sc-edit-save` / `sc-edit-cancel`)

### TC-10-1: Edit input opens on `startEditing()`

**Preconditions:** Tree is rendered with data  
**Steps:**
1. Call `tree.startEditing('node-value')` programmatically, or click a Rename button in `actionRenderer`

**Expected:**
- The node's label text is replaced by a focused `<input>` element
- The input is pre-filled with the node's current label text
- The input text is selected (ready to type)

---

### TC-10-2: Only one node edits at a time

**Preconditions:** Node A is currently in edit mode  
**Steps:**
1. Call `tree.startEditing('node-B')`

**Expected:**
- Node A's input closes without saving (edit cancelled silently)
- Node B opens for edit
- `sc-edit-cancel` fires for Node A

---

### TC-10-3: Confirm edit with Enter

**Preconditions:** A node is in edit mode  
**Steps:**
1. Clear the input and type a new label (e.g. `New Name`)
2. Press **Enter**

**Expected:**
- `sc-edit-save` fires with `detail.currentNode`, `detail.newLabel === 'New Name'`, and a `detail.cancel` function
- Input closes and the node label updates to `'New Name'`

---

### TC-10-4: Cancel edit with Escape

**Preconditions:** A node is in edit mode  
**Steps:**
1. Change the text in the input
2. Press **Escape**

**Expected:**
- `sc-edit-cancel` fires with `detail.value` matching the node's value
- Input closes; node label reverts to the original text

---

### TC-10-5: Confirm edit on blur (click elsewhere)

**Preconditions:** A node is in edit mode  
**Steps:**
1. Change the text in the input
2. Click anywhere outside the input (another node, blank area)

**Expected:**
- `sc-edit-save` fires (same as pressing Enter)
- Input closes; label updates

---

### TC-10-6: Empty label silently cancels

**Preconditions:** A node is in edit mode  
**Steps:**
1. Clear the entire input (empty string)
2. Press **Enter** (or click away)

**Expected:**
- `sc-edit-save` is NOT fired
- `sc-edit-cancel` fires
- Input closes; label unchanged

---

### TC-10-7: `cancel()` keeps the edit open

**Preconditions:** `sc-edit-save` handler calls `e.detail.cancel()`  
**Steps:**
1. Start editing a node
2. Type a name and press Enter
3. In the `sc-edit-save` handler, call `cancel()`

**Expected:**
- Input remains open; node stays in edit mode
- Label has not changed

---

### TC-10-8: Enter does not fire `sc-edit-save` twice

**Preconditions:** A node is in edit mode  
**Steps:**
1. Type a new name and press **Enter**
2. Count how many times `sc-edit-save` fires (listen in console)

**Expected:**
- `sc-edit-save` fires exactly **once**
- The subsequent `blur` event (caused by input unmounting) does NOT fire a second `sc-edit-save`

---

### TC-10-9: `data` update preserves `isEditing` state

**Preconditions:** `actionRenderer` is set; a node is currently in edit mode  
**Steps:**
1. Start editing Node A
2. While the input is open, set `tree.data = JSON.parse(JSON.stringify(actionData))` programmatically (simulating an external data refresh)

**Expected:**
- Node A's edit input remains open and focused
- The tree re-renders the other nodes from the new data without cancelling the active edit

---

### TC-10-10: Drag is blocked while a node is in edit mode

**Preconditions:** `draggable` is set; a node is currently in edit mode  
**Steps:**
1. Start editing any node
2. Try to drag another node (or the editing node itself)

**Expected:**
- Drag does NOT start
- The editing input remains focused and unaffected
- `sc-drop` is NOT fired

---

## TC-11 — Add / Delete with `actionRenderer` (demo/pageT.html)

> These tests use the **Action Tree** demo section in `demo/pageT.html`.

### TC-11-1: Add sibling node

**Preconditions:** Action tree is rendered  
**Steps:**
1. Click the `+` icon on any node (e.g. "Contact")
2. Wait ~1 second (simulated backend delay)

**Expected:**
- A new "New page" node appears as a **sibling** of the clicked node (same level)
- The new node immediately opens in inline edit mode

---

### TC-11-2: Add node — error case

**Preconditions:** "Error node" row is visible  
**Steps:**
1. Click the `+` icon on the "Error node" row
2. Wait ~1 second

**Expected:**
- Error toast is shown
- No new node is inserted into the tree

---

### TC-11-3: Confirm new node name

**Preconditions:** A new node has been added and is in edit mode  
**Steps:**
1. Type a unique name (e.g. `My Page`)
2. Press **Enter**

**Expected:**
- `sc-edit-save` fires; node label updates to `My Page`
- Tree data is updated; node persists with the new name

---

### TC-11-4: Duplicate sibling name rejected on save

**Preconditions:** A new node is in edit mode; a sibling already has the same name  
**Steps:**
1. Type a name that matches an existing sibling node
2. Press **Enter**

**Expected:**
- Error toast shown: `"<name>" already exists at this level.`
- Edit input stays open; name not saved

---

### TC-11-5: Delete node

**Preconditions:** A deletable node exists  
**Steps:**
1. Click `···` (more actions) on a deletable node
2. Click **Delete**
3. Wait ~1 second (simulated backend delay)

**Expected:**
- Node is removed from the tree
- Success toast appears with an **Undo** link

---

### TC-11-6: Undo delete

**Preconditions:** A node was just deleted (success toast is visible)  
**Steps:**
1. Click the **Undo** link in the toast

**Expected:**
- The deleted node (and any children) is restored to its original position
- A second success toast confirms the revert
- Tree matches the pre-delete state

---

### TC-11-7: Delete — error case

**Preconditions:** "Error node" row is visible  
**Steps:**
1. Click `···` → **Delete** on the "Error node"
2. Wait ~1 second

**Expected:**
- Error toast is shown
- Node is NOT removed from the tree

---

### TC-11-8: Delete blocked for protected node

**Preconditions:** "Not deletable" node is visible  
**Steps:**
1. Click `···` on the "Not deletable" node
2. Observe the **Delete** option in the dropdown

**Expected:**
- Delete option appears visually disabled (greyed out)
- Clicking it does nothing; node is NOT removed

---

### TC-11-9: Delete blocked for root node

**Preconditions:** A root-level node (e.g. "Home", "Blog") is visible  
**Steps:**
1. Click `···` on a root node

**Expected:**
- Delete option appears visually disabled (no parent)
- Node cannot be deleted

---

### TC-11-10: Rename via menu

**Preconditions:** Any node is visible  
**Steps:**
1. Click `···` → **Rename** on any node

**Expected:**
- Inline edit input opens immediately (no async delay)
- Input is pre-filled with the node's current label

---

### TC-11-11: Add node after drag reorder

**Preconditions:** Action tree with draggable enabled  
**Steps:**
1. Drag a node (e.g. "About us") to a new position (e.g. inside "Blog")
2. After the drop, click `+` on another node (e.g. "Contact")

**Expected:**
- `sc-drop` listener has updated `actionData` from `e.detail.data`
- New sibling node appears at the **correct** level next to "Contact"
- Node is NOT misplaced at a wrong parent level

---

## TC-12 — `sc-drop` Event & Data Sync

### TC-12-1: `e.detail.data` is the full updated tree

**Preconditions:** `draggable` is set; `sc-drop` listener logs `e.detail`  
**Steps:**
1. Perform any drag-and-drop operation
2. Inspect the console output

**Expected:**
- `e.detail.data` is a complete `TreeItem[]` array
- The moved node appears in its new position in the array
- All other nodes are unchanged

---

### TC-12-2: `e.detail.position` values

**Preconditions:** `draggable` is set  
**Steps:**
1. Drop a node ABOVE a target → check `e.detail.position`
2. Drop a node ON a target → check `e.detail.position`
3. Drop a node BELOW a target → check `e.detail.position`

**Expected:**
- Position is `'before'`, `'inside'`, or `'after'` respectively

---

### TC-12-3: Feed data back to tree

**Preconditions:** `sc-drop` handler sets `tree.data = e.detail.data`  
**Steps:**
1. Perform a drag-and-drop
2. Observe the tree after drop

**Expected:**
- Tree renders the new order persistently
- No second drop reverts to old order

---

### TC-12-4: `actionData` synced after drag (demo)

**Preconditions:** `sc-drop` listener on the demo action tree sets `actionData = e.detail.data`  
**Steps:**
1. Drag "About us" inside "Blog"
2. Click `+` on "Contact"

**Expected:**
- New sibling appears next to "Contact" under "Home"
- "About us" remains under "Blog" (structure is stable)

---

## TC-13 — Performance

> These tests target correctness under large data and high-frequency events.  
> Use browser DevTools **Performance** tab to record timings where noted.

### TC-13-1: Large flat tree renders without blocking

**Preconditions:** None  
**Steps:**
1. Set `tree.data` to a flat array of **500 nodes** (no children)
2. Record render time in DevTools

**Expected:**
- Tree renders without a visible freeze
- No frame drops (no single JS task > ~50 ms in the Performance trace)

---

### TC-13-2: Large nested tree — `initializeTreeData` is O(n), not O(n²)

**Preconditions:** None  
**Steps:**
1. Set `tree.data` to a tree with **200 parent nodes × 20 children** (4 000 total nodes)
2. Re-assign `tree.data` with the same dataset 5 times and record duration

**Expected:**
- Each `data` update takes roughly the same time regardless of dataset size doubling
- No quadratic growth in update time (fix: `Map`-based lookup in `initializeTreeData`)

---

### TC-13-3: Large multiple-selection tree — `updateSelectedState` is O(n), not O(n²)

**Preconditions:** `selection="multiple"`, 500+ nodes  
**Steps:**
1. Set `selectedItems` to an array of 100 values spread across the tree
2. Change `selectedItems` programmatically 10 times
3. Profile with DevTools

**Expected:**
- Each `selectedItems` update does not slow down with tree size
- No O(n²) behaviour (fix: `Set`-based lookup replaces `Array.includes`)

---

### TC-13-4: Rapid `dragover` events do not stutter

**Preconditions:** `draggable` is set, tree has 50+ nodes  
**Steps:**
1. Start dragging a node
2. Move the cursor quickly back and forth over the tree for ~3 seconds
3. Check the Performance trace for long tasks

**Expected:**
- Indicator updates are debounced via `requestAnimationFrame` (at most 1 DOM update per frame)
- No JavaScript tasks longer than ~16 ms during continuous dragging

---

### TC-13-5: `flattenTree` does not allocate O(n²) intermediate arrays

**Preconditions:** `draggable` is set, tree has 200+ nodes  
**Steps:**
1. Perform 20 drag-and-drop operations on a large tree
2. Open DevTools **Memory** tab and take a heap snapshot before and after

**Expected:**
- No large intermediate array accumulation visible in the heap
- Heap growth is proportional to the number of operations, not to tree size squared
- (Fix: shared accumulator `_acc` passed by reference replaces `push(...spread)`)

---

### TC-13-6: Inline edit — `_setEditingInTree` short-circuits after first match

**Preconditions:** Tree has 200+ nodes; the target node is near the **top** of the tree  
**Steps:**
1. Call `tree.startEditing('first-node-value')` on the first node in a 200-node tree
2. Profile the microtask in DevTools

**Expected:**
- Only a fraction of the 200 nodes are visited (short-circuit after match)
- Editing a node near the top is visibly faster than editing one near the bottom

---

### TC-13-7: `_commitEdit` uses cached node reference (no DFS on save)

**Preconditions:** Tree has 500+ nodes  
**Steps:**
1. Call `tree.startEditing('some-value')` on any node
2. Type a new name and press **Enter**
3. Profile the `sc-edit-save` handler execution

**Expected:**
- `_commitEdit` completes without a full DFS traversal
- `sc-edit-save` fires with the correct `currentNode` object
- (Fix: `_editingNode` is cached at `startEditing()` time for O(1) access in `_commitEdit`)

---

### TC-13-8: No redundant tree traversal when only `data` changes

**Preconditions:** `selection="single"`, `selected` is set  
**Steps:**
1. Set `tree.data = newData` (changing data only, not `selected`)
2. Count how many full-tree traversals occur (add `console.count` inside `generateUpdatedTreeData` temporarily)

**Expected:**
- `generateUpdatedTreeData` is called exactly **once** per `data` change (not twice)
- (Fix: `updated()` and `valueUpdate()` no longer both trigger a separate traversal)

