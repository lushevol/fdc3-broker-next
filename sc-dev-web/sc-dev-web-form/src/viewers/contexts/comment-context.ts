import { createContext } from '@lit/context';
import { contexts } from './constant.js';

export const commentContext = createContext(contexts.COMMENT);
export const commentDataContext = createContext(contexts.COMMENTDATA);
