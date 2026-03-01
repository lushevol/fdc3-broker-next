/**
 * GDS Design Tokens - Standard Patterns & UX Writing Principles
 * Generated from Figma Global Design System (GDS)
 *
 * =============================================================================
 * UX WRITING PRINCIPLES
 * =============================================================================
 *
 * Content is a key part of experiences that help users make informed decisions.
 * As everything we design is part of the Standard Chartered brand, our copy
 * should align with the brand principles: human, dynamic, direct.
 *
 * ## Voice Chart
 *
 * | Concept    | Human                           | Dynamic                    | Direct                           |
 * |------------|--------------------------------|----------------------------|----------------------------------|
 * | Tone       | Warm, approachable and natural | Delightful, personalised   | Simple, straightforward          |
 * | Verbosity  | Enough words for clarity       | Understandable to all      | Waste no words                   |
 * | Grammar    | Conversational, sentence case  | Avoid complex punctuation  | Simple phrases, lead with action |
 *
 * ## Crafting Your Copy
 *
 * Follow this structure to ensure that we have a consistent and clear way to
 * get across all messages:
 *
 * 1. **Inform** - State what happened or is happening
 * 2. **Give context** - Explain why it matters
 * 3. **Provide choices** - What to do next (acknowledgement, confirmation,
 *    alternative action, or way out)
 *
 * ## Accessibility Considerations
 *
 * - Start by considering your users and understand accessibility needs
 *   during the user research phase
 * - Improve readability by breaking long paragraphs into sections
 * - Provide captions, subtitles or transcripts for visual media
 * - Provide alternative labels for interactive components
 * - Test the design with real users with accessibility needs
 */

// =============================================================================
// BEST PRACTICES
// =============================================================================

/**
 * UX Writing Best Practices
 * Guidelines for writing clear, user-friendly content
 */
