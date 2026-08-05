# @leap/ui-components — Domain Components

All exported via `@leap/sdk`. Version: 3.70.0

---

## Navigation

### withNavigation (HOC)
Wraps a component with react-router and portal-aware navigation.

**Injected props:**
| Prop | Type | Description |
|------|------|-------------|
| `goTo(path, state?)` | func | Push route (prepends appBasePath automatically) |
| `goBack()` | func | history.goBack() |
| `createHref(path, search?, hash?)` | func | Build a full href string |
| `canGoBack()` | func → bool | Whether history has entries |
| `refresh()` | func | Reload current route |
| `stateParams` | object | location.state from router |

```jsx
// Wrap at export
export default withNavigation(MyComponent);

// Inside component
const MyComponent = ({ goTo, goBack, stateParams }) => (
  <Button onClick={() => goTo('/urls/create')}>Create</Button>
);
```

### NavLink
Router-aware anchor link.
```jsx
<NavLink href="/urls/123">View</NavLink>
```

### Other Navigation exports
| Export | Description |
|--------|-------------|
| `NavBack` | Back button component |
| `NavBreadcrumb` | Breadcrumb strip |
| `NavButton` | Navigation-triggering button |
| `NavDropdown` | Dropdown nav menu |
| `NavHelp` | Help icon/link |
| `NavMenu` | Navigation menu container |
| `NavSearch` | Search bar for nav |

---

## Forms

All inputs are **controlled** — always provide `value` + `onChange`.

### TextInput
```jsx
<TextInput
  value={text}
  onChange={(val) => setText(val)}
  label="URL"
  placeholder="https://..."
  disabled={false}
  maxLength={200}
/>
```

### Switch / SwitchInput
```jsx
<Switch checked={active} onChange={(val) => setActive(val)} />
<SwitchInput checked={active} onChange={fn} label="Active" />
```

### CheckboxInput
```jsx
<CheckboxInput checked={agreed} onChange={fn} label="I agree" />
```

### RadioInput / RadioInputGroup
```jsx
<RadioInputGroup
  value={selected}
  onChange={(val) => setSelected(val)}
  options={[
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
  ]}
/>
```

### NumberInput
```jsx
<NumberInput value={count} onChange={fn} label="Count" min={0} max={100} />
```

### DateInput / DateRangeInput
```jsx
<DateInput value={date} onChange={fn} label="Date" format="YYYY-MM-DD" />
<DateRangeInput
  value={{ start: startDate, end: endDate }}
  onChange={({ start, end }) => { setStart(start); setEnd(end); }}
/>
```

### DropdownInput
```jsx
<DropdownInput
  value={selected}
  onChange={fn}
  label="Category"
  options={[{ label: 'Cat A', value: 'a' }, { label: 'Cat B', value: 'b' }]}
  placeholder="Select..."
/>
```

### MultiselectInput / CheckableMultiSelectInput
```jsx
<MultiselectInput
  value={selectedItems}
  onChange={fn}
  options={opts}
  label="Tags"
/>
```

### PasswordInput / PinEntry
```jsx
<PasswordInput value={pwd} onChange={fn} label="Password" />
<PinEntry length={4} onComplete={(pin) => verify(pin)} />
```

### ContactInput
Person/user search and select.
```jsx
<ContactInput
  value={contact}
  onChange={(contact) => setContact(contact)}
  label="Assign to"
  placeholder="Search user..."
/>
```

### HostInput / ApplicationInput / ProjectInput / CostCentreInput
Entity search inputs — same pattern as ContactInput.
```jsx
<ApplicationInput value={app} onChange={fn} label="Application" />
<HostInput value={host} onChange={fn} label="Host" />
<ProjectInput value={project} onChange={fn} label="Project" />
```

### Select
Generic select (wraps rc-select).
```jsx
<Select
  value={val}
  onChange={fn}
  options={[{ label: 'A', value: 'a' }]}
/>
```

### SliderInput
```jsx
<SliderInput value={50} onChange={fn} min={0} max={100} step={1} />
```

### ReadonlyInput
Non-editable field that looks like an input.
```jsx
<ReadonlyInput label="Created By" value={createdBy} />
```

### Tree
Hierarchical select.
```jsx
<Tree items={treeData} onSelect={fn} />
```

### Form
Wrapper for form layout.
```jsx
<Form onSubmit={handleSubmit}>
  <TextInput ... />
  <Button primary type="submit">Submit</Button>
</Form>
```

### ButtonGroup / RadioButtonGroup / RadioIconButtonGroup
```jsx
<ButtonGroup
  value={selected}
  onChange={fn}
  options={[{ label: 'List', value: 'list' }, { label: 'Grid', value: 'grid' }]}
/>
```

---

## Contact

| Export | Description |
|--------|-------------|
| `Contact` | Full contact data component |
| `ContactAvatar` | User avatar image |
| `ContactCard` | Contact info card |
| `ContactName` | Renders contact display name |
| `ContactSelect` | Contact dropdown selector |
| `ContactSelectOption` | Single option in ContactSelect |
| `ContactTag` | Contact chip/tag |

