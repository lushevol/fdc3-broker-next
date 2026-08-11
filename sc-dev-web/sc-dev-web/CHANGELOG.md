# [3.0.7] - 2026-05-13

## Fixes:

- Data gridSelect all - Bugfix [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/13048918/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/13048918/)]
- Filtering and manual sorting not working when group header configured [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/13464468/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/13464468/)]
- Global filter issue: exclude hidden column [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12803778/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12803778/)]
- Customised filter items are not removed from the multi select after resetting [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12311661/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12311661/)]
- Column manager render outside box [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12480257/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12480257/)]
- Tab shortcut issue with sc-text-input [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12166534/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12166534/)]
- Master cell expandable from pinned column [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12883698/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12883698/)]

- Rich text editorPasted content should not strip spaces ( ) between text [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/13354027/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/13354027/)]
- Undo button not working for pasted tables [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/13581922/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/13581922/)]

- Dropdown - Hierarchical dropdown check mark and highlight is not shown on leaf node [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/13464551/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/13464551/)]
- Scrollbar - overlap issue [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12058567/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12058567/)]
- Form inputError message position [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12978253/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12978253/)]
- Multiple line readonly text input can't render  correctly

- Stepper - data description update issue [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12724817/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12724817/)]
- Radio group - disabled value issue [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12753907/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12753907/)]

## Features:

- Tree component - Support inline edit, delete, custom actions, enable drag and sorting [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11814306/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11814306/), [https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12612646/](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/12612646/)]
- Column layout tablet style update

# [3.0.5] - 2026-04-08

## Fixes:
Add css variable for the side sheet z-index

# [3.0.4] - 2026-04-02

## Fixes:
Column layout fix compatibility issue

# [3.0.3] - 2026-03-30

## Fixes:
Column layout fix compatibility issue

# [3.0.1] - 2026-03-18

## Added:

- Relationship component
- Comments component
- Status filter component
- MSTR component

## Features:

- Mobile and tablet update (dropdown, date input, rating button, button group, time input, menu bar, action bar, layout)
- Storybook mobile support
- Radio group keyboard accessibility
- Enhanced sc-stepper to show the active step
- Dropdown highlight GDS alignment
- Multi dropdown supports create tag if the value doesn't exist in the option list
- Calendar update (support multiple calendars, mobile support)
- Chart enhancement(bar chart support dual y-axis; support bar, line and bubble combined chart).

## Fixes:

