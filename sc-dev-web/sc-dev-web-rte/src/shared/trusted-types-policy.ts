import { Config } from 'dompurify';
import DOMPurify from 'isomorphic-dompurify';
import type { TrustedHTML, TrustedTypesWindow } from 'trusted-types/lib';

type TrustedWindow = Window & typeof globalThis & TrustedTypesWindow;
const twindow = window as TrustedWindow;

const dompurify = DOMPurify(twindow);
dompurify.addHook('afterSanitizeAttributes', node => {
  if (node.getAttribute('target') === '_blank') {
    const rel = new Set(
      `noopener noreferrer ${node.getAttribute('rel') || ''}`
        .split(/\s+/)
        .filter(Boolean)
    );
    node.setAttribute('rel', Array.from(rel).join(' '));
  }
});

const opts: Config = {
  CUSTOM_ELEMENT_HANDLING: {
    tagNameCheck: /^(sc-|x-turndown$)/, // only allow prefixed custom elements
    attributeNameCheck: () => true,
    allowCustomizedBuiltInElements: true,
  },
  ADD_DATA_URI_TAGS: ['img'],
  ADD_ATTR: ['rel', 'target'],
  ALLOW_UNKNOWN_PROTOCOLS: true,
};
const htmlOpts = {
  ...opts,
  WHOLE_DOCUMENT: true,
  ADD_TAGS: ['style'],
  SAFE_FOR_XML: false,
};


const dompurifyXml = DOMPurify(twindow);
const xmlOpts = {
  get ALLOWED_NAMESPACES() {
    return Array.from(OOXML_NAMESPACES);
  },
  PARSER_MEDIA_TYPE: 'application/xhtml+xml' as const,
  ADD_DATA_URI_TAGS: ['img'],
  ALLOW_UNKNOWN_PROTOCOLS: true,
};


function createHTML(val: string, ... more: any[]) {
  let result: string;
  if (/<(?!svg|html|math)[^>]* xmlns/.test(val)) {
    const trimmed = val.trim();
    const extra = extractOoxmlNamespaces(trimmed);
    const opts = extra.length > 0
      ? { ...xmlOpts, ALLOWED_NAMESPACES: [...xmlOpts.ALLOWED_NAMESPACES, ...extra] }
      : xmlOpts;
    if (extra.length > 0) {
      console.log('[trusted-types] xml namespaces discovered', extra);
      extra.forEach(ns => OOXML_NAMESPACES.add(ns));
    }
    result = dompurifyXml.sanitize(trimmed, opts);
  } else {
    result = dompurify.sanitize(val, /^<html(.|\s)+<\/html>\s*$/gim.test(val) ? htmlOpts : opts);
  }

  if ('DEBUG' in window && String(window.DEBUG).split(';').includes('trusted-types') && `${result}` !== val) {
    const rm = dompurify.removed;
    const replace = (_: any, e: any) => {
      if (e instanceof Element) return e.outerHTML;
      if (e instanceof Attr) return `${e.name}="${e.value}"`;
      if (e instanceof Node) return `${e.nodeName}: ${e.nodeValue}`;
      return e;
    };
    rm.length &&
      console.log(`[trusted-types] ${val}`, ...more, `\n  removed: ${JSON.stringify(rm, replace, 2)}\n`, `${result}`);
  }
  return result;
}

function passThru(v: string) {
  if ('DEBUG' in window && String(window.DEBUG).split(';').includes('trusted-types'))
    console.log(`[trusted-types] trusting w/o sanitation: ${v}`);
  return v;
}
const sanitizePolicy = twindow.trustedTypes?.createPolicy?.('DOMPurify', {
  createHTML,
});
const trustPolicy = twindow.trustedTypes?.createPolicy?.('trustWrap', {
  createHTML: passThru,
});

/**
 * Use if string is guarateed to be safe and does not require sanitization.
 *
 * Ideally used for static content that does not come from user
 * input and is known to be safe.
 *
 * example:
 *
 * `div.innerHTML = sanitizeHTML(val);`
 *
 * If possible use lit html instead.
 */
export const trustHTML = <T = TrustedHTML | string>(val: string) =>
  (trustPolicy?.createHTML(val) ?? val) as T;

/**
 * Ensures that the HTML string is sanitized before being set to innerHTML.
 *
 * example:
 *
 * `div.innerHTML = sanitizeHTML(val);`
 *
 * Returns `TrustedHTML` object if browser supported.
 * Cast to string if needed as string.
 *
 * `TrustedHTML` is required for `innerHTML`.
 */
export const sanitizeHTML = <T = TrustedHTML | string>(val: string) =>
  (sanitizePolicy?.createHTML(val) ?? createHTML(val)) as T;

/**
 * Creates a DOMPurify-based policy as default if default is not set yet.
 *
 * This is specially useful for third-party libraries that may use the default
 * Trusted Types policy without us having control over it.
 */
export function enableDefaultTrustTypesPolicy(win: Window = twindow): void {
  (win as TrustedWindow).trustedTypes?.defaultPolicy ??
    (win as TrustedWindow).trustedTypes?.createPolicy?.('default', {
      createHTML,
      createScript: passThru,
      createScriptURL: passThru,
    });
}


