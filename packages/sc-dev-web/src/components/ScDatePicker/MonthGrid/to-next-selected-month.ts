import { clampValue } from '../helpers/clamp-value.js';
import { keyArrowDown, keyArrowLeft, keyArrowRight, keyArrowUp } from '../key-values.js';
import type { ToNextSelectableMonthInit } from './typings.js';

export function toNextSelectedMonth({
  key,
  month,
}: ToNextSelectableMonthInit): number {
  let newMonth = month;

  switch (key) {
    case keyArrowUp: {
      newMonth = month - 4;
      break;
    }
    case keyArrowDown: {
      newMonth = month + 4;
      break;
    }
    case keyArrowLeft: {
      newMonth = month - 1;
      break;
    }
    case keyArrowRight: {
      newMonth = month + 1;
      break;
    }
    default:
      return month;
  }

  return clampValue(0, 11, newMonth);
}
