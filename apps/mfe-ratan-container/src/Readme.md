## In other application, they can consume the application using this

import React, { ReactElement, Suspense } from "react";
import Splash from "../components/Splash";
// @ts-ignore
const Container = React.lazy(() => System.import("@fm/template_container").then((a) => a));

const Container1: React.FC = (): ReactElement => {
return (
<Suspense fallback={<Splash />}>
<Container module="/template" tile="/tile1" />
</Suspense>
);
};

## export default React.memo(Container1);

or

---

import React, { ReactElement, Suspense } from "react";
import Splash from "../components/Splash";
// @ts-ignore
const Container = React.lazy(() => System.import("@fm/template_container").then((a) => a));

const Container2: React.FC = (): ReactElement => {
return (
<Suspense fallback={<Splash />}>
<Container  module="/trade_blotter" tile="/tile_abc" />
</Suspense>
);
};

## export default React.memo(Container2);
