/**
 * GDS Design Tokens - Typography
 * Generated from Figma Global Design System (GDS)
 *
 * =============================================================================
 * TYPOGRAPHY PRINCIPLES & GUIDELINES
 * =============================================================================
 *
 * ## Standard Conversion Rate
 * UI engineers typically use rem for developing web pages, while UX designers
 * often work with pixels (px) in their design mockups.
 *
 * **Standard Conversion: 16 px = 1 rem**
 *
 * Example: 35px * 1.6 = 56px (line height)
 *
 * Line height is defined as a unitless multiplier (e.g. 1.6).
 * The actual pixel value of the line height is calculated as:
 * font-size (px) * line-height = line-height (px)
 *
 * =============================================================================
 * FONT FAMILY
 * =============================================================================
 *
 * Primary font: SC Prosper Sans
 * - Used for all UI components, body text, headings, and labels
 * - Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
 *
 * Note: The font family may vary by theme:
 * - GDS Light/Dark Theme: SC Prosper Sans
 * - S2B Light/Dark Theme: SC Prosper Sans
 * - sc.com Theme: (varies)
 * - Blade Theme: (varies)
 *
 * =============================================================================
 * TYPOGRAPHY SCALE
 * =============================================================================
 *
 * The typography scale follows a hierarchical structure:
 *
 * ### Hero Level (Largest)
 * - Use as core hero landing page text, or large marketing text for maximum visual impact
 * - Page layout: Ideal for huge marketing text, splash screens, or huge statistical numbers
 *
 * ### Section Level
 * - Section/Main: Primary section headings
 * - Section/Sub: Secondary section headings
 *
 * ### Title Level
 * - Title/Main: Component titles, modal titles
 * - Title/Sub: Sub-titles within components
 *
 * ### Component Level
 * - Component/Main: Button labels, input text, list items
 *
 * ### Body Level
 * - Paragraph/Main: Body copy, descriptions
 * - Bodycopy: General body text (16px)
 *
 * ### Supporting Level
 * - Label/Main: Field labels, tags
 * - Helper/Main: Helper text, tooltips
 * - Description/Main: Additional descriptions
 *
 * =============================================================================
 * UX WRITING PRINCIPLES
 * =============================================================================
 *
 * Content is a key part of experiences that help users make informed decisions.
 * Our copy should align with the brand principles: human, dynamic, direct.
 *
 * ### Voice Chart
 * | Concept    | Human                           | Dynamic                    | Direct                           |
 * |------------|--------------------------------|----------------------------|----------------------------------|
 * | Tone       | Warm, approachable and natural | Delightful, personalised   | Simple, straightforward          |
 * | Verbosity  | Enough words for clarity       | Understandable to all      | Waste no words                   |
 * | Grammar    | Conversational, sentence case  | Avoid complex punctuation  | Simple phrases, lead with action |
 *
 * ### Crafting Your Copy
 * 1. Inform - State what happened or is happening
 * 2. Give context - Explain why it matters
 * 3. Provide choices - What to do next (acknowledgement, confirmation, alternative action, or way out)
 *
 * ### Best Practices
 *
 * 1. **Active Voice**
 *    - ✅ Do: Start with a verb, subjects (you, I, we) are optional
 *    - ❌ Don't: Past or present perfect tense verbs (has been added, was done)
 *
 * 2. **Buttons and Links**
 *    - ✅ Do: Use "Verb + Object" form (e.g. Delete user)
 *    - ❌ Don't: Be careful with "OK" and "Cancel" CTA button labels
 *    - For links: Only link relevant key words to avoid sentences breaking up when translated
 *    - ❌ Don't: Use directions like above/below/right/left or "click here"
 *
 * 3. **Frequently Used Verbs**
 *    - Authorise vs Approve: Authoriser roles with 2FA vs maker flows without checker
 *    - Clear vs Reset: Clear makes fields blank, Reset reverts to defaults
 *    - Create vs Add: Create starts new from scratch, Add adds to existing collection
 *    - Delete vs Discard vs Cancel: Delete destroys, Discard erases unsaved changes, Cancel not recommended
 *    - Edit vs Manage: Edit changes a field, Manage allows multiple actions
 *    - Export/Generate vs Download: Export/Generate converts data, Download copies same format
 *    - Import vs Upload: Import converts formats, Upload copies same format
 *    - Save vs Submit vs Done: Save to database, Submit to next stage, Done for modal changes
 *
 * 4. **Write Concisely**
 *    - ✅ Do: Use icons instead of text, skip unnecessary words and punctuation
 *    - ❌ Don't: Use redundant words like "successfully", "please", "are you sure you want to"
 *
 * 5. **Errors and Warnings**
 *    - ✅ Do: Use 1-2 short sentences to describe the error and solution
 *    - ✅ Do: Warn user where there is a negative outcome
 *    - ❌ Don't: Use system error messages or redundant words like 'Please'
 *
 * =============================================================================
 * PUNCTUATION GUIDELINES
 * =============================================================================
 *
 * ### Full Stops
 * - Prose (articles, marketing copy): Use at end of complete sentences or bullet lists
 * - UX Copy (button labels, modal titles, placeholder text): Avoid full stops and unnecessary punctuation
 *   - Write copy as statements without full stops
 *   - Only use full stops when the statement contains more than one sentence
 *
 * ### Exclamation Marks
 * - Avoid as they can come across as shouting or overly friendly, especially for CIB users
 * - Exceptions: Greetings and congratulatory messages on staff and retail banking platforms
 *   (limit to one per page)
 *
 * ### Ampersands
 * - Don't use unless part of a formal or legal name, stylised region/brand, or needed in tables to save space
 * - Examples: Johnson & Johnson, Standard & Poor's
 * - Never use as a lazy alternative to 'and' (exceptions for space-limited UX copy)
 *
 * ### Oxford Comma
 * - Avoid using unless absolutely necessary for clarity
 * - ✅ Reach us via email, fax or phone
 * - ❌ Reach us via email, fax, or phone
 *
 * =============================================================================
 * DATES, TIMES, AND NUMBERS
 * =============================================================================
 *
 * ### Dates
 * - Style: day, date month year
 * - ✅ 3 Nov 2021, Wed, 5 Dec 2024
 * - When space limited: Use 3-letter abbreviations for days and months
 * - Avoid using numbers for dates unless helper text is clearly provided
 *   (regions may interpret differently: first number is month in US, day in UK)
 *
 * ### Time
 * - Use 24 hour clock (HH:MM:SS) for timestamps
 * - Use "–" endash for ranges
 * - ✅ 16:05:33, 17:00–19:00
 * - Timezones: Customized if system can personalize, otherwise use GMT format by default
 * - ✅ 12 Aug 2024, 7.30PM UTC+8
 *
 * ### Numbers
 * - Prose (articles, marketing copy): Spell out one to nine, use figures for 10+
 *   - Same rule applies for eighth, ninth, 10th, 11th
 *   - Don't make 'nd', 'rd' or 'th' superscript
 *   - Use commas in numbers higher than 999 (e.g. 1,000,000)
 *
 * - UX Copy (button labels): Use figures for all numbers as space typically limited
 *   - 2, 9, 10, 11
 *   - Don't make 'nd', 'rd' or 'th' superscript
 *   - Use commas in numbers higher than 999
 *
 * =============================================================================
 * NAMING GUIDE
 * =============================================================================
 *
 * Core approach: **don't name it, describe it**
 *
 * Most names should be **functionally descriptive** using **industry standard terms**.
 *
 * ### Do:
 * 1. Keep it short and precise (ideally one to three words)
 *    - ✅ Customer Information
 *    - ❌ Comprehensive Customer Details Plugin
 *
 * 2. Use user-centric names that focus on action and function
 *    - ✅ Customer Information: For a plugin that displays detailed customer information
 *    - ✅ Transaction History: For a plugin that lets users view transaction logs
 *    - ✅ Case Manager: For managing cases or customer requests
 *
 * 3. Use title case for product names
 *    - Nouns, verbs, adjectives and adverbs should be capitalised
 *    - Prepositions with four or more letters should be capitalised
 *    - Words like "a", "an", "at", "and", "the", "on", "or", "of", "for", "from", "with"
 *      should not be capitalised UNLESS at the start of the name
 *
 * 4. Be consistent - maintain a consistent format for all plugin names
 *
 * ### Don't:
 * 1. Do not use abbreviations or acronyms
 *    - ✅ Customer Management
 *    - ❌ CRM
 *
 * 2. Do not use redundant words and adjectives
 *    - ✅ Reports
 *    - ❌ Reporting Tool Plugin
 *
 * 3. Do not use trendy names
 *    - Avoid iDevice, eManager, Create.ai style names
 *    - Keep names focused on action or purpose
 *
 * =============================================================================
 * CAPITALIZATION
 * =============================================================================
 *
 * Use sentence case for most UI text (only first word capitalised).
 * Use title case for proper nouns, product names, and branded features.
 *
 */