/** Office XML namespace whitelisting */
const OOXML_NAMESPACES = new Set([
  // W3C standards
  'http://www.w3.org/1999/xhtml',
  'http://www.w3.org/2000/svg',
  'http://www.w3.org/1998/Math/MathML',
  'http://www.w3.org/XML/1998/namespace',
  'http://www.w3.org/1999/xlink',
  // ECMA-376 / OOXML — WordprocessingML
  'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
  'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
  // ECMA-376 / OOXML — SpreadsheetML
  'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
  // ECMA-376 / OOXML — PresentationML
  'http://schemas.openxmlformats.org/presentationml/2006/main',
  // ECMA-376 / OOXML — DrawingML
  'http://schemas.openxmlformats.org/drawingml/2006/main',
  'http://schemas.openxmlformats.org/drawingml/2006/chart',
  'http://schemas.openxmlformats.org/drawingml/2006/chartDrawing',
  'http://schemas.openxmlformats.org/drawingml/2006/compatibility',
  'http://schemas.openxmlformats.org/drawingml/2006/diagram',
  'http://schemas.openxmlformats.org/drawingml/2006/lockedCanvas',
  'http://schemas.openxmlformats.org/drawingml/2006/picture',
  'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing',
  'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
  // ECMA-376 / OOXML — Relationships & Packaging
  'http://schemas.openxmlformats.org/package/2006/content-types',
  'http://schemas.openxmlformats.org/package/2006/digital-signature',
  'http://schemas.openxmlformats.org/package/2006/metadata/core-properties',
  'http://schemas.openxmlformats.org/package/2006/relationships',
  'http://schemas.openxmlformats.org/officeDocument/2006/bibliography',
  'http://schemas.openxmlformats.org/officeDocument/2006/custom-properties',
  'http://schemas.openxmlformats.org/officeDocument/2006/customXml',
  'http://schemas.openxmlformats.org/officeDocument/2006/customXmlDataProps',
  'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes',
  'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties',
  'http://schemas.openxmlformats.org/officeDocument/2006/math',
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  'http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes',
  // ECMA-376 / OOXML — Markup Compatibility
  'http://schemas.openxmlformats.org/markup-compatibility/2006',
  // Microsoft — Word extensions
  'http://schemas.microsoft.com/office/word/2003/wordml',
  'http://schemas.microsoft.com/office/word/2006/wordml/symbolfont',
  'http://schemas.microsoft.com/office/word/2010/wordml',
  'http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas',
  'http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing',
  'http://schemas.microsoft.com/office/word/2010/wordprocessingGroup',
  'http://schemas.microsoft.com/office/word/2010/wordprocessingInk',
  'http://schemas.microsoft.com/office/word/2010/wordprocessingShape',
  'http://schemas.microsoft.com/office/word/2012/wordml',
  'http://schemas.microsoft.com/office/word/2015/wordml/symex',
  'http://schemas.microsoft.com/office/word/2016/wordml/cid',
  'http://schemas.microsoft.com/office/word/2018/wordml/cid',
  // Microsoft — Excel/SpreadsheetML extensions
  'http://schemas.microsoft.com/office/excel/2006/main',
  'http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac',
  'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main',
  'http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac',
  'http://schemas.microsoft.com/office/spreadsheetml/2010/11/main',
  'http://schemas.microsoft.com/office/spreadsheetml/2011/1/ac',
  'http://schemas.microsoft.com/office/spreadsheetml/2015/02/main',
  'http://schemas.microsoft.com/office/spreadsheetml/2016/11/main',
  'http://schemas.microsoft.com/office/spreadsheetml/2017/richdata',
  'http://schemas.microsoft.com/office/spreadsheetml/2017/richdata2',
  'http://schemas.microsoft.com/office/spreadsheetml/2018/calcfeatures',
  // Microsoft — DrawingML extensions
  'http://schemas.microsoft.com/office/drawing/2010/compatibility',
  'http://schemas.microsoft.com/office/drawing/2010/main',
  'http://schemas.microsoft.com/office/drawing/2010/picture',
  'http://schemas.microsoft.com/office/drawing/2012/chart',
  'http://schemas.microsoft.com/office/drawing/2012/chartStyle',
  'http://schemas.microsoft.com/office/drawing/2014/chartex',
  'http://schemas.microsoft.com/office/drawing/2016/11/main',
  'http://schemas.microsoft.com/office/drawing/2016/SVG/main',
  'http://schemas.microsoft.com/office/drawing/2016/ink',
  'http://schemas.microsoft.com/office/drawing/2017/decorative',
  'http://schemas.microsoft.com/office/drawing/2017/model3d',
  'http://schemas.microsoft.com/office/drawing/2018/animation',
  'http://schemas.microsoft.com/office/drawing/2018/animation/model3d',
  'http://schemas.microsoft.com/office/drawing/2018/hyperlinkOnHover',
  'http://schemas.microsoft.com/office/drawing/2020/classificationShape',
  // Microsoft — theme/presentation extensions
  'http://schemas.microsoft.com/office/thememl/2012/main',
  'http://schemas.microsoft.com/office/drawing/2013/main/chart',
  'http://schemas.microsoft.com/office/powerpoint/2010/main',
  'http://schemas.microsoft.com/office/powerpoint/2012/main',
  'http://schemas.microsoft.com/office/powerpoint/2015/06/main',
  'http://schemas.microsoft.com/office/powerpoint/2016/sectionzoom',
  'http://schemas.microsoft.com/office/powerpoint/2017/10/main',
  // Microsoft — shared/common extensions
  'http://schemas.microsoft.com/office/2006/activeX',
  'http://schemas.microsoft.com/office/2006/coverPageProps',
  'http://schemas.microsoft.com/office/2006/customDocumentInformationPanel',
  'http://schemas.microsoft.com/office/2006/metadata/contentType',
  'http://schemas.microsoft.com/office/2006/metadata/properties/metaAttributes',
  'http://schemas.microsoft.com/office/2009/05/commonControls',
  'http://schemas.microsoft.com/office/2009/07/customui',
  'http://schemas.microsoft.com/office/2011/relationships/hdphoto',
  // Legacy VML
  'urn:schemas-microsoft-com:vml',
  'urn:schemas-microsoft-com:office:office',
  'urn:schemas-microsoft-com:office:word',
  'urn:schemas-microsoft-com:office:excel',
  'urn:schemas-microsoft-com:office:powerpoint',
  // Dublin Core (metadata)
  'http://purl.org/dc/elements/1.1/',
  'http://purl.org/dc/terms/',
  'http://ns.adobe.com/xap/1.0/',
]);

