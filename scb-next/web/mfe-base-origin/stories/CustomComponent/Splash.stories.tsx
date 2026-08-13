import React, { Suspense } from "react";
import type { Meta } from "@storybook/react-vite";
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { Splash } from "src/Root/import";
*/
import Splash from "../../src/components/Splash";
/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const Splash = Container.Splash.default;
...
export default Container;
*/
const waitFor = (time = 2000) => new Promise((resolve) => {
  setTimeout(() => resolve(true), time)
})


export const SplashComp = () => {
  const LoadingButton = React.useMemo(() =>
  /** this React.lazy with await waitFor() just an example code to show the Splash*/
    React.lazy(() =>
      import("../../src/components/LoadingButton")
        .then(async (a) => {
          await waitFor()
          return a;
        })), []);
  return (
    <Suspense fallback={<Splash />}>
      <LoadingButton variant="contained" color="primary">Label</LoadingButton>
    </Suspense>
  )
};
//
const meta: Meta<typeof SplashComp> = {
  title: "Custom Component/Splash",
  component: SplashComp,
  tags: ["autodocs"],
  argTypes: {},
}
//
export default meta
