import React from "react";

import { PropertiesPanelProps } from "../config/ILayoutsConfig";

const EndNodeForm: React.FC<PropertiesPanelProps> = ({
  nodeData,
  nodeType,
}) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">End Node Form</h2>
      {/* Add End Node specific fields here */}
    </div>
  );
};

export default EndNodeForm;
