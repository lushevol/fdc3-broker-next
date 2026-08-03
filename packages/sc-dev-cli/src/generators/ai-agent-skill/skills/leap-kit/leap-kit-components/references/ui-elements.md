# @leap/ui-elements — Primitive Components

All exported via `@leap/sdk`. Version: 3.70.0

---

## Layout

### Grid
Wraps Reactstrap Container / Row / Col.

| Export | Description |
|--------|-------------|
| `GridContainer` | `<Container>` — page wrapper |
| `GridRow` | `<Row>` — flex row |
| `GridColumn` | `<Col>` — column with responsive breakpoints (xs, sm, md, lg, xl) |

```jsx
<GridContainer>
  <GridRow>
    <GridColumn md={8}>Main content</GridColumn>
    <GridColumn md={4}>Sidebar</GridColumn>
  </GridRow>
</GridContainer>
```

### Box
Generic block-level container.
```jsx
<Box className="p-3">Content</Box>
```

### Columns
Flex-based column helper.

### PageContent / Section / PageContentHtml
```jsx
<PageContent>
  <Section title="Details">...</Section>
</PageContent>
```

---

## Action / Buttons

| Export | Description |
|--------|-------------|
| `Button` | Standard button |
| `IconButton` | Button with icon only |
| `ActionGroup` | Grouped set of actions |
| `ActionItem` | Single action item inside ActionGroup |
| `ActionIcon` | Icon-based action |
| `Link` | Anchor link (Reactstrap) |

### Button Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | — | Button label |
| `primary` | bool | false | Blue primary style; sets `type="submit"` |
| `type` | `'warning'` \| `'danger'` | — | Orange warning / red danger style |
| `compact` / `size` | bool / `'sm'`\|`'lg'` | — | Small or large size |
| `disabled` | bool | false | Disabled state |
| `icon` | string | — | Icon name (from @leap/icons) |
| `iconPosition` | `'left'`\|`'right'` | `'right'` | Icon placement |
| `badge` | number | — | Red badge count |
| `width` | string\|number | `'120px'` | Min-width |
| `padding` | string | — | Custom padding override |
| `inverse` | bool | — | Inverted colour style |
| `onClick` | func | — | Click handler |

```jsx
<Button primary onClick={save}>Save</Button>
<Button type="danger" icon="trash" iconPosition="left" compact>Delete</Button>
<Button disabled>Locked</Button>
```

---

## Alert

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `type` | `'info'`\|`'success'`\|`'error'`\|`'warning'` | `'info'` | yes |
| `children` | node | — | yes |
| `closeable` | bool | false | |
| `onAction` | func | — | called when close clicked |
| `mode` | `'default'`\|`'banner'` | `'default'` | |

```jsx
<Alert type="success">Saved successfully.</Alert>
<Alert type="error" closeable onAction={() => setAlert(null)}>
  Something went wrong.
</Alert>
<Alert type="warning" mode="banner">Maintenance window tonight.</Alert>
```

---

## Modal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | bool | — | Controls visibility |
| `title` | node | `'Alert'` | Header text |
| `size` | `'sm'`\|`'md'`\|`'lg'` | `'md'` | Dialog size |
| `actions` | array\|node | — | Footer buttons; each: `{ name, label, ...ButtonProps }` |
| `handleAction` | func | — | Called with `(name, open?)` on button click or toggle |
| `showCloseIcon` | bool | true | × button in header |
| `closeOnClickOutside` | bool | true | Click backdrop to close |
| `footerAlign` | `'left'`\|`'right'` | `'left'` | Footer button alignment |
| `children` | node | — | Body content |
| `header` / `body` / `footer` | node | — | Full slot overrides |
| `className` | string | `'modal-dialog-centered'` | Dialog className |
| `bodyStyle` | object | — | Inline styles on body |

```jsx
<Modal
  open={showModal}
  title="Confirm Delete"
  size="sm"
  handleAction={(action) => {
    if (action === 'confirm') doDelete();
    setShowModal(false);
  }}
  actions={[
    { name: 'confirm', label: 'Delete', type: 'danger', primary: true },
    { name: 'cancel',  label: 'Cancel' },
  ]}
>
  Are you sure you want to delete this item?
</Modal>
```

---

## Prompt (Confirm Dialog)
Simplified preset modal for confirmations.

```jsx
<Prompt
  open={showPrompt}
  title="Are you sure?"
  message="This action cannot be undone."
  handleAction={(name) => {
    if (name === 'ok') proceed();
    setShowPrompt(false);
  }}
/>
```

