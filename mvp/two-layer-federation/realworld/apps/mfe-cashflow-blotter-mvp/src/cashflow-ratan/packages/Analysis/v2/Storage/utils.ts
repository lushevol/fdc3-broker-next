import { decode, encode } from "./crypto";

export const zip = (v) => {
  return encode(
    JSON.stringify({
      value: v,
    })
  );
};

export const unzip = (v?: string | null) => {
  if (typeof v === "string") return JSON.parse(decode(v)).value;
  else return v;
};
