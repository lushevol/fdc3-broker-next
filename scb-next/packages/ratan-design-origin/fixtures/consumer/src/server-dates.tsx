import React from "react";
import { renderToString } from "react-dom/server";
import { Dates } from "./dates";

const html = renderToString(<Dates />);
if (
  !html.includes("Settlement") ||
  !html.includes("Complete period") ||
  !html.includes("Empty period") ||
  !html.includes("Open-ended period") ||
  !html.includes("Open-start period") ||
  !html.includes("09/18/2026") ||
  html.includes('aria-invalid="true"')
) {
  throw new Error(
    "Date integration SSR lost fields, controlled values or valid null endpoints"
  );
}
console.log("DOM-free date integration SSR passed");
