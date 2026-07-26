import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { registerTileWorkspace } from './tileWorkspace';
import '@fm/ratan-design-poc/styles.css';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Portal root element is missing');
registerTileWorkspace();
createRoot(root).render(<StrictMode><App /></StrictMode>);
