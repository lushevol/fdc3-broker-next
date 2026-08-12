import type { Meta } from "@storybook/react"
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { Input } from "src/Root/import";
*/
import Input, { InputProps } from "../../src/components/Input"
/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const Input = Container.Input.default;
export const InputProps = Container.Input.InputProps;
...
export default Container;
*/

const meta: Meta<typeof Input> = {
  title: "Custom Input Component/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

export const InputTopLabelSmall: InputProps = {
  //@ts-ignore
  args: {
    labelPosition: "top",
    label: "label",
    size: "small",
  },
}

export const InputTopLabelMedium: InputProps = {
  //@ts-ignore
  args: {
    labelPosition: "top",
    label: "label",
    size: "medium",
  },
}

export const InputLeftLabelSmall: InputProps = {
  //@ts-ignore
  args: {
    labelPosition: "left",
    label: "label"
  },
}

export const InputLeftLabelMedium: InputProps = {
  //@ts-ignore
  args: {
    labelPosition: "left",
    label: "label",
    size: "medium",
  },
}

export const MultilineSmall: InputProps = {
  //@ts-ignore
  args: {
    labelPosition: "left",
    label: "label",
    size: "small",
    multiline: true,
    maxRows: 10,
  },
}

export const MultilineMedium: InputProps = {
  //@ts-ignore
  args: {
    labelPosition: "left",
    label: "label",
    size: "medium",
    multiline: true,
    maxRows: 10,
  },
}

export const MultilineTopSmall: InputProps = {
  //@ts-ignore
  args: {
    labelPosition: "top",
    label: "label",
    size: "small",
    multiline: true,
    maxRows: 10,
  },
}

export const MultilineTopMedium: InputProps = {
  //@ts-ignore
  args: {
    labelPosition: "top",
    label: "label",
    size: "medium",
    multiline: true,
    maxRows: 10,
  },
}