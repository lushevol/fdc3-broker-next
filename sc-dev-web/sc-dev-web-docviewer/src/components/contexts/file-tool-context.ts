import { createContext } from '@lit/context';
import type { ScFileTool } from '../ScFileTool.js';
export type { ScFileTool, ToolState } from '../ScFileTool.js';
export const fileToolContext = createContext<ScFileTool>(Symbol('sc-file-tool'));