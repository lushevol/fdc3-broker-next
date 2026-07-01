import dayjs from "dayjs";

export const PAGE_SIZE_FOR_CASHFLOW: number = 500;

export const PAGE_NUMBER_FOR_CASHFLOW: number = 0;

export const PAGE_SIZE_FOR_DISPLAY: number = 50;

export const getDateHorizon = (days: any) => {
  if (typeof days === "number" && days > 0) {
    return [
      dayjs().format("YYYY-MM-DD"),
      dayjs().add(days, "days").format("YYYY-MM-DD"),
    ];
  } else if (typeof days === "string" && days.toLowerCase() === "today") {
    return dayjs().format("YYYY-MM-DD");
  }
  return null;
};

export const STATIC_QUICK_FILTER_OPTIONS: MapType = {
  dateHorizon: [
    { name: "Today", value: getDateHorizon("today") },
    { name: "Tomorrow", value: getDateHorizon(1) },
    { name: "Next 3 days", value: getDateHorizon(3) },
    { name: "Next 7 days", value: getDateHorizon(7) },
    { name: "Next 15 days", value: getDateHorizon(15) },
    { name: "Next 30 days", value: getDateHorizon(30) },
  ],
};
