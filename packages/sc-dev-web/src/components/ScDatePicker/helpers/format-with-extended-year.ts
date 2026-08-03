import dayjs from 'dayjs/esm/index.js';

export const toExtendedYearByTokenLength = (year: number, length: number): string => {
  const abs = String(Math.abs(year));
  const sign = year < 0 ? '-' : '';

  if (length <= 1) return `${year}`;
  if (length === 2) return `${sign}${abs.padStart(2, '0').slice(-2)}`;
  return `${sign}${abs.padStart(length, '0')}`;
};

export const formatWithExtendedYear = (date: Date, format: string): string => {
  const year = date.getFullYear();
  const tokens: number[] = [];
  let transformed = '';
  let inBracket = false;

  for (let i = 0; i < format.length; i += 1) {
    const ch = format[i];

    if (ch === '[') {
      inBracket = true;
      transformed += ch;
      continue;
    }
    if (ch === ']') {
      inBracket = false;
      transformed += ch;
      continue;
    }

    if (!inBracket && ch === 'Y') {
      let j = i;
      while (j < format.length && format[j] === 'Y') j += 1;

      const len = j - i;
      const idx = tokens.push(len) - 1;
      transformed += `[__SC_EXT_YEAR_${idx}__]`;
      i = j - 1;
      continue;
    }

    transformed += ch;
  }

  let output = dayjs(date).format(transformed);
  tokens.forEach((len, idx) => {
    output = output.replace(`__SC_EXT_YEAR_${idx}__`, toExtendedYearByTokenLength(year, len));
  });
  return output;
};
