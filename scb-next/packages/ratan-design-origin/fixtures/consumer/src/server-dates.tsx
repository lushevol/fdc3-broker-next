import React from "react";
import { renderToString } from "react-dom/server";
import { Dates } from "./dates";

const html = renderToString(<Dates />);
if (
  !html.includes("Settlement") ||
  !html.includes("Period") ||
  !html.includes("09/18/2026")
) {
  throw new Error("Date integration SSR lost fields or controlled values");
}
console.log("DOM-free date integration SSR passed");
