declare module 'markdown-it-emoji' {
  import MarkdownIt from 'markdown-it';

  export const full: MarkdownIt.PluginSimple;
  export const light: MarkdownIt.PluginSimple;
  export const bare: MarkdownIt.PluginSimple;
  
  // Custom definitions if using configuration objects
  export interface Options {
    defs?: Record<string, string>;
    shortcuts?: Record<string, string | string[]>;
    enabled?: string[];
  }
  
  const emoji: MarkdownIt.PluginWithOptions<Options>;
  export default emoji;
}

declare module 'markdown-it-emoji/lib/data/full.mjs' {
  const defs: Record<string, string>;
  export default defs;
}
