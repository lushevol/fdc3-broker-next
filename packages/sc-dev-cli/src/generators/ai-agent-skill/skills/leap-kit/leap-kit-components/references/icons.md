# @leap/icons

SVG icon pack for Leap UI (v0.21.0). 485 icons.

## Usage

```jsx
import Icon from '@leap/icons';

<Icon name="search" />
<Icon name="cross" size="1.25rem" />
<Icon name="chevron-right" color="#666666" />
<Icon name="info-circle--line" size="1rem" inline />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | **yes** | Icon name (kebab-case) |
| `size` | string | | CSS size value e.g. `"1rem"`, `"24px"` |
| `color` | string | | CSS color value |
| `inline` | bool | | Render as inline SVG |
| `label` | string | | Accessible label |
| `title` | string | | SVG title (tooltip) |

Icons can also use MD Material icon names and SCB icon names — they are remapped automatically via `iconMapMdToLeap` and `iconMapScbToLeap`.

---

## Icon Naming Convention

Icons follow the pattern: `{name}` or `{name}--{style}` where style is `fill` or `line`.

- `chevron-down` — directional arrow (no fill/line variant)
- `search` — magnifier
- `cross` — × close
- `plus` — + add
- `minus` — − remove
- `edit--line` / `edit--fill` — edit pencil
- `trash--line` / `trash--fill` — delete

---

## Common Icons (Quick Reference)

### Navigation & Actions
| Name | Description |
|------|-------------|
| `arrow-ios-backward` | Back arrow (iOS style) |
| `arrow-ios-forward` | Forward arrow |
| `arrow-ios-downward` | Down arrow |
| `arrow-ios-upward` | Up arrow |
| `chevron-left` | Chevron left |
| `chevron-right` | Chevron right |
| `chevron-up` | Chevron up |
| `chevron-down` | Chevron down |
| `arrowhead-left` | Arrowhead left |
| `arrowhead-right` | Arrowhead right |
| `menu` | Hamburger menu |
| `more-horizontal` | ··· horizontal |
| `more-vertical` | ⋮ vertical |
| `expand` | Expand |
| `collapse` | Collapse |
| `newwindow` | Open in new window/tab |
| `export` | Export |
| `upload` | Upload |
| `download` | Download |
| `refresh` | Refresh / reload |

### CRUD Operations
| Name | Description |
|------|-------------|
| `plus` | Add |
| `plus-circle--line` | Add (circled outline) |
| `plus-circle--fill` | Add (circled filled) |
| `minus` | Remove |
| `edit--line` | Edit (outline) |
| `edit--fill` | Edit (filled) |
| `edit-alt--line` | Edit alternate |
| `trash--line` | Delete (outline) |
| `trash--fill` | Delete (filled) |
| `trash-alt--line` | Delete alternate |
| `copy--line` | Copy |
| `save--line` | Save |
| `archive--line` | Archive |

### Status & Feedback
| Name | Description |
|------|-------------|
| `checkmark-circle--line` | Success (outline) |
| `checkmark-circle--fill` | Success (filled) |
| `alert-circle--line` | Error / alert (outline) |
| `alert-circle--fill` | Error / alert (filled) |
| `alert-triangle--line` | Warning (outline) |
| `alert-triangle--fill` | Warning (filled) |
| `info-circle--line` | Info (outline) |
| `info-circle--fill` | Info (filled) |
| `close-circle--line` | Close/error (outline) |
| `tick` | Simple checkmark |
| `cross` | × close / error |
| `denied` | Denied / blocked |
| `verified` | Verified badge |
| `doubletick` | Double tick / seen |
| `loading` | Loading spinner icon |

### Search & Filter
| Name | Description |
|------|-------------|
| `search` | Magnifier |
| `funnel--line` | Filter (outline) |
| `funnel--fill` | Filter (filled) |
| `options--line` | Options |
| `options-alt--line` | Options alternate |

### People & Contacts
| Name | Description |
|------|-------------|
| `person--line` | Single person (outline) |
| `person--fill` | Single person (filled) |
| `people--line` | Group of people (outline) |
| `people--fill` | Group of people (filled) |
| `person-add--line` | Add person |
| `person-delete--line` | Remove person |
| `person-verified--line` | Verified person |
| `contacts` | Contact book |

### Communication
| Name | Description |
|------|-------------|
| `email--line` | Email (outline) |
| `email--fill` | Email (filled) |
| `chat--line` | Chat bubble (outline) |
| `phone--line` | Phone (outline) |
| `message-circle--line` | Message circle |
| `message-square--line` | Message square |
| `send` | Send |
| `bell--line` | Notification bell |
| `bell-off--line` | Bell off |
| `broadcast` | Broadcast |

### Files & Data
| Name | Description |
|------|-------------|
| `file--line` | File (outline) |
| `file-text--line` | Text file |
| `file-add--line` | Add file |
| `file-remove--line` | Remove file |
| `folder--line` | Folder (outline) |
| `folder-open` | Open folder |
| `folder-add--line` | Add to folder |
| `attach` | Attachment/paperclip |
| `attach-alt` | Attachment alternate |
| `clipboard--line` | Clipboard |
| `code` | Code block |
| `list` | List view |
| `grid--line` | Grid view |
| `barchart` | Bar chart |
| `piechart--line` | Pie chart |

### System & Settings
| Name | Description |
|------|-------------|
| `settings--line` | Settings/gear (outline) |
| `settings--fill` | Settings/gear (filled) |
| `settings-alt--line` | Settings alternate |
| `lock--line` | Lock (outline) |
| `unlock--line` | Unlock (outline) |
| `shield--line` | Security shield |
| `eye--line` | Visible |
| `eye-off--line` | Hidden |
| `login` | Log in |
| `logout` | Log out |
| `power` | Power |
| `globe` | Globe/web |
| `link` | Link/chain |
| `link-alt` | External link |
| `pin` | Pin/location |
| `target` | Target |

### Time & Calendar
| Name | Description |
|------|-------------|
| `calendar--line` | Calendar (outline) |
| `calendar--fill` | Calendar (filled) |
| `clock--line` | Clock (outline) |
| `clock--fill` | Clock (filled) |
| `history` | History / clock reverse |
| `timer` | Timer |

### Media
| Name | Description |
|------|-------------|
| `image--line` | Image (outline) |
| `video--line` | Video (outline) |
| `play--line` | Play |
| `pause--line` | Pause |
| `star--line` | Star (outline) |
| `star--fill` | Star (filled) |
| `heart--line` | Heart (outline) |
| `heart--fill` | Heart (filled) |
| `bookmark--line` | Bookmark (outline) |
| `drag-handle` | Drag handle (6 dots) |

---

## All 485 Icon Names

```
activity, alert-circle--fill, alert-circle--line, alert-triangle--fill,
alert-triangle--line, archive--fill, archive--line, arrow-backward,
arrow-circle-down--fill, arrow-circle-down--line, arrow-circle-left--fill,
arrow-circle-left--line, arrow-circle-right--fill, arrow-circle-right--line,
arrow-circle-up--fill, arrow-circle-up--line, arrow-down--fill,
arrow-down--line, arrow-downward, arrow-forward, arrow-ios-backward,
arrow-ios-downward, arrow-ios-forward, arrow-ios-upward, arrow-left--fill,
arrow-left--line, arrow-right--fill, arrow-right--line, arrow-up--fill,
arrow-up--line, arrow-up-down--fill, arrow-up-down--line, arrow-upward,
arrowhead-down, arrowhead-left, arrowhead-right, arrowhead-up, assistant,
at, attach, attach-alt, award--fill, award--line, backspace--fill,
backspace--line, barchart, barchart-alt, battery--fill, battery--line,
bell--fill, bell--line, bell-off--fill, bell-off--line, bluetooth,
book-closed--fill, book-closed--line, book-open--fill, book-open--line,
bookmark--fill, bookmark--line, briefcase--fill, briefcase--line, broadcast,
browser--fill, browser--line, brush--fill, brush--line, bulb--fill,
bulb--line, calendar--fill, calendar--line, camera--fill, camera--line,
car--fill, car--line, cast, chat--fill, chat--line,
checkbox-checked--fill, checkbox-checked--line, checkbox-empty,
checkbox-todo, checkmark-circle--fill, checkmark-circle--line, chevron-down,
chevron-left, chevron-right, chevron-up, clipboard--fill, clipboard--line,
clock--fill, clock--line, close-circle--fill, close-circle--line,
close-square--fill, close-square--line, cloud-download--fill,
cloud-download--line, cloud-upload--fill, cloud-upload--line, code,
code-download, coffee, collapse, colourpalette--fill, colourpalette--line,
colourpicker--fill, colourpicker--line, compass--fill, compass--line,
contacts, copy--fill, copy--line, corner-down-left, corner-down-right,
corner-left-down, corner-left-up, corner-right-down, corner-right-up,
corner-up-left, corner-up-right, country-ago, country-are, country-arg,
country-aus, country-bgd, country-bhr, country-bra, country-brn,
country-bwa, country-chn, country-civ, country-cmr, country-col,
country-deu, country-egy, country-flk, country-fra, country-gbr,
country-ggy, country-gha, country-gmb, country-hkg, country-idn,
country-ind, country-irl, country-irq, country-jor, country-jpn,
country-ken, country-khm, country-kor, country-lao, country-lbn,
country-lka, country-mac, country-mmr, country-mus, country-mys,
country-nga, country-npl, country-off, country-omn, country-pak,
country-phl, country-pol, country-qat, country-sau, country-sgp,
country-sle, country-swe, country-tha, country-tur, country-twn,
country-tza, country-uga, country-usa, country-vnm, country-zaf,
country-zmb, country-zwe, creditcard--fill, creditcard--line,
creditcard-add, crop, cross, cube--fill, cube--line, delegation, denied,
diagonal-arrow-left-down, diagonal-arrow-left-up, diagonal-arrow-right-down,
diagonal-arrow-right-up, dollarsign, doubletick, download, drag-handle,
droplet--fill, droplet--line, droplet-off--fill, droplet-off--line,
edit--fill, edit--line, edit-alt--fill, edit-alt--line, email--fill,
email--line, emotion-happy, emotion-horrible, emotion-meh, emotion-sad,
eurosign, expand, export, eye--fill, eye--line, eye-off--fill, eye-off--line,
eye-off-alt, file--fill, file--line, file-add--fill, file-add--line,
file-remove--fill, file-remove--line, file-text--fill, file-text--line,
film--fill, film--line, flag--fill, flag--line, flash--fill, flash--line,
flash-off--fill, flash-off--line, flip-horizontal, flip-vertical,
folder--fill, folder--line, folder-add--fill, folder-add--line,
folder-code, folder-open, folder-remove--fill, folder-remove--line, font,
fullscreen, funnel--fill, funnel--line, gift--fill, gift--line, globe,
globe--fill, globe--line, globe-lock, grid--fill, grid--line,
harddrive--fill, harddrive--line, hashtag, headphones--fill, headphones--line,
heart--fill, heart--line, history, home--fill, home--line, image--fill,
image--line, inbox--fill, inbox--line, index, info-circle--fill,
info-circle--line, keypad--fill, keypad--line, laptop, layers--fill,
layers--line, layout--fill, layout--line, link, link-alt, list, loading,
lock--fill, lock--line, login, logout, map--fill, map--line, menu,
menu-alt, menu-alt2, menu-arrow, merge, message-circle--fill,
message-circle--line, message-square--fill, message-square--line,
mic--fill, mic--line, mic-off--fill, mic-off--line, minus,
minus-circle--fill, minus-circle--line, minus-square--fill,
minus-square--line, monitor--fill, monitor--line, moon--fill, moon--line,
more-horizontal, more-vertical, move, music--fill, music--line,
navigation--fill, navigation--line, navigation-alt--fill,
navigation-alt--line, network, newwindow, options--fill, options--line,
options-alt--fill, options-alt--line, pantone--fill, pantone--line,
pause--fill, pause--line, people--fill, people--line, percent,
person--fill, person--line, person-add--fill, person-add--line,
person-delete--fill, person-delete--line, person-remove--fill,
person-remove--line, person-verified--fill, person-verified--line,
phone--fill, phone--line, phone-call--fill, phone-call--line,
phone-conference, phone-missed--fill, phone-missed--line, phone-off--fill,
phone-off--line, phone-outgoing, piechart--fill, piechart--line, pin,
pin--fill, pin--line, play--fill, play--line, plus, plus-circle--fill,
plus-circle--line, plus-square--fill, plus-square--line, poundsign, power,
pricetag--fill, pricetag--line, printer--fill, printer--line, project,
questionmark, questionmark-circle--fill, questionmark-circle--line,
radio--fill, radio--line, radiobutton--fill, radiobutton--line,
radiobutton-empty, recording--fill, recording--line, refresh,
rewind-left--fill, rewind-left--line, rewind-right--fill, rewind-right--line,
rocket, rotate, save--fill, save--line, scissors, search, send, server,
settings--fill, settings--line, settings-alt--fill, settings-alt--line,
share--fill, share--line, shield--fill, shield--line, shield-off--fill,
shield-off--line, shoppingbag--fill, shoppingbag--line, shoppingcart--fill,
shoppingcart--line, shuffle, shuffle-alt, skip-backward--fill,
skip-backward--line, skip-forward--fill, skip-forward--line, slideshow,
smartphone--fill, smartphone--line, speaker--fill, speaker--line,
star--fill, star--line, stop-circle--fill, stop-circle--line, submenu,
sun--fill, sun--line, swap, switch-off, switch-on, sync, system, target,
text, thermometer--fill, thermometer--line, thermometer-minus--fill,
thermometer-minus--line, thumbs-up--fill, thumbs-up--line, tick, timer,
trash--fill, trash--line, trash-alt--fill, trash-alt--line, trending-down,
trending-up, trophy--fill, trophy--line, tv--fill, tv--line,
umbrella--fill, umbrella--line, undo--fill, undo--line, unlock--fill,
unlock--line, upload, verified, video--fill, video--line, video-off--fill,
video-off--line, volume-down--fill, volume-down--line, volume-mute--fill,
volume-mute--line, volume-off--fill, volume-off--line, volume-up--fill,
volume-up--line, wallet--fill, wallet--line, webcam, wifi, wifi-off,
yensign, zoom-in--fill, zoom-in--line, zoom-out--fill, zoom-out--line
```
