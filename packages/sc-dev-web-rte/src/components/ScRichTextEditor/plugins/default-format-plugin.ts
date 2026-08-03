/**
 * default-format-plugin.ts
 *
 * This plugin applies a set of formats to the editor when the user 
 * creates a new block or inserts a table.
 * The styles are applied only when the editor body is empty, 
 * and they are not applied if the user has already applied similar styles.
 */

import 'hugerte/hugerte.js';
import type { Editor } from 'hugerte';


export const PLUGIN_ID = 'scRteDefaultFormat';
export const OPTION_NAME = 'default-format';

type PluginReturn = { getMetadata(): object };

const _ = undefined;

const FORMATS = [
  'alignleft',
  'aligncenter',
  'alignright',
  'alignjustify',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'blockquote',
  'subscript',
  'superscript',
  'code',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'div',
  'address',
  'pre',
  'samp',
] as const;

const COMMANDS = {
  bold: true,
  italic: true,
  underline: true,
  strikethrough: true,
  superscript: true,
  subscript: true,
  forecolor: /^(#[a-f0-9]{6}|[a-z]+)$/i,
  backcolor: /^(#[a-f0-9]{6}|[a-z]+)$/i,
  alignleft: true,
  aligncenter: true,
  alignright: true,
  alignjustify: true,
  // fontname: /^.+$/g,
  fontsize: /^\d+(?:\.\d+)?(px|em|rem|pt|%)$/i,
  indent: true,
  // outdent: true, // breaks list
  formatblock: new RegExp(`^(${FORMATS.join('|')})$`, 'i'),
} as const;

// actual command for execCommand
const CMD_ALIAS = <Record<string, string>>{
  alignleft: 'justifyleft',
  aligncenter: 'justifycenter',
  alignright: 'justifyright',
  alignjustify: 'justifyfull',
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).hugerte.PluginManager.add(PLUGIN_ID, (editor: Editor): PluginReturn => {
  let commands: [keyof typeof COMMANDS, string?, string?][] = [];


  // Register a declarative option so the init config can seed the initial state
  editor.options.register(OPTION_NAME, {
    processor: (value: any) => {
      if (!Array.isArray(value)) {
        console.error(OPTION_NAME, 'must be an array of strings');
        return false;
      }

      commands = value
        .map<[keyof typeof COMMANDS, string, string?]>((cls: any) => {
          const parts = `${cls}`.trim().split(/\s*:\s*/g).map(v => v.trim());
          if (parts.length >= 3)
            return [
              parts[1].toLowerCase() as keyof typeof COMMANDS,
              parts[2],
              parts[0],
            ];
          return [parts[0].toLowerCase() as keyof typeof COMMANDS, parts[1]];
        })
        .filter(([cmd, val]) => {
          if (!cmd) return false;
          if (!(cmd in COMMANDS)) {
            console.warn(
              `RTE invalid ${OPTION_NAME} '${cmd}'`,
              (editor.getElement?.().getRootNode() as ShadowRoot)?.host
            );
            return false;
          }
          const validation = COMMANDS[cmd];
          if (validation === true) return true;

          if (val && !val.match(validation)) {
            console.warn(
              `RTE invalid ${OPTION_NAME} ${cmd} value '${val}'`,
              (editor.getElement?.().getRootNode() as ShadowRoot)?.host
            );
            return false;
          }
          return true;
        });

      return true;
    },
    default: [],
  });

  function applyFormat(insertBr = true) {
    const content = editor.selection.getContent({ format: 'text' });
    if (content?.trim().length) return;

    const similarMatch = commands.some(([cmd, value]) => {
      let name: string = cmd;
      if (cmd === 'formatblock' && value) name = value;
      return editor.formatter.match(name, _, _, true);
    });
    // skip applying style if there is similar matching style already applied
    if (!similarMatch)
      editor.undoManager.ignore(() => {
        commands.forEach(([cmd, val, match]) => {
          if (!match || editor.selection.getNode().matches(match))
            editor.execCommand(CMD_ALIAS[cmd] ?? cmd, false, val, {
              skip_focus: true,
            });
        });
        if (insertBr)
          editor.execCommand(
            'mceInsertContent',
            false,
            '<br data-mce-bogus="1">',
            { skip_focus: true }
          );
      });
  }

  // new block after enter key // included in undo transact
  editor.on('NewBlock', () => applyFormat());
  // when empty content
  editor.on('SetContent', () => {
    if (editor.getBody().textContent === '') 
      requestAnimationFrame(() => applyFormat());
  });
  // list related changes
  editor.on('ListMutation', () => {
    editor.once('ExecCommand', () => applyFormat());
  });

  editor.on('ExecCommand', ({ command }) => {
    if (command === 'mceBlockQuote') {
      // blockquote
      applyFormat();
    } else if (command === 'mceInsertTable') {
      // table
      editor.once('ObjectSelected', ({ target }) => {
        if (target.tagName === 'TABLE') {
          const cells = (target as HTMLElement).querySelectorAll('td, th');
          // reverse, so 1st cell is last selected
          Array.from(cells).reverse().forEach(cell => {
            const br = editor.dom.doc.createElement('br');
            br.setAttribute('data-mce-bogus', '1');
            cell.replaceChildren(br);
            editor.selection.select(cell);
            applyFormat(false);
          });
        }
      });
    }
  });

  return {
    getMetadata: () => ({
      name: PLUGIN_ID,
      // eslint-disable-next-line max-len
      url: 'https://dev.azure.com/sc-ado/TTOQPR/_git/55313-sc-dev-web-rte/src/components/ScRichTextEditor/plugins/default-format-plugin.ts',
    }),
  };
});