// =============================================================================
// FONT FAMILIES
// =============================================================================

export const fontFamily = {
  /**
   * Primary font family: SC Prosper Sans
   * Used for all UI components, body text, headings, and labels.
   * Supports GDS Light/Dark Theme and S2B Light/Dark Theme.
   */
  primary:
    '"SC Prosper Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

  /**
   * Fallback system font stack
   * Used when SC Prosper Sans is not available
   */
  system:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

  /**
   * Monospace font for code, technical content
   */
  monospace:
    '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", "Source Code Pro", monospace',
} as const;

// =============================================================================
// FONT WEIGHTS
// =============================================================================

export const fontWeight = {
  /**
   * Regular weight (400)
   * Used for body text, descriptions, and general content
   */
  regular: 400,

  /**
   * Medium weight (500)
   * Used for emphasis, labels, buttons, and interactive elements
   */
  medium: 500,

  /**
   * Semibold weight (600)
   * Used for subtle emphasis and subheadings
   */
  semibold: 600,

  /**
   * Bold weight (700)
   * Used for headings, strong emphasis, and important labels
   */
  bold: 700,
} as const;

// =============================================================================
// FONT SIZES (in pixels)
// =============================================================================

export const fontSize = {
  /**
   * Extra Small: 10px
   * Used for fine print, annotations, and minimal labels
   */
  xs: 10,

  /**
   * Small: 12px
   * Used for helper text, labels, descriptions, and captions
   * Corresponds to: Label/Main, Helper/Main, Description/Main
   */
  sm: 12,

  /**
   * Small-Medium: 14px
   * Used for component text, paragraphs, and body copy
   * Corresponds to: Component/Main, Paragraph/Main
   */
  smMd: 14,

  /**
   * Medium: 15px
   * Used for titles, modal headers
   * Corresponds to: Title/Main
   */
  md: 15,

  /**
   * Medium-Large: 16px
   * Used for body copy and general text
   * Corresponds to: Bodycopy
   */
  mdLg: 16,

  /**
   * Large: 18px
   * Used for section minor headings
   * Corresponds to: Section/Minor
   */
  lg: 18,

  /**
   * Extra Large: 20px
   * Used for headers and important labels
   * Corresponds to: Header 5
   */
  xl: 20,

  /**
   * Section Sub: 22px
   * Used for section subheadings and prominent text
   * Corresponds to: Section/Sub
   */
  sectionSub: 22,

  /**
   * Title Sub: 24px
   * Used for title subheadings
   * Corresponds to: Title/Sub
   */
  titleSub: 24,

  /**
   * Section Main: 28px
   * Used for main section headings
   * Corresponds to: Section/Main
   */
  sectionMain: 28,

  /**
   * Header 2: 32px
   * Used for major headings and page titles
   * Corresponds to: Header 2
   */
  header2: 32,

  /**
   * Hero Main: 56px
   * Used for hero landing page text, large marketing text
   * Ideal for splash screens and statistical numbers
   * Corresponds to: Hero-Main
   */
  heroMain: 56,

  /**
   * Hero: 60px
   * Maximum impact for marketing and splash screens
   * Corresponds to: Hero
   */
  hero: 60,

  // =============================================================================
  // SEMANTIC ALIASES
  // These provide semantic naming for common use cases
  // =============================================================================

  /**
   * Helper text size: 12px
   * Alias for sm - used for helper text, labels, descriptions
   */
  helper: 12,

  /**
   * Label text size: 12px
   * Alias for sm - used for field labels and tags
   */
  label: 12,

  /**
   * Description text size: 12px
   * Alias for sm - used for additional descriptions
   */
  description: 12,

  /**
   * Component text size: 14px
   * Alias for smMd - used for buttons, input text, list items
   */
  component: 14,

  /**
   * Body text size: 16px
   * Alias for mdLg - used for general body text
   */
  body: 16,

  /**
   * Title text size: 15px
   * Alias for md - used for component titles and modal headers
   */
  title: 15,
} as const;

