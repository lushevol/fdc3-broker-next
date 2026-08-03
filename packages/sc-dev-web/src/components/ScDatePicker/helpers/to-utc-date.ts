
export function toUTCDate(y: number, m: number, d: number, h?: number, min?: number, second?: number) {
  const hasTime = h !== undefined && min !== undefined && second !== undefined;
  const date = hasTime ?
    new Date(y, m, d, h, min, second) :
    new Date(y, m, d);

  // JS Date interprets years 0..99 as 1900..1999, so patch them back.
  if (y >= 0 && y <= 99) {
    date.setFullYear(y);
  }

  return date;

}