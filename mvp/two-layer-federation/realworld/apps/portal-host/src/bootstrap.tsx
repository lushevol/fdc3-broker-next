import '@webcomponents/scoped-custom-element-registry';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Portal root element is missing');
createRoot(root).render(<StrictMode><App /></StrictMode>);
