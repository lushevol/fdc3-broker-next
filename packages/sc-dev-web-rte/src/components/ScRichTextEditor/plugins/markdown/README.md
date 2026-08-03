Core Markdown

  - [x] Paragraphs
  - [x] Hard line breaks via two trailing spaces
  - [x] Backslash escapes for special chars
  - [x] Blank-line paragraph separation
  - [x] Horizontal rules: ---, ***, ___
  - [x] ATX headings: # through ######
  - [x] Setext headings: ===, ---
  - [x] Nested blockquotes
  - [x] Inline code spans
  - [x] Indented code blocks
  - [x] Fenced code blocks with backticks
  - [x] Fenced code blocks with tildes
  - [x] Fenced code info strings
  - [x] Ordered lists
  - [x] Unordered lists with -, *, +
  - [x] Mixed nested lists
  - [x] Loose vs tight lists
  - [x] List items with multiple paragraphs
  - [x] Blockquotes inside lists
  - [x] Lists inside blockquotes

Inline Emphasis

  - [x] Italic with *text*
  - [x] Italic with _text_
  - [x] Bold with **text**
  - [x] Bold with __text__
  - [x] Bold+italic nesting
  - [x] Strikethrough ~~text~~
  - [x] Nested emphasis edge cases
  - [x] Escape handling inside emphasis

Links

  - [x] Inline links `[text](url)`
  - [x] Title-bearing links `[text](url "title")`
  - [x] Autolink URLs `<https://example.com>`
  - [x] Email autolinks `<a@b.com>`
  - [x] Bare URL linkification for GitHub/Azure style text
  - [x] Relative links
  - [x] Root-relative links
  - [x] Anchor links #heading
  - [x] Reference links
  - [x] Collapsed reference links
  - [x] Shortcut reference links
  - [x] Link text with nested emphasis/code
  - [x] Safe HTML attrs on render: rel, target, sanitize protocol

Images

  - [x] Inline images `![alt](src)`
  - [x] Image titles `![alt](src "title")`
  - [x] Relative image paths
  - [x] Absolute image paths
  - [x] External image URLs
  - [x] Images inside links
  - [x] Alt text preservation
  - [x] Azure image-size syntax `![alt](img.png =500x250)`

GitHub Flavored Markdown

  - [x] Tables
  - [x] Tables with alignment row
  - [x] Escaped pipes in table cells
  - [x] Multi-line cell fallback policy
  - [x] Task lists - [ ], - [x]
  - [x] Task lists inside ordered lists
  - [x] Strikethrough
  - [x] Fenced code with language identifiers
  - [x] Syntax-highlight round-trip for fenced blocks
  - [x] HTML table fallback when markdown table cannot represent source
  - [x] Autolink literals if target surface needs GFM parity

