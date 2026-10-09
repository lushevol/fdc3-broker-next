import React from "react";
import { DialogTitle as PackageDialogTitle } from "ratan-design-origin/compatibility";
import type { DialogTitleProps } from "./types";
import { PREFIX } from "./style";

export { darkBg, lightBg, setBg } from "ratan-design-origin/compatibility";

export default function DialogTitle(props: Readonly<DialogTitleProps>) {
  return <PackageDialogTitle testIdPrefix={PREFIX} {...props} />;
}
