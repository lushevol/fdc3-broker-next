/**
 * markdown-plugin.ts
 *
 * Registers 'scMarkdown' as a proper HugeRTE plugin via PluginManager.add.
 *
 * The plugin is always registered but starts disabled.  Call
 * `editor.plugins['scMarkdown'].setEnabled(true)` after editor init to
 * activate it (done automatically by ScRichTextEditorV2 when mode="markdown").
 *
 * Plugin API (accessible via `editor.plugins['scMarkdown']`):
 *   setEnabled(value: boolean)  — toggle paste-interception on/off
 *   getMarkdown()               — serialise editor HTML → Markdown string
 *   setMarkdown(markdown)       — set editor content from a Markdown string
 */

import type { Editor } from 'hugerte';
import 'hugerte/hugerte.js';
import { css } from 'lit';
import { htmlToMarkdown, markdownToHtml } from './converter.js';
import { sanitizeHtml } from './ext/dompurify.js';

// ---------------------------------------------------------------------------
// Public API type — exported so consumers can type their references
// ---------------------------------------------------------------------------

export type MarkdownPluginApi = {
  getMarkdown(): string;
  setMarkdown(markdown: string): void;
};

function looksLikeMarkdown(text: string, html: string): boolean {
  if (/<(table|p|blockquote|ul|ol|figure)/.test(html)) 
    return false;
  if (/(?:^|\n)\s*(?:#+\s+|[\-*+]\s+|\d+\.\s+|`{3}|> |\*\*|__|\*|_)/m.test(text))
    return true;
  return false;
}


// ---------------------------------------------------------------------------
// Plugin registration
// ---------------------------------------------------------------------------

export const PLUGIN_ID = 'scMarkdown';

type PluginReturn = { getMetadata(): object } & MarkdownPluginApi;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).hugerte.PluginManager.add(PLUGIN_ID, (editor: Editor): PluginReturn => {
  // Register a declarative option so the init config can seed the initial state
  editor.options.register('sc_markdown_enabled', {
    processor: 'boolean',
    default: false,
  });

  // -------------------------------------------------------------------------
  // BeforeSetContent — convert MD → HTML when format is 'md'
  //
  // Fires before HugeRTE processes the content.  We rewrite e.content and
  // reset e.format to 'html' so the engine parses our converted HTML normally.
  // -------------------------------------------------------------------------

  editor.on('BeforeSetContent', (e: { format: string; content: string }) => {
    if (e.format !== 'md') return;
    e.content = markdownToHtml(e.content);
    e.format = 'html';
  });
  editor.on('SetContent', () => {
    editor
      .getBody()
      .querySelectorAll<HTMLElement>('.task-list-item-marker')
      .forEach(el => el.setAttribute('contenteditable', 'false'));
  });

  // -------------------------------------------------------------------------
  // GetContent — convert HTML → MD when format is 'md'
  //
  // Fires after HugeRTE has serialised the body to HTML string.
  // We transform e.content in-place so the caller receives Markdown.
  // -------------------------------------------------------------------------

  editor.on('init', () => {
    editor.dom.addStyle(styles.toString());

    // wrapped in init to ensure conversion is after all other GetContent handlers
    editor.on('GetContent', (e: { format: string; content: string }) => {
      if (e.format !== 'md') return;
      e.content = htmlToMarkdown(e.content);
    });

    editor.on('click', e => {
      const el = e.target as HTMLElement;
      // details/summary toggling — HugeRTE doesn't handle this natively
      if (el.tagName === 'SUMMARY' && el.parentElement?.tagName === 'DETAILS') {
        el.parentElement.toggleAttribute('open');
        editor.dispatch('change');
      } else if (el.matches('.task-list-item-marker[role=checkbox]:not([aria-disabled])')) {
        const checked = el.getAttribute('aria-checked') !== 'true';
        el.setAttribute('aria-checked', checked ? 'true' : 'false');
        el.replaceChildren(checked ? '[x]' : '[ ]');
        editor.dispatch('change');
      }
    });
  });

  // -------------------------------------------------------------------------
  // Paste interception
  // -------------------------------------------------------------------------

  editor.on('paste', e => {
    const data =
      e.clipboardData || ((window as any).clipboardData as DataTransfer);
    const plainText = data.getData('text/plain'),
      htmlText = data.getData('text/html');
    if (plainText && looksLikeMarkdown(plainText, htmlText)) {
      editor.once(
        'PastePreProcess',
        e => (e.content = markdownToHtml(plainText))
      );
    } else {
      editor.once('PastePreProcess', e => {
        e.content = sanitizeHtml(e.content);
      });
      editor.once('PastePostProcess', ({ node }) => {
        // remove styles other than align
        const inherit = getComputedStyle(editor.getBody()).textAlign;
        node.querySelectorAll<HTMLElement>('*[style]').forEach(el => {
          const align = el.style.textAlign;
          el.removeAttribute('style');
          if (align && align !== inherit) el.style.textAlign = align;
        });
        node.querySelectorAll<HTMLElement>('table').forEach(el => {
          el.removeAttribute('width');
          el.removeAttribute('height');
          el.removeAttribute('cellpadding');
          el.removeAttribute('cellspacing');
          el.querySelectorAll<HTMLElement>('tr,td,th').forEach(cell => {
            cell.removeAttribute('width');
            cell.removeAttribute('height');
          });
          el.querySelectorAll<HTMLElement>('colgroup').forEach(cg => cg.remove());
          // restore default table border
          if (el.matches(':not([style*=border])')) el.setAttribute('border', '1');
          // has no header, move up
          if (el.querySelector('head') === null) {
            const tr = el.querySelector('tr:first-child');
            if (tr) {
              const thead = document.createElement('thead');
              thead.append(tr);
              el.prepend(thead);
            }
          }
        });
      });
    }
  });

  // -------------------------------------------------------------------------
  // Plugin API
  // -------------------------------------------------------------------------

  return {
    getMetadata: () => ({
      name: 'SC Markdown',
      url: 'https://github.com/scdevkit/webkit-rte',
    }),

    getMarkdown(): string {
      if (!editor || editor.removed) return '';
      // Delegates through the GetContent event handler above
      return editor.getContent({ format: 'md' as any }) as unknown as string;
    },

    setMarkdown(markdown: string): void {
      if (!editor || editor.removed) return;
      // Delegates through the BeforeSetContent event handler above
      editor.setContent(markdown, { format: 'md' });
    },
  };
});

const styles = css`
  .metadata-yaml-table-wrap {
    cursor: default;
    display: block;
    overflow: auto hidden;
    max-width: 100%;
    position: relative;
    
    & & {
      max-width: 90dvw;
    }

    table.metadata-yaml-table {
      border-collapse: collapse;
      border-spacing: 0;
      border: none;

      td, th {
        overflow: hidden;
      }
    }
  }
  pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 0.5em;
  }
  code.hljs {
    padding: 3px 5px;
  }
  pre, code {
    &, &[class*=language-], &[data-mce-selected=inline-boundary] {
      &, .mce-content-body & {
        background: var(--is-dark, var(--sc-color-grey-200-dark)) 
          var(--is-light, var(--sc-color-grey-50));
        color: var(--is-dark, var(--sc-color-grey-950-dark)) 
          var(--is-light, var(--sc-color-grey-900));
      }
    }
  }
  .mce-content-body pre {
    &.sc-azure-container, &.sc-math {
      font-family: var(--sc-font-family-mono, monospace);
      font-size: 0.875rem;
      white-space: pre;

      &:not([data-mce-selected=inline-boundary]) {
        background-color: transparent;
      }
    }
  }
  .mce-content-body .task-list-item-marker {
    font-family: var(--sc-font-family-mono, monospace);
    background: none;
    display: inline-block;

    &[contentEditable=false]:not([aria-disabled]) {
      cursor: pointer;
    }
  }

  .hljs {
    .hljs-comment,
    .hljs-quote,
    .hljs-variable {
      color: var(--is-dark, var(--sc-color-grey-600-dark)) 
        var(--is-light, var(--sc-color-grey-600));
    }
    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-built_in,
    .hljs-name,
    .hljs-tag {
      color: var(--is-dark, var(--sc-color-blue-600-dark))
        var(--is-light, var(--sc-color-blue-600));
    }
    .hljs-string,
    .hljs-title,
    .hljs-section,
    .hljs-attribute,
    .hljs-literal,
    .hljs-template-tag,
    .hljs-template-variable,
    .hljs-type,
    .hljs-addition {
      color: var(--is-dark, var(--sc-color-red-600-dark))
        var(--is-light, var(--sc-color-red-600));
    }
    .hljs-deletion,
    .hljs-selector-attr,
    .hljs-selector-pseudo,
    .hljs-meta {
      color: var(--is-dark, var(--sc-color-teal-650-dark)) 
        var(--is-light, var(--sc-color-teal-650));
    }
    .hljs-doctag {
      color: var(--is-dark, var(--sc-color-grey-600-dark)) 
        var(--is-light, var(--sc-color-grey-600));
    }
    .hljs-attr {
      color: var(--is-dark, var(--sc-color-red-600-dark)) 
        var(--is-light, var(--sc-color-red-600));
    }
    .hljs-symbol,
    .hljs-bullet,
    .hljs-link {
      color: var(--is-dark, var(--sc-color-blue-450-dark)) 
        var(--is-light, var(--sc-color-blue-450));
    }

    /* Misc effects */
    .hljs-emphasis {
      font-style: italic;
    }
    .hljs-strong {
      font-weight: bold;
    }
  }
`;