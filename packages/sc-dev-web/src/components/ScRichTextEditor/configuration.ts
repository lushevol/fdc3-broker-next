import { Editor } from './modules/Editor.js';
import { ShortCut } from './modules/ShortCut.js';
import { KEY_MAP } from './constant.js';
import { Clipboard } from './modules/Clipboard.js';
import { Viewer } from './modules/Viewer.js';
import { Toolbar } from './modules/Toolbar.js';

// ANA: can expose configuration for developer to custom if need.
export const configuration = {
  shortcut: true,
  modules: {
    shortcut: ShortCut,
    editor: Editor,
    clipboard: Clipboard,
    viewer: Viewer,
    toolbar: Toolbar,
  },
  keyMap: KEY_MAP,
};
