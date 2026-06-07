import React, { FC, PropsWithChildren } from "react";

const FullSizeContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="h-full rounded-0 bg-white overflow-hidden relative">
      {children}
    </div>
  );
};

export default FullSizeContainer;
