import dayjs from "dayjs";

export const PAGE_SIZE_FOR_CASHFLOW = 1000;

export const PAGE_NUMBER_FOR_CASHFLOW = 0;

// Cashflow_State = WAITING and Payment Date between TODAY and TODAY + 15
export const getCashflowDefaultFilter = (): FilterItem[] => {
  return [
    {
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "WAITING",
    },
    {
      field: "Cashflow.Payment_Date",
      operator: "BET",
      values: [
        dayjs().format("YYYY-MM-DD"),
        dayjs().add(6, "day").format("YYYY-MM-DD"),
      ],
    },
  ];
};

export const getDateHorizon = (offset: number | string) => {
  if (typeof offset === "number" && offset > 0) {
    return [
      dayjs().format("YYYY-MM-DD"),
      dayjs().add(offset, "days").format("YYYY-MM-DD"),
    ];
  } else if (typeof offset === "string") {
    switch (offset.toLowerCase()) {
      case "today":
        return dayjs().format("YYYY-MM-DD");
      case "tomorrow":
        return dayjs().add(1, "days").format("YYYY-MM-DD");
      default:
        break;
    }
  }
  return null;
};

export const generate_STATIC_QUICK_FILTER_OPTIONS: () => MapType = () => ({
  dateHorizon: [
    { name: "Today", value: getDateHorizon("today") },
    { name: "Tomorrow", value: getDateHorizon("tomorrow") },
    { name: "Today+Tomorrow", value: getDateHorizon(1) },
    { name: "Next 3 days", value: getDateHorizon(3) },
    { name: "Next 7 days", value: getDateHorizon(7) },
    { name: "Next 15 days", value: getDateHorizon(15) },
    { name: "Next 30 days", value: getDateHorizon(30) },
  ],
});