// =============================================================================
// LINE HEIGHTS (unitless multipliers and pixel values)
// =============================================================================

export const lineHeight = {
  /**
   * Helper/Description line height: 16px
   * Used with 12px font size
   * Multiplier: 1.33
   */
  helper: 16,
  description: 16,

  /**
   * Component line height: 100% or 22px
   * Used with 14px font size
   * Multiplier: ~1.57
   */
  component: '100%',
  componentPx: 22,

  /**
   * Title line height: 22px
   * Used with 15px font size
   * Multiplier: ~1.47
   */
  title: 22,

  /**
   * Title Sub line height: 24px
   * Used with 16px font size
   * Multiplier: 1.5
   */
  titleSub: 24,

  /**
   * Bodycopy line height: 24px
   * Used with 16px font size
   * Multiplier: 1.5
   */
  bodycopy: 24,

  /**
   * Section Minor line height: 34px
   * Used with 18px font size
   * Multiplier: ~1.89
   */
  sectionMinor: 34,

  /**
   * Header 5 line height: 28px
   * Used with 20px font size
   * Multiplier: 1.4
   */
  header5: 28,

  /**
   * Section Sub line height: 38px
   * Used with 22px font size
   * Multiplier: ~1.73
   */
  sectionSub: 38,

  /**
   * Section Main line height: 44px
   * Used with 28px font size
   * Multiplier: ~1.57
   */
  sectionMain: 44,

  /**
   * Header 2 line height: 40px
   * Used with 32px font size
   * Multiplier: 1.25
   */
  header2: 40,

  /**
   * Hero Main line height: 72px
   * Used with 56px font size
   * Multiplier: ~1.29
   */
  heroMain: 72,

  /**
   * Hero line height: 80px
   * Used with 60px font size
   * Multiplier: ~1.33
   */
  hero: 80,
} as const;

