import { DialogTitleProps } from "./types";
export declare const darkBg =
  "linear-gradient(to right, rgb(17, 23, 29), rgb(17, 23, 29)) padding-box padding-box, linear-gradient(to right, rgb(65, 73, 85), rgb(29, 31, 34)) border-box border-box";
export declare const lightBg =
  "linear-gradient(to right, rgb(245, 245, 245), rgb(245, 245, 245)) padding-box padding-box, linear-gradient(to right, rgb(186, 186, 186), rgb(245, 245, 245)) border-box border-box";
export declare const setBg: (
  theme: any
) =>
  | "linear-gradient(to right, rgb(17, 23, 29), rgb(17, 23, 29)) padding-box padding-box, linear-gradient(to right, rgb(65, 73, 85), rgb(29, 31, 34)) border-box border-box"
  | "linear-gradient(to right, rgb(245, 245, 245), rgb(245, 245, 245)) padding-box padding-box, linear-gradient(to right, rgb(186, 186, 186), rgb(245, 245, 245)) border-box border-box";
export default function DialogTitle(
  props: Readonly<DialogTitleProps>
): import("react/jsx-runtime").JSX.Element;
