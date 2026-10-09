export const DateTimeFormat = (
  timeType: string | undefined,
  value: Date | number,
  locale = "en",
  dateStyle: "medium" | "long" | "full" | "short" | undefined = "medium",
  timeStyle: "medium" | "long" | "full" | "short" | undefined = "full"
) => {
  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle,
    timeZone: timeType === "UTC" ? "UTC" : undefined,
  }).format(value);
};

export const DateFormat = (
  timeType: string | undefined,
  value: Date | number,
  locale = "en",
  dateStyle: "medium" | "long" | "full" | "short" | undefined = "medium"
) => {
  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle: undefined,
    timeZone: timeType === "UTC" ? "UTC" : undefined,
  }).format(value);
};