// =============================================================================
// LETTER SPACING
// =============================================================================

export const letterSpacing = {
  /**
   * Default letter spacing: 0
   * Used for all standard text
   */
  default: 0,

  /**
   * Tight letter spacing: -0.01em
   * Used for large headlines
   */
  tight: '-0.01em',

  /**
   * Wide letter spacing: 0.02em
   * Used for small text and captions
   */
  wide: '0.02em',

  /**
   * Section tracking: 0.16px
   * Used for section headings
   */
  sectionTracking: '0.16px',
} as const;

// =============================================================================
// COMPLETE TYPOGRAPHY STYLES
// =============================================================================

export const typographyStyles = {
  /**
   * Hero-Main Typography
   * Use as core hero landing page text, or large marketing text for maximum visual impact.
   * Page layout: Ideal for huge marketing text, splash screens, or huge statistical numbers.
   */
  heroMain: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.heroMain,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.heroMain,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Hero Typography
   * Maximum impact for marketing and splash screens.
   */
  hero: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.hero,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.hero,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Header 2 Typography
   * Used for major headings and page titles.
   */
  header2: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.header2,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.header2,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Section/Main Typography
   * Used for main section headings.
   */
  sectionMain: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sectionMain,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.sectionMain,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Section/Sub Typography
   * Used for section subheadings and prominent text.
   */
  sectionSub: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sectionSub,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.sectionSub,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Section/Sub Bold Typography
   * Used for section subheadings with emphasis.
   */
  sectionSubBold: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sectionSub,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.sectionSub,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Section/Minor Typography
   * Used for minor section headings.
   */
  sectionMinor: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.sectionMinor,
    letterSpacing: letterSpacing.sectionTracking,
  },

  /**
   * Header 5 Typography
   * Used for headers and important labels.
   */
  header5: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.header5,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Title/Main Typography
   * Used for component titles and modal headers.
   */
  titleMain: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.title,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Title/Sub Typography
   * Used for sub-titles within components.
   */
  titleSub: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.mdLg,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.titleSub,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Bodycopy Typography
   * Used for general body text and paragraphs.
   */
  bodycopy: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.mdLg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.bodycopy,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Paragraph/Main Typography
   * Used for body copy and descriptions.
   */
  paragraphMain: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.smMd,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.componentPx,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Component/Main Regular Typography
   * Used for buttons, input text, and list items.
   */
  componentMainRegular: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.smMd,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.componentPx,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Component/Main Medium Typography
   * Used for emphasized component text.
   */
  componentMainMedium: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.smMd,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.componentPx,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Label/Main Typography
   * Used for field labels and tags.
   */
  labelMain: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.helper,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Helper/Main Typography
   * Used for helper text and tooltips.
   */
  helperMain: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.helper,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Description/Main Typography
   * Used for additional descriptions.
   */
  descriptionMain: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.description,
    letterSpacing: letterSpacing.default,
  },

  /**
   * Extra Small Typography
   * Used for fine print and annotations.
   */
  xs: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: 1.4,
    letterSpacing: letterSpacing.default,
  },
} as const;