/**
 * Pattern to recognise legitimate Office/OOXML namespace URIs for dynamic discovery.
 * Anchored strictly so "schemas.openxmlformats.org.evil.com" cannot match.
 * Query strings (?...) and fragments (#...) are rejected via [^?#]*$.
 * purl.org/dc and ns.adobe.com are intentionally excluded — their known namespaces
 * are already in the static list and no new variants are expected in OOXML.
 */
// eslint-disable-next-line max-len
const OOXML_NS_PATTERN = /^(?:https?:\/\/schemas\.openxmlformats\.org\/|https?:\/\/schemas\.microsoft\.com\/office\/|https?:\/\/www\.w3\.org\/)[^?#]*$/;

/**
 * Extract all xmlns declarations from the raw XML string and return any
 * that match the OOXML pattern but are not already in OOXML_NAMESPACES.
 */
function extractOoxmlNamespaces(input: string) {
  const extra: string[] = [];
  const re = /\bxmlns(?::[a-zA-Z_][\w.-]*)?\s*=\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(input)) !== null) {
    const uri = m[1];
    if (!OOXML_NAMESPACES.has(uri) && OOXML_NS_PATTERN.test(uri)) {
      extra.push(uri);
    }
  }
  return extra;
}

// Block dangerous protocols even when ALLOW_UNKNOWN_PROTOCOLS is true.
// Strips whitespace first to defeat obfuscation like "j a v a s c r i p t:".
// data:image/* (raster only) is explicitly allowed — OOXML renderers inline images as
// base64 data URIs. SVG data URIs are blocked because SVG can contain script.
dompurifyXml.addHook('afterSanitizeAttributes', node => {
  for (const attr of Array.from(node.attributes)) {
    if (
      /^(javascript|vbscript):|^data:(?!image\/(?:png|jpe?g|gif|webp|bmp|tiff?|ico|avif)[;,])/i.test(
        attr.value.replace(/\s/g, '')
      )
    ) {
      node.removeAttribute(attr.name);
    }
  }
});
// Allow all OOXML elements — both prefixed (w:p, a:blip) and unprefixed elements
// that declare a known default namespace (Relationship, Properties, Types, etc.).
// The ALLOWED_NAMESPACES set is referenced below after xmlOpts is defined.
dompurifyXml.addHook('uponSanitizeElement', (node, data) => {
  if (
    data.tagName.includes(':') ||
    ('namespaceURI' in node &&
      typeof node.namespaceURI === 'string' &&
      OOXML_NAMESPACES.has(node.namespaceURI))
  ) {
    data.allowedTags[data.tagName] = true;
  }
});
// Allow all attributes on OOXML elements, including namespace declarations
// (xmlns, xmlns:w, r:id, w:val, mc:Ignorable, Id, Type, Target, etc.).
// Event handler attributes (on*) are always blocked.
dompurifyXml.addHook('uponSanitizeAttribute', (node, data) => {
  if (/^on/i.test(data.attrName)) return;
  const isXmlAttr = data.attrName.includes(':') || data.attrName === 'xmlns';
  const isOnXmlElement =
    (node.tagName && node.tagName.includes(':')) ||
    (node.namespaceURI && OOXML_NAMESPACES.has(node.namespaceURI));
  if (isXmlAttr || isOnXmlElement) {
    data.forceKeepAttr = true;
  }
});