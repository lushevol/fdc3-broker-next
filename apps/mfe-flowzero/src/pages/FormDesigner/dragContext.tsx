import React, { createContext, useContext } from "react";

import { DragData } from "./types";

interface DragContextType {
  activeDragData: DragData | null;
  overId: string | null;
  overData: DragData;
  overIsTopHalf?: boolean;
}

export const DragContext = createContext<DragContextType>({
  activeDragData: null,
  overId: null,
  overData: {} as DragData,
  overIsTopHalf: false,
});

export const useDragContext = () => useContext(DragContext);