// =============================================================================
// CSS VARIABLE DEFINITIONS
// =============================================================================

/**
 * Typography CSS variable names following GDS naming convention
 * These map to CSS custom properties for use in stylesheets
 */
export const typographyCssVars = {
  // Hero level
  '--sc-text-style-hero-main-font-family': fontFamily.primary,
  '--sc-text-style-hero-main-font-size': '56px',
  '--sc-text-style-hero-main-font-weight': fontWeight.medium,
  '--sc-text-style-hero-main-line-height': '72px',

  '--sc-text-hero-font-family': fontFamily.primary,
  '--sc-text-hero-font-size': '60px',
  '--sc-text-hero-font-weight': fontWeight.medium,
  '--sc-text-hero-line-height': '80px',

  // Header level
  '--sc-text-header-2-font-family': fontFamily.primary,
  '--sc-text-header-2-font-size': '32px',
  '--sc-text-header-2-font-weight': fontWeight.medium,
  '--sc-text-header-2-line-height': '40px',

  '--sc-text-header-5-font-family': fontFamily.primary,
  '--sc-text-header-5-font-size': '20px',
  '--sc-text-header-5-font-weight': fontWeight.medium,
  '--sc-text-header-5-line-height': '28px',

  // Section level
  '--sc-text-section-main-font-family': fontFamily.primary,
  '--sc-text-section-main-font-size': '28px',
  '--sc-text-section-main-font-weight': fontWeight.medium,
  '--sc-text-section-main-line-height': '44px',

  '--sc-text-section-sub-font-family': fontFamily.primary,
  '--sc-text-section-sub-font-size': '22px',
  '--sc-text-section-sub-font-weight': fontWeight.bold,
  '--sc-text-section-sub-line-height': '38px',

  // Title level
  '--sc-text-title-main-font-family': fontFamily.primary,
  '--sc-text-title-main-font-size': '15px',
  '--sc-text-title-main-font-weight': fontWeight.medium,
  '--sc-text-title-main-line-height': '22px',

  '--sc-text-title-sub-font-family': fontFamily.primary,
  '--sc-text-title-sub-font-size': '16px',
  '--sc-text-title-sub-font-weight': fontWeight.semibold,
  '--sc-text-title-sub-line-height': '24px',

  // Component level
  '--sc-text-item-main-font-family': fontFamily.primary,
  '--sc-text-item-main-font-size': '14px',
  '--sc-text-item-main-font-weight': fontWeight.medium,
  '--sc-text-item-main-line-height': '22px',

  // Body level
  '--sc-text-bodycopy-font-family': fontFamily.primary,
  '--sc-text-bodycopy-font-size': '16px',
  '--sc-text-bodycopy-font-weight': fontWeight.regular,
  '--sc-text-bodycopy-line-height': '24px',

  '--sc-text-paragraph-main-font-family': fontFamily.primary,
  '--sc-text-paragraph-main-font-size': '14px',
  '--sc-text-paragraph-main-font-weight': fontWeight.regular,
  '--sc-text-paragraph-main-line-height': '22px',

  // Supporting level
  '--sc-text-label-main-font-family': fontFamily.primary,
  '--sc-text-label-main-font-size': '12px',
  '--sc-text-label-main-font-weight': fontWeight.medium,
  '--sc-text-label-main-line-height': '16px',

  '--sc-text-helper-main-font-family': fontFamily.primary,
  '--sc-text-helper-main-font-size': '12px',
  '--sc-text-helper-main-font-weight': fontWeight.medium,
  '--sc-text-helper-main-line-height': '16px',

  '--sc-text-description-main-font-family': fontFamily.primary,
  '--sc-text-description-main-font-size': '12px',
  '--sc-text-description-main-font-weight': fontWeight.regular,
  '--sc-text-description-main-line-height': '16px',
} as const;

