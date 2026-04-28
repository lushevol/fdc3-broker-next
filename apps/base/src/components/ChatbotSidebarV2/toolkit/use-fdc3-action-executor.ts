import { useMemo } from 'react';
import { createFdc3ActionExecutor } from './fdc3-action-executor';

export function useFdc3ActionExecutor() {
  return useMemo(() => createFdc3ActionExecutor(), []);
}