export const writingBestPractices = {
  /**
   * 1. Active Voice
   * The active voice is easier to understand since it directly addresses the user.
   *
   * DO:
   * - Start with a verb
   * - Subjects (you, I, we) are optional
   *
   * DON'T:
   * - Past or present perfect tense verbs (has been added, was done)
   *
   * @example
   * ✅ DO: "Export your form as PDF"
   * ❌ DON'T: "Your form can now be exported as PDF"
   */
  activeVoice: {
    do: [
      'Start with a verb',
      'Subjects (you, I, we) are optional',
    ],
    dont: [
      'Past or present perfect tense verbs (has been added, was done)',
    ],
    examples: {
      good: 'Export your form as PDF',
      bad: 'Your form can now be exported as PDF',
    },
  },

  /**
   * 2. Buttons and Links
   * Buttons and links need to be clear and predictable.
   *
   * DO:
   * - Use "Verb + Object" form (e.g. Delete user)
   * - Use links instead of describing the location of a button
   * - Only link relevant key words to avoid sentences breaking up when translated
   *
   * DON'T:
   * - Be careful when using "OK" and "Cancel" CTA button labels
   * - Use directions like above/below/right/left
   * - Use "click here" or "here" as link text
   *
   * @example
   * ✅ DO: "Need help? Submit a ticket"
   * ❌ DON'T: "Need help? Click 'Start new ticket' below to ask a query."
   */
  buttonsAndLinks: {
    do: [
      'Use "Verb + Object" form (e.g. Delete user)',
      'Use links instead of describing the location of a button',
      'Only link relevant key words to avoid sentences breaking up when translated',
    ],
    dont: [
      'Be careful when using "OK" and "Cancel" CTA button labels as they may contradict the exit journey',
      'Use directions like above/below/right/left. They are confusing when translated',
      'Use "click here" or "here" as link text',
    ],
    examples: {
      good: 'Need help? Submit a ticket',
      bad: 'Need help? Click "Start new ticket" below to ask a query.',
    },
  },

  /**
   * 3. Frequently Used Verbs
   * For consistency, use the same verb for the same action across all platforms.
   */
  frequentlyUsedVerbs: {
    /**
     * Authorise vs Approve
     * - Authorise: Only for 'authoriser' roles, usually followed by 2FA
     *   Negative action: Decline
     * - Approve: Only for maker flows with no checker involved
     *   Negative action: Reject
     */
    authoriseVsApprove: {
      authorise: 'Can only be performed by authoriser roles, usually followed by 2FA',
      authoriseNegative: 'Decline',
      approve: 'Only used for maker flows with no checker involved',
      approveNegative: 'Reject',
      examples: ['Authorise payment', 'Decline request', 'Approved by Bank', 'Rejected by Bank'],
    },

    /**
     * Clear vs Reset
     * - Clear: Makes all input fields blank including unchecking checkboxes
     * - Reset: Reverts all changes to a form to default value
     */
    clearVsReset: {
      clear: 'Makes all input fields blank including unchecking of checkboxes and deselecting choices',
      reset: 'Reverts all changes to a form to default value',
      examples: ['Clear filters', 'Clear fields', 'Reset fields', 'Reset to default'],
    },

    /**
     * Create vs Add
     * - Create: Encourages users to start something new from scratch
     * - Add: Allows users to add to an existing collection
     */
    createVsAdd: {
      create: 'Encourages users to start something new from scratch',
      add: 'Allows users to add to an existing collection',
      examples: ['Create article', 'Create payee', 'Add user', 'Add test case'],
    },

    /**
     * Delete vs Discard vs Cancel
     * - Delete: Destroys an existing object so that it no longer exists
     * - Discard: Erases unsaved changes and provides a way out
     * - Cancel: Also erases unsaved changes. Not recommended.
     */
    deleteVsDiscardVsCancel: {
      delete: 'Destroys an existing object so that it no longer exists. Delete should be followed with a confirmation.',
      discard: 'Erases unsaved changes and provides a way out. Discard should be followed with a confirmation.',
      cancel: 'Also erases unsaved changes. Not recommended as it may be confusing when the positive flow is also a cancellation.',
      examples: ['Delete file', 'Discard changes'],
    },

    /**
     * Edit vs Manage
     * - Edit: Allows users to change a field input
     * - Manage: Allows users to take multiple actions on an input
     */
    editVsManage: {
      edit: 'Allows users to change a field input. If placed next to the editable field there is no need for a noun.',
      manage: 'Allows users to take multiple actions on an input',
    },

    /**
     * Export/Generate vs Download
     * - Export/Generate: Initiates transfer and conversion of data. User expects some time.
     * - Download: Copies data in the same format. Process should be near-instant.
     */
    exportVsDownload: {
      exportGenerate: 'Initiates transfer and conversion of data to the user\'s machine. User expects some time will be needed.',
      download: 'Copies data in the same format to the user\'s machine. Process should be near-instant.',
      examples: ['Export CSV', 'Generate swagger', 'Download PDF'],
    },

    /**
     * Import vs Upload
     * - Import: Used when users transfer data for conversion into another format
     * - Upload: Used when users copy data of the same format to your platform
     */
    importVsUpload: {
      import: 'Used when users transfer data for conversion into another format',
      upload: 'Used when users copy data of the same format to your platform',
      examples: ['Import swagger', 'Upload photo'],
    },

    /**
     * Save vs Submit vs Done
     * - Save: Saves an input immediately to a database. Status is typically 'in progress' or 'draft'.
     * - Submit: Indicates submission of input to the next stage for review or approval
     * - Done: Applies changes inside a modal or sheet that have not yet been saved
     */
    saveVsSubmitVsDone: {
      save: 'Saves an input immediately to a database. Status of object is typically "in progress" or "draft".',
      submit: 'Indicates submission of input to the next stage i.e. for review or approval',
      done: 'Applies changes inside a modal or sheet that have not yet been saved. When the modal or sheet closes, users can save or submit all changes.',
    },
  },

  /**
   * 4. Write Concisely
   * Reduce the amount of text. Too much text makes a platform feel cheap.
   *
   * DO:
   * - Use icons instead of text
   * - Skip unnecessary words and punctuation
   * - Anticipate errors by designing to prevent them
   *
   * DON'T:
   * - Repeated or unnecessary words e.g. "successfully", "please",
   *   "are you sure you want to"
   * - Error messages that could have been avoided
   */
  writeConcisely: {
    do: [
      'Use icons instead of text',
      'Skip unnecessary words and punctuation',
      'Anticipate errors by designing to prevent them',
    ],
    dont: [
      'Repeated or unnecessary words e.g. "successfully", "please", "are you sure you want to"',
      'Error messages that could have been avoided',
    ],
  },

  /**
   * 5. Errors and Warnings
   * Write error messaging in a human-centered way by guiding a user and
   * showing them a solution.
   *
   * DO:
   * - Use 1-2 short sentences to describe the error and solution
   * - Warn user in cases where there is a negative outcome
   *
   * DON'T:
   * - Use system error messages
   * - Use redundant words like 'Please'
   *
   * @example
   * ✅ DO: "This field is required" / "This is an invalid email address"
   * ❌ DON'T: "Please add an input" / "Error 400"
   */
  errorsAndWarnings: {
    do: [
      'Use 1-2 short sentences to describe the error and solution',
      'Warn user in cases where there is a negative outcome if they continue entering the wrong input',
    ],
    dont: [
      'Use system error messages',
      'Redundant words like "Please"',
    ],
    examples: {
      goodEmptyField: 'This field is required',
      badEmptyField: 'Please add an input',
      goodInvalidField: 'This is an invalid email address',
      badInvalidField: 'Error 400',
    },
  },
} as const;

