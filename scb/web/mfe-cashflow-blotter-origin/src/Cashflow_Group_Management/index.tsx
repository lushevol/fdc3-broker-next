import React, { memo } from "react";

import { TileProps } from "../Root/routing/common/interface";
import Main from "./Main";

const CashflowGroupManagement: React.FC<TileProps> = memo(
  (props: TileProps): React.ReactElement => {
    return <Main {...props} />;
  }
);
export default CashflowGroupManagement;
