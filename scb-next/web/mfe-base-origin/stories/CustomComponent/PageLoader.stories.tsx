import React from "react";
import type { Meta } from "@storybook/react-vite";
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { PageLoader } from "src/Root/import";
*/
import PageLoader from "../../src/components/Loader/PageLoader";
import { LoaderProps } from "../../src/components/Loader/common/type";
/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const PageLoader = Container.PageLoader.default;
export const LoaderProps = Container.LoaderProps.LoaderProps;
...
export default Container;
*/
export const PageLoaderComp = ({ text, size, ...rest }: LoaderProps) => (
  <PageLoader
    text={text || "Loading..."}
    size={size || "90px"}
    {...rest}
  />
);
//
const meta: Meta<typeof PageLoaderComp> = {
  title: "Custom Component/PageLoader",
  component: PageLoaderComp,
  tags: ["autodocs"],
  argTypes: {},
}
//
export default meta