// =============================================================================
// NAMING GUIDE
// =============================================================================

/**
 * Naming Guide for Products and Features
 *
 * Core approach: **don't name it, describe it**
 *
 * Most names should be **functionally descriptive** using **industry standard terms**.
 */
export const namingGuide = {
  /**
   * DO:
   * 1. Keep it short and precise (ideally one to three words)
   * 2. Use user-centric names that focus on action and function
   * 3. Use title case for product names
   * 4. Be consistent
   */
  do: [
    'Keep it short and precise (ideally one to three words)',
    'Use user-centric names that focus on action and function',
    'Use title case for product names',
    'Be consistent - maintain a consistent format for all plugin names',
  ],

  /**
   * DON'T:
   * 1. Do not use abbreviations or acronyms
   * 2. Do not use redundant words and adjectives
   * 3. Do not use trendy names
   */
  dont: [
    'Do not use abbreviations or acronyms',
    'Do not use redundant words and adjectives',
    'Do not use trendy names (iDevice, eManager, Create.ai style names)',
  ],

  /**
   * Title Case Rules:
   * - Nouns, verbs, adjectives and adverbs should be capitalised
   * - Prepositions with four or more letters should be capitalised
   * - Words like "a", "an", "at", "and", "the", "on", "or", "of", "for",
   *   "from", "with" should NOT be capitalised UNLESS at the start
   */
  titleCaseRules: {
    capitalize: ['Nouns', 'Verbs', 'Adjectives', 'Adverbs', 'Prepositions with 4+ letters'],
    doNotCapitalize: ['a', 'an', 'at', 'and', 'the', 'on', 'or', 'of', 'for', 'from', 'with'],
    exception: 'These words SHOULD be capitalised when at the START of the name',
  },

  /**
   * Examples of good naming
   */
  examples: {
    good: [
      'Customer Information',
      'Transaction History',
      'Case Manager',
      'Task Tracker',
      'Reports',
      'Audit Logs',
    ],
    bad: [
      'Comprehensive Customer Details Plugin',
      'CRM',
      'Reporting Tool Plugin',
      'Intelligent Ticket Management Platform',
      'iDevice',
      'eManager',
    ],
  },
} as const;

// =============================================================================
// PUNCTUATION GUIDELINES
// =============================================================================

/**
 * Punctuation Guidelines
 * Rules for using punctuation in UX copy
 */
export const punctuationGuidelines = {
  /**
   * Full Stops
   * - Prose (articles, marketing copy): Use at end of complete sentences or bullet lists
   * - UX Copy (button labels, modal titles, placeholder text): Avoid full stops
   *   - Write copy as statements without full stops
   *   - Only use full stops when the statement contains more than one sentence
   */
  fullStops: {
    prose: 'Use at end of complete sentences or bullet lists',
    uxCopy: 'Avoid full stops and unnecessary punctuation. Only use when statement contains more than one sentence.',
  },

  /**
   * Exclamation Marks
   * - Avoid as they can come across as shouting or overly friendly
   * - Exceptions: Greetings and congratulatory messages on staff and retail
   *   banking platforms (limit to one per page)
   */
  exclamationMarks: {
    rule: 'Avoid as they can come across as shouting or overly friendly, especially for CIB users',
    exceptions: 'Greetings and congratulatory messages on staff and retail banking platforms (limit to one per page)',
  },

  /**
   * Ampersands
   * - Don't use unless part of a formal or legal name, stylised region/brand,
   *   or needed in tables to save space
   * - Examples: Johnson & Johnson, Standard & Poor's
   * - Never use as a lazy alternative to 'and'
   */
  ampersands: {
    rule: 'Don\'t use unless part of a formal or legal name',
    exceptions: ['Johnson & Johnson', 'Standard & Poor\'s'],
    note: 'Never use as a lazy alternative to "and" (exceptions for space-limited UX copy)',
  },

  /**
   * Oxford Comma
   * - Avoid using unless absolutely necessary for clarity
   */
  oxfordComma: {
    rule: 'Avoid using unless absolutely necessary for clarity',
    examples: {
      good: 'Reach us via email, fax or phone',
      bad: 'Reach us via email, fax, or phone',
    },
  },
} as const;

// =============================================================================
// DATES, TIMES, AND NUMBERS
// =============================================================================

/**
 * Dates, Times, and Numbers Formatting Guidelines
 */