---

## Tooltip
Wraps `rc-tooltip`. All rc-tooltip props pass through.

Key props: `overlay` (content to show), `placement` (`top`|`bottom`|`left`|`right`), `trigger` (default: `['hover']`).

```jsx
<Tooltip overlay="This is a tooltip" placement="top">
  <span>Hover me</span>
</Tooltip>
```

---

## Spinner / Progress / Steps

```jsx
<Spinner />                     // circular loading indicator

<Progress value={60} max={100} />   // horizontal bar

<Steps
  current={1}
  steps={[
    { title: 'Step 1' },
    { title: 'Step 2' },
    { title: 'Step 3' },
  ]}
/>
```

---

## Card

| Export | Description |
|--------|-------------|
| `Card` | Base card wrapper |
| `CardHeader` | Card header section |
| `CardBody` | Card body section |
| `CardFooter` | Card footer section |
| `CardText` | Text inside card |
| `CardDeck` | Responsive card grid |
| `CardList` | List variant |
| `SummaryCard` | Summary metrics card |

```jsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>
    <Button primary>OK</Button>
  </CardFooter>
</Card>
```

---

## Panel

Collapsible section container.

| Export | Description |
|--------|-------------|
| `Panel` | Outer container |
| `PanelGroup` | Groups multiple panels (accordion) |
| `PanelTitle` | Panel header |
| `PanelSummary` | Summary text |
| `PanelBody` | Collapsible content |

```jsx
<PanelGroup>
  <Panel>
    <PanelTitle>Section 1</PanelTitle>
    <PanelBody>Content here</PanelBody>
  </Panel>
</PanelGroup>
```

---

## Tag / TagHighlight / CheckableTag

```jsx
<Tag color="primary">Active</Tag>
<Tag color="danger">Error</Tag>
<TagHighlight text="match" highlight="mat" />
<CheckableTag checked={selected} onChange={setSelected}>Label</CheckableTag>
```

---

## Table
Wraps Reactstrap `Table` — all reactstrap Table props supported.
Notable: `striped`, `bordered`, `hover`, `responsive`, `size` (`sm`).

```jsx
<Table striped hover responsive>
  <thead>
    <tr><th>#</th><th>Name</th><th>Status</th></tr>
  </thead>
  <tbody>
    {items.map(item => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>{item.status}</td>
      </tr>
    ))}
  </tbody>
</Table>
```

---

## InfiniteScroll

```jsx
<InfiniteScroll
  hasMore={hasMore}
  loadMore={loadNextPage}   // called when near bottom
  loader={<Spinner key="spin" />}
  useWindow={true}          // scroll on window (default)
>
  {items.map(item => <div key={item.id}>{item.name}</div>)}
</InfiniteScroll>
```

---

## List / FileList

```jsx
<List items={data} renderItem={(item) => <div>{item.label}</div>} />
<FileList files={files} onRemove={handleRemove} />
```

---

## Dot / DotStatus

```jsx
<Dot color="#28a745" />
<DotStatus status="active" />    // active | inactive | pending
```

---

## Anchor / AnchorGroup / AnchorLink

In-page anchor navigation.

```jsx
<Anchor id="section-1">
  <h2>Section 1</h2>
  ...content...
</Anchor>

<AnchorGroup>
  <AnchorLink href="#section-1">Section 1</AnchorLink>
  <AnchorLink href="#section-2">Section 2</AnchorLink>
</AnchorGroup>
```

---

## Drawer

Slide-in panel from left/right.

```jsx
<Drawer open={isOpen} onClose={() => setOpen(false)} placement="right">
  Drawer content
</Drawer>
```

---

## Viewport / ViewportProvider / withViewport

Provides responsive breakpoint context.

```jsx
// Read viewport in component
const MyComp = withViewport(({ viewport }) => (
  <div>{viewport.is('lg') ? 'Desktop' : 'Mobile'}</div>
));
```

---

## Toast Notification (via ToastNotification module)

| Export | Description |
|--------|-------------|
| `Toast` | Single toast |
| `withToastManager` | HOC that injects `toastManager` prop |
| `withRootToastManager` | Mount at root level |
| `NotificationToast` | Domain-ready notification toast |
| `ToastContext` / `ToastRootContext` | React contexts |

---

## Popover / Popup

```jsx
<Popover trigger="click" content={<div>Popover content</div>} placement="bottom">
  <Button>Open</Button>
</Popover>
```
