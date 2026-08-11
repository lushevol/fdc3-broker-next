export const EXCLUDED_TAGS = Object.freeze({
  'sc-dashboard-viewer':
    'Vendor dashboard integrations are outside the Ratan v2 UI catalogue.',
  'sc-document-image-viewer':
    'DocumentImageViewer is explicitly excluded from the v2 parity scope.',
  'sc-rich-text-editor':
    'The legacy RichTextEditor is explicitly excluded from the v2 parity scope.',
  'sc-tour': 'Tour is explicitly excluded from the v2 parity scope.',
});

export const EXCLUDED_EXPORTS = new Set([
  'ScDashboardViewer',
  'ScDocumentImageViewer',
  'ScRichTextEditor',
  'ScTour',
]);

export const SUPPORTING_TAGS = new Set([
  'sc-data-grid-cell',
  'sc-data-grid-column-filter',
  'sc-data-grid-column-set-filter',
  'sc-data-grid-composite-filter',
  'sc-data-grid-dragging-shadow',
  'sc-data-grid-editing',
  'sc-data-grid-master-cell',
  'sc-data-grid-overlapping',
  'sc-data-grid-selection-cell',
  'sc-data-grid-column-manager',
  'sc-date-input-surface',
  'sc-date-time-select',
  'sc-icon-provider',
  'sc-month-calendar',
  'sc-month-grid',
  'sc-table-filter',
  'sc-table-header-with-sort',
  'sc-year-grid',
  'sc-year-grid-button',
]);

export const SUPPORTING_EXPORTS = new Set([
  'FormInputBase',
  'ScIconProvider',
  'activeInputStyle',
  'focusInputStyle',
  'formGroupStyle',
]);

export const COMPONENT_NAME_OVERRIDES = Object.freeze({
  'sc-dropdown-input': 'Select',
  'sc-dropdown-multi-select': 'MultiSelect',
  'sc-dropdown-option': 'SelectOption',
  'sc-tab-group': 'Tabs',
});

export const SUBPATH_OVERRIDES = Object.freeze({
  'sc-data-grid': './data-grid',
  'sc-data-view': './data-view',
  'sc-date-input': './date-picker',
  'sc-date-input-surface': './date-picker',
  'sc-date-picker': './date-picker',
  'sc-date-range-input': './date-picker',
  'sc-date-range-picker': './date-picker',
  'sc-date-time-select': './date-picker',
  'sc-dropdown-input': './select',
  'sc-dropdown-multi-select': './select',
  'sc-dropdown-option': './select',
  'sc-month-calendar': './date-picker',
  'sc-month-grid': './date-picker',
  'sc-tab': './tabs',
  'sc-tab-divider': './tabs',
  'sc-tab-group': './tabs',
  'sc-tab-panel': './tabs',
  'sc-table-filter': './table',
  'sc-table-header-with-sort': './table',
  'sc-year-grid': './date-picker',
  'sc-year-grid-button': './date-picker',
});

export const PROPERTY_RENAMES = Object.freeze({
  autofocus: { reactProp: 'autoFocus' },
  readonly: { reactProp: 'readOnly' },
  readonlyRows: { reactProp: 'readOnlyRows' },
});

export const COMPONENT_PROPERTY_RENAMES = Object.freeze({
  'sc-button': {
    leftIcon: { reactProp: 'startIcon' },
    noBorder: { reactProp: 'border', transform: 'boolean-invert' },
    noPill: { reactProp: 'pill', transform: 'boolean-invert' },
    rightIcon: { reactProp: 'endIcon' },
    state: { reactProp: 'tone' },
    type: { reactProp: 'variant' },
  },
});

export const COMPONENT_SLOT_RENAMES = Object.freeze({
  'sc-text-input': {
    error: 'errorContent',
    success: 'successContent',
  },
});

export const BUTTON_CONTRACT = Object.freeze({
  variants: ['primary', 'secondary', 'text', 'link'],
  tones: ['default', 'error', 'alert', 'success'],
  sizes: ['xxs', 'xs', 'sm', 'md', 'lg'],
  defaults: {
    variant: 'primary',
    tone: 'default',
    size: 'sm',
    pill: true,
    border: true,
  },
});

export const TEXT_INPUT_CONTRACT = Object.freeze({
  variants: ['line', 'box'],
  tones: [],
  sizes: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  defaults: {
    type: 'text',
    multiline: false,
    showCharacterCount: false,
    prefixIcon: '',
    suffixIcon: '',
    suffixLabel: '',
    autoFocus: false,
    value: '',
    borderType: 'box',
    clearable: false,
    labelPosition: 'top',
    size: 'md',
    textAlign: 'left',
    useDefaultSlotNotAsLabel: false,
    formControlClsName: 'sc-form-control',
    placeholder: 'Input here',
    helpText: '',
    readOnly: false,
    disabled: false,
    success: false,
    error: false,
    errorMessage: '',
    successMessage: '',
    maxRows: false,
    readOnlyRows: 5,
    required: false,
    label: '',
    labelAlignment: 'left',
    tooltip: '',
    hint: '',
    tooltipPlacement: 'top',
    hintPlacement: 'right',
    labelSize: 'md',
    trustpoint: false,
    truncate: false,
  },
});

export const EVIDENCE_RESOLUTIONS = Object.freeze([
  {
    id: 'sc-tab-computed-animation-symbol',
    subject: 'sc-tab contract.methods.[ANIMATE_INDICATOR]',
    selectedEvidence: 'observed-runtime',
    rationale:
      'The custom-elements manifest exposes the computed symbol member, but the pinned runtime has no public string-keyed method named [ANIMATE_INDICATOR]. It is an internal animation hook and is excluded from the React imperative contract.',
    sources: [
      'runtime-observations.json#sc-tab',
      'sc-dev-web/sc-dev-web/src/components/ScTab/ScTab.ts',
      'sc-dev-web/sc-dev-web/custom-elements.json',
    ],
  },
]);

export const APPROVED_DEVIATIONS = Object.freeze([
  Object.freeze({
    id: 'button-loading-announcement',
    legacyTag: 'sc-button',
    category: 'accessibility',
    rationale:
      'The frozen button exposes loading visually but does not provide a localized live-region announcement. Ratan adds a caller-localizable loadingLabel while preserving the button accessible name, focus, and geometry.',
    approvedBy: 'Ratan Design foundation approval',
    tests: [
      'packages/react/tests/button.contract.test.tsx#announces-a-localized-loading-label',
      'packages/react/tests/button.contract.test.tsx#passes-automated-accessibility-checks',
    ],
  }),
]);
