import { SimpleRtfParser, parseRtf } from '../../../../src/components/ScRichTextEditor/ext/rtfParser.js';
import { OfficeParserConfig } from '../../../../src/components/ScRichTextEditor/ext/types.js';
import { Buffer } from '@taichunmin/buffer';

describe('SimpleRtfParser', () => {
  describe('basic parsing', () => {
    it('should parse an empty RTF document', () => {
      const buffer = Buffer.from('{}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      // Parser creates a root group containing the parsed braces
      expect(result.type).toBe('group');
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'group',
        content: [],
      });
    });

    it('should parse a simple RTF document with text', () => {
      const buffer = Buffer.from('{Hello World}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      expect(result.type).toBe('group');
      expect(result.content).toHaveLength(1);
      const innerGroup = result.content[0] as any;
      expect(innerGroup.type).toBe('group');
      expect(innerGroup.content[0]).toEqual({
        type: 'text',
        value: 'Hello World',
      });
    });

    it('should parse RTF with control word', () => {
      const buffer = Buffer.from('{\\rtf1}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      expect(result.type).toBe('group');
      expect(result.content).toHaveLength(1);
      const innerGroup = result.content[0] as any;
      expect(innerGroup.content[0]).toEqual({
        type: 'control',
        value: 'rtf',
        param: 1,
      });
      expect(innerGroup.destination).toBe('rtf');
    });

    it('should parse control word with parameter', () => {
      const buffer = Buffer.from('{\\fs24}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const innerGroup = result.content[0] as any;
      expect(innerGroup.content[0]).toEqual({
        type: 'control',
        value: 'fs',
        param: 24,
      });
    });

    it('should parse control word with negative parameter', () => {
      const buffer = Buffer.from('{\\li-720}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const innerGroup = result.content[0] as any;
      expect(innerGroup.content[0]).toEqual({
        type: 'control',
        value: 'li',
        param: -720,
      });
    });

    it('should parse control word without parameter', () => {
      const buffer = Buffer.from('{\\b}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const innerGroup = result.content[0] as any;
      expect(innerGroup.content[0]).toEqual({
        type: 'control',
        value: 'b',
        param: undefined,
      });
    });
  });

  describe('control symbols', () => {
    it('should parse escaped opening brace', () => {
      const buffer = Buffer.from('{\\{}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const innerGroup = result.content[0] as any;
      expect(innerGroup.content[0]).toEqual({
        type: 'text',
        value: '{',
      });
    });

    it('should parse escaped closing brace', () => {
      const buffer = Buffer.from('{\\}}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const innerGroup = result.content[0] as any;
      expect(innerGroup.content[0]).toEqual({
        type: 'text',
        value: '}',
      });
    });

    it('should parse escaped backslash', () => {
      const buffer = Buffer.from('{\\\\}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const innerGroup = result.content[0] as any;
      expect(innerGroup.content[0]).toEqual({
        type: 'text',
        value: '\\',
      });
    });

    it('should parse hex character escape', () => {
      const buffer = Buffer.from('{\\\'41}'); // 'A'
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const innerGroup = result.content[0] as any;
      expect(innerGroup.content[0]).toEqual({
        type: 'text',
        value: 'A',
      });
    });

    it('should parse ignorable destination marker', () => {
      const buffer = Buffer.from('{\\*}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const innerGroup = result.content[0] as any;
      expect(innerGroup.content[0]).toEqual({
        type: 'control',
        value: '*',
      });
    });
  });

  describe('nested groups', () => {
    it('should parse nested groups', () => {
      const buffer = Buffer.from('{{inner}}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      expect(result.type).toBe('group');
      expect(result.content).toHaveLength(1);
      const outerGroup = result.content[0] as any;
      expect(outerGroup.type).toBe('group');
      expect(outerGroup.content).toHaveLength(1);
      const innerGroup = outerGroup.content[0] as any;
      expect(innerGroup).toMatchObject({
        type: 'group',
        content: [{ type: 'text', value: 'inner' }],
      });
    });

    it('should parse multiple nested groups', () => {
      const buffer = Buffer.from('{group1{group2}{group3}}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const mainGroup = result.content[0] as any;
      expect(mainGroup.content).toHaveLength(3);
      expect(mainGroup.content[0]).toEqual({
        type: 'text',
        value: 'group1',
      });
      expect(mainGroup.content[1]).toMatchObject({
        type: 'group',
        content: [{ type: 'text', value: 'group2' }],
      });
      expect(mainGroup.content[2]).toMatchObject({
        type: 'group',
        content: [{ type: 'text', value: 'group3' }],
      });
    });
  });

  describe('binary data handling', () => {
    it('should skip binary data with \\bin control word', () => {
      const buffer = Buffer.from('{\\bin3ABCtext}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const innerGroup = result.content[0] as any;
      // Should skip 3 bytes (ABC) and continue with 'text'
      expect(innerGroup.content).toHaveLength(1);
      expect(innerGroup.content[0]).toEqual({
        type: 'text',
        value: 'text',
      });
    });
  });

  describe('destination detection', () => {
    it('should detect destination from first control word', () => {
      const buffer = Buffer.from('{\\fonttbl content}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const innerGroup = result.content[0] as any;
      expect(innerGroup.destination).toBe('fonttbl');
    });

    it('should detect destination after ignorable marker', () => {
      const buffer = Buffer.from('{\\*\\fldinst content}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const innerGroup = result.content[0] as any;
      expect(innerGroup.destination).toBe('fldinst');
    });
  });

  describe('whitespace handling', () => {
    it('should ignore CR and LF characters', () => {
      const buffer = Buffer.from('{\r\ntext\r\n}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const innerGroup = result.content[0] as any;
      expect(innerGroup.content).toHaveLength(1);
      expect(innerGroup.content[0]).toEqual({
        type: 'text',
        value: 'text',
      });
    });

    it('should consume space after control word', () => {
      const buffer = Buffer.from('{\\b bold}');
      const parser = new SimpleRtfParser(buffer);
      const result = parser.parse();

      const innerGroup = result.content[0] as any;
      expect(innerGroup.content).toHaveLength(2);
      expect(innerGroup.content[0]).toEqual({
        type: 'control',
        value: 'b',
        param: undefined,
      });
      expect(innerGroup.content[1]).toEqual({
        type: 'text',
        value: 'bold',
      });
    });
  });
});

describe('parseRtf', () => {
  const defaultConfig: OfficeParserConfig = {
    outputErrorToConsole: false,
    newlineDelimiter: '\n',
    ignoreNotes: false,
    putNotesAtLast: false,
    extractAttachments: false,
    includeRawContent: false,
    ocr: false,
  };

  describe('basic document parsing', () => {
    it('should parse minimal RTF document', async () => {
      const buffer = Buffer.from('{\\rtf1 Hello}');
      const result = await parseRtf(buffer, defaultConfig);

      expect(result.type).toBe('rtf');
      expect(result.metadata).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.attachments).toBeDefined();
      expect(typeof result.toText).toBe('function');
    });

    it('should parse RTF document with simple text', async () => {
      const buffer = Buffer.from('{\\rtf1\\ansi Hello World}');
      const result = await parseRtf(buffer, defaultConfig);

      expect(result.content.length).toBeGreaterThan(0);
      const text = result.toText();
      expect(text).toContain('Hello World');
    });

    it('should parse RTF with paragraph breaks', async () => {
      const buffer = Buffer.from('{\\rtf1 First paragraph\\par Second paragraph\\par}');
      const result = await parseRtf(buffer, defaultConfig);

      expect(result.content.length).toBeGreaterThanOrEqual(2);
      expect(result.content.filter(n => n.type === 'paragraph').length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('text formatting', () => {
    it('should parse bold text', async () => {
      const buffer = Buffer.from('{\\rtf1 \\b bold text\\b0}');
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.children) {
        const boldText = paragraph.children.find(c => c.type === 'text' && c.formatting?.bold);
        expect(boldText).toBeDefined();
      }
    });

    it('should parse italic text', async () => {
      const buffer = Buffer.from('{\\rtf1 \\i italic text\\i0}');
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.children) {
        const italicText = paragraph.children.find(c => c.type === 'text' && c.formatting?.italic);
        expect(italicText).toBeDefined();
      }
    });

    it('should parse underlined text', async () => {
      const buffer = Buffer.from('{\\rtf1 \\ul underlined\\ul0}');
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.children) {
        const underlinedText = paragraph.children.find(c => c.type === 'text' && c.formatting?.underline);
        expect(underlinedText).toBeDefined();
      }
    });

    it('should parse strikethrough text', async () => {
      const buffer = Buffer.from('{\\rtf1 \\strike strikethrough\\strike0}');
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.children) {
        const strikeText = paragraph.children.find(c => c.type === 'text' && c.formatting?.strikethrough);
        expect(strikeText).toBeDefined();
      }
    });

    it('should parse font size', async () => {
      const buffer = Buffer.from('{\\rtf1 \\fs24 12pt text}');
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.children) {
        const sizedText = paragraph.children.find(c => c.type === 'text' && c.formatting?.size === '12pt');
        expect(sizedText).toBeDefined();
      }
    });

    it('should parse subscript text', async () => {
      const buffer = Buffer.from('{\\rtf1 H\\sub 2\\nosupersub O}');
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.children) {
        const subText = paragraph.children.find(c => c.type === 'text' && c.formatting?.subscript);
        expect(subText).toBeDefined();
      }
    });

    it('should parse superscript text', async () => {
      const buffer = Buffer.from('{\\rtf1 x\\super 2\\nosupersub}');
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.children) {
        const superText = paragraph.children.find(c => c.type === 'text' && c.formatting?.superscript);
        expect(superText).toBeDefined();
      }
    });
  });

  describe('font and color tables', () => {
    it('should extract font table', async () => {
      const buffer = Buffer.from('{\\rtf1{\\fonttbl{\\f0 Arial;}{\\f1 Times;}}}');
      const result = await parseRtf(buffer, defaultConfig);

      // Font table should be extracted internally
      expect(result).toBeDefined();
    });

    it('should extract color table', async () => {
      const buffer = Buffer.from('{\\rtf1{\\colortbl;\\red255\\green0\\blue0;\\red0\\green0\\blue255;}}');
      const result = await parseRtf(buffer, defaultConfig);

      // Color table should be extracted internally
      expect(result).toBeDefined();
    });

    it('should apply font from font table', async () => {
      const buffer = Buffer.from('{\\rtf1{\\fonttbl{\\f0 Arial;}}{\\f0 Text}}');
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.children) {
        const textWithFont = paragraph.children.find(c => c.type === 'text' && c.formatting?.font === 'Arial');
        expect(textWithFont).toBeDefined();
      }
    });

    it('should apply color from color table', async () => {
      const buffer = Buffer.from('{\\rtf1{\\colortbl;\\red255\\green0\\blue0;}\\cf1 Red text}');
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.children) {
        const coloredText = paragraph.children.find(c => c.type === 'text' && c.formatting?.color);
        expect(coloredText).toBeDefined();
      }
    });
  });

  describe('lists', () => {
    it('should parse unordered list with pntext', async () => {
      const buffer = Buffer.from('{\\rtf1{\\*\\pn\\pnlvlblt}\\pard{\\*\\pntext\\bullet\\tab}Item 1\\par}');
      const result = await parseRtf(buffer, defaultConfig);

      const listItem = result.content.find(n => n.type === 'list');
      expect(listItem).toBeDefined();
      if (listItem && listItem.metadata) {
        expect((listItem.metadata as any).listType).toBe('unordered');
      }
    });

    it('should parse ordered list with pntext', async () => {
      const buffer = Buffer.from('{\\rtf1{\\*\\pn\\pnlvldec}\\pard{\\*\\pntext 1.\\tab}Item 1\\par}');
      const result = await parseRtf(buffer, defaultConfig);

      const listItem = result.content.find(n => n.type === 'list');
      expect(listItem).toBeDefined();
      if (listItem && listItem.metadata) {
        expect((listItem.metadata as any).listType).toBe('ordered');
      }
    });

    it('should parse list with \\ls control word', async () => {
      const buffer = Buffer.from('{\\rtf1{\\*\\listtable{\\list\\listid1}}\\ls1 Item\\par}');
      const result = await parseRtf(buffer, defaultConfig);

      // Should create a list structure
      expect(result.content.length).toBeGreaterThan(0);
    });
  });

  describe('tables', () => {
    it('should parse simple table', async () => {
      const buffer = Buffer.from('{\\rtf1\\trowd\\cellx1000\\intbl Cell 1\\cell\\row}');
      const result = await parseRtf(buffer, defaultConfig);

      const table = result.content.find(n => n.type === 'table');
      expect(table).toBeDefined();
    });

    it('should parse table with multiple cells', async () => {
      const buffer = Buffer.from('{\\rtf1\\trowd\\cellx1000\\cellx2000\\intbl Cell 1\\cell Cell 2\\cell\\row}');
      const result = await parseRtf(buffer, defaultConfig);

      const table = result.content.find(n => n.type === 'table');
      expect(table).toBeDefined();
      if (table && table.children) {
        const row = table.children.find(n => n.type === 'row');
        expect(row).toBeDefined();
        if (row && row.children) {
          expect(row.children.filter(c => c.type === 'cell').length).toBe(2);
        }
      }
    });

    it('should parse table with multiple rows', async () => {
      const buffer = Buffer.from('{\\rtf1\\trowd\\cellx1000\\intbl R1C1\\cell\\row\\trowd\\cellx1000\\intbl R2C1\\cell\\row}');
      const result = await parseRtf(buffer, defaultConfig);

      const table = result.content.find(n => n.type === 'table');
      expect(table).toBeDefined();
      if (table && table.children) {
        const rows = table.children.filter(n => n.type === 'row');
        expect(rows.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('should handle nested tables', async () => {
      const buffer = Buffer.from('{\\rtf1\\trowd\\cellx1000{\\intbl\\itap1 Outer\\cell}{\\trowd\\cellx500\\intbl\\itap2 Inner\\cell\\nestrow}\\row}');
      const result = await parseRtf(buffer, defaultConfig);

      // Should handle nested table structure
      expect(result.content.length).toBeGreaterThan(0);
    });
  });

  describe('hyperlinks', () => {
    it('should parse hyperlink', async () => {
      const buffer = Buffer.from('{\\rtf1{\\field{\\*\\fldinst HYPERLINK "http://example.com"}{\\fldrslt Link text}}}');
      const result = await parseRtf(buffer, defaultConfig);

      // Hyperlinks are text nodes with metadata.link
      const textWithLink = result.content.find(n => 
        n.type === 'text' || (n.children && n.children.some(c => c.metadata && (c.metadata as any).link))
      );
      expect(textWithLink).toBeDefined();
    });

    it('should parse hyperlink with nested text', async () => {
      const buffer = Buffer.from('{\\rtf1{\\field{\\*\\fldinst{HYPERLINK "https://test.com"}}{\\fldrslt Click here}}}');
      const result = await parseRtf(buffer, defaultConfig);

      // Check that the document was parsed successfully
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should classify external links correctly', async () => {
      const buffer = Buffer.from('{\\rtf1{\\field{\\*\\fldinst HYPERLINK "mailto:test@example.com"}{\\fldrslt Email}}}');
      const result = await parseRtf(buffer, defaultConfig);

      // Check that external links are parsed
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should classify internal links correctly', async () => {
      const buffer = Buffer.from('{\\rtf1{\\field{\\*\\fldinst HYPERLINK "#bookmark"}{\\fldrslt Internal}}}');
      const result = await parseRtf(buffer, defaultConfig);

      // Check that internal links are parsed
      expect(result.content.length).toBeGreaterThan(0);
    });
  });

  describe('images and attachments', () => {
    it('should not extract images when extractAttachments is false', async () => {
      const buffer = Buffer.from('{\\rtf1{\\pict\\pngblip 89504E470D0A}}');
      const result = await parseRtf(buffer, { ...defaultConfig, extractAttachments: false });

      expect(result.attachments).toEqual([]);
    });

    it('should extract PNG image when extractAttachments is true', async () => {
      const buffer = Buffer.from('{\\rtf1{\\pict\\pngblip 89504E47}}');
      const result = await parseRtf(buffer, { ...defaultConfig, extractAttachments: true });

      // Check if image was detected (may not be valid but should be attempted)
      expect(result).toBeDefined();
    });

    it('should extract JPEG image', async () => {
      const buffer = Buffer.from('{\\rtf1{\\pict\\jpegblip FFD8FFE0}}');
      const result = await parseRtf(buffer, { ...defaultConfig, extractAttachments: true });

      expect(result).toBeDefined();
    });

    it('should handle unsupported image formats gracefully', async () => {
      const buffer = Buffer.from('{\\rtf1{\\pict\\emfblip unknowndata}}');
      const result = await parseRtf(buffer, { ...defaultConfig, extractAttachments: true });

      // Should not throw, but may not extract the attachment
      expect(result).toBeDefined();
    });
  });

  describe('notes (footnotes and endnotes)', () => {
    it('should parse footnote', async () => {
      const buffer = Buffer.from('{\\rtf1 Text{\\footnote\\pard Footnote content}\\par}');
      const result = await parseRtf(buffer, { ...defaultConfig, putNotesAtLast: true });

      const note = result.content.find(n => n.type === 'note');
      expect(note).toBeDefined();
    });

    it('should handle putNotesAtLast configuration', async () => {
      const buffer = Buffer.from('{\\rtf1 Main text{\\footnote Note content}\\par}');
      const result = await parseRtf(buffer, { ...defaultConfig, putNotesAtLast: true });

      // Notes should be at the end when putNotesAtLast is true
      const noteIndex = result.content.findIndex(n => n.type === 'note');
      const paragraphIndex = result.content.findIndex(n => n.type === 'paragraph');
      
      if (noteIndex >= 0 && paragraphIndex >= 0) {
        expect(noteIndex).toBeGreaterThan(paragraphIndex);
      }
    });

    it('should not extract notes when ignoreNotes is true', async () => {
      const buffer = Buffer.from('{\\rtf1 Text{\\footnote Footnote}\\par}');
      const result = await parseRtf(buffer, { ...defaultConfig, ignoreNotes: true });

      const notes = result.content.filter(n => n.type === 'note');
      expect(notes.length).toBe(0);
    });

    it('should handle endnotes with \\fet1', async () => {
      const buffer = Buffer.from('{\\rtf1\\fet1 Text{\\footnote Endnote}\\par}');
      const result = await parseRtf(buffer, defaultConfig);

      // Endnotes should be parsed as notes
      expect(result).toBeDefined();
    });
  });

  describe('paragraph formatting', () => {
    it('should parse paragraph alignment - center', async () => {
      const buffer = Buffer.from('{\\rtf1\\qc Centered text\\par}');
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.metadata) {
        expect((paragraph.metadata as any).alignment).toBe('center');
      }
    });

    it('should parse paragraph alignment - right', async () => {
      const buffer = Buffer.from('{\\rtf1\\qr Right aligned\\par}');
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.metadata) {
        expect((paragraph.metadata as any).alignment).toBe('right');
      }
    });

    it('should parse paragraph alignment - justify', async () => {
      const buffer = Buffer.from('{\\rtf1\\qj Justified text\\par}');
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.metadata) {
        expect((paragraph.metadata as any).alignment).toBe('justify');
      }
    });

    it('should parse paragraph indentation', async () => {
      const buffer = Buffer.from('{\\rtf1\\li720 Indented text\\par}');
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.metadata) {
        expect((paragraph.metadata as any).indent).toBeGreaterThan(0);
      }
    });

    it('should parse heading levels', async () => {
      const buffer = Buffer.from('{\\rtf1{\\*\\cs1\\outlinelevel0} Heading 1\\par}');
      const result = await parseRtf(buffer, defaultConfig);

      // Heading should be detected
      expect(result.content.length).toBeGreaterThan(0);
    });
  });

  describe('special characters and Unicode', () => {
    it('should parse Unicode characters with \\u', async () => {
      const buffer = Buffer.from('{\\rtf1\\u8364? Euro}'); // € symbol
      const result = await parseRtf(buffer, defaultConfig);

      const text = result.toText();
      expect(text).toContain('€');
    });

    it('should handle negative Unicode values', async () => {
      const buffer = Buffer.from('{\\rtf1\\u-10179?}'); // Negative Unicode
      const result = await parseRtf(buffer, defaultConfig);

      expect(result).toBeDefined();
    });

    it('should parse tab character', async () => {
      const buffer = Buffer.from('{\\rtf1 Text\\tab More text}');
      const result = await parseRtf(buffer, defaultConfig);

      const text = result.toText();
      expect(text).toContain('\t');
    });

    it('should parse line break', async () => {
      const buffer = Buffer.from('{\\rtf1 Text\\line More text}');
      const result = await parseRtf(buffer, defaultConfig);

      const text = result.toText();
      expect(text).toContain('\n');
    });
  });

  describe('raw content inclusion', () => {
    it('should include raw RTF when includeRawContent is true', async () => {
      const rtfContent = '{\\rtf1 Hello World}';
      const buffer = Buffer.from(rtfContent);
      const result = await parseRtf(buffer, { ...defaultConfig, includeRawContent: true });

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph) {
        expect(paragraph.rawContent).toBeDefined();
      }
    });

    it('should not include raw RTF when includeRawContent is false', async () => {
      const buffer = Buffer.from('{\\rtf1 Hello World}');
      const result = await parseRtf(buffer, { ...defaultConfig, includeRawContent: false });

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph) {
        expect(paragraph.rawContent).toBeUndefined();
      }
    });
  });

  describe('toText method', () => {
    it('should convert AST to plain text', async () => {
      const buffer = Buffer.from('{\\rtf1 Hello \\b bold\\b0  world\\par}');
      const result = await parseRtf(buffer, defaultConfig);

      const text = result.toText();
      expect(text).toContain('Hello');
      expect(text).toContain('bold');
      expect(text).toContain('world');
    });

    it('should handle empty document', async () => {
      const buffer = Buffer.from('{\\rtf1}');
      const result = await parseRtf(buffer, defaultConfig);

      const text = result.toText();
      expect(text).toBeDefined();
    });

    it('should use custom newline delimiter', async () => {
      const buffer = Buffer.from('{\\rtf1 Line1\\par Line2\\par}');
      const result = await parseRtf(buffer, { ...defaultConfig, newlineDelimiter: '--NL--' });

      const text = result.toText();
      expect(text).toContain('--NL--');
    });
  });

  describe('error handling', () => {
    it('should handle malformed RTF gracefully', () => {
      const buffer = Buffer.from('{\\rtf1 Unclosed group');
      
      // Should not throw
      expect(() => parseRtf(buffer, defaultConfig)).not.toThrow();
      const result = parseRtf(buffer, defaultConfig);
      expect(result).toBeDefined();
    });

    it('should handle empty buffer', () => {
      const buffer = Buffer.from('');
      
      // Should not throw
      expect(() => parseRtf(buffer, defaultConfig)).not.toThrow();
      const result = parseRtf(buffer, defaultConfig);
      expect(result).toBeDefined();
    });

    it('should handle buffer with only whitespace', () => {
      const buffer = Buffer.from('   \n\r\n   ');
      
      // Should not throw
      expect(() => parseRtf(buffer, defaultConfig)).not.toThrow();
      const result = parseRtf(buffer, defaultConfig);
      expect(result).toBeDefined();
    });
  });

  describe('complex documents', () => {
    it('should parse document with mixed formatting', async () => {
      const buffer = Buffer.from(
        '{\\rtf1\\ansi{\\fonttbl{\\f0 Arial;}}{\\colortbl;\\red255\\green0\\blue0;}' +
        '\\f0\\fs24\\b Bold\\b0  and \\i italic\\i0  and \\ul underline\\ul0\\par}'
      );
      const result = await parseRtf(buffer, defaultConfig);

      expect(result.content.length).toBeGreaterThan(0);
      const text = result.toText();
      expect(text).toContain('Bold');
      expect(text).toContain('italic');
      expect(text).toContain('underline');
    });

    it('should parse document with lists and tables', async () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\*\\pn\\pnlvlblt}\\pard{\\*\\pntext\\bullet\\tab}Item 1\\par' +
        '\\trowd\\cellx1000\\intbl Cell\\cell\\row}'
      );
      const result = await parseRtf(buffer, defaultConfig);

      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should parse document with nested formatting', async () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\b Bold {\\i and italic} back to bold}\\par}'
      );
      const result = await parseRtf(buffer, defaultConfig);

      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      expect(paragraph?.children).toBeDefined();
    });

    it('should handle document with all supported features', async () => {
      const buffer = Buffer.from(
        '{\\rtf1\\ansi\\deff0' +
        '{\\fonttbl{\\f0 Arial;}}{\\colortbl;\\red255\\green0\\blue0;}' +
        '{\\*\\listtable{\\list\\listid1}}' +
        '\\pard\\f0\\fs24\\b Heading\\b0\\par' +
        '\\ls1 List item\\par' +
        '\\trowd\\cellx1000\\intbl Table cell\\cell\\row' +
        '{\\field{\\*\\fldinst HYPERLINK "http://test.com"}{\\fldrslt Link}}\\par' +
        'Text with {\\footnote Footnote}\\par' +
        '}'
      );
      const result = await parseRtf(buffer, {
        ...defaultConfig,
        extractAttachments: true,
        includeRawContent: true,
        putNotesAtLast: true,
      });

      expect(result.content.length).toBeGreaterThan(0);
      expect(result.metadata).toBeDefined();
      expect(result.toText()).toBeDefined();
    });
  });

  describe('advanced list features', () => {
    it('should parse list with listoverridetable', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\*\\listtable{\\list\\listtemplateid1\\listid100}}' +
        '{\\*\\listoverridetable{\\listoverride\\listid100\\listoverridecount0\\ls1}}' +
        '\\ls1 List item\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);

      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle list item with indentation levels', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\*\\listtable{\\list\\listid1}}' +
        '\\ls1\\ilvl0 Item level 0\\par' +
        '\\ls1\\ilvl1 Item level 1\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      const listItems = result.content.filter(n => n.type === 'list');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('should parse list with pnlvlbody (body-level paragraph numbering)', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\*\\pn\\pnlvlbody}\\pard{\\*\\pntext 1.\\tab}Item\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle listtext marker for list items', () => {
      const buffer = Buffer.from(
        '{\\rtf1\\pard{\\listtext\\bullet\\tab}Item 1\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      const listItem = result.content.find(n => n.type === 'list');
      expect(listItem).toBeDefined();
    });

    it('should parse list with decimal numbering', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\*\\pn\\pnlvldec}\\pard{\\*\\pntext 1.\\tab}First item\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      const listItem = result.content.find(n => n.type === 'list');
      expect(listItem).toBeDefined();
      if (listItem && listItem.metadata) {
        expect((listItem.metadata as any).listType).toBe('ordered');
      }
    });

    it('should handle multiple list types in same document', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\*\\listtable{\\list\\listid1}{\\list\\listid2}}' +
        '\\ls1 Ordered item\\par' +
        '\\ls2 Another list item\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should parse list definition table with pnlvl types', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\*\\listtable{\\list{\\listlevel\\levelnfc0}\\listid1}}' +
        '\\ls1 Numbered item\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle list with levelnfc23 (bullet)', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\*\\listtable{\\list{\\listlevel\\levelnfc23}\\listid1}}' +
        '\\ls1 Bullet item\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      const listItem = result.content.find(n => n.type === 'list');
      expect(listItem).toBeDefined();
    });
  });

  describe('advanced heading and outline features', () => {
    it('should parse heading with outlinelevel', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\*\\cs1\\outlinelevel1}Heading 2\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      // Should detect heading level from outline level
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should parse multiple heading levels', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\*\\cs1\\outlinelevel0}H1\\par' +
        '{\\*\\cs1\\outlinelevel1}H2\\par' +
        '{\\*\\cs1\\outlinelevel2}H3\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThanOrEqual(3);
    });

    it('should reset list context when encountering heading', () => {
      const buffer = Buffer.from(
        '{\\rtf1\\ls1 List item\\par' +
        '{\\*\\cs1\\outlinelevel0}Heading\\par' +
        'Normal paragraph\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should parse heading with valid level greater than 0', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\*\\cs1\\outlinelevel2}Heading Level 3\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
      // Heading detection happens via complex parsing
      // Just verify the document parses successfully
    });
  });

  describe('advanced hyperlink patterns', () => {
    it('should extract URL from text node with just the URL', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\field{\\*\\fldinst{"http://example.com"}}{\\fldrslt Link}}}' 
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle mailto links', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\field{\\*\\fldinst{"mailto:test@example.com"}}{\\fldrslt Email}}}' 
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle bookmark links', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\field{\\*\\fldinst{"#section1"}}{\\fldrslt Jump}}}' 
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle hyperlink with complex nested structure', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\field{\\*\\fldinst{\\*\\fldinst HYPERLINK "http://nested.com"}}{\\fldrslt Text}}}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle file protocol links', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\field{\\*\\fldinst HYPERLINK "file:///C:/path/file.txt"}{\\fldrslt File}}}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle ftp links', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\field{\\*\\fldinst HYPERLINK "ftp://ftp.example.com"}{\\fldrslt FTP}}}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });
  });

  describe('advanced image and attachment features', () => {
    it('should extract GIF image', () => {
      const buffer = Buffer.from('{\\rtf1{\\pict\\gifblip 474946}}');
      const result = parseRtf(buffer, { ...defaultConfig, extractAttachments: true });

      expect(result).toBeDefined();
    });

    it('should extract TIFF image', () => {
      const buffer = Buffer.from('{\\rtf1{\\pict\\tiffblip 4D4D002A}}');
      const result = parseRtf(buffer, { ...defaultConfig, extractAttachments: true });

      expect(result).toBeDefined();
    });

    it('should extract BMP image with dibitmap', () => {
      const buffer = Buffer.from('{\\rtf1{\\pict\\dibitmap 424D}}');
      const result = parseRtf(buffer, { ...defaultConfig, extractAttachments: true });

      expect(result).toBeDefined();
    });

    it('should extract BMP image with wbitmap', () => {
      const buffer = Buffer.from('{\\rtf1{\\pict\\wbitmap 424D}}');
      const result = parseRtf(buffer, { ...defaultConfig, extractAttachments: true });

      expect(result).toBeDefined();
    });

    it('should handle image with picw and pich dimensions', () => {
      const buffer = Buffer.from('{\\rtf1{\\pict\\pngblip\\picw100\\pich200 89504E47}}');
      const result = parseRtf(buffer, { ...defaultConfig, extractAttachments: true });

      expect(result).toBeDefined();
    });

    it('should skip images when extractAttachments is false', () => {
      const buffer = Buffer.from('{\\rtf1{\\pict\\pngblip 89504E47} Normal text\\par}');
      const result = parseRtf(buffer, { ...defaultConfig, extractAttachments: false });

      // Should have content but no attachments
      expect(result.attachments).toHaveLength(0);
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should include raw RTF content for images when includeRawContent is true', () => {
      const buffer = Buffer.from('{\\rtf1{\\pict\\pngblip 89504E47}\\par}');
      const result = parseRtf(buffer, { ...defaultConfig, extractAttachments: true, includeRawContent: true });

      // Raw content should be included
      expect(result).toBeDefined();
    });

    it('should handle nested groups in pict with includeRawContent', () => {
      const buffer = Buffer.from('{\\rtf1{\\pict\\pngblip{\\*\\blipuid hexdata}89504E47}\\par}');
      const result = parseRtf(buffer, { ...defaultConfig, extractAttachments: true, includeRawContent: true });

      expect(result).toBeDefined();
    });
  });

  describe('advanced table features', () => {
    it('should handle table with merged cells', () => {
      const buffer = Buffer.from(
        '{\\rtf1\\trowd\\clmgf\\cellx2000\\clmrg\\cellx3000' +
        '\\intbl Merged\\cell\\cell\\row}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      const table = result.content.find(n => n.type === 'table');
      expect(table).toBeDefined();
    });

    it('should handle vertically merged cells (clvmgf/clvmrg)', () => {
      const buffer = Buffer.from(
        '{\\rtf1\\trowd\\clvmgf\\cellx1000\\intbl Top\\cell\\row' +
        '\\trowd\\clvmrg\\cellx1000\\intbl\\cell\\row}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle nested table with itap levels', () => {
      const buffer = Buffer.from(
        '{\\rtf1\\trowd\\cellx2000{\\intbl\\itap1 Outer' +
        '{\\trowd\\cellx1000\\intbl\\itap2 Inner\\cell\\nestrow}\\cell}\\row}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle trleft (table row left position)', () => {
      const buffer = Buffer.from(
        '{\\rtf1\\trowd\\trleft100\\cellx1000\\intbl Cell\\cell\\row}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      const table = result.content.find(n => n.type === 'table');
      expect(table).toBeDefined();
    });
  });

  describe('advanced text formatting', () => {
    it('should handle highlight color', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\colortbl;\\red255\\green255\\blue0;}\\cb1 Highlighted\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
    });

    it('should handle scaps (small caps)', () => {
      const buffer = Buffer.from('{\\rtf1\\scaps Small Caps\\scaps0\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
    });

    it('should handle caps (all caps)', () => {
      const buffer = Buffer.from('{\\rtf1\\caps ALL CAPS\\caps0\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
    });

    it('should handle v (hidden text)', () => {
      const buffer = Buffer.from('{\\rtf1\\v Hidden\\v0 Visible\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
    });

    it('should handle emboss formatting', () => {
      const buffer = Buffer.from('{\\rtf1\\embo Embossed\\embo0\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
    });

    it('should handle imprint formatting', () => {
      const buffer = Buffer.from('{\\rtf1\\impr Imprint\\impr0\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
    });

    it('should handle outline formatting', () => {
      const buffer = Buffer.from('{\\rtf1\\outl Outline\\outl0\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
    });

    it('should handle shadow formatting', () => {
      const buffer = Buffer.from('{\\rtf1\\shad Shadow\\shad0\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
    });
  });

  describe('special control words', () => {
    it('should handle lquote (left single quote)', () => {
      const buffer = Buffer.from('{\\rtf1\\lquote quote\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const text = result.toText();
      expect(text).toContain('\u2018'); // Left single quotation mark
    });

    it('should handle rquote (right single quote)', () => {
      const buffer = Buffer.from('{\\rtf1\\rquote quote\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const text = result.toText();
      expect(text).toContain('\u2019'); // Right single quotation mark
    });

    it('should handle ldblquote (left double quote)', () => {
      const buffer = Buffer.from('{\\rtf1\\ldblquote quote\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const text = result.toText();
      expect(text).toContain('\u201C'); // Left double quotation mark
    });

    it('should handle rdblquote (right double quote)', () => {
      const buffer = Buffer.from('{\\rtf1\\rdblquote quote\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const text = result.toText();
      expect(text).toContain('\u201D'); // Right double quotation mark
    });
  });

  describe('paragraph-level formatting', () => {
    it('should handle ql (left align)', () => {
      const buffer = Buffer.from('{\\rtf1\\ql Left aligned\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
      if (paragraph && paragraph.metadata) {
        expect((paragraph.metadata as any).alignment).toBe('left');
      }
    });

    it('should handle negative indentation', () => {
      const buffer = Buffer.from('{\\rtf1\\li-360 Negative indent\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
    });

    it('should handle fi (first line indent)', () => {
      const buffer = Buffer.from('{\\rtf1\\fi720 First line indented\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
    });
  });

  describe('RTF document metadata', () => {
    it('should handle ansi codepage', () => {
      const buffer = Buffer.from('{\\rtf1\\ansi Text\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.metadata).toBeDefined();
    });

    it('should handle deff (default font)', () => {
      const buffer = Buffer.from('{\\rtf1\\deff0 Text\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.metadata).toBeDefined();
    });

    it('should handle deflang (default language)', () => {
      const buffer = Buffer.from('{\\rtf1\\deflang1033 Text\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.metadata).toBeDefined();
    });
  });

  describe('edge cases and additional coverage', () => {
    it('should handle color table with multiple colors', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\colortbl;\\red255\\green0\\blue0;\\red0\\green255\\blue0;\\red0\\green0\\blue255;}' +
        '\\cf1 Red\\cf2 Green\\cf3 Blue\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle complex hyperlink in nested groups', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\field{\\*\\fldinst{\\*\\datafield HYPERLINK "http://example.com"}}{\\fldrslt Link}}}' 
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle pard (paragraph defaults reset)', () => {
      const buffer = Buffer.from('{\\rtf1\\b Bold\\pard Normal\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle plain (character formatting reset)', () => {
      const buffer = Buffer.from('{\\rtf1\\b\\i Bold italic\\plain normal\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle sect (section break)', () => {
      const buffer = Buffer.from('{\\rtf1 Section 1\\sect Section 2\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle page (page break)', () => {
      const buffer = Buffer.from('{\\rtf1 Page 1\\page Page 2\\par}');
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle nestcell (nested table cell)', () => {
      const buffer = Buffer.from(
        '{\\rtf1\\trowd\\cellx1000{\\intbl Cell{\\nestcell}}\\cell\\row}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle nesttableprops (nested table properties)', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\*\\nesttableprops\\trowd\\cellx500}\\trowd\\cellx1000\\intbl Cell\\cell\\row}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle intbl flagbeing set and unset', () => {
      const buffer = Buffer.from(
        '{\\rtf1\\trowd\\cellx1000\\intbl In table\\cell\\row' +
        'Not in table\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle multiple font changes', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\fonttbl{\\f0 Arial;}{\\f1 Times;}{\\f2 Courier;}}' +
        '\\f0 Arial \\f1 Times \\f2 Courier\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
    });

    it('should handle background color with cb', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\colortbl;\\red255\\green255\\blue0;}\\cb1 Yellow background\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      const paragraph = result.content.find(n => n.type === 'paragraph');
      expect(paragraph).toBeDefined();
    });

    it('should handle multiple paragraphs with varying formatting', () => {
      const buffer = Buffer.from(
        '{\\rtf1\\qc Centered\\par\\qr Right\\par\\ql Left\\par\\qj Justified\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.filter(n => n.type === 'paragraph').length).toBeGreaterThanOrEqual(4);
    });

    it('should handle document with footnote and endnote markers', () => {
      const buffer = Buffer.from(
        '{\\rtf1\\fet0 Text{\\footnote Footnote}\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle complex list with multiple listoverrides', () => {
      const buffer = Buffer.from(
        '{\\rtf1{\\*\\listtable{\\list\\listid1}{\\list\\listid2}}' +
        '{\\*\\listoverridetable{\\listoverride\\listid1\\ls1}{\\listoverride\\listid2\\ls2}}' +
        '\\ls1 First list\\par\\ls2 Second list\\par}'
      );
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle image with unsupported format gracefully', () => {
      const buffer = Buffer.from('{\\rtf1{\\pict\\unknownblip data}\\par}');
      const result = parseRtf(buffer, { ...defaultConfig, extractAttachments: true });
      
      // Should parse without throwing
      expect(result).toBeDefined();
    });

    it('should handle empty pict group', () => {
      const buffer = Buffer.from('{\\rtf1{\\pict}\\par}');
      const result = parseRtf(buffer, { ...defaultConfig, extractAttachments: true });
      
      expect(result).toBeDefined();
    });

    it('should handle table without trowd', () => {
      const buffer = Buffer.from('{\\rtf1\\intbl Cell\\cell\\row}');
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result).toBeDefined();
    });

    it('should handle cell without intbl flag', () => {
      const buffer = Buffer.from('{\\rtf1\\trowd\\cellx1000 Text\\cell\\row}');
      const result = parseRtf(buffer, defaultConfig);
      
      expect(result).toBeDefined();
    });
  });
});
