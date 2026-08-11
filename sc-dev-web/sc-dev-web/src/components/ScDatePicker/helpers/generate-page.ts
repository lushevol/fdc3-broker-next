export const generatePage = (min: number, max: number, current: number, pageSize: number) => {
  let page = 1;
  if (current <= max && current >= min) {
    // Need + 1 to keep the real numbers can be shown. 
    // E.g. 1900 - 1899 = 1, but we should count it as 2 numbers
    page = Math.ceil((current - min + 1) / pageSize);
  }
  return page - 1;
};

export const generateRange = (min: number, max: number, currentPage: number, pageSize: number) => {
  let range = '';
  const pageLength = currentPage * pageSize;
  const start = min + pageLength;
  const end = start + pageSize - 1;
  range = `${String(Math.max(start, min))  }-${  String(Math.min(end, max))}`;
  return {
    range,
    start,
    end,
  };
};