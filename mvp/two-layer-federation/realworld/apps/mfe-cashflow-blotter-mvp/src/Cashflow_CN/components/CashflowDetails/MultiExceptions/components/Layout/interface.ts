import { AccordionProps } from "@mui/material";

import { LayoutItemProperty, LayoutSetting } from "../../hooks/interface";

export interface LayoutProps {
  setting: LayoutSetting;
}

export interface LayoutItem
  extends Pick<AccordionProps, "sx">,
    LayoutItemProperty {}
