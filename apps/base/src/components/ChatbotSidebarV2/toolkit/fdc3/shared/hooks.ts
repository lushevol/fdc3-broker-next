import { useMemo } from 'react';
import { createFdc3ActionExecutor } from './action-executor';
import { createFdc3WorkflowExecutor } from './workflow-executor';

export function useFdc3ActionExecutor() {
  return useMemo(() => createFdc3ActionExecutor(), []);
}

export function useFdc3WorkflowExecutor() {
  return useMemo(() => createFdc3WorkflowExecutor(), []);
}
