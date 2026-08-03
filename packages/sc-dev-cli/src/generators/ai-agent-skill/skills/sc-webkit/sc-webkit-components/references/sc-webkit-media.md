# @scdevkit/webkit — Media & Editors

> Auto-generated reference. Use for component APIs: attributes, slots, events, and usage variants.

## `sc-calendar` — Calendar/Calendar

View Calendar events

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `calendar-view` | `string` | — | Calendar view type Options: `default`, `continuous`, `multi-month`. |
| `locale` | `string` | — | Locale for calendar Options: `en`, `zh-CN`. |
| `show-header-toolbar` | `boolean` | — | Show header toolbar |
| `loading` | `boolean` | — | Show loading spinner |
| `events` | `array` | — | Calendar events |
| `available-calendars` | `array` | — | Available calendars |
| `selected-calendars` | `array` | — | Selected calendars |

### Events

| Event | Description |
| --- | --- |
| `sc-calendar-view-change` | Emitted when the calendar view changes. |
| `sc-action` | Emitted when an action is triggered (new event, share, etc). |

### Stories

- `Default`
- `WithHeaderToolbar`

## `sc-carousel` — Components/Carousel

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `pagination` | `boolean` | `false` | Sets to show the pagination. |
| `autoplay` | `boolean` | `false` | Sets to autoplay the carousel. |
| `loop` | `boolean` | `false` | By default, the carousel will not advanced beyond the first and last slides. You can change this behavior and force the carousel to “wrap” with the loop attribute. |

### Stories

- `Default`
- `Autoplay`

## `sc-doc-viewer` — Viewer/Document Viewer

