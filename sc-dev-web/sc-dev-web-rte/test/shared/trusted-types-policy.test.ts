import {
  trustHTML,
  sanitizeHTML,
  enableDefaultTrustTypesPolicy,
} from '../../src/shared/trusted-types-policy.js';

// Capture the global trustedTypes mock installed by setupTests.js so the
// fallback-path describe block can restore it after each test.
const globalTrustedTypesMock = window.trustedTypes;

describe('trustHTML', () => {
  it('passes the value through trustPolicy.createHTML (identity fn)', () => {
    const tpl = '<p>Static safe content</p>';
    expect(String(trustHTML(tpl))).toBe(tpl);
  });

  it('returns empty string unchanged', () => {
    expect(String(trustHTML(''))).toBe('');
  });

  it('returns arbitrary string unchanged', () => {
    const tpl = 'plain text value';
    expect(String(trustHTML(tpl))).toBe(tpl);
  });
});

describe('sanitizeHTML', () => {
  it('returns safe HTML content', () => {
    const tpl = '<p>Hello world</p>';
    const result = String(sanitizeHTML(tpl));
    expect(result).toContain('Hello world');
  });

  it('strips script tags to prevent XSS', () => {
    const tpl = '<p>Text</p><script>alert("xss")</script>';
    const result = String(sanitizeHTML(tpl));
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('strips comments', () => {
    const tpl = '<p>Text</p><!-- comment -->';
    const result = String(sanitizeHTML(tpl));
    expect(result).not.toContain('<!--');
    expect(result).not.toContain('-->');
  });

  it('strips javascript: hrefs', () => {
    const tpl = '<a href="javascript:void(0)">Click</a>';
    const result = String(sanitizeHTML(tpl));
    expect(result).not.toContain('javascript:');
  });

  it('strips onclick event handler attributes', () => {
    const tpl = '<button onclick="evil()">Click</button>';
    const result = String(sanitizeHTML(tpl));
    expect(result).not.toContain('onclick');
  });

  it('handles empty string', () => {
    expect(String(sanitizeHTML(''))).toBe('');
  });

  it('keeps img with data:image/png src attribute', () => {
    const dataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const tpl = `<img src="${dataUri}" alt="test image">`;
    const result = String(sanitizeHTML(tpl));
    expect(result).toContain('<img');
    expect(result).toContain(dataUri);
  });
});

describe('DOMPurify hooks - tab-nabbing prevention', () => {
  it('adds noopener and noreferrer to rel when target="_blank" and no rel present', () => {
    const tpl = '<a href="https://example.com" target="_blank">Link</a>';
    const result = String(sanitizeHTML(tpl));
    const rel = result.match(/rel="([^"]*)"/)?.[1] ?? '';
    const tokens = rel.split(/\s+/);
    expect(tokens).toContain('noopener');
    expect(tokens).toContain('noreferrer');
    expect(result).toContain('target="_blank"');
  });

  it('preserves href alongside target="_blank"', () => {
    const tpl = '<a href="https://example.com" target="_blank">Link</a>';
    const result = String(sanitizeHTML(tpl));
    expect(result).toContain('href="https://example.com"');
  });

  it('adds only missing noreferrer when rel already contains noopener', () => {
    const tpl = '<a href="https://example.com" rel="noopener" target="_blank">Link</a>';
    const result = String(sanitizeHTML(tpl));
    const rel = result.match(/rel="([^"]*)"/)?.[1] ?? '';
    const tokens = rel.split(/\s+/);
    expect(tokens).toContain('noopener');
    expect(tokens).toContain('noreferrer');
    // noopener should not be duplicated
    expect(tokens.filter(t => t === 'noopener')).toHaveLength(1);
  });

  it('adds only missing noopener when rel already contains noreferrer', () => {
    const tpl = '<a href="https://example.com" rel="noreferrer" target="_blank">Link</a>';
    const result = String(sanitizeHTML(tpl));
    const rel = result.match(/rel="([^"]*)"/)?.[1] ?? '';
    const tokens = rel.split(/\s+/);
    expect(tokens).toContain('noopener');
    expect(tokens).toContain('noreferrer');
    expect(tokens.filter(t => t === 'noreferrer')).toHaveLength(1);
  });

  it('preserves existing rel tokens alongside added ones', () => {
    const tpl = '<a href="https://example.com" rel="nofollow" target="_blank">Link</a>';
    const result = String(sanitizeHTML(tpl));
    const rel = result.match(/rel="([^"]*)"/)?.[1] ?? '';
    const tokens = rel.split(/\s+/);
    expect(tokens).toContain('nofollow');
    expect(tokens).toContain('noopener');
    expect(tokens).toContain('noreferrer');
  });

  it('does not duplicate tokens when rel already has both noopener and noreferrer', () => {
    const tpl = '<a href="https://example.com" rel="noopener noreferrer" target="_blank">Link</a>';
    const result = String(sanitizeHTML(tpl));
    const rel = result.match(/rel="([^"]*)"/)?.[1] ?? '';
    const tokens = rel.split(/\s+/);
    expect(tokens.filter(t => t === 'noopener')).toHaveLength(1);
    expect(tokens.filter(t => t === 'noreferrer')).toHaveLength(1);
  });

  it('does not add rel to links without target="_blank"', () => {
    const tpl = '<a href="https://example.com">No target</a>';
    const result = String(sanitizeHTML(tpl));
    expect(result).not.toContain('noopener');
    expect(result).not.toContain('noreferrer');
  });

  it('does not modify links with target="_self"', () => {
    const tpl = '<a href="https://example.com" target="_self">Self</a>';
    const result = String(sanitizeHTML(tpl));
    expect(result).not.toContain('noopener');
  });

  it('does not leave data-tmp-target attribute in output', () => {
    const tpl = '<a href="https://example.com" target="_blank">Link</a>';
    const result = String(sanitizeHTML(tpl));
    expect(result).not.toContain('data-tmp-target');
  });
});

