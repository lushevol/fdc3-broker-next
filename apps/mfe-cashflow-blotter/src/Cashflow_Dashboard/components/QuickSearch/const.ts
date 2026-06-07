import { BookingEntityNameIdOptions } from "src/Cashflow_CN/Main/config/ratanConfig/local/BookingEntity";

export const clientTypeOptions = [
  "BANK",
  "BROKER",
  "CENTBK",
  "CLGHSE",
  "CORP",
  "EXCHANG",
  "FININST",
  "FUNDMGR",
  "GOVTCOM",
  "GOVTOFF",
  "HDGEFND",
  "INBCHDH",
  "INCOMNB",
  "INDIV",
  "INTDESK",
  "INTEBCH",
  "INTECOM",
  "INTLACC",
  "INTORG",
  "INVINST",
  "MULTDEV",
  "PARIBAS*IBN",
  "POSACC",
  "PUBSECT",
  "SCB",
];

export const countryOptions = Array.from(
  new Set(BookingEntityNameIdOptions.map((i) => i.tag).filter(Boolean))
).map((i) => ({ label: i, value: i }));
