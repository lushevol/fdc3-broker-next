import type { SxProps, Theme } from "@mui/material/styles";

export function composeSx(...values: Array<SxProps<Theme> | undefined>): SxProps<Theme> {
  return values.flatMap((value) => {
    if (value === undefined) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  }) as SxProps<Theme>;
}
