import React, { ReactElement, Suspense } from "react";
import Splash from "../components/Splash";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AdminModuleProps } from "./common/interface";
const Routing = React.lazy(() => import("./Routing"));

const Admin: React.FC<AdminModuleProps> = (
  props: AdminModuleProps
): ReactElement => {
  return (
    <Suspense fallback={<Splash />}>
      <MemoryRouter>
        <Routes>
          <Route path="/*" element={<Routing {...props} />}></Route>
        </Routes>
      </MemoryRouter>
    </Suspense>
  );
};

export default React.memo(Admin);
