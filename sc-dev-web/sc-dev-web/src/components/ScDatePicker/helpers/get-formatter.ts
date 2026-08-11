export function getFormatter(formatter: any) {
  return (n: any) => formatter.format(n).replace(/\u200e/g, '');
}