import { render } from "@testing-library/react"
import CustomFormGroup from "./index";

it("render Custom form - empty", () => {
  const formConfig = [];
  render(<CustomFormGroup formConfig={formConfig} />);
})

it("render Custom form", () => {
  const formConfig = [
    {
      title: "Group A",
      row: [
        {
          itemConfig: [{ field: "field1", col: 8 }],
        },
      ],
      childGroup: [
        {
          title: "Child A",
          row: [
            {
              itemConfig: [{ field: "field2", col: 12 }],
            },
          ],
        },
      ],
    },
    {
      title: "Group B",
      row: [
        {
          childGroup: [
            {
              title: "Child B",
              row: [
                {
                  itemConfig: [{ field: "field3" }],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  render(<CustomFormGroup formConfig={formConfig} />);
})