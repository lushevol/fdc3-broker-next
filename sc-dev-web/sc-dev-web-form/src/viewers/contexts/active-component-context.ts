import { createContext } from '@lit/context';
import { contexts } from './constant.js';

export const activeComponentContext = createContext(contexts.ACTIVE_COMPONENT);
