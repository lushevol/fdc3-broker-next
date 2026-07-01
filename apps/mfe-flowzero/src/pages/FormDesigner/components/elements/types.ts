import React from "react";

import { ComponentProps, FormNode } from "../../types";

export interface ElementRendererProps {
  props: ComponentProps;
  children?: React.ReactNode;
  node?: FormNode;
  activeTabId?: string | null;
  onTabChange?: (id: string) => void;
  isPreview?: boolean;
}