// =============================================================================
// REM CONVERSION UTILITIES
// =============================================================================

/**
 * Convert pixels to rem units
 * Standard conversion: 16px = 1rem
 */
export const pxToRem = (px: number): string => `${px / 16}rem`;

/**
 * Typography sizes in rem units
 * Useful for responsive designs and accessibility
 */
export const fontSizeRem = {
  xs: pxToRem(fontSize.xs),
  sm: pxToRem(fontSize.sm),
  smMd: pxToRem(fontSize.smMd),
  md: pxToRem(fontSize.md),
  mdLg: pxToRem(fontSize.mdLg),
  lg: pxToRem(fontSize.lg),
  xl: pxToRem(fontSize.xl),
  sectionSub: pxToRem(fontSize.sectionSub),
  titleSub: pxToRem(fontSize.titleSub),
  sectionMain: pxToRem(fontSize.sectionMain),
  header2: pxToRem(fontSize.header2),
  heroMain: pxToRem(fontSize.heroMain),
  hero: pxToRem(fontSize.hero),
  // Semantic aliases
  helper: pxToRem(fontSize.helper),
  label: pxToRem(fontSize.label),
  description: pxToRem(fontSize.description),
  component: pxToRem(fontSize.component),
  body: pxToRem(fontSize.body),
  title: pxToRem(fontSize.title),
} as const;

// =============================================================================
// AGGREGATED EXPORTS
// =============================================================================

export const typographyTokens = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
} as const;

export default typographyTokens;