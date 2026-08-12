import type { Meta } from "@storybook/react"
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { ErrorBoundry } from "src/Root/import";
*/
import ErrorBoundry from "../../src/components/ErrorBoundry"
/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const ErrorBoundry = Container.ErrorBoundry.default;
...
export default Container;
*/
const AnyComp = () => {
  throw new Error();
};
//
export const ErrorBoundryComp = () => (
  <ErrorBoundry emailSupport="khairul.anshar1@sc.com">
    <AnyComp />
  </ErrorBoundry>
);
//
const meta: Meta<typeof ErrorBoundryComp> = {
  title: "Custom Component/ErrorBoundry",
  component: ErrorBoundryComp,
  tags: ["autodocs"],
  argTypes: {},
}
//
export default meta
