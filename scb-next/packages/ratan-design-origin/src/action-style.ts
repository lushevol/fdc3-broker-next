export type WebkitActionKind = "primary" | "secondary";
export type WebkitActionState = "hover" | "press" | "select" | "disabled";

type WebkitActionTone = "default" | "error";

const variable = (name: string) => `var(${name})`;

export function getWebkitActionState(
  kind: WebkitActionKind,
  state?: WebkitActionState,
  tone: WebkitActionTone = "default"
) {
  const toneSuffix = tone === "error" ? "-error" : "";
  const stateSuffix = state ? `-${state}` : "";
  const prefix = `--sc-button-${kind}${toneSuffix}${stateSuffix}`;
  // WebKit 2.0.5's primary press/select border definitions are malformed. The
  // matching semantic background is the same solid treatment and stays valid.
  const borderProperty =
    kind === "primary" && (state === "press" || state === "select")
      ? `${prefix}-background-color`
      : `${prefix}-border-color`;
  return {
    backgroundColor: variable(`${prefix}-background-color`),
    borderColor: variable(borderProperty),
    color: variable(`${prefix}-text-color`),
  };
}

export function getWebkitActionStyle(kind: WebkitActionKind, includeError: boolean) {
  const normal = getWebkitActionState(kind);
  const disabled = getWebkitActionState(kind, "disabled");
  const styles = {
    "&.MuiButtonBase-root": {
      ...normal,
      borderStyle: "solid",
      borderWidth: "1px",
    },
    "&:hover": getWebkitActionState(kind, "hover"),
    "&:active": getWebkitActionState(kind, "press"),
    "&.Mui-focusVisible": {
      outline: "2px solid",
      outlineColor: variable("--sc-focus-ring-color"),
      outlineOffset: 2,
    },
    "&.Mui-disabled": {
      ...disabled,
      opacity: 1,
    },
  };
  if (!includeError) return styles;

  return {
    ...styles,
    "&.MuiButton-containedError, &.MuiButton-outlinedError, &.MuiButton-textError": {
      ...getWebkitActionState(kind, undefined, "error"),
      "&:hover": getWebkitActionState(kind, "hover", "error"),
      "&:active": getWebkitActionState(kind, "press", "error"),
      "&.Mui-disabled": {
        ...disabled,
        opacity: 1,
      },
    },
  };
}
