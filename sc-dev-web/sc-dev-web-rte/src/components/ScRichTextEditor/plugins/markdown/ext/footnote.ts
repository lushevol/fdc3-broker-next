
import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';


export function mdFootnote(md: MarkdownIt): void {
  md.use(footnote);

  // remove hr
  md.renderer.rules.footnote_block_open = () => (
    '<section class="footnotes">\n' +
    '<ol class="footnotes-list">\n'
  );
}
