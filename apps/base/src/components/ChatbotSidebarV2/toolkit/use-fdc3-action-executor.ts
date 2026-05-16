import { useMemo } from 'react';
import { createFdc3ActionExecutor } from './fdc3-action-executor';
import { createFdc3WorkflowExecutor } from './fdc3-workflow-executor';

export function useFdc3ActionExecutor() {
  return useMemo(() => createFdc3ActionExecutor(), []);
}

export function useFdc3WorkflowExecutor() {
  return useMemo(() => createFdc3WorkflowExecutor(), []);
}