```jsx
<ContactName id={userId} />
<ContactAvatar id={userId} size="sm" />   // size: sm | md | lg
<ContactCard id={userId} />
```

---

## Application

| Export | Description |
|--------|-------------|
| `Application` | Full application view |
| `ApplicationCard` | Application info card |
| `ApplicationName` | Application display name |
| `ApplicationSelect` | Application selector |
| `ApplicationSelectOption` | Individual application option |

---

## Avatar

| Export | Description |
|--------|-------------|
| `Avatar` | Generic avatar |
| `AvatarImage` | Image-based avatar |
| `AvatarConstants` | `{ SIZE: { SM, MD, LG } }` size constants |

```jsx
<Avatar name="John Doe" size={AvatarConstants.SIZE.SM} />
```

---

## Host / Project / CostCentre / Community

Each follows the same pattern:

| Export | Naming pattern | Description |
|--------|---------------|-------------|
| `Host` / `Project` / etc. | Entity | Full entity component |
| `HostCard` / `ProjectCard` / etc. | EntityCard | Summary card |
| `HostName` / `ProjectName` / etc. | EntityName | Display name inline |
| `HostSelect` / `ProjectSelect` / etc. | EntitySelect | Selector input |
| `HostSelectOption` | EntitySelectOption | Select item |

---

## DataContainer / withDataContainer

`DataContainer` is a named data scope provider. `withDataContainer` injects `dataContainer` prop.

```jsx
// At app root
<DataContainer name="MY_APP">
  <App />
</DataContainer>

// In component
export default withDataContainer(MyComponent);
// Props injected: dataContainer.get(key), dataContainer.set(key, val)
```

---

## Search

| Export | Description |
|--------|-------------|
| `Search` | Basic search input |
| `SearchBox` | Search input with submit button |
| `SearchList` | Scrollable search results list |
| `FilterSearchList` | Filterable list |
| `FilterSearchBox` | Combined filter + search |
| `CategorySearch` | Search with category filter |
| `UserGroupSearch` | User/group picker |
| `CategoryCard` | Displayed search category |
| `LocationCard` | Location entity card |
| `UserGroupCard` | User group card |

```jsx
<Search
  value={query}
  onChange={(val) => setQuery(val)}
  onSearch={(val) => performSearch(val)}
  placeholder="Search..."
/>

<SearchBox value={query} onChange={fn} onSearch={fn} />
```

---

## MasterDetail

Left-list, right-detail split layout.

| Export | Description |
|--------|-------------|
| `MasterDetail` | Full split-view |
| `MasterDetailContainer` | Layout container |
| `MasterDetailContentContainer` | Content wrapper |
| `ItemTemplate` | Default list item template |
| `ContactItemTemplate` | Contact-specific item template |

```jsx
<MasterDetail
  items={items}
  listComponent={MyListItem}
  detailComponent={MyDetailView}
  onSelect={(item) => setSelected(item)}
  selectedId={selected?.id}
/>
```

---

## Header

```jsx
<Header portalApp={portalApp} />
<HomeHeader portalApp={portalApp} />
```

---

## Data Visualisation

| Export | Description |
|--------|-------------|
| `PieChart` | Pie chart |
| `DoughnutChart` | Doughnut chart |
| `SeriesChart` | Line/bar series chart |
| `RadarChart` | Radar (spider) chart |
| `Treemap` | Treemap visualisation |
| `Gauge` | Gauge meter |
| `HeatmapTiles` | Heatmap grid |
| `HeatLegend` | Legend for heatmap |
| `DataSummary` | Summary metrics display |
| `DataTable` | Feature-rich data table |
| `DataFilter` | Filter controls for DataTable |
| `Pagination` | Page navigation |

---

## Toast Notifications

```jsx
// Mount once at root
const Root = withRootToastManager(App);

// Use in any component
const MyComp = withToastManager(({ toastManager }) => {
  const notify = () => toastManager.add('Saved!', { type: 'success' });
  return <Button onClick={notify}>Save</Button>;
});
```

---

## View / DrawerView / ExternalView

```jsx
<View title="My Page">
  <Section>Content</Section>
</View>

<DrawerView open={open} onClose={fn} title="Side Panel">
  Drawer content
</DrawerView>
```

---

## Tabs

```jsx
<TabContainer defaultActiveKey="tab1">
  <TabContent eventKey="tab1" title="First">Content 1</TabContent>
  <TabContent eventKey="tab2" title="Second">Content 2</TabContent>
</TabContainer>
```

---

## Guard

Permission gate — renders children only if access is granted.

```jsx
<Guard permission="admin">
  <AdminPanel />
</Guard>
```

---

## CMS / Help

```jsx
<CMSContent contentId="help-intro" />
<HelpPage />
<HelpContentPage contentId="faq" />
```

---

## Text Editor

Rich text editor (Draft.js based).

```jsx
<TextEditor
  value={editorState}
  onChange={(state) => setEditorState(state)}
  placeholder="Start typing..."
/>
```

---

## Organisation

```jsx
<OrgHierarchy rootId={orgId} />
<OrgPosition id={positionId} />
<OrgTeam id={teamId} />
```
