import { sanitizeHtml } from './dompurify.js';

const protectedMacros = [
  ['[[_TOC_]]', '\uE000TOC\uE000'],
  ['[[_TOSP_]]', '\uE000TOSP\uE000'],
] as const;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function protectMacros(markdown: string): string {
  let protectedMarkdown = markdown;
  for (const [macro, placeholder] of protectedMacros) {
    protectedMarkdown = protectedMarkdown.split(macro).join(placeholder);
  }
  return protectedMarkdown;
}

function restoreMacros(html: string): string {
  let restoredHtml = html;
  for (const [macro, placeholder] of protectedMacros) {
    restoredHtml = restoredHtml.split(placeholder).join(macro);
  }
  return restoredHtml;
}

export function preMarkdown(markdown: string): string {
  if (!markdown) return '';
  return protectMacros(markdown);
}

export function postMarkdown(html: string): string {
  if (!html) return '';

  let result = restoreMacros(html);
  result = result.replace(/<table(?![^>]*\bborder\s*=)/gi, '<table border="1"');

  return sanitizeHtml(result);
}