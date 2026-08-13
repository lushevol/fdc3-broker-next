import React from "react";
import type { Meta } from "@storybook/react-vite";
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { Loader } from "src/Root/import";
*/
import Loader from "../../src/components/Loader";
import { LoaderProps } from "../../src/components/Loader/common/type";
/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const Loader = Container.Loader.default;
export const LoaderProps = Container.LoaderProps.LoaderProps;
...
export default Container;
*/
export const LoaderComp = ({ text, size, ...rest }: LoaderProps) => (
  <Loader
    text={text || "Loading..."}
    size={size || "90px"}
    {...rest}
  />
);
//
const meta: Meta<typeof LoaderComp> = {
  title: "Custom Component/Loader",
  component: LoaderComp,
  tags: ["autodocs"],
  argTypes: {},
}
//
export default meta