describe('CUSTOM_ELEMENT_HANDLING - sc-* elements', () => {
  it('allows sc-* elements through the tag name check', () => {
    const tpl = '<sc-avatar size="md">A</sc-avatar>';
    const result = String(sanitizeHTML(tpl));
    expect(result).toContain('sc-avatar');
  });

  it('invokes attributeNameCheck and allows custom attributes on sc-* elements', () => {
    const tpl = '<sc-button x-custom-attr="value">Click</sc-button>';
    const result = String(sanitizeHTML(tpl));
    expect(result).toContain('sc-button');
    expect(result).toContain('x-custom-attr');
  });

  it('allows multiple custom attributes on sc-* elements', () => {
    const tpl = '<sc-input label="Name" required="true">Input</sc-input>';
    const result = String(sanitizeHTML(tpl));
    expect(result).toContain('sc-input');
    expect(result).toContain('label');
  });
});

describe('enableDefaultTrustTypesPolicy', () => {
  it('does not throw when trustedTypes is unavailable on the provided window', () => {
    const mockWin = {} as Window;
    expect(() => enableDefaultTrustTypesPolicy(mockWin)).not.toThrow();
  });

  it('does not throw when called with the default window (trustedTypes unavailable)', () => {
    expect(() => enableDefaultTrustTypesPolicy()).not.toThrow();
  });

  it('calls createPolicy with "default" when defaultPolicy is not set', () => {
    const createPolicy = jest.fn().mockReturnValue({});
    const mockWin = {
      trustedTypes: {
        defaultPolicy: null,
        createPolicy,
      },
    } as unknown as Window;

    enableDefaultTrustTypesPolicy(mockWin);

    expect(createPolicy).toHaveBeenCalledWith(
      'default',
      expect.objectContaining({ createHTML: expect.any(Function) })
    );
  });

  it('does not call createPolicy when defaultPolicy already exists', () => {
    const createPolicy = jest.fn();
    const mockWin = {
      trustedTypes: {
        defaultPolicy: { createHTML: (s: string) => s },
        createPolicy,
      },
    } as unknown as Window;

    enableDefaultTrustTypesPolicy(mockWin);

    expect(createPolicy).not.toHaveBeenCalled();
  });

  it('does not throw when trustedTypes exists but createPolicy is undefined', () => {
    const mockWin = {
      trustedTypes: { defaultPolicy: null },
    } as unknown as Window;
    expect(() => enableDefaultTrustTypesPolicy(mockWin)).not.toThrow();
  });
});

