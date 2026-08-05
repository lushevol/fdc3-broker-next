export function isNumber(value: any): boolean {
  const res = Number(value);
  return !isNaN(res) && `${res}` === `${value}`;
}

export function validNumber(value: any): number {
  if (!isNumber(value)) throw Error(`Invalid number: ${value}`);
  return Number(value);
}


export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
