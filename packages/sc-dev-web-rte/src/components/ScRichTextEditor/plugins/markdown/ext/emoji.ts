
import { full as mdEmoji } from 'markdown-it-emoji';
import type TurndownService from 'turndown';
import emojiDefs from 'markdown-it-emoji/lib/data/full.mjs';

export { mdEmoji };

const FE0F = /\uFE0F/g;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const emojiToShortcode = new Map<string, string>();

const typedEmojiDefs = emojiDefs as Record<string, string>;

for (const [name, symbol] of Object.entries(typedEmojiDefs)) {
  if (!emojiToShortcode.has(symbol)) {
    emojiToShortcode.set(symbol, name);
  }

  const withoutVariationSelector = symbol.replace(FE0F, '');
  if (
    withoutVariationSelector &&
    !emojiToShortcode.has(withoutVariationSelector)
  ) {
    emojiToShortcode.set(withoutVariationSelector, name);
  }
}

const emojiPattern = new RegExp(
  Array.from(emojiToShortcode.keys())
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|'),
  'g'
);

function replaceEmojiInText(value: string): string {
  if (!emojiPattern.source || emojiPattern.source === '(?:)') return value;

  return value.replace(emojiPattern, match => {
    const shortcode =
      emojiToShortcode.get(match) || emojiToShortcode.get(match.replace(FE0F, ''));
    return shortcode ? `:${shortcode}:` : match;
  });
}

function replaceOutsideInlineCode(line: string): string {
  return line
    .split(/(`+[^`]*`+)/g)
    .map(part =>
      part.startsWith('`') && part.endsWith('`')
        ? part
        : replaceEmojiInText(part)
    )
    .join('');
}

function normalizeEmojiShortcodes(markdown: string): string {
  if (!markdown) return markdown;

  let inFence = false;

  return markdown
    .split('\n')
    .map(line => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }

      if (inFence) return line;
      return replaceOutsideInlineCode(line);
    })
    .join('\n');
}

/**
 * Normalize Unicode emoji chars back to markdown shortcodes after Turndown.
 */
export function tdEmoji(turndownService: TurndownService): void {
  const originalTurndown = turndownService.turndown.bind(turndownService);

  turndownService.turndown = ((input: any) =>
    normalizeEmojiShortcodes(originalTurndown(input))) as any;
}
