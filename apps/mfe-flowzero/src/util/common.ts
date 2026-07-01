export const formatWithThousandSeparators = (
  rawValue?: string | number | null
) => {
  if (rawValue === null || rawValue === undefined || rawValue === "") {
    return "";
  }

  const normalized = String(rawValue).replace(/,/g, "");
  const isNegative = normalized.startsWith("-");
  const unsigned = isNegative ? normalized.slice(1) : normalized;
  const [integerPart, decimalPart] = unsigned.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimalPart !== undefined
    ? `${isNegative ? "-" : ""}${formattedInteger}.${decimalPart}`
    : `${isNegative ? "-" : ""}${formattedInteger}`;
};