- Checkbox group disabled bug (#11737696)
- Dropdown performance and parent check (#11241383, #11823335)
- Column layout additional height attribute (#11802499)
- Component prop types (#8243736)
- File events and listeners propagation (#11215882)

## Rename:

- rename pin--fill icon to location-file
- rename pin-line icon to location--line

# [2.3.20] - 2026-03-04

## Bug Fixes

- Dropdown performance, virtual list, placement, and focus issues (#11241383, #11108443, #12211195)
- Data grid tooltip overlap, pinned z-index, sorting, and global filter issues (#11888760, #12121430, #11949085, #12103797)
- Data grid dropdown async filter and date-range hoist position (#11316313, #8621676)
- Checkbox group disabled bug (#11737696)
- Cursor issue and misc RTE fixes (#12215797)

# [2.3.15] - 2026-02-11

## Bug Fixes

- Rich text editorExtra spaces appear when copying table into RTE
- The text formatting is not displayed properly when copying from outlook
- Nested List items are not shown with proper indentation

# [2.3.12] - 2026-01-21

## Features:

- Rich text editor - Support pre-tag for old rte

# [2.3.10] - 2026-01-14

## Features:

- Tab group - Add show-tabs-bottom-line attribute [[Story 11632232 Webkit Component - Tabs Enhancement - Add Line](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11632232/)]
- Data grid - Add search-field clearable property [[Story 11550423 Webkit Component - add search-field clearable prop for Data grid](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11550423)]

## Bug Fixes:

- Data gridadvance-filter search should compare values to displayed cell value as well [[Story 11326130 DevKit Component - Data grid - advance-filter search should compare to displayed value of cell](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11326130/)]
- Shows value instead of label when filterLookup reopened [[Story 11316313 DevKit Component - Data grid - shows value instead of label when filterLookup reopened (also cannot remove directly)](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11316313/)]
- Enable advance-filter search from non-filterable column [[Story 11215889 DevKit Component - Data grid - enable advance-filter search from non-filterable column](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11215889/)]
- Column Visibility bug [[Story 11537105 DevKit Component - Data grid - Column Visibility bug](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11537105/)]
- Dropdown button rendered multiple times bugfix [[Story 11430453 DevKit Component - Data grid - dropdown button rendered multiple times bugfix](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11430453/)]

- Rich text editorAdd revision history in toolbar

- Radio group - Bugfix for disabled option selection status reset [[Story 11531811 Webkit - Radio group - Bugfix for disabled option selection status reset](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11531811/)]
- Pagination style update [[Story 8569416 DevKit Component - Pagination bugfix](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8569416/)]
- List navigation - Fix the display issue with multiple items [[Story 10414278 Webkit Component - List Navigation UI update](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/10414278/)]
- Card - Support background image type
- Button dropdown - disabled bugfix [[Story 11459641 DevKit Component - Button dropdown - disabled bugfix](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11459641/)]

# [2.3.9] - 2025-12-08

## Features:

- Date - Update full-date format

## Bug Fixes:

- Number input - User can still type more characters even when max is set [[Story 10926020 Devkit - Number Input - User can still type more characters even when max is set](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/10926020/)]
- Text input - Readonly multiline not working [[Pull request 2243759: #11377741 fix text input readonly multiline not working - Repos](https://dev.azure.com/sc-ado/TTOQPR/_git/55313-sc-dev-web/pullrequest/2243759)]
- Date inputCan't manually clear the value in disabled mode [[Story 11283245 DevKit Component - Form Input - Date Input clear issue bugfix](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11283245/)]
- Date picker skip a month if select first day of month [[Story 11272351 DevKit Component - Form Input - Date Range Component bugfix](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11272351)

# [2.3.7] - 2025-11-27

## Features:

- Data gridAdd column management event [[Story 10138804 Webkit component - Data grid component add column management event](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/10138804/)]
- Update the scrollbar behavior [[Story 10597220 Webkit Component - Data grid scrollbar](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/10597220/)]

- Time inputAllow user to manually set the value [[Story 10245305 DevKit Component - TimeInput Component manual input Issue](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/10245305/)]

## Bug Fixes:

- Data grid: Dropdown auto closes on only one click of filter in dropdown [[Story 10954930 Webkit Component - Data Grid - Dropdown auto closes on only one click of filter in dropdown](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/10954930/)]
- Column manager reset button issue [[Story 11042580 DevKit Component - Data grid - column manager reset button issue](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11042580/)]

- Radio card:Still can set as checkable when it's disabled [[Story 11002955 Webkit Component -radio card issue: checkable when it's disabled](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11002955/)]

- ButtonUser still can click the corner of the button when it disabled[[Story 10750306 Webkit Component - Button - Disabled bugfix](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/10750306/)]

# [2.3.6] - 2025-11-18

## Features:

- Add analytics for sc-table and sc-rich-text-editor

## Bug Fixes:

- Fixed node glob vulnerability
- Fixed rich text editor copy paste issue

# [2.3.5] - 2025-11-05

## Bug Fixes:

- Hierarchical multi dropdown - Parent label should not be shown in the input

# [2.3.4] - 2025-11-03

## Bug Fixes:

- Data grid - Alignment issue
- Rich text editor - sc-change event not trigger

## Features:

- Data grid - Support header-actions slot

# [2.3.3] - 2025-10-30

## Bug Fixes:

- Data gridColumn width issue [[Story 10968910 DevKit Component - Data Grid - Column width issue](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/10968910/)]
- Tooltip issue [[Story 10968890 DevKit Component - Data grid - Tooltip issue](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/10968890/)]

- Rich text editor got blur if set extConfig [[Story 11017908 Webkit Component - rtev2: text area got blur when typing](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11017908/)]
- Stepper line style update and add more slots [[Story 11018108 Webkit Component - stepper: connector line style issue when used together with layout components](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/11018108/)]
- Form inputs components error message not show

# [2.3.2] - 2025-10-22

## Bug Fixes:

- Dropdown - Avoid bubbling sc-show event

# [2.3.1] - 2025-10-21

## Features

- Support dark mode setting in custom component

# [2.3.0] - 2025-10-17
Added

- Action bar [[Story 8401816 DevKit - Action Bar](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8401816)]
- Doc viewer [[Viewer / Universal Document Viewer - Overview ⋅ Storybook](https://servicebench-sit-stg.55313.app.standardchartered.com/sc-webkit/storybook/index.html?path=/docs/viewer-universal-document-viewer--overview)]

Features

- Data gridMulti filter for each columns [[Story 9051837 DevKit Component - Data Grid - Multi filter for each columns](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9051837)]
- Support radio type for single selection [[Story 9645561 DevKit Component - Data grid - Support radio type for single selection](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9645561/)]
- Support reset column visibility to default state [[Story 9412610 DevKit Component - Data grid - Support reset column visibility to default state user set](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9412610)]

- Rich text editorStyle update in different screen
- Set toolbar sticky by default
- Support full screen
- Align with brand guidelines
- AI integration

- Date inputSupport quick selector
- GDS update

- ScrollbarGDS update

- Multi snack bar [[Story 9910316 DevKit Component - Multi snack bar](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9910316)]
- Employee cardsingle-line-fields

- BannerAdd new dark blue background color

- ButtonGDS update

- ColorGDS update [[Colors / Colors - All ⋅ Storybook](https://servicebench-sit-stg.55313.app.standardchartered.com/sc-webkit/storybook/index.html?path=/story/colors-colors--all)]

# [2.2.12] - 2025-10-16
Features:

- File input - Add invalid files info in sc-change event if the file upload fail due to size limitation
- Modal - Add disabled setting for the modal button

Fixes:

- Date range - Fix the 2 popup issue
- Step  - Fix the tooltip overlapping issue
- Data grid - Fix the horizontal alignment issue

# [2.2.10] - 2025-10-09

## Features:

- Calendar update

# [2.2.6] - 2025-09-10

## Bug Fixes:

- Multi dropdown's placeholder not visible in disabled status
- Reduce the left space of the dropdown options
- Change the column layout auto collapse width
- The sc-pagination quick jumper is not being reset after user clicks on another page

## Features

- CarouselSupport autoplay

# [2.2.5] - 2025-08-28

## Bug Fixes:

- sc-data-grid: [Misaligned dropdown](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9916555/)
- [Column width](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9881108/)
- [Overlapping issue of tooltip hover mode](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9818851/)

# [2.2.0] - 2025-08-06

## Added:

- Typography componentsTitle (sc-title)
- Paragraph (sc-paragraph)

- Date
- Tree component

## Features:

- Data grid MVP2Header group
- Draggable row
- Draggable column
- Keyboard navigation & shortcut
- Support default expanded rows
- Show (Blanks) in filter dropdown if value is empty

- ChartsSupport custom colors

- Rich text editorFix the vulnerabilities

- Employee components style update
- Support truncate ellipsis for some components

# [2.1.14] - 2025-08-01

## Bug Fixes:

- DropdownSelect all option doesn't take the height [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9389109](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9389109)]

- Data GridChange the style of the scrollbar [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9453392](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9453392)]

- Rich text editor [[Story 9520244 DevKit Component - Rich Text Editor - Formatting issue research](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9520244/)]Support color and highlight formatting if copy from excel
- Image resize not auto saved

# [2.1.11] - 2025-07-18

## Features:

- MenuSupport custom action in menu [[Story 9081269: Foundation - Front End - SB Shell - Menu enhancement to support custom action - Boards](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9081269)]
- Highlight the action menu
- Support right click on the menu and allow user to open in new tab

## Bug Fixes:

- DropdownSelect all option doesn't been cleared if set the value as empty array
- Search something and click the select all, the selected options display wrong

- New rich text editorIf set value for the rich text editor, and then input something, the text will show from right to left [[Story 9306495 DevKit - RichTextEditor v2 - Input value bugfix](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9306495/)]

# [2.1.8] - 2025-07-10

## Features:

- New rich text editor UI update and table format
- Support custom toolbar buttons in new rich text editor

# [2.1.5] - 2025-07-07

## Bug Fixes:

- Number input clearable bugfix [[Story 8675235 DevKit Component - Bugfix for Number Input](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8675235/)]
- Multi dropdown shouldn't show the parent value in dropdown input [[Story 9195070 Webkit Component- multiple dropdown bugfix](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9195070/)]
- Multi dropdown select all will not display correctly if set the default value [[Story 9195070 Webkit Component- multiple dropdown bugfix](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/9195070/)]
- Change tooltip and tag cursor to default

## Features:

- ModalSupport expended-view in modal and show header and footer divider if there is scrollbar in modal

- PaginationIf user enter the invalid number, show the last page

- Data gridUpdate the icons [[Story 8918927 DevKit Component - Data grid - Replace the svg by webkit component](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8918927/)]

# [2.1.3] - 2025-06-17

## Bug Fixes:

- DropdownMulti select - Show * items selected based on displayValue instead of label [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8659257](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8659257)]
- Multi select -Click on the * items selected text, the dropdown list is displayed for 1 second and gets closed automatically.

- Radio GroupUser click near by the radio area select more than one value [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8461889](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8461889)]

- Employee InputBugfix and UI update [[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8819945](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8819945)]

## Features:

- Column layout dark mode update[[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8778349](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8778349)]
- Calendar dark mode update[[https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8695401](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/8695401)]

# [2.1.0] - 2025-06-12

## Added

- Font size switcherGo to profile page: [Service Bench - Profile](https://servicebench-sit.global.standardchartered.com/profile/me/settings)
- Click Appearance & Accessibility

- New rich text editor
- Slider component
- Employee avatar group
- Different title size of accordion

## Changed

- Data grid UI update
- Change button default size to sm
- Change the default body font size to 14px and following components default font size:Back button
- Body
- Link
- Cards
- File input
- List nav
- Employee card
- Checkbox
- Radio
- Switch label
- Toggle
- Status
- Accordion

- Update some icons style
- Focus status update for buttons, tabs and all form inputs

# [2.0.0] - 2025-04-16

## Added
- Avatar
  - Add a new dot badge type, and more badge color
- Badge
  - Add a new dot badge type and more color
  - Support different sizes
- Banner
  - Add closable attribute
  - Add white background color
- Breadcrumb
  - Add fill attribute
- Button
  - Add left-icon and right-icon
  - Add compact mode
- Button Group
  - Add size attribute
- Card
  - Support horizontal and vertical alignment
  - Add disabled state
  - Add tags-group
  - Add supplementary-details and can set the button details
  - Support clickable card
  - Support expandable card
- Divider
  - Support filled and card header modes
- Dropdown
  - Add size attribute
  - Add text-align attribute to support text align left and right
  - Add prefix-icon attribute to support prefix icon
  - Add advanced-search-text to show the advanced search box
  - Add retry-button to show the retry button text when options are loading or cannot be found
  - Add hint and hint-placement attributes
- Dropdown Multi Select
  - Add multiple-rows attribute to allow multiple rows
- Data View
  - Add horizontal-align and vertical-align
- File Input
  - Add button file
- File Item
  - Add extra attribute to set the extra text
  - Add default, uploading, error status attribute
- Text Input
  - Add hint and hint-placement attributes

- Pagination
  - Add size attribute to support sm and md sizes
  - Add label attribute to show the label
  - Add no-truncation attribute to hide truncation between pages
  - Add jump-first-last-page attribute to show the icons to jump to first and last pages

- Modal
  - Add footer button
  - Add no-footer attribute to hide the footer button
  - Support button, page and alternative footer types

- Search Field
  - Add sm, md, lg sizes
- Spacer
  - Add different number sizes
- Tabs
  - Add filled and segmented types
- Tag
  - Support more types
  - Add icon-name attribute to show icon
  - Add max-width to set the max width
  - Add mode attribute and move fill inside the mode
- Tooltip
  - Add more placement
  - Add more modes
  - Add header to set the tooltip header

## Changed
- Badge
  - Change the default color to blue
- Breadcrumb
  - Change the color to gray
- Button
  - Change the default type to primary
  - Remove warning and error from type and replace it by state attribute
- Icon Card
  - Image-align default value changed to left
- Dot Status
  - Replace the disabled type by neutral type
- Timer
  - Rename the size value(small, large -> sm, md, lg)

Removed
- Alert
  - Remove disabled and transparent types
- Avatar
  - Remove xl size
- Banner
  - Remove trustpoint attribute
  - Remove the round-corner attribute
- Button
  - Remove fill attribute
  - Remove icon
  - Remove inverse attribute
- Icon Button
  - Remove loading and inverse attributes
- Card
  - Remove sub-title-size attribute
- Spinner
  - Remove the xxs, xs, xl, xxl sizes
- Stepper
  - Remove the left and right position
- Tag
  - Remove fill attribute

## Deprecated
- Spacer
  - Will remove xxs, xs, sm, md, lg sizes

# [1.7.5] - 2025-04-11

## Features:

- TableSupport sc-tr-tap event for row click
- Support empty message when data is empty

## Bug Fixes:

- TableFixed pagination at the bottom of table area always.

# [1.7.4] - 2025-03-27

## Features:
Add hoist in search field component

Add dashboard component

## Bug Fixes:
Prevent double click event in readonly radio group

Bubble sc-select event in file item

Fix pagination sc-change event trigger twice issue

Invalid value in toggle [Story 7025248 DevKit Component - Toggle - bugfix](https://dev.azure.com/sc-ado/TTOQPR/_workitems/edit/7025248)

# [1.7.1] - 2025-03-04

## Features:
Support dataLookup property in dropdown component

## Bug Fixes:
Can not change the checked status of single radio component

Can't select year in date picker year selection list

# [1.6.26] - 2025-02-11

## Features:
Support cancellation in radio button

## Bug Fixes:
Remove duplicated box shadow

# [1.6.25] - 2025-02-07

## Features:
Add image in text editor

## Bug Fixes:
Draggable side sheet bugfix
