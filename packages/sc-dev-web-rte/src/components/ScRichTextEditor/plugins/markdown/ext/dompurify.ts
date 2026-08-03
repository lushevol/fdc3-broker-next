import DOMPurify from 'isomorphic-dompurify';
import { escapeHtml } from './post-markdown.js';

/** Markdown specific sanitation */
export function sanitizeHtml(html: string): string {
  const customTags = <string[]>[];

  const unsafeStylePattern = /(?:expression\s*\(|url\s*\(\s*['"]?\s*javascript:|javascript:)/i;

  const dompurify = DOMPurify(window);

  let result = dompurify.sanitize(html, {
    CUSTOM_ELEMENT_HANDLING: {
      tagNameCheck: tag => !!customTags.push(tag),
      attributeNameCheck: () => true,
      allowCustomizedBuiltInElements: true,
    },
    FORBID_TAGS: [
      'o:p',
      'script',
      'meta',
      'link',
      'object',
      'embed',
      'iframe',
      'style',
      'form',
      'input',
      'button',
      'select',
      'textarea',
    ],
    KEEP_CONTENT: true,
    ADD_DATA_URI_TAGS: ['img'],
    ADD_ATTR: ['rel', 'target', 'contenteditable'],
    ALLOW_UNKNOWN_PROTOCOLS: false,
  });

  result = result.replace(
    /\sstyle=("([^"]*)"|'([^']*)')/gi,
    (match, quoted, doubleQuoted, singleQuoted) => {
      const style = `${doubleQuoted ?? singleQuoted ?? ''}`;
      return unsafeStylePattern.test(style) ? '' : match;
    }
  );

  if (customTags.length) {
    result = result.replace(
      new RegExp(`<\/?(${customTags.join('|')})[^>]*>`, 'gi'),
      match => escapeHtml(match)
    );
  }
  return result;
}