export const dateTimeNumberGuidelines = {
  /**
   * Dates
   * - Style: day, date month year
   * - When space limited: Use 3-letter abbreviations for days and months
   * - Avoid using numbers for dates unless helper text is clearly provided
   */
  dates: {
    style: 'day, date month year',
    examples: ['3 Nov 2021', 'Wed, 5 Dec 2024'],
    abbreviations: 'Use 3-letter abbreviations for days and months when space limited',
    warning: 'Avoid using numbers for dates unless helper text is clearly provided (regions may interpret differently)',
  },

  /**
   * Time
   * - Use 24 hour clock (HH:MM:SS) for timestamps
   * - Use "–" endash for ranges
   * - Timezones: Customized if system can personalize, otherwise use GMT format
   */
  time: {
    format: '24 hour clock (HH:MM:SS) for timestamps',
    ranges: 'Use "–" endash for ranges',
    examples: ['16:05:33', '17:00–19:00'],
    timezone: 'Customized if system can personalize, otherwise use GMT format by default',
    timezoneExample: '12 Aug 2024, 7.30PM UTC+8',
  },

  /**
   * Numbers
   * - Prose: Spell out one to nine, use figures for 10+
   * - Same rule applies for eighth, ninth, 10th, 11th
   * - Don't make 'nd', 'rd' or 'th' superscript
   * - Use commas in numbers higher than 999 (e.g. 1,000,000)
   *
   * - UX Copy: Use figures for all numbers as space typically limited
   * - Don't make 'nd', 'rd' or 'th' superscript
   * - Use commas in numbers higher than 999
   */
  numbers: {
    prose: {
      rule: 'Spell out one to nine, use figures for 10+',
      ordinals: 'Same rule applies for eighth, ninth, 10th, 11th',
      superscript: 'Don\'t make "nd", "rd" or "th" superscript',
      commas: 'Use commas in numbers higher than 999 (e.g. 1,000,000)',
    },
    uxCopy: {
      rule: 'Use figures for all numbers as space typically limited',
      examples: '2, 9, 10, 11',
      superscript: 'Don\'t make "nd", "rd" or "th" superscript',
      commas: 'Use commas in numbers higher than 999',
    },
  },
} as const;

// =============================================================================
// CAPITALIZATION
// =============================================================================

/**
 * Capitalization Guidelines
 * Use sentence case for most UI text (only first word capitalised).
 * Use title case for proper nouns, product names, and branded features.
 */
export const capitalizationGuidelines = {
  /**
   * Sentence Case
   * - Only the first word is capitalised
   * - Use for most UI text
   */
  sentenceCase: 'Only the first word is capitalised. Use for most UI text.',

  /**
   * Title Case
   * - Use for proper nouns, product names, and branded features
   */
  titleCase: 'Use for proper nouns, product names, and branded features.',

  /**
   * Examples
   */
  examples: {
    sentenceCase: ['Customer information', 'Transaction history', 'Settings and preferences'],
    titleCase: ['Customer 360', 'Entity 360', 'Open Banking Marketplace'],
  },
} as const;

// =============================================================================
// STANDARD PATTERNS
// =============================================================================

/**
 * Standard Patterns for Common UX Scenarios
 */
export const standardPatterns = {
  /**
   * Confirmation Patterns
   * Use case: Warn user of unintended consequences when they perform a task
   */
  confirmation: {
    titlePattern: 'Clear question or statement about the action',
    bodyPattern: 'Explain consequences and provide context',
    primaryAction: 'Affirmative action (e.g., Delete, Proceed, Submit)',
    secondaryAction: 'Way out (e.g., Cancel, Keep editing)',
    tertiaryAction: 'Alternative (e.g., Save draft)',
  },

  /**
   * Empty or Invalid Fields
   * Use the same error message for empty fields for consistency and easy scanning
   * Do not repeat the field name e.g. 'Account number cannot be empty'
   */
  emptyFields: {
    rule: 'Use the same error message for empty fields for consistency and easy scanning',
    example: 'This field is required',
    dont: 'Do not repeat the field name (e.g. "Account number cannot be empty")',
  },

  /**
   * System Errors
   * Provide helpful guidance when system errors occur
   */
  systemErrors: {
    rule: 'Explain what happened and provide a solution or next step',
    pattern: 'What happened + Why it matters + What to do next',
  },

  /**
   * Session Timeout
   * Warn users before session expires
   */
  sessionTimeout: {
    warningTitle: 'Session about to expire',
    warningBody: 'You will be logged out in X minutes due to inactivity.',
    action: 'Stay logged in',
    logoutAction: 'Log out now',
  },
} as const;

// =============================================================================
// AGGREGATED EXPORTS
// =============================================================================

export const uxWritingTokens = {
  writingBestPractices,
  namingGuide,
  punctuationGuidelines,
  dateTimeNumberGuidelines,
  capitalizationGuidelines,
  standardPatterns,
} as const;

export default uxWritingTokens;