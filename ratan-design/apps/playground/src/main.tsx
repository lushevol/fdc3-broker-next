import '@fm/ratan-design/styles.css';
import '@fm/ratan-design/themes/dark.css';
import '@fm/ratan-design/themes/cpbb.css';
import '@fm/ratan-design/modes/inter.css';
import '@fm/ratan-design/modes/roboto-mono.css';
import '@fm/ratan-design/modes/dyslexic.css';
import './playground.css';
import { mountPlayground } from './mount.js';

const root = document.getElementById('root');
if (!root) throw new Error('Playground root element was not created.');
mountPlayground(root);