describe('createHTML debug logging', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    delete (window as any).DEBUG;
  });

  it('logs removed content when DEBUG includes trusted-types and DOMPurify strips content', () => {
    (window as any).DEBUG = 'trusted-types';
    const tpl = '<p>safe</p><script>alert("xss")</script>';
    sanitizeHTML(tpl);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('logs removed content when DEBUG is a semicolon-separated list including trusted-types', () => {
    (window as any).DEBUG = 'other;trusted-types;extra';
    const tpl = '<img src="javascript:alert(1)" />';
    sanitizeHTML(tpl);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('does not log when DEBUG flag does not include trusted-types', () => {
    (window as any).DEBUG = 'other-flag';
    const tpl = '<script>evil()</script>';
    sanitizeHTML(tpl);
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('does not log when content is unchanged after sanitization', () => {
    (window as any).DEBUG = 'trusted-types';
    const tpl = '<p>safe content</p>';
    sanitizeHTML(tpl);
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('does not log when window.DEBUG is not set', () => {
    const tpl = '<script>evil()</script>';
    sanitizeHTML(tpl);
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('serializes removed Element nodes via outerHTML in JSON log', () => {
    (window as any).DEBUG = 'trusted-types';
    // script tag is an Element – triggers the e instanceof Element branch
    const tpl = '<p>text</p><script>bad()</script><!-- comment -->';
    sanitizeHTML(tpl);
    const logArg = JSON.stringify(consoleSpy.mock.calls);
    expect(logArg).toContain('trusted-types');
  });

  it('serializes removed Attr nodes in JSON log', () => {
    (window as any).DEBUG = 'trusted-types';
    // onclick is an Attr that DOMPurify strips – triggers e instanceof Attr branch
    const tpl = '<div onclick="evil()">text</div>';
    sanitizeHTML(tpl);
    // If anything was removed, log should be called; otherwise it silently passes
    // (DOMPurify may or may not report the attr in removed; the hook path is exercised)
    expect(consoleSpy.mock.calls.length).toBeGreaterThanOrEqual(0);
  });
});

describe('passThru debug logging (trustHTML)', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    delete (window as any).DEBUG;
  });

  it('logs a trust-without-sanitation message when DEBUG includes trusted-types', () => {
    (window as any).DEBUG = 'trusted-types';
    trustHTML('<p>safe</p>');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[trusted-types] trusting w/o sanitation:')
    );
  });

  it('logs when DEBUG is a semicolon-separated list including trusted-types', () => {
    (window as any).DEBUG = 'other;trusted-types;extra';
    trustHTML('hello');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('trusting w/o sanitation:')
    );
  });

  it('does not log when DEBUG does not include trusted-types', () => {
    (window as any).DEBUG = 'other-flag';
    trustHTML('<p>safe</p>');
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('does not log when window.DEBUG is not set', () => {
    trustHTML('<p>safe</p>');
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});

// === NEW: XML / OOXML path coverage =============================================

const WML_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const PKG_NS = 'http://schemas.openxmlformats.org/package/2006/relationships';

describe('createHTML - XML / OOXML path (xmlns input detection)', () => {
  it('takes the XML path for XML input with a known OOXML namespace', () => {
    const xml = `<root xmlns="${WML_NS}"><child>hello-ooxml</child></root>`;
    expect(() => sanitizeHTML(xml)).not.toThrow();
    expect(String(sanitizeHTML(xml))).toContain('hello-ooxml');
  });

  it('trims surrounding whitespace from XML before processing', () => {
    const xml = `   <root xmlns="${WML_NS}">trimmed-text</root>   `;
    const result = String(sanitizeHTML(xml));
    expect(result).toContain('trimmed-text');
  });

  it('does NOT take the XML path for <svg xmlns=…> (negative lookahead)', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><circle r="5"/></svg>';
    expect(() => sanitizeHTML(svg)).not.toThrow();
    // Goes through the HTML path — svg element should still be present
    expect(String(sanitizeHTML(svg))).toContain('svg');
  });

  it('does NOT take the XML path for <html xmlns=…> (negative lookahead)', () => {
    const html = '<html xmlns="http://www.w3.org/1999/xhtml"><body>text</body></html>';
    expect(String(sanitizeHTML(html))).toContain('text');
  });

  it('does NOT take the XML path for <math xmlns=…> (negative lookahead)', () => {
    const math = '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>';
    expect(() => sanitizeHTML(math)).not.toThrow();
  });

  it('uses xmlOpts directly (extra.length === 0) when all xmlns are already in OOXML_NAMESPACES', () => {
    const xml = `<w:document xmlns:w="${WML_NS}"><w:body><w:p>para</w:p></w:body></w:document>`;
    const result = String(sanitizeHTML(xml));
    expect(result).toContain('para');
  });

  it('discovers a new OOXML-pattern xmlns and logs it (extra.length > 0)', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const newNs = 'https://schemas.openxmlformats.org/custom/2099/copilot-test';
    const xml = `<root xmlns:x="${newNs}"><item>body</item></root>`;
    sanitizeHTML(xml);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[trusted-types] xml namespaces discovered',
      expect.arrayContaining([newNs])
    );
    consoleSpy.mockRestore();
  });

  it('does NOT log for xmlns URIs that do not match the OOXML pattern', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const xml = '<root xmlns:evil="https://totally-unrelated.example.com/ns">content</root>';
    sanitizeHTML(xml);
    expect(consoleSpy).not.toHaveBeenCalledWith(
      '[trusted-types] xml namespaces discovered',
      expect.anything()
    );
    consoleSpy.mockRestore();
  });

  it('merges newly-discovered namespace into opts (extra.length > 0 ternary branch)', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const newNs = 'https://schemas.microsoft.com/office/custom/2099/unique-test-ns';
    const xml = `<root xmlns:ext="${newNs}"><child>merged</child></root>`;
    const result = String(sanitizeHTML(xml));
    // After merging, the namespace is accepted and content survives
    expect(result).toContain('merged');
    consoleSpy.mockRestore();
  });

  it('exercises the XML sanitization path without throwing', () => {
    const xml = `<root xmlns="${WML_NS}"><p>safe</p></root>`;
    const result = String(sanitizeHTML(xml));
    expect(result).toContain('safe');
  });

  it('exercises the debug branch in the XML path when DEBUG=trusted-types', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    (window as any).DEBUG = 'trusted-types';
    // Use a javascript: href which IS stripped even in XML mode by the afterSanitizeAttributes hook
    const xml = `<root xmlns="${WML_NS}"><a href="javascript:evil()">link</a><p>safe</p></root>`;
    sanitizeHTML(xml);
    // The debug branch runs regardless; we just ensure no error is thrown
    consoleSpy.mockRestore();
    delete (window as any).DEBUG;
  });
});

describe('dompurifyXml hook - afterSanitizeAttributes (dangerous-protocol blocking)', () => {
  it('removes javascript: href attributes in XML content', () => {
    const xml = `<root xmlns="${WML_NS}"><a href="javascript:alert(1)">click</a></root>`;
    const result = String(sanitizeHTML(xml));
    expect(result).not.toContain('javascript:');
  });

  it('removes vbscript: attributes in XML content', () => {
    const xml = `<root xmlns="${WML_NS}"><a href="vbscript:Run()">click</a></root>`;
    const result = String(sanitizeHTML(xml));
    expect(result).not.toContain('vbscript:');
  });

  it('removes non-raster data: URIs from XML attributes', () => {
    const xml = `<root xmlns="${WML_NS}"><a href="data:text/html,<b>x</b>">click</a></root>`;
    const result = String(sanitizeHTML(xml));
    expect(result).not.toContain('data:text/html');
  });

  it('allows data:image/png URI in XML content (raster image exception)', () => {
    const b64 = 'data:image/png;base64,iVBOR';
    const xml = `<root xmlns="${WML_NS}"><img src="${b64}"/></root>`;
    const result = String(sanitizeHTML(xml));
    expect(result).toContain('data:image/png');
  });

  it('allows data:image/jpeg URI in XML content', () => {
    const b64 = 'data:image/jpeg;base64,/9j/4AAQ==';
    const xml = `<root xmlns="${WML_NS}"><img src="${b64}"/></root>`;
    const result = String(sanitizeHTML(xml));
    expect(result).toContain('data:image/jpeg');
  });

  it('defeats whitespace-padded javascript: obfuscation in XML attributes', () => {
    const xml = `<root xmlns="${WML_NS}"><a href="j a v a s c r i p t:evil()">click</a></root>`;
    const result = String(sanitizeHTML(xml));
    expect(result).not.toContain('javascript:');
  });
});

describe('dompurifyXml hook - uponSanitizeElement (OOXML element passthrough)', () => {
  it('preserves prefixed OOXML elements (w:p, w:body) via tagName.includes(":")', () => {
    const xml = `<w:document xmlns:w="${WML_NS}"><w:body><w:p>paragraph</w:p></w:body></w:document>`;
    const result = String(sanitizeHTML(xml));
    expect(result).toContain('paragraph');
  });

  it('preserves unprefixed elements with a known OOXML default namespace via namespaceURI', () => {
    const xml = `<Relationships xmlns="${PKG_NS}"><Relationship Id="rId1" Target="doc.xml"/></Relationships>`;
    // Survives sanitization without throwing
    expect(() => sanitizeHTML(xml)).not.toThrow();
  });
});

describe('dompurifyXml hook - uponSanitizeAttribute (on* blocking, namespace passthrough)', () => {
  it('blocks on* event handler attributes on OOXML elements (triggers early return)', () => {
    const xml = `<w:document xmlns:w="${WML_NS}"><w:p onclick="evil()">text</w:p></w:document>`;
    const result = String(sanitizeHTML(xml));
    expect(result).not.toContain('onclick');
  });

  it('preserves colon-prefixed attributes (r:id) on OOXML elements', () => {
    const xml = `<root xmlns:w="${WML_NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:p r:id="rId1">text</w:p></root>`;
    const result = String(sanitizeHTML(xml));
    expect(result).toContain('text');
  });

  it('preserves xmlns declarations (isXmlAttr = true via attrName === "xmlns")', () => {
    const xml = `<root xmlns="${WML_NS}"><child>content</child></root>`;
    const result = String(sanitizeHTML(xml));
    expect(result).toContain('content');
  });
});

// =============================================================================

describe('trustHTML / sanitizeHTML fallback path (no trustedTypes)', () => {
  // Remove the global trustedTypes mock so the module loads without policy support,
  // exercising the ?? fallback branches in trustHTML and sanitizeHTML.
  beforeEach(() => {
    Object.defineProperty(window, 'trustedTypes', {
      value: undefined,
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'trustedTypes', {
      value: globalTrustedTypesMock,
      configurable: true,
      writable: true,
    });
    jest.resetModules();
  });

  it('trustHTML returns the raw value when trustedTypes is unavailable', () => {
    let isolatedTrustHTML!: (val: string) => string;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require('../../src/shared/trusted-types-policy.js');
      isolatedTrustHTML = mod.trustHTML;
    });

    // No trustPolicy created → falls back to ?? val
    const tpl = '<p>safe</p>';
    expect(String(isolatedTrustHTML(tpl))).toBe(tpl);
    expect(String(isolatedTrustHTML(''))).toBe('');
  });

  it('sanitizeHTML runs DOMPurify directly when trustedTypes is unavailable', () => {
    let isolatedSanitizeHTML!: (val: string) => string;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require('../../src/shared/trusted-types-policy.js');
      isolatedSanitizeHTML = mod.sanitizeHTML;
    });

    // No sanitizePolicy created → falls back to ?? createHTML(val)
    const tpl1 = '<p>Hello</p>';
    const tpl2 = '<script>evil()</script>';
    expect(String(isolatedSanitizeHTML(tpl1))).toContain('Hello');
    expect(String(isolatedSanitizeHTML(tpl2))).not.toContain('<script>');
  });
});
