import React, { ReactElement, Suspense } from "react";
import Splash from "../components/Splash";
import { Route, Routes } from "react-router-dom";
import { AdminModuleProps } from "./common/interface";
import useController from "./common/useController";
const Category = React.lazy(() => import("./Category"));
const ImportMap = React.lazy(() => import("./ImportMap"));
const Tile = React.lazy(() => import("./Tile"));

const Routing: React.FC<AdminModuleProps> = (
  props: AdminModuleProps
): ReactElement => {
  useController(props);
  return (
    <Suspense fallback={<Splash />}>
      <Routes>
        <Route path="/importmap/*" element={<ImportMap {...props} />}></Route>
        <Route path="/category/*" element={<Category {...props} />}></Route>
        <Route path="/tile/*" element={<Tile {...props} />}></Route>
      </Routes>
    </Suspense>
  );
};

export default React.memo(Routing);
