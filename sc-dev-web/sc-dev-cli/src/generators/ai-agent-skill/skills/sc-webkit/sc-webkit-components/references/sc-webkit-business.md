# @scdevkit/webkit — Business Components

> Auto-generated reference. Use for component APIs: attributes, slots, events, and usage variants.

## `sc-case-card` — Business Components/Case/Case Card

Case card shows the case information.
          <br/>
          To use business components, please import '@scdevkit/webkit-ext'.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Case id. |
| `major-field` | `string` | `name` | Sets to decide which field can be shown as title. Options: `id`, `name`. |
| `fields` | `array` | — | Set to customize the fields.        All Supported values: status, lastUpdate, requestedBy, requestedFor, prefix |
| `actions` | `array` | — | Set to customize the actions.       actions=[html`<div>Edit</div>`] |

### Events

| Event | Description |
| --- | --- |
| `sc-loaded` | Emitted when get the case information by API. |

### Stories

- `Default`
- `MajorField`
- `CustomFields`
- `CustomActions`

## `sc-customer-detail` — Business Components/Customer/Customer Detail

Customer detail shows the customer detail information.
          <br/>
          To use business components, please import '@scdevkit/webkit-ext'.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `reference-id` | `string` | — | Customer reference id. |
| `country-code` | `string` | — | Customer country code. |
| `columns` | `number` | `1` | Set to customize the column layout. |
| `fields` | `array` | — | Set to customize the fields.        To get the default fields, listen the sc-loaded event, get from event.detail.fields |
| `queries` | `object` | — | Sets to customize the graphql fields.       To get the default queries, listen the sc-loaded event, get from event.detail.queries |

### Events

| Event | Description |
| --- | --- |
| `sc-loaded` | Emitted when the component loaded. |

### Stories

- `Default`
- `MultipleColumns`
- `CustomFields`

## `sc-employee-avatar` — Business Components/Employee/Employee Avatar

Employee avatar shows the avatar of the employee, and can show more information by clicking the avatar.
          <br/>
          To use business components, please import '@scdevkit/webkit-ext'.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Employee bank id. |
| `avatar-size` | `string` | `lg` | Sets the size of the avatar. Options: `sm`, `md`, `lg`, `xl`, `default`. |

### Events

| Event | Description |
| --- | --- |
| `sc-loaded` | Emitted when get the employee information by API. |

### Stories

- `Default`

## `sc-employee-card` — Business Components/Employee/Employee Card

Employee card shows employee information.
          <br/>
          To use business components, please import '@scdevkit/webkit-ext'.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Employee bank id. |
| `mode` | `string` | `normal` | The card mode. Options: `normal`, `compact`, `tag`. |
| `vertical` | `boolean` | `false` | Set to show a vertical card. |
| `center-aligned` | `boolean` | `false` | Set to show a center aligned card. |
| `additional-info-link` | `boolean` | `false` | Set to show relevant fields as links. |
| `link` | `boolean` | `false` | Set to show a link tag. |
| `transparent` | `boolean` | `false` | Set to show a transparent tag. |
| `fields` | `array` | — | Set to customize the fields.        All Supported values: id, location, avatar, businessTitle, department, email, phone |
| `avatar-size` | `string` | `md` | Sets the size of the avatar. Options: `sm`, `md`, `lg`, `xl`, `default`. |
| `no-actions` | `boolean` | `false` | Sets to hide the actions. |
| `actions` | `array` | — | Set to customize the actions.       actions=[html`<div>Edit</div>`] |

### Events

| Event | Description |
| --- | --- |
| `sc-loaded` | Emitted when get the employee information by API. |

### Stories

- `Default`
- `CompactMode`
- `TagMode`
- `CustomFields`
- `CustomActions`

## `sc-employee-grouped-avatar` — Business Components/Employee/Employee Grouped Avatar

Employee grouped avatar shows multiple avatar of the employees, and can show more information by clicking the avatar.
          <br/>
          To use business components, please import '@scdevkit/webkit-ext'.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `ids` | `array` | — | Employee bank ids. |
| `size` | `string` | `lg` | Sets the size of the avatar. Options: `sm`, `md`, `lg`, `xl`. |

### Stories

- `Default`

## `sc-employee-input` — Business Components/Employee/Employee Input

Employee input allow user to search by employee id and show the employee information by card.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Employee input default value. |

### Events

| Event | Description |
| --- | --- |
| `sc-select` | Emitted when select the employee from dropdown list. |

### Stories

- `Default`

## `sc-employee-multi-input` — Business Components/Employee/Employee Multi Input

Employee multi input allow user to search by multiple employee id and show the employee information by card.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `array` | — | Employee multi input default value. |

### Events

| Event | Description |
| --- | --- |
| `sc-select` | Emitted when select the employee from dropdown list. |

### Stories

- `Default`

## `sc-employee-name` — Business Components/Employee/Employee Name

Employee name shows the name of the employee, and can show more information by clicking the name.
          <br/>
          To use business components, , please import '@scdevkit/webkit-ext'.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Employee bank id. |

### Events

| Event | Description |
| --- | --- |
| `sc-loaded` | Emitted when get the employee information by API. |

### Stories

- `Default`

## `sc-form-editor` — Form/Form Editor

Form editor is used to design a form with many components and layouts.
          To learn more, please go
          <sc-link href='/form-designer/editor' target='_blank'>Form Designer</sc-link>

### Events

| Event | Description |
| --- | --- |
| `form-updated` | Emitted when add new components or edit the form,          can get the form definition from the event.detail.definition. |

### Stories

- `Default`

## `sc-form-viewer` — Form/Form Viewer

Form viewer is used to render a form created by form editor. To learn more, please go
          <sc-link href='/form-designer/editor' target='_blank'>Form Designer</sc-link>

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `definition` | `object` | — | Form definition which generated by form editor, it defines the form's components and layout |
| `data` | `array` | `false` | Form components' value. |
| `readonly` | `boolean` | `false` | Sets to disable editing of the form. |

### Events

| Event | Description |
| --- | --- |
| `value-changed` | Emitted when the form component's value changes,        can use it to get the latest data from the event.detail.data. |

### Stories

- `WithData`
- `Readonly`

## `sc-organisation-hierarchy` — Business Components/Organisation/OrganisationHierarchy

Organisation hierarchy shows organisation hierarchy chart.
          <br/>
          To use business components, , please import '@scdevkit/webkit-ext'.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `roles` | `array` | — | Set to render the organisation roles. |

### Stories

- `Default`

## `sc-organisation-role` — Business Components/Organisation/OrganisationPosition

Organisation role is an unit component to build the organisation chart.
          <br/>
          To use business components, , please import '@scdevkit/webkit-ext'.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Employee bank id. |
| `name` | `string` | — | Employee name. |
| `title` | `string` | — | Position title. |
| `location` | `string` | — | Employee location. |
| `department` | `string` | — | Employee department. |
| `email` | `string` | — | Employee email. |
| `phone` | `string` | — | Employee phone. |
| `connection` | `object` | — | Connection info. |

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `customFields` | `array` | — | Set to render the custom fields, user can also use the customFields property. |
| `customCard` | `string` | — | Set to render the custom card, user can also use the customCard property. |

### Stories

- `Default`
- `CustomFields`
- `CustomCard`

