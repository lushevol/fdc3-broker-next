# In other application, they can consume the application using this

```
import React, { ReactElement, Suspense } from "react";
import Splash from "../components/Splash";
// @ts-ignore
const Template = React.lazy(() => System.import("@fm/template").then((a) => a));

const Tile1: React.FC = (): ReactElement => {
  return (
    <Suspense fallback={<Splash />}>
      <Template tile="/tile1" />
    </Suspense>
  );
};

export default React.memo(Tile1);
```

## or

```
import React, { ReactElement, Suspense } from "react";
import Splash from "../components/Splash";
// @ts-ignore
const Template = React.lazy(() => System.import("@fm/template").then((a) => a));

const Tile2: React.FC = (): ReactElement => {
  return (
    <Suspense fallback={<Splash />}>
      <Template tile="/tile2" />
    /Suspense>
  );
};

export default React.memo(Tile2);
```

# Jest (Unit Test)

## Run Jest Watch and Debug

1. Run command line `node --inspect-brk ./node_modules/jest/bin/jest.js --watch --runInBand`
2. Open DevTools for Node from Browser: `chrome://inspect` or `edge://inspect`
3. When DevTools connect to the Jest, DevTool will pause. you have to Press F8 or click "Resume Button"
4. Wait for 2 -3 min unit jest inited