For more information please refer to [Documentation](https://confluence.global.standardchartered.com/display/APPPLAT/Universal+document+viewer).

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `file` | `object` | — | Set a File object |

### Stories

- `Default`

## `sc-document-image-viewer` — Viewer/Document Image Viewer

Document Image Viewer.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | — | — |  |
| `selections` | — | — |  |

### Stories

- `Default`

## `sc-rich-text-editor-v2` — Components/Text Editor V2/Form State

States based on Form Input Base applicable for the Text Editor V2

### Stories

- `Default`
- `Error`
- `Success`
- `Tooltip`
- `Label`
- `Hint`

## `sc-rich-text-editor-v2` — Components/Text Editor V2

Powerful rich text editor. Intuitive WYSIWYG Editor.

## Shortcut support - Out of the box.

| action | window | mac |
| ------ | --- |
| tab | tab | tab |
| undo | ctrl + z | cmd + z |
| redo | ctrl + y| cmd + shift + z |
| bold | ctrl + b | cmd + b |
| italic | ctrl + i | cmd + i |
| underline | ctrl + u | cmd + u |
| strike through | ctrl + shift + s | cmd + shift + s |
| blockquote | ctrl + shift + q | cmd + shift + q |
| remove format | ctrl + \ | cmd + \ |
| justify left | ctrl + shift + l| cmd + shift + l |
| justify center | ctrl + shift + e | cmd + shift + e |
| justify right | ctrl + shift + r | cmd + shift + r |
| unordered list | ctrl + shift + 7 | cmd + shift + 7 |
| ordered list | ctrl + shift + 8| cmd + shift + 8 |
| outdent | ctrl + [ | cmd + [ |
| indent | ctrl + ] | cmd + ] |
| paragraph | ctrl + 0 | cmd + 0 |
| heading 1 | ctrl + 1 | cmd + 1 |
| heading 2 | ctrl + 2 | cmd + 2 |
| heading 3 | ctrl + 3 | cmd + 3 |
| heading 4 | ctrl + 4 | cmd + 4 |
| heading 5 | ctrl + 5 | cmd + 5 |
| heading 6 | ctrl + 6 | cmd + 6 |
| superscript | ctrl + shift + up arrow | cmd + shift + up arrow |
| subscript | ctrl + shift + down arrow | cmd + shift + down arrow |
| insert image | ctrl + shift + m | cmd + shift + m |

## Custom toolbar button support
The editor supports custom toolbar buttons. 
You can define an array of custom buttons in the `customToolbarButtons` property. 
<br>
The `customToolbarButtons` should be an array of `CustomToolbarButton` objects. 
Each `CustomToolbarButton` object should have an `icon`, a `handler` function, and a `hintText`  property. 
<br>
Example usage of customToolbarButtons property:
<br>
```
        <sc-rich-text-editor-v2 
          .customToolbarButtons=${[{
            icon: 'cross',
            handler: (editor: Editor) => {
              editor.resetContent();
              alert('Reset content, this is a custom button');
            },
            hintText: 'Reset content',
          }, {
            icon: 'alert-circle--line',
            handler: (editor: Editor | null) => {
              editor?.notificationManager.open({
                text: 'Custom button clicked!',
                type: 'success',
              });
            },
            hintText: 'Custom button',
          }]}
        >
```
The table below shows the properties of the `CustomToolbarButton` object:

| Property | Type | Description |
| -------- | ---- | ----------- |
| icon | string | The icon to display in the button. |
| handler | function | The function to call when the button is clicked. The function receives the TinyMCE editor instance as a parameter. mExample: ` (editor: Editor) => { /* insert javascript code */ } `|
| hintText | string | The text to display as a tooltip when hovering over the button. |

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `toolbar` | `array` | `array` | Control toolbar of Text Editor |
| `value` | — | — | Pass context to Text Editor |
| `shortcut` | `boolean` | `false` |  |
| `max-length` | `number` | — |  |
| `disable-spellcheck` | `boolean` | `false` |  |
| `readonly` | `boolean` | `false` |  |
| `revisions` | `array` | `object` | Revision history entries for the editor |
| `ext-config` | `object` | `object` | External configuration for the editor. This is based on TinyMCE init config properties |
| `customToolbarButtons` | `CustomToolbarButton[]` | `[]` | Array of custom toolbar button definitions.        Each object should have an icon, handler, and command.        The handler receives a paremeter 'editor' which is the TinyMCE editor instance. |

### Events

| Event | Description |
| --- | --- |
| `sc-change` | Emitted when the content changed. Get the state by event.detail.text. |

### Stories

- `Default`
- `LessToolbar`
- `NoToolbar`
- `Shortcut`
- `MaxLength`
- `Readonly`
- `ImageAttachment`
- `ErrorMessage`
- `SuccessMessage`
- `RevisionHistory`
- `CustomHeight`
- `ExternalConfig`
- `DisableSpellcheck`
- `CustomToolbarButtons`
- `AskAIToolbars`
- `CopyPaste`

## `sc-rich-text-editor` — Components/Text Editor

Powerful rich text editor. Intuitive WYSIWYG Editor.
(Available from 1.3.0)

**Shortcut support - Out of the box.**

| action | window | mac |
| ------ | --- |
| tab | tab | tab |
| undo | ctrl + z | cmd + z |
| redo | ctrl + y| cmd + shift + z |
| bold | ctrl + b | cmd + b |
| italic | ctrl + i | cmd + i |
| underline | ctrl + u | cmd + u |
| strike through | ctrl + shift + s | cmd + shift + s |
| blockquote | ctrl + shift + q | cmd + shift + q |
| remove format | ctrl + \ | cmd + \ |
| justify left | ctrl + shift + l| cmd + shift + l |
| justify center | ctrl + shift + e | cmd + shift + e |
| justify right | ctrl + shift + r | cmd + shift + r |
| unordered list | ctrl + shift + 7 | cmd + shift + 7 |
| ordered list | ctrl + shift + 8| cmd + shift + 8 |
| outdent | ctrl + [ | cmd + [ |
| indent | ctrl + ] | cmd + ] |
| paragraph | ctrl + 0 | cmd + 0 |
| heading 1 | ctrl + 1 | cmd + 1 |
| heading 2 | ctrl + 2 | cmd + 2 |
| heading 3 | ctrl + 3 | cmd + 3 |
| heading 4 | ctrl + 4 | cmd + 4 |
| heading 5 | ctrl + 5 | cmd + 5 |
| heading 6 | ctrl + 6 | cmd + 6 |
| superscript | ctrl + shift + up arrow | cmd + shift + up arrow |
| subscript | ctrl + shift + down arrow | cmd + shift + down arrow |
| insert image | ctrl + shift + m | cmd + shift + m |

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `toolbar` | `array` | `array` | Control toolbar of Text Editor |
| `value` | — | — | Pass context to Text Editor |
| `shortcut` | `boolean` | `false` |  |
| `readonly` | `boolean` | `false` |  |

### Events

| Event | Description |
| --- | --- |
| `sc-change` | Emitted when the content chagned. Get the state by event.detail.text. |

### Stories

- `Default`
- `CustomizeToolbar`
- `Shortcut`
- `Readonly`
- `ImageAttachment`

