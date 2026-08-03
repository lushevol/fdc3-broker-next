import { MONTH, YEAR } from '../constants.js';
import { formatWithExtendedYear } from './format-with-extended-year.js';

type DateStringOptions = {
  format?: string;
};

export function toDateString(date: Date, picker?: string, showTime?: boolean, otherParams?: DateStringOptions): string {
  const { format = 'YYYY-MM-DD HH:mm:ss' } = otherParams ?? {};
  if (picker === YEAR) {
    return String(date.getFullYear());
  }

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const datePart = `${year}-${month}-${day}`;

  if (picker === MONTH) {
    return `${year}-${month}`;
  }
  if (showTime) {
    return formatWithExtendedYear(date, format);
  }
  return datePart;
}