GitHub Common Extensions Often Expected

  - [x] Footnotes `[^1]`
  - [x] Footnote definitions
  - [x] Definition lists if desired
  - [x] Highlight/mark syntax policy if editor emits it
  - [x] Emoji shortcodes `:smiley:` -> :smiley:
  - [x] Issue/PR mention text preservation policy
  - [x] HTML comments not preserved (tinymce/hugerte)
  - [x] `<details>``<summary>` block preservation
  - [x] Mermaid fenced blocks \`\`\`mermaid
  - [x] Math block preservation policy (wrap pre.sc-math)
  - [x] Front matter preservation policy

Azure DevOps Compatibility

  - [x] Wiki/README-safe tables
  - [x] Wiki task lists
  - [x] Emoji shortcode preservation
  - [x] Anchor-link slug behavior close enough for Azure headings
  - [x] KaTeX inline math `$...$` preservation
  - [x] KaTeX block math `$$...$$` preservation
  - [x] Mermaid fenced blocks for wiki
  - [x] `[[_TOC_]]` preservation
  - [x] `[[_TOSP_]]` preservation if wiki pages matter
  - [x] Work item refs like `#123` preserve as text
  - [x] Mentions like `@user` or `@<{guid}>` preserve as text
  - [x] Attachment links preserve as normal links
  - [x] `::: mermaid`, `::: video`, `::: query-table` container preservation (wrap pre.sc-azure-container)
  - [x] Pull-request suggestion fences \`\`\`suggestion preservation if PR comments matter

HTML Pass-Through / Rich Text

  - [x] Safe inline HTML pass-through
  - [x] Safe block HTML pass-through
  - [x] Underline via `<u>`
  - [x] Superscript via `<sup>`
  - [x] Subscript via `<sub>`
  - [x] `<span style="color:...">` preservation
  - [x] `<span style="background:...">` preservation
  - [x] Alignment HTML: align or text-align
  - [x] `<details>``<summary>` preservation
  - [x] `<br>` preservation
  - [x] `<kbd>` preservation if used
  - [x] `<ins>`, `<del>`, `<tt>`, `<small>`, `<big>`, `<center>` policy
  - [x] Unsupported HTML sanitize, strip, or escape predictably

Code Block Details

  - [x] Language tags preserved exactly when valid
  - [x] Unknown language tags preserved without crash
  - [x] No language fallback stable
  - [x] Code content escaping stable
  - [x] Backticks inside code fence choose longer fence when needed
  - [x] Tilde fences survive if source used them, or normalize consistently
  - [x] Highlighted HTML code blocks convert back to fenced markdown

Tables

  - [x] Header row required/normalized
  - [x] Column alignment round-trip
  - [x] Empty header synthesis policy (tbody-only tables synthesize blank header row + alignment separator using detected column count/alignment)
  - [x] Captions policy (HTML `<caption>` is extracted as plain text paragraph above markdown table; caption tag itself is removed)
  - [x] Colspan fallback policy (expand colspan into additional empty markdown cells in same row to preserve table shape)
  - [x] Rowspan fallback policy (if any cell has rowspan >` 1, preserve whole table as wrapped raw HTML; no markdown flattening)
  - [x] Nested tables fallback to HTML
  - [x] Lists/code/blockquote inside table fallback to HTML
  - [x] Styled tables fallback to HTML
  - [x] Border attr normalization if HTML renderer requires it

Front Matter

  - [x] YAML front matter at doc start
  - [x] --- open and close markers
  - [x] ... close marker
  - [x] Scalars
  - [x] Arrays
  - [x] Nested objects
  - [x] Booleans/null/numbers typed sensibly
  - [x] Invalid YAML fallback policy (no metadata table render)
  - [x] Front matter only at top of document
  - [x] Round-trip without losing key order if important (YAML object key insertion order is preserved through parse/render/dump path)

Round-Trip Invariants

  - [x] Semantic equality for core Markdown
  - [x] Stable normalization rules documented
  - [x] No editor-private attrs survive export
  - [x] No dangerous HTML survives render
  - [x] Unsupported constructs degrade predictably
  - [x] Plain text never mutates into unexpected markdown
  - [x] Existing HTML blocks not double-escaped when allowed
  - [x] Empty input returns empty output
  - [x] Nullish input policy explicit
  - [x] Unicode, smart quotes, typographer transforms policy explicit

Security / Sanitization

  - [x] Strip script, object, iframe, unsafe embeds
  - [x] Strip event-handler attrs like onclick
  - [x] Sanitize javascript: URLs
  - [x] Sanitize dangerous inline CSS if needed (DOMPurify strips unsafe CSS patterns; preserve safe inline color/background only)
  - [x] Preserve safe attrs only
  - [x] Escape unsupported tags rather than partially rendering them

Normalization Decisions

  - [x] Heading output style fixed to ATX
  - [x] Horizontal rule output fixed to ---
  - [x] Bullet marker output fixed to -
  - [x] Emphasis output fixed to _
  - [x] Strong output fixed to **
  - [x] Link output fixed to inline links
  - [x] Code blocks output fixed to fenced blocks
  - [x] Table output fixed to GFM where representable
  - [x] HTML fallback rules documented for non-representable content

Test Corpus Need

  - [x] Each syntax feature has md -> html test
  - [x] Each syntax feature has html -> md test where representable
  - [x] Each feature has full md -> html -> md snapshot
  - [x] Each HTML-rich feature has html -> md -> html snapshot
  - [x] Each sanitize rule has attack-case test
  - [x] Each Azure-specific extension has explicit fixture
  - [x] Each GitHub-specific extension has explicit fixture